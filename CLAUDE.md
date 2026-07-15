# AVIA — Aviation Encyclopedia

A scroll-animated aviation info site built with Next.js 15, Tailwind CSS v3, and Framer Motion.

## Stack

- **Framework**: Next.js 15 App Router (Node 18 compatible)
- **Styling**: Tailwind CSS v3 (not v4 — Node 18 can't run v4)
- **Animation**: Framer Motion
- **Language**: TypeScript
- **Font**: Inter (Google Fonts)
- **Icons**: lucide-react

## Route Structure

| Route | Description |
|---|---|
| `/` | Commercial airliners page |
| `/fighters` | Fighter jets page |
| `/engines` | Jet engines page |
| `/b-2` | B-2 Spirit canvas scroll sequence |
| `/commercial` | Flight deck / cockpit scroll page |
| `/planes/[slug]` | Commercial plane detail page (plus hand-built Concorde sub-pages under `/planes/concorde/*`) |
| `/fighters/[slug]` | Fighter jet detail page (F-35 and F-117 have hand-built pages at `/fighters/f35`, `/fighters/f117`) |
| `/engines/[slug]` | Engine detail page |
| `/aerodynamics` | Theory notes — aerodynamics (cyan accent) |
| `/thermodynamics` | Theory notes — thermodynamics + propulsion + combustion (emerald accent) |
| `/gas-dynamics` | Theory notes — compressible flow, shocks, nozzles, inlets (orange accent) |
| `/heat-transfer` | Theory notes — conduction/convection/radiation (purple accent) |
| `/spacecraft` | Spacecraft page (indigo accent) |

Theory pages share a common pattern: hero SVG diagram + `EqCard`/`Fr` local components for equations with explanatory notes. `components/SpecTable.tsx` renders the engineering comparison tables on the three aircraft tab pages.

## Colour Tokens

| Page | Accent | Nav wipe overlay |
|---|---|---|
| Commercial `/` | `#3b82f6` blue | `#0e2244` |
| Fighter Jets `/fighters` | `#ef4444` red | `#3b0a0a` |
| Engines `/engines` | `#f59e0b` amber | `#3d1a00` |

Base background: `#04060a` / `#0b0b10`
Muted text: `#94a3b8`

## CSS Variables (globals.css)

```css
--primary: 45 85% 62%;           /* amber-gold scramble highlight */
--foreground: 210 40% 98%;
--border: 215 28% 17%;
--background: 222 84% 3%;
--muted-foreground: 215 16% 65%;
--secondary: 215 28% 17%;
--secondary-foreground: 210 40% 98%;
```

## Key Components

| Component | Purpose |
|---|---|
| `components/Nav.tsx` | Fixed pill nav — 3 tabs (Commercial, Fighter Jets, Engines). Tab text uses TextScramble on hover. Active tab colour matches page theme. Uses `usePageTransition` for animated tab switching. |
| `components/PlaneCard.tsx` | Card for fleet/squadron/engine grids. Accepts `accent` colour prop. Clicking anywhere navigates. Image spins on hover (rotateY 3D). Uses `FlowButton` for "Read more". |
| `components/FlyingPlane.tsx` | Scroll-driven plane fly-in + scale-up. Phase 1: `-120vw → 0`. Phase 2: scale to `5.5x`. |
| `components/ChipScroll.tsx` | B-2 Spirit 156-frame canvas sequence. Sticky 400vh scroll container. 4 text sections. |
| `components/YouTubeClipLoop.tsx` | YouTube IFrame API clip looper (150ms poll). |
| `components/PageTransitionOverlay.tsx` | Full-screen black wipe on tab change. Shows destination label in accent colour. |
| `components/ui/text-scramble.tsx` | Cipher scramble effect on hover. Props: `text`, `textClassName`, `showUnderline`. |
| `components/ui/typewriter.tsx` | Typewriter cycling effect. Mounted-guard prevents hydration mismatch. |
| `components/ui/flow-button.tsx` | "Read more" button — pill morphs to rect, expanding circle fill, arrow slide. Accent-coloured. |
| `components/ui/cta-with-text-marquee.tsx` | Vertical plane-name marquee with opacity fade. Used on commercial page. |

## Data

All aircraft/engine data lives in `lib/data.ts` and exports:
- `commercialPlanes: Aircraft[]`
- `fighterJets: Aircraft[]`
- `engines: Aircraft[]`

The `Aircraft` interface has: `slug`, `name`, `detail`, `year`, `fact`, `image?`, `description?`, `specs?`, plus `highlights?` ("At a glance" bullets, `**bold**` markup rendered via `lib/text.tsx` `renderBold`), `compare?` (normalized `CompareSpec` powering the home-page compare feature — row config in `lib/compare.ts`, UI in `components/compare/`), and `relatedEngines?` (engine slugs for detail-page cross-links).

Images live in `public/planes/`: `a380.png`, `boeing747.png`, `concorde.png`, `f35.png`.
B-2 canvas frames: `public/sequence/ezgif-frame-001.png` … `ezgif-frame-156.png`.

## Patterns & Preferences

- No comments unless the WHY is non-obvious
- Deterministic pseudo-random values for animations (index arithmetic, no `Math.random()` — causes hydration mismatch)
- Hydration-sensitive components use a `mounted` guard (`useState(false)` + `useEffect → setMounted(true)`)
- Overlay/decorative divs always get `pointer-events-none`
- PlaneCard navigates via `router.push` on the whole card — no nested `<Link>` inside `<motion.article>`
- `<p>` tags never contain `<div>` children — use `<span>` for inline animated components
- Tab transitions use `PageTransitionOverlay` context — Nav buttons call `triggerTransition(href, accent, label)` instead of linking directly
