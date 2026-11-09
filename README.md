# Algal Biotechnology & Microbiology Laboratory (ABL) — Central University of Tamil Nadu

[![Astro](https://img.shields.io/badge/Astro-5.x%2F7.x-FF5D01?logo=astro&logoColor=white)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white)](https://greensock.com/)
[![Lenis](https://img.shields.io/badge/Lenis-Smooth_Scroll-black)](https://lenis.darkroom.engineering/)
[![WCAG AA](https://img.shields.io/badge/WCAG-2.2_AA_Compliant-059669)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Official Web Platform & Research Portal**  
> **Client:** Dr. Amit Kumar Bajhaiya, Head, Algal Biotechnology Laboratory  
> **Institution:** Department of Biotechnology, School of Life Sciences, Central University of Tamil Nadu (CUTN), Thiruvarur, India.

---

## 🔬 Overview & Vision

The **Algal Biotechnology & Microbiology Laboratory** at CUTN investigates microalgal physiology, metabolic pathway engineering, and photobioreactor scale-up for sustainable bioeconomy solutions.

This platform serves as the premier digital gateway for academic peers, international collaborators, research scholars, and prospective students, presenting:
1. **Pioneering Research Pillars**: Biofuels & Bioenergy, Microalgal Nutraceuticals & High-Value Metabolites, Carbon Dioxide Sequestration & Carbon Capture, and Phycoremediation / Industrial Wastewater Treatment.
2. **Laboratory Personnel Directory**: Comprehensive academic profiles, fellowships, thesis topics, and research trajectories of the Principal Investigator, Ph.D. scholars, JRF/SRF fellows, project associates, and alumni.
3. **Publications & Research Dissemination**: High-impact peer-reviewed journal papers, book chapters, patent applications, citation copying, and DOI links.
4. **Cinematic Fluid Experience**: Premium smooth scrolling via **Lenis**, cinematic viewport triggers with **GSAP ScrollTrigger**, fluid page transitions with **Motion** and **Barba.js / Astro ViewTransitions**, built strictly mobile-first with 100% WCAG AA contrast compliance.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Meta-Framework** | **Astro 5+ / 7** | High-performance content-driven static generation, island architecture, zero-JS baseline |
| **UI Components** | **React 19 + TypeScript** | Interactive islands, dynamic filters, modal sheets, and data visualization |
| **Styling & Design System** | **Tailwind CSS v4** | Mobile-first utility design, fluid typography, 8pt spacing rhythm, accessible dark/light themes |
| **Smooth Scrolling** | **Lenis** | Cinematic, momentum-based smooth scrolling |
| **Motion & Scroll Triggers**| **GSAP + ScrollTrigger** | Pinning, scrub animations, coordinate reveals, microscope zoom effects |
| **Component Animation** | **Motion (Motion One / Framer)**| Interactive card hover physics, micro-interactions, spring layouts |
| **Page Transitions** | **Barba.js / Astro ClientRouter**| Fluid, seamless multi-page transitions with zero white flashes |
| **Icons** | **Lucide React** | Clean, accessible, lightweight vector iconography |

---

## 📁 Repository Organization

```
algalbiotechlabproject/
├── assets/                       # Raw working assets (ignored by git, except used images)
│   ├── documents/                # Lab PDFs, CSV rosters, personnel templates, publication records
│   ├── blender/                  # 3D .blend files & procedural generation scripts
│   ├── raw/                      # High-res raw camera images & generated source files
│   └── used/                     # TRACKED BY GIT: Processed & actively used images
│       ├── team/                 # WebP portraits of lab personnel
│       ├── lab/                  # WebP laboratory facilities & instrumentation
│       ├── focus/                # WebP research pillar illustrations
│       └── logos/                # Official CUTN & Lab crests
├── public/                       # Static public assets served directly (draco, 3D glb, favicons)
├── src/
│   ├── assets/                   # Astro-optimized image pipeline copies
│   ├── components/               # React & Astro components (Navigation, Hero, Team, Pubs, etc.)
│   │   ├── cinematic/            # Lenis smooth scroll & GSAP controllers
│   │   ├── common/               # Bento cards, buttons, badges, section headers
│   │   ├── layout/               # Header, mobile drawer, footer, container
│   │   ├── research/             # Focus areas, research pillars, equipment
│   │   └── team/                 # Member cards, PI spotlight, alumni list
│   ├── data/                     # Typed academic datasets (members, publications, research, funders)
│   ├── layouts/                  # Base Astro layouts with cinematic transitions
│   ├── pages/                    # Astro routes (index, research, people, publications, contact)
│   ├── styles/                   # Global CSS, Tailwind configurations, fluid typography
│   └── types/                    # TypeScript interfaces & academic schemas
├── RULES_FOR_AGENTS.md           # STRICT design & engineering rules (ignored by git)
├── astro.config.mjs              # Astro configuration with React and Tailwind Vite plugins
├── tsconfig.json                 # TypeScript strict configuration
└── package.json                  # Dependencies & scripts
```

---

## 🎨 Asset Management & `.gitignore` Architecture

Per project specifications:
- The top-level `/assets/` directory holds all original documents (`.pdf`, `.xlsx`, `.csv`), Blender archives (`.blend`), and raw camera dumps. These are ignored to keep the repository light and clean.
- **Used images** are tracked via:
  ```gitignore
  /assets/*
  !/assets/used/
  !/assets/used/**
  !/assets/*.webp
  !/assets/*.png
  !/assets/*.svg
  !/assets/*.jpg
  ```
- Any personal data spreadsheets (`lab details.xlsx`) and the agent directive handbook (`RULES_FOR_AGENTS.md`) are explicitly ignored.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `>= 22.23.4` (tested on Node 24.x)
- **pnpm**: `>= 10.x` or `12.x` (or npm / yarn / bun)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd algalbiotechlabproject

# Install dependencies
pnpm install
```

### Development Server
```bash
# Start Astro development server with hot module reload
pnpm dev
# Open http://localhost:4321
```

### Production Build & Preview
```bash
# Build production-ready static bundle to dist/
pnpm build

# Preview production build locally
pnpm preview
```

---

## 📋 Strict Design & Accessibility Standards

All contributors and AI agents must adhere to the directives specified in [`RULES_FOR_AGENTS.md`](./RULES_FOR_AGENTS.md):
- **Mobile-First CSS**: Compose for 320px–480px first; progressive responsive scaling.
- **WCAG 2.2 AA Contrast**: Strict 4.5:1 text contrast and 3:1 graphical/UI contrast across all color tokens.
- **Ergonomic Touch Targets**: Minimum 44×44px interactive areas.
- **Typography Scale**: Modular Major Third scale with fluid clamp heights and max 75 character line measures.
- **Negative Spacing Rhythm**: Strict 8-point spatial cadence (`py-16 md:py-24 lg:py-32`).
- **Kinetic Elegance**: Cinematic Lenis smooth scroll, fluid transitions, with full `prefers-reduced-motion` compliance.

---

## 🏛️ Affiliation & Contact

**Dr. Amit Kumar Bajhaiya**  
Head, Algal Biotechnology & Microbiology Laboratory  
Associate Professor, Department of Biotechnology, School of Life Sciences  
Central University of Tamil Nadu (CUTN)  
Neelakudi Campus, Thiruvarur – 610 005, Tamil Nadu, India  
Website: [https://cutn.ac.in](https://cutn.ac.in)
