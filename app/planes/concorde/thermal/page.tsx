"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Material Choice",
    title: "RR.58 — An Alloy Built for Sustained Heat",
    body: "Concorde's primary structural material is RR.58 (designation AU2GN), an aluminium-copper-magnesium alloy originally developed by Hiduminium for the pistons of high-performance aero-engines. Its defining property is creep resistance at sustained elevated temperature: between 100°C and 180°C, RR.58 retains nearly all of its room-temperature strength, where standard 2024-T3 aerospace aluminium begins to soften noticeably. The alloy is more expensive, harder to machine, and 3% denser than 2024 — penalties accepted because no other widely available aluminium tolerates 3,000-hour cumulative dwell at Mach 2 cruise temperatures over a 25-year service life.",
    stats: [{ value: "100–180°C", label: "Stable Range" }, { value: "AU2GN", label: "Alloy Designation" }],
  },
  {
    label: "Skin Temperatures",
    title: "Where Aerodynamic Friction Heats the Airframe",
    body: "Cruising at Mach 2.04 in air around −56°C at 60,000 ft, the boundary layer over the airframe heats by adiabatic compression and viscous shear to roughly 127°C across most of the upper wing and fuselage. The leading edges run hotter — approximately 115°C — and the nose tip, which absorbs the strongest stagnation heating, reaches 180°C. These are sustained values, not transient peaks. Internal cabin air is held at 21°C through an air-conditioning pack that takes 175°C bleed air from the engines and dumps the difference overboard through a heat exchanger continuously fed by the surrounding atmosphere.",
    stats: [{ value: "127°C", label: "Skin at Cruise" }, { value: "180°C", label: "Nose Tip" }],
  },
  {
    label: "Elongation",
    title: "300 mm of Thermal Growth",
    body: "Aluminium expands roughly 23 micrometres per metre per degree Celsius. Across Concorde's 62-metre length, the temperature rise from −20°C ground soak to +127°C skin produces a fuselage stretch of approximately 300 mm — about a foot. This is observable: a flight engineer's cap once placed in a small gap behind a panel could not be retrieved at altitude because the gap had closed. On every flight a small step appears at the panel-line between the cabin and the flight deck and disappears again on the descent. Structural joints are designed to slide; sealants and fastenings accommodate this displacement on every cycle.",
    stats: [{ value: "300 mm", label: "Cruise Elongation" }, { value: "62 m", label: "Fuselage Length" }],
  },
  {
    label: "Fuel Heat Sink",
    title: "Burning Off Thermal Load",
    body: "The fuel system doubles as the airframe's primary heat sink. Hydraulic fluid, generator oil, air-conditioning refrigerant, and engine accessory bays all dump heat into the fuel before it reaches the combustion chamber, where the energy is recovered as combustion enthalpy rather than radiated to atmosphere. This is the same principle used on the SR-71 but applied within civil-certified safety margins. Fuel temperature at the engine inlet is monitored continuously; if any tank approaches the upper limit, automatic transfer routes hotter fuel forward for burn and replaces it with cooler fuel from less-heated tanks. The whole airframe is, thermally, a heat exchanger flying at twice the speed of sound.",
    stats: [{ value: "Continuous", label: "Heat Transfer" }, { value: "Pre-Burn", label: "Cooling Strategy" }],
  },
]

const SPECS = [
  { value: "127°C", label: "Skin at Cruise" },
  { value: "180°C", label: "Nose Tip" },
  { value: "300 mm", label: "Thermal Growth" },
  { value: "RR.58", label: "Primary Alloy" },
]

export default function ConcordeThermalPage() {
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
          06 — Thermal Engineering
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Kinetic Heating &<br />the Aluminium Airframe
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          A piston-engine alloy chosen for its creep resistance, a fuselage that grows a foot in cruise, and
          a fuel system that doubles as the airframe's primary heat sink — all to keep aluminium viable at Mach 2.
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
            AVIA · Concorde · Thermal Engineering
          </p>
        </div>
      </footer>

    </div>
  )
}
