"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Geometry",
    title: "The Ogee Planform",
    body: "The term 'ogival delta' describes an S-curved leading edge whose sweep angle varies continuously from 55° at the root to 84° at the apex. In planform the shape is an ogive — the same curve used in Gothic arches — hence the name. The geometry was arrived at through thousands of wind tunnel runs at BAC and Aérospatiale during 1958–1963. No purely analytical solution existed; the ogee profile was the one that resolved four conflicting demands: maximum lift at low speed, minimum drag at supersonic cruise, acceptable pitch stability across the transonic transition, and adequate runway visibility for the crew.",
    stats: [{ value: "55°", label: "Root Sweep" }, { value: "84°", label: "Apex Sweep" }],
  },
  {
    label: "Vortex Lift",
    title: "Conical Vortex at Low Speed",
    body: "Below Mach 0.5, Concorde flies at attack angles of 10–17° — far beyond the stall angle of any conventional wing. What prevents separation is a strong conical vortex that forms above the leading edge and rolls inward over the upper surface, maintaining attached flow and generating suction that contributes up to 40% of total lift at approach speeds. The mechanism is sensitive: the vortex becomes unstable above roughly 35° angle of attack, setting the upper limit of usable lift. Concorde's approach regime, with the droop nose fully lowered, sits precisely within the stable vortex zone.",
    stats: [{ value: "10–17°", label: "Approach Angle of Attack" }, { value: "40%", label: "Vortex Lift Contribution" }],
  },
  {
    label: "Supersonic Cruise",
    title: "Shock Wave Organisation",
    body: "Above Mach 1.3, the leading-edge vortex reorganises into an attached conical shock system. The oblique shock from the apex impinges on the lower surface, raising local pressure and generating wave lift. The cambered leading edge ensures this shock remains attached, preventing the separated shock drag that dominates on blunt-nosed designs. At Mach 2.04, the lift-to-drag ratio is approximately 7.5 — lower than a subsonic airliner, but sufficient for the North Atlantic mission because the cruise speed reduces block time from 7 hours to 3.5.",
    stats: [{ value: "7.5 : 1", label: "L/D at Mach 2 Cruise" }, { value: "Mach 1.3+", label: "Shock Attachment Onset" }],
  },
  {
    label: "No Tailplane",
    title: "Integrated Pitch Stability",
    body: "A conventional aircraft separates the lifting function (main wing) from the pitch stability function (horizontal tail). Concorde integrates both. At subsonic speeds the aerodynamic centre sits near 45% chord; at supersonic cruise it shifts aft to 53% chord. Rather than using a tail to resist this shift, Concorde pumps fuel rearward into trim tank 11 to move the CG aft in step with the aerodynamic centre. The wing carries no trim download penalty — every square metre generates net lift at all times. This is why Concorde is aerodynamically efficient despite a modest L/D: there is no tail drag.",
    stats: [{ value: "45%", label: "Aero Centre at Subsonic" }, { value: "53%", label: "Aero Centre at Mach 2" }],
  },
]

const SPECS = [
  { value: "167.2 m²", label: "Wing Area" },
  { value: "25.6 m", label: "Wing Span" },
  { value: "84°", label: "Apex Sweep" },
  { value: "7.5 : 1", label: "L/D at Cruise" },
]

export default function ConcordeWingPage() {
  return (
    <div className="min-h-screen bg-[#04060a] text-white">

      {/* Back */}
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

      {/* Hero */}
      <section className="px-10 py-20 md:px-16">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: ACCENT + "b3" }}>
          01 — Aerodynamics
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Ogival Delta Wing
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          An S-curved leading edge that generates lift in two fundamentally different ways depending on speed —
          vortex suction below Mach 0.5, organised shock compression above Mach 1.3 — with no horizontal tail
          and no conventional flaps.
        </p>
      </section>

      {/* Specs strip */}
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

      {/* Deep-dive sections */}
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

      {/* Footer */}
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
            AVIA · Concorde · Ogival Delta Wing
          </p>
        </div>
      </footer>

    </div>
  )
}
