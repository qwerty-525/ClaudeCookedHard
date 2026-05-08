"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Variable Geometry",
    title: "Hydraulic Ramps That Reshape the Inlet in Flight",
    body: "Each of the four engine intakes is a rectangular box upstream of the Olympus 593 face, with two hydraulically actuated ramps in its upper wall. The forward ramp pivots downward and the aft ramp pivots upward as Mach number rises, progressively narrowing the throat and bending the airflow through a controlled series of oblique shocks. Ramp position is commanded by an analogue intake control unit (ICU) that takes total pressure, static pressure, angle-of-attack and Mach number as inputs and adjusts ramp angle within milliseconds. There are no fixed-geometry compromises — the intake is reconfigured continuously from rotation through Mach 2.04.",
    stats: [{ value: "2", label: "Ramps per Intake" }, { value: "Mach 0 → 2.04", label: "Active Range" }],
  },
  {
    label: "Shock Compression",
    title: "Decelerating from Mach 2 to Subsonic Before the Compressor",
    body: "A turbojet compressor cannot ingest supersonic flow. The intake's job is to stand a series of two oblique shocks followed by a single normal shock that takes the airstream from Mach 2 in the freestream to roughly Mach 0.5 at the compressor face. Each oblique shock turns the flow and recovers a portion of total pressure; the final normal shock drops the remaining velocity into the subsonic regime with minimal loss. Total pressure recovery exceeds 90% at design Mach — comparable to the best military supersonic intakes of the era and unmatched on any other commercial aircraft.",
    stats: [{ value: "Mach 2 → 0.5", label: "Inlet Decel" }, { value: "> 90%", label: "Total Pressure Recovery" }],
  },
  {
    label: "Spill Doors",
    title: "Managing Excess Mass Flow",
    body: "At low speed the engine demands more air than the inlet area can supply at freestream pressure, so an auxiliary inlet door opens in the lower lip to let extra air enter. At high Mach the situation reverses — the captured stream tube is larger than the engine wants — and four spill doors open in the lower wall to dump excess flow back into the boundary layer overboard. Without spill capacity, captured air would either back up the duct (causing intake unstart) or overspeed the compressor. Spill control runs continuously and silently across the envelope and is one of the systems most directly responsible for Concorde's ability to operate at Mach 2 indefinitely.",
    stats: [{ value: "4", label: "Spill Doors per Intake" }, { value: "1", label: "Auxiliary Inlet Door" }],
  },
  {
    label: "Thrust Distribution",
    title: "When the Intake Outpulls the Engine",
    body: "At Mach 2 cruise, roughly 63% of net propulsive force originates in the intake itself — the high pressure recovered against the inclined ramps acts as forward thrust on the airframe. The engine core contributes around 29%, and the convergent-divergent exhaust nozzle contributes the remainder. This distribution is unlike any subsonic powerplant, where the engine produces essentially all the thrust. It also means that an intake unstart event, where shock structure suddenly collapses, is the most violent failure mode on the airframe — instantaneously removing the majority of one side's thrust and yawing the aircraft hard.",
    stats: [{ value: "63%", label: "Thrust from Intake" }, { value: "29%", label: "Thrust from Engine" }],
  },
]

const SPECS = [
  { value: "63%", label: "Intake Thrust at M2" },
  { value: "> 90%", label: "Pressure Recovery" },
  { value: "2", label: "Ramps per Intake" },
  { value: "Mach 2.04", label: "Design Cruise" },
]

export default function ConcordeIntakePage() {
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
          04 — Intake Engineering
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Shock-Compression<br />Intake System
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          Variable hydraulic ramps stand a controlled shock cascade across each intake, taking Mach 2 air down
          to subsonic before the engine ever sees it — and producing more thrust than the engine itself.
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
            AVIA · Concorde · Intake System
          </p>
        </div>
      </footer>

    </div>
  )
}
