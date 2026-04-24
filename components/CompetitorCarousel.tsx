"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { FlowButton } from "@/components/ui/flow-button"
import { commercialPlanes, type Aircraft } from "@/lib/data"

const STATUS_CONFIG = {
  active:  { dot: "#22c55e", label: "In Service" },
  legacy:  { dot: "#f59e0b", label: "Production Ended" },
  retired: { dot: "#ef4444", label: "Retired" },
}

// ─── Competitor pairs ─────────────────────────────────────────────────────────
const PAIRS: {
  rivalry: string
  era: string
  context: string
  boeingSlug: string
  airbusSlug: string
}[] = [
  {
    rivalry: "The Narrowbody Duel",
    era: "1967 vs 1987",
    context:
      "The world's two best-selling jetliners. Over 25,000 combined orders. One airline's 737 is another's A320 — and both know it.",
    boeingSlug: "boeing-737",
    airbusSlug: "airbus-a320",
  },
  {
    rivalry: "The Jumbo War",
    era: "1968 vs 2005",
    context:
      "Boeing created the jumbo jet and held the title of world's largest airliner for 37 years. Airbus answered with two full decks.",
    boeingSlug: "boeing-747",
    airbusSlug: "airbus-a380",
  },
  {
    rivalry: "Next-Gen Widebody",
    era: "2009 vs 2013",
    context:
      "Both built from carbon fibre. Both ultra-efficient. Airlines that chose one didn't need the other — making every order a war.",
    boeingSlug: "boeing-787-dreamliner",
    airbusSlug: "airbus-a350",
  },
  {
    rivalry: "Long-Range Heavyweights",
    era: "1994 vs 1991",
    context:
      "Airbus built four engines to guarantee ETOPS-free route authority. Boeing bet two could do it better. The 777 won.",
    boeingSlug: "boeing-777",
    airbusSlug: "airbus-a340",
  },
  {
    rivalry: "The Workhorse Widebody",
    era: "1982 vs 1992",
    context:
      "The 757 opened thin transatlantic routes no widebody could serve economically. The A330 answered with more seats and longer range.",
    boeingSlug: "boeing-757",
    airbusSlug: "airbus-a330",
  },
]

// ─── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
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

