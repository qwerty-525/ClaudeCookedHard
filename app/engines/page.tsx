"use client"
import Link from "next/link"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import PlaneCard from "@/components/PlaneCard"
import { Typewriter } from "@/components/ui/typewriter"
import { EngineTypeCarousel } from "@/components/ui/engine-type-carousel"
import { EngineFaq } from "@/components/ui/engine-faq"
import { engines } from "@/lib/data"

// Three tiers of exhaust streaks — white-hot core, orange mid, red outer
const coreStreaks = Array.from({ length: 10 }, (_, i) => ({
  top: 44 + ((i * 17 + 3) % 12),   // clustered around vertical centre
  width: ((i * 23 + 15) % 20) + 12,
  opacity: ((i * 11 + 7) % 8) / 100 + 0.18,
  delay: ((i * 5 + 1) % 20) / 10,
  duration: ((i * 7 + 8) % 8) / 10 + 0.6,  // fast
}))
const midStreaks = Array.from({ length: 14 }, (_, i) => ({
  top: 30 + ((i * 31 + 7) % 40),
  width: ((i * 19 + 10) % 25) + 8,
  opacity: ((i * 13 + 5) % 10) / 100 + 0.09,
  delay: ((i * 7 + 3) % 28) / 10,
  duration: ((i * 11 + 12) % 12) / 10 + 1.1,
}))
const outerStreaks = Array.from({ length: 16 }, (_, i) => ({
  top: ((i * 41 + 9) % 100),
  width: ((i * 13 + 8) % 18) + 5,
  opacity: ((i * 7 + 3) % 8) / 100 + 0.04,
  delay: ((i * 9 + 5) % 35) / 10,
  duration: ((i * 17 + 18) % 16) / 10 + 1.8,
}))
// Shock diamonds — bright dots along the exhaust centreline
const diamonds = Array.from({ length: 6 }, (_, i) => ({
  left: 55 + i * 7,
  size: Math.max(2, 5 - i),
  opacity: 0.6 - i * 0.08,
}))

export default function EnginesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(heroProgress, [0, 1], [0, -100])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])
  const featuredEngines = engines.slice(0, 3)

  return (
    <main className="bg-[#04060a]">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* ── Fire background ───────────────────────────────────────────── */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, #1a0800 0%, #04060a 70%)" }}>

          {/* Outer red streaks — cooling exhaust */}
          {outerStreaks.map((s, i) => (
            <div key={`o${i}`} className="absolute h-px animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #dc2626, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}

          {/* Mid orange streaks */}
          {midStreaks.map((s, i) => (
            <div key={`m${i}`} className="absolute h-px animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #ea580c, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}

          {/* Core white-hot streaks */}
          {coreStreaks.map((s, i) => (
            <div key={`c${i}`} className="absolute animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", height: "2px", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #fef9c3, #ffffff, #fef9c3, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}
        </div>

        {/* ── Afterburner core glow ─────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Far red bloom */}
          <div className="absolute w-[700px] h-[340px] rounded-full bg-red-700/20 blur-3xl" />
          {/* Orange plume */}
          <div className="absolute w-[440px] h-[180px] rounded-full bg-orange-500/25 blur-2xl" />
          {/* Amber mid */}
          <div className="absolute w-[240px] h-[90px] rounded-full bg-amber-400/35 blur-xl" />
          {/* Yellow-white hot zone */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[80px] h-[28px] rounded-full bg-yellow-100/70 blur-md"
          />
          {/* Blinding nozzle point */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-3 h-3 rounded-full bg-white blur-[2px]"
          />
        </div>

        {/* ── Shock diamonds ────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          {diamonds.map((d, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [d.opacity * 0.6, d.opacity, d.opacity * 0.6] }}
              transition={{ duration: 0.7 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              className="absolute rounded-full bg-white"
              style={{ left: d.left + "%", width: d.size + "px", height: d.size + "px",
                boxShadow: `0 0 ${d.size * 3}px ${d.size}px rgba(254,240,138,0.6)` }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 text-center px-8 max-w-4xl"
        >
          <p className="text-xs tracking-[0.45em] text-amber-400 uppercase mb-6 font-medium">
            Aviation Encyclopedia
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Jet
            <br />
            <span className="text-[#94a3b8]">Engines</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md mx-auto leading-relaxed font-mono">
            <Typewriter
              words={[
                "Where combustion meets precision.",
                "Thrust measured in jumbo jets.",
                "115,000 lbf. On a single spool.",
                "The heart of every flight.",
                "Engineering at 1,600°C.",
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

      <section className="relative border-y border-white/[0.06] bg-[#120d07]">
        <div className="avia-grid absolute inset-0 opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.35fr_0.85fr] md:px-12 lg:px-24">
          <div className="avia-panel rounded-[28px] p-7 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#fbbf24]">
              Core Thesis
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              The engine page should feel hotter, denser, and more mechanical than the airframe pages.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
              Less romance, more pressure ratios. The goal here is to make the technical detail feel heavy and expensive.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#engines"
                className="avia-pill-button inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-amber-400/45 hover:bg-amber-400/16"
              >
                Browse Engines
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="avia-panel rounded-[28px] p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#fb923c]">
              Power Band
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {featuredEngines.map((engine) => (
                <div key={engine.slug} className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#fdba74]">{engine.year}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{engine.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro block */}
      <section className="relative bg-gradient-to-b from-[#04060a] via-[#080601] to-[#0b0b10] px-6 py-24 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-amber-400/70 uppercase mb-4">The Power Behind Flight</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From 1,000 lbf to 115,000 lbf.
          </h2>
          <p className="text-[#94a3b8] leading-relaxed text-lg">
            A jet engine compresses air to 40× atmospheric pressure, ignites it at 1,600°C, and expels it faster than
            the speed of sound — all while spinning at 15,000 RPM. These are the engines that made it possible.
          </p>
        </div>
      </section>

      {/* Engine type carousel */}
      <section className="relative bg-[#0b0b10] px-6 py-24 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <EngineTypeCarousel />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-[#04060a] px-6 py-24 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <EngineFaq />
        </div>
      </section>

      {/* Engine cards */}
      <section id="engines" className="relative bg-[#0b0b10] px-6 pb-36 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_38%)]" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] text-amber-400 uppercase mb-4 font-medium">
              The Powerplants
            </p>
            <h2 className="text-4xl font-bold">Seven Engines.</h2>
            <p className="text-[#94a3b8] mt-3 max-w-md leading-relaxed">
              Commercial workhorses, supersonic relics, and afterburning monsters — the engines that define aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {engines.map((engine, i) => (
              <PlaneCard
                key={engine.name}
                href={`/engines/${engine.slug}`}
                name={engine.name}
                detail={engine.detail}
                fact={engine.fact}
                year={engine.year}
                index={i}
                accent="#f59e0b"
                image={engine.image}
                role={engine.role}
                roleColor={engine.roleColor}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
