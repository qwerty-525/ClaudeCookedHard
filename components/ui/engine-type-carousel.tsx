"use client"
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type EngineCategory = "Commercial" | "Military" | "Hypersonic" | "Rotary" | "Heritage"

interface EngineType {
  id: string
  name: string
  category: EngineCategory
  tagline: string
  description: string
  applications: { name: string; role: string }[]
  stats: { label: string; value: string }[]
  workingPrinciple: string
}

const CATEGORY_COLOR: Record<EngineCategory, string> = {
  Commercial: "#f59e0b",
  Military:   "#ef4444",
  Hypersonic: "#8b5cf6",
  Rotary:     "#3b82f6",
  Heritage:   "#6b7280",
}

const engineTypes: EngineType[] = [
  {
    id: "high-bypass-turbofan",
    name: "High-Bypass Turbofan",
    category: "Commercial",
    tagline: "The engine that made mass air travel possible.",
    description:
      "A large fan at the front moves far more air around the core than through it — a bypass ratio of 9–12:1 on modern engines. Most thrust comes from the slow, cold bypass stream rather than the hot jet, making these engines quiet, efficient, and ideal for subsonic cruise.",
    workingPrinciple: "Fan → Bypass duct (90 % thrust) + Core compressor → Combustor → Turbine",
    applications: [
      { name: "Boeing 777 / 747 / 787", role: "Long-haul widebody" },
      { name: "Airbus A380 / A350 / A330", role: "Long-haul widebody" },
      { name: "Airbus A320neo / Boeing 737 MAX", role: "Short-haul narrowbody" },
      { name: "Airbus A220 / Embraer E2", role: "Regional jet" },
    ],
    stats: [
      { label: "Bypass ratio", value: "5 : 1 – 12 : 1" },
      { label: "Thrust range", value: "22,000 – 115,000 lbf" },
      { label: "Cruise efficiency (TSFC)", value: "0.50 – 0.55 lb/lbf·hr" },
      { label: "Fan diameter (large)", value: "Up to 134 in (3.4 m)" },
    ],
  },
  {
    id: "low-bypass-turbofan",
    name: "Low-Bypass Turbofan",
    category: "Military",
    tagline: "Speed and power over economy.",
    description:
      "A smaller fan with a bypass ratio of 0.3–1.0:1 gives military fighters their combination of supersonic performance and reasonable fuel efficiency. Afterburner stages inject raw fuel into the exhaust stream, doubling thrust for short bursts at the cost of catastrophic fuel burn.",
    workingPrinciple: "Fan → Small bypass duct + Core → Afterburner → Variable-area nozzle",
    applications: [
      { name: "F-22 Raptor", role: "Air superiority (F119)" },
      { name: "F-35 Lightning II", role: "Multirole stealth (F135)" },
      { name: "F-15 / F-16", role: "Air superiority / multirole (F100 / F110)" },
      { name: "Eurofighter Typhoon", role: "Air superiority (EJ200)" },
      { name: "Dassault Rafale", role: "Omnirole (M88)" },
      { name: "Su-57 / Su-35", role: "Russian 5th / 4.5th gen (AL-41)" },
    ],
    stats: [
      { label: "Bypass ratio", value: "0.3 : 1 – 1.0 : 1" },
      { label: "Thrust (afterburner)", value: "17,000 – 43,000 lbf" },
      { label: "Thrust increase w/ AB", value: "~50 – 70 %" },
      { label: "Thrust-to-weight ratio", value: "Up to 9 : 1 (engine alone)" },
    ],
  },
  {
    id: "turbojet",
    name: "Turbojet",
    category: "Heritage",
    tagline: "The original jet engine — simple, brutal, fast.",
    description:
      "All intake air passes through the core: compressor, combustor, turbine. The entire exhaust jet generates thrust. Highly efficient at supersonic speeds where a wide fan would cause too much drag, but wasteful at subsonic cruise — the reason turbofans replaced turbojets on all modern airliners.",
    workingPrinciple: "Intake → Compressor → Combustor → Turbine → Exhaust nozzle",
    applications: [
      { name: "Concorde (Olympus 593)", role: "Mach 2 supersonic airliner" },
      { name: "Boeing 707 early variants (JT3C)", role: "First-generation jetliner" },
      { name: "MiG-15 / F-86 Sabre (J47)", role: "Korean War fighters" },
      { name: "de Havilland Comet (Ghost)", role: "World's first jet airliner" },
    ],
    stats: [
      { label: "Bypass ratio", value: "0 : 1 (pure jet)" },
      { label: "Thrust range", value: "5,000 – 38,000 lbf" },
      { label: "Optimal speed", value: "Mach 2.0+" },
      { label: "Fuel efficiency", value: "Poor at subsonic — best above Mach 1.5" },
    ],
  },
  {
    id: "turboramjet",
    name: "Turboramjet",
    category: "Military",
    tagline: "The hybrid that conquered Mach 3.",
    description:
      "At low speeds it operates as a conventional turbojet. Above Mach 2.2, intake ram pressure rises so high that fuel is directly injected into the bypass duct, converting the engine into a ramjet — bypassing the turbomachinery entirely. The result is an engine that produces useful thrust from takeoff to Mach 3.3.",
    workingPrinciple: "Turbojet mode (Mach < 2.2) → Bypass valves open → Ramjet mode (Mach > 2.2)",
    applications: [
      { name: "SR-71 Blackbird (P&W J58)", role: "Mach 3.3 strategic reconnaissance" },
      { name: "A-12 Oxcart (J58)", role: "CIA reconnaissance predecessor to SR-71" },
      { name: "YF-12 interceptor (J58)", role: "Experimental interceptor prototype" },
    ],
    stats: [
      { label: "Max speed", value: "Mach 3.3 (SR-71)" },
      { label: "Thrust at Mach 3+", value: "32,500 lbf per engine" },
      { label: "Engine share of thrust at Mach 3", value: "Only 17.6 % — inlet contributes 54 %" },
      { label: "Bypass ratio (ramjet mode)", value: "Variable — up to 0.87 effective" },
    ],
  },
  {
    id: "ramjet",
    name: "Ramjet",
    category: "Military",
    tagline: "No moving parts. Pure ram pressure.",
    description:
      "A ramjet has zero rotating components. The forward speed of the vehicle compresses incoming air — no mechanical compressor required. Fuel ignites in the supersonic airstream and the exhaust generates thrust. Useless below Mach 0.5 (requires a booster to reach operational speed), but extremely simple and light above Mach 2.",
    workingPrinciple: "Forward speed → Intake shock compression → Combustion → Supersonic exhaust",
    applications: [
      { name: "MBDA Meteor (BVR missile)", role: "Air-to-air beyond-visual-range missile (F-35, Typhoon, Gripen)" },
      { name: "BrahMos cruise missile", role: "Mach 2.8 anti-ship / land attack (India/Russia)" },
      { name: "SA-6 Gainful SAM", role: "Soviet surface-to-air missile system" },
      { name: "Talos naval missile", role: "Early US Navy long-range SAM" },
    ],
    stats: [
      { label: "Moving parts", value: "None" },
      { label: "Optimal speed range", value: "Mach 2 – 5" },
      { label: "Min. operational speed", value: "~Mach 0.5 (needs booster)" },
      { label: "Fuel type", value: "Kerosene, JP-10, solid fuel variants" },
    ],
  },
  {
    id: "scramjet",
    name: "Scramjet",
    category: "Hypersonic",
    tagline: "Combustion at supersonic speed — hypersonics' holy grail.",
    description:
      "A Supersonic Combustion Ramjet maintains supersonic airflow through the entire engine — including the combustion chamber. This removes the need to decelerate the airflow to subsonic before burning fuel, enabling operation above Mach 5 where a conventional ramjet would produce no thrust. Fuel must ignite and burn completely in milliseconds.",
    workingPrinciple: "Supersonic intake → Supersonic combustion (< 1 ms burn time) → Nozzle expansion",
    applications: [
      { name: "NASA X-43A (Hyper-X)", role: "Mach 9.6 unmanned research vehicle — world speed record" },
      { name: "Boeing X-51 Waverider", role: "Mach 5.1 hypersonic cruise demonstrator" },
      { name: "HTV-3X (Blackswift, cancelled)", role: "DARPA Mach 6 reusable strike vehicle concept" },
      { name: "TBCC concepts (AFRL)", role: "Future combined-cycle turbine-to-scramjet fighters" },
    ],
    stats: [
      { label: "Operational speed", value: "Mach 5+" },
      { label: "Record speed (X-43A)", value: "Mach 9.6 (~11,200 km/h)" },
      { label: "Combustion dwell time", value: "< 1 millisecond" },
      { label: "Status", value: "Research / experimental — not yet operational" },
    ],
  },
  {
    id: "turboprop",
    name: "Turboprop",
    category: "Commercial",
    tagline: "Jet efficiency. Propeller economy.",
    description:
      "A gas turbine drives a propeller through a reduction gearbox rather than generating thrust directly from its exhaust. The propeller moves a large volume of air at low velocity — far more efficient than a jet nozzle at speeds below 450 mph. Turboprops dominate short regional routes and rugged military transports where fuel efficiency and short-field performance matter more than speed.",
    workingPrinciple: "Turbine power → Reduction gearbox → Propeller (80–90 % thrust) + small exhaust jet",
    applications: [
      { name: "ATR 72 / Dash 8 Q400", role: "Regional airliner (50–90 seats)" },
      { name: "Lockheed C-130 Hercules (T56)", role: "Military tactical transport" },
      { name: "P-3 Orion / P-8 predecessor", role: "Maritime patrol aircraft" },
      { name: "Beechcraft King Air", role: "Business / utility twin turboprop" },
    ],
    stats: [
      { label: "Power range", value: "500 – 6,000 shp" },
      { label: "Optimal cruise speed", value: "250 – 450 mph (400 – 720 km/h)" },
      { label: "Propulsive efficiency", value: "~80 % (vs ~65 % for turbofan at same speed)" },
      { label: "Reduction ratio (typical)", value: "10 : 1 – 15 : 1 gearbox" },
    ],
  },
  {
    id: "turboshaft",
    name: "Turboshaft",
    category: "Rotary",
    tagline: "All power to the shaft. None wasted in thrust.",
    description:
      "Unlike a turboprop, a turboshaft is designed to produce zero residual jet thrust — all energy is extracted by the turbine stages and delivered as shaft power. The rotor shaft drives a helicopter main rotor, ship propulsion system, or power generator. The free-power turbine stage is mechanically decoupled from the gas generator, allowing the rotor to maintain constant RPM regardless of power demand.",
    workingPrinciple: "Gas generator (compressor + combustor + HP turbine) → Free-power turbine → Output shaft",
    applications: [
      { name: "Sikorsky UH-60 Black Hawk (T700)", role: "US Army utility helicopter" },
      { name: "Boeing AH-64 Apache (T700)", role: "Attack helicopter" },
      { name: "CH-47 Chinook (T55)", role: "Heavy-lift tandem-rotor helicopter" },
      { name: "Bell 412 / Augusta AW139", role: "Civil utility / offshore helicopter" },
    ],
    stats: [
      { label: "Power range", value: "250 – 5,000+ shp" },
      { label: "Residual jet thrust", value: "Near zero (all energy extracted)" },
      { label: "Free-power turbine", value: "Mechanically decoupled from gas generator" },
      { label: "Applications", value: "Helicopters, ships, tanks, power generation" },
    ],
  },
  {
    id: "geared-turbofan",
    name: "Geared Turbofan",
    category: "Commercial",
    tagline: "Every stage turning at its ideal speed.",
    description:
      "A planetary reduction gearbox sits between the fan and the low-pressure turbine shaft. This allows the fan to rotate at its aerodynamically optimal speed (slower) while the LP turbine spins at its mechanically optimal speed (faster) — two constraints that previously forced a compromise on every engine. The result is an ultra-high bypass ratio of 12:1, a 20% fuel saving, and a 75% reduction in noise footprint.",
    workingPrinciple: "LP turbine (fast) → Reduction gearbox → Fan (slow) + LP compressor (medium)",
    applications: [
      { name: "Airbus A220 (PW1500G)", role: "100–150 seat narrowbody" },
      { name: "Airbus A320neo (PW1100G)", role: "150–190 seat narrowbody" },
      { name: "Embraer E-Jet E2 (PW1700G / PW1900G)", role: "Regional 70–130 seat jet" },
      { name: "Mitsubishi SpaceJet (PW1200G)", role: "Regional 76-seat jet" },
    ],
    stats: [
      { label: "Bypass ratio", value: "12 : 1 (PW1100G)" },
      { label: "Gearbox reduction ratio", value: "~3 : 1" },
      { label: "Fuel saving vs prev. gen", value: "16 – 20 %" },
      { label: "Noise footprint reduction", value: "75 % smaller" },
    ],
  },
  {
    id: "pulse-jet",
    name: "Pulse Jet",
    category: "Heritage",
    tagline: "The crudest jet engine ever deployed in combat.",
    description:
      "A pulse jet has no turbine, no compressor, and no rotating parts — just a resonant tube with reed valves at the inlet. Air enters, fuel ignites, the valves slam shut, the explosion propels gas rearward, and the pressure drop re-opens the valves. The cycle repeats 50–100 times per second, producing that distinctive buzzing drone. Mechanically simple and cheap to manufacture, but thermally inefficient and extremely loud.",
    workingPrinciple: "Reed valves open → Air + fuel enter → Valves slam shut → Deflagration → Exhaust → Repeat",
    applications: [
      { name: "Fieseler Fi 103 / V-1 flying bomb (Argus 014)", role: "WWII cruise missile — 10,000+ launched at England" },
      { name: "Dynajet / Dyna-Jet model aircraft engines", role: "Radio-controlled model aircraft" },
      { name: "Experimental UAV concepts", role: "Low-cost disposable drone propulsion" },
    ],
    stats: [
      { label: "Cycle frequency", value: "50 – 100 Hz" },
      { label: "Moving parts", value: "Reed valves only" },
      { label: "Thrust (V-1 Argus)", value: "~570 lbf (2.5 kN)" },
      { label: "Efficiency", value: "Very low — suitable only for single-use or model use" },
    ],
  },
]

