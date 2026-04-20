# AVIA — Aviation Encyclopedia

A scroll-animated aviation info site featuring commercial airliners, fighter jets, and jet engines. Built with Next.js 15, Framer Motion, and Tailwind CSS.

## Running on a new machine

### 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | **18.x** (not 16, not 20+) |
| npm | 9+ (comes with Node 18) |

> **Why exactly Node 18?** Tailwind CSS v3 is used here. v4 requires Node 20+, and v3 doesn't run cleanly on Node 16. Node 18 LTS is the sweet spot.

To check your version:
```bash
node --version
```

To install Node 18 if needed (using nvm):
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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What's included in the repo

| Path | What it is |
|---|---|
| `public/planes/` | PNG images: `a380.png`, `boeing747.png`, `concorde.png`, `f35.png` |
| `public/sequence/` | 156 PNG frames for the B-2 Spirit scrollytelling canvas animation (~90MB) |

Both folders are committed — no extra downloads needed.

---

## Pages

| URL | Description |
|---|---|
| `/` | Commercial airliners — starfield hero, A380 fly-through, Concorde video, fleet cards |
| `/fighters` | Fighter jets — F-35 video hero, F-35 fly-through, B-2 video section, squadron cards |
| `/engines` | Jet engines — afterburner fire hero, engine cards |
| `/scrollytelling` | B-2 Spirit — 156-frame canvas scroll sequence with 4 text sections |
| `/planes/[slug]` | Commercial plane detail page |
| `/fighters/[slug]` | Fighter jet detail page |
| `/engines/[slug]` | Engine detail page |

---

## Adding content

### Add a new aircraft / engine

Edit `lib/data.ts` and add an entry to `commercialPlanes`, `fighterJets`, or `engines`:

```ts
{
  slug: "boeing-777",           // used in the URL: /planes/boeing-777
  name: "Boeing 777",
  detail: "Boeing · USA",
  year: 1994,
  fact: "One interesting fact shown on the card.",
  image: "/planes/boeing777.png",   // optional — place file in public/planes/
  description: "Longer text for the detail page.",  // optional
  specs: [                          // optional
    { label: "Range", value: "13,650 km" },
    { label: "Engines", value: "2× GE90" },
  ],
}
```

### Edit the detail page (description & specs)

When you click "Read more" on a card, it opens a detail page pulled directly from `lib/data.ts`. Just fill in the `description` and `specs` fields for that entry.

**Example — Boeing 747 in `lib/data.ts`:**

```ts
{
  slug: "boeing-747",
  name: "Boeing 747",
  detail: "Boeing · USA",
  year: 1968,
  fact: "The 'Queen of the Skies' — shown on the card.",

  // ↓ These two fields power the detail page ↓

  description: `The Boeing 747 changed aviation forever. Introduced in 1970, it was
the first wide-body commercial jet, capable of carrying over 400 passengers.
Its distinctive upper deck hump became one of the most recognisable silhouettes
in aviation history. Over 1,500 were delivered before production ended in 2023.`,

  specs: [
    { label: "First flight",    value: "February 9, 1969" },
    { label: "Range",           value: "13,450 km" },
    { label: "Cruise speed",    value: "Mach 0.855 (905 km/h)" },
    { label: "Engines",         value: "4× Pratt & Whitney JT9D" },
    { label: "Passengers",      value: "Up to 660 (all-economy)" },
    { label: "Max takeoff wt",  value: "412,775 kg" },
  ],
}
```

- `description` — plain text paragraph(s), shown at the bottom of the detail page. Use a template literal (backticks) for multi-line text.
- `specs` — array of `{ label, value }` pairs, displayed in a 2-column grid. Add as many rows as you like.

If either field is missing the detail page shows a *"More information coming soon"* placeholder — so you can leave them empty and fill them in later.

> **Where to find each slug:** the URL is always `/planes/<slug>`, `/fighters/<slug>`, or `/engines/<slug>`. The slug is the `slug` field in `lib/data.ts`.

---

### Add a plane image

Drop the PNG into `public/planes/` and reference it as `image: "/planes/filename.png"` in `lib/data.ts`. The card will show it at 120×48px with a 3D spin on hover.

### Add a B-2 sequence frame

The canvas animation reads frames from `public/sequence/ezgif-frame-001.png` through `ezgif-frame-156.png`. To change the total frame count update `TOTAL_FRAMES` in `components/ChipScroll.tsx`.

---

## Tech stack

- **Next.js 15** — App Router, TypeScript
- **Tailwind CSS v3** — utility styling + custom keyframes (`animate-streak`, `animate-marquee-vertical`, `animate-fade-in-up`)
- **Framer Motion** — scroll animations, page transitions, hover effects
- **YouTube IFrame API** — custom clip looper (`components/YouTubeClipLoop.tsx`)
- **lucide-react** — icons
- **shadcn/ui primitives** — `Button`, `cn()` utility
