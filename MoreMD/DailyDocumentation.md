# Daily Documentation — 2026-05-08

Covers commit `e5bbfc6` "wed thu commits" (Thu May 7) plus uncommitted work-in-progress on Friday May 8.

---

## Part A — Committed (`e5bbfc6` · wed-thu commits)

### A1. Two Concorde deep-dive subpages

New routes off the Concorde page, each linked from a section's "Explore more" `FlowButton`:

| Route | Section |
|---|---|
| `app/planes/concorde/wing/page.tsx` | 01 — Aerodynamics (Ogival Delta Wing) |
| `app/planes/concorde/flightcontrol/page.tsx` | 02 — Flight Control (Elevon-Delta) |

Both pages share the same shape: back link → hero (`label`/`h1`/subtitle) → 4-cell `SPECS` strip → 4-section `SECTIONS` array (each with `label`, `title`, `body`, two `stats`) → footer. Each section is a 128-line client component, accent `#3b82f6`.

Wing page covers: Ogee planform geometry (55°→84° sweep), conical vortex lift at low speed (10–17° AoA, ~40% lift contribution), shock attachment at Mach 1.3+, integrated pitch stability via fuel transfer (45%→53% AC shift).

Flight control page covers: 6 elevons doing pitch+roll on one surface, FBW with 3 hydraulic systems (Blue/Green/Yellow), two-segment rudder + differential thrust at Mach 2, fuel-transfer trim replacing elevon deflection.

### A2. Concorde main page restructured

`app/planes/concorde/page.tsx`:
- Inserted new "02 — Flight Control" section between Aerodynamics and Propulsion. Renumbered cascade: Propulsion now 03, Intake 04, Thermal 05, Pilot Visibility 06, Stability 07.
- Added `href` field on the wing + flight-control sections (link targets for `FlowButton`).
- Added a `partner` landing-gear card paired alongside the Intake section (side-by-side on `md:`).
- Reworked the 9-keyframe `POSES` array to insert a "Flight control" pose (rear-top angle of trailing-edge elevons) at scrollStart 0.20–0.30, with all later poses shifted to keep their spacing.
- Added imports: `FlowButton` and the new `ConcordeGallery` component.

### A3. `ConcordeGallery` component (3D rotating cylinder)

`components/ConcordeGallery.tsx` — 119-line client component. Nine slides from `public/concorde-gallery/01.jpg`–`09.jpg` (no 07 — gap intentional, rendered as missing-image placeholder). Each card sits on a circular rotor (`rotateY(angle) translateZ(-RADIUS)`) animated by 34s linear `@keyframes cg-spin`. Tunables: `CARD_W=320`, `CARD_H=208`, `RADIUS=350`, `PERSPECTIVE=700`, `SHIFT=300`. The `SHIFT` wrapper translates the rotation pivot toward the camera so cards orbit the viewer instead of a far axis. Honors `prefers-reduced-motion`.

### A4. Fighters page snap-scroll redesign

`components/FightersSnapScroll.tsx` (780 lines) replaces three sections that were ripped out of `app/fighters/page.tsx`: the cinematic F-35 YouTube hero, the B-2 teaser, and the F-117 teaser. The new component is a single full-viewport snap-scrolling container with five frames — Hero (F-35 video) · F-35 detail · B-2 (video) · F-117 · SR-71. Active-frame tracking via `requestAnimationFrame` on the scroller's `scroll` event, plus a `goTo(i)` jump function. F-35 frame has 3 click-to-reveal hotspots (EOTS sensor at 38%/42%, F135 engine at 56%/54%, RAM skin at 72%/38%).

### A5. Commercial page snap-scroll showcase

`components/SnapScrollShowcase.tsx` (820 lines) replaces `FleetMarquee` on `app/page.tsx`. Frames: 747-8 · A380 · Concorde · DC-3 · "Fleet. Redefined" coda.

### A6. Concorde gallery photos

`public/concorde-gallery/` populated with `01.jpg`–`09.jpg` (skipping 07). Sizes range from 56 KB to 9.4 MB — `04.jpg` is the 9.4 MB one (worth flagging if build size becomes an issue).

### A7. README — beginner guide for editing Concorde subpages

152 lines appended to `README.md`. Walks through editing `wing/page.tsx` and `flightcontrol/page.tsx`:
- Area 1 — hero text (the `<h1>` + subtitle paragraph)
- Area 2 — the four `SPECS` boxes
- Area 3 — the `SECTIONS` content array
- Quick worked example, plus instructions for adding a brand-new deep-dive page (copy file → edit → add `href:` to the matching entry in `concorde/page.tsx`).

