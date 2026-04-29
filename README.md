# AVIA — Aviation Encyclopedia

https://www.heritageconcorde.com/fuel-transfer

A scroll-animated aviation info site featuring commercial airliners, fighter jets, and jet engines. Built with Next.js 15, Framer Motion, and Tailwind CSS.

**Live site:** https://qwerty-525.github.io/ClaudeCookedHard/

---

## Running on a new machine

### 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | **18.x** (not 16, not 20+) |
| npm | 9+ (comes with Node 18) |

> **Why exactly Node 18?** Tailwind CSS v3 is used here. v4 requires Node 20+, and v3 doesn't run cleanly on Node 16. Node 18 LTS is the sweet spot.

```bash
node --version   # confirm version
```

Install Node 18 via nvm if needed:
```bash
nvm install 18
nvm use 18
```

### 2. Clone and install

```bash
git clone <your-repo-url>
cd motion
npm install
```

### 3. Run

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production export → out/
```

---

## Pages

| URL | Description |
|---|---|
| `/` | Commercial airliners — starfield hero, A380 fly-through, Concorde video, fleet cards |
| `/fighters` | Fighter jets — F-35 video hero, drop-bomb section, Mach scale, dogfight carousel, squadron cards |
| `/engines` | Jet engines — afterburner fire hero, engine type carousel, engine cards, FAQ |
| `/scrollytelling` | B-2 Spirit — 156-frame canvas scroll sequence with 4 text sections |
| `/fighters/f35` | F-35 dedicated deep-dive with stage-light scroll sequence |
| `/fighters/f117` | F-117 Nighthawk dedicated deep-dive with scroll sequence |
| `/planes/[slug]` | Commercial plane detail page (description + specs from `lib/data.ts`) |
| `/fighters/[slug]` | Fighter jet detail page |
| `/engines/[slug]` | Engine detail page |
| `/commercial` | Alternate commercial route (aliased from `/`) |

---

## Tech stack

| Library | Version | Purpose |
|---|---|---|
| Next.js | 15 | App Router, static export |
| React | 19 | UI framework |
| TypeScript | 6 | Type safety |
| Tailwind CSS | v3 | Utility styling + custom keyframes |
| Framer Motion | 12 | Scroll animations, page transitions, hover effects |
| GSAP | 3 | Supplemental animation (select sequences) |
| Three.js | 0.184 | 3D (available, used selectively) |
| lucide-react | — | Icons |
| Radix UI | — | Accessible accordion, slider, tooltip primitives |
| shadcn/ui | — | `Button`, `cn()` utility |

Custom Tailwind keyframes: `animate-streak`, `animate-marquee-vertical`, `animate-fade-in-up`.

---

## Components

### Page-level scroll sequences

| Component | Sequence folder | Frames | Used on |
|---|---|---|---|
| `ChipScroll.tsx` | `public/sequence/` | 156 | `/scrollytelling` — B-2 Spirit |
| `F35Scroll.tsx` | `public/sequence_f35stagelight/` | 131 | `/fighters/f35` |
| `F117Scroll.tsx` | `public/sequence_f117/` | 144 | `/fighters/f117` |
| `CockpitScroll.tsx` | `public/sequence_planecockpit/` | 207 | commercial page |
| `DropBombSection.tsx` | `public/sequence_dropbombs/` | 33 | `/fighters` |

Each is a sticky 400vh (or similar) scroll container that maps `scrollYProgress` to a canvas frame index, overlaid with animated text sections.

To change the frame count for any sequence, update the `TOTAL_FRAMES` constant at the top of the relevant component.

### Shared UI components

| Component | Purpose |
|---|---|
| `Nav.tsx` | Fixed pill nav — 3 tabs (Commercial, Fighter Jets, Engines). TextScramble on hover. Active tab colour matches page theme. Uses `usePageTransition` context. |
| `PlaneCard.tsx` | Grid card for fleet/squadron/engine listings. Accepts `accent` colour prop. Whole card navigates via `router.push`. Image 3D-spins on hover. |
| `FlyingPlane.tsx` | Scroll-driven plane fly-in + scale-up (phase 1: `-120vw → 0`, phase 2: `5.5×` scale). |
| `PageTransitionOverlay.tsx` | Full-screen wipe on tab change. Shows destination label in accent colour. |
| `YouTubeClipLoop.tsx` | YouTube IFrame API clip looper (150 ms poll interval). |
| `MachScale.tsx` | Animated Mach speed comparison bar chart. |
| `DogfightCarousel.tsx` | Horizontal drag carousel for dogfight stats. |
| `CompetitorCarousel.tsx` | Similar carousel for engine competitor comparisons. |
| `ConcordeVideoPlayer.tsx` | Autoplay video section for Concorde footage. |
| `SR71VideoPlayer.tsx` | SR-71 video section. |
| `GeminiChat.tsx` | Gemini AI chat assistant (local dev only — hidden on GitHub Pages build). |

### `components/ui/`

| File | Purpose |
|---|---|
| `text-scramble.tsx` | Cipher scramble on hover. Props: `text`, `textClassName`, `showUnderline`. |
| `typewriter.tsx` | Cycling typewriter effect. Mounted-guard prevents hydration mismatch. |
| `flow-button.tsx` | "Read more" pill → expanding circle fill, arrow slide. Accent-coloured. |
| `cta-with-text-marquee.tsx` | Vertical plane-name marquee with opacity fade. |
| `horizon-hero-section.tsx` | Hero section with horizon line effect. |
| `engine-type-carousel.tsx` | Scroll carousel for engine type illustrations. |
| `engine-faq.tsx` | Accordion FAQ for the engines page. |
| `spotlight.tsx` | Mouse-tracking spotlight highlight. |
| `text-explode.tsx` | Letter-explode reveal animation. |
| `container-scroll-animation.tsx` | Scroll-linked container transform. |
| `light-pull-theme-switcher.tsx` | Pull-cord theme switcher. |

---

## Data

All aircraft and engine data lives in `lib/data.ts`:

```ts
export const commercialPlanes: Aircraft[]
export const fighterJets: Aircraft[]
export const engines: Aircraft[]
```

The `Aircraft` interface:

```ts
interface Aircraft {
  slug: string         // URL segment: /planes/<slug>
  name: string
  detail: string       // e.g. "Boeing · USA"
  year: number
  fact: string         // one-liner shown on the card
  image?: string       // path in /public, e.g. "/planes/a380.png"
  description?: string // paragraph(s) for the detail page
  specs?: { label: string; value: string }[]
}
```

---

## Adding content

### Add a new aircraft or engine

Edit `lib/data.ts` and append to `commercialPlanes`, `fighterJets`, or `engines`:

```ts
{
  slug: "boeing-777",
  name: "Boeing 777",
  detail: "Boeing · USA",
  year: 1994,
  fact: "The world's largest twinjet.",
  image: "/planes/boeing777.png",   // place file in public/planes/
  description: `Longer text for the detail page. Use backtick strings for multi-line.`,
  specs: [
    { label: "Range",   value: "13,650 km" },
    { label: "Engines", value: "2× GE90" },
  ],
}
```

The detail page (`/planes/<slug>`, `/fighters/<slug>`, or `/engines/<slug>`) is populated automatically. If `description` or `specs` are omitted, the page shows a *"More information coming soon"* placeholder.

### Add a plane image

Drop a PNG into `public/planes/` and reference it as `image: "/planes/filename.png"`. Cards display it at 120×48 px with a 3D-spin on hover.

### Add a canvas scroll sequence

1. Drop numbered frames (`ezgif-frame-001.png` … `ezgif-frame-NNN.png`) into a new folder under `public/`.
2. Create a component modelled on `ChipScroll.tsx` or `F35Scroll.tsx`.
3. Update `TOTAL_FRAMES` and the `src` path pattern in the new component.

---

## Colour system

| Page | Accent | Nav wipe overlay |
|---|---|---|
| Commercial `/` | `#3b82f6` blue | `#0e2244` |
| Fighter Jets `/fighters` | `#ef4444` red | `#3b0a0a` |
| Engines `/engines` | `#f59e0b` amber | `#3d1a00` |