// ─── Single plane card ─────────────────────────────────────────────────────────
function PlaneSlide({
  plane,
  accent,
  dir,
}: {
  plane: Aircraft
  accent: string
  dir: number
}) {
  const router = useRouter()
  const href = `/planes/${plane.slug}`

  return (
    <AnimatePresence mode="wait" custom={dir}>
      <motion.div
        key={plane.slug}
        custom={dir}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        className="flex flex-col h-full"
      >
        {/* Card body */}
        <div
          className="group relative flex-1 rounded-2xl border border-white/[0.07] bg-[#12121a] p-6 overflow-hidden cursor-pointer flex flex-col"
          onClick={() => router.push(href)}
        >
          {/* Hover top-edge glow */}
          <div
            className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(to right, transparent, ${accent}88, transparent)` }}
          />
          {/* Hover bg glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{ background: `radial-gradient(ellipse at top, ${accent}12, transparent 65%)` }}
          />

          <div className="relative z-10 flex flex-col h-full">
            {/* Year + manufacturer */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col gap-1">
                <span
                  className="text-[10px] font-semibold tracking-[0.2em] uppercase"
                  style={{ color: accent }}
                >
                  {plane.year}
                </span>
                {(() => {
                  const cfg = STATUS_CONFIG[plane.status ?? "active"]
                  return (
                    <span className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: cfg.dot, boxShadow: `0 0 5px ${cfg.dot}99` }}
                      />
                      <span className="text-[9px] font-medium tracking-wide" style={{ color: cfg.dot }}>
                        {cfg.label}
                      </span>
                    </span>
                  )
                })()}
              </div>
              {plane.image && (
                <Image
                  src={plane.image}
                  alt={plane.name}
                  width={80}
                  height={32}
                  className="object-contain opacity-80"
                />
              )}
            </div>

            {/* Name */}
            <h3 className="text-2xl font-bold text-white mb-1 leading-tight">{plane.name}</h3>
            <p className="text-xs text-[#94a3b8] mb-4">{plane.detail}</p>

            {/* Divider */}
            <div className="w-6 h-px mb-4" style={{ background: accent + "66" }} />

            {/* Fact */}
            <p className="text-[13px] text-[#94a3b8] leading-relaxed flex-1">{plane.fact}</p>

            {/* Specs strip */}
            {plane.specs && plane.specs.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                {plane.specs.slice(0, 4).map((s) => (
                  <div key={s.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-2.5 py-2">
                    <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] mb-0.5">{s.label}</p>
                    <p className="text-[11px] font-mono font-semibold text-white leading-snug">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Routes */}
            {plane.routes && plane.routes.length > 0 && (
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#94a3b8] mb-2.5">Known Routes</p>
                <div className="flex flex-wrap gap-1.5">
                  {plane.routes.map((route) => (
                    <span
                      key={route}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-[#94a3b8]"
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
                      {route}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Read more */}
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

// ─── Main component ────────────────────────────────────────────────────────────
const BOEING_ACCENT = "#3b82f6"
const AIRBUS_ACCENT = "#f59e0b"
const AUTO_MS = 4500

export default function CompetitorCarousel() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const paused = useRef(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(
    (step: number) => {
      setDir(step)
      setIndex((i) => (i + step + PAIRS.length) % PAIRS.length)
    },
    [],
  )

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      if (!paused.current) advance(1)
    }, AUTO_MS)
  }, [advance])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [startTimer])

  const pair = PAIRS[index]
  const boeingPlane = commercialPlanes.find((p) => p.slug === pair.boeingSlug)!
  const airbusPlane = commercialPlanes.find((p) => p.slug === pair.airbusSlug)!

  return (
    <div
      className="avia-panel w-full rounded-[32px] px-5 py-8 md:px-8 md:py-10"
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
    >
      {/* Section header */}
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-[#7dd3fc]">
            The Great Rivalry
          </p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Boeing vs. Airbus.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-[#94a3b8]">
            Five rivalries that defined commercial aviation — head to head, pair by pair.
          </p>
        </div>
        {/* Nav arrows */}
        <div className="ml-8 hidden flex-shrink-0 items-center gap-2 md:flex">
          <button
            onClick={() => { advance(-1); startTimer() }}
            aria-label="Previous pair"
            className="rounded-full border border-white/10 bg-white/[0.03] p-2 text-white transition-all duration-200 hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => { advance(1); startTimer() }}
            aria-label="Next pair"
            className="rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 p-2 text-[#7dd3fc] transition-all duration-200 hover:bg-[#3b82f6]/20"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid: Boeing | VS strip | Airbus */}
      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1fr_180px_1fr]">
        {/* Boeing card */}
        <div className="flex flex-col">
          <div
            className="mb-3 px-3 py-1.5 rounded-lg self-start text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ background: BOEING_ACCENT + "18", color: BOEING_ACCENT }}
          >
            Boeing
          </div>
          <PlaneSlide plane={boeingPlane} accent={BOEING_ACCENT} dir={dir} />
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
            {/* VS badge */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full bg-white/[0.04] blur-sm" />
              <span className="relative text-xl font-black text-white/30 tracking-tighter select-none">VS</span>
            </div>

            {/* Rivalry label */}
            <div className="space-y-1.5 text-center">
              <p className="text-[11px] font-bold text-white tracking-wide leading-snug">
                {pair.rivalry}
              </p>
              <p className="text-[10px] text-[#94a3b8] font-mono">{pair.era}</p>
            </div>

            {/* Context */}
            <p className="max-w-[140px] text-center text-[11px] leading-relaxed text-[#94a3b8]">
              {pair.context}
            </p>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-2">
              {PAIRS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); startTimer() }}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: i === index ? "20px" : "6px",
                    height: "6px",
                    background: i === index ? BOEING_ACCENT : "rgba(255,255,255,0.15)",
                  }}
                  aria-label={`Go to pair ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Airbus card */}
        <div className="flex flex-col">
          <div
            className="mb-3 px-3 py-1.5 rounded-lg self-start text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ background: AIRBUS_ACCENT + "18", color: AIRBUS_ACCENT }}
          >
            Airbus
          </div>
          <PlaneSlide plane={airbusPlane} accent={AIRBUS_ACCENT} dir={dir} />
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
          {PAIRS.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); startTimer() }}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === index ? "20px" : "6px",
                height: "6px",
                background: i === index ? BOEING_ACCENT : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
        <button
          onClick={() => { advance(1); startTimer() }}
          className="rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 p-2 text-[#7dd3fc]"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