Also added a 9-line preamble at the top of the README ("how to get started" + 21st.dev / omma.build component-library links).

### A8. Root `ANNOTATIONS.md` (60 lines) — Concorde aerodynamics personal notes

Long-form notes on ogival delta geometry, vortex lift, why-ogival, why-delta, with the Concordski cautionary aside. (Later moved to `MoreMD/` — see B6.)

### A9. `MoreMD/InnerMonologue.md` checklist updates

Three new lines: ☑ insert more photos into rotating gallery, ☐ creative brainjuice + remove A380 scrollthrough, ☑ **SNAP SCROLL**. Plus a free-form note ("the animations appear before the text appears").

### A10. Snapshot churn

`lib/opensky-snapshot.json` rewrote 2106 lines (1053 changed) — routine refresh from clicking REFRESH LIVE DATA in dev. No code change, just new flight positions.

---

## Part B — Uncommitted (Friday May 8)

### B1. Six new Concorde deep-dive subpages

Following the same file template as `wing/` and `flightcontrol/`, six more sections now have their own pages:

| Route | Section | Topics |
|---|---|---|
| `app/planes/concorde/propulsion/page.tsx` | 03 — Propulsion | TSR-2 heritage, reheat envelope (Mach 0.95→1.7), Mach 2.04 dry cruise, 1,150°C TIT hot section |
| `app/planes/concorde/intake/page.tsx` | 04 — Intake | Variable ramps, Mach 2→0.5 shock decel (>90% pressure recovery), spill doors, 63% intake thrust split |
| `app/planes/concorde/landinggear/page.tsx` | 05 — Landing Gear | Twin-bogie layout, Dunlop carbon-carbon brakes (1,000°C), 16 Hz anti-skid, 100 MJ RTO energy |
| `app/planes/concorde/thermal/page.tsx` | 06 — Thermal | RR.58 (AU2GN) alloy, 127°C/180°C skin map, 300 mm elongation, fuel as heat sink |
| `app/planes/concorde/nose/page.tsx` | 07 — Pilot Visibility | Why delta can't see runway, hydraulic articulation (5°/12.5°), metal visor at Mach 1.7+, op sequence |
| `app/planes/concorde/fueltrim/page.tsx` | 08 — Stability | AC shift physics, Tank 11 (11,500 L / 9.2 t), Mach-indexed CG indicator, 1–2% fuel saved |

Each is the same 128-line `"use client"` shell — back link, hero, `SPECS` strip, four `SECTIONS` articles, footer. All use `ACCENT = "#3b82f6"`.

### B2. Concorde main page wiring

`app/planes/concorde/page.tsx`:
- Added `href` to every section that now has a subpage: propulsion → `/planes/concorde/propulsion`, intake → `/intake`, partner landing-gear → `/landinggear`, thermal → `/thermal`, nose → `/nose`, fueltrim → `/fueltrim`.
- Promoted the partner landing-gear card to a numbered section (`05 — Landing Gear`); cascade renumbered: Thermal 06, Pilot Visibility 07, Stability 08.
- Updated `<SectionCard>` invocation for partner cards to pass `href={s.partner.href}` (was previously omitted).
- Rebalanced `POSES` ranges across the 9 poses to give Thermal the widest scroll band (0.60→0.78) and tighten Hero (0→0.11):
  ```
  Hero      0.00–0.11   Engines   0.35–0.45   Nose      0.78–0.88
  Delta     0.11–0.20   Intakes   0.45–0.60   Fuel      0.88–0.98
  FlightCtl 0.20–0.35   Thermal   0.60–0.78   Specs     0.98–1.00
  ```

### B3. Flight-control body edit

`flightcontrol/page.tsx` — the Fly-by-Wire section body now opens "Concorde was among the first **passenger jet** to use fly-by-wire signalling…" (from "first civil aircraft") and adds two sentences on PCFUs + 4000 psi hydraulics: *"The aerodynamic forces at Mach 2.0, too immense that no pilot could move these surfaces manually. The PCFUs provided the necessary force using high-pressure hydraulics of 4000 psi."*

### B4. `app/loading.tsx` — global route-aware loader

New 27-line client component. Implements Next.js's reserved `app/loading.tsx` slot (auto-shown during route transitions). Reads `usePathname()` and maps to a `LoaderCategory`: `/fighters` or `/b-2` → `"fighters"`, `/engines` → `"engines"`, anything else → `"commercial"`. Drives `loadPct` from 6 → 92 with an exponential easing tick every 180 ms, hands off to `<AviationLoader>`.

