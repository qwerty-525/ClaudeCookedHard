"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import FlyingPlane from "@/components/FlyingPlane"
import PlaneCard from "@/components/PlaneCard"
import YouTubeClipLoop from "@/components/YouTubeClipLoop"
import FleetMarquee from "@/components/ui/cta-with-text-marquee"
import { Typewriter } from "@/components/ui/typewriter"
import { commercialPlanes } from "@/lib/data"

// Concorde: 3:01–3:12 then 2:30–2:37, looped
const CONCORDE_CLIPS = [
  { start: 181, end: 192 },
  { start: 150, end: 157 },
]

// Deterministic "random" stars — no hydration mismatch
const stars = Array.from({ length: 90 }, (_, i) => ({
  w: ((i * 13 + 7) % 20) / 10 + 1,
  top: ((i * 37 + 11) % 1000) / 10,
  left: ((i * 41 + 23) % 1000) / 10,
  opacity: ((i * 7 + 5) % 70) / 100 + 0.1,
}))


export default function CommercialPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(heroProgress, [0, 1], [0, -100])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#0b0b10]">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Starfield */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b10] via-[#0d1628] to-[#0b0b10]">
          {stars.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: s.w + "px",
                height: s.w + "px",
                top: s.top + "%",
                left: s.left + "%",
                opacity: s.opacity,
              }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 text-center px-8 max-w-4xl"
        >
          <p className="text-xs tracking-[0.45em] text-[#3b82f6] uppercase mb-6 font-medium">
            Aviation Encyclopedia
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Commercial
            <br />
            <span className="text-[#94a3b8]">Airliners</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md mx-auto leading-relaxed font-mono">
            <Typewriter
              words={[
                "The planes that shrank the world.",
                "From the jet age to the composite era.",
                "Eight hundred passengers. One aircraft.",
                "Crossing oceans since 1970.",
                "Engineering that defies gravity.",
              ]}
              speed={55}
              delayBetweenWords={2200}
              cursorChar="_"
            />
          </p>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-16 flex flex-col items-center gap-2 text-[#94a3b8]"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
              <path
                d="M7 0v16M1 11l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

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
        </div>
      </section>

      {/* Fleet intro marquee */}
      <FleetMarquee planeNames={commercialPlanes.filter((p) => p.active !== false || p.slug === "concorde").map((p) => p.name)} speed={7} />

      {/* Fleet cards */}
      <section id="fleet" className="px-6 md:px-12 lg:px-24 pb-36">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commercialPlanes.filter((p) => p.active !== false || p.slug === "concorde").map((plane, i) => (
              <PlaneCard
                key={plane.name}
                href={`/planes/${plane.slug}`}
                name={plane.name}
                detail={plane.detail}
                fact={plane.fact}
                year={plane.year}
                index={i}
                image={plane.image}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
