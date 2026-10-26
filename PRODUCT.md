# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective Ph.D. scholars and M.Sc. graduates deciding whether to apply; researchers and institutions weighing a collaboration, strain or method exchange; reviewers, funding agencies and university administrators checking the lab's record; and current members pointing others to their profile and papers. Most arrive from a search, a paper, a CUTN page or a shared link, often on a phone.

## Product Purpose

The public website of the Algal Biotechnology Laboratory, Department of Microbiology, Central University of Tamil Nadu (CUTN), Thiruvarur, led by Dr. Amit Kumar Bajhaiya since 2020. It shows what the lab investigates, who does the work, what it has published, and how to write to it. Success: a visitor understands the lab's science within one screen, finds the papers and people behind it, and writes to the lab with a clear subject.

## Positioning

The lab works on the single-celled green alga *Chlamydomonas reinhardtii* and related microalgae, at the level of the cell's own machinery: transcriptional regulators such as PSR1 (identified by the PI as a global regulator of phosphorus-starvation responses), metacaspases and programmed cell death under stress, the carbon-concentrating mechanism and pyrenoid, polyphosphate storage, lipid synthesis for biofuels, and bioactives (MAAs, vitamin D3). Each research programme corresponds to a structure inside the cell, which no other lab's site can truthfully claim in the same combination.

## Operating Context

Visitors read paper titles, DOIs and author lists; copy citations; open member profiles; and send email using subject templates (collaborate, join, anything else). The site is a static export deployed to Cloudflare Pages, with nine locales (English at the root; the others machine-translated and unreviewed).

## Capabilities and Constraints

- Next.js 16 App Router static export, React 19, TypeScript strict, Tailwind CSS 4. Pages: Home, Research, People, member profiles, The Lab (a scroll tour of a 3D reconstruction of the lab room, labelled "illustrative" and drawn more spacious than the room is), Publications (search, type filters, citation copy), Contact (mailto templates), not-found.
- Content lives in `src/data/` and `src/i18n/locales/`; `en.ts` defines the dictionary type every locale must match.
- SEO: canonical, hreflang, Open Graph, JSON-LD, sitemap; every new page joins `src/app/sitemap.ts`.
- 3D: the user chose (26 Oct 2026) a live glTF model rendered with three.js for the homepage hero, authored in Blender. It must lazy-load, pause off screen, respect reduced motion and fall back to a static image.
- No contact form backend; enquiries go to the lab email by mailto. Student email addresses are not published.

## Brand Commitments

- Name: Algal Biotechnology Laboratory (short: Algal Biotech Lab), Department of Microbiology, School of Life Sciences, CUTN.
- Logos: `src/assets/brand/abl-mark.webp`, `abl-wordmark.webp`, `cutn.webp`.
- Footer credits Mavern (Subhradeep Sarkar), with mark, link and contact email.
- Hero (user brief): an exploded anatomical view of a *Chlamydomonas* cell that separates layer by layer as the visitor scrolls, in fine detail; each layer is tied to a research programme. References supplied: unparalleled.pages.dev/soveriegn-quantum and unparalleled.pages.dev/poterie-celeste.

## Evidence on Hand

- 16 member portraits (`src/assets/team/`), six lab photographs (`src/assets/lab/`), eleven focus-area images (`src/assets/focus/`, generated illustrations).
- About 40 publications with DOIs (`src/data/publications.ts`), six research programmes with linked papers, four focus areas, grants, awards and talks (`src/data/recognition.ts`), PI career path.
- Absent and not to be invented: student testimonials, citation counts, impact factors, funding totals beyond those listed, partner logos, lab metrics not derivable from the data.

## Product Principles

- Show the cell, then the paper: every visual claim about the science points to the work that supports it.
- People are named, pictured and linked; the lab is the people who do the work.
- A reader on a phone, on a slow connection, gets the full content before any 3D arrives.
- Scientific accuracy over spectacle: anatomy is drawn as it is, with any exaggeration of scale stated.

## Accessibility & Inclusion

WCAG 2.2 AA. Full content and navigation without WebGL or JavaScript; reduced motion honoured; touch targets at least 44px; nine locales, including CJK scripts.
