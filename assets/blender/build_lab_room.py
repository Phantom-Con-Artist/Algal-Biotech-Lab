"""
The lab room for the scroll tour, built from the six photographs in src/assets/lab.

Run inside Blender (Text Editor or `blender -b -P`):  build(); bake(); export()

Layout, from the lab's hand-drawn plan and the photographs (Blender axes: +X east, +Y north, Z up; metres).
The entrance is in the south wall, right of centre, at the end of a long white corridor. One L-shaped wall
bench runs along the north wall (under the windows; microwave oven) and down the whole east wall (the
instrument bench with open shelving: stirrer hotplate, pipettes, electrophoresis power supply, mini
centrifuge). A long island bench runs east-west in front of the windows, its reagent rack on the western
part; a tall cupboard stands on the west wall at its end. The south-west is a glazed enclosure: the sterile
room with the laminar air-flow cabinet to the north, its door on the east face, and the utility room to the
south. The refrigerator stands outside it near the entrance; lit culture racks flank the entrance.

The room is drawn larger than it is, with a taller ceiling: an illustrative reconstruction.

Lighting is baked as plain irradiance (no surface colour) into one lightmap per set, stored on the
second UV layer, so the site keeps the material colours and can be regraded without a rebake.
"""

import math
import os
import random

import bmesh
import bpy
import numpy as np
from mathutils import Matrix, Vector

HERE = os.path.dirname(bpy.data.filepath) if bpy.data.filepath else os.path.join(os.getcwd(), "assets", "blender")
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "public", "models", "lab-room")

W, D, H = 14.0, 11.0, 3.8  # interior: x in [-7, 7], y in [-5.5, 5.5]
X0, X1, Y0, Y1 = -W / 2, W / 2, -D / 2, D / 2
TOP = 0.92  # bench top height

PALETTE = {
    "Wall": ("#F2F2EF", 0.6),
    "Ceiling": ("#F4F4F1", 0.9),
    "FloorTile": ("#D9D7CF", 0.55),
    "Olive": ("#8C8656", 0.5),
    "CabinetWhite": ("#EEECE5", 0.45),
    "Granite": ("#24282B", 0.25),
    "Steel": ("#C3C7C8", 0.35),
    "Graphite": ("#3B4045", 0.35),
    "Black": ("#1F2225", 0.5),
    "LaminarGrey": ("#DEE0DE", 0.4),
    "Duct": ("#BABDBD", 0.5),
    "WindowFrame": ("#5E6A5D", 0.5),
    "Fabric": ("#2B2E33", 0.8),
    "Amber": ("#8C4B1F", 0.2),
    "BottleClear": ("#DCE4E5", 0.2),
    "CapBlue": ("#2F5FA8", 0.4),
    "CapWhite": ("#F1F1EE", 0.4),
    "CapRed": ("#B23B2F", 0.4),
    "BoxBlue": ("#3F66AA", 0.6),
    "TubWhite": ("#F3F3F0", 0.4),
    "StirrerBlue": ("#3C74B9", 0.35),
    "Plant": ("#3F6B3A", 0.8),
    "Terracotta": ("#A9603F", 0.8),
    "TipYellow": ("#E7C14A", 0.4),
    "Fan": ("#E8E7E2", 0.5),
    "FloorGloss": ("#E6E6E2", 0.12),
    "Seam": ("#A9AEB0", 0.5),
}
GLASS = ("Glass", "#E8F2F3")
EMISSIVE = {"TubeLight": "#FFFFFF", "Display": "#8FE0B8", "Outside": None}

def lin(h):
    h = h.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c] + [1.0]


def principled(m):
    return next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")


def make_materials():
    for name, (hexc, rough) in PALETTE.items():
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        m.use_nodes = True
        b = principled(m)
        b.inputs["Base Color"].default_value = lin(hexc)
        b.inputs["Roughness"].default_value = rough
    name, hexc = GLASS
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = principled(m)
    b.inputs["Base Color"].default_value = lin(hexc)
    b.inputs["Roughness"].default_value = 0.04
    b.inputs["Transmission Weight"].default_value = 1.0
    b.inputs["IOR"].default_value = 1.45
    for name, hexc in (("Culture", "#4E9A3A"), ("Media", "#E48A9C"), ("Stain", "#3F6FC8"), ("Water", "#CFE3EA")):
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        m.use_nodes = True
        b = principled(m)
        b.inputs["Base Color"].default_value = lin(hexc)
        b.inputs["Roughness"].default_value = 0.1
        b.inputs["Transmission Weight"].default_value = 0.6
    for name, hexc in EMISSIVE.items():
        m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
        m.use_nodes = True
        b = principled(m)
        if hexc:
            b.inputs["Base Color"].default_value = lin(hexc)
            b.inputs["Emission Color"].default_value = lin(hexc)
            b.inputs["Emission Strength"].default_value = 6.0 if name == "TubeLight" else 2.0
    outside_material()


def outside_image():
    """What the windows look onto: a pale sky, the yellow and blue block opposite, and trees."""
    w, h = 1024, 512
    img = bpy.data.images.get("Outside") or bpy.data.images.new("Outside", w, h)
    y = np.linspace(0, 1, h)[:, None]
    x = np.linspace(0, 1, w)[None, :]
    sky = np.stack([0.80 + 0.12 * y, 0.87 + 0.08 * y, 0.95 + 0.04 * y], -1) * np.ones((h, w, 1))
    px = sky.copy()
    rnd = random.Random(7)
    # Buildings across the courtyard.
    cx = 0.0
    while cx < 1:
        bw = rnd.uniform(0.12, 0.26)
        top = rnd.uniform(0.42, 0.7)
        col = rnd.choice([(0.93, 0.80, 0.35), (0.88, 0.86, 0.80), (0.55, 0.70, 0.86), (0.93, 0.80, 0.35)])
        mask = (x >= cx) & (x < cx + bw) & (y < top)
        px[mask] = np.array(col)
        # Window rows on the block.
        win = mask & (np.mod(y * 22, 1) > 0.55) & (np.mod((x - cx) * 60, 1) > 0.35)
        px[win] = px[win] * 0.78
        cx += bw + rnd.uniform(0.0, 0.05)
    # Tree canopy in front, a band of soft blobs.
    for _ in range(46):
        tx, ty, r = rnd.random(), rnd.uniform(0.05, 0.32), rnd.uniform(0.04, 0.09)
        d = ((x - tx) * 2) ** 2 + (y - ty) ** 2
        m = d < r * r
        g = rnd.uniform(0.75, 1.0)
        px[m] = np.array([0.36 * g, 0.55 * g, 0.30 * g])
    px[(y < 0.08).repeat(w, 1)] = np.array([0.42, 0.56, 0.34])
    rgba = np.concatenate([np.clip(px, 0, 1), np.ones((h, w, 1))], -1)
    img.pixels.foreach_set(rgba.astype(np.float32).ravel())
    img.pack()
    return img


def outside_material():
    m = bpy.data.materials.get("Outside") or bpy.data.materials.new("Outside")
    m.use_nodes = True
    nt = m.node_tree
    b = principled(m)
    tex = next((n for n in nt.nodes if n.type == "TEX_IMAGE"), None) or nt.nodes.new("ShaderNodeTexImage")
    tex.image = outside_image()
    nt.links.new(tex.outputs["Color"], b.inputs["Base Color"])
    nt.links.new(tex.outputs["Color"], b.inputs["Emission Color"])
    b.inputs["Emission Strength"].default_value = 3.2


# ---------------------------------------------------------------- geometry


