"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import DropBombSection from "@/components/DropBombSection"
import PlaneCard from "@/components/PlaneCard"
import YouTubeClipLoop from "@/components/YouTubeClipLoop"
import MachScale from "@/components/MachScale"
import { Typewriter } from "@/components/ui/typewriter"
import { fighterJets } from "@/lib/data"

// F-35 clip: 2:30–2:35
const F35_CLIPS = [{ start: 150, end: 155 }]

// Deterministic streaks — no hydration mismatch
const streaks = Array.from({ length: 22 }, (_, i) => ({
  top: ((i * 31 + 7) % 100),
  width: ((i * 23 + 10) % 30) + 8,
  opacity: ((i * 11 + 5) % 12) / 100 + 0.04,
  delay: ((i * 7 + 3) % 30) / 10,
  duration: ((i * 13 + 15) % 20) / 10 + 1.4,
  isBlue: i % 3 === 0,
}))


export default function FightersPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(heroProgress, [0, 1], [0, -100])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">
      {/* Cinematic Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* YouTube video background */}
        <div className="absolute inset-0 bg-[#04060a]">
          <YouTubeClipLoop
            videoId="W41nCCFZgyA"
            clips={F35_CLIPS}
            className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
          />
          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-black/55" />
          {/* Top/bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />
        </div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 text-center px-8 max-w-4xl"
        >
          <p className="text-xs tracking-[0.45em] text-red-400 uppercase mb-6 font-medium">
            Aviation Encyclopedia
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Fighter
            <br />
            <span className="text-[#94a3b8]">Jets</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md mx-auto leading-relaxed font-mono">
            <Typewriter
              words={[
                "Built for speed. Built to survive.",
                "Radar cross-section: undetectable.",
                "Mach 2. Afterburner. Full send.",
                "Air supremacy isn't negotiated.",
                "The last thing you never see.",
              ]}
              speed={50}
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

      {/* Drop bomb scroll sequence → leads into F-35 explore */}
      <DropBombSection exploreHref="/fighters/f35" />

      {/* Mach speed scale */}
      <MachScale jets={fighterJets} />

      {/* B-2 Spirit teaser */}
      <section className="relative h-[70vh] flex items-end overflow-hidden">
        {/* Looping B-2 footage: 0:40–0:43 */}
        <YouTubeClipLoop
          videoId="7Vb7IKhVKu4"
          clips={[{ start: 40, end: 56 }]}
          className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />

        <div className="relative z-10 w-full text-center pb-16 px-8">
          <p className="text-xs tracking-[0.4em] text-white/50 uppercase mb-3">Northrop Grumman</p>
          <h2 className="text-4xl font-bold text-white">B-2 Spirit</h2>
          <p className="text-white/60 mt-2 text-sm mb-8">The stealth bomber that redefined air power</p>
          <a
            href="/scrollytelling"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/25 text-white/80 text-sm font-medium backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            Click to explore more
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* F-117 Nighthawk scrollytelling teaser */}
      <section className="relative h-[40vh] flex items-end overflow-hidden bg-gradient-to-b from-[#04060a] to-[#0b0b10]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative z-10 w-full text-center pb-16 px-8">
          <p className="text-xs tracking-[0.4em] text-red-400/60 uppercase mb-3">Lockheed Skunk Works</p>
          <h2 className="text-4xl font-bold text-white">F-117 Nighthawk</h2>
          <p className="text-white/60 mt-2 text-sm mb-8">The original ghost — stealth before stealth had a name</p>
          <a
            href="/fighters/f117"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-red-400/25 text-white/80 text-sm font-medium backdrop-blur-sm hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-200"
          >
            Click to explore more
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>

      {/* Squadron cards */}
      <section className="bg-[#0b0b10] px-6 md:px-12 lg:px-24 pb-36">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 pt-4">
            <p className="text-xs tracking-[0.4em] text-red-400 uppercase mb-4 font-medium">
              Icons of Air Combat
            </p>
            <h2 className="text-4xl font-bold">The Squadron</h2>
            <p className="text-[#94a3b8] mt-3 max-w-md leading-relaxed">
              From Cold War legends to 5th-generation stealth — the jets that redefined modern air power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fighterJets.map((jet, i) => (
              <PlaneCard
                key={jet.name}
                href={`/fighters/${jet.slug}`}
                name={jet.name}
                detail={jet.detail}
                fact={jet.fact}
                year={jet.year}
                index={i}
                accent="#ef4444"
                image={jet.image}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