Base background: `#04060a` / `#0b0b10` · Muted text: `#94a3b8`

CSS variables (in `globals.css`):
```css
--primary:            45 85% 62%;   /* amber-gold scramble highlight */
--foreground:         210 40% 98%;
--border:             215 28% 17%;
--background:         222 84% 3%;
--muted-foreground:   215 16% 65%;
--secondary:          215 28% 17%;
--secondary-foreground: 210 40% 98%;
```

---

## Deployment

Pushes to `main` auto-deploy to GitHub Pages via `.github/workflows/deploy.yml`:

1. `actions/setup-node@v4` with Node 18
2. `npm ci` → `npm run build` (static export into `out/`)
3. `actions/upload-pages-artifact` → `actions/deploy-pages`

Production builds set `output: "export"`, `basePath: "/ClaudeCookedHard"`, and a custom image loader (`image-loader.ts`) so Next.js image paths resolve correctly under the sub-path.

The Gemini AI chat (`GeminiChat.tsx`) is excluded from GitHub Pages builds — it reads `NEXT_PUBLIC_GEMINI_API_KEY` from `.env.local`, which is not committed.

---

## Project conventions

- No comments unless the WHY is non-obvious.
- Deterministic pseudo-random values for animations — index arithmetic only, never `Math.random()` (causes hydration mismatch).
- Hydration-sensitive components use a `mounted` guard (`useState(false)` + `useEffect → setMounted(true)`).
- Overlay/decorative divs always get `pointer-events-none`.
- `PlaneCard` navigates via `router.push` on the whole card — no nested `<Link>` inside `<motion.article>`.
- `<p>` tags never contain `<div>` children — use `<span>` for inline animated components.
- Tab transitions use `PageTransitionOverlay` context — Nav buttons call `triggerTransition(href, accent, label)` instead of linking directly.