class Group:
    """One mesh object assembled from many primitives, with one material slot per material used."""

    def __init__(self, name):
        self.name = name
        self.bm = bmesh.new()
        self.mats = []
        self.smooth = set()

    def idx(self, mat):
        if mat not in self.mats:
            self.mats.append(mat)
        return self.mats.index(mat)

    def _finish(self, verts, mat, bevel=0.0, smooth=False):
        faces = {f for v in verts for f in v.link_faces}
        i = self.idx(mat)
        for f in faces:
            f.material_index = i
            f.smooth = smooth
        if bevel > 0:
            edges = list({e for v in verts for e in v.link_edges})
            res = bmesh.ops.bevel(self.bm, geom=list(verts) + edges, offset=bevel, offset_type="OFFSET", segments=1, profile=0.5, affect="EDGES", clamp_overlap=True)
            for f in res["faces"]:
                f.material_index = i
                f.smooth = False

    def box(self, mat, c, s, bevel=0.0, rot=None):
        M = Matrix.Translation(Vector(c)) @ (rot or Matrix.Identity(4)) @ Matrix.Diagonal((*s, 1.0))
        r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=M)
        self._finish(r["verts"], mat, bevel)

    def span(self, mat, x0, x1, y0, y1, z0, z1, bevel=0.0):
        self.box(mat, ((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2), (abs(x1 - x0), abs(y1 - y0), abs(z1 - z0)), bevel)

    def cyl(self, mat, c, r, depth, segs=16, r2=None, rot=None, smooth=True):
        M = Matrix.Translation(Vector(c)) @ (rot or Matrix.Identity(4))
        res = bmesh.ops.create_cone(self.bm, cap_ends=True, cap_tris=False, segments=segs, radius1=r, radius2=r if r2 is None else r2, depth=depth, matrix=M)
        verts = res["verts"]
        faces = {f for v in verts for f in v.link_faces}
        i = self.idx(mat)
        for f in faces:
            f.material_index = i
            f.smooth = smooth and len(f.verts) == 4

    def sphere(self, mat, c, r, scale=(1, 1, 1), segs=16):
        M = Matrix.Translation(Vector(c)) @ Matrix.Diagonal((*scale, 1.0))
        res = bmesh.ops.create_uvsphere(self.bm, u_segments=segs, v_segments=segs // 2, radius=r, matrix=M)
        i = self.idx(mat)
        for f in {f for v in res["verts"] for f in v.link_faces}:
            f.material_index = i
            f.smooth = True

    def build(self, collection):
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(bpy.data.materials[m])
        ob = bpy.data.objects.new(self.name, me)
        collection.objects.link(ob)
        return ob


rot_x = lambda a: Matrix.Rotation(math.radians(a), 4, "X")
rot_y = lambda a: Matrix.Rotation(math.radians(a), 4, "Y")
rot_z = lambda a: Matrix.Rotation(math.radians(a), 4, "Z")

WINDOWS = [(-4.8, -2.0), (-1.0, 1.8), (2.8, 5.6)]  # x spans on the north wall
SILL, HEAD = 1.02, 3.0


# The corridor that leads to the entrance, Lumon-white: low, narrow and long, so the room opens up.
CX0, CX1, CY0, CH = 2.6, 5.2, Y0 - 16.0, 3.0
DX0, DX1, DH = 3.3, 4.5, 2.45  # the entrance in the south wall
# Flush ceiling panels: (x, y, size x, size y, height).
PANELS = [(x, y, 1.8, 0.5, H) for x in (-5.25, -1.75, 1.75, 5.25) for y in (-3.3, 0.0, 3.3)] + [
    ((CX0 + CX1) / 2, y, 1.4, 0.32, CH) for y in np.arange(Y0 - 1.4, CY0 + 0.8, -2.0)
]


def seams_x(g: Group, x0, x1, y, z0, z1, out, pitch=1.2):
    """Panel cladding on a wall facing ±y: vertical reveals and a black shadow-gap skirting."""
    for x in np.arange(x0 + pitch, x1 - 0.1, pitch):
        g.span("Seam", x - 0.006, x + 0.006, y, y + out * 0.004, z0 + 0.08, z1)
    g.span("Black", x0, x1, y, y + out * 0.006, z0, z0 + 0.08)


def seams_y(g: Group, y0, y1, x, z0, z1, out, pitch=1.2):
    for y in np.arange(y0 + pitch, y1 - 0.1, pitch):
        g.span("Seam", x, x + out * 0.004, y - 0.006, y + 0.006, z0 + 0.08, z1)
    g.span("Black", x, x + out * 0.006, y0, y1, z0, z0 + 0.08)


def shell(g: Group, lamps: Group, outside: Group):
    T = 0.2
    g.span("FloorGloss", X0 - T, X1 + T, Y0 - T, Y1 + T, -0.1, 0)
    g.span("Ceiling", X0 - T, X1 + T, Y0 - T, Y1 + T, H, H + 0.1)
    # West and east walls.
    g.span("Wall", X0 - T, X0, Y0 - T, Y1 + T, 0, H)
    g.span("Wall", X1, X1 + T, Y0 - T, Y1 + T, 0, H)
    seams_y(g, Y0, Y1, X0, 0, H, 1)
    seams_y(g, Y0, Y1, X1, 0, H, -1)
    # South wall with the entrance, its doors standing open against the wall.
    g.span("Wall", X0, DX0, Y0 - T, Y0, 0, H)
    g.span("Wall", DX1, X1, Y0 - T, Y0, 0, H)
    g.span("Wall", DX0, DX1, Y0 - T, Y0, DH, H)
    seams_x(g, X0, DX0, Y0, 0, H, 1)
    seams_x(g, DX1, X1, Y0, 0, H, 1)
    for x in (DX0, DX1):
        g.span("Seam", x - 0.03, x + 0.03, Y0 - T, Y0 + 0.02, 0, DH)
    g.span("Seam", DX0 - 0.03, DX1 + 0.03, Y0 - T, Y0 + 0.02, DH - 0.03, DH + 0.03)
    w = (DX1 - DX0) / 2 - 0.03
    yd = Y0 - T - 0.02
    for hinge in (DX0 + 0.03, DX1 - 0.03):
        g.span("CabinetWhite", hinge - 0.025, hinge + 0.025, yd - w, yd, 0.02, DH - 0.04, 0.004)
        g.span("Glass", hinge - 0.03, hinge + 0.03, yd - w + 0.18, yd - 0.18, 1.3, 2.0)
        g.box("Steel", (hinge, yd - w + 0.1, 1.05), (0.07, 0.03, 0.24), 0.005)
    # North wall around the window openings.
    xs = [X0 - T]
    for a, b in WINDOWS:
        xs += [a, b]
    xs.append(X1 + T)
    for i in range(0, len(xs), 2):
        g.span("Wall", xs[i], xs[i + 1], Y1, Y1 + T, 0, H)
    for a, b in WINDOWS:
        g.span("Wall", a, b, Y1, Y1 + T, 0, SILL)
        g.span("Wall", a, b, Y1, Y1 + T, HEAD, H)
        g.span("Wall", a - 0.04, b + 0.04, Y1 - 0.08, Y1 + 0.02, SILL - 0.04, SILL)  # sill
        window(g, a, b)
    g.span("Black", X0, X1, Y1 - 0.006, Y1, 0, 0.08)
    # Ceiling: a fine tile grid with flush light panels.
    for x in np.arange(X0 + 0.6, X1, 0.6):
        g.span("Seam", x - 0.004, x + 0.004, Y0, Y1, H - 0.003, H)
    for y in np.arange(Y0 + 0.6, Y1, 0.6):
        g.span("Seam", X0, X1, y - 0.004, y + 0.004, H - 0.003, H)
    corridor(g)
    for x, y, sx, sy, z in PANELS:
        g.span("Steel", x - sx / 2 - 0.03, x + sx / 2 + 0.03, y - sy / 2 - 0.03, y + sy / 2 + 0.03, z - 0.008, z - 0.002)
        lamps.span("TubeLight", x - sx / 2, x + sx / 2, y - sy / 2, y + sy / 2, z - 0.012, z - 0.006)
    # The view outside the windows, washed bright like daylight glare.
    outside.span("Outside", -9, 9, Y1 + 2.6, Y1 + 2.65, -2, 6.5)


def corridor(g: Group):
    """The approach: a white corridor sixteen metres long, ending on the entrance."""
    T = 0.2
    y1 = Y0 - T
    g.span("FloorGloss", CX0 - T, CX1 + T, CY0 - T, y1, -0.1, 0)
    g.span("Ceiling", CX0 - T, CX1 + T, CY0 - T, y1, CH, CH + 0.1)
    g.span("Wall", CX0 - T, CX0, CY0 - T, y1, 0, CH)
    g.span("Wall", CX1, CX1 + T, CY0 - T, y1, 0, CH)
    g.span("Wall", CX0, CX1, CY0 - T, CY0, 0, CH)
    seams_y(g, CY0, y1, CX0, 0, CH, 1, pitch=1.0)
    seams_y(g, CY0, y1, CX1, 0, CH, -1, pitch=1.0)
    seams_x(g, CX0, CX1, CY0, 0, CH, 1, pitch=0.65)


def window(g: Group, a, b):
    """Frame, mullions, transom and the security grille, as in the photographs."""
    y = Y1 + 0.06
    f = "WindowFrame"
    g.span(f, a, b, y - 0.04, y + 0.04, SILL, SILL + 0.06)
    g.span(f, a, b, y - 0.04, y + 0.04, HEAD - 0.06, HEAD)
    g.span(f, a, a + 0.06, y - 0.04, y + 0.04, SILL, HEAD)
    g.span(f, b - 0.06, b, y - 0.04, y + 0.04, SILL, HEAD)
    g.span(f, a, b, y - 0.03, y + 0.03, 2.38, 2.43)
    n = max(2, round((b - a) / 0.75))
    for i in range(1, n):
        x = a + (b - a) * i / n
        g.span(f, x - 0.025, x + 0.025, y - 0.03, y + 0.03, SILL, HEAD)
    # Grille on the inside face.
    gy = Y1 - 0.02
    x = a + 0.12
    while x < b - 0.08:
        g.span(f, x - 0.008, x + 0.008, gy - 0.008, gy + 0.008, SILL + 0.06, HEAD - 0.06)
        x += 0.16
    for z in np.arange(SILL + 0.32, HEAD - 0.1, 0.42):
        g.span(f, a + 0.06, b - 0.06, gy - 0.01, gy + 0.01, z - 0.012, z + 0.012)


def cabinet_run(g: Group, x0, x1, y0, y1, face, pitch=0.62):
    """A wall or island bench: plinth, carcass, olive drawer fronts over white doors, black granite top."""
    g.span("Black", x0 + 0.06, x1 - 0.06, y0 + 0.06, y1 - 0.06, 0, 0.1)
    g.span("CabinetWhite", x0 + 0.02, x1 - 0.02, y0 + 0.02, y1 - 0.02, 0.1, TOP - 0.04, 0.004)
    g.span("Granite", x0 - 0.02, x1 + 0.02, y0 - 0.02, y1 + 0.02, TOP - 0.04, TOP, 0.008)
    for side in face:
        along_x = side in "ns"
        lo, hi = (x0, x1) if along_x else (y0, y1)
        n = max(1, round((hi - lo) / pitch))
        step = (hi - lo) / n
        plane = {"n": y1, "s": y0, "e": x1, "w": x0}[side]
        out = 1 if side in "ne" else -1
        for i in range(n):
            a, b = lo + i * step + 0.012, lo + (i + 1) * step - 0.012
            def front(mat, z0, z1, depth=0.022, inset=0.0):
                p0, p1 = sorted((plane, plane + out * depth))
                if along_x:
                    g.span(mat, a + inset, b - inset, p0, p1, z0, z1, 0.004)
                else:
                    g.span(mat, p0, p1, a + inset, b - inset, z0, z1, 0.004)
            front("Olive", TOP - 0.2, TOP - 0.055)
            front("CabinetWhite", 0.12, TOP - 0.22)
            # Handles: a steel bar on the drawer, a short upright on the door.
            hz = TOP - 0.13
            c = (a + b) / 2
            hp = plane + out * 0.035
            if along_x:
                g.box("Steel", (c, hp, hz), (0.12, 0.018, 0.018), 0.003)
                g.box("Steel", (b - 0.05, hp, 0.5), (0.018, 0.018, 0.1), 0.003)
            else:
                g.box("Steel", (hp, c, hz), (0.018, 0.12, 0.018), 0.003)
                g.box("Steel", (hp, b - 0.05, 0.5), (0.018, 0.018, 0.1), 0.003)


def wall_cabinets(g: Group, x0, x1, y0, y1, z0, z1, side):
    """Glass-fronted wall cupboards, olive and white in turn, with boxes on top."""
    g.span("CabinetWhite", x0, x1, y0, y1, z0, z1, 0.006)
    along_x = side in "ns"
    lo, hi = (x0, x1) if along_x else (y0, y1)
    n = max(1, round((hi - lo) / 0.62))
    step = (hi - lo) / n
    plane = {"n": y1, "s": y0, "e": x1, "w": x0}[side]
    out = 1 if side in "ne" else -1
    rnd = random.Random(int(x0 * 10 + y0))
    for i in range(n):
        a, b = lo + i * step + 0.01, lo + (i + 1) * step - 0.01
        p0, p1 = sorted((plane, plane + out * 0.025))
        q0, q1 = sorted((plane + out * 0.02, plane + out * 0.03))
        mat = "Olive" if i % 2 == 0 else "CabinetWhite"
        if along_x:
            g.span(mat, a, b, p0, p1, z0 + 0.02, z1 - 0.02, 0.004)
            g.span("Graphite", a + 0.08, b - 0.08, q0, q1, z0 + 0.14, z1 - 0.1)
        else:
            g.span(mat, p0, p1, a, b, z0 + 0.02, z1 - 0.02, 0.004)
            g.span("Graphite", q0, q1, a + 0.08, b - 0.08, z0 + 0.14, z1 - 0.1)
        if rnd.random() < 0.7:
            w = rnd.uniform(0.25, 0.45)
            c = (a + b) / 2 + rnd.uniform(-0.08, 0.08)
            hh = rnd.uniform(0.12, 0.26)
            box = rnd.choice(["BoxBlue", "CabinetWhite", "Olive"])
            if along_x:
                g.box(box, (c, (y0 + y1) / 2, z1 + hh / 2), (w, (y1 - y0) * 0.8, hh), 0.006)
            else:
                g.box(box, ((x0 + x1) / 2, c, z1 + hh / 2), ((x1 - x0) * 0.8, w, hh), 0.006)


def bottles(g: Group, x, y0, y1, z, rnd, depth=0.24):
    """A row of reagent bottles along y on a shelf at height z, in two staggered ranks."""
    y = y0
    while y < y1:
        r = rnd.uniform(0.028, 0.048)
        if rnd.random() < 0.12:  # a gap now and then, the way real shelves look
            y += rnd.uniform(0.08, 0.2)
            continue
        h = rnd.uniform(0.11, 0.21)
        bx = x + rnd.uniform(-depth / 3, depth / 3)
        body = rnd.choices(["Amber", "BottleClear", "CabinetWhite", "Amber"], [3, 3, 2, 1])[0]
        cap = rnd.choice(["CapBlue", "CapWhite", "CapRed", "Black", "CapBlue"])
        g.cyl(body, (bx, y + r, z + h / 2), r, h, 12)
        g.cyl(body, (bx, y + r, z + h + 0.012), r * 0.62, 0.024, 10, r2=r * 0.5)
        g.cyl(cap, (bx, y + r, z + h + 0.035), r * 0.52, 0.03, 10)
        y += 2 * r + rnd.uniform(0.004, 0.02)


def bottles_x(g: Group, y, x0, x1, z, rnd, depth=0.22):
    """A row of reagent bottles along x on a shelf at height z."""
    x = x0
    while x < x1:
        r = rnd.uniform(0.028, 0.048)
        if rnd.random() < 0.12:
            x += rnd.uniform(0.08, 0.2)
            continue
        h = rnd.uniform(0.11, 0.21)
        by = y + rnd.uniform(-depth / 3, depth / 3)
        body = rnd.choices(["Amber", "BottleClear", "CabinetWhite", "Amber"], [3, 3, 2, 1])[0]
        cap = rnd.choice(["CapBlue", "CapWhite", "CapRed", "Black", "CapBlue"])
        g.cyl(body, (x + r, by, z + h / 2), r, h, 12)
        g.cyl(body, (x + r, by, z + h + 0.012), r * 0.62, 0.024, 10, r2=r * 0.5)
        g.cyl(cap, (x + r, by, z + h + 0.035), r * 0.52, 0.03, 10)
        x += 2 * r + rnd.uniform(0.004, 0.02)


ISLAND = (-5.25, 3.65, 2.05, 3.35)


def island(g: Group, gw: Group, rnd):
    """The long island bench, parallel to the windows; its reagent rack stands on the western part."""
    x0, x1, y0, y1 = ISLAND
    yc = (y0 + y1) / 2
    cabinet_run(g, x0, x1, y0, y1, "ns")
    r0, r1 = x0 + 0.3, 0.3
    g.span("Olive", r0, r1, yc - 0.025, yc + 0.025, TOP, TOP + 0.86)
    for x in np.linspace(r0, r1, 6):
        g.span("CabinetWhite", x - 0.02, x + 0.02, yc - 0.34, yc + 0.34, TOP, TOP + 0.9, 0.004)
        g.span("Olive", x - 0.024, x + 0.024, yc - 0.345, yc + 0.345, TOP, TOP + 0.05)
    for z in (TOP + 0.38, TOP + 0.74):
        g.span("CabinetWhite", r0, r1, yc - 0.33, yc + 0.33, z - 0.02, z, 0.003)
        g.span("Olive", r0, r1, yc - 0.335, yc + 0.335, z - 0.045, z - 0.02)
        for side in (-1, 1):
            bottles_x(g, yc + side * 0.17, r0 + 0.05, r1 - 0.05, z, rnd)
    for side in (-1, 1):
        bottles_x(g, yc + side * 0.18, r0 + 0.05, r1 - 0.05, TOP, rnd, 0.2)
    g.span("CabinetWhite", r1 + 0.02, r1 + 0.03, yc - 0.12, yc + 0.12, TOP + 0.3, TOP + 0.7)  # taped notice
    # The open east end: trays, then a varied, tidy spread of glassware, cultures and media.
    for x in (0.75, 1.3):
        g.span("TubWhite", x - 0.24, x + 0.24, y0 + 0.15, y0 + 0.53, TOP, TOP + 0.15, 0.02)
    assortment(g, gw, 1.65, x1 - 0.15, y0 + 0.2, y0 + 0.45, TOP, rnd)
    assortment(g, gw, 0.45, x1 - 0.15, y1 - 0.42, y1 - 0.22, TOP, rnd)
    assortment(g, gw, 0.45, x1 - 0.15, yc - 0.1, yc + 0.1, TOP, rnd)
    for x in (-4.2, -2.4, -0.6, 1.2, 2.9):
        stool(g, x, y1 + 0.4)
    # The tall store cupboard on the west wall beside the island's end.
    g.span("CabinetWhite", X0, X0 + 0.62, 1.05, 3.15, 0, 2.3, 0.006)
    for k, (a, b) in enumerate(((1.07, 1.58), (1.6, 2.1), (2.12, 2.6), (2.62, 3.13))):
        g.span("Olive" if k % 2 == 0 else "CabinetWhite", X0 + 0.62, X0 + 0.645, a, b, 0.1, 2.25, 0.004)
        g.box("Steel", (X0 + 0.66, b - 0.06, 1.15), (0.02, 0.02, 0.22), 0.003)
    g.box("BoxBlue", (X0 + 0.31, 1.6, 2.42), (0.5, 0.5, 0.24), 0.008)
    g.box("CabinetWhite", (X0 + 0.31, 2.45, 2.4), (0.5, 0.6, 0.2), 0.008)


def beaker(gw: Group, x, y, z, rnd):
    r = rnd.uniform(0.035, 0.055)
    h = rnd.uniform(0.08, 0.14)
    gw.cyl("Glass", (x, y, z + h / 2), r, h, 16)
    if rnd.random() < 0.6:
        gw.cyl(rnd.choice(["Culture", "Culture", "BottleClear"]), (x, y, z + h * 0.25), r * 0.92, h * 0.45, 16)


def stool(g: Group, x, y):
    g.cyl("Black", (x, y, 0.32), 0.02, 0.6, 8)
    g.cyl("Black", (x, y, 0.02), 0.2, 0.04, 16, r2=0.16)
    g.cyl("Black", (x, y, 0.3), 0.15, 0.015, 16)
    g.cyl("Fabric", (x, y, 0.64), 0.17, 0.06, 20)


def culture_racks(g: Group, gw: Group, lamps: Group, rnd):
    """Lit growth racks for the algal cultures, either side of the entrance: steel shelves, a lamp under each."""
    for xa, xb in ((1.85, 3.15), (4.65, 6.1)):
        y0, y1 = Y0 + 0.05, Y0 + 0.6
        for x in (xa, xb):
            for y in (y0, y1):
                g.span("Steel", x - 0.02, x + 0.02, y - 0.02, y + 0.02, 0, 2.05)
        for z in (0.12, 0.62, 1.12, 1.62):
            g.span("Steel", xa, xb, y0, y1, z - 0.025, z, 0.003)
            if z > 0.2:
                lamps.cyl("TubeLight", ((xa + xb) / 2, (y0 + y1) / 2, z + 0.45), 0.014, xb - xa - 0.2, 8, rot=rot_y(90))
            n = 6
            for k in range(n):
                fx = xa + 0.12 + k * (xb - xa - 0.24) / (n - 1)
                fy = y0 + 0.17 + (k % 2) * 0.2
                flask(gw, fx, fy, z, rnd.uniform(0.95, 1.2), culture=True)
        g.span("Steel", xa, xb, y0, y1, 2.03, 2.06)


def flask(gw: Group, x, y, z, s=1.0, culture=True):
    """An Erlenmeyer flask; a culture flask carries green medium and a cotton plug."""
    gw.cyl("Glass", (x, y, z + 0.075 * s), 0.065 * s, 0.15 * s, 18, r2=0.02 * s)
    gw.cyl("Glass", (x, y, z + 0.18 * s), 0.02 * s, 0.07 * s, 12)
    if culture:
        gw.cyl("Culture", (x, y, z + 0.035 * s), 0.058 * s, 0.065 * s, 18, r2=0.042 * s)
        gw.cyl("CapWhite", (x, y, z + 0.225 * s), 0.021 * s, 0.03 * s, 10)


def north_bench(g: Group, gw: Group, rnd):
    cabinet_run(g, X0 + 0.05, X1 - 0.78, Y1 - 0.75, Y1, "s")
    wall_cabinets(g, X0 + 0.25, WINDOWS[0][0] - 0.3, Y1 - 0.38, Y1, 1.95, 2.7, "s")
    for (a, _), (_, b) in zip(WINDOWS[1:], WINDOWS[:-1]):
        wall_cabinets(g, b + 0.12, a - 0.12, Y1 - 0.36, Y1, 1.95, 2.65, "s")
    g.span("TubWhite", -0.4, 0.1, Y1 - 0.6, Y1 - 0.2, TOP, TOP + 0.13, 0.02)
    for x in (-4.0, -3.85, -3.7):
        g.cyl(rnd.choice(["Amber", "BottleClear"]), (x, Y1 - 0.35, TOP + 0.1), 0.045, 0.2, 12)
    g.box("Fabric", (5.9, Y1 - 0.35, TOP + 0.13), (0.38, 0.22, 0.26), 0.05)
    assortment(g, gw, -5.25, -4.2, Y1 - 0.6, Y1 - 0.3, TOP, rnd)
    assortment(g, gw, -3.4, -1.85, Y1 - 0.6, Y1 - 0.3, TOP, rnd)
    assortment(g, gw, 2.45, 3.85, Y1 - 0.6, Y1 - 0.3, TOP, rnd)
    assortment(g, gw, 4.6, 5.6, Y1 - 0.6, Y1 - 0.3, TOP, rnd)
    chair(g, -3.4, Y1 - 1.2, 180)
    chair(g, 1.0, Y1 - 1.25, 200)


def chair(g: Group, x, y, yaw):
    R = rot_z(yaw)
    def at(dx, dy, dz):
        return Vector((x, y, 0)) + (R @ Vector((dx, dy, dz)))
    g.cyl("Black", tuple(at(0, 0, 0.25)), 0.025, 0.4, 8)
    for k in range(5):
        a = k * 2 * math.pi / 5
        g.box("Black", tuple(at(math.cos(a) * 0.17, math.sin(a) * 0.17, 0.05)), (0.34, 0.04, 0.03), 0.008, rot=R @ rot_z(math.degrees(a)))
        g.sphere("Black", tuple(at(math.cos(a) * 0.32, math.sin(a) * 0.32, 0.025)), 0.025, segs=8)
    g.box("Fabric", tuple(at(0, 0, 0.48)), (0.48, 0.46, 0.08), 0.03, rot=R)
    g.box("Fabric", tuple(at(0, 0.24, 0.8)), (0.44, 0.06, 0.52), 0.03, rot=R @ rot_x(-8))
    g.box("Black", tuple(at(0, 0.2, 0.55)), (0.06, 0.04, 0.16), 0.01, rot=R)


def east_bench(g: Group, gw: Group, rnd):
    x0, x1, y0, y1 = X1 - 0.78, X1, Y0 + 0.05, Y1 - 0.75
    cabinet_run(g, x0, x1, y0, y1, "w")
    s0 = x1 - 0.34
    ups = np.linspace(y0 + 0.1, y1 - 0.1, 8)
    for y in ups:
        g.span("Olive", s0, x1, y - 0.02, y + 0.02, TOP, TOP + 1.1, 0.004)
    for z in (TOP + 0.42, TOP + 0.84):
        g.span("CabinetWhite", s0, x1, ups[0], ups[-1], z - 0.022, z, 0.003)
        g.span("Olive", s0 - 0.005, s0 + 0.012, ups[0], ups[-1], z - 0.06, z - 0.022)
    for z in (TOP + 0.42, TOP + 0.84):
        y = ups[0] + 0.1
        while y < ups[-1] - 0.3:
            if rnd.random() < 0.45:
                w = rnd.uniform(0.22, 0.36)
                h = rnd.uniform(0.14, 0.26)
                g.box(rnd.choice(["BoxBlue", "CabinetWhite", "BoxBlue", "Olive"]), (s0 + 0.16, y + w / 2, z + h / 2), (0.26, w, h), 0.008)
                y += w + rnd.uniform(0.03, 0.15)
            elif rnd.random() < 0.5:
                for k in range(rnd.randint(2, 5)):
                    r = 0.03
                    g.cyl(rnd.choice(["Amber", "BottleClear", "CabinetWhite"]), (s0 + 0.15, y + r, z + 0.07), r, 0.14, 10)
                    g.cyl(rnd.choice(["CapBlue", "CapWhite"]), (s0 + 0.15, y + r, z + 0.155), r * 0.5, 0.03, 8)
                    y += 2 * r + 0.01
                y += 0.1
            else:
                y += rnd.uniform(0.15, 0.4)
    g.cyl("Terracotta", (s0 + 0.16, -3.9, TOP + 0.84 + 0.05), 0.06, 0.1, 12, r2=0.05)
    g.cyl("Plant", (s0 + 0.16, -3.9, TOP + 0.84 + 0.25), 0.075, 0.32, 12, r2=0.01)
    wall_cabinets(g, X1 - 0.38, X1, 2.4, Y1 - 0.8, 2.15, 2.85, "w")
    for a, b in ((-5.3, -4.6), (-2.6, -2.0), (1.25, 1.65), (2.25, 2.75), (3.4, 4.6)):
        y = a
        while y < b:
            kind = rnd.choice(["duran", "flask", "tubes", "beaker", "petri"])
            x = EB + rnd.uniform(-0.12, 0.05)
            if kind == "duran":
                duran(gw, g, x, y + 0.05, TOP, rnd)
            elif kind == "flask":
                flask(gw, x, y + 0.07, TOP, 0.9, culture=True)
            elif kind == "tubes":
                tube_rack(g, gw, x, y + 0.16, TOP, rnd, along_x=False)
                y += 0.2
            elif kind == "beaker":
                beaker(gw, x, y + 0.06, TOP, rnd)
            else:
                petri(g, gw, x, y + 0.05, TOP, rnd)
            y += 0.14
    chair(g, X1 - 1.25, -3.6, 280)
    chair(g, X1 - 1.3, 3.2, 255)


ROOM = (X0, 0.9, Y0, 0.9)  # the glazed enclosure in the south-west: sterile room north, utility room south
SPLIT = -2.64
EAST_DOOR = (-1.15, -0.2)
SPLIT_DOOR = (-0.75, 0.25)


def glazed(g: Group, glass: Group, along_x, fixed, a, b, door=None, zt=2.75, zm=1.08):
    """A glazed partition: olive posts and rails, white panels below, glass above, an opening for a door."""
    f = "Olive"
    segs = [(a, b)] if not door else [(a, door[0]), (door[1], b)]

    def box(mat, grp, u0, u1, z0, z1, t):
        if along_x:
            grp.span(mat, u0, u1, fixed - t, fixed + t, z0, z1)
        else:
            grp.span(mat, fixed - t, fixed + t, u0, u1, z0, z1)

    for s0, s1 in segs:
        for p in np.linspace(s0, s1, max(2, round((s1 - s0) / 1.1) + 1)):
            box(f, g, p - 0.035, p + 0.035, 0, zt, 0.035)
        for z0, z1 in ((0, 0.08), (zm - 0.04, zm + 0.04), (zt - 0.07, zt)):
            box(f, g, s0, s1, z0, z1, 0.03)
        box("CabinetWhite", g, s0, s1, 0.08, zm - 0.04, 0.012)
        box("Glass", glass, s0, s1, zm + 0.04, zt - 0.07, 0.006)
    if door:
        box(f, g, door[0], door[1], zt - 0.07, zt, 0.035)


def door_leaf(g: Group, glass: Group, hinge, w, angle, zt=2.75, zm=1.08):
    """An open glazed door leaf, hinged at `hinge` and swung `angle` degrees from the +x direction."""
    R = rot_z(angle)
    h = Vector(hinge)

    def leaf(mat, grp, u0, u1, z0, z1, t=0.04):
        c = h + R @ Vector(((u0 + u1) / 2, 0, (z0 + z1) / 2))
        grp.box(mat, tuple(c), (u1 - u0, t, z1 - z0), 0.0, rot=R)

    f = "Olive"
    leaf(f, g, 0, w, 0.02, 0.08)
    leaf(f, g, 0, w, zm - 0.04, zm + 0.04)
    leaf(f, g, 0, w, zt - 0.14, zt - 0.08)
    leaf(f, g, 0, 0.05, 0.02, zt - 0.08)
    leaf(f, g, w - 0.05, w, 0.02, zt - 0.08)
    leaf("CabinetWhite", g, 0.05, w - 0.05, 0.08, zm - 0.04, 0.02)
    leaf("Glass", glass, 0.05, w - 0.05, zm + 0.04, zt - 0.14, 0.012)


def enclosure(g: Group, gw: Group, glass: Group, rnd):
    x0, x1, y0, y1 = ROOM
    glazed(g, glass, True, y1, x0, x1)
    glazed(g, glass, False, x1, y0, y1, EAST_DOOR)
    glazed(g, glass, True, SPLIT, x0, x1, SPLIT_DOOR)
    # The sterile room's door stands open into the room; the utility door stands open into the utility room.
    door_leaf(g, glass, (x1 - 0.03, EAST_DOOR[1] - 0.02, 0), EAST_DOOR[1] - EAST_DOOR[0] - 0.04, 200)
    door_leaf(g, glass, (SPLIT_DOOR[0] + 0.02, SPLIT - 0.03, 0), SPLIT_DOOR[1] - SPLIT_DOOR[0] - 0.04, -70)
    # Sterile room: a stool before the cabinet and a side table with racks of tubes.
    stool(g, -4.3, -0.7)
    g.span("Steel", -3.2, -2.2, 0.35, 0.85, 0.74, 0.78, 0.004)
    for x in (-3.15, -2.25):
        for y in (0.4, 0.8):
            g.span("Steel", x - 0.015, x + 0.015, y - 0.015, y + 0.015, 0, 0.74)
    for k in range(5):
        g.box(rnd.choice(["CapBlue", "TipYellow", "BoxBlue"]), (-3.0 + k * 0.17, 0.6, 0.83), (0.12, 0.16, 0.09), 0.006)
    # Utility room: sink counter along the south wall, a tall cupboard, carboys of water.
    cabinet_run(g, x0 + 0.05, -1.2, y0, y0 + 0.7, "n")
    g.span("Steel", -4.3, -3.5, y0 + 0.12, y0 + 0.58, TOP - 0.2, TOP + 0.005, 0.01)
    g.cyl("Steel", (-3.9, y0 + 0.1, TOP + 0.18), 0.015, 0.36, 8)
    g.cyl("Steel", (-3.9, y0 + 0.2, TOP + 0.35), 0.012, 0.22, 8, rot=rot_x(90))
    wall_cabinets(g, x0 + 0.25, -1.5, y0, y0 + 0.36, 1.85, 2.55, "n")
    g.span("CabinetWhite", x0, x0 + 0.62, -4.4, -3.0, 0, 2.3, 0.006)
    g.span("Olive", x0 + 0.62, x0 + 0.645, -4.38, -3.72, 0.1, 2.25, 0.004)
    g.span("CabinetWhite", x0 + 0.62, x0 + 0.645, -3.7, -3.02, 0.1, 2.25, 0.004)
    for x in (-0.7, -0.3, 0.1):
        gw.cyl("Glass", (x, y0 + 0.45, 0.22), 0.15, 0.44, 20)
        gw.cyl("BottleClear", (x, y0 + 0.45, 0.17), 0.14, 0.32, 20)
        g.cyl("CapBlue", (x, y0 + 0.45, 0.48), 0.04, 0.06, 12)
    for k in range(4):
        g.span(rnd.choice(["TubWhite", "BoxBlue"]), -2.6 + k * 0.32, -2.32 + k * 0.32, y0 + 0.2, y0 + 0.5, TOP, TOP + rnd.uniform(0.1, 0.3), 0.01)


def laminar(g: Group, glass: Group):
    """Vertical laminar air-flow cabinet on its stand, facing the sterile room's door."""
    xb, xf = -5.85, -5.05
    y0, y1 = -1.45, 0.05
    for x in (xb + 0.05, xf - 0.05):
        for y in (y0 + 0.05, y1 - 0.05):
            g.span("Black", x - 0.02, x + 0.02, y - 0.02, y + 0.02, 0.06, 0.78)
            g.sphere("Black", (x, y, 0.035), 0.035, segs=8)
    g.span("Black", xb, xf, y0, y1, 0.74, 0.8)
    g.span("Black", xb + 0.05, xf - 0.05, y0 + 0.05, y1 - 0.05, 0.25, 0.28)
    g.span("Steel", xb, xf, y0, y1, 0.8, 0.86)
    g.span("LaminarGrey", xb, xb + 0.06, y0, y1, 0.86, 1.48)
    g.span("LaminarGrey", xb, xf, y0, y0 + 0.05, 0.86, 1.48)
    g.span("LaminarGrey", xb, xf, y1 - 0.05, y1, 0.86, 1.48)
    g.span("Black", xb + 0.1, xf - 0.08, y0 + 0.08, y1 - 0.08, 0.86, 0.88)
    glass.box("Glass", (xf - 0.06, (y0 + y1) / 2, 1.18), (0.012, y1 - y0 - 0.1, 0.62), rot=rot_y(-8))
    g.span("LaminarGrey", xb, xf + 0.02, y0, y1, 1.48, 2.2, 0.01)
    g.span("Steel", xf + 0.015, xf + 0.03, y0 + 0.04, y1 - 0.04, 1.48, 1.56)
    g.span("Black", xf + 0.02, xf + 0.026, -0.95, -0.45, 1.92, 1.99)
    g.span("Black", xf + 0.02, xf + 0.026, y0 + 0.06, y0 + 0.24, 2.08, 2.15)
    g.cyl("Steel", (xf + 0.03, -0.7, 1.7), 0.045, 0.02, 16, rot=rot_y(90))
    g.cyl("Black", (xf + 0.04, -0.7, 1.7), 0.035, 0.005, 16, rot=rot_y(90))
    g.span("Black", xf + 0.02, xf + 0.026, -0.4, -0.22, 1.66, 1.74)


def fridge(g: Group):
    """Double-door refrigerator outside the glazed room, south of its door, facing east."""
    x0, x1, y0, y1 = 0.97, 1.75, -3.6, -2.75
    g.span("Graphite", x0, x1, y0, y1, 0.04, 1.82, 0.03)
    g.span("Black", x0, x1 + 0.005, y0 + 0.01, y1 - 0.01, 1.24, 1.255)
    for z0, z1 in ((0.6, 1.1), (1.38, 1.65)):
        g.span("Steel", x1 + 0.005, x1 + 0.03, y1 - 0.11, y1 - 0.08, z0, z1, 0.005)
    g.span("Black", x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, 0, 0.04)
    g.span("CabinetWhite", x1, x1 + 0.004, y0 + 0.12, y0 + 0.24, 1.5, 1.72)


def oven(g: Group):
    cx, cy = 4.2, Y1 - 0.38
    g.box("Black", (cx, cy, TOP + 0.17), (0.56, 0.42, 0.34), 0.02)
    g.span("Graphite", cx - 0.25, cx + 0.1, cy - 0.215, cy - 0.205, TOP + 0.04, TOP + 0.3)
    g.cyl("Steel", (cx + 0.18, cy - 0.215, TOP + 0.12), 0.03, 0.02, 16, rot=rot_x(90))


def display(lamps: Group, c, s):
    lamps.box("Display", c, s)


def stirrer(g: Group, gw: Group, lamps: Group, desk: Group, screens: Group):
    cx, cy = X1 - 0.42, -3.0
    g.box("StirrerBlue", (cx, cy, TOP + 0.055), (0.24, 0.34, 0.11), 0.02)
    g.box("CabinetWhite", (cx - 0.122, cy, TOP + 0.06), (0.006, 0.2, 0.06), 0.002)
    g.box("Steel", (cx + 0.02, cy, TOP + 0.115), (0.19, 0.19, 0.012), 0.004)
    for dy in (-0.05, 0.05):
        g.cyl("Black", (cx - 0.125, cy + dy, TOP + 0.04), 0.016, 0.02, 12, rot=rot_y(90))
    display(lamps, (cx - 0.126, cy - 0.11, TOP + 0.07), (0.004, 0.04, 0.02))
    gw.cyl("Glass", (cx + 0.02, cy, TOP + 0.18), 0.05, 0.12, 18)
    gw.cyl("Culture", (cx + 0.02, cy, TOP + 0.155), 0.046, 0.07, 18)
    # A laptop at the end of the bench, used to log the run.
    lx, ly = X1 - 0.45, -4.3
    desk.box("Graphite", (lx, ly, TOP + 0.01), (0.25, 0.36, 0.018), 0.006)
    desk.box("Graphite", (lx + 0.13, ly, TOP + 0.13), (0.015, 0.36, 0.24), 0.006, rot=rot_y(-12))
    screens.box("Display", (lx + 0.118, ly, TOP + 0.13), (0.003, 0.32, 0.2), rot=rot_y(-12))


def pipettes(g: Group):
    cx, cy = X1 - 0.5, -1.6
    g.box("CabinetWhite", (cx, cy, TOP + 0.015), (0.16, 0.3, 0.03), 0.01)
    g.cyl("CabinetWhite", (cx + 0.04, cy, TOP + 0.2), 0.012, 0.36, 10)
    g.box("CabinetWhite", (cx + 0.02, cy, TOP + 0.36), (0.05, 0.3, 0.02), 0.005)
    cols = ["CapBlue", "TipYellow", "CapRed", "CapWhite"]
    for k, dy in enumerate((-0.11, -0.04, 0.04, 0.11)):
        g.cyl("CabinetWhite", (cx, cy + dy, TOP + 0.24), 0.014, 0.22, 10, r2=0.006, rot=rot_y(8))
        g.cyl(cols[k], (cx - 0.015, cy + dy, TOP + 0.37), 0.012, 0.03, 10)
    # Tip boxes beside the stand.
    for k, (dy, c) in enumerate(((0.3, "TipYellow"), (0.48, "CapBlue"))):
        g.box("BottleClear", (cx - 0.02, cy + dy, TOP + 0.04), (0.12, 0.14, 0.08), 0.008)
        g.box(c, (cx - 0.02, cy + dy, TOP + 0.085), (0.12, 0.14, 0.012), 0.004)


def power_supply(g: Group, lamps: Group):
    cx, cy = X1 - 0.45, 0.6
    g.box("LaminarGrey", (cx, cy, TOP + 0.07), (0.28, 0.34, 0.14), 0.012)
    g.box("Steel", (cx - 0.142, cy, TOP + 0.07), (0.006, 0.3, 0.11), 0.003)
    display(lamps, (cx - 0.146, cy - 0.05, TOP + 0.09), (0.004, 0.12, 0.035))
    for dy, col in ((0.07, "CapRed"), (0.11, "Black"), (0.07, "CapRed")):
        pass
    for dy, col in ((0.06, "CapRed"), (0.1, "Black")):
        g.cyl(col, (cx - 0.15, cy + dy, TOP + 0.04), 0.01, 0.02, 10, rot=rot_y(90))
    g.cyl("Black", (cx - 0.15, cy + 0.1, TOP + 0.1), 0.018, 0.02, 12, rot=rot_y(90))
    # Leads running back to the wall.
    for dy, col in ((0.06, "CapRed"), (0.1, "Black")):
        a = Vector((cx - 0.16, cy + dy, TOP + 0.04))
        b = Vector((X1 - 0.05, cy + dy + 0.3, TOP + 0.3))
        d = b - a
        g.cyl(col, tuple((a + b) / 2), 0.004, d.length, 6, rot=d.to_track_quat("Z", "Y").to_matrix().to_4x4())


def centrifuge(g: Group, lamps: Group):
    cx, cy = X1 - 0.45, 1.9
    g.cyl("CabinetWhite", (cx, cy, TOP + 0.05), 0.13, 0.1, 28, r2=0.125)
    g.sphere("CabinetWhite", (cx, cy, TOP + 0.1), 0.12, scale=(1, 1, 0.45), segs=24)
    g.box("CabinetWhite", (cx - 0.14, cy, TOP + 0.04), (0.06, 0.12, 0.06), 0.01)
    display(lamps, (cx - 0.171, cy, TOP + 0.05), (0.003, 0.06, 0.022))
    g.cyl("Steel", (cx, cy, TOP + 0.155), 0.02, 0.01, 12)


# ---------------------------------------------------------------- glassware

LIQUIDS = ["Culture", "Culture", "Media", "Stain", "Water", "Water"]


def liquid(gw: Group, rnd, c, r, h, r2=None):
    gw.cyl(rnd.choice(LIQUIDS), c, r, h, 16, r2=r2)


def duran(gw: Group, g: Group, x, y, z, rnd, s=1.0):
    """Media bottle with a blue screw cap."""
    r, h = 0.045 * s, 0.15 * s
    gw.cyl("Glass", (x, y, z + h / 2), r, h, 18)
    gw.cyl("Glass", (x, y, z + h + 0.02 * s), r * 0.55, 0.04 * s, 14, r2=r * 0.45)
    liquid(gw, rnd, (x, y, z + h * 0.32), r * 0.92, h * 0.6)
    g.cyl("CapBlue", (x, y, z + h + 0.05 * s), r * 0.5, 0.03 * s, 12)


def cylinder(gw: Group, g: Group, x, y, z, rnd, s=1.0):
    """Graduated cylinder on its hexagonal foot."""
    h = 0.3 * s
    g.cyl("BottleClear", (x, y, z + 0.006), 0.04 * s, 0.012, 6)
    gw.cyl("Glass", (x, y, z + 0.012 + h / 2), 0.018 * s, h, 14)
    liquid(gw, rnd, (x, y, z + 0.012 + h * 0.3), 0.016 * s, h * 0.55)


def volumetric(gw: Group, g: Group, x, y, z, rnd, s=1.0):
    """Volumetric flask: a round bulb with a long neck and a stopper."""
    gw.sphere("Glass", (x, y, z + 0.06 * s), 0.06 * s, scale=(1, 1, 0.95), segs=14)
    gw.cyl("Glass", (x, y, z + 0.17 * s), 0.012 * s, 0.14 * s, 10)
    gw.sphere(rnd.choice(LIQUIDS), (x, y, z + 0.05 * s), 0.052 * s, scale=(1, 1, 0.8), segs=12)
    g.cyl(rnd.choice(["CapWhite", "CapBlue"]), (x, y, z + 0.25 * s), 0.014 * s, 0.025 * s, 8)


def petri(g: Group, gw: Group, x, y, z, rnd):
    """A stack of Petri dishes, some with green colonies on agar."""
    n = rnd.randint(3, 7)
    for k in range(n):
        zz = z + 0.008 + k * 0.016
        gw.cyl("Glass", (x, y, zz), 0.045, 0.015, 20)
        gw.cyl(rnd.choice(["Media", "Water", "Culture"]), (x, y, zz - 0.002), 0.042, 0.006, 18)


def tube_rack(g: Group, gw: Group, x, y, z, rnd, along_x=True):
    """A rack of test tubes with coloured caps."""
    w, d = (0.3, 0.1) if along_x else (0.1, 0.3)
    g.box(rnd.choice(["CapBlue", "TipYellow", "CabinetWhite", "CapRed"]), (x, y, z + 0.035), (w, d, 0.07), 0.006)
    n = 6
    for k in range(n):
        u = -0.12 + k * 0.048
        tx, ty = (x + u, y) if along_x else (x, y + u)
        gw.cyl("Glass", (tx, ty, z + 0.08), 0.008, 0.13, 8)
        liquid(gw, rnd, (tx, ty, z + 0.05), 0.007, 0.06)
        g.cyl(rnd.choice(["CapRed", "CapBlue", "CapWhite"]), (tx, ty, z + 0.15), 0.009, 0.015, 8)


def wash_bottle(g: Group, x, y, z, rnd):
    g.cyl(rnd.choice(["TubWhite", "Water"]), (x, y, z + 0.09), 0.04, 0.18, 14)
    g.cyl("CapRed", (x, y, z + 0.19), 0.02, 0.025, 10)
    g.cyl("TubWhite", (x + 0.03, y, z + 0.23), 0.004, 0.09, 6, rot=rot_y(40))


def funnel(gw: Group, x, y, z):
    gw.cyl("Glass", (x, y, z + 0.13), 0.06, 0.08, 16, r2=0.008)
    gw.cyl("Glass", (x, y, z + 0.05), 0.007, 0.1, 8)


def assortment(g: Group, gw: Group, x0, x1, y0, y1, z, rnd):
    """Fills a strip of bench top with a mixed, tidy assortment of glassware and plastics."""
    x = x0
    while x < x1 - 0.06:
        kind = rnd.choices(["flask", "beaker", "duran", "cylinder", "volumetric", "petri", "tubes", "wash", "funnel", "gap"], [5, 4, 4, 2, 2, 2, 2, 1, 1, 1])[0]
        y = rnd.uniform(y0, y1)
        s = rnd.uniform(0.8, 1.25)
        if kind == "flask":
            flask(gw, x + 0.07, y, z, s, culture=rnd.random() < 0.7)
            x += 0.15 * s
        elif kind == "beaker":
            beaker(gw, x + 0.06, y, z, rnd)
            x += 0.13
        elif kind == "duran":
            duran(gw, g, x + 0.05, y, z, rnd, s)
            x += 0.11 * s
        elif kind == "cylinder":
            cylinder(gw, g, x + 0.04, y, z, rnd, s)
            x += 0.09
        elif kind == "volumetric":
            volumetric(gw, g, x + 0.06, y, z, rnd, s)
            x += 0.13 * s
        elif kind == "petri":
            petri(g, gw, x + 0.05, y, z, rnd)
            x += 0.1
        elif kind == "tubes":
            tube_rack(g, gw, x + 0.16, y, z, rnd)
            x += 0.33
        elif kind == "wash":
            wash_bottle(g, x + 0.04, y, z, rnd)
            x += 0.1
        elif kind == "funnel":
            funnel(gw, x + 0.06, y, z)
            x += 0.13
        else:
            x += rnd.uniform(0.1, 0.25)
        x += rnd.uniform(0.0, 0.03)


# ---------------------------------------------------------------- more instruments

NB = Y1 - 0.38  # centre line of the north bench
EB = X1 - 0.45  # centre line of the east bench


def balance(g: Group, glass: Group, lamps: Group):
    cx, cy = -6.2, NB
    g.box("CabinetWhite", (cx, cy, TOP + 0.04), (0.24, 0.36, 0.08), 0.01)
    g.box("CabinetWhite", (cx, cy + 0.04, TOP + 0.09), (0.22, 0.24, 0.02), 0.004)
    g.cyl("Steel", (cx, cy + 0.04, TOP + 0.105), 0.05, 0.006, 18)
    glass.box("Glass", (cx, cy + 0.04, TOP + 0.2), (0.21, 0.23, 0.2))
    g.box("Steel", (cx, cy + 0.04, TOP + 0.305), (0.22, 0.24, 0.01), 0.002)
    display(lamps, (cx, cy - 0.181, TOP + 0.05), (0.1, 0.003, 0.025))


def ph_meter(g: Group, gw: Group, lamps: Group):
    cx, cy = -5.55, NB
    g.box("CabinetWhite", (cx, cy, TOP + 0.035), (0.18, 0.2, 0.07), 0.012, rot=rot_x(-6))
    display(lamps, (cx, cy - 0.06, TOP + 0.075), (0.1, 0.05, 0.003))
    g.cyl("Steel", (cx + 0.12, cy + 0.05, TOP + 0.2), 0.008, 0.4, 8)
    g.box("Black", (cx + 0.08, cy + 0.05, TOP + 0.3), (0.1, 0.02, 0.02), 0.004)
    g.cyl("Black", (cx + 0.04, cy + 0.05, TOP + 0.2), 0.008, 0.16, 8)
    gw.cyl("Glass", (cx + 0.04, cy + 0.05, TOP + 0.05), 0.035, 0.1, 16)
    gw.cyl("Stain", (cx + 0.04, cy + 0.05, TOP + 0.03), 0.032, 0.05, 16)


def spectro(g: Group, lamps: Group):
    cx, cy = -1.5, NB
    g.box("CabinetWhite", (cx, cy, TOP + 0.09), (0.5, 0.38, 0.18), 0.02)
    g.box("LaminarGrey", (cx + 0.1, cy + 0.04, TOP + 0.185), (0.18, 0.16, 0.02), 0.006)
    g.box("Graphite", (cx - 0.13, cy - 0.12, TOP + 0.17), (0.18, 0.12, 0.012), 0.004, rot=rot_x(-25))
    display(lamps, (cx - 0.13, cy - 0.125, TOP + 0.178), (0.15, 0.09, 0.002))


def microscope(g: Group, gw: Group):
    cx, cy = 0.5, NB
    g.box("CabinetWhite", (cx, cy + 0.02, TOP + 0.03), (0.22, 0.28, 0.06), 0.015)
    g.box("CabinetWhite", (cx, cy + 0.11, TOP + 0.2), (0.07, 0.07, 0.32), 0.015)
    g.box("Black", (cx, cy - 0.01, TOP + 0.17), (0.16, 0.14, 0.015), 0.004)
    g.box("CabinetWhite", (cx, cy + 0.04, TOP + 0.36), (0.09, 0.2, 0.08), 0.02)
    g.cyl("Steel", (cx, cy - 0.02, TOP + 0.28), 0.03, 0.05, 12)
    for dx in (-0.025, 0.025):
        g.cyl("Black", (cx + dx, cy - 0.06, TOP + 0.43), 0.012, 0.09, 10, rot=rot_x(-35))
    g.cyl("Steel", (cx + 0.06, cy + 0.11, TOP + 0.1), 0.025, 0.02, 12, rot=rot_y(90))
    gw.box("Glass", (cx, cy - 0.01, TOP + 0.18), (0.075, 0.025, 0.002))


def vortex(g: Group):
    cx, cy = 1.25, NB
    g.cyl("CabinetWhite", (cx, cy, TOP + 0.04), 0.07, 0.08, 18, r2=0.06)
    g.cyl("Black", (cx, cy, TOP + 0.09), 0.025, 0.02, 12)
    g.cyl("CapBlue", (cx + 0.04, cy - 0.06, TOP + 0.04), 0.012, 0.01, 10, rot=rot_x(90))


def water_bath(g: Group, lamps: Group):
    cx, cy = 2.05, NB
    g.box("Steel", (cx, cy, TOP + 0.12), (0.55, 0.34, 0.24), 0.01)
    g.box("Steel", (cx + 0.03, cy + 0.02, TOP + 0.25), (0.48, 0.3, 0.02), 0.006)
    g.box("Graphite", (cx - 0.2, cy - 0.172, TOP + 0.12), (0.12, 0.004, 0.1), 0.002)
    display(lamps, (cx - 0.2, cy - 0.175, TOP + 0.14), (0.08, 0.002, 0.025))


def gel_doc(g: Group, lamps: Group):
    cx, cy = EB, -0.5
    g.box("Graphite", (cx, cy, TOP + 0.08), (0.36, 0.42, 0.16), 0.012)
    g.box("Black", (cx + 0.03, cy, TOP + 0.24), (0.3, 0.36, 0.16), 0.02)
    g.box("Stain", (cx - 0.02, cy, TOP + 0.165), (0.2, 0.26, 0.01), 0.002)
    display(lamps, (cx - 0.182, cy + 0.12, TOP + 0.08), (0.003, 0.08, 0.04))


def pcr(g: Group, lamps: Group):
    cx, cy = EB, 3.05
    g.box("CabinetWhite", (cx, cy, TOP + 0.12), (0.4, 0.3, 0.24), 0.02)
    g.box("LaminarGrey", (cx + 0.02, cy, TOP + 0.255), (0.32, 0.26, 0.04), 0.012)
    g.box("Graphite", (cx - 0.2, cy, TOP + 0.13), (0.004, 0.18, 0.12), 0.002)
    display(lamps, (cx - 0.203, cy, TOP + 0.14), (0.002, 0.15, 0.09))


def freezer(g: Group):
    """Upright -20 °C freezer beside the refrigerator, facing east."""
    x0, x1, y0, y1 = 0.97, 1.75, -4.55, -3.7
    g.span("CabinetWhite", x0, x1, y0, y1, 0.04, 1.7, 0.03)
    g.span("Steel", x1 + 0.005, x1 + 0.03, y1 - 0.11, y1 - 0.08, 0.7, 1.4, 0.005)
    g.span("Black", x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, 0, 0.04)
    g.span("Graphite", x1, x1 + 0.004, y0 + 0.15, y0 + 0.35, 1.5, 1.6)


def autoclave(g: Group):
    """Vertical autoclave on the utility-room floor."""
    cx, cy = -5.6, -3.55
    g.cyl("Steel", (cx, cy, 0.45), 0.3, 0.9, 32)
    g.cyl("LaminarGrey", (cx, cy, 0.93), 0.31, 0.06, 32)
    g.cyl("Steel", (cx, cy, 1.0), 0.06, 0.1, 12)
    g.cyl("CabinetWhite", (cx, cy - 0.3, 0.98), 0.05, 0.02, 16, rot=rot_x(90))
    g.box("Graphite", (cx, cy - 0.3, 0.55), (0.2, 0.03, 0.14), 0.006)
    for a in range(0, 360, 60):
        g.box("Black", (cx + 0.28 * math.cos(math.radians(a)), cy + 0.28 * math.sin(math.radians(a)), 0.96), (0.04, 0.04, 0.05), 0.004)


def incubator(g: Group, glass: Group, gw: Group, rnd):
    """BOD incubator against the partition, its glass inner door showing shelves of cultures."""
    x0, x1, y0, y1 = -2.45, -1.65, -3.4, -2.72
    g.span("CabinetWhite", x0, x1, y0, y1, 0.04, 1.85, 0.02)
    g.span("Graphite", x0 + 0.06, x1 - 0.06, y0 - 0.005, y0, 0.15, 1.6)
    for z in (0.5, 0.95, 1.4):
        g.span("Steel", x0 + 0.08, x1 - 0.08, y0 + 0.05, y1 - 0.05, z - 0.01, z)
        for k in range(4):
            flask(gw, x0 + 0.18 + k * 0.15, y0 + 0.2, z, 0.75, culture=True)
    glass.span("Glass", x0 + 0.06, x1 - 0.06, y0 - 0.012, y0 - 0.006, 0.15, 1.6)
    g.span("Graphite", x0 + 0.1, x1 - 0.1, y0 - 0.01, y0, 1.66, 1.78)
    g.span("Black", x0 + 0.05, x1 - 0.05, y0 + 0.05, y1 - 0.05, 0, 0.04)


def hot_air_oven(g: Group, lamps: Group):
    cx, cy = -2.0, Y0 + 0.36
    g.box("Steel", (cx, cy, TOP + 0.24), (0.6, 0.5, 0.48), 0.012)
    g.box("LaminarGrey", (cx - 0.05, cy - 0.252, TOP + 0.24), (0.42, 0.006, 0.4), 0.004)
    g.box("Graphite", (cx + 0.23, cy - 0.252, TOP + 0.3), (0.1, 0.006, 0.2), 0.003)
    display(lamps, (cx + 0.23, cy - 0.256, TOP + 0.36), (0.07, 0.002, 0.025))
    g.box("Steel", (cx + 0.12, cy - 0.27, TOP + 0.24), (0.02, 0.03, 0.2), 0.004)


def label(name, loc):
    e = bpy.data.objects.new(f"Label_{name}", None)
    e.empty_display_type = "SPHERE"
    e.empty_display_size = 0.06
    e.location = loc
    bpy.context.scene.collection.objects.link(e)
    return e


def clear():
    for ob in list(bpy.data.objects):
        bpy.data.objects.remove(ob, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.lights, bpy.data.cameras, bpy.data.images):
        for d in list(coll):
            if d.users == 0:
                coll.remove(d)


def build():
    clear()
    make_materials()
    rnd = random.Random(20261026)
    scene = bpy.context.scene
    col = scene.collection
    shell_g, lamps, outside = Group("Shell"), Group("Lamps"), Group("Outside")
    furn, glass, gw = Group("Furniture"), Group("Glass"), Group("Glassware")
    shell(shell_g, lamps, outside)
    island(furn, gw, rnd)
    north_bench(furn, gw, rnd)
    east_bench(furn, gw, rnd)
    enclosure(furn, gw, glass, rnd)
    culture_racks(furn, gw, lamps, rnd)
    inst = {
        k: Group(f"Inst_{k}")
        for k in (
            "laminar", "fridge", "oven", "stirrer", "pipettes", "psu", "centrifuge", "balance", "phmeter", "spectro",
            "microscope", "vortex", "waterbath", "geldoc", "pcr", "freezer", "autoclave", "incubator", "hotairoven",
        )
    }
    # Each instrument carries its own glass, screens and flasks, so it can lift off the bench whole.
    i = inst
    laminar(i["laminar"], i["laminar"])
    fridge(i["fridge"])
    oven(i["oven"])
    stirrer(i["stirrer"], i["stirrer"], i["stirrer"], furn, lamps)
    pipettes(i["pipettes"])
    power_supply(i["psu"], i["psu"])
    centrifuge(i["centrifuge"], i["centrifuge"])
    balance(i["balance"], i["balance"], i["balance"])
    ph_meter(i["phmeter"], i["phmeter"], i["phmeter"])
    spectro(i["spectro"], i["spectro"])
    microscope(i["microscope"], i["microscope"])
    vortex(i["vortex"])
    water_bath(i["waterbath"], i["waterbath"])
    gel_doc(i["geldoc"], i["geldoc"])
    pcr(i["pcr"], i["pcr"])
    freezer(i["freezer"])
    autoclave(i["autoclave"])
    incubator(i["incubator"], i["incubator"], i["incubator"], rnd)
    hot_air_oven(i["hotairoven"], i["hotairoven"])
    for g in (shell_g, lamps, outside, furn, glass, gw, *inst.values()):
        g.build(col)
    # Instruments pivot on their own centre, at the foot, so the site can lift and turn them in place.
    for g in inst.values():
        ob = bpy.data.objects[g.name]
        vs = [v.co for v in ob.data.vertices]
        c = Vector(((min(v.x for v in vs) + max(v.x for v in vs)) / 2, (min(v.y for v in vs) + max(v.y for v in vs)) / 2, min(v.z for v in vs)))
        ob.data.transform(Matrix.Translation(-c))
        ob.location = c
    # The outside plane needs plain 0..1 UVs for its picture.
    me = bpy.data.objects["Outside"].data
    uv = me.uv_layers.new(name="UVMap")
    for loop in me.loops:
        v = me.vertices[loop.vertex_index].co
        uv.data[loop.index].uv = ((v.x + 9) / 18, (v.z + 2) / 8.5)
    # Readout anchors.
    label("laminar", (-5.45, -0.7, 2.3))
    label("sterile", (0.9, 0.45, 2.85))
    label("utility", (-3.2, -4.1, 2.85))
    label("fridge", (1.36, -3.18, 1.92))
    label("rack", (-2.4, 2.7, TOP + 0.95))
    label("cultures", (2.5, Y0 + 0.33, 2.15))
    label("oven", (4.2, Y1 - 0.38, TOP + 0.38))
    label("windows", (0.4, Y1 - 0.1, 2.75))
    label("stirrer", (X1 - 0.42, -3.0, TOP + 0.26))
    label("pipettes", (X1 - 0.5, -1.6, TOP + 0.42))
    label("psu", (X1 - 0.45, 0.6, TOP + 0.17))
    label("centrifuge", (X1 - 0.45, 1.9, TOP + 0.2))
    label("balance", (-6.2, NB, TOP + 0.34))
    label("phmeter", (-5.47, NB + 0.05, TOP + 0.42))
    label("spectro", (-1.5, NB, TOP + 0.22))
    label("microscope", (0.5, NB, TOP + 0.5))
    label("vortex", (1.25, NB, TOP + 0.12))
    label("waterbath", (2.05, NB, TOP + 0.28))
    label("geldoc", (EB, -0.5, TOP + 0.34))
    label("pcr", (EB, 3.05, TOP + 0.3))
    label("freezer", (1.36, -4.12, 1.78))
    label("autoclave", (-5.6, -3.55, 1.08))
    label("incubator", (-2.05, -3.06, 1.9))
    label("hotairoven", (-2.0, Y0 + 0.36, TOP + 0.5))
    lights()
    print("built", len(bpy.data.objects), "objects")


def lights():
    """Daylight through the north windows, the tube lights, and a soft sky."""
    scene = bpy.context.scene
    world = scene.world or bpy.data.worlds.new("World")
    scene.world = world
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs["Color"].default_value = (0.78, 0.84, 0.92, 1)
    bg.inputs["Strength"].default_value = 0.6
    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = 3.2
    sun.color = (1.0, 0.92, 0.8)
    sun.angle = math.radians(3)
    ob = bpy.data.objects.new("Sun", sun)
    ob.rotation_euler = (math.radians(-52), 0, math.radians(-24))
    scene.collection.objects.link(ob)
    for i, (x, y, sx, sy, z) in enumerate(PANELS):
        l = bpy.data.lights.new(f"Panel_{i}", "AREA")
        l.shape = "RECTANGLE"
        l.size, l.size_y = sx, sy
        l.energy = 140 * sx * sy / 0.9
        l.color = (0.97, 0.98, 1.0)
        o = bpy.data.objects.new(l.name, l)
        o.location = (x, y, z - 0.02)
        scene.collection.objects.link(o)
    # Sky through each window as a soft area light just inside the glass; the picture outside is only
    # seen, never sampled as a light, which keeps the bake clean.
    for a, b in WINDOWS:
        l = bpy.data.lights.new(f"Sky_{a}", "AREA")
        l.shape = "RECTANGLE"
        l.size, l.size_y = b - a, HEAD - SILL
        l.energy = 900 * (b - a) / 3
        l.color = (0.86, 0.92, 1.0)
        o = bpy.data.objects.new(l.name, l)
        o.location = ((a + b) / 2, Y1 + 0.2, (SILL + HEAD) / 2)
        o.rotation_euler = (math.radians(-90), 0, 0)
        scene.collection.objects.link(o)
    out = bpy.data.objects["Outside"]
    out.visible_diffuse = out.visible_glossy = out.visible_transmission = out.visible_shadow = False
    bpy.data.objects["Lamps"].visible_shadow = False


# ---------------------------------------------------------------- bake

BAKE_SETS = {
    "shell": (["Shell"], 1536),
    "furniture": (["Furniture"], 2048),
    "instruments": ([], 1536),  # every Inst_* object; filled in at bake time
}


def lightmap_uvs(names):
    bpy.ops.object.mode_set(mode="OBJECT") if bpy.context.object and bpy.context.object.mode != "OBJECT" else None
    bpy.ops.object.select_all(action="DESELECT")
    for n in names:
        ob = bpy.data.objects[n]
        me = ob.data
        if "UVMap" not in me.uv_layers:
            me.uv_layers.new(name="UVMap")
        if "Light" not in me.uv_layers:
            me.uv_layers.new(name="Light")
        me.uv_layers.active = me.uv_layers["Light"]
        ob.select_set(True)
    bpy.context.view_layer.objects.active = bpy.data.objects[names[0]]
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(60), island_margin=0.002, area_weight=0.0, scale_to_bounds=False)
    bpy.ops.uv.pack_islands(rotate=True, margin=0.003)
    bpy.ops.object.mode_set(mode="OBJECT")
    # Texture UVs: a box projection in metres, used for the floor tiles.
    for n in names:
        me = bpy.data.objects[n].data
        uv = me.uv_layers["UVMap"]
        for poly in me.polygons:
            nrm = poly.normal
            ax = max(range(3), key=lambda i: abs(nrm[i]))
            for li in poly.loop_indices:
                v = me.vertices[me.loops[li].vertex_index].co
                uv.data[li].uv = (v.y, v.z) if ax == 0 else (v.x, v.z) if ax == 1 else (v.x, v.y)
        me.uv_layers.active = me.uv_layers["UVMap"]


def bake(samples=96, only=None):
    scene = bpy.context.scene
    try:
        scene.render.engine = "CYCLES"
    except TypeError as e:
        print(e)
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.max_bounces = 4
    scene.cycles.diffuse_bounces = 3
    scene.cycles.glossy_bounces = 1
    scene.cycles.transmission_bounces = 4
    scene.cycles.sample_clamp_indirect = 1.5
    scene.cycles.sample_clamp_direct = 8.0
    scene.cycles.caustics_reflective = scene.cycles.caustics_refractive = False
    os.makedirs(OUT, exist_ok=True)
    for key, (names, size) in BAKE_SETS.items():
        if only and key not in only:
            continue
        if key == "instruments":
            names = sorted(o.name for o in bpy.data.objects if o.name.startswith("Inst_"))
        lightmap_uvs(names)
        img = bpy.data.images.get(f"LM_{key}")
        if img:
            bpy.data.images.remove(img)
        img = bpy.data.images.new(f"LM_{key}", size, size, alpha=True, float_buffer=True)
        img.colorspace_settings.name = "Linear Rec.709" if "Linear Rec.709" in [i.name for i in bpy.types.ColorManagedInputColorspaceSettings.bl_rna.properties["name"].enum_items] else img.colorspace_settings.name
        mats = {m for n in names for m in bpy.data.objects[n].data.materials}
        for m in mats:
            nt = m.node_tree
            node = nt.nodes.get("BakeTarget") or nt.nodes.new("ShaderNodeTexImage")
            node.name = "BakeTarget"
            node.image = img
            nt.nodes.active = node
            for n in names:
                pass
        for n in names:
            me = bpy.data.objects[n].data
            me.uv_layers.active = me.uv_layers["Light"]
        bpy.ops.object.select_all(action="DESELECT")
        for n in names:
            bpy.data.objects[n].select_set(True)
        bpy.context.view_layer.objects.active = bpy.data.objects[names[0]]
        bpy.ops.object.bake(type="DIFFUSE", pass_filter={"DIRECT", "INDIRECT"}, margin=6, use_clear=True)
        for n in names:
            me = bpy.data.objects[n].data
            me.uv_layers.active = me.uv_layers["UVMap"]
        save_lightmap(img, os.path.join(OUT, f"lm-{key}.png"))
        print("baked", key)


def denoise(rgb, mask, passes=2, radius=3, sigma=0.18):
    """Joint bilateral filter on log luminance, confined to baked texels: smooths sampling noise,
    keeps shadow edges and never bleeds across empty space between UV islands."""
    out = rgb.copy()
    m = mask.astype(np.float32)
    for _ in range(passes):
        lum = np.log1p(out.mean(-1))
        acc = np.zeros_like(out)
        wsum = np.zeros(lum.shape, np.float32)
        for dy in range(-radius, radius + 1):
            for dx in range(-radius, radius + 1):
                s_rgb = np.roll(out, (dy, dx), (0, 1))
                s_lum = np.roll(lum, (dy, dx), (0, 1))
                s_m = np.roll(m, (dy, dx), (0, 1))
                wgt = s_m * np.exp(-(dx * dx + dy * dy) / (2 * (radius / 1.5) ** 2) - ((s_lum - lum) ** 2) / (2 * sigma * sigma))
                acc += s_rgb * wgt[..., None]
                wsum += wgt
        out = np.where(wsum[..., None] > 0, acc / np.maximum(wsum, 1e-6)[..., None], out)
    return out


def save_lightmap(img, path):
    """Irradiance halved and sRGB-encoded into 8 bits; the site multiplies it back by two."""
    w, h = img.size
    px = np.empty(w * h * 4, np.float32)
    img.pixels.foreach_get(px)
    px = px.reshape(h, w, 4)
    c = np.clip(denoise(px[..., :3], px[..., 3] > 0) / 2.0, 0, 1)
    c = np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(c, 1 / 2.4) - 0.055)
    out = bpy.data.images.new(os.path.basename(path), w, h)
    out.pixels.foreach_set(np.concatenate([c, np.ones((h, w, 1))], -1).astype(np.float32).ravel())
    out.filepath_raw = path
    out.file_format = "PNG"
    out.save()
    bpy.data.images.remove(out)


# ---------------------------------------------------------------- export


def export():
    os.makedirs(OUT, exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for ob in bpy.data.objects:
        if ob.type in {"MESH", "EMPTY"}:
            ob.select_set(True)
    for m in bpy.data.materials:
        node = m.node_tree.nodes.get("BakeTarget") if m.node_tree else None
        if node:
            m.node_tree.nodes.remove(node)
    bpy.ops.export_scene.gltf(
        filepath=os.path.join(ROOT, "public", "models", "lab-room.glb"),
        use_selection=True,
        export_format="GLB",
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_image_format="WEBP",
        export_draco_mesh_compression_enable=True,
        export_draco_mesh_compression_level=7,
        export_draco_position_quantization=14,
        export_draco_texcoord_quantization=14,
        export_apply=True,
        export_lights=False,
        export_cameras=False,
    )
    print("exported")
