"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import PlaneCard from "@/components/PlaneCard"
import { Typewriter } from "@/components/ui/typewriter"
import { EngineTypeCarousel } from "@/components/ui/engine-type-carousel"
import { EngineFaq } from "@/components/ui/engine-faq"
import SpecTable from "@/components/SpecTable"
import ChipLinks from "@/components/ChipLinks"
import { engines } from "@/lib/data"

const EngineTeardown3D = dynamic(() => import("@/components/EngineTeardown3D"), { ssr: false })

// Three tiers of exhaust streaks — white-hot core, orange mid, red outer
const coreStreaks = Array.from({ length: 10 }, (_, i) => ({
  top: 44 + ((i * 17 + 3) % 12),   // clustered around vertical centre
  width: ((i * 23 + 15) % 20) + 12,
  opacity: ((i * 11 + 7) % 8) / 100 + 0.18,
  delay: ((i * 5 + 1) % 20) / 10,
  duration: ((i * 7 + 8) % 8) / 10 + 0.6,  // fast
}))
const midStreaks = Array.from({ length: 14 }, (_, i) => ({
  top: 30 + ((i * 31 + 7) % 40),
  width: ((i * 19 + 10) % 25) + 8,
  opacity: ((i * 13 + 5) % 10) / 100 + 0.09,
  delay: ((i * 7 + 3) % 28) / 10,
  duration: ((i * 11 + 12) % 12) / 10 + 1.1,
}))
const outerStreaks = Array.from({ length: 16 }, (_, i) => ({
  top: ((i * 41 + 9) % 100),
  width: ((i * 13 + 8) % 18) + 5,
  opacity: ((i * 7 + 3) % 8) / 100 + 0.04,
  delay: ((i * 9 + 5) % 35) / 10,
  duration: ((i * 17 + 18) % 16) / 10 + 1.8,
}))
// Shock diamonds — bright dots along the exhaust centreline
const diamonds = Array.from({ length: 6 }, (_, i) => ({
  left: 55 + i * 7,
  size: Math.max(2, 5 - i),
  opacity: 0.6 - i * 0.08,
}))

