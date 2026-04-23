"use client"
import FlyingPlane from "@/components/FlyingPlane"
import YouTubeClipLoop from "@/components/YouTubeClipLoop"
import FleetMarquee from "@/components/ui/cta-with-text-marquee"
import { HorizonHeroSection } from "@/components/ui/horizon-hero-section"
import CompetitorCarousel from "@/components/CompetitorCarousel"
import PlaneCard from "@/components/PlaneCard"
import { commercialPlanes } from "@/lib/data"

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
  return (
    <main className="bg-[#0b0b10]">
      {/* Hero — Three.js starfield + mountain horizon */}
      <HorizonHeroSection />

      {/* A380 fly-through */}
      <section className="relative bg-gradient-to-b from-[#0b0b10] via-[#0c1828] to-[#0b0b10]">
        <div className="text-center pt-24 pb-2">
          <p className="text-xs tracking-[0.4em] text-[#94a3b8] uppercase">The Giant</p>
          <h2 className="text-4xl font-bold mt-4">Airbus A380</h2>
          <p className="text-[#94a3b8] mt-2 text-sm">2007 – present · Double deck</p>
        </div>
        <FlyingPlane
          imageSrc="/planes/a380.png"
          imageWidth={580}
          imageHeight={220}
          label="Airbus A380 · The world's largest airliner"
        />
        <div className="text-center pb-24 px-8 max-w-lg mx-auto">
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            Two full passenger decks, four engines, and a wingspan of 80 metres.
            The A380 redefined what a commercial aircraft could be.
          </p>
          <a
            href="/commercial"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#3b82f6]/25 text-white/80 text-sm font-medium backdrop-blur-sm hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]/50 transition-all duration-200"
          >
            Click to explore more
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Concorde video section */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        {/* Looping Concorde footage */}
        <YouTubeClipLoop
          videoId="lsqPsX8k5FE"
          clips={CONCORDE_CLIPS}
          className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
        />
        {/* Dark overlay — heavier at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/80" />

        {/* Text overlay at bottom */}
        <div className="relative z-10 w-full text-center pb-16 px-8">
          <p className="text-xs tracking-[0.4em] text-[#94a3b8] uppercase mb-3">First, a legend</p>
          <h2 className="text-4xl font-bold">The Concorde</h2>
          <p className="text-[#94a3b8] mt-2 text-sm mb-4">1976 – 2003 · Mach 2.04</p>
          <p className="text-[#94a3b8] text-sm leading-relaxed max-w-lg mx-auto">
            The supersonic airliner that crossed the Atlantic in 3.5 hours — faster than the sun moves across the sky.
            Passengers witnessed the curvature of the Earth from 60,000 feet.
          </p>
          <a
            href="/planes/concorde"
            className="mt-8 inline-flex items-center gap-2 px-7 py-3 rounded-full border border-[#3b82f6]/25 text-white/80 text-sm font-medium backdrop-blur-sm hover:bg-[#3b82f6]/10 hover:border-[#3b82f6]/50 transition-all duration-200"
          >
            Click to explore more
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Fleet intro marquee */}
      <FleetMarquee planeNames={commercialPlanes.filter((p) => p.status !== "retired" || p.slug === "concorde").map((p) => p.name)} speed={7} />

      {/* Competitor carousel */}
      <section id="fleet" className="px-6 md:px-12 lg:px-24 pb-24">
        <div className="max-w-6xl mx-auto">
          <CompetitorCarousel />
        </div>
      </section>

      {/* Non-competitor planes */}
      <section className="px-6 md:px-12 lg:px-24 pb-36">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.4em] text-[#3b82f6] uppercase mb-3 font-medium">
              Beyond the Rivalry
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">The Rest of the Fleet.</h2>
            <p className="text-[#94a3b8] mt-2 text-sm max-w-md leading-relaxed">
              Pioneers, legends, and one-of-a-kinds that don't fit neatly into any rivalry.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                />
              ))}
          </div>
        </div>
      </section>
    </main>
  )
}
