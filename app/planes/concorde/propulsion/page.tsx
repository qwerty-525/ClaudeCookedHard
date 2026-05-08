"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Heritage",
    title: "From the TSR-2 to the North Atlantic",
    body: "The Olympus 593 is a development of the Bristol Olympus engine first run in 1950 and originally selected for the cancelled BAC TSR-2 strike bomber. When TSR-2 was scrapped in 1965, Bristol Siddeley (later Rolls-Royce) and SNECMA reworked the existing Olympus 320 core into a civil-certified powerplant for Concorde. The engine retained the original two-spool axial layout — seven low-pressure and seven high-pressure compressor stages — but added a variable convergent-divergent nozzle, an afterburner sized for both takeoff and transonic acceleration, and an air-bleed system tied directly to the variable-geometry intake ramps. Few civil engines have inherited this much military DNA.",
    stats: [{ value: "1950", label: "Olympus First Run" }, { value: "7 + 7", label: "LP / HP Stages" }],
  },
  {
    label: "Reheat",
    title: "Afterburner for Takeoff and the Transonic Push",
    body: "Reheat — afterburner — fires only during takeoff and across the transonic regime from roughly Mach 0.95 to Mach 1.7. In this band the aircraft sits inside its own drag rise, where each percentage of thrust shortcut comes at high specific fuel consumption. Reheat adds 20% extra thrust by injecting and igniting fuel in the jet pipe downstream of the turbine, raising effective exhaust temperature without exceeding turbine metal limits. Once stable supersonic flow is established above Mach 1.7, reheat is cut and the engine accelerates the aircraft to Mach 2.04 on dry power alone — the only commercial powerplant ever certified to do so.",
    stats: [{ value: "+20%", label: "Reheat Thrust Boost" }, { value: "Mach 0.95 → 1.7", label: "Reheat Envelope" }],
  },
  {
    label: "Dry Cruise",
    title: "Mach 2.04 Without Afterburner",
    body: "At Mach 2 cruise the intake ram-compresses incoming air to roughly 2.5× ambient pressure and pre-heats it to 127°C before it ever reaches the compressor face. The compressor inlet sees conditions a sea-level engine would only generate halfway through its own cycle, so the engine produces sustained dry thrust at a fuel burn closer to subsonic cruise than to military supersonic flight. Specific fuel consumption at cruise is approximately 1.19 lb/lbf/hr — high by modern turbofan standards, but achieved at twice the speed of any commercial alternative.",
    stats: [{ value: "127°C", label: "Compressor Inlet Temp" }, { value: "31,000 lbf", label: "Dry Thrust at Sea Level" }],
  },
  {
    label: "Hot Section",
    title: "Turbine Materials at the Edge of the Envelope",
    body: "Concorde's turbine inlet temperature in cruise sits around 1,150°C — sustained, not transient. The first-stage HP turbine blades are nickel-based superalloy castings cooled by compressor bleed air ducted through internal passages and ejected through trailing-edge slots and tip holes. The film of cool air formed against the blade surface allows the metal itself to operate well below the local gas temperature. The Olympus 593 was the first civil engine certified to operate continuously above 1,100°C TIT and remains an uncommon achievement for a turbojet without a bypass duct to absorb thermal load.",
    stats: [{ value: "1,150°C", label: "Cruise TIT" }, { value: "Nickel Superalloy", label: "Blade Material" }],
  },
]

const SPECS = [
  { value: "38,050 lbf", label: "Reheat Thrust" },
  { value: "31,000 lbf", label: "Dry Thrust" },
  { value: "15.5 : 1", label: "Pressure Ratio" },
  { value: "1.19", label: "SFC at Cruise" },
]

export default function ConcordePropulsionPage() {
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
          03 — Propulsion
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Olympus 593<br />Dry Supersonic Cruise
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          A military bomber engine reworked for civil flight, paired with a variable intake that does most
          of the compression work at Mach 2 — letting Concorde sustain supersonic cruise without afterburner.
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
            AVIA · Concorde · Olympus 593
          </p>
        </div>
      </footer>

    </div>
  )
}