### B5. `MoreMD/InnerMonologue.md`

Added one line: ☐ navigation bar SUCKS!

### B6. `ANNOTATIONS.md` relocated root → `MoreMD/`

- Deleted at repo root (committed in A8 above).
- Re-created at `MoreMD/ANNOTATIONS.md` with the same Ogival Delta Wing + Vortex Lift content, plus two new (currently empty) section headers: `## Flight Control` and `## The last of the fleet`. Reads like the next two writing prompts.

---

## Verification status

Not yet run today. Things worth checking before the next commit:

- `npm run build` — all 6 new subpages should be picked up automatically by Next.js's file-system routing; no change needed in any list.
- The "Explore more" buttons on `concorde/page.tsx` for each newly-linked section should navigate correctly.
- `app/loading.tsx` interaction with `app/page.tsx` (server component reading the snapshot JSON) — ensure the loader doesn't flash on first paint of the static export.
- `04.jpg` (9.4 MB) — consider running through a compressor before the next deploy.

---

# Daily Documentation — 2026-05-02

Session summary of all work done on the AVIA repo today.

---

## 1. Migrated from AviationStack to OpenSky Network

AviationStack's free tier turned out to have two blockers:
- `flight_status=active` filtering returned 0 flights — free tier doesn't update flight status in real time; flights stay "scheduled" even after departure
- `aircraft.iata` (plane model) was null for every flight — only populated for live ADS-B-tracked flights, which aren't part of the free tier's dataset