export default function EnginesPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const titleY = useTransform(heroProgress, [0, 1], [0, -100])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])
  const featuredEngines = engines.slice(0, 3)

  return (
    <main className="bg-[#04060a]">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* ── Fire background ───────────────────────────────────────────── */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, #1a0800 0%, #04060a 70%)" }}>

          {/* Outer red streaks — cooling exhaust */}
          {outerStreaks.map((s, i) => (
            <div key={`o${i}`} className="absolute h-px animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #dc2626, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}

          {/* Mid orange streaks */}
          {midStreaks.map((s, i) => (
            <div key={`m${i}`} className="absolute h-px animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #ea580c, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}

          {/* Core white-hot streaks */}
          {coreStreaks.map((s, i) => (
            <div key={`c${i}`} className="absolute animate-streak"
              style={{ top: s.top + "%", width: s.width + "%", height: "2px", opacity: s.opacity,
                background: "linear-gradient(to right, transparent, #fef9c3, #ffffff, #fef9c3, transparent)",
                animationDuration: s.duration + "s", animationDelay: s.delay + "s" }} />
          ))}
        </div>

        {/* ── Afterburner core glow ─────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Far red bloom */}
          <div className="absolute w-[700px] h-[340px] rounded-full bg-red-700/20 blur-3xl" />
          {/* Orange plume */}
          <div className="absolute w-[440px] h-[180px] rounded-full bg-orange-500/25 blur-2xl" />
          {/* Amber mid */}
          <div className="absolute w-[240px] h-[90px] rounded-full bg-amber-400/35 blur-xl" />
          {/* Yellow-white hot zone */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-[80px] h-[28px] rounded-full bg-yellow-100/70 blur-md"
          />
          {/* Blinding nozzle point */}
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-3 h-3 rounded-full bg-white blur-[2px]"
          />
        </div>

        {/* ── Shock diamonds ────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          {diamonds.map((d, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [d.opacity * 0.6, d.opacity, d.opacity * 0.6] }}
              transition={{ duration: 0.7 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
              className="absolute rounded-full bg-white"
              style={{ left: d.left + "%", width: d.size + "px", height: d.size + "px",
                boxShadow: `0 0 ${d.size * 3}px ${d.size}px rgba(254,240,138,0.6)` }}
            />
          ))}
        </div>

        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 text-center px-8 max-w-4xl"
        >
          <p className="text-xs tracking-[0.45em] text-amber-400 uppercase mb-6 font-medium">
            Aviation Encyclopedia
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none">
            Jet
            <br />
            <span className="text-[#94a3b8]">Engines</span>
          </h1>
          <p className="text-[#94a3b8] text-lg max-w-md mx-auto leading-relaxed font-mono">
            <Typewriter
              words={[
                "Where combustion meets precision.",
                "Thrust measured in jumbo jets.",
                "115,000 lbf. On a single spool.",
                "The heart of every flight.",
                "Engineering at 1,600°C.",
              ]}
              speed={55}
              delayBetweenWords={2200}
              cursorChar="_"
            />
          </p>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-16 flex flex-col items-center gap-2 text-[#94a3b8]"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
              <path
                d="M7 0v16M1 11l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative border-y border-white/[0.06] bg-[#120d07]">
        <div className="avia-grid absolute inset-0 opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.35fr_0.85fr] md:px-12 lg:px-24">
          <div className="avia-panel rounded-[28px] p-7 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#fbbf24]">
              Core Thesis
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              The engine page should feel hotter, denser, and more mechanical than the airframe pages.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
              Less romance, more pressure ratios. The goal here is to make the technical detail feel heavy and expensive.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#engines"
                className="avia-pill-button inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-amber-400/45 hover:bg-amber-400/16"
              >
                Browse Engines
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="avia-panel rounded-[28px] p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#fb923c]">
              Power Band
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {featuredEngines.map((engine) => (
                <div key={engine.slug} className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#fdba74]">{engine.year}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{engine.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro block */}
      <section className="relative bg-gradient-to-b from-[#04060a] via-[#080601] to-[#0b0b10] px-6 py-24 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.4em] text-amber-400/70 uppercase mb-4">The Power Behind Flight</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            From 1,000 lbf to 115,000 lbf.
          </h2>
          <p className="text-[#94a3b8] leading-relaxed text-lg">
            A jet engine compresses air to 40× atmospheric pressure, ignites it at 1,600°C, and expels it faster than
            the speed of sound — all while spinning at 15,000 RPM. These are the engines that made it possible.
          </p>
        </div>
      </section>

      {/* 3D turbofan teardown */}
      <EngineTeardown3D />

      {/* Jet engine history timeline */}
      <section className="relative bg-[#08060a] px-6 py-24 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(245,158,11,0.06),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] text-amber-400/70 uppercase mb-4">A Century of Development</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">The History of the Jet Engine.</h2>
          <p className="text-[#94a3b8] text-lg leading-relaxed mb-20 max-w-2xl">
            From Frank Whittle&apos;s patent in 1930 to a 134-inch fan spinning at 2,200 RPM — ninety years of compressing, igniting, and exhausting the impossible.
          </p>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical spine */}
            <div className="absolute left-[7px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/20 to-transparent" />

            {[
              {
                year: "1930",
                era: "The Patent",
                heading: "Whittle Files the First Jet Engine Patent",
                body: "On January 16, 1930, Frank Whittle — a 22-year-old RAF cadet — filed British Patent 347,206 for a turbine-based aircraft engine. The Air Ministry declined to fund development, calling the concept impractical. Whittle formed his own company, Power Jets Ltd, on private financing, and ran his first successful bench test in April 1937. The principle was elegant and brutal: compress incoming air, add fuel, ignite the mixture, and direct the expanding exhaust to turn a turbine that drives the compressor. Everything since has been a refinement of that cycle.",
              },
              {
                year: "1939",
                era: "First Flight",
                heading: "He 178 — The First Jet Aircraft Takes Off",
                body: "On August 27, 1939, the Heinkel He 178 made the world's first flight under turbojet power, powered by Hans von Ohain's HeS 3 engine producing 992 lbf of thrust. Von Ohain had been working independently of Whittle in Germany, arriving at the same thermodynamic conclusions through different engineering routes. The He 178's flight lasted only minutes, but it ended the piston-engine monopoly on powered flight. Simultaneously, in Britain, Whittle's W.1 engine was nearing readiness for the Gloster E.28/39, which flew in May 1941.",
              },
              {
                year: "1944",
                era: "Operational Combat",
                heading: "The Messerschmitt Me 262 Enters Service",
                body: "The Me 262 Schwalbe became the first jet aircraft to see operational combat, powered by two Junkers Jumo 004B axial-flow turbojets producing 1,980 lbf each. It was 100 mph faster than any piston fighter it encountered. The Jumo 004 introduced the axial-flow compressor — stages of rotating and stationary blades that compress air more efficiently than the centrifugal compressors in Whittle's design — establishing the architecture that every high-performance jet engine has followed since. Some 1,400 were produced before the war ended. Allied aeronautical engineers captured examples for dissection, and the knowledge accelerated every post-war jet programme.",
              },
              {
                year: "1952",
                era: "Jet Age Begins",
                heading: "The De Havilland Comet Opens Commercial Jet Travel",
                body: "On May 2, 1952, BOAC operated the world's first commercial jet service, London to Johannesburg, aboard the De Havilland Comet. Its four de Havilland Ghost centrifugal turbojets, buried in the wing roots, produced 5,000 lbf each and cut London–New York time from fourteen hours to under eight. The Comet's fatigue failures in 1954 — caused by stress concentrations at the square window corners — grounded the fleet and allowed Boeing time to develop the 707. The engineering lessons of those failures are why every pressurised airliner since has elliptical windows.",
              },
              {
                year: "1958",
                era: "Transatlantic Jet Era",
                heading: "The Boeing 707 and the JT3D Turbofan",
                body: "Pan American launched transatlantic jet service with the 707 on October 4, 1958. The aircraft's early JT3C turbojets gave way to the Pratt & Whitney JT3D turbofan in 1960 — a conversion that added a large-diameter fan ahead of the compressor to accelerate a secondary bypass airstream around the core. Turbofans move more air more slowly, generating the same thrust more efficiently than turbojets. The JT3D established the high-bypass principle as the definitive architecture for subsonic commercial transport. Every airliner since has used a turbofan. The turbojet era lasted exactly eleven years.",
              },
              {
                year: "1969",
                era: "Wide-Body Revolution",
                heading: "The Pratt & Whitney JT9D and the Boeing 747",
                body: "The Boeing 747 required an engine that did not exist. Pratt & Whitney's JT9D, producing 45,000 lbf from a 93-inch fan, was the first high-bypass turbofan scaled to widebody requirements — a bypass ratio nearly three times that of contemporary military engines. Early JT9Ds had reliability problems that caused Pan Am to keep 747s grounded when replacement engines couldn't be sourced; Boeing reportedly parked aircraft nose-to-tail down the Everett runway awaiting serviceable powerplants. Within three years, the problems were resolved, and the JT9D established the template that GE's CF6 and Rolls-Royce's RB211 competed against for the next four decades.",
              },
              {
                year: "1976",
                era: "Supersonic Commercial",
                heading: "Concorde and the Olympus 593",
                body: "On January 21, 1976, British Airways and Air France simultaneously inaugurated Concorde commercial service. The Olympus 593 turbojet — developed jointly by Rolls-Royce and Snecma from a Bristol Siddeley military engine — cruised at Mach 2.04 using variable-geometry intakes to manage the supersonic shockwave. At cruise, the intake alone recovered more thrust energy from ram compression than the combustor added — the engine had become a heat exchanger. The 593 used afterburner only for takeoff and transonic acceleration; above Mach 1.7, dry power sustained the cruise. It remains the only commercial engine to achieve sustained supersonic cruise without afterburner.",
              },
              {
                year: "1972",
                era: "Fighter Turbofan",
                heading: "The F100 — Pratt & Whitney Reinvents the Fighter Engine",
                body: "The Pratt & Whitney F100 was designed for the F-15 Eagle from a blank sheet, producing 23,770 lbf with afterburner from a bypass ratio of 0.63:1 — threading the needle between the high bypass of commercial engines and the near-zero bypass of earlier military turbojets. The result was a thrust-to-weight ratio above 7.8:1, enabling the F-15 to accelerate vertically from a standing start. It later powered the F-16 as well, until the Air Force deliberately introduced GE's F110 as a second-source competitor in 1984 to break Pratt & Whitney's monopoly and drive down cost. The ensuing 'engine wars' — contested procurement rounds where the USAF split orders between the F100 and F110 based on price and performance bids — produced a decade of improvements that neither manufacturer would have achieved alone. The F100's core architecture directly seeded the F119 that came after it.",
              },
              {
                year: "1984",
                era: "Narrowbody Efficiency War",
                heading: "The CFM56 and the Single-Aisle Standard",
                body: "The CFM56 — a joint venture between GE Aviation and Snecma — entered service on the Boeing 737 Classic in 1984, eventually powering the 737NG, Airbus A320, and KC-135 tanker fleet. With over 30,000 engines delivered across its variants, it became the best-selling jet engine in history. Its 5.9:1 bypass ratio was double that of the JT8D it replaced. The CFM56's commercial success funded the research that produced its successor, the LEAP — and demonstrated that an engine joint venture between American and French manufacturers could sustain technical leadership for four consecutive decades.",
              },
              {
                year: "1995",
                era: "Power Record",
                heading: "The GE90-115B — 115,000 lbf on a Single Spool",
                body: "The GE90 was designed clean-sheet for the Boeing 777. Its -115B variant, certified in 2003, produced 115,000 lbf of rated thrust — and 127,900 lbf during a certification ground test, setting a record that stood until 2017. The engine's 22 carbon-fibre composite fan blades, each over four feet long, were curved like an eagle's wing and fabricated from materials originally developed for aerospace structural applications rather than rotating machinery. The composite fan case — a single hoop rather than a segmented metal assembly — was certified to contain a blade release event without structural penetration. At 128 inches, the fan was wider than a 737 fuselage.",
              },
              {
                year: "1997",
                era: "Supercruise",
                heading: "The F119 — Thrust Vectoring and Flight Without Afterburner",
                body: "The Pratt & Whitney F119, developed for the F-22 Raptor under the Advanced Tactical Fighter programme, represented the first clean-sheet military turbofan since the F100 twenty-five years earlier. Its two-dimensional thrust-vectoring nozzle pitches ±20° in the vertical plane, giving the F-22 nose-pointing authority that aerodynamic surfaces alone cannot provide at high angles of attack. The engine's defining achievement is supercruise: the F119 sustains Mach 1.5 on dry power, without afterburner, making the F-22 the first production fighter to cruise supersonically without the fuel penalty of reheat. Afterburner pushes thrust to 35,000 lbf but is needed only for burst performance. The F119's core was then scaled, modified, and mated to a Rolls-Royce lift fan to become the F135 — the engine in every F-35 variant — making it the common ancestor of the most widely produced fifth-generation fighter powerplant in history.",
              },
              {
                year: "2010",
                era: "The Geared Turbofan",
                heading: "Pratt & Whitney's PW1000G Separates Fan from Turbine",
                body: "The Pratt & Whitney PW1000G (Geared Turbofan) solved a fundamental tension in turbofan design: the fan wants to spin slowly for efficiency, the low-pressure turbine wants to spin fast to extract energy. Previous engines compromised both. The GTF inserts a planetary reduction gearbox between them, allowing each to rotate at its optimal speed. The result: 12:1 bypass ratio on the A320neo variant, 16% better fuel burn than the V2500 it replaced, and a noise footprint reduced by 75% in area. Certification took seventeen years of development. The gearbox itself operates at 24,000 HP and must be replaced — intact — at scheduled maintenance intervals without disturbing either the fan or turbine modules.",
              },
              {
                year: "2016",
                era: "Volume at Scale",
                heading: "The CFM LEAP Accumulates 20,000+ Orders",
                body: "The LEAP (Leading Edge Aviation Propulsion) succeeded the CFM56 with three-dimensional woven carbon-fibre fan blades and a ceramic matrix composite combustor liner — the first commercial hot-section use of CMC, capable of sustaining temperatures 500°F beyond what nickel superalloys tolerate. Three variants serve the A320neo, 737 MAX, and COMAC C919. Combined with the GTF on the A320neo, the two engines represent the largest re-engine campaign in commercial aviation history. The LEAP achieved over 20,000 orders before the first aircraft entered service — a milestone driven by fuel economics that no airline could ignore.",
              },
              {
                year: "2022 →",
                era: "Next Frontier",
                heading: "134-Inch Fans, Open Rotors, and Hybrid-Electric Futures",
                body: "The GE9X, at 134 inches in diameter the largest commercial engine fan ever certified, powers the Boeing 777X with a full ceramic matrix composite hot section and 60:1 core pressure ratio. Beyond it: Rolls-Royce's UltraFan, targeting 25% better fuel burn than the Trent 700 through a geared architecture and advanced composite fan at 140 inches; CFM's RISE (Revolutionary Innovation for Sustainable Engines) open-rotor concept, which removes the nacelle entirely and runs contra-rotating unducted fans at bypass ratios above 70:1; and a generation of hybrid-electric regional concepts that use turbogenerators to supply power to distributed electric fans. The thermodynamic ceiling of the Brayton cycle — the core principle Whittle patented in 1930 — is approaching. What comes after it is genuinely open.",
              },
            ].map((item, i) => (
              <div key={item.year} className="relative flex gap-8 pb-16 last:pb-0">
                {/* Dot */}
                <div className="relative flex-none mt-1">
                  <div className="w-[15px] h-[15px] rounded-full border border-amber-400/50 bg-[#08060a] flex items-center justify-center">
                    <div className="w-[5px] h-[5px] rounded-full bg-amber-400/80" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-3">
                    <span className="text-amber-400 font-mono text-sm font-semibold tracking-widest">{item.year}</span>
                    <span className="text-[10px] uppercase tracking-[0.32em] text-[#94a3b8]/60">{item.era}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">{item.heading}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engine type carousel */}
      <section className="relative bg-[#0b0b10] px-6 py-24 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <EngineTypeCarousel />
        </div>
      </section>

      {/* Powerplant comparison table */}
      <section className="relative border-t border-white/[0.04] bg-[#0d0903] px-6 py-24 md:px-12 lg:px-24">
        <SpecTable
          kicker="Cycle Parameters"
          title="Every Engine Is a Point on the Same Map."
          description="Bypass ratio (BPR) trades specific thrust for propulsive efficiency; overall pressure ratio (OPR) buys thermal efficiency at the cost of compressor stages and temperature. Airliners live top-right (high BPR, high OPR); fighters live bottom-left, where a compact, high-specific-thrust core fits in a fuselage and survives afterburning. The turbojet Olympus sits alone — zero bypass, all jet."
          accent="#fbbf24"
          columns={["Engine", "Thrust (lbf)", "BPR", "OPR", "Fan Ø (in)", "TSFC Regime†", "Application"]}
          rows={[
            ["GE9X", "105,000", "10:1", "60:1", "134", "cruise ~0.49", "777X"],
            ["GE90-115B", "115,000", "9:1", "42:1", "128", "cruise ~0.52", "777-300ER"],
            ["Trent XWB-97", "97,000", "9.3:1", "61:1*", "118", "cruise ~0.48", "A350-1000"],
            ["Trent 900", "84,000", "~8.5:1", "39:1", "116", "cruise ~0.56", "A380"],
            ["GEnx-1B", "75,000", "9:1", "58:1", "111", "cruise ~0.53", "787 / 747-8"],
            ["PW1100G GTF", "33,110", "12.5:1", "~50:1", "81", "cruise ~0.51", "A320neo"],
            ["CFM LEAP-1A", "32,900", "11:1", "40:1", "78", "cruise ~0.51", "A320neo / MAX / C919"],
            ["CFM56-5B", "33,000", "5.9:1", "32.6:1", "68", "cruise ~0.60", "A320ceo / 737NG"],
            ["Olympus 593", "38,050 (reheat)", "0 (turbojet)", "15.5:1", "—", "M2 cruise ~1.19", "Concorde"],
            ["P&W J58", "32,500 (AB)", "0 (turbojet)", "8.8:1", "—", "M3.2 cruise ~1.9", "SR-71"],
            ["P&W F135", "43,000 (AB)", "0.57:1", "28:1", "46", "dry ~0.89", "F-35"],
            ["P&W F119", "35,000 (AB)", "0.30:1", "26:1", "—", "supercruise", "F-22"],
            ["GE F414", "22,000 (AB)", "0.25:1", "30:1", "—", "dry ~0.72 / AB ~1.85", "F/A-18E/F"],
            ["GE F110-129", "29,500 (AB)", "0.87:1", "30.7:1", "46.5", "dry ~0.65 / AB ~2.0", "F-16 / F-15"],
          ]}
          footnote="†TSFC = thrust specific fuel consumption in lb of fuel per lbf of thrust per hour — lower is better; afterburning roughly doubles it. *Trent XWB achieves its OPR across three spools. BPR = bypass ratio, OPR = overall pressure ratio at top of climb. Representative published values."
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <ChipLinks
            kicker="The Theory Behind the Columns"
            chips={[
              { href: "/thermodynamics#brayton", label: "Brayton Cycle", sub: "why OPR buys efficiency", accent: "#34d399" },
              { href: "/thermodynamics#propulsion", label: "Propulsion", sub: "BPR vs specific thrust", accent: "#34d399" },
              { href: "/gas-dynamics#nozzles", label: "Nozzle Flow", sub: "choking & thrust", accent: "#fb923c" },
              { href: "/heat-transfer#applications", label: "Turbine Cooling", sub: "surviving 1,900 K TET", accent: "#c084fc" },
            ]}
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="relative bg-[#04060a] px-6 py-24 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto">
          <EngineFaq />
        </div>
      </section>

      {/* Engine cards */}
      <section id="engines" className="relative bg-[#0b0b10] px-6 pb-36 md:px-12 lg:px-24 border-t border-white/[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.12),transparent_38%)]" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.4em] text-amber-400 uppercase mb-4 font-medium">
              The Powerplants
            </p>
            <h2 className="text-4xl font-bold">{engines.length} Engines.</h2>
            <p className="text-[#94a3b8] mt-3 max-w-md leading-relaxed">
              Commercial workhorses, supersonic relics, and afterburning monsters — the engines that define aviation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {engines.map((engine, i) => (
              <PlaneCard
                key={engine.name}
                href={`/engines/${engine.slug}`}
                name={engine.name}
                detail={engine.detail}
                fact={engine.fact}
                year={engine.year}
                index={i}
                accent="#f59e0b"
                image={engine.image}
                role={engine.role}
                roleColor={engine.roleColor}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
