---
version: 1
slug: "src-views-homeview-tsx"
primary_target: "src/views/HomeView.tsx"
related_targets: ["src/views/ResearchView.tsx","src/views/PeopleView.tsx","src/views/PublicationsView.tsx","src/views/ContactView.tsx","src/views/MemberView.tsx"]
---

# Home and site-wide world

Scope: homepage (Persuade); the same world carries Research, People, profiles, Publications and Contact. Audience, content and constraints: see PRODUCT.md.

## Direction contract

THESIS: The lab's science is one cell taken apart. The homepage is a scientific plate of *Chlamydomonas reinhardtii*: as you scroll, the cell separates layer by layer and each structure is keyed to the programme and papers that study it. It refuses the category default of a photo banner, a mission slogan and a row of research cards.

OWN-WORLD: The chromolithograph classroom wall chart. Deep green-black plate ground for figures; pale chlorophyll-tinted plate paper for reading. Every structure is drawn in the stain that reveals it: acetocarmine nucleus, Lugol iodine starch, Nile red lipid, toluidine polyphosphate, chlorophyll viridian, eyespot vermilion as the action colour. Numbered plate keys, leader lines, "Fig." captions and scale bars replace cards, pills and eyebrows. Display in Bricolage Grotesque, reading text in Literata.

STORY: The visitor sees the cell whole, watches it open, learns what each part does and which programme studies it, follows a leader line to the paper, meets the people, then writes to the lab.

FIRST VIEWPORT: A live 3D Chlamydomonas fills the right two-thirds of a dark plate, flagella beating. The plate title sits on the left: what the lab is, in one sentence, with the lab name and CUTN. Under it, "Write to the lab" in vermilion and "See the research" as a text link. Right edge: the plate key, numbers 1 to 9, with a scale bar. Nav sits along the top as a plate header.

FORM: Anatomical plate, candidate 1 of 7 (Impeccable's pick, chosen by the user over the assigned counting chamber). seed:f839d43f23453c07

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Signature interaction

Scroll-scrubbed explode: nine stages, each with a stable reading window in which the active key number, its leader line and its programme copy are set. The key items are buttons that jump to a stage (keyboard and touch). Each stage is deep-linkable (#cell-pyrenoid). Phones get a closer camera and the same stages; reduced motion shows discrete posed stages with no camera travel; no WebGL shows a rendered still of the fully exploded plate with the full key.

## Unresolved

Machine translations for new copy in eight locales (generated, flagged as unreviewed like the rest).