Switched entirely to [OpenSky Network](https://opensky-network.org) — a non-profit crowdsourced ADS-B network. No API key, no monthly limit, genuinely live positions.

### What OpenSky returns (per aircraft)
Each state vector from `/api/states/all` has 17 fields:
- `icao24` — 6-digit hex transponder code (hardware ID)
- `callsign` — ICAO airline callsign + flight number (e.g. `BAW173`, not `BA173`)
- `lat`, `lon`, `baroAltitude`, `velocity`, `trueTrack`, `verticalRate` — live telemetry
- `onGround` — boolean
- `originCountry` — country of aircraft registration

No departure/arrival info in the raw state vector — that requires a separate call.

### New files created
- `lib/opensky.ts` — TypeScript types and fetch logic. `OpenSkyFlight` interface, `CALLSIGN_PREFIXES` map, `buildOpenSkySnapshot()`, `refreshPositions()`
- `lib/opensky-snapshot.json` — committed snapshot, source of truth for prod
- `scripts/snapshot-opensky.mjs` — plain Node.js script (no TypeScript) that runs `buildOpenSkySnapshot` logic with console progress output
- `app/api/opensky/positions/route.dev.ts` — dev-only API route for lightweight position-only refresh

### Files rewritten
- `components/CommercialDashboard.tsx` — rewired to accept `OpenSkySnapshot` instead of AviationStack types; new table headers; refresh button updated
- `components/FlightGlobe.tsx` — added 53 `COUNTRY_LABELS` (hardcoded lat/lng for every major country); live flight dots from OpenSky positions; two separate cycling label intervals (arcs every 5s, live flights every 4s)
- `app/page.tsx` — now imports `lib/opensky-snapshot.json` instead of the AviationStack snapshot
- `app/api/aviationstack/refresh/route.dev.ts` — now calls `buildOpenSkySnapshot` from `@/lib/opensky`
- `package.json` — `"snapshot"` script now runs `snapshot-opensky.mjs`

---

## 2. OpenSky feature pass

After the initial migration, a second pass implementing all requested improvements:

### Remove Emirates (EK)
Removed `UAE: { iata: "EK", name: "Emirates" }` from `CALLSIGN_PREFIXES` in both `lib/opensky.ts` and `scripts/snapshot-opensky.mjs`. Removed EK from `AIRLINE_LIMITS`. Bumped remaining limits: BA→30, SQ→30, AF→15.

### IATA flight numbers (BAW173 → BA173)
OpenSky callsigns use 3-letter ICAO airline codes (`BAW`, `SIA`, `AFR`), not 2-letter IATA codes (`BA`, `SQ`, `AF`). Added `flightNumber` field to `OpenSkyFlight` computed by:
```
flightNumber = iataCode + callsign.slice(icaoPrefix.length)
// BAW173 → BA + 173 = BA173
// SIA22  → SQ + 22  = SQ22
// AFR7   → AF + 7   = AF7
```
All tables and globe labels now show `flightNumber` instead of raw `callsign`.

### Departure / arrival country
`/api/states/all` has no route info. Added `fetchRoute(icao24)` which calls:
```
GET /flights/aircraft?icao24={}&begin={unix-24h-ago}&end={unix-now}
```
Returns an array of recent flights for that aircraft; takes the most recent one, extracts `estDepartureAirport` and `estArrivalAirport` (ICAO codes like `EGLL`, `LFPG`, `WSSS`).

ICAO codes → country names via a two-tier lookup:
1. `airportByIcao` map built from `FAMOUS_AIRPORTS` (20 major airports → exact country)
2. Fallback: a 60-entry `ICAO_PREFIX_COUNTRY` array (e.g. `EG→"United Kingdom"`, `LF→"France"`, `K→"United States"`) sorted longest-prefix-first to prevent `K` from shadowing `KE`, etc.

New fields on `OpenSkyFlight`: `depIcao`, `arrIcao`, `depCountry`, `arrCountry`.

**Hit rate in practice:** ~22% of flights have departure country populated; arrival country is usually null for airborne flights — OpenSky only fills `estArrivalAirport` after landing or from filed flight plans, not during cruise.

### Remove originCountry column
`originCountry` is the country of aircraft registration (where the tail number is registered), not where it flew from. Not useful to display. Removed the column. `originCountry` is also dropped from the `OpenSkyFlight` interface.

### Round-robin interleaving
Previously, `Object.values(groups).flat()` produced all BA flights first, then all SQ, then all AF — so the first scroll of the table was entirely British Airways. Changed to round-robin:
```ts
function roundRobin<T>(groups: T[][]): T[] {
  const result: T[] = []
  const maxLen = Math.max(0, ...groups.map((g) => g.length))
  for (let i = 0; i < maxLen; i++) {
    for (const group of groups) {
      if (i < group.length) result.push(group[i])
    }
  }
  return result
}
// Output: BA[0], SQ[0], AF[0], BA[1], SQ[1], AF[1], ...
```

### Auto-refresh (dev only, positions only)
Full refresh (states/all + N metadata + N route calls) is expensive and slow — not suitable for a 60-second interval. Split into two functions:
- `buildOpenSkySnapshot()` — full fetch: states/all + metadata + routes for every aircraft. Run manually via `npm run snapshot` or the Refresh button.
- `refreshPositions(existing)` — lightweight: 1 call to `states/all`, reuses cached metadata/routes from the existing snapshot, updates lat/lon/altitude/speed/heading for each icao24.

`app/api/opensky/positions/route.dev.ts` — reads the snapshot from disk, calls `refreshPositions()`, returns the updated snapshot without writing to disk.

`CommercialDashboard.tsx` — `useEffect` with 60-second `setInterval` (empty dep array, runs once on mount):
```tsx
useEffect(() => {
  if (IS_STATIC_BUILD) return
  const id = setInterval(async () => {
    const res = await fetch("/api/opensky/positions", { method: "POST" })
    if (!res.ok) return
    const body = await res.json()
    setSnapshot(body.snapshot)
  }, 60_000)
  return () => clearInterval(id)
}, [])
```

### Country label visibility (globe)
Bumped `labelSize` from `0.55` → `0.65` and `labelColor` opacity from `rgba(148,163,184,0.35)` → `rgba(148,163,184,0.50)` for the 53 country name labels on the globe.

---

## 3. FlightsTable changes

| Before | After |
|---|---|
| Headers: CALLSIGN, AIRLINE, COUNTRY, ALT(FT), SPD(KTS), MODEL | Headers: FLIGHT, AIRLINE, FROM, TO, ALT(FT), SPD(KTS) |
| Showed raw callsign (BAW173) | Shows IATA flight number (BA173) |
| COUNTRY = aircraft registration country (not useful) | FROM = departure country, TO = arrival country |
| MODEL column | Removed (MODEL still in Airplanes tab) |

AircraftTable CALLSIGN column also updated to show `flightNumber`.

---

## 4. Snapshot results

After implementing all changes:
```
npm run snapshot
→ BA: 30 flights, AF: 12 flights, SQ: 16 flights
→ 58 total (interleaved BA/SQ/AF)
→ Metadata + routes fetched for 58 aircraft in 8 batches
→ 13 flights with departure country, 0 with arrival country (airborne, not yet landed)
```

Sample rows from the snapshot:
```
BA BA180  | United States → —     | KJFK → —
SQ SQ607  | —             → —
AF AF091  | —             → —
BA BA28K  | United Kingdom → —    | EGLL → —
```

---

## 5. README.md full rewrite

The previous README was 244 lines and assumed the reader knew what Next.js, React, and TypeScript were.

Rewrote from scratch as a **604-line beginner-friendly reference** covering:

- **What the project is** — plain English description of every major feature
- **Tech stack with analogies** — explains what each library does ("Lego bricks for the interface", "spell-check for your code logic", etc.)
- **Getting started** — explains why each step exists (why exactly Node 18, what `npm install` actually does)
- **Folder structure** — annotated tree with every folder and key file explained, including what `[slug]` and `.dev.ts` mean
- **Pages and routes** — full URL → content table including all new routes
- **Components** — every component grouped by purpose, plain-English descriptions; dedicated section for canvas scroll sequences explaining the flip-book approach
- **Data architecture** — full `Aircraft` interface with all field explanations, how dynamic pages auto-generate from slugs
- **Live flight data** — entire snapshot pipeline explained step-by-step, what OpenSky provides vs what it doesn't, why the frozen-snapshot pattern exists on a static site, the auto-refresh split between full and positions-only
- **How animations work** — Framer Motion `useScroll` / `useTransform` explained, canvas frame animation explained
- **Adding new content** — copy-paste examples for adding a plane, an image, a scroll sequence, a new page
- **Deployment** — what each step in the GitHub Actions workflow does, the one-time Pages source setting required
- **Project conventions** — all five rules with the reason why (hydration mismatch for `Math.random()`, why `pointer-events-none` on decorative layers, etc.)

---

## 6. TypeScript fix in refreshPositions

Initial implementation of `refreshPositions` used `onGround: false as const`, which created an object type of `{ onGround: false }` — narrower than `OpenSkyFlight`'s `{ onGround: boolean }`. TypeScript rejected the type predicate `(f): f is OpenSkyFlight` because `OpenSkyFlight` was not assignable to the narrower inferred type.

Fixed by using `.reduce<OpenSkyFlight[]>()` with explicit return type instead of `.map().filter()`:
```ts
// Before (broken)
.map(f => ({ ...f, onGround: false as const }))
.filter((f): f is OpenSkyFlight => f !== null)

// After (works)
.reduce<OpenSkyFlight[]>((acc, f) => {
  // ...
  acc.push({ ...f, onGround: false })
  return acc
}, [])
```

---

## 7. Final repo state

### New files
- `lib/opensky.ts`
- `lib/opensky-snapshot.json`
- `scripts/snapshot-opensky.mjs`
- `app/api/opensky/positions/route.dev.ts`

### Modified files
- `components/CommercialDashboard.tsx`
- `components/FlightGlobe.tsx`
- `app/page.tsx`
- `app/api/aviationstack/refresh/route.dev.ts`
- `package.json`
- `README.md` (full rewrite)

### Verification
- `npx tsc --noEmit` — 0 errors in project files (2 pre-existing errors in unrelated UI components)
- `npm run build` — passes, all 58 flights bundled into static export
- `npm run snapshot` — runs successfully, fetches 58 live BA/SQ/AF flights with metadata and routes

---

# Daily Documentation — 2026-05-01

Session summary of all work done on the AVIA repo today.
Used Opus 4.7 with High Effort for the first time, and it ate up about 20% of my weekly limit.

---

## 1. Palantir/Gotham-style commercial landing page

Replaced `HorizonHeroSection` on `/` with a full-viewport "GLOBAL FLIGHT INTELLIGENCE" dashboard.

### Approach
- Tried installing `@blueprintjs/core` for the Palantir Blueprint UI library — peer-dep conflict with React 19. Rebuilt the Gotham aesthetic in plain Tailwind instead (sharp panels, monospace technical readouts, cyan/amber accents, corner ticks, status indicators).
- Installed `react-globe.gl` (with `--legacy-peer-deps`) for the rotating 3D globe.

### New files
- `lib/aviationstack.ts` — TypeScript types + fetcher for the 4 AviationStack endpoints.
- `lib/aviationstack-snapshot.json` — committed snapshot file, source of truth for prod.
- `scripts/snapshot-aviationstack.mjs` — manual one-shot script to populate the snapshot from your API key (4 requests).
- `app/api/aviationstack/refresh/route.dev.ts` — dev-only API route. POST hits AviationStack and writes back to the snapshot file. Renamed `.dev.ts` so it's excluded from the static export build (see §3).
- `components/FlightGlobe.tsx` — `react-globe.gl` wrapper. Earth-dark texture, atmosphere glow, arcs between airports, points for live-tracked planes, auto-rotate via `onGlobeReady` callback.
- `components/CommercialDashboard.tsx` — hero composing the globe + Gotham control panel with 4 tabs (`v1/flights`, `v1/airports`, `v1/airlines`, `v1/airplanes`), live UTC clock, monospace tables, refresh button + confirm modal.
- `lib/famous.ts` — curated whitelists + hardcoded fallback data (see §2).
- `.env.local.example`, `npm run snapshot` script in `package.json`.

### Files changed
- `app/page.tsx` — `HorizonHeroSection` → `CommercialDashboard`; removed `"use client"` (page is now a server component that reads the snapshot JSON at build time).
- `next.config.ts` — added `pageExtensions` switch for the dev-only API route.

---

## 2. AviationStack data: how it works

### What the API returns

The free tier of AviationStack gives 100 requests / month across 4 endpoints:

| Endpoint | What it returns |
|---|---|
| `v1/flights` | "Real-time" flights — a sample of currently-scheduled and active commercial flights worldwide. Each record has scheduled time, status, departure/arrival IATA codes, airline, and *optionally* a `live` block with lat/lon/altitude if the flight is currently airborne and being tracked via ADS-B. |
| `v1/airports` | A list of airports with names, IATA/ICAO codes, lat/lon, country. |
| `v1/airlines` | A list of airlines with names, IATA/ICAO codes, callsigns, fleet sizes. |
| `v1/airplanes` | A list of individual aircraft tail numbers with model, age, engines, owning airline. |

**Important:** the 100 records returned per endpoint are **NOT** "every flight in the world right now." It's a paginated sample — the first 100 records in the API's default ordering. Most `flights` records are scheduled flights with no live position; only a handful (typically 0–5 of the 100) have a `live` block. So the "live tracks" count on the dashboard is usually small.

### How requests get spent

- **Page refreshes on the deployed site:** **0 requests.** The site reads `lib/aviationstack-snapshot.json`, which is bundled at build time. Visitors do not hit the API.
- **Page refreshes during local `npm run dev`:** **0 requests.** Same — reads from the JSON file.
- **Clicking REFRESH LIVE DATA in dev:** **4 requests** (one per endpoint). The button is hidden in production (replaced by a `STATIC SNAPSHOT · READ-ONLY` pill).
- **Running `npm run snapshot`:** **4 requests.** Same as the button but from the CLI.

### What you actually see on the page
1. **Initial load:** snapshot JSON committed to the repo → Next.js bundles it → page renders the same data on every visitor's screen until you refresh + commit.
2. **Refresh in dev:** API → JSON file overwritten → state updates → next commit and push pushes the new data to GitHub Pages.

### The famous-only filter

Even with 100 random flights, almost none are between airports/airlines you'd recognize. So `lib/famous.ts` defines:
- **18 famous airports:** JFK, LAX, ORD, SFO, EWR, LHR, CDG, FRA, AMS, SIN, HND, NRT, PVG, ICN, HKG, DXB, DOH, MEL, SYD — with lat/lon hardcoded.
- **15 famous airlines:** SQ, BA, AF, LH, KL, QF, QR, EK, CX, NH, JL, KE, TG, AA, TK.
- **22 hardcoded famous routes** (`FAMOUS_ROUTES`) — each with a real flight number, registration, aircraft model, and airline. These always render on the globe even if the API returned zero famous flights this round.

API `flights` are filtered to those where **both** dep and arr IATA are in the famous-airports set. Then merged with `FAMOUS_ROUTES` and de-duplicated. So you always see ~22 flights with drawable arcs + plausible airline data.

Airports and airlines tabs come **entirely** from the hardcoded list — they don't change with API refreshes. The airplanes tab is derived from displayed flights (each flight's registration → `FAMOUS_AIRCRAFT_BY_REG` map → model/age/engines).

