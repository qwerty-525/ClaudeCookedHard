"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FlowButton } from "@/components/ui/flow-button"
import { fighterJets, type Aircraft } from "@/lib/data"

const MATCHUPS: {
  title: string
  era: string
  context: string
  leftSlug: string
  rightSlug: string
  leftRecord: { kills: string; losses: string; source: string }
  rightRecord: { kills: string; losses: string; source: string }
  leftLabel: string
  rightLabel: string
}[] = [
  {
    title: "The Cold War Duel",
    era: "1976 vs 1983",
    context: "Designed specifically to counter each other. The Eagle's radar won BVR. The Fulcrum's helmet-sight almost won the close-in fight.",
    leftSlug: "f-15-eagle",
    rightSlug: "mig-29-fulcrum",
    leftRecord: { kills: "104+", losses: "0", source: "Real combat" },
    rightRecord: { kills: "~6", losses: "several", source: "Real combat" },
    leftLabel: "USAF",
    rightLabel: "Soviet / Russian",
  },
  {
    title: "Stealth vs Agility",
    era: "2005 vs 2003",
    context: "One disappears on radar. The other out-turns everything that can see it. In exercises, stealth wins — until the merge.",
    leftSlug: "f-22-raptor",
    rightSlug: "eurofighter-typhoon",
    leftRecord: { kills: "144:0", losses: "0", source: "Northern Edge '06" },
    rightRecord: { kills: ">7:1", losses: "—", source: "Red Flag Alaska" },
    leftLabel: "USAF",
    rightLabel: "NATO Europe",
  },
  {
    title: "Lightweight Champions",
    era: "1978 vs 2001",
    context: "Both redefined the lightweight fighter — the Falcon stripped everything back, the Rafale added everything back.",
    leftSlug: "f-16-fighting-falcon",
    rightSlug: "dassault-rafale",
    leftRecord: { kills: "76+", losses: "1", source: "Real combat" },
    rightRecord: { kills: "Undefeated", losses: "0", source: "Combat & exercises" },
    leftLabel: "Multi-nation",
    rightLabel: "France",
  },
  {
    title: "Lethality Per Dollar",
    era: "1999 vs 1997",
    context: "One lands on carriers; the other lands on roads. Both routinely out-score opponents they have no business beating.",
    leftSlug: "fa-18-super-hornet",
    rightSlug: "saab-jas-39-gripen",
    leftRecord: { kills: "3+", losses: "0", source: "Syria + Red Sea" },
    rightRecord: { kills: "10:0", losses: "0", source: "Red Flag '06 Day 1" },
    leftLabel: "US Navy",
    rightLabel: "Sweden",
  },
]

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] as const },
  }),
}

const LEFT_ACCENT = "#ef4444"
const RIGHT_ACCENT = "#f59e0b"
const AUTO_MS = 4500

