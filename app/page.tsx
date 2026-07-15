import Link from "next/link"
import FlyingPlane from "@/components/FlyingPlane"
import YouTubeClipLoop from "@/components/YouTubeClipLoop"
import CommercialDashboard from "@/components/CommercialDashboard"
import CompetitorCarousel from "@/components/CompetitorCarousel"
import PlaneCard from "@/components/PlaneCard"
import SnapScrollShowcase from "@/components/SnapScrollShowcase"
import SpecTable from "@/components/SpecTable"
import ChipLinks from "@/components/ChipLinks"
import CompareProvider from "@/components/compare/CompareProvider"
import { commercialPlanes } from "@/lib/data"
import snapshot from "@/lib/opensky-snapshot.json"
import type { OpenSkySnapshot } from "@/lib/opensky"

const COMPETITOR_SLUGS = new Set([
  "boeing-737", "airbus-a320",
  "boeing-747", "airbus-a380",
  "boeing-787-dreamliner", "airbus-a350",
  "boeing-777", "airbus-a340",
  "boeing-757", "airbus-a330",
])

// Concorde: 3:01–3:12 then 2:30–2:37, looped
const CONCORDE_CLIPS = [
  { start: 181, end: 192 },
  { start: 150, end: 157 },
]

export default function CommercialPage() {
  const featuredPlanes = commercialPlanes.filter((p) => !COMPETITOR_SLUGS.has(p.slug)).slice(0, 3)

  return (
    <main className="bg-[#0b0b10]">
      <CompareProvider>
      <CommercialDashboard initial={snapshot as unknown as OpenSkySnapshot} />

      <section className="relative border-y border-white/[0.06] bg-[#090d15]">
        <div className="avia-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.4fr_0.8fr] md:px-12 lg:px-24">
          <div className="avia-panel rounded-[28px] p-7 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#7dd3fc]">
              Editorial Focus
            </p>
            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                  A catalog that should feel closer to a museum wall than a component demo.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
                  Rivalries, engineering bets, and dead-end masterpieces. The strongest moments on this page are the ones
                  that feel curated rather than just animated.
                </p>
              </div>
              <Link
                href="#fleet"
                className="avia-pill-button inline-flex items-center gap-2 self-start rounded-full border border-[#7dd3fc]/20 bg-[#7dd3fc]/10 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-[#7dd3fc]/40 hover:bg-[#7dd3fc]/16"
              >
                Jump to Fleet
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="avia-panel rounded-[28px] p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#f59e0b]">
              This Page
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { value: "12+", label: "airframes" },
                { value: "5", label: "rivalries" },
                { value: "2", label: "legends" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-4 text-center">
                  <p className="text-xl font-bold text-white">{item.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-[#94a3b8]">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* A380 fly-through */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0b10] via-[#0c1828] to-[#0b0b10]">
        <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(96,165,250,0.18),transparent_68%)]" />
        <div className="text-center pt-24 pb-2">
          <p className="text-xs tracking-[0.4em] text-[#7dd3fc] uppercase">The Giant</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">Airbus A380</h2>
          <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[#94a3b8]">2007 – present · Double deck</p>
        </div>
        <FlyingPlane
          imageSrc="/planes/a380.png"
          imageWidth={580}
          imageHeight={220}
          label="Airbus A380 · The world's largest airliner"
        />
        <div className="mx-auto max-w-2xl px-8 pb-24 text-center">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#b8c7dc]">
            Two full passenger decks, four engines, and a wingspan of 80 metres.
            The A380 redefined what a commercial aircraft could be.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
              853 max passengers
            </div>
            <div className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65">
              79.75 m wingspan
            </div>
          </div>
          <Link
            href="/planes/airbus-a380"
            className="avia-pill-button mt-8 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-7 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/16"
          >
            Explore the A380
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Concorde video section */}
      <section className="relative flex h-[76vh] items-end overflow-hidden border-y border-white/[0.05]">
        {/* Looping Concorde footage */}
        <YouTubeClipLoop
          videoId="lsqPsX8k5FE"
          clips={CONCORDE_CLIPS}
          className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/85" />

        <div className="relative z-10 w-full px-8 pb-16 md:px-14 lg:px-20">
          <div className="max-w-xl text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#cbd5e1]">First, a legend</p>
            <h2 className="text-4xl font-bold md:text-5xl">The Concorde</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-[#94a3b8]">1976 – 2003 · Mach 2.04</p>
            <p className="mt-5 text-sm leading-relaxed text-[#c7d2e2] md:text-base">
            The supersonic airliner that crossed the Atlantic in 3.5 hours — faster than the sun moves across the sky.
            Passengers witnessed the curvature of the Earth from 60,000 feet.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/planes/concorde"
                className="avia-pill-button inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/35 hover:bg-white/14"
              >
                Explore the Concorde
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60">
                Supersonic icon
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Flight deck scrollytelling teaser */}
      <section className="relative flex h-[52vh] items-end overflow-hidden border-t border-white/[0.05] bg-gradient-to-b from-[#070d1a] to-[#0b0b10]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(59,130,246,0.10),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0b10] to-transparent" />

        <div className="relative z-10 w-full px-8 pb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-[#7dd3fc]/60">Boeing / Airbus</p>
          <h2 className="text-4xl font-bold text-white md:text-5xl">The Flight Deck</h2>
          <p className="mt-2 text-sm text-white/55">Inside the cockpit — where precision meets the horizon</p>
          <Link
            href="/commercial"
            className="avia-pill-button mt-8 inline-flex items-center gap-2 rounded-full border border-[#3b82f6]/25 bg-[#3b82f6]/10 px-7 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-[#3b82f6]/50 hover:bg-[#3b82f6]/16"
          >
            Enter the Flight Deck
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Snap-scroll fleet showcase — 747-8 / A380 / Concorde / DC-3 + Fleet. Redefined coda */}
      <SnapScrollShowcase />

      {/* Competitor carousel */}
      <section id="fleet" className="relative px-6 pb-24 pt-10 md:px-12 lg:px-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <CompetitorCarousel />
        </div>
      </section>

      {/* Fleet engineering data */}
      <section className="relative border-y border-white/[0.05] bg-[#080d16] px-6 py-24 md:px-12 lg:px-24">
        <SpecTable
          kicker="Engineering Data"
          title="The Fleet by the Numbers."
          description="Wing loading (W/S) sets stall and approach speed; aspect ratio (AR) sets induced drag; sweep sets the drag-divergence Mach. Read the columns together and each aircraft's design brief becomes visible — Concorde's 1.7 aspect ratio and 60°+ sweep is a supersonic decision; the A350's 9.5 is a fuel-burn decision."
          accent="#60a5fa"
          columns={["Aircraft", "MTOW (t)", "Wing Area (m²)", "W/S (kg/m²)", "AR", "¼-Chord Sweep", "Cruise Mach", "Total Thrust (lbf)"]}
          rows={[
            ["Boeing 747-400", "413", "541", "763", "7.7", "37.5°", "0.85", "4 × 63,300"],
            ["Airbus A380", "575", "845", "680", "7.5", "33.5°", "0.85", "4 × 76,500"],
            ["Boeing 777-300ER", "352", "437", "805", "9.6", "31.6°", "0.84", "2 × 115,300"],
            ["Boeing 787-9", "254", "377", "674", "9.6", "32.2°", "0.85", "2 × 74,100"],
            ["Airbus A350-900", "280", "443", "632", "9.5", "31.9°", "0.85", "2 × 84,200"],
            ["Airbus A320neo", "79", "123", "644", "10.3*", "25°", "0.78", "2 × 27,100"],
            ["Boeing 737 MAX 8", "82", "127", "646", "10.2*", "25.0°", "0.79", "2 × 28,000"],
            ["Concorde", "185", "358", "517", "1.7", "delta (LE 60–75°)", "2.04", "4 × 38,050 (reheat)"],
          ]}
          footnote="MTOW = maximum takeoff weight. W/S computed at MTOW. *Effective aspect ratio including sharklet/winglet contribution. Values are representative published figures for the listed variant; certified numbers vary by weight option."
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <ChipLinks
            kicker="The Theory Behind the Columns"
            chips={[
              { href: "/aerodynamics#wing", label: "Wing Geometry", sub: "AR, sweep, wing loading", accent: "#22d3ee" },
              { href: "/aerodynamics#high-lift", label: "High-Lift Systems", sub: "how W/S 763 still lands", accent: "#22d3ee" },
              { href: "/aerodynamics#compressibility", label: "Compressibility", sub: "why cruise stops at M 0.85", accent: "#22d3ee" },
              { href: "/thermodynamics#propulsion", label: "Propulsion", sub: "thrust, TSFC & range", accent: "#34d399" },
            ]}
          />
        </div>
      </section>

      {/* Non-competitor planes */}
      <section className="relative px-6 pb-36 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_38%)]" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-[#60a5fa]">
              Beyond the Rivalry
              </p>
              <h2 className="text-3xl font-bold text-white md:text-4xl">The Rest of the Fleet.</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#94a3b8]">
              Pioneers, legends, and one-of-a-kinds that don't fit neatly into any rivalry.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 self-start md:w-[360px]">
              {featuredPlanes.map((plane) => (
                <div key={plane.slug} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#7dd3fc]">{plane.year}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{plane.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {commercialPlanes
              .filter((p) => !COMPETITOR_SLUGS.has(p.slug))
              .map((plane, i) => (
                <PlaneCard
                  key={plane.slug}
                  name={plane.name}
                  detail={plane.detail}
                  fact={plane.fact}
                  year={plane.year}
                  index={i}
                  href={`/planes/${plane.slug}`}
                  accent="#3b82f6"
                  image={plane.image}
                  status={plane.status}
                  role={plane.role}
                  roleColor={plane.roleColor}
                  routes={plane.routes}
                  compareSlug={plane.slug}
                />
              ))}
          </div>
        </div>
      </section>
      </CompareProvider>
    </main>
  )
}
