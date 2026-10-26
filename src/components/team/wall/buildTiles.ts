import { fullName, ALUMNI, PI, RESEARCHERS } from '../../../data/members';
import { GRANTS, RECOGNITION } from '../../../data/recognition';
import { LAB_GALLERY, labPhotoPath } from '../../../data/gallery';
import { FOCUS_AREAS } from '../../../data/focus';
import { PROGRAMS } from '../../../data/research';
import { CELL_PARTS } from '../../../data/cell';
import { PUBLICATIONS } from '../../../data/publications';
import { LAB_INFO } from '../../../data/labData';
import { getDictionary, localePath, type Locale } from '../../../i18n/config';
import { memberPath } from '../../../utils/lab';
import { doiUrl, shortAuthors } from '../../../utils/citation';
import type { LabMember, PlacedTile, WallTile } from '../../../types';

/** Weaves several streams into one, taking from each in turn, so every turn of the wall mixes kinds. */
function weave(streams: WallTile[][], pattern: number[]) {
  const out: WallTile[] = [];
  const cursors = streams.map(() => 0);
  while (cursors.some((c, i) => c < streams[i].length)) {
    for (const s of pattern) if (cursors[s] < streams[s].length) out.push(streams[s][cursors[s]++]);
  }
  return out;
}

/**
 * The whole lab as one wall: pages to go to, people, programmes, focus areas, papers, achievements and
 * photographs of the room, in a bento rhythm of wide, tall and small panels.
 */
