# Algal Biotech Lab

Website of the **Algal Biotechnology Laboratory**, Department of Microbiology, Central University of Tamil Nadu (CUTN). The lab, led by Dr. Amit Kumar Bajhaiya, studies how microalgae regulate their genes and metabolism and engineers them for biofuels, carbon capture, nutraceuticals and wastewater treatment.

## What the site contains

| Page | Route | Content |
|---|---|---|
| Home | `/` | Statement and figures, focus areas, people, recent publications, the lab, how to join |
| Research | `/research` | The four focus areas and six research programmes, each linked to its papers |
| People | `/people` | Principal investigator, researchers, alumni, funding and recognition, service and talks |
| Profile | `/people/{name}` | One page per member: biography, interests, education, fellowships, publications |
| Publications | `/publications` | Every work, grouped by year, with search, type filters, DOI links and citation copy |
| Contact | `/contact` | Enquiry templates, contact details and directions |

Every page exists in nine languages. English is at the root; the others live under `/fr`, `/es`, `/de`, `/pl`, `/sv`, `/zh`, `/ja` and `/ko`. All translations other than English are machine-made and have not been reviewed. Member biographies are in English in every language.

## Getting started

Requires Node.js 20.9 or newer (`.node-version` pins 22 for the Cloudflare Pages build).

```bash
npm install
npm run dev        # development server on http://localhost:3000
npm run build      # static export to dist/
npm start          # serve dist/ locally
npm run typecheck  # TypeScript only
```

## Before going live: set the domain

The sitemap, canonical links, hreflang links and structured data all use one origin. Set it at build time:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example npm run build
```

Without it the build uses the placeholder in `src/data/labData.ts`. After deploying, submit `https://your-domain.example/sitemap.xml` in Google Search Console.

## Search-engine setup

- **Static HTML for every URL**: 126 pages (14 per language) are pre-rendered, so crawlers see full content without running JavaScript.
- **Per-language URLs** with `hreflang` alternates on every page and in the sitemap, plus `x-default` pointing to English.
- **Metadata** per page: translated title and description, canonical URL, Open Graph and Twitter cards, a 1200×630 share image (`/og.png`).
- **Structured data (JSON-LD)**: `ResearchOrganization` with its parent university, `WebSite`, `ProfilePage`/`Person` for each member, `ScholarlyArticle`/`Chapter` for each publication, and breadcrumbs.
- `robots.txt`, `sitemap.xml` and a web manifest are generated from `src/app/`.

## Tech stack

- **Framework:** Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript in strict mode
- **Styling:** Tailwind CSS 4, mobile-first; design tokens in `src/app/globals.css`
- **Type:** Geist and IBM Plex Mono through `next/font` (self-hosted at build time)
- **Motion:** scroll-driven reveals in CSS; the hero organism is a small dependency-free WebGL shader (`src/components/home/organism/`) that pauses off screen, adapts its resolution to the device, holds a still frame under "reduce motion" and falls back to SVG without WebGL
- **Icons:** Lucide

## Project structure

```
src/
├── app/
│   ├── (en)/              English pages, served from the root
│   ├── (intl)/[lang]/     The same pages for the other eight languages
│   ├── sitemap.ts, robots.ts, manifest.ts, og.png/, global-not-found.tsx
│   └── globals.css        Design tokens, type scale, motion
├── assets/                Logos, member portraits, lab photographs, focus-area images
├── components/            common, layout, home (organism/ is the hero's WebGL creature), research, team, publications, contact
├── data/                  Typed content: members, publications, research, grants, gallery
├── i18n/                  Language config and one dictionary per locale
├── types/                 Shared TypeScript types
├── utils/                 SEO metadata, structured data, citations, lab helpers
└── views/                 Page bodies shared by both route trees, and their metadata
```

## Editing content

- **Members** live in `src/data/members.ts`: role, year joined, education, interests, biography, fellowships and links. Portraits go in `src/assets/team/` as 4:5 images. To mark someone as alumni, move them to `ALUMNI` and fill in `now`. A member's lab publications are found automatically through `authorNames`.
- **Publications** live in `src/data/publications.ts`. Counts on the home page update by themselves.
- **Visible text** lives in `src/i18n/locales/`. `en.ts` is the source, and its shape is the type every other locale must match, so a missing key fails the build.

Student email addresses are deliberately not published; enquiries go to the lab address.

## Deployment

`npm run build` writes a fully static site to `dist/`. The site deploys on Cloudflare Pages from the `master` branch with build command `npm run build` and output directory `dist`. Any static host works the same way. `public/_headers` sets long-lived caching for hashed assets, and `dist/404.html` is the not-found page.

## Contributing

Engineering standards are in [AGENTS.md](AGENTS.md): mobile-first styling, small single-purpose components, typed data kept out of components, and no `any`.

## Credits

Designed and developed by **Subhradeep Sarkar**.

## Licence

Copyright © 2026 Department of Microbiology, Central University of Tamil Nadu. All rights reserved. See [LICENSE](LICENSE).
