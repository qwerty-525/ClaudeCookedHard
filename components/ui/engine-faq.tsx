"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FaqItem {
  id: string
  question: string
  answer: React.ReactNode
}

const faqItems: FaqItem[] = [
  {
    id: "brayton-cycle",
    question: "What is the Brayton thermodynamic cycle — and why does every jet engine run on it?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Every gas turbine — commercial turbofan, military afterburner, helicopter turboshaft — operates on the Brayton cycle: <span className="text-white font-medium">intake → isentropic compression → constant-pressure combustion → isentropic expansion → exhaust</span>. Unlike a piston engine's Otto cycle, combustion happens continuously at constant pressure rather than intermittently at constant volume, allowing far higher mass flow rates and power densities.
        </p>
        <p>
          Thermodynamic efficiency is governed by the overall pressure ratio (OPR). The GE9X's OPR of 60:1 means air leaving the compressor is 60 times denser than ambient — so it burns at far higher temperatures, extracting more work per kilogram of fuel. Every 100°C increase in turbine entry temperature (TET) adds roughly 3% efficiency, which is why engine manufacturers spend billions developing turbine blades that survive temperatures exceeding the melting point of the nickel alloys they're made from.
        </p>
      </div>
    ),
  },
  {
    id: "afterburner",
    question: "How does an afterburner work, and why does it consume so much fuel?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          By the time exhaust leaves a turbine, it still contains roughly 25% unburned oxygen — the turbine can only extract so much energy before temperatures drop too low for further combustion. An afterburner (or "reheat" in British usage) exploits this: fuel injectors spray additional fuel into the hot exhaust stream downstream of the last turbine stage, reigniting combustion in a large flame-holder duct.
        </p>
        <p>
          The result is a dramatic jump in exhaust velocity and hence thrust — typically a 50–70% increase. But at enormous fuel cost: specific fuel consumption (SFC) roughly doubles or triples. The F-35's F135 burns approximately <span className="text-white font-medium">64,000 lb/hr of fuel at full afterburner</span> — nearly its own maximum takeoff weight in fuel every hour. This is why afterburner is reserved for takeoff, combat manoeuvring, and supersonic dash, never sustained cruise.
        </p>
        <div className="font-mono text-[11px] rounded-lg bg-white/[0.04] border border-white/[0.07] px-4 py-3 mt-2 text-[#94a3b8]">
          <span className="text-amber-400">Dry thrust:</span> turbine exit → nozzle only
          <br />
          <span className="text-amber-400">Wet thrust:</span> turbine exit → afterburner combustion → larger nozzle
        </div>
      </div>
    ),
  },
  {
    id: "combustion-stages",
    question: "What are the stages of combustion inside a jet engine?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          The combustor has three aerodynamic zones, all critical to preventing hot streaks, quench, or blowout:
        </p>
        <div className="space-y-2">
          {[
            { zone: "Primary zone", color: "#ef4444", desc: "~20% of airflow enters through swirler vanes and dome jets. Fuel-rich recirculation creates a stable pilot flame at equivalence ratio ~1.0. Temperatures reach 2,000–2,500°C — hot enough to melt the liner without cooling." },
            { zone: "Secondary zone", color: "#f59e0b", desc: "Additional air dilutes the rich primary mixture to near-stoichiometric. Secondary air jets complete combustion and ensure all carbon is oxidised. Temperature peaks here — this is what determines turbine entry temperature." },
            { zone: "Dilution zone", color: "#3b82f6", desc: "Large volumes of cool compressor air (~40% of total flow) mix with combustion products, reducing bulk temperature from ~2,000°C to the ~1,700°C the turbine blades can survive (even with cooling)." },
          ].map((z) => (
            <div key={z.zone} className="flex gap-3 rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
              <span className="mt-[3px] w-2 h-2 rounded-full flex-shrink-0" style={{ background: z.color }} />
              <div>
                <span className="text-white font-medium text-[12px]">{z.zone}:</span>
                <span className="text-[#94a3b8] text-[12px] ml-1.5">{z.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p>
          Modern lean-burn combustors (as used in the LEAP and Trent XWB) mix fuel and air before ignition to burn cooler and more uniformly — cutting NOₓ emissions by over 50% compared to rich-burn designs.
        </p>
      </div>
    ),
  },
  {
    id: "turbine-blades",
    question: "How do turbine blades survive temperatures above their own melting point?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          First-stage high-pressure turbine blades operate in gas at ~1,700°C — yet the nickel superalloys they're made of melt at ~1,300°C. They survive through three simultaneous technologies working in concert:
        </p>
        <div className="space-y-2">
          {[
            { label: "Film cooling", desc: "Hundreds of tiny holes laser-drilled through the blade surface inject cool compressor bleed air, creating a thin insulating film between the blade and the hot gas. The blade surface temperature stays ~300°C below the gas temperature." },
            { label: "Internal convective cooling", desc: "Serpentine internal channels carry cooling air through the blade interior before exiting through the tip and trailing edge. High-performance blades may have over 200 individual cooling holes." },
            { label: "Thermal barrier coating (TBC)", desc: "A 100–300 μm ceramic coating of yttria-stabilised zirconia (YSZ) is plasma-sprayed onto the blade surface. YSZ's thermal conductivity is 40× lower than the underlying metal, providing an additional 100–150°C temperature drop." },
            { label: "Single-crystal casting", desc: "Turbine blades are cast as single metal crystals with no grain boundaries — the weak points where creep and fracture begin under combined thermal and centrifugal stress at 40,000+ RPM." },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
              <p className="text-amber-400 font-mono text-[11px] uppercase tracking-wider mb-0.5">{item.label}</p>
              <p className="text-[#94a3b8] text-[12px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "bypass-ratio",
    question: "What is bypass ratio, and why does it determine whether an engine is commercial or military?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Bypass ratio (BPR) is the ratio of air that flows around the engine core to air that flows through it. A BPR of 12:1 means 12 kg of air bypasses the combustor for every 1 kg that burns. This matters because thrust equals mass flow × velocity change — and <span className="text-white font-medium">it is far more efficient to accelerate a large mass of air slowly than a small mass quickly</span> (Newton's third law, applied to propulsive efficiency).
        </p>
        <div className="font-mono text-[11px] rounded-lg bg-white/[0.04] border border-white/[0.07] px-4 py-3 space-y-1 text-[#94a3b8]">
          <div><span className="text-amber-400">BPR 0 (turbojet):</span> All thrust from hot jet — fast, loud, inefficient at subsonic</div>
          <div><span className="text-amber-400">BPR 0.3–1.0 (military turbofan):</span> Modest bypass — supersonic capable, fuel-efficient enough for combat</div>
          <div><span className="text-amber-400">BPR 5–7 (1990s widebody):</span> CF6, PW4000, Trent 800 — workhorse of long-haul</div>
          <div><span className="text-amber-400">BPR 9–12 (modern):</span> GE9X, Trent XWB, LEAP, GTF — quiet, efficient, huge fan</div>
        </div>
        <p>
          High BPR also explains why modern commercial engines are so much quieter: the cold bypass stream surrounds and shields the hot exhaust jet, dramatically reducing the shear-layer turbulence that generates jet noise.
        </p>
      </div>
    ),
  },
  {
    id: "compressor-surge",
    question: "What is compressor surge, and why can it destroy an engine in milliseconds?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Each compressor stage is a precisely matched pair: a rotating disc of blades (rotor) that accelerates air, followed by a stationary row (stator) that decelerates it and converts velocity to pressure. Every stage operates within a narrow band of incidence angle. If the angle of attack on a blade exceeds its stall angle — due to throttle transients, turbulence ingestion, or a bird strike — the airfoil stalls and flow separates.
        </p>
        <p>
          If enough stages stall simultaneously, the compressed air ahead of the stall cannot push forward against the accumulating back-pressure. The entire compressor flow <span className="text-white font-medium">reverses instantaneously</span> — blowing high-pressure combustion gases back out the engine inlet. This is a surge. A single surge is typically recoverable with reduced throttle. Repetitive surging can shatter blades, suck debris back through the inlet, or cause a compressor case rupture.
        </p>
        <p>
          Modern engines use Variable Stator Vanes (VSVs) — the stator angles are continuously adjusted by FADEC as throttle changes — and bleed valves that dump mid-compressor air overboard during acceleration transients, preventing the stall conditions from developing.
        </p>
      </div>
    ),
  },
  {
    id: "fadec",
    question: "What is FADEC and what does it actually control?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Full Authority Digital Engine Control (FADEC) is the computer that manages every controllable parameter of a modern jet engine. The pilot (or autopilot) sets a thrust demand; FADEC figures out how to achieve it safely and efficiently by controlling simultaneously:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {[
            "Fuel flow rate",
            "Variable stator vane angles",
            "Compressor bleed valves",
            "Turbine clearance control (tip gap)",
            "Afterburner fuel flow + ignition",
            "Variable exhaust nozzle area",
            "Engine anti-ice systems",
            "Starting sequence valves",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[12px]">
              <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-2">
          FADEC executes control loops at ~70 Hz and responds to over 100 sensor inputs — EGT, N1/N2 spool speeds, fuel pressure, oil temperature, vibration sensors on every bearing. It also runs continuous self-diagnostics and can detect a developing bearing failure before any cockpit warning light triggers.
        </p>
      </div>
    ),
  },
  {
    id: "shock-diamonds",
    question: "What causes the repeating diamond pattern in afterburner exhaust?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Shock diamonds (also called Mach diamonds or cell structures) form when the exhaust jet exits the nozzle at a pressure different from ambient atmospheric pressure. When the jet is <span className="text-white font-medium">underexpanded</span> (exit pressure above ambient — typical with afterburner), the gas expands outward in a fan of oblique expansion waves. Those expansion waves reflect off the jet boundary as compression shocks, causing the gas to converge back toward the centreline and raise pressure again.
        </p>
        <p>
          Each convergence raises local temperature and density above the surrounding exhaust flow, producing a luminous region visible to the eye. The spacing between diamonds is determined by the exit Mach number and nozzle geometry. The pattern repeats until viscosity and turbulent mixing dissipate the pressure oscillations — typically 5–10 cells in a high-performance military afterburner.
        </p>
        <p>
          At higher throttle settings, variable nozzles on fighters open to better match exit pressure to ambient, reducing the number of visible diamonds — this is why maximum afterburner often shows a longer, smoother plume than intermediate afterburner settings.
        </p>
      </div>
    ),
  },
  {
    id: "supercruise",
    question: "What makes supercruise technically different from simply going supersonic with afterburner?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          Supercruise is defined as <span className="text-white font-medium">sustained supersonic flight at military (dry) power — no afterburner</span>. The F-22 supercruises at Mach 1.5–1.8; the Eurofighter at Mach 1.1–1.2. Any aircraft with enough thrust can go supersonic momentarily with afterburner; only aircraft with an exceptional balance of low drag and high dry thrust can sustain it.
        </p>
        <p>
          The challenge is wave drag. At Mach 1+, a shockwave attaches to every leading edge, producing drag proportional to the square of the pressure differential across the shock. This wave drag increases steeply between Mach 0.9 and 1.3 — the transonic regime — then plateaus at fully supersonic speeds. An aircraft must have sufficient dry thrust to overcome both this wave drag plateau and the additional induced and pressure drag at its supersonic lift coefficient.
        </p>
        <p>
          The tactical advantage is range and endurance: an F-22 supercruising at Mach 1.5 can intercept a target three times faster than an aircraft going the same speed on afterburner — but with a fraction of the fuel burn, arriving with full combat fuel reserves.
        </p>
      </div>
    ),
  },
  {
    id: "tsfc",
    question: "What is thrust-specific fuel consumption (TSFC) and how do you compare engines with it?",
    answer: (
      <div className="space-y-3 text-[#94a3b8] leading-relaxed text-sm">
        <p>
          TSFC measures how many pounds of fuel are burned per hour to produce one pound of thrust — lower is better. It is the single most important measure of engine efficiency for mission planning and economics.
        </p>
        <div className="font-mono text-[11px] rounded-lg bg-white/[0.04] border border-white/[0.07] px-4 py-3 space-y-1.5 text-[#94a3b8]">
          <div className="text-amber-400 text-[10px] uppercase tracking-widest mb-2">Typical cruise TSFC values</div>
          <div><span className="text-white">Turbojet (Olympus 593):</span> ~1.19 lb/lbf·hr — very high, typical of all-jet cycle</div>
          <div><span className="text-white">1990s high-bypass (CF6-80):</span> ~0.58 lb/lbf·hr</div>
          <div><span className="text-white">Modern turbofan (Trent XWB):</span> ~0.48 lb/lbf·hr</div>
          <div><span className="text-white">GTF (PW1100G):</span> ~0.44 lb/lbf·hr — current state of art</div>
          <div><span className="text-white">Military (F100, dry):</span> ~0.73 lb/lbf·hr</div>
          <div><span className="text-white">Military (F100, afterburner):</span> ~1.94 lb/lbf·hr — ~4× the commercial rate</div>
        </div>
        <p>
          For an airline, a 0.01 improvement in cruise TSFC across a 777 fleet of 50 aircraft flying 10 hours/day translates to roughly $5 million in annual fuel savings — which is why engine manufacturers compete aggressively on tenths of a percent.
        </p>
      </div>
    ),
  },
]

export function EngineFaq() {
  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.4em] text-amber-400 uppercase mb-3 font-medium">
          Engineering Deep Dive
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
          The Physics of Propulsion.
        </h2>
        <p className="text-[#94a3b8] max-w-xl leading-relaxed text-sm">
          From the Brayton cycle to shock diamonds — the thermodynamics, aerodynamics, and
          materials science that make jet engines work.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-white text-base text-left font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
