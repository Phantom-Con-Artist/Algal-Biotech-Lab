# Session handoff: Algal Biotechnology Laboratory website

Last updated: 2026-11-09. Read this first in a new conversation.

## Project in one paragraph

Astro 7 static site for the Algal Biotechnology Laboratory (Department of Microbiology, CUTN, Thiruvarur; PI Dr. Amit Kumar Bajhaiya). It uses:
- Tailwind 4 plus a hand-written design system in `src/styles/global.css`
- GSAP (ScrollTrigger, SplitText) and Lenis for inertia scroll in lerp mode
- Barba.js for page transitions
- Remotion (`/motion`) for every video

It deploys to Cloudflare, where **the total deploy budget is 25 MB**. The current `dist` is about 15 MB.

## Design direction (agreed with the user)

- **Feel:** it should feel like studiokalex.com in layout, interactions and browsing.
- **Colour:** true black and white UI; the only colour comes from images and video.
- **Type:** one typeface, Poppins 500, using Kalex sizes and tracking (the tokens are at the end of `global.css`).
- **Banned:** decorative dots, "·" separators, eyebrow/kicker labels, buzzword copy.
- **Hero:** an edge-to-edge carousel of big 3:4 cards with no labels, mixing fast-cut video and stills.
- **Motion:** relevant to the lab, fast cuts, cinematic, and never overdone.
- **Kalex patterns reused:**
  - the "Introducing [pill] studiokalex" pill-to-card
  - the diagonal blur-and-mask sweep page transition
  - the transparent header with `mix-blend-mode: difference`
  - the bottom progressive blur
  - the startup film

## What was built this session

1. **Startup film** (`Layout.astro` markup, `playStartup()` in `src/scripts/app.ts`)
   - Plays on the first visit in a session (`sessionStorage 'abl-intro'`).
   - The film is `public/clips/cut/intro.mp4`: 7 s of accelerating cuts, 1.8 MB. Words are synced to the cuts (`FILM_WORDS`), and "Algal Biotechnology Laboratory" rises at 5.07 s.
   - At the end, the frame shrinks into the first hero card.
   - A click, key, wheel or touch skips it.
   - The video is `preload="none"` and loads only when it plays.
   - With save-data, or if playback fails, it falls back to a short delay.
   - The loading counter was removed at the user's request.
   - **Replay:** the footer has a "Watch the intro film" button (`[data-replay-intro]`), which calls `playStartup(screen, true)`.
2. **Hero carousel** (`src/pages/index.astro`, `mountCarousel()` in `src/scripts/home.ts`)
   - 12 cards: 8 fast-cut videos (`public/clips/cut/{colonies,bench,leaf,moss,insects,growth,microscope,water}.mp4`, about 0.1–0.4 MB each, six shots of 11 frames) and 4 stills (`src/assets/stills/*.jpg`).
   - No captions. Cards are `clamp(260px, 38vw, 620px)`.
   - Autoplays every 3 s, can be dragged, and has previous/next buttons.
   - Card videos play only while on screen.
3. **Programmes carousel**
   - The old tabs were replaced by an edge-to-edge, non-looping, manual carousel (`data-carousel-loop="false" data-carousel-auto="false"`).
   - It uses the six Remotion process clips in `public/clips/*.mp4`.
   - Drag no longer triggers link clicks: pointer capture starts only after 4 px of movement.
4. **"Inside [pill] the laboratory"** (`.k-intro`, `home.ts`)
   - Fixed: the old clip-path string tween broke because the browser normalises `inset()`. It now tweens one number and rebuilds the inset.
   - The phrase is centred as a group, since the two words differ in length.
   - Inside the card plays `public/clips/cut/lab.mp4` (1.2 MB), made by the `lab-aura` composition (`motion/src/LabAura.tsx`). It is Kalex-style glow motion graphics:
     - a glowing cell with flagella, opening like an iris onto the user's real lab photos (`assets/new` → `motion/public/lab/new/nNN.jpg`)
     - fast cuts with heat/thermal, mono, wave and liquid SVG filters and equipment labels
     - an orb that divides, then an end card
5. **Footage**
   - Free Mixkit stock (free licence, no attribution needed), stored in `motion/public/footage/` (gitignored, 227 MB).
   - Compositions: `motion/src/Cut.tsx` (`intro`, `cut-*`), `LabAura.tsx` (`lab-aura`), and `LabFilm.tsx` (`lab-film`, an earlier version that is unused).
   - Render with: `npx remotion render <id> out.mp4 --codec=h264 --crf=27..29 --x264-preset=slow --muted`.
   - For ffmpeg, use `motion/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`; it has libx264 but few filters. Add `-strict unofficial` when writing JPEGs.
6. **Removed:** the old still-based card clips (`public/clips/cards`) and the counter loading screen.

## Verified working (headless Chromium screenshots)

- Mobile (390 px): "Inside the laboratory" fits and is centred (pill 72×36, words 6.4vw); the footer email stays on one line (7.6vw). There is no horizontal overflow on the home page.

- Startup film words centred, title reveal, landing in the hero card.
- Programmes carousel layout.
- k-intro pill-to-card animation and centring.
- The build passes (`pnpm build`).

## Next session: to do

1. **Performance optimisation (the user's main request):**
   - Run Lighthouse on `pnpm preview`.
   - Check LCP for the hero: the first card video poster and the h1 font.
   - Consider preloading `/clips/cut/colonies.webp` and Poppins 500.
   - Drop unused Poppins weights (400, 500-italic, 600) if they are unused.
   - Audit the JS bundle (GSAP plugins, Barba, Lenis).
   - Make sure off-screen videos stay `preload="none"`.
   - Review the cost of the 6-layer `.bottom-blur` `backdrop-filter`.
   - Check the Barba sweep for jank, since it animates `filter: blur` on whole pages.
   - Watch CLS from the carousel entry tween.
2. **Inspect in a real browser:**
   - the sweep page transition mid-animation
   - the intro replay from the footer on an inner page
   - carousel drag on touch
   - mobile layouts: inner pages, footer, intro film at portrait width
3. **Inner pages:** Research, People, Contact and the profile page do not yet have Kalex-style media cards under the title. The Research page still uses `Clip.astro` with flow captions.
4. **Clean-up:**
   - Delete `motion/src/LabFilm.tsx`, `Reel.tsx` and `Card.tsx` if they stay unused.
   - `src/components/site/Flow.astro` is unused.
   - `assets/raw/public-legacy/` holds the 19 MB of old assets that were moved out of `public/`.
5. Re-run the Impeccable detector or audit after the changes and report scores.
6. When the user supplies more lab images, add them to `motion/public/lab/new/`, extend `CUTS` in `LabAura.tsx`, re-render `lab-aura`, and copy the result to `public/clips/cut/lab.mp4` with a poster frame at about 4.2 s.

## Gotchas learned

- GSAP resets the CSS `translate` property (sets it to `none`). Centre with layout (grid or inset), or use xPercent/yPercent.
- GSAP reads a CSS `translateY(110%)` as pixels. Use `fromTo` with `y: 0`.
- Never select the startup overlay with `[data-startup]`, because `<html>` carries that attribute. Use `[data-startup-screen]`.
- No HTML comments inside `{cond && (...)}` in Astro templates.
- Remotion props must be `type` aliases, not interfaces. The motion `kit.tsx` still uses Schibsted for the programme clips; the new films use Poppins.
- The dev server runs at `localhost:4321`. Screenshot scripts use playwright-core in the scratchpad, with Chromium at `~/.cache/ms-playwright/chromium-1254/chrome-linux64/chrome`.