---

## 3. GitHub Pages prod build

The repo ships with `output: "export"` for prod (static export → GitHub Pages). Static export does **not** support API routes.

### Solution
- Renamed `route.ts` → `route.dev.ts`.
- `next.config.ts` sets `pageExtensions: ['tsx', 'ts', 'jsx', 'js', 'dev.ts', 'dev.tsx']` only when `NODE_ENV !== 'production'`. So Next.js sees the API route in dev but not in prod build.
- Refresh button hidden in prod via `process.env.NODE_ENV === "production"` check; replaced by a `STATIC SNAPSHOT · READ-ONLY` indicator pill.

### Layout
- `<section>` is `lg:h-screen` with `lg:overflow-hidden` so the dashboard fits exactly one viewport on desktop.
- Inner control panel uses `min-h-0 overflow-y-auto` on the table area for internal scroll.
- Mobile (`<lg`) falls back to natural page scroll.

---

## 4. Globe arcs + cycling labels

### Arcs
Every displayed flight produces one arc on the globe. Arc endpoints are looked up in `FAMOUS_AIRPORTS` (authoritative — guaranteed coords). Arcs use the `react-globe.gl` great-circle renderer with dashed animation, cyan-fade gradient, hover tooltip showing flight code + route + airline.

### Cycling label
Originally tried showing all 22 labels at once — visually cluttered (especially around JFK). Switched to cycling: only the currently-active arc's label is rendered, advancing every 5 seconds via `setInterval`. Label position is the great-circle midpoint computed via spherical-law-of-cosines (not naive lat/lng average — that falls off the curve for transpacific arcs). Amber color (`#f59e0b`), `labelsTransitionDuration={600}` for smooth fade between flights.

