"use client"
import Link from "next/link"

const ACCENT = "#3b82f6"

const SECTIONS = [
  {
    label: "Aerodynamic Centre",
    title: "Why a Supersonic Wing Wants Its CG Behind It",
    body: "On every wing, the aerodynamic centre — the chordwise point about which lift acts independent of attack angle — sits near the quarter-chord at subsonic speeds and shifts back toward half-chord supersonically. For Concorde this displacement is roughly 6–8% of mean aerodynamic chord, equivalent to about 1.8 metres at the airframe scale. To keep the aircraft trimmed in cruise without continuous elevon deflection, the centre of gravity must move with the aerodynamic centre. Concorde achieves this not with control-surface offset but by physically transferring fuel along the airframe, leaving the elevons close to neutral and eliminating the drag a deflected elevon would cause.",
    stats: [{ value: "6–8%", label: "Chord AC Shift" }, { value: "≈ 1.8 m", label: "CG Travel" }],
  },
  {
    label: "Trim Tank 11",
    title: "11,500 Litres of Aft Ballast",
    body: "Concorde carries thirteen fuel tanks, of which Tank 11 is the dedicated trim tank in the rear of the fuselage just ahead of the empennage. It holds approximately 11,500 litres — roughly 9.2 tonnes of Jet A-1. Two electric pumps move fuel into Tank 11 during transonic acceleration and out of it during supersonic deceleration. Tanks 9 and 10 in the forward fuselage receive the returning fuel during deceleration. The transfer is continuous, takes around 30 minutes per direction, and is monitored throughout by the flight engineer's panel — one of the few aspects of Concorde operations that genuinely required a third crew member at the time of certification.",
    stats: [{ value: "11,500 L", label: "Tank 11 Capacity" }, { value: "≈ 30 min", label: "Transfer Duration" }],
  },
  {
    label: "CG Monitoring",
    title: "Live Tracking Against an Aerodynamic Reference",
    body: "A dedicated CG indicator shows current centre-of-gravity position alongside the limit envelope as a function of Mach number. The forward limit shifts aft as the aircraft accelerates; the aft limit shifts aft in step. Pilots and flight engineer keep CG inside this moving corridor by commanding fuel transfer as required. A CG that drifts forward at supersonic cruise costs trim drag and fuel; a CG that drifts aft risks pitch instability. The indicator is one of the few cockpit displays whose reading depends on the speed regime — the limits are not constants — and managing it correctly is what enables the elevons to sit near zero deflection at Mach 2.",
    stats: [{ value: "Live", label: "Mach-Indexed" }, { value: "Continuous", label: "Crew Monitoring" }],
  },
  {
    label: "Fuel Burn Savings",
    title: "1–2% of Total Trip Fuel — Recovered",
    body: "Trim drag from a deflected elevator at Mach 2 cruise would consume an estimated 1–2% of total trip fuel — significant on the route-limited North Atlantic mission, where every kilogram of unnecessary burn comes off the payload. By transferring fuel to match the aerodynamic centre, Concorde recovers that fraction without adding any high-speed control surface deflection drag. The integration between the fuel system and the flight control system is unique: most aircraft treat fuel transfer as a centre-of-gravity housekeeping task; Concorde uses it as an active trim-drag elimination loop coupled directly to the flight regime.",
    stats: [{ value: "1–2%", label: "Trip Fuel Saved" }, { value: "≈ 0°", label: "Cruise Elevon" }],
  },
]

const SPECS = [
  { value: "11,500 L", label: "Trim Tank 11" },
  { value: "6–8%", label: "AC Shift" },
  { value: "9.2 t", label: "Aft Ballast Mass" },
  { value: "1–2%", label: "Fuel Saving" },
]

export default function ConcordeFuelTrimPage() {
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
          08 — Stability
        </p>
        <h1 className="mb-6 text-[clamp(2.5rem,6vw,5rem)] font-bold leading-none tracking-tight">
          Fuel Transfer<br />for Supersonic Trim
        </h1>
        <p className="max-w-2xl text-sm leading-[1.85] text-[#94a3b8]">
          Pump 9 tonnes of fuel rearward as the aerodynamic centre shifts aft through Mach 1, eliminate
          trim drag at cruise, recover 1–2% of total trip fuel — without ever deflecting an elevon.
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
            AVIA · Concorde · Fuel Trim
          </p>
        </div>
      </footer>

    </div>
  )
}
