"use client"
import { motion } from "framer-motion"
import { Aircraft } from "@/lib/data"

const MAX_MACH = 3.6  // scale ceiling — gives breathing room above SR-71's 3.3

// Colour shifts from dim orange → bright red → near-white as speed increases
function barColor(mach: number) {
  const t = (mach - 1.5) / (MAX_MACH - 1.5)  // 0 at Mach 1.5, 1 at MAX_MACH
  if (t < 0.4) return "#f97316"   // orange  (slow end)
  if (t < 0.7) return "#ef4444"   // red      (mid)
  return "#fca5a5"                 // light red (fastest)
}

interface MachScaleProps {
  jets: Aircraft[]
}

export default function MachScale({ jets }: MachScaleProps) {
  const sorted = [...jets]
    .filter((j) => j.mach)
    .sort((a, b) => (b.mach ?? 0) - (a.mach ?? 0))

  // Mach 1 marker as % of total bar width
  const mach1Pct = (1 / MAX_MACH) * 100

  return (
    <section className="bg-[#0b0b10] px-6 md:px-12 lg:px-24 py-24">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-xs tracking-[0.4em] text-red-400 uppercase mb-4 font-medium">
            Top Speed
          </p>
          <h2 className="text-4xl font-bold mb-3">Mach Rating</h2>
          <p className="text-[#94a3b8] text-sm max-w-sm leading-relaxed">
            Maximum velocity at altitude. Mach 1 = 1,235 km/h — the speed of sound.
          </p>
        </div>

        {/* Scale */}
        <div className="space-y-6">
          {sorted.map((jet, i) => {
            const pct = ((jet.mach ?? 0) / MAX_MACH) * 100
            const color = barColor(jet.mach ?? 0)

            return (
              <motion.div
                key={jet.slug}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                viewport={{ once: true, margin: "-60px" }}
                className="group"
              >
                {/* Label row */}
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-base font-semibold tracking-tight text-[#f8fafc]">{jet.name}</span>
                  <span
                    className="text-xs font-mono tracking-widest uppercase tabular-nums"
                    style={{ color }}
                  >
                    Mach {jet.mach?.toFixed(2)}
                  </span>
                </div>

                {/* Track */}
                <div className="relative h-2 w-full bg-[#1e293b] rounded-full overflow-hidden">

                  {/* Mach 1 marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-white/20 z-10"
                    style={{ left: `${mach1Pct}%` }}
                  />

                  {/* Animated bar */}
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    transition={{ duration: 1.1, delay: i * 0.08 + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true, margin: "-60px" }}
                    style={{
                      background: `linear-gradient(to right, #7f1d1d, ${color})`,
                      boxShadow: `0 0 12px 0 ${color}66`,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Axis labels */}
        <div className="relative mt-4 h-5">
          <span className="absolute text-[10px] font-mono text-[#475569]" style={{ left: 0 }}>
            Mach 0
          </span>
          <span
            className="absolute text-[10px] font-mono text-white/30"
            style={{ left: `${mach1Pct}%`, transform: "translateX(-50%)" }}
          >
            Mach 1 ·
          </span>
          <span className="absolute text-[10px] font-mono text-[#475569]" style={{ right: 0 }}>
            Mach {MAX_MACH.toFixed(1)}
          </span>
        </div>

      </div>
    </section>
  )
}