### Auto-rotate fix
Initially auto-rotate didn't work — the `useEffect([mounted])` ran before `react-globe.gl`'s async dynamic-import had finished mounting, so `globe.controls()` returned null. Fixed by moving control config into the `onGlobeReady` callback, which is the canonical pattern.

---

## 5. Fact-checked flight numbers

Earlier flight number list was made up. Audited and fixed:

| Wrong → Correct | Notes |
|---|---|
| BA1 LHR↔JFK → **BA175 / BA178** | BA1 is actually LCY→JFK |
| SQ21 SIN→JFK → **SQ21 SIN→EWR** | The world's longest non-stop is SIN→Newark, not JFK. Added EWR to airports. |
| NH7 HND→ORD → **NH12 NRT→ORD** | ANA's actual NRT-Chicago |
| QF9 MEL→LAX → **QF93** | QF9 is actually PER→LHR |
| CX85 → **CX870** | HKG→SFO |
| KE802 → **KE85** | The A380 ICN-JFK service |
| SQ12 SIN→LAX → **SQ12 SFO→SIN** | SQ12 is actually the SFO-bound flight |
| QF63 SYD→LAX → **QF11** | QF63 is actually SYD→JNB |
| AA3 → **AA100** | JFK→LHR |
| Plus: AF8, BA15, CX830, JL62, SQ856, others | |