function JetSlide({
  jet,
  record,
  accent,
  dir,
}: {
  jet: Aircraft
  record: { kills: string; losses: string; source: string }
  accent: string
  dir: number
}) {
  const router = useRouter()
  const href = `/fighters/${jet.slug}`

  return (
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div
        key={jet.slug}
        custom={dir}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="flex flex-col h-full"
      >
        <div
          className="group relative flex-1 rounded-2xl border border-white/[0.07] bg-[#12090b] p-6 overflow-hidden cursor-pointer flex flex-col"
          onClick={() => router.push(href)}
        >
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to right, transparent, ${accent}88, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ background: `radial-gradient(ellipse at top, ${accent}12, transparent 65%)` }}
          />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accent }}
                >
                  {jet.year}
                </span>
                {jet.mach && (
                  <p className="text-[9px] text-[#94a3b8] mt-0.5 font-mono">Mach {jet.mach}</p>
                )}
              </div>
              {jet.image && (
                <Image
                  src={jet.image}
                  alt={jet.name}
                  width={80}
                  height={32}
                  className="object-contain opacity-80"
                />
              )}
            </div>

            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{jet.name}</h3>
            <p className="text-xs text-[#94a3b8] mb-4">{jet.detail}</p>

            <div className="w-6 h-px mb-4" style={{ background: accent + "66" }} />

            {/* Combat record */}
            <div className="mb-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3 text-center">
                <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] mb-1">Kills</p>
                <p className="text-xl font-black leading-none" style={{ color: accent }}>
                  {record.kills}
                </p>
              </div>
              <div className="rounded-lg border border-white/[0.07] bg-black/20 px-3 py-3 text-center">
                <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] mb-1">Losses</p>
                <p className="text-xl font-black leading-none text-white">{record.losses}</p>
              </div>
            </div>
            <p className="text-[10px] text-[#94a3b8]/70 mb-4 font-mono">{record.source}</p>

            <p className="text-[13px] text-[#94a3b8] leading-relaxed flex-1">{jet.fact}</p>

            <div className="mt-5" onClick={(e) => e.stopPropagation()}>
              <a href={href}>
                <FlowButton text="Read more" accent={accent} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function DogfightCarousel() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const paused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback((step: number) => {
    setDir(step)
    setIndex((i) => (i + step + MATCHUPS.length) % MATCHUPS.length)
  }, [])

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!paused.current) advance(1)
    }, AUTO_MS)
  }, [advance])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTimer])

  const matchup = MATCHUPS[index]
  const leftJet = fighterJets.find((j) => j.slug === matchup.leftSlug)!
  const rightJet = fighterJets.find((j) => j.slug === matchup.rightSlug)!

  return (
    <div
      className="avia-panel w-full rounded-[32px] px-5 py-8 md:px-8 md:py-10"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      {/* Header */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-[#f87171]">
            Dogfight Record
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Doctrine Clash.</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#94a3b8]">
            Four rivalries — combat kills, exercise ratios, and the doctrine behind each trigger pull.
          </p>
        </div>
        <div className="ml-8 hidden flex-shrink-0 items-center gap-2 md:flex">
          <button
            onClick={() => { advance(-1); startTimer() }}
            aria-label="Previous matchup"
            className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white transition-all duration-200 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => { advance(1); startTimer() }}
            aria-label="Next matchup"
            className="rounded-full border border-red-400/40 bg-red-400/10 p-2 text-[#f87171] transition-all duration-200 hover:bg-red-400/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid: left | VS | right */}
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_180px_1fr]">
        <div className="flex flex-col">
          <div
            className="mb-3 px-3 py-1.5 rounded-lg self-start text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ background: LEFT_ACCENT + "18", color: LEFT_ACCENT }}
          >
            {matchup.leftLabel}
          </div>
          <JetSlide jet={leftJet} record={matchup.leftRecord} accent={LEFT_ACCENT} dir={dir} />
        </div>

        {/* VS strip */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.25 } }}
            className="flex flex-col items-center justify-center gap-4 rounded-[28px] border border-white/[0.07] bg-black/20 py-6 md:py-0"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full bg-red-400/[0.08] blur-sm" />
              <span className="relative text-xl font-black text-white/30 tracking-tighter select-none">VS</span>
            </div>
            <div className="space-y-1.5 text-center">
              <p className="text-[11px] font-bold text-white tracking-wide leading-snug">
                {matchup.title}
              </p>
              <p className="text-[10px] text-[#94a3b8] font-mono">{matchup.era}</p>
            </div>
            <p className="max-w-[140px] text-center text-[11px] leading-relaxed text-[#94a3b8]">
              {matchup.context}
            </p>
            <div className="flex gap-1.5 mt-2">
              {MATCHUPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); startTimer() }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === index ? "20px" : "6px",
                    height: "6px",
                    background: i === index ? LEFT_ACCENT : "rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Go to matchup ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col">
          <div
            className="mb-3 px-3 py-1.5 rounded-lg self-start text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ background: RIGHT_ACCENT + "18", color: RIGHT_ACCENT }}
          >
            {matchup.rightLabel}
          </div>
          <JetSlide jet={rightJet} record={matchup.rightRecord} accent={RIGHT_ACCENT} dir={dir} />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="mt-6 flex items-center justify-center gap-3 md:hidden">
        <button
          onClick={() => { advance(-1); startTimer() }}
          className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {MATCHUPS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); startTimer() }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                background: i === index ? LEFT_ACCENT : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => { advance(1); startTimer() }}
          className="rounded-full border border-red-400/40 bg-red-400/10 p-2 text-[#f87171]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
