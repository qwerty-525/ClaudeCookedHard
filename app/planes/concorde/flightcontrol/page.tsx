"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Control Philosophy",
    title: "Elevons — One Surface, Two Axes",
    body: "A conventional aircraft uses separate surfaces for pitch (elevator on the horizontal tail) and roll (ailerons on the wing). Concorde has no horizontal tail. Its six elevon panels, spanning the full trailing edge of the delta, do both jobs: deflect together symmetrically to pitch; deflect differentially — one side up, the other down — to roll. The surface is always generating lift, never simply creating drag as a dedicated trim surface would. This integration reduces weight, failure modes, and induced drag in a single design decision.",
    stats: [{ value: "6", label: "Elevon Panels" }, { value: "2", label: "Control Axes per Surface" }],
  },
  {
    label: "Fly-by-Wire",
    title: "Electrical Signalling with Analogue Backup",
    body: "Concorde was among the first civil aircraft to use fly-by-wire signalling, introduced because aerodynamic hinge moments at Mach 2 exceed what a pilot can overcome through direct mechanical linkage. Pilot inputs are converted to electrical signals that drive hydraulic actuators at each surface. Three independent hydraulic systems — Blue, Green, and Yellow — can each drive any surface individually; any single system can keep the aircraft controllable. Reversion to manual analogue backup is available if all electrical paths fail. The system was certified to the same failure-rate standards as conventional mechanical controls.",
    stats: [{ value: "3", label: "Independent Hydraulic Systems" }, { value: "Mach 2", label: "Design Dynamic Pressure" }],
  },
  {
    label: "Yaw Control",
    title: "Two-Segment Rudder",
    body: "Concorde carries one vertical fin with a two-segment rudder for yaw. At subsonic speeds the rudder provides conventional directional authority. At supersonic cruise, differential thrust becomes the primary yaw control — rudder effectiveness diminishes at high Mach and low angle of attack. The engine installation is designed for significant asymmetric thrust without exceeding the combined rudder-plus-differential-thrust authority limit. Engine-out certification at Mach 2 requires the yawing moment to remain within controllable bounds across all failure sequences.",
    stats: [{ value: "1", label: "Vertical Fin" }, { value: "2", label: "Rudder Segments" }],
  },
  {
    label: "Trim Integration",
    title: "Fuel Transfer Replaces Trim Deflection",
    body: "As Concorde accelerates through Mach 1, the aerodynamic centre moves aft by 6–8% chord — a fundamental property of supersonic wings. A conventional aircraft would deflect its elevator to counter the resulting nose-down pitch. Concorde instead pumps fuel to trim tank 11 at the rear, shifting the CG aft to match the new aerodynamic centre. The elevons remain close to neutral. This integration between the fuel management system and the flight control system is unique to Concorde and saves approximately 1–2% total fuel burn on the North Atlantic route by eliminating trim drag entirely.",
    stats: [{ value: "≈ 0°", label: "Elevon Deflection at Cruise" }, { value: "11,500 L", label: "Trim Tank 11 Capacity" }],
  },
]

const SPECS = [
  { value: "6", label: "Elevon Panels" },
  { value: "3", label: "Hydraulic Systems" },
  { value: "Mach 0→2.04", label: "Control Authority" },
  { value: "6–8%", label: "AC Shift at Mach 1" },
]

export default function ConcordeFlightControlPage() {
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
          02 — Flight Control
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Elevon-Delta<br />Flight Controls
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          Six trailing-edge elevons replace both elevator and aileron, a fly-by-wire system manages control
          at Mach 2, and a fuel transfer system eliminates trim drag — all on an aircraft with no
          horizontal tail.
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
            AVIA · Concorde · Flight Controls
          </p>
        </div>
      </footer>

    </div>
  )
}
