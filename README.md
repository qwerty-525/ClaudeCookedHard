# AVIA — Aviation Encyclopedia

how to get started:
1. npm install, npm run build
2. npm start/ npm run dev

components resources:
https://21st.dev/home
https://omma.build/


**Live site:** https://qwerty-525.github.io/ClaudeCookedHard/

A scroll-animated aviation encyclopedia covering commercial airliners, fighter jets, and jet engines — with a live global flight tracker, canvas-based scrollytelling, and page transition animations.

Built with Next.js 15, React 19, Tailwind CSS v3, and Framer Motion.

---

## Table of Contents

1. [What this project is](#what-this-project-is)
2. [Tech stack — explained for beginners](#tech-stack--explained-for-beginners)
3. [Getting started (running locally)](#getting-started-running-locally)
4. [Folder structure](#folder-structure)
5. [Pages and routes](#pages-and-routes)
6. [Components](#components)
7. [Data — how aircraft info is stored](#data--how-aircraft-info-is-stored)
8. [Live flight data (OpenSky Network)](#live-flight-data-opensky-network)
9. [Animations — how they work](#animations--how-they-work)
10. [Colour system](#colour-system)
11. [Where to add YOUR notes (start here)](#where-to-add-your-notes-start-here)
12. [Deployment to GitHub Pages](#deployment-to-github-pages)
13. [Project conventions](#project-conventions)

---

## What this project is

AVIA is an aviation reference site that feels more like a museum than a Wikipedia article. It has:

- **A live global flight tracker** — shows British Airways, Singapore Airlines, and Air France flights currently in the air, plotted on a 3D globe
- **Scroll-linked canvas animations** — hundreds of PNG frames stitched together so scrolling "plays" a video (like Apple's product pages)
- **Animated page transitions** — full-screen colour wipes when switching between sections
- **Aircraft deep-dives** — specs, history, and engineering breakdowns for commercial planes, fighter jets, and engines
- **An AI chat assistant** (local dev only) powered by Google Gemini, contextual to whichever aircraft section you're in

---

## Tech stack — explained for beginners

If you're new to web development, here's what each piece of the stack actually does:

| Tool | What it does | Beginner analogy |
|---|---|---|
| **Next.js 15** | The framework that runs the whole site — handles routing (URLs), builds the final files, and serves pages | The scaffolding of a building |
| **React 19** | Lets you write the UI as reusable components (like `<PlaneCard />`, `<Nav />`) rather than raw HTML | Lego bricks for the interface |
| **TypeScript** | JavaScript with type safety — you declare what kind of data a variable holds, and the compiler warns you if you misuse it | Spell-check, but for your code logic |
| **Tailwind CSS v3** | Utility-first styling — instead of writing separate CSS files, you put class names directly in the HTML like `className="text-white bg-black"` | Inline styles, but with superpowers |
| **Framer Motion** | A React library for animations — scroll effects, hover effects, page transitions | A choreographer for your components |
| **GSAP** | Another animation library, used for a few specific high-performance sequences | A second choreographer for the tricky parts |
| **react-globe.gl** | Renders the 3D globe using WebGL (your GPU) | A spinning Earth that you can plot data on |
| **Three.js** | The 3D graphics engine behind the globe | The engine in the globe car |
| **Radix UI** | Pre-built accessible UI primitives (accordions, sliders, tooltips) that work correctly with screen readers | Pre-built furniture you can re-upholster |

> **Why Node 18 specifically?** Tailwind CSS v3 (used here) runs on Node 18. v4 requires Node 20+. Node 16 has too-old internals. Node 18 LTS is the exact sweet spot for this project.

---

## Getting started (running locally)

### Step 1 — Install Node 18

Check your version first:
```bash
node --version
```

If it's not `v18.x.x`, install Node 18 using `nvm` (Node Version Manager):
```bash
nvm install 18
nvm use 18
```

### Step 2 — Clone and install dependencies

```bash
git clone https://github.com/qwerty-525/ClaudeCookedHard.git
cd ClaudeCookedHard
npm install
```

`npm install` reads `package.json` and downloads all the libraries the project needs into a `node_modules/` folder.

### Step 3 — Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser. Changes you make to files update live in the browser (this is called "hot reloading").

### Step 4 — (Optional) Refresh the live flight snapshot

The flight data shown on the globe is saved in a JSON file at build time. To refresh it with real live flights:

```bash
npm run snapshot
```

This calls `scripts/snapshot-opensky.mjs`, which reaches out to the OpenSky Network API, grabs all currently-airborne BA/SQ/AF flights, fetches aircraft metadata for each, and writes the results to `lib/opensky-snapshot.json`. No API key needed — OpenSky is free.

### All available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server at http://localhost:3000 |
| `npm run build` | Build the production static site into the `out/` folder |
| `npm run snapshot` | Fetch fresh live flight data and save to `lib/opensky-snapshot.json` |

---

## Folder structure

```
ClaudeCookedHard/
│
├── app/                        ← Next.js pages (every folder = a URL)
│   ├── layout.tsx              ← Root layout: Nav, page transition provider, chat widget
│   ├── page.tsx                ← Home page "/"
│   ├── globals.css             ← Global CSS variables and base styles
│   ├── commercial/page.tsx     ← "/commercial"
│   ├── planes/[slug]/page.tsx  ← "/planes/boeing-747", "/planes/concorde", etc.
│   ├── fighters/page.tsx       ← "/fighters"
│   ├── fighters/[slug]/page.tsx← "/fighters/f-22-raptor", etc.
│   ├── fighters/f35/page.tsx   ← "/fighters/f35" (dedicated page)
│   ├── fighters/f117/page.tsx  ← "/fighters/f117" (dedicated page)
│   ├── engines/page.tsx        ← "/engines"
│   ├── engines/[slug]/page.tsx ← "/engines/ge90", etc.
│   ├── b-2/page.tsx            ← "/b-2" (B-2 Spirit showcase)
│   ├── thermodynamics/page.tsx ← "/thermodynamics"
│   ├── gas-dynamics/page.tsx
│   ├── heat-transfer/page.tsx
│   ├── aerodynamics/page.tsx
│   ├── spacecraft/page.tsx
│   └── api/                    ← API routes (dev only — excluded from static build)
│       ├── aviationstack/refresh/route.dev.ts
│       └── opensky/positions/route.dev.ts
│
├── components/                 ← Reusable React components
│   ├── ui/                     ← Small, generic UI building blocks
│   └── *.tsx                   ← Feature-specific components (globe, cards, scroll sequences)
│
├── lib/                        ← Data, types, and API logic
│   ├── data.ts                 ← All aircraft/engine information (39 KB)
│   ├── famous.ts               ← Famous airports, airlines, and routes
│   ├── opensky.ts              ← OpenSky API integration and types
│   ├── aviationstack.ts        ← AviationStack API integration (backup data source)
│   ├── utils.ts                ← Utility: cn() for combining class names
│   ├── opensky-snapshot.json   ← Cached live flight data (updated via npm run snapshot)
│   └── aviationstack-snapshot.json ← Backup cached flight data
│
├── scripts/                    ← Node.js scripts that run outside the browser
│   ├── snapshot-opensky.mjs    ← Fetches live flights from OpenSky (run with npm run snapshot)
│   └── snapshot-aviationstack.mjs ← Alternative snapshot script (requires API key)
│
├── public/                     ← Static files served directly (images, videos, 3D models)
│   ├── planes/                 ← Aircraft PNG images (a380.png, boeing747.png, etc.)
│   ├── models/                 ← 3D models (concorde.glb)
│   ├── sr71d2n.mp4             ← SR-71 video
│   ├── concorded2n.mp4         ← Concorde video
│   ├── sequence/               ← 156 PNG frames for the B-2 Spirit scroll animation
│   ├── sequence_dropbombs/     ← 33 frames for the bomb drop animation
│   ├── sequence_f117/          ← 144 frames for the F-117 reveal
│   ├── sequence_f35stagelight/ ← 131 frames for the F-35 stage light animation
│   ├── sequence_papermorphing/ ← 53 frames for paper → aircraft morph
│   └── sequence_planecockpit/  ← 207 frames for the cockpit reveal
│
├── .github/workflows/
│   └── deploy.yml              ← GitHub Actions: auto-deploy to GitHub Pages on every push
│
├── next.config.ts              ← Next.js configuration (static export, basePath, image loader)
├── tailwind.config.ts          ← Tailwind theme customisation and custom animations
├── tsconfig.json               ← TypeScript settings
├── package.json                ← Project info and dependency list
└── image-loader.ts             ← Custom image URL resolver for GitHub Pages sub-path
```

### What `[slug]` means in a folder name

`[slug]` is Next.js's syntax for a **dynamic route** — a single page file that handles many different URLs. `/planes/[slug]/page.tsx` handles `/planes/boeing-747`, `/planes/airbus-a380`, `/planes/concorde`, and every other plane slug. The page reads the `slug` from the URL and looks up the matching aircraft in `lib/data.ts`.

### What `.dev.ts` means in a filename

Files ending in `.dev.ts` are **excluded from the production build**. This is configured in `next.config.ts` using `pageExtensions`. These are API routes that write to local files — something that only makes sense in development, not on a static GitHub Pages site.

---

## Pages and routes

| URL | What you see |
|---|---|
| `/` | Home — live flight globe, A380 fly-through, Concorde video, competitor carousel, fleet cards |
| `/commercial` | Alternative commercial landing (same content, different slug) |
| `/planes/[slug]` | Detail page for any commercial aircraft (specs, description, engineering notes) |
| `/planes/concorde` | Concorde-specific showcase with dedicated video player |
| `/fighters` | Fighter jets — F-35 hero, bomb drop animation, Mach speed chart, dogfight carousel, squadron cards |
| `/fighters/f35` | F-35 deep-dive with 131-frame stage-light scroll sequence |
| `/fighters/f117` | F-117 Nighthawk deep-dive: paper → aircraft morph, then 144-frame reveal |
| `/fighters/[slug]` | Detail page for any fighter jet |
| `/engines` | Jet engines — afterburner hero, engine type carousel, FAQ, engine cards |
| `/engines/[slug]` | Detail page for any jet engine |
| `/b-2` | B-2 Spirit — 156-frame canvas scroll sequence with 4 annotated sections |
| `/thermodynamics` | Thermodynamics reference page |
| `/gas-dynamics` | Gas dynamics reference page |
| `/heat-transfer` | Heat transfer reference page |
| `/aerodynamics` | Aerodynamics reference page |
| `/spacecraft` | Spacecraft reference page |

---

## Components

### The navigation (`Nav.tsx`)

The top navigation is a fixed pill bar with tabs for each major section. Each tab:
- Uses a `TextScramble` effect on hover (letters cycle through random characters before resolving to the real word)
- Triggers a full-screen colour wipe transition instead of a normal page link
- Highlights in the accent colour of the current page (blue for commercial, red for fighters, amber for engines)

### Page transitions (`PageTransitionOverlay.tsx`)

When you click a tab, a coloured overlay slides in, the URL changes, then the overlay slides out. This is managed by a React Context (`usePageTransition`) so any component anywhere can trigger a transition without tangling the navigation code.

### The live flight globe (`CommercialDashboard.tsx` + `FlightGlobe.tsx`)

Two components work together:

- **`CommercialDashboard.tsx`** — the overall panel. It holds the current snapshot in React state, displays four tabs (Flights, Airports, Airlines, Airplanes), has a manual refresh button (dev only), and auto-refreshes flight positions every 60 seconds in dev mode.
- **`FlightGlobe.tsx`** — the actual 3D globe. It uses `react-globe.gl` to render:
  - Animated arcs for famous routes (LHR→JFK, SIN→CDG, etc.)
  - Cyan dots for live aircraft positions
  - Country name labels faintly printed across continents
  - Cycling amber labels that show the flight number and altitude of one aircraft at a time

### Scroll sequence components

These are the most technically interesting components. Each one:
1. Pre-loads hundreds of PNG frames into memory using `new Image()`
2. Creates a sticky scroll container (400vh tall, or similar) so the viewport stays "inside" the component for a long scroll
3. Uses `useScroll` + `useTransform` from Framer Motion to turn the scroll position into a number from 0–1
4. Multiplies that number by the total frame count to get the current frame index
5. Draws that frame onto a `<canvas>` element 60 times per second using `requestAnimationFrame`
6. Fades in/out text sections at specific scroll milestones

| Component | Folder | Frames | Location |
|---|---|---|---|
| `ChipScroll.tsx` | `public/sequence/` | 156 | `/b-2` (B-2 Spirit reveal) |
| `CockpitScroll.tsx` | `public/sequence_planecockpit/` | 207 | Home page |
| `F35Scroll.tsx` | `public/sequence_f35stagelight/` | 131 | `/fighters/f35` |
| `F117Scroll.tsx` | `public/sequence_f117/` + `sequence_papermorphing/` | 144 + 53 | `/fighters/f117` |
| `DropBombSection.tsx` | `public/sequence_dropbombs/` | 33 | `/fighters` |

### Cards (`PlaneCard.tsx`)

Every aircraft in a grid or list is a `PlaneCard`. It accepts:
- `name`, `detail`, `year`, `fact` — text content
- `accent` — a hex colour string that tints the card border and button (blue for commercial, red for fighters, amber for engines)
- `image` — optional path to a PNG in `public/`
- `href` — the URL to navigate to when clicked
- `status` — `"active"`, `"legacy"`, or `"retired"` — shows a coloured dot

The whole card is a clickable area (uses `router.push` on the `<motion.article>` wrapper) rather than a nested `<Link>`, which avoids invalid HTML nesting issues.

### AI chat (`GeminiChat.tsx`)

A floating chat bubble in the bottom-right corner that connects to the Google Gemini API. It reads which page you're on and injects the relevant aircraft data as context, so you can ask "what's the range of the A380?" and get a grounded answer. Requires `NEXT_PUBLIC_GEMINI_API_KEY` in a `.env.local` file — this file is not committed to git, so the chat is invisible on the deployed GitHub Pages site.

### Other notable components

| Component | What it does |
|---|---|
| `FlyingPlane.tsx` | A plane image that flies in from off-screen left as you scroll, then scales up to fill the screen in a second phase |
| `MachScale.tsx` | A horizontal bar chart comparing aircraft maximum speeds on a Mach scale, with a colour gradient from orange to deep red |
| `CompetitorCarousel.tsx` | Horizontal drag carousel showing head-to-head Boeing vs Airbus matchups (737 vs A320, 747 vs A380, etc.) |
| `DogfightCarousel.tsx` | Same idea for fighter jets (F-15 vs MiG-29, F-35 vs Su-57, etc.) with combat records |
| `YouTubeClipLoop.tsx` | Embeds a YouTube video and loops a specific clip (defined by start/end seconds) using the YouTube IFrame API |
| `SR71VideoPlayer.tsx` | Plays a local SR-71 video file; the background switches between day and night themes using a pull-cord toggle |
| `AviationLoader.tsx` | A loading spinner that shows aviation-themed verbs ("TAXIING…", "CLIMBING…", etc.) |

### UI building blocks (`components/ui/`)

| File | What it does |
|---|---|
| `text-scramble.tsx` | Text that scrambles through random characters before settling — used on Nav hover |
| `typewriter.tsx` | Text that types itself out letter by letter, cycling through multiple strings |
| `flow-button.tsx` | A "Read more" button that morphs from pill to rectangle with a circular fill animation |
| `cta-with-text-marquee.tsx` | A vertical scrolling list of aircraft names with an opacity fade at the edges |
| `spotlight.tsx` | A circular spotlight that follows your mouse cursor |
| `text-explode.tsx` | Individual letters that explode outward on a trigger |
| `engine-type-carousel.tsx` | A carousel specific to the engines page showing turbofan, turbojet, turboprop, etc. |
| `engine-faq.tsx` | An accordion FAQ component for the engines page |
| `light-pull-theme-switcher.tsx` | A pull-cord toggle that switches between light and dark themes |

---

## Data — how aircraft info is stored

All aircraft and engine data lives in `lib/data.ts`. It's a plain TypeScript file — no database, no API call. Just exported arrays of objects.

```ts
// Three arrays, one for each section
export const commercialPlanes: Aircraft[]
export const fighterJets: Aircraft[]
export const engines: Aircraft[]
```

Each item follows the `Aircraft` interface:

```ts
interface Aircraft {
  slug: string          // The URL path: "boeing-747" → /planes/boeing-747
  name: string          // Display name: "Boeing 747"
  detail: string        // Subtitle: "Boeing · USA"
  year: number          // Year of first flight or service entry
  fact: string          // One-liner shown on the card: "The original jumbo jet."
  role?: string         // Optional role label: "Wide-body", "Supersonic", etc.
  roleColor?: string    // Hex colour for the role badge
  status?: string       // "active" | "legacy" | "retired"
  image?: string        // Path from /public: "/planes/a380.png"
  description?: string  // Multi-paragraph text for the detail page
  specs?: {
    label: string       // e.g. "Range"
    value: string       // e.g. "13,450 km"
  }[]
  routes?: string[]     // Notable routes this aircraft flies
  // ... and more optional fields for engineering details
}
```

The detail pages (`/planes/[slug]/page.tsx`, `/fighters/[slug]/page.tsx`, `/engines/[slug]/page.tsx`) look up the matching object from these arrays by slug and render the `description` and `specs` automatically. If an aircraft has no `description`, the page shows a placeholder.

`lib/famous.ts` stores a separate set of reference data that the globe and dashboard use:
- `FAMOUS_AIRPORTS` — 20 major global airports with IATA codes, ICAO codes, coordinates, and countries
- `FAMOUS_AIRLINES` — 15 major airlines with IATA/ICAO codes and callsigns
- `FAMOUS_ROUTES` — 22 scheduled routes between famous airports (used for the globe arcs)

---

## Live flight data (OpenSky Network)

### The problem with real-time data on a static site

GitHub Pages serves static files — there's no server running. You can't make live API calls from a static site. The solution is a **snapshot pattern**:

1. Run `npm run snapshot` on your local machine
2. This fetches live data and saves it to `lib/opensky-snapshot.json`
3. Commit and push that file
4. The Next.js build bundles the JSON file into the static site
5. Visitors see real flight data — frozen at the moment you ran the snapshot

### What OpenSky Network provides

[OpenSky Network](https://opensky-network.org) is a non-profit that aggregates ADS-B signals from volunteer receiver stations around the world. ADS-B is the transponder system that aircraft use to broadcast their position, altitude, speed, and callsign to air traffic controllers.

- **Free** — no API key, no monthly limits for anonymous use
- **Genuinely live** — data is seconds old, not hours
- **What you get per flight**: ICAO24 transponder code, callsign, position (lat/lon), altitude (metres), ground speed (m/s), heading, vertical rate, and whether the aircraft is on the ground

### How the snapshot script works (`scripts/snapshot-opensky.mjs`)

```
1. Fetch https://opensky-network.org/api/states/all
   → Returns ~8,000+ aircraft currently tracked worldwide

2. Filter: keep only flights whose callsign starts with BAW (British Airways),
   SIA (Singapore Airlines), or AFR (Air France)
   → Down to ~60-75 flights

3. Exclude aircraft on the ground

4. For each aircraft, in batches of 8:
   a. Fetch https://opensky-network.org/api/metadata/aircraft/icao/{icao24}
      → Gets registration (e.g. G-STBA), model (e.g. Boeing 777-336ER), manufacturer
   b. Fetch https://opensky-network.org/api/flights/aircraft?icao24={}&begin={}&end={}
      → Gets the departure and arrival airport for the current flight (ICAO codes)

5. Convert ICAO airport codes → country names
   (e.g. EGLL → United Kingdom, WSSS → Singapore)

6. Convert callsigns to IATA flight numbers
   (e.g. BAW173 → BA173, SIA22 → SQ22, AFR7 → AF7)

7. Interleave airlines in round-robin order so the table shows
   BA/SQ/AF mixed, not all BA then all SQ then all AF

8. Write lib/opensky-snapshot.json
```

### Auto-refresh in dev mode

When running `npm run dev`, the dashboard automatically refreshes flight positions every 60 seconds by calling `/api/opensky/positions` (a local API route defined in `app/api/opensky/positions/route.dev.ts`). This route re-fetches `states/all` and updates the positions of flights already in the snapshot, without re-downloading metadata and routes. The `.dev.ts` extension means this route is excluded from the production build.

### The data flow

```
npm run snapshot
    ↓
scripts/snapshot-opensky.mjs   (Node.js, runs once locally)
    ↓
lib/opensky-snapshot.json      (committed to git)
    ↓
app/page.tsx                   (imports the JSON at build time)
    ↓
CommercialDashboard.tsx        (receives it as a prop, holds it in React state)
    ↓
FlightGlobe.tsx                (renders dots on the globe)
    ↓
FlightsTable / AircraftTable   (renders the data tables)
```

---

## Animations — how they work

### Scroll-linked animations (Framer Motion)

Most animations use `useScroll()` and `useTransform()` from Framer Motion:

```tsx
const { scrollYProgress } = useScroll({ target: containerRef })
// scrollYProgress is a value from 0 to 1 as you scroll through the container

const x = useTransform(scrollYProgress, [0, 1], ["-120vw", "0vw"])
// x goes from -120vw (off-screen left) to 0vw (centred) as you scroll
```

### Canvas frame sequences

The scroll-linked "video" effect works like a flip book. For example, the B-2 Spirit sequence (`ChipScroll.tsx`):

```
public/sequence/ezgif-frame-001.png
public/sequence/ezgif-frame-002.png
...
public/sequence/ezgif-frame-156.png
```

On component mount, all 156 images are pre-loaded into an array. Then on every animation frame:

```
frameIndex = Math.round(scrollProgress × 155)  // 0 to 155
ctx.drawImage(images[frameIndex], 0, 0)         // paint that frame to canvas
```

This is why scrolling through these sections feels like a video — it's hundreds of still images played back at scroll speed.

### Page transitions

Clicking a nav tab:
1. Calls `triggerTransition(href, accentColor, label)` from the `PageTransitionOverlay` context
2. A full-screen coloured div animates in (Framer Motion `animate` from `scaleX: 0` to `scaleX: 1`)
3. `router.push(href)` navigates to the new page while the overlay is covering the screen
4. The overlay animates out

---

## Colour system

Each section of the site has a consistent accent colour:

| Section | Accent colour | Use |
|---|---|---|
| Commercial `/` | `#3b82f6` (blue) | Nav active tab, card borders, globe arcs |
| Fighter Jets `/fighters` | `#ef4444` (red) | Nav active tab, card borders |
| Engines `/engines` | `#f59e0b` (amber) | Nav active tab, card borders |

Base background throughout: `#04060a` or `#0b0b10` (near-black, slightly blue-tinted)

Muted text: `#94a3b8` (slate-400)

Accent for globe flight labels: `#f59e0b` (amber)

Accent for live position dots: `#22d3ee` (cyan-400)

CSS variables defined in `globals.css` and used by Radix components:

```css
--primary:               45 85% 62%;   /* amber-gold */
--foreground:            210 40% 98%;  /* near-white */
--border:                215 28% 17%;  /* dark slate */
--background:            222 84% 3%;   /* near-black */
--muted-foreground:      215 16% 65%;  /* grey */
--secondary:             215 28% 17%;
--secondary-foreground:  210 40% 98%;
```

---

## Editing the Concorde deep-dive pages (beginner guide)

This section explains how to change the text and numbers on the two sub-pages that open when you click "Explore more" on the Concorde page:

- **Wing page** — `app/planes/concorde/wing/page.tsx`
- **Flight control page** — `app/planes/concorde/flightcontrol/page.tsx`

Both files have exactly the same structure, so if you learn one you know both.

---

### Opening the file

Open the file in VS Code. You don't need to understand most of it — you only need to edit three areas, all near the top of the file.

---

### Area 1 — The hero text (the big title at the top of the page)

Scroll down until you see this block (it's inside the `return` section, after the specs strip):

```tsx
<section className="px-10 py-20 md:px-16">
  <p ...>
    01 — Aerodynamics        {/* ← small label above the title */}
  </p>
  <h1 ...>
    Ogival Delta Wing        {/* ← the big page title */}
  </h1>
  <p ...>
    An S-curved leading edge...   {/* ← the subtitle paragraph */}
  </p>
</section>
```

**To change the title**, find the text between `<h1 ...>` and `</h1>` and replace it.

**To change the subtitle**, find the text between the second `<p ...>` and `</p>` and replace it.

---

### Area 2 — The four number boxes (`SPECS`)

Near the very top of the file, find the `SPECS` array. It looks like this:

```tsx
const SPECS = [
  { value: "167.2 m²", label: "Wing Area" },
  { value: "25.6 m",   label: "Wing Span" },
  { value: "84°",      label: "Apex Sweep" },
  { value: "7.5 : 1",  label: "L/D at Cruise" },
]
```

Each `{ value: "...", label: "..." }` is one of the four number boxes that appear in a row near the top of the page.

- `value` — the big number or stat shown in white (e.g. `"167.2 m²"`)
- `label` — the small caption underneath it (e.g. `"Wing Area"`)

**To change a number**, replace the text inside the quotes next to `value:`.

**To change a label**, replace the text inside the quotes next to `label:`.

**Keep the commas** — every entry except the last one has a comma after the closing `}`.

---

### Area 3 — The main content sections (`SECTIONS`)

This is where all the article-style text lives. Find the `SECTIONS` array near the top of the file:

```tsx
const SECTIONS = [
  {
    label: "Geometry",
    title: "The Ogee Planform",
    body: "The term 'ogival delta' describes...",
    stats: [{ value: "55°", label: "Root Sweep" }, { value: "84°", label: "Apex Sweep" }],
  },
  {
    label: "Vortex Lift",
    title: "Conical Vortex at Low Speed",
    body: "Below Mach 0.5, Concorde flies...",
    stats: [{ value: "10–17°", label: "Approach AoA" }, { value: "40%", label: "Vortex Lift" }],
  },
  // ... more sections
]
```

Each `{ ... }` block inside `SECTIONS` is one article section on the page. It has four fields:

| Field | What it controls |
|---|---|
| `label` | The small text above the title (e.g. `"Geometry"`) |
| `title` | The large section heading |
| `body` | The paragraph of text (the long string in quotes) |
| `stats` | Two stat boxes below the paragraph — each has a `value` and a `label` |

**To change body text**, replace the long string next to `body:`. Keep the opening and closing `"` quote marks (or backticks `` ` `` if the text is already wrapped in them).

**To add a new section**, copy one of the existing blocks (from `{` to `},`) and paste it at the end of the array, just before the closing `]`. Change all four fields to your new content.

**To remove a section**, delete the entire block from its opening `{` to its closing `},` (including the comma).

---

### Quick example — changing the Wing page title and first section body

Open `app/planes/concorde/wing/page.tsx`. Find:

```tsx
<h1 ...>
  Ogival Delta Wing
</h1>
```

Change `Ogival Delta Wing` to whatever you want, e.g. `The Delta Wing — How It Works`.

Then find the first entry in `SECTIONS`:

```tsx
{
  label: "Geometry",
  title: "The Ogee Planform",
  body: "The term 'ogival delta' describes an S-curved leading edge...",
  ...
}
```

Replace the `body` string with your own text. Save the file — the browser will update automatically if you have `npm run dev` running.

---

### Adding a brand-new deep-dive page for another Concorde section

1. Copy `app/planes/concorde/wing/page.tsx` into a new folder, e.g. `app/planes/concorde/propulsion/page.tsx`
2. Edit the `SPECS`, `SECTIONS`, and hero text at the top of your new file
3. Open `app/planes/concorde/page.tsx`, find the relevant entry in `SECTIONS`, and add `href: "/planes/concorde/propulsion"` to it (look at how the wing and flightcontrol sections already have their `href` set — copy the same pattern)

That's it — the "Explore more" button on that section will now link to your new page.

---

## Where to add YOUR notes (start here)

This is the section you'll use most. It's written for someone who has **never touched React, TypeScript, or JavaScript**. You do not need to understand the code — you only need to find the right file and edit text inside quotes.

### The one rule that will save you

Everything you edit lives **inside quote marks** — either `"double quotes"` or `` `backticks` ``. Change the words *between* the quotes; **never delete the quotes themselves**, and **never delete the commas** at the end of a line. If you keep the quotes and commas exactly where they are, you cannot break the site.

Two ways to check you didn't break anything after editing:
- If `npm run dev` is running, the browser refreshes by itself. If the page still looks right, you're fine.
- If you see a red error screen, you probably deleted a quote, a comma, or a curly brace `}`. Press **Ctrl+Z** (undo) until it works again.

### Cheat sheet — which file holds what

| I want to add/edit… | Open this file | Find this |
|---|---|---|
| A **commercial airliner** (747, A380…) | `lib/data.ts` | the `commercialPlanes` list |
| A **fighter jet** (F-22, F-35…) | `lib/data.ts` | the `fighterJets` list |
| A **jet engine** (GE90, Trent XWB…) | `lib/data.ts` | the `engines` list |
| **Aerodynamics** theory notes | `app/aerodynamics/page.tsx` | the `EqCard` boxes |
| **Thermodynamics** theory notes | `app/thermodynamics/page.tsx` | the `EqCard` boxes |
| **Gas dynamics** theory notes | `app/gas-dynamics/page.tsx` | the `EqCard` boxes |
| **Heat transfer** theory notes | `app/heat-transfer/page.tsx` | the `EqCard` boxes |
| A **picture** for a plane | drop the file in `public/planes/` | (see below) |

---

### Part 1 — Add notes for an aircraft or engine

Aircraft **and** engines all live in the **same file**: `lib/data.ts`. Open it in VS Code.

Inside that file are three lists. Each one starts with a line like this:

```ts
export const commercialPlanes = [    // ← airliners
export const fighterJets = [         // ← fighter jets
export const engines = [             // ← jet engines
```

Everything between that line and the matching `]` is a list of aircraft. Each aircraft is one block that starts with `{` and ends with `},` — like a single index card. To add your own, **copy an existing card and change the words**.

#### Step by step

1. Find the list you want (e.g. `fighterJets`).
2. Pick any existing card in that list — everything from its opening `{` down to its closing `},`.
3. Copy it and paste it right below, so you now have two identical cards.
4. Change the text inside the quotes on your new copy.

Here is one card with **every field explained**. Only `slug`, `name`, `detail`, `year`, and `fact` are required — the rest are optional (delete a line you don't want, but keep the comma rule in mind):

```ts
{
  slug: "boeing-777",          // the web address: becomes /planes/boeing-777
                               //   → use only lowercase letters and dashes, no spaces
  name: "Boeing 777",          // the big title shown everywhere
  detail: "Boeing · USA",      // the small grey subtitle under the name
  year: 1994,                  // a plain number (NO quotes around numbers)
  fact: "The world's largest twinjet.",   // the one-line blurb on the card
  role: "Wide-body",           // optional: little badge label
  roleColor: "#3b82f6",        // optional: badge colour as a hex code
  status: "active",            // optional: "active", "legacy", or "retired"
  image: "/planes/boeing777.png",  // optional: picture (see Part 3)
  description:                 // optional: the long article on the detail page.
    "First paragraph goes here.\n\nStart a new paragraph with \\n\\n like this.",
  specs: [                     // optional: the spec table. Each row is one { } block.
    { label: "Range",      value: "13,650 km" },
    { label: "Engines",    value: "2× GE90-115B" },
    { label: "Passengers", value: "396 (3-class)" },
  ],
},
```

**Notes for fighter jets:** they use one extra optional field, `mach` (a plain number, e.g. `mach: 2.25`) — it feeds the speed chart on the fighters page. Copy an existing fighter card to get it for free.

**Notes for engines:** their `specs` use labels like `Type`, `Thrust`, `Bypass ratio` instead of `Range`/`Passengers`. Again, easiest to copy an existing engine card.

That's it. The detail page (e.g. `/planes/boeing-777`, `/fighters/f-22-raptor`, `/engines/ge90-115b`) is built **automatically** from the card — you don't create any new page.

#### The three things that break the file

1. **A missing comma.** Every field ends with a comma, and every card ends with `},`. If you paste a card and forget the comma after `}`, the site errors.
2. **A missing quote.** `name: "Boeing 777"` must keep both `"` marks.
3. **Quotes around a number.** `year: 1994` is correct. `year: "1994"` may misbehave — numbers (`year`, `mach`) get **no quotes**; everything else gets quotes.

---

### Part 2 — Add theory notes (aerodynamics, thermodynamics, gas dynamics, heat transfer)

The four "notes" pages are each a single file:

| Page | File | Accent colour |
|---|---|---|
| Aerodynamics | `app/aerodynamics/page.tsx` | cyan |
| Thermodynamics | `app/thermodynamics/page.tsx` | emerald (green) |
| Gas dynamics | `app/gas-dynamics/page.tsx` | orange |
| Heat transfer | `app/heat-transfer/page.tsx` | purple |

All four are built the **same way**, so once you can edit one you can edit all of them.

Each note is a box called an **`EqCard`** — an equation with an explanation under it. In the file they look like this:

```tsx
<EqCard
  label="Bernoulli's Equation"
  eq={<>p + ½ρV² = const</>}
  note="Your explanation paragraph goes here — this is the plain-English note under the formula."
/>
```

There are three parts:

| Part | What it is | How to edit |
|---|---|---|
| `label="…"` | the small heading above the formula | change the text inside the quotes |
| `eq={<>…</>}` | the formula itself | change the text between `<>` and `</>` |
| `note="…"` | your explanatory paragraph | change the text inside the quotes |

**The easiest and safest note to write is the `note`** — it's just a normal sentence inside quotes. Change it freely.

The `eq` (the formula) is the only slightly fussy part, because symbols are written in code:
- Plain text works as-is: `eq={<>M = V / a</>}`
- A subscript (small low letter) uses `<sub>`: `C<sub>L</sub>` shows as C · small L
- A superscript (small high letter) uses `<sup>`: `V<sup>2</sup>` shows as V squared
- A stacked fraction uses the built-in `<Fr>` helper: `<Fr n="L" d="W"/>` draws L over W (n = numerator on top, d = denominator on bottom)

If the formula symbols feel intimidating, **just write the equation as plain text** (`eq={<>Lift = half x rho x V squared x S x CL</>}`) and put the real detail in the `note`. It will still render fine.

#### Add a new note to a page

1. Open the page file (e.g. `app/aerodynamics/page.tsx`).
2. Scroll to the topic area you want — they're marked with big comment banners like `{/* ── 2 · Lift ── */}`.
3. Find any existing `<EqCard … />` block near there.
4. Copy the whole block (from `<EqCard` to its closing `/>`) and paste it right after.
5. Change `label`, `eq`, and `note` on your new copy.

Save. That's a new note on the page.

#### Add a whole new topic section

Each topic is wrapped in a `<section …>…</section>` block with a heading and a grid of `EqCard`s. To add a brand-new topic, copy an entire existing `<section>…</section>` block, paste it below, then change the `<h2>` heading, the intro paragraph, and the `EqCard`s inside it. You do not need to touch anything else — the page shows sections top to bottom in the order they appear in the file.

---

### Part 3 — Add a picture for a plane

1. Put your image file (a PNG works best) into the `public/planes/` folder — e.g. `public/planes/boeing777.png`.
2. In that aircraft's card in `lib/data.ts`, set `image: "/planes/boeing777.png"` (note the leading `/` and that you do **not** write `public` in the path).

The picture then appears on both the card (small, spins in 3D on hover) and at the top of the detail page.

### Add a new canvas scroll sequence

1. Export your animation as numbered PNG frames: `frame-001.png`, `frame-002.png`, ... `frame-NNN.png`
2. Drop the folder into `public/` (e.g. `public/sequence_mynewplane/`)
3. Copy `ChipScroll.tsx` or `F35Scroll.tsx` and rename it
4. Update `TOTAL_FRAMES` and the image `src` pattern inside the new component
5. Import and use the component in whichever page you want

### Add a new page

Create `app/mynewpage/page.tsx`. That file automatically becomes the route `/mynewpage`. It just needs to export a default React component:

```tsx
export default function MyNewPage() {
  return (
    <main className="bg-[#0b0b10] text-white">
      <h1>My new page</h1>
    </main>
  )
}
```

---

## Deployment to GitHub Pages

Every push to the `main` branch triggers an automatic deployment via GitHub Actions (`.github/workflows/deploy.yml`). You don't need to do anything manually.

What happens:

1. GitHub spins up a temporary Ubuntu machine
2. It installs Node 18 and runs `npm ci` (clean install of dependencies)
3. It runs `npm run build`, which generates the `out/` folder (a static site — just HTML, CSS, and JS files)
4. The `out/` folder is uploaded to GitHub Pages

**Important:** the static build has no server. That means:
- No API routes (the `.dev.ts` routes are excluded)
- No auto-refresh of flight data
- Flight data is frozen from whatever was in `lib/opensky-snapshot.json` when you last ran `npm run snapshot` and pushed

### Production vs development differences

`next.config.ts` detects `NODE_ENV === "production"` and switches behaviour:

| Setting | Development | Production (GitHub Pages) |
|---|---|---|
| Output | Next.js dev server | Static HTML/JS/CSS in `out/` |
| Base path | *(none)* | `/ClaudeCookedHard` |
| API routes | Active (`.dev.ts` files included) | Excluded |
| Image loader | Next.js default | Custom loader (handles sub-path URLs) |
| Auto-refresh | Every 60 seconds | Disabled |

### GitHub Pages setup (one-time)

In your GitHub repo settings, go to **Settings → Pages → Source** and set it to **"GitHub Actions"** (not "Deploy from a branch"). Otherwise GitHub Pages won't know to serve the Actions-uploaded artifact.

---

## Project conventions

These are rules followed throughout the codebase to keep things consistent:

**No `Math.random()` in components** — random-looking values use index arithmetic instead (e.g. `index * 137.5 % 360`). This is because components render twice: once on the server, once in the browser. If `Math.random()` gives different values each time, React throws a hydration mismatch error.

**Mounted guard for client-only components** — components that depend on browser APIs (like window size) use a `mounted` flag:
```tsx
const [mounted, setMounted] = useState(false)
useEffect(() => { setMounted(true) }, [])
if (!mounted) return null
```
This prevents server-rendered HTML from mismatching the browser's first render.

**`pointer-events-none` on decorative overlays** — grid backgrounds, radial gradients, and other purely decorative `<div>` layers always get `pointer-events-none` so they don't accidentally block clicks.

**No nested `<Link>` inside `<motion.article>`** — `PlaneCard` makes the whole card clickable using `router.push()` on the outer element, not by wrapping content in a `<Link>`. Nested interactive elements cause invalid HTML and accessibility issues.

**`<p>` tags never contain `<div>` children** — HTML spec doesn't allow block-level elements inside `<p>`. Use `<span>` for inline animated components instead.

**No comments unless the WHY is non-obvious** — code should be readable from variable and function names alone. Comments are reserved for hidden constraints, non-obvious workarounds, or surprising behaviour.