Each of the 22 flights now has a hardcoded aircraft (registration + model) in `FAMOUS_AIRCRAFT_BY_REG` — e.g. BA1 → G-STBA Boeing 777-336ER, SQ21 → 9V-SGD Airbus A350-941ULR, EK1 → A6-EUS Airbus A380-861.

---

## 6. Loading screen — 200% bug + spinner verbs + fun facts

### The 200% bug
React StrictMode runs `useEffect` twice in dev. The original preload code:
```ts
img.onload = () => setLoadedCount((n) => n + 1)
```
…meant images from the first effect run kept firing onload after the second run started. Both runs incremented the same counter → 312 total → "Loading 200%".

### The fix
In all three scroll components (`ChipScroll`, `F35Scroll`, `F117Scroll`):
```ts
useEffect(() => {
  const loaded = new Set<number>()
  let cancelled = false
  const images = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
    const img = new Image()
    const mark = () => {
      if (cancelled || loaded.has(i)) return
      loaded.add(i)
      setLoadedCount(loaded.size)
    }
    img.onload = mark; img.onerror = mark
    img.src = frameUrl(i)
    return img
  })
  return () => {
    cancelled = true
    for (const img of images) { img.onload = null; img.onerror = null }
  }
}, [])
```
Set-based dedup + cleanup that detaches handlers on unmount. Caps cleanly at 100%.

### New AviationLoader component
`components/AviationLoader.tsx` — replaces the inline loading overlay in all three scrolls. Takes `loadPct`, `isLoaded`, and `category` ("commercial" | "fighters" | "engines"). Shows:
- A spinning circle in category accent color (cyan / red / amber)
- A cycling verb that changes every 900ms with fade animation
- Progress bar + percentage
- A "Did you know" fun fact, randomly picked once per page-load from the category's pool

