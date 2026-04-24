"use client"
import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import DropBombSection from "@/components/DropBombSection"
import PlaneCard from "@/components/PlaneCard"
import YouTubeClipLoop from "@/components/YouTubeClipLoop"
import MachScale from "@/components/MachScale"
import DogfightCarousel from "@/components/DogfightCarousel"
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
  const featuredJets = fighterJets.slice(0, 3)

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

      <section className="relative border-y border-white/[0.06] bg-[#12090b]">
        <div className="avia-grid absolute inset-0 opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.35fr_0.85fr] md:px-12 lg:px-24">
          <div className="avia-panel rounded-[28px] p-7 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#f87171]">
              Threat Profile
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Speed, stealth, and overmatch should read like three different design religions.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
              This section works best when it feels severe and deliberate. The important part is not just spectacle, but
              the sense that every aircraft was built around a specific doctrine.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#squadron"
                className="avia-pill-button inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/12 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-red-400/45 hover:bg-red-400/18"
              >
                View Squadron
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="avia-panel rounded-[28px] p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#f59e0b]">
              Flight Deck
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {featuredJets.map((jet) => (
                <div key={jet.slug} className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#fda4af]">{jet.year}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{jet.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Drop bomb scroll sequence → leads into F-35 explore */}
      <DropBombSection exploreHref="/fighters/f35" />

      {/* Mach speed scale */}
      <MachScale jets={fighterJets} />

      {/* B-2 Spirit teaser */}
      <section className="relative flex h-[72vh] items-end overflow-hidden border-y border-white/[0.05]">
        {/* Looping B-2 footage: 0:40–0:43 */}
        <YouTubeClipLoop
          videoId="7Vb7IKhVKu4"
          clips={[{ start: 40, end: 56 }]}
          className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/85" />

        <div className="relative z-10 w-full px-8 pb-16 md:px-14 lg:px-20">
          <div className="max-w-xl text-left">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-white/55">Northrop Grumman</p>
            <h2 className="text-4xl font-bold text-white md:text-5xl">B-2 Spirit</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.24em] text-white/55">Deep strike · flying wing</p>
            <p className="mt-5 text-sm leading-relaxed text-[#cbd5e1] md:text-base">
              The stealth bomber that turned strategic bombing into something ghostlike, silent, and unnervingly precise.
            </p>
            <Link
              href="/scrollytelling"
              className="avia-pill-button mt-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/14"
            >
              Explore the B-2
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* F-117 Nighthawk scrollytelling teaser */}
      <section className="relative flex h-[42vh] items-end overflow-hidden bg-gradient-to-b from-[#04060a] to-[#0b0b10]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        <div className="relative z-10 w-full px-8 pb-14 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.4em] text-red-400/60">Lockheed Skunk Works</p>
          <h2 className="text-4xl font-bold text-white">F-117 Nighthawk</h2>
          <p className="mt-2 text-sm text-white/60">The original ghost — stealth before stealth had a name</p>
          <Link
            href="/fighters/f117"
            className="avia-pill-button mt-8 inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/10 px-7 py-3 text-sm font-medium text-white/90 backdrop-blur-sm transition-all duration-200 hover:border-red-400/50 hover:bg-red-400/16"
          >
            Explore the F-117
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Dogfight rivalry carousel */}
      <section className="relative px-6 pb-24 pt-10 md:px-12 lg:px-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <DogfightCarousel />
        </div>
      </section>

      {/* Squadron cards */}
      <section id="squadron" className="relative bg-[#0b0b10] px-6 pb-36 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.12),transparent_38%)]" />
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                role={jet.role}
                roleColor={jet.roleColor}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