function EngineTypeCard({ engine }: { engine: EngineType }) {
  const accent = CATEGORY_COLOR[engine.category]

  return (
    <div className="flex-shrink-0 w-[340px] snap-start">
      <div className="rounded-2xl border border-white/[0.06] bg-[#0d0d14] overflow-hidden">
        {/* Accent bar */}
        <div className="h-[3px] w-full" style={{ background: accent }} />

        {/* Header */}
        <div className="px-6 pt-5 pb-4">
          <span
            className="inline-block text-[10px] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 rounded-full mb-3"
            style={{ color: accent, background: accent + "18" }}
          >
            {engine.category}
          </span>
          <h3 className="text-xl font-bold text-white leading-tight mb-1">{engine.name}</h3>
          <p className="text-[11px] text-[#94a3b8] font-mono tracking-wide">{engine.tagline}</p>
        </div>

        {/* Working principle strip */}
        <div className="mx-6 mb-4 rounded-lg px-3 py-2 font-mono text-[10px] text-[#94a3b8] leading-relaxed"
          style={{ background: accent + "0e", borderLeft: `2px solid ${accent}` }}>
          <span className="text-[9px] uppercase tracking-widest block mb-1" style={{ color: accent }}>
            Working Principle
          </span>
          {engine.workingPrinciple}
        </div>

        {/* Description */}
        <p className="px-6 text-[13px] text-[#94a3b8] leading-relaxed mb-5">
          {engine.description}
        </p>

        {/* Stats grid */}
        <div className="mx-6 mb-5 grid grid-cols-2 gap-2">
          {engine.stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
              <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] mb-0.5">{s.label}</p>
              <p className="text-[12px] font-mono font-semibold text-white leading-snug">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Applications */}
        <div className="px-6 pb-6">
          <p className="text-[9px] uppercase tracking-widest text-[#94a3b8] mb-2">Aircraft / Applications</p>
          <div className="space-y-1.5">
            {engine.applications.map((app) => (
              <div key={app.name} className="flex items-start gap-2">
                <span className="mt-[5px] w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent }} />
                <div>
                  <span className="text-[12px] text-white font-medium">{app.name}</span>
                  <span className="text-[11px] text-[#94a3b8] ml-1.5">— {app.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EngineTypeCarousel({ className }: { className?: string }) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = React.useState(false)
  const [canRight, setCanRight] = React.useState(true)

  const checkScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 0)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    el.addEventListener("scroll", checkScroll, { passive: true })
    return () => el.removeEventListener("scroll", checkScroll)
  }, [checkScroll])

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === "left" ? -(el.clientWidth * 0.75) : el.clientWidth * 0.75, behavior: "smooth" })
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-amber-400 uppercase mb-3 font-medium">
            Engine Architecture
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ten Types of Jet Engine.
          </h2>
          <p className="text-[#94a3b8] mt-2 max-w-lg leading-relaxed text-sm">
            From the pulse jet's 50-Hz reed valves to the scramjet's millisecond combustion window —
            every propulsion cycle ever used in flight.
          </p>
        </div>

        {/* Nav arrows */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-8">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            aria-label="Scroll left"
            className={cn(
              "p-2 rounded-full border transition-all duration-200",
              "border-white/10 bg-white/[0.03] text-white hover:bg-white/10",
              "disabled:opacity-25 disabled:cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            aria-label="Scroll right"
            className={cn(
              "p-2 rounded-full border transition-all duration-200",
              "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20",
              "disabled:opacity-25 disabled:cursor-not-allowed"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {engineTypes.map((engine) => (
          <EngineTypeCard key={engine.id} engine={engine} />
        ))}
      </div>

      {/* Mobile scroll hint */}
      <p className="mt-3 text-center text-[10px] tracking-widest uppercase text-[#94a3b8]/50 md:hidden">
        Swipe to explore
      </p>
    </div>
  )
}