#### Verbs
- **Commercial:** Taxiing, Boarding, Pushing back, Spooling up, Cleared for takeoff, Climbing, Cruising, Trimming, Tuning ILS, Holding short, Vectoring, Handing off to tower, Plotting waypoints
- **Fighters:** Spooling up, Acquiring lock, Engaging afterburner, Pulling Gs, Stealth-checking, Banking hard, Squawking, Pickling, Splashing bandits, Going Mach, Painting target, Ingressing
- **Engines:** Spooling up, Igniting combustor, Light-off detected, Reaching N1/N2, Stabilising EGT, Modulating bypass, Cooling turbine, Bleeding air, Trimming fuel

#### Facts (samples)
- Fighters: B-2 RCS = bird-sized, only 21 ever built, F-22 ±20° thrust vectoring, SR-71 12" expansion at Mach 3, F-35 helmet costs $400k…
- Commercial: Concorde crossing Atlantic faster than Earth's rotation, 747 hump origin, A380 has 530 km of wiring, 737 most-produced jet ever…
- Engines: GE9X air mass flow, F119 dry thrust, Trent XWB blade horsepower, turbine blades hotter than their alloy melting point, Olympus 593 origin in TSR-2…

---

## 7. Page renames + content additions

### `/scrollytelling` → `/b-2`
- Moved `app/scrollytelling/page.tsx` → `app/b-2/page.tsx`.
- Removed the old `scrollytelling` directory.
- Updated `/fighters` page link from `/scrollytelling` → `/b-2`.

### B-2 detail content
The B-2 page now has Overview / Engineering / Specifications sections below the scrollytelling, mirroring the `/fighters/[slug]` detail page layout. Hardcoded content:
- **Overview:** 2 paragraphs covering Cold War origin, $2.1B unit cost, 21 built, Spirit of Kansas loss, Whiteman AFB ops.
- **Engineering features (4 cards):** Flying-Wing Planform, Radar-Absorbent Material, Buried Engines & Curved Inlets, Conventional + Nuclear Payload.
- **Specs (10 fields):** wingspan 172 ft, 4× F118-GE-100, crew 2, range 6,900 mi unrefuelled, 50,000 ft ceiling, $2.1B unit cost, etc.

### F-35 duplicate-page fix
- `/fighters/f35` now contains both the F35Scroll **and** the full F-35 Lightning II detail content (pulled from `lib/data.ts` via `fighterJets.find(j => j.slug === "f-35-lightning-ii")`).
- The Squadron card in `/fighters` for F-35 Lightning II points to `/fighters/f35` instead of `/fighters/f-35-lightning-ii`.
- The dynamic `/fighters/[slug]` route excludes `f-35-lightning-ii` from `generateStaticParams` and 307-redirects any visit to `/fighters/f35`. Static export drops `out/fighters/f-35-lightning-ii.html`.

### F-117 same treatment
- `/fighters/f117` now contains both the F117Scroll **and** the full F-117 Nighthawk detail content.
- Squadron card link updated.
- Same `generateStaticParams` exclusion + 307 redirect for `f-117-nighthawk`.
- Generalized to a `REDIRECTED_SLUGS` map in `app/fighters/[slug]/page.tsx` to make adding more redirects trivial.

---

## 8. Final repo state

### New files
- `lib/aviationstack.ts`
- `lib/aviationstack-snapshot.json` (committed, contains real fetched data)
- `lib/famous.ts`
- `scripts/snapshot-aviationstack.mjs`
- `app/api/aviationstack/refresh/route.dev.ts`
- `app/b-2/page.tsx`
- `components/FlightGlobe.tsx`
- `components/CommercialDashboard.tsx`
- `components/AviationLoader.tsx`
- `.env.local.example`

### Modified files
- `app/page.tsx`
- `app/fighters/page.tsx`
- `app/fighters/[slug]/page.tsx`
- `app/fighters/f35/page.tsx`
- `app/fighters/f117/page.tsx`
- `components/ChipScroll.tsx`
- `components/F35Scroll.tsx`
- `components/F117Scroll.tsx`
- `next.config.ts`
- `package.json`

### Removed
- `app/scrollytelling/page.tsx` (and its directory)

### Verification
- `npm run dev` → all routes return 200, refresh button works, redirects work
- `npm run build` → static export passes, `out/` ships with `b-2.html`, `fighters/f35.html`, `fighters/f117.html` and the new dashboard renders famous routes from the snapshot

### Quota state
Used 4 of 100 monthly AviationStack requests during verification. Snapshot file currently contains real data fetched 2026-05-01T07:13:15Z.
