"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Visibility Problem",
    title: "Why a Delta Wing Cannot See the Runway",
    body: "Concorde's ogival delta generates lift through high attack angles at low speeds — 10–17° at approach, where a conventional wing would have stalled. At those angles the long, fine-pointed nose sits well above the eye-line of the flight deck, blanking the runway from view. There is no aerodynamic fix: the same angle that produces vortex lift at approach is what raises the nose above the pilots' sight line. The mechanical solution was to articulate the entire forward fuselage downward, so that on approach the nose pitches below the flight deck axis and restores a direct view of the runway centreline.",
    stats: [{ value: "10–17°", label: "Approach AoA" }, { value: "12.5°", label: "Max Droop" }],
  },
  {
    label: "Mechanism",
    title: "Hydraulic Articulation of the Forward Fuselage",
    body: "The droop nose is a hinged section forward of the flight deck driven by twin hydraulic actuators tied to the green and yellow hydraulic systems for redundancy. Two intermediate positions are commanded by the captain: 5° down for taxi and takeoff (visibility and bird-strike clearance) and 12.5° down for landing. The full extension takes 8.5 seconds. Visor and nose together weigh approximately 1,800 kg and are aerodynamically faired into the fuselage when raised. Each actuator is sized for full extension against the air load at the maximum permitted operating speed for nose movement, with margin against single-system hydraulic loss.",
    stats: [{ value: "1,800 kg", label: "Nose + Visor Mass" }, { value: "8.5 s", label: "Full Travel Time" }],
  },
  {
    label: "Visor",
    title: "A Metal Shield for the Cockpit Glazing",
    body: "Above Mach 1.7, polycarbonate windshields cannot survive sustained kinetic heating to 130–180°C without softening. Concorde flies behind a retractable metal visor that slides forward over the cockpit glazing during cruise — pilots see through a small heat-resistant inner window. The visor also restores the ogival profile of the nose at supersonic speeds, eliminating the drag of the lowered articulation. On descent through Mach 1, the visor retracts, exposing the conventional glazing for subsonic flight where the temperature load is no longer prohibitive. The visor is mechanically interlocked with the nose actuator: the nose cannot droop until the visor is fully retracted.",
    stats: [{ value: "180°C", label: "Cruise Glazing Limit" }, { value: "Interlocked", label: "Visor / Nose Logic" }],
  },
  {
    label: "Operational Sequence",
    title: "From Pushback to Touchdown",
    body: "On the ground, the nose sits at 5° down so that ground crew and the flight deck share an eye-line and bird-strike protection is maintained during taxi. Just before takeoff roll, the nose remains at 5°. After liftoff and visor retraction in the climb, the nose raises fully into the streamlined position for cruise. On descent, before passing 250 knots, the visor lowers and the nose returns to 5° for the approach pattern, then to 12.5° at the final approach configuration. Touchdown happens with the nose fully drooped. The same actuator motion has been performed on every Concorde flight, in every operational cycle, since first commercial service in January 1976.",
    stats: [{ value: "5°", label: "Taxi / Takeoff" }, { value: "12.5°", label: "Final Approach" }],
  },
]

const SPECS = [
  { value: "12.5°", label: "Max Droop" },
  { value: "1,800 kg", label: "Mechanism Mass" },
  { value: "8.5 s", label: "Travel Time" },
  { value: "180°C", label: "Visor Heat Limit" },
]

export default function ConcordeNosePage() {
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
          07 — Pilot Visibility
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Variable-Droop<br />Nose Mechanism
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          A hinged forward fuselage that bows the nose downward for landing visibility and a sliding metal visor
          that shields the cockpit at Mach 2 — the most distinctive moving part of any commercial aircraft.
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
            AVIA · Concorde · Droop Nose
          </p>
        </div>
      </footer>

    </div>
  )
}
