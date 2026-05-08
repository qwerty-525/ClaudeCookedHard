"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Bogie Layout",
    title: "Twin-Wheel Main Gear, High Approach Energy",
    body: "Concorde's main landing gear consists of two four-wheel bogies — twin axles, twin wheels per axle — retracting inward into the wing root. Touchdown speed of 187 mph and weight on landing of approximately 111,000 kg combine to produce a kinetic energy at touchdown roughly twice that of a 737. The bogie geometry distributes contact load over four tyres per side and damps yaw oscillation during the critical first seconds of rollout when aerodynamic control authority is rapidly fading. A two-wheel nose gear handles steering and the additional drogue requirement of carrying load through the steep nose-down attitude that Concorde adopts on approach.",
    stats: [{ value: "187 mph", label: "Touchdown Speed" }, { value: "12", label: "Total Wheels" }],
  },
  {
    label: "Carbon Brakes",
    title: "First Carbon-Carbon System Certified for Civil Aviation",
    body: "Dunlop developed Concorde's carbon-carbon brake discs in the early 1970s — the first such system ever certified for commercial passenger flight. Carbon-carbon retains its mechanical strength as it heats; conventional steel brakes lose strength above 600°C and risk warping or fade. During a maximum-energy rejected takeoff at maximum gross weight, brake disc temperatures rise to roughly 1,000°C within seconds of full pedal application. Carbon's specific heat absorbs roughly 2.5× more energy per kilogram than steel, which made the system viable on an aircraft whose every pound of empty weight came at a fuel-burn cost.",
    stats: [{ value: "1,000°C", label: "Peak Disc Temp" }, { value: "2.5×", label: "Energy Density vs Steel" }],
  },
  {
    label: "Anti-Skid",
    title: "Wheel-by-Wheel Modulation at 16 Hz",
    body: "An eight-channel anti-skid system samples wheel speed at each main bogie wheel sixteen times per second, comparing measured rotation to a reference deceleration profile derived from groundspeed. Any wheel showing impending lock-up has hydraulic pressure dumped from its brake until rotation is restored, then pressure is reapplied. The 16 Hz cycle rate exceeds anything in service in 1969 and was adopted because Concorde's narrow tyre footprint and high entry speed left no margin for skid recovery — a single locked tyre at 180 mph would degrade rapidly enough to compromise the rollout.",
    stats: [{ value: "16 Hz", label: "Sampling Rate" }, { value: "8", label: "Independent Channels" }],
  },
  {
    label: "Rejected Takeoff",
    title: "100 MJ of Energy Absorption",
    body: "Civil certification requires the gear and brakes together to absorb the full kinetic energy of a maximum-weight aircraft accelerating to V1 and then rejecting takeoff. For Concorde at maximum takeoff weight of 185,070 kg with V1 in the region of 165 knots, this produces a brake-energy demand of approximately 100 MJ per stop. The carbon stack is sized to absorb this energy in a single application without disc disintegration. Following a maximum-energy stop, the gear is rated for further rejected-takeoff cycles without mandated cooldown — an unusual provision required because Concorde's runway-margin economics could not tolerate ground-hold time after an abort.",
    stats: [{ value: "100 MJ", label: "Brake Energy" }, { value: "185,070 kg", label: "Max Takeoff Weight" }],
  },
]

const SPECS = [
  { value: "187 mph", label: "Touchdown Speed" },
  { value: "100 MJ", label: "Brake Capacity" },
  { value: "1,000°C", label: "Peak Disc Temp" },
  { value: "16 Hz", label: "Anti-Skid Cycle" },
]

export default function ConcordeLandingGearPage() {
  return (
    <div className="min-h-screen bg-[#04060a] text-white">

      <div className="px-10 pt-10 md:px-16">
        <Link
          href="/planes/concorde"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Concorde
        </Link>
      </div>

      <section className="px-10 py-20 md:px-16">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: ACCENT + "b3" }}>
          05 — Landing Gear
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          High-Energy<br />Undercarriage
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          Twin-wheel bogies, the first carbon brakes ever certified for commercial flight, and an anti-skid
          system cycling sixteen times per second — built for a 187 mph touchdown and 100 MJ stops.
        </p>
      </section>

      <div className="px-10 md:px-16">
        <div className="grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
          {SPECS.map(sp => (
            <div key={sp.label} className="flex flex-col items-center justify-center bg-[#04060a]/80 px-6 py-8 text-center">
              <p className="mb-1 font-mono text-2xl font-bold text-white">{sp.value}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#94a3b8]">{sp.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-10 py-20 md:px-16">
        <div className="mx-auto max-w-3xl space-y-20">
          {SECTIONS.map((s, i) => (
            <article key={i}>
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: ACCENT + "b3" }}>
                {s.label}
              </p>
              <h2 className="mb-4 text-3xl font-bold leading-tight">{s.title}</h2>
              <p className="mb-8 text-sm leading-[1.85] text-[#94a3b8]">{s.body}</p>
              <div className="flex gap-10">
                {s.stats.map(st => (
                  <div key={st.label}>
                    <p className="font-mono text-2xl font-bold text-white">{st.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">{st.label}</p>
                  </div>
                ))}
              </div>
              {i < SECTIONS.length - 1 && <div className="mt-16 h-px bg-white/[0.06]" />}
            </article>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/[0.06] px-10 py-10 md:px-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link
            href="/planes/concorde"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Concorde
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
            AVIA · Concorde · Landing Gear
          </p>
        </div>
      </footer>

    </div>
  )
}