export function buildWall(locale: Locale, rows = 4) {
  const t = getDictionary(locale);
  const w = t.gallery.wall;
  const link = (path: string) => localePath(locale, path);

  const person = (m: LabMember, size: Pick<WallTile, 'w' | 'h'>): WallTile => ({
    id: `person-${m.slug}`,
    kind: 'person',
    href: link(memberPath(m)),
    image: m.photo,
    imagePosition: m.photoPosition,
    title: fullName(m),
    sub: m.status === 'pi' ? t.people.pi.role : t.people.roles[m.role],
    meta: m.now ? `${t.people.now}: ${m.now}` : m.interests.slice(0, 2).join(' · '),
    ...size,
  });
  const pages: WallTile[] = (['home', 'research', 'people', 'publications', 'contact'] as const).map((key) => ({
    id: `page-${key}`,
    kind: 'page',
    href: link(key === 'home' ? '/' : `/${key}`),
    title: key === 'home' ? t.nav.home : t.nav[key],
    sub: w.pages[key],
    meta: w.page,
    w: 2,
    h: 1,
  }));
  const people = [...RESEARCHERS, ...ALUMNI].map((m) => person(m, { w: 1, h: 2 }));
  const programmes: WallTile[] = PROGRAMS.map((p) => ({
    id: `programme-${p.id}`,
    kind: 'programme',
    href: `${link('/research')}#${p.id}`,
    title: t.research.programs[p.id].title,
    sub: t.research.programs[p.id].keywords.slice(0, 3).join(' · '),
    meta: `${w.programme} ${p.number}`,
    stain: CELL_PARTS.find((c) => c.program === p.id)?.stain,
    w: 1,
    h: 1,
  }));
  const focus: WallTile[] = FOCUS_AREAS.map((a) => ({
    id: `focus-${a.id}`,
    kind: 'focus',
    href: `${link('/research')}#${a.id}`,
    image: a.images[0],
    title: t.research.areas[a.id].title,
    sub: t.research.areas[a.id].label,
    meta: `${w.focus} ${a.number}`,
    w: 2,
    h: 2,
  }));
  const papers: WallTile[] = PUBLICATIONS.slice(0, 5).map((p) => ({
    id: `paper-${p.id}`,
    kind: 'paper',
    href: doiUrl(p),
    title: p.title,
    sub: `${shortAuthors(p)} · ${p.venue.split(',')[0]}`,
    meta: `${w.paper} · ${p.year}`,
    w: 2,
    h: 1,
  }));
  const achievements: WallTile[] = [
    ...GRANTS.map((g, i): WallTile => ({ id: `grant-${i}`, kind: 'grant', href: `${link('/people')}#funding`, title: g.title, sub: g.agency, meta: `${w.grant} · ${g.period}`, w: 2, h: 1 })),
    ...RECOGNITION.map((r, i): WallTile => ({ id: `award-${i}`, kind: 'award', href: `${link('/people')}#funding`, title: r.title, sub: r.body, meta: `${w.award} · ${r.year}`, w: 1, h: 1 })),
  ];
  const photos = LAB_GALLERY.map((image, i): WallTile => ({
    id: `photo-${i}`,
    kind: 'photo',
    href: link(labPhotoPath(i)),
    image,
    title: t.gallery.captions[i],
    sub: w.lab,
    meta: `${String(i + 1).padStart(2, '0')} / ${String(LAB_GALLERY.length).padStart(2, '0')}`,
    w: i === 0 ? 2 : 1,
    h: i === 0 ? 2 : 1,
  }));

  // Panels by shape. The layout is built from column groups whose slots always fill the rows exactly,
  // so panels can never overlap or leave gaps.
  const shape = (t: WallTile, w: 1 | 2, h: WallTile['h']): WallTile => ({ ...t, w, h });
  const big = [...focus, photos[0]].map((t) => shape(t, 2, 2));
  const wide = [...pages, ...papers, ...achievements.filter((t) => t.kind === 'grant')].map((t) => shape(t, 2, 1));
  const tall = people;
  const counts = [
    { title: String(PUBLICATIONS.length), sub: t.home.stats.publications, href: '/publications' },
    { title: String(RESEARCHERS.length + 1), sub: t.home.stats.researchers, href: '/people' },
    { title: String(LAB_INFO.founded), sub: t.home.stats.founded, href: '/' },
    { title: String(ALUMNI.length), sub: t.people.alumniLabel, href: '/people' },
    { title: String(PROGRAMS.length), sub: t.research.programmesTitle, href: '/research' },
    { title: String(GRANTS.length + RECOGNITION.length), sub: w.achievements, href: '/people#funding' },
  ].map((c, i): WallTile => ({ id: `count-${i}`, kind: 'count', href: link(c.href), title: c.title, sub: c.sub, meta: LAB_INFO.institutionShort, w: 1, h: 1 }));
  const small = weave([programmes, achievements.filter((t) => t.kind === 'award'), photos.slice(1), counts], [0, 1, 2, 1, 3]).map((t) => shape(t, 1, 1));

  const placed: PlacedTile[] = [];
  let col = 0;
  const put = (tile: WallTile | undefined, c: number, row: number) => tile && placed.push({ ...tile, col: c, row });
  const left = () => big.length + wide.length + tall.length + small.length;
  // A slot of a given shape, falling back to smaller panels that tile the same space.
  const fill = (w: 1 | 2, h: number, c: number, row: number) => {
    if (w === 2 && h === 2 && big.length) return put(big.shift(), c, row);
    if (w === 2) {
      for (let r = 0; r < h; r++) {
        if (wide.length) put(wide.shift(), c, row + r);
        else {
          for (const dc of [0, 1]) {
            const next = small.shift() ?? tall.shift();
            put(next && shape(next, 1, 1), c + dc, row + r);
          }
        }
      }
      return;
    }
    if (h === 2 && tall.length) return put(tall.shift(), c, row);
    for (let r = 0; r < h; r++) {
      const next = small.shift() ?? tall.shift() ?? wide.shift();
      put(next && shape(next, 1, 1), c, row + r);
    }
  };

  put(person(PI, { w: 2, h: 4 }), 0, 0);
  col = 2;
  let turn = 0;
  while (left() > 0) {
    const pattern = turn++ % 4;
    if (pattern === 0) { fill(1, 2, col, 0); fill(1, 2, col, 2); col += 1; }
    else if (pattern === 1) { fill(2, 2, col, 0); fill(2, 2, col, 2); col += 2; }
    else if (pattern === 2) { fill(1, 2, col, 0); fill(1, 1, col, 2); fill(1, 1, col, 3); col += 1; }
    else { fill(2, 2, col, 2); fill(2, 2, col, 0); col += 2; }
  }
  const columns = col;
  return { tiles: placed, columns, rows };
}
