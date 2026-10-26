"""Seamless surface-detail maps for the Chlamydomonas hero.

Run: python3 assets/blender/gen_detail_maps.py
Writes public/models/detail-*.webp. Every field is periodic (FFT-filtered noise
or Voronoi with wrapped distances), so the maps tile without seams; the hero
samples them triplanar in object space.
"""
from pathlib import Path

import numpy as np
from PIL import Image

N = 1024
OUT = Path(__file__).resolve().parents[2] / "public" / "models"
rng = np.random.default_rng(7)

fx = np.fft.fftfreq(N)[:, None]
fy = np.fft.fftfreq(N)[None, :]


def spectral(beta, lo, hi, aniso=1.0, angle=0.0):
    """Periodic noise with a 1/f^beta spectrum between lo and hi cycles per tile."""
    c, s = np.cos(angle), np.sin(angle)
    u = (fx * c + fy * s) * N
    v = (-fx * s + fy * c) * N * aniso
    f = np.sqrt(u * u + v * v)
    band = np.clip((f - lo) / max(lo, 1), 0, 1) * np.exp(-((f / hi) ** 2))
    amp = band / np.maximum(f, 1) ** beta
    phase = np.fft.fft2(rng.standard_normal((N, N)))
    out = np.real(np.fft.ifft2(phase * amp))
    return (out - out.mean()) / (out.std() + 1e-9)


def voronoi(cells, jitter=1.0):
    """F1 and F2 distances to wrapped random sites, in tile units."""
    pts = rng.random((cells, 2))
    yy, xx = np.mgrid[0:N, 0:N] / N
    f1 = np.full((N, N), 9.0)
    f2 = np.full((N, N), 9.0)
    for px, py in pts:
        dx = np.abs(xx - px)
        dy = np.abs(yy - py)
        dx = np.minimum(dx, 1 - dx)
        dy = np.minimum(dy, 1 - dy)
        d = np.sqrt(dx * dx + dy * dy)
        f2 = np.where(d < f1, f1, np.minimum(f2, d))
        f1 = np.minimum(f1, d)
    return f1, f2


def normal_map(h, strength):
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5 * strength
    gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5 * strength
    n = np.stack([-gx, -gy, np.ones_like(h)], -1)
    n /= np.linalg.norm(n, axis=-1, keepdims=True)
    return ((n * 0.5 + 0.5) * 255).astype(np.uint8)


def norm01(a):
    return (a - a.min()) / (a.max() - a.min() + 1e-9)


# Granular: protein-dense matrix (Rubisco, chromatin, nucleolus). Packed beads plus fine grit.
f1, f2 = voronoi(900)
beads = norm01(1 - np.clip(f1 * 900 ** 0.5 * 1.6, 0, 1) ** 1.5)
grit = spectral(0.5, 60, 420)
granular = beads * 1.0 + grit * 0.08 + spectral(1.2, 4, 40) * 0.25

# Fibrous: the glycoprotein wall. Stretched noise along two crossing directions.
fib = spectral(0.9, 8, 300, aniso=7.0, angle=0.4) * 0.7 + spectral(0.9, 8, 300, aniso=5.0, angle=2.0) * 0.45
fibrous = fib + spectral(1.4, 3, 30) * 0.6

# Membrane: soft wrinkles, shallow pits and lipid speckle.
pf1, _ = voronoi(260)
pits = -np.exp(-((pf1 * 260 ** 0.5) / 0.18) ** 2)
membrane = spectral(2.0, 2, 24) * 1.0 + pits * 0.6 + spectral(0.4, 120, 500) * 0.06

OUT.mkdir(parents=True, exist_ok=True)
for name, h, s in (("granular", granular, 9.0), ("fibrous", fibrous, 2.2), ("membrane", membrane, 2.6)):
    Image.fromarray(normal_map(h, s)).save(OUT / f"detail-{name}-n.webp", quality=88, method=6)

# Variation: R granular cavity, G fibrous, B membrane; drives albedo and roughness wear.
var = np.stack([norm01(granular), norm01(fibrous), norm01(membrane)], -1)
Image.fromarray((var * 255).astype(np.uint8)).save(OUT / "detail-variation.webp", quality=88, method=6)
print("wrote", sorted(p.name for p in OUT.glob("detail-*")))
