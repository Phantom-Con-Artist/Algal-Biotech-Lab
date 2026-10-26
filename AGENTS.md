# Development & Engineering Guidelines: CUTN Microbiology Lab Website

This document sets the mandatory engineering standards for all agents, developers, and contributors working on the **Algal Biotechnology & Microbiology Laboratory (Central University of Tamil Nadu)** web platform.

---

## 1. Strict Mobile-First Design Philosophy
* **Mobile-First CSS / Tailwind**: Always write base CSS and Tailwind classes targeting mobile screens (320px–480px) first, and layer larger viewport breakpoints progressively using `sm:`, `md:`, `lg:`, `xl:`, and `2xl:`.
* **Touch-Friendly Controls**: Minimum interactive touch targets of 44x44px. All navigation menus, tabs, modals, and carousel controls must be ergonomic and thumb-friendly.
* **Responsive Typography & Spacing**: Use fluid spacing and clamp-based or responsive text sizes (`text-base md:text-lg lg:text-xl`). Avoid fixed-width containers that cause horizontal scrollbars.
* **Performance on Mobile**:
  * Heavy 3D canvases (Three.js / Nebula particle systems) must be dynamically responsive, lower particle counts or pause rendering when offscreen or on lower-power mobile viewports.
  * Respect `prefers-reduced-motion` media queries.

---

## 2. High Modularity & Component Architecture
* **Single Responsibility Principle**: Every component must have a single clear purpose. Keep individual files concise, focused, and under 150–200 lines where possible.
* **Folder Structure**:
  ```
  src/
  ├── assets/            # Static media, SVG icons, logos, photos
  ├── components/
  │   ├── common/        # Buttons, cards, modals, badges, inputs
  │   ├── layout/        # Navbar, Footer, MobileDrawer, Container
  │   ├── 3d/            # Three.js canvases, Nebula particle nodes, point clouds
  │   ├── home/          # Hero, ResearchHighlights, StatCounters
  │   ├── team/          # Faculty & Scholar cards, bio modals, academic links
  │   ├── publications/  # Pub filter, year grouping, citation copy, DOI links
  │   └── contact/       # Location map, contact details, lab query form
  ├── data/              # Typed constants (publications, team members, grants, news)
  ├── hooks/             # Custom React hooks (useMediaQuery, useScroll, useThree)
  ├── types/             # TypeScript interfaces and type definitions
  ├── utils/             # Helper utilities, date formatters, cn/clsx helpers
  ├── App.tsx            # Main application layout / routes
  └── main.tsx           # Application entry point
  ```
* **No Monoliths**: Never bundle data arrays, complex business logic, and UI markup in one gigantic file. Extract data models into `src/data/` and types into `src/types/`.

---

## 3. Technology Stack & Coding Standards
* **Framework**: Next.js 16 (App Router, static export) with React 19 and TypeScript (`strict: true`).
* **Styling**: Tailwind CSS (latest) with utility-first approach.
* **Icons**: Lucide React (`lucide-react`) for clean, uniform iconography.
* **Visual FX**: The home page is one continuous three.js scene (`src/components/home/cell/engine/`): the Chlamydomonas cell peels layer by layer, then the camera pulls back through a culture into the lab. Models are authored in Blender (`assets/blender/chlamydomonas.blend`, exported to `public/models/*.glb` with Draco); detail maps come from `assets/blender/gen_detail_maps.py`. three.js is the one WebGL library: the scene loads lazily, pauses off screen, adapts its pixel ratio to the frame rate, honours reduced motion, and every readout is plain DOM. The Explore page (`/explore`) is a CSS 3D wall, not WebGL. Elsewhere, motion is CSS (animate `transform` and `opacity`).
* **SEO**: Every page exports metadata through `src/views/metadata.ts` (canonical, hreflang, Open Graph) and adds JSON-LD from `src/utils/structuredData.ts`. New pages must also be listed in `src/app/sitemap.ts`.
* **Type Safety**: Strictly typed props, models, and states. Disallow `any` types.

---

## 4. Git & Version Control Protocol
* Do **NOT** commit changes automatically unless explicitly requested by the user.
* Maintain clean workspace staging and verify build passes (`npm run build`) before proposing commits.
