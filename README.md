# Algal Biotech Lab

Website of the **Algal Biotechnology Laboratory**, Department of Microbiology, Central University of Tamil Nadu (CUTN). The lab, led by Dr. Amit Kumar Bajhaiya, studies how microalgae regulate their genes and metabolism and engineers them for biofuels, carbon capture, nutraceuticals and wastewater treatment.

## What the site contains

| Page | Route | Content |
|---|---|---|
| Home | `/` | A scroll-driven story in eight chapters over a 3D particle scene, followed by the four focus areas |
| Explore | `/explore` | Research programmes and the publication list, with search and filters |
| About Lab | `/about` | Lab photographs, the principal investigator, the research fellows, funding, service and talks |
| Contact Us | `/contact` | Enquiry links, contact details and directions |

The interface is available in nine languages: English, French, Spanish, German, Polish, Swedish, Simplified Chinese, Japanese and Korean. All translations other than English are machine-made and have not been reviewed.

## Getting started

Requires Node.js 20 or newer.

```bash
npm install
npm run dev      # development server on http://localhost:3000
npm run build    # type-check and build to dist/
npm run preview  # serve the production build locally
```

## Tech stack

- **Framework:** React 18, Vite 6, TypeScript in strict mode
- **Styling:** Tailwind CSS 4, written mobile-first
- **Routing:** React Router, with a single-page fallback in `public/_redirects`
- **3D:** Three.js through `@react-three/fiber`, custom point-cloud shaders, and `three-nebula` for the cursor spores
- **Icons and type:** Lucide icons; Fraunces, IBM Plex Sans and IBM Plex Mono

## Project structure

```
src/
├── assets/        Logos, team portraits, lab photographs, focus-area images
├── components/
│   ├── 3d/        The particle scene: shapes, stars, bloom, spores, quality tiers
│   ├── common/    Shared pieces: links, eyebrows, reveal, reticle frame
│   ├── layout/    Header, footer, mobile menu, language switcher
│   ├── home/      Hero, story chapters, chapter rail, closing chapter
│   ├── focus/     The pinned focus-area stage
│   └── …          about, team, research, publications, contact
├── data/          Typed content: publications, team, research, grants, gallery
├── hooks/         Scroll, media-query, coverflow and scene hooks
├── i18n/          Language provider and one dictionary per locale
├── pages/         Home, Explore, About, Contact
├── types/         Shared TypeScript types
└── utils/         Small helpers
```

## Editing content

Content is kept apart from layout:

- **Facts and structure** (publication records, team members, grants, image lists) live in `src/data/`.
- **All visible text** lives in `src/i18n/locales/`, one file per language. `en.ts` is the source; its shape is the type every other locale must match, so a missing key fails the build.

To add a publication, add its record to `src/data/publications.ts`. To change wording, edit `en.ts` and then the same key in the other locale files.

## The 3D scene

One canvas stays fixed behind every page. Its particles morph between shapes as the home page is scrolled: a culture cloud, a *Chlamydomonas* cell, DNA, a dying cell, a polyphosphate chain, a culture flask, a loop, and finally the lab's logo and name.

The scene adapts to the device:

- It picks a quality tier on load from the graphics renderer, core count and memory, and lowers resolution by itself if frames run slow.
- Without WebGL, a still star background replaces it.
- With "reduce motion" turned on in the operating system, animation and cursor effects are switched off.

Appending `?quality=software`, `?quality=low`, `?quality=mid` or `?quality=high` to the URL forces a tier, which is useful for checking how the site looks on other hardware.

## Deployment

The site is static. Build it and serve the `dist/` folder from any static host. `public/_redirects` provides the single-page fallback on hosts that read that file, such as Cloudflare Pages and Netlify.

## Contributing

Engineering standards for this project are in [AGENTS.md](AGENTS.md): mobile-first styling, small single-purpose components, typed data kept out of components, and no `any`.

## Credits

Designed and developed by **Subhradeep Sarkar**.

## Licence

Copyright © 2026 Department of Microbiology, Central University of Tamil Nadu. All rights reserved. See [LICENSE](LICENSE).
