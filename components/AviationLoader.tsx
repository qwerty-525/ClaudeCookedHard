"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export type LoaderCategory = "commercial" | "fighters" | "engines"

const VERBS: Record<LoaderCategory, string[]> = {
  commercial: [
    "Taxiing",
    "Boarding",
    "Pushing back",
    "Spooling up",
    "Pre-flighting",
    "Cleared for takeoff",
    "Climbing",
    "Cruising",
    "Trimming",
    "Tuning ILS",
    "Holding short",
    "Vectoring",
    "Handing off to tower",
    "Plotting waypoints",
  ],
  fighters: [
    "Spooling up",
    "Pre-flighting",
    "Acquiring lock",
    "Engaging afterburner",
    "Pulling Gs",
    "Stealth-checking",
    "Banking hard",
    "Climbing",
    "Vectoring",
    "Squawking",
    "Pickling",
    "Splashing bandits",
    "Going Mach",
    "Painting target",
    "Ingressing",
  ],
  engines: [
    "Spooling up",
    "Igniting combustor",
    "Light-off detected",
    "Reaching N1",
    "Reaching N2",
    "Stabilising EGT",
    "Engaging afterburner",
    "Modulating bypass",
    "Cooling turbine",
    "Bleeding air",
    "Trimming fuel",
  ],
}

const FACTS: Record<LoaderCategory, string[]> = {
  commercial: [
    "Concorde crossed the Atlantic faster than Earth rotated — westbound passengers landed before local-time departure.",
    "The 747's hump exists because it was originally designed as a freighter — the cockpit was raised to keep cargo loading clear.",
    "An A380 contains over 530 km (330 mi) of wiring.",
    "The Boeing 737 is the most-produced commercial jet airliner ever — over 11,000 built.",
    "Modern airliner cabin air is fully refreshed every 2–3 minutes through HEPA filters.",
    "The 787 Dreamliner is 50% composite by weight — its wings flex up to 7.6 m at full load.",
  ],
  fighters: [
    "The B-2's radar cross-section is roughly that of a small bird.",
    "Only 21 B-2 Spirits were ever built. One was lost in 2008 to moisture in the pitot tubes.",
    "The F-22's thrust-vectoring nozzles deflect ±20° in pitch — independent of velocity vector.",
    "The SR-71 grew ~12 inches at Mach 3 cruise — at takeoff its panels leaked fuel because they hadn't expanded yet.",
    "The F-35's helmet costs $400,000 and projects a 360° camera feed — pilots can see straight through the airframe.",
    "The F-117 had no curved surfaces — every facet was flat because 1970s computers couldn't model curved RCS.",
    "Each B-2 cost roughly $2.1 billion in FY1997 dollars — the most expensive aircraft ever built.",
  ],
  engines: [
    "A GE9X turbofan moves more air per second than a Boeing 737 fuselage volume.",
    "The F-22's F119 engines produce more dry thrust than most fighters generate with afterburner.",
    "Rolls-Royce Trent XWB blades each output more horsepower than a Formula 1 car.",
    "Turbine blades operate above the melting point of their own alloy — sustained by film cooling.",
    "Concorde's Olympus 593 engines began as the powerplant for the cancelled TSR-2 bomber.",
    "GE's F110 powers the F-16 — its core was scaled up to become the F118 in the B-2 Spirit.",
  ],
}

export default function AviationLoader({
  loadPct,
  isLoaded,
  category,
}: {
  loadPct: number
  isLoaded: boolean
  category: LoaderCategory
}) {
  const verbs = VERBS[category]
  const [verbIndex, setVerbIndex] = useState(0)
  const [fact] = useState(() => {
    const pool = FACTS[category]
    return pool[Math.floor(Math.random() * pool.length)]
  })

  useEffect(() => {
    if (isLoaded) return
    const id = setInterval(() => {
      setVerbIndex((i) => (i + 1) % verbs.length)
    }, 900)
    return () => clearInterval(id)
  }, [isLoaded, verbs.length])

  const verb = verbs[verbIndex]
  const accent = category === "fighters" ? "#ef4444" : category === "engines" ? "#f59e0b" : "#7dd3fc"

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] px-6"
      animate={{ opacity: isLoaded ? 0 : 1, pointerEvents: isLoaded ? "none" : "auto" }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div
            className="absolute inset-0 animate-spin rounded-full border-t"
            style={{ borderColor: `${accent} transparent transparent transparent` }}
          />
        </div>

        <div className="h-5 overflow-hidden">
          <motion.p
            key={verb}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="font-mono text-[11px] uppercase tracking-[0.45em]"
            style={{ color: accent }}
          >
            {verb}
            <span className="ml-0.5 inline-block animate-pulse">…</span>
          </motion.p>
        </div>

        <div className="h-px w-48 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${loadPct}%`, background: accent }}
          />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/40">
          {loadPct}%
        </p>

        <div className="mt-6 max-w-md border-l-2 pl-4" style={{ borderColor: `${accent}66` }}>
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
            Did you know
          </p>
          <p className="text-sm leading-relaxed text-white/70">{fact}</p>
        </div>
      </div>
    </motion.div>
  )
}
