"use client"
import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Typewriter } from "@/components/ui/typewriter"

function Fr({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center align-middle mx-[0.15em] text-[0.8em] leading-none">
      <span className="border-b border-current pb-[2px] px-[3px]">{n}</span>
      <span className="pt-[2px] px-[3px]">{d}</span>
    </span>
  )
}

function EqCard({ label, eq, note, wide }: { label: string; eq: ReactNode; note?: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${wide ? "md:col-span-2" : ""}`}>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-indigo-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SL({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-indigo-400/70">{children}</p>
}

function Milestone({ year, name, detail }: { year: string; name: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
      <p className="mb-1 font-mono text-2xl font-bold text-indigo-400">{year}</p>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/80">{name}</p>
      <p className="text-sm leading-relaxed text-[#94a3b8]">{detail}</p>
    </div>
  )
}

const STARS: [number, number, number][] = [
  [60,40,1.2],[140,90,0.8],[580,60,1.0],[650,120,0.8],[620,380,1.2],[80,350,0.8],
  [200,420,0.9],[550,400,0.8],[300,30,1.0],[430,50,0.8],[160,200,1.2],[620,240,0.8],
  [500,420,1.0],[80,160,0.8],[480,340,1.2],[260,380,0.8],[660,310,0.9],[110,290,0.8],
]

export default function SpacecraftPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef}
        className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, #080820 0%, #04060a 68%)" }} />

        {/* Orbital diagram */}
        <svg viewBox="0 0 700 480" preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-65" aria-hidden>
          <defs>
            <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.22"/>
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
            </radialGradient>
            <marker id="arrowOrb" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(129,140,248,0.65)"/>
            </marker>
          </defs>

          {/* Stars */}
          {STARS.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r}
              fill={`rgba(255,255,255,${0.15 + (i % 4) * 0.07})`}/>
          ))}

          {/* Equatorial reference line */}
          <line x1="30" y1="240" x2="670" y2="240"
            stroke="rgba(129,140,248,0.07)" strokeWidth="1" strokeDasharray="4 8"/>

          {/* GEO orbit */}
          <circle cx="350" cy="240" r="205" fill="none"
            stroke="rgba(129,140,248,0.18)" strokeWidth="1"
            strokeDasharray="8 6" className="animate-flow"
            style={{ animationDuration: "11s" }}/>

          {/* SSO / polar (inclined — shown as ellipse) */}
          <ellipse cx="350" cy="240" rx="135" ry="52" fill="none"
            stroke="rgba(129,140,248,0.28)" strokeWidth="1"
            strokeDasharray="8 6" className="animate-flow"
            style={{ animationDuration: "5.5s" }}/>

          {/* LEO orbit */}
          <circle cx="350" cy="240" r="80" fill="none"
            stroke="rgba(129,140,248,0.50)" strokeWidth="1"
            strokeDasharray="8 6" className="animate-flow"
            style={{ animationDuration: "3.5s" }}/>

          {/* Hohmann transfer arc (upper semi-ellipse) */}
          <path d="M 430,240 C 430,100 555,100 555,240" fill="none"
            stroke="rgba(129,140,248,0.60)" strokeWidth="1.5"
            strokeDasharray="10 5" className="animate-flow"
            style={{ animationDuration: "4s" }}/>

          {/* Earth glow */}
          <circle cx="350" cy="240" r="52" fill="url(#earthGlow)"/>
          {/* Earth body */}
          <circle cx="350" cy="240" r="36"
            fill="rgba(10,20,60,0.90)" stroke="rgba(129,140,248,0.50)" strokeWidth="1.5"/>
          {/* Atmosphere ring */}
          <circle cx="350" cy="240" r="41"
            fill="none" stroke="rgba(129,140,248,0.18)" strokeWidth="4"/>

          {/* Satellite on LEO periapsis */}
          <circle cx="430" cy="240" r="3.5" fill="rgba(129,140,248,0.95)"/>
          {/* Satellite at GEO apoapsis */}
          <circle cx="555" cy="240" r="4" fill="rgba(129,140,248,0.80)"/>
          {/* SSO satellite */}
          <circle cx="350" cy="188" r="3" fill="rgba(129,140,248,0.60)"/>

          {/* Δv arrows */}
          <line x1="430" y1="240" x2="430" y2="214"
            stroke="rgba(129,140,248,0.55)" strokeWidth="1.2" markerEnd="url(#arrowOrb)"/>
          <line x1="555" y1="240" x2="555" y2="214"
            stroke="rgba(129,140,248,0.45)" strokeWidth="1.2" markerEnd="url(#arrowOrb)"/>

          {/* Labels */}
          <text x="440" y="238" fill="rgba(129,140,248,0.80)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">LEO</text>
          <text x="350" y="177" textAnchor="middle" fill="rgba(129,140,248,0.55)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">SSO / POLAR</text>
          <text x="564" y="238" fill="rgba(129,140,248,0.55)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">GEO</text>
          <text x="493" y="128" textAnchor="middle" fill="rgba(129,140,248,0.40)"
            fontSize="8" fontFamily="monospace" letterSpacing="2">HOHMANN TRANSFER</text>
          <text x="437" y="207" fill="rgba(129,140,248,0.55)"
            fontSize="8" fontFamily="monospace">Δv₁</text>
          <text x="562" y="207" fill="rgba(129,140,248,0.55)"
            fontSize="8" fontFamily="monospace">Δv₂</text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48
          bg-gradient-to-t from-[#04060a] to-transparent" />

        <motion.div style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 px-8 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-indigo-400">
            Engineering Foundation
          </p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Space
            <br/><span className="text-[#94a3b8]">craft</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter words={[
              "From Sputnik to Starship.",
              "Δv is the currency of spaceflight.",
              "The rocket equation rules everything.",
              "Requirements to orbit — systems engineering.",
              "Every kilogram costs a thousand dollars.",
            ]} speed={52} delayBetweenWords={2400} cursorChar="_" />
          </p>
          <motion.div animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-16 flex flex-col items-center gap-2 text-[#94a3b8]">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
              <path d="M7 0v16M1 11l6 6 6-6" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 1 · Legacy ───────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>History &amp; Legacy</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Sixty Years to the Stars.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The trajectory from liquid-fuelled artillery rocket to reusable super-heavy launch vehicle
            took less than a human lifetime. Each milestone redefined what systems engineers believed
            was achievable on the next programme.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Milestone year="1942" name="V-2 — First Space-Capable Vehicle"
              detail="The A-4/V-2, designed by Wernher von Braun's team at Peenemünde, became the first human-built object to reach space on 3 October 1942. Its turbopump-fed LOX/ethanol engine producing 250 kN was the direct ancestor of every subsequent liquid-propellant rocket — and its systems engineering approach (requirements breakdown, subsystem testing, integration) became the template for all that followed." />
            <Milestone year="1957" name="Sputnik 1 — The Space Age Begins"
              detail="Launched on an R-7 ICBM on 4 October 1957, Sputnik 1 was a 58 cm aluminium sphere weighing 83.6 kg. Its entire mission was transmitting a 20/40 MHz radio beacon for 21 days. The engineering point: orbital insertion required 7.9 km/s velocity and a burn precision of ±1 m/s — more than enough to trigger NASA's founding and the DARPA Advanced Research Projects program in 1958." />
            <Milestone year="1961–69" name="Moon Race — Apollo Systems Engineering"
              detail="Gagarin's Vostok 1 (108 min, 12 April 1961) and Glenn's Friendship 7 (3 orbits, 20 February 1962) framed the competition NASA answered with Apollo. The Saturn V stands as the most powerful rocket ever flown: 13.2 MN at liftoff, 130 t to LEO. Apollo 11 carried 382 kg of Moon samples to Earth — a round trip of 768,000 km on a 3-day free-return trajectory planned by hand-computed conics." />
            <Milestone year="1981–2011" name="Space Shuttle — Partial Reusability"
              detail="STS-1 first flew Columbia on 12 April 1981. Over 135 missions the Shuttle demonstrated that SSME reuse, tile TPS, and SRB recovery were feasible — but sustained a cost of ~$1.5B per flight. The lesson systems engineers drew: partial reusability does not break the economics of launch. Full, rapid reusability is the only path to affordable access. That lesson shaped SpaceX's design philosophy from day one." />
            <Milestone year="1998–" name="ISS — Long-Duration Operations"
              detail="The International Space Station, assembled from 1998 to 2011, has hosted a continuous human presence since November 2000. At 420 km altitude it completes one orbit every 92 minutes, experiencing 16 thermal cycles per day. The structure endures cumulative fatigue from 175,000+ thermal cycles per year, ATV/Dragon docking loads, and EVA-induced vibration — a live test bed for every long-duration structure and life-support architecture." />
            <Milestone year="2015–" name="Commercial Era — Full Reusability"
              detail="SpaceX landed Falcon 9 booster B1019 on 21 December 2015 — the first orbital-class rocket to return to its launch site. By 2024, individual cores had flown 20+ times. Starship's Super Heavy/Ship architecture targets fully-reusable flights to LEO at under $100/kg — a three-order-of-magnitude reduction from Saturn V and the realisation of the cost target Korolev and von Braun both knew was necessary for civilisation-scale spaceflight." />
          </div>
        </div>
      </section>

      {/* ── 2 · Spacecraft Systems ───────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Spacecraft Systems</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Requirements, Budgets, and the Vee Model.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Spacecraft systems engineering translates mission objectives into verifiable hardware. Every
            number on orbit — power, mass, data rate, reliability — is traced back to a requirement and
            forward to a verification event. The Vee model makes that traceability explicit and prevents
            the most common failure mode in complex programmes: building hardware before requirements are stable.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="The Vee Model — Development Lifecycle"
              eq={<>Mission Req. → Architecture<br/>System Req. → System Design<br/>Subsys. Req. → Component<br/><br/>Build ↑ Integration ↑ V&amp;V</>}
              note="The Vee model (NASA NPR 7123.1, ECSS-E-ST-10) decomposes requirements left-to-right from mission to component, then integrates and verifies right-to-left. Each decomposition level has a paired verification event — unit test, subsystem test, system test, acceptance. The model's discipline is that no hardware is built before its requirements are baselined and its verification approach agreed." />
            <EqCard label="Mass Budget — CBE + Margin"
              eq={<>m<sub>total</sub> = m<sub>CBE</sub>·(1 + MGA)<br/><br/>MGA: 20% (Phase A/B)<br/>MGA: 10% (Phase C)<br/>MGA: 5% (post-CDR)</>}
              note="CBE (current best estimate) is the sum of all component masses. MGA (mass growth allowance) accounts for design maturation and supplier growth history. For a 500 kg satellite at Phase A, the launch vehicle must accommodate 600 kg. Propellant mass is tracked separately as a wet-mass adder. The allocation flows from the launch vehicle's payload to fairing adapter interface: exceed it and you re-launch." />
            <EqCard label="Power Budget — EOL with Eclipse"
              eq={<>P<sub>EOL</sub> = P<sub>BOL</sub>·(1−d)<sup>n</sup>·η<sub>hrn</sub><br/><br/>P<sub>ecl</sub> = <Fr n={<>P<sub>load</sub>·T<sub>e</sub></>} d={<>DOD·η<sub>bat</sub>·T<sub>d</sub></>}/></>}
              note="BOL solar array power degrades ~3%/year (d=0.03) at GEO due to radiation. Over a 15-year mission: (0.97)¹⁵ = 0.63 — the array must be oversized by 37% at BOL. Eclipse power comes from the battery; depth of discharge (DOD) is limited to 20–30% for Li-ion to preserve the 5,500+ cycle life a LEO mission requires. At GEO, eclipse fraction is ≤1.2%." />
            <EqCard label="Link Budget — Friis Transmission"
              eq={<>P<sub>r</sub> = P<sub>t</sub>·G<sub>t</sub>·G<sub>r</sub>·<span className="text-base">(</span><Fr n="λ" d="4πR"/><span className="text-base">)</span><sup>2</sup></>}
              note="(λ/4πR)² is the free-space path loss — the dominant term. At X-band (8 GHz, λ = 37.5 mm), R = 800 km (LEO), a 1 m ground dish (G_r ≈ 38 dBi), 10 W transmitter, 0 dBi omni antenna: received power ≈ −117 dBW. Adding margin for rain fade, pointing loss, and implementation loss gives the link's Eb/N₀ — which must exceed the modem's threshold for the chosen coding rate." />
            <EqCard label="System Reliability — Exponential Model"
              eq={<>R(t) = e<sup>−λt</sup><br/><br/>R<sub>series</sub> = ∏ R<sub>i</sub><br/>R<sub>parallel</sub> = 1 − ∏(1−R<sub>i</sub>)</>}
              note="λ is the component failure rate (failures/hr) from MIL-HDBK-217 or ECSS-Q-ST-30. For a 5-year GEO mission (43,800 hr) with R=0.85 threshold: λ ≤ 3.8×10⁻⁶/hr per string. Series strings degrade rapidly — five components at R=0.99 each give R_system=0.951. Parallel redundancy (cross-strapping) is the primary design tool: TWTAs, PCDUs, and reaction wheels are universally cross-strapped on GEO comsats." />
            <EqCard label="FMEA / Fault Tree — Risk Prioritisation"
              eq={<>RPN = S × O × D<br/><br/>FTA: P<sub>top</sub> = ∏ P<sub>basic</sub></>}
              note="FMEA assigns Risk Priority Numbers (Severity × Occurrence × Detection) to every failure mode. Items above the RPN threshold require mitigation — design change, redundancy, or monitoring. Fault Tree Analysis works top-down: define the undesired top event (loss of mission) and decompose through AND/OR gates to basic events with known probabilities. Both analyses are mandatory for ESA/NASA Class A missions per ECSS-Q-ST-30-02." />
          </div>
        </div>
      </section>

      {/* ── 3 · Spacecraft Structures ────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Spacecraft Structures</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Launch Loads, Frequency, and Materials.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The structure must survive the most mechanically violent phase of any mission — launch —
            while remaining as light as possible. Every gram of structure is a gram unavailable
            for payload. Design is driven by three constraints: static strength, dynamic stiffness,
            and shell buckling. The stiffness constraint usually governs.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Launch Environment — Quasi-Static Loads"
              eq={<>n<sub>ax</sub> ≈ 3–6g &ensp;(axial)<br/>n<sub>lat</sub> ≈ 1–2g &ensp;(lateral)<br/><br/>P = m · n · g<sub>0</sub></>}
              note="Quasi-static loads (QSLs) envelope the low-frequency response during max-q and MECO transients, combined with dynamic load factors from coupled loads analysis (CLA). Falcon 9 imposes ~3.5g axial; Ariane 5 reaches 4.55g at booster separation. The axial load drives the compression column in the primary structure; lateral loads drive interface shear and the adapter stiffness requirement. QSLs multiplied by the factor of safety (1.25 yield, 1.5 ultimate) give design limit loads." />
            <EqCard label="Frequency Requirements — Launcher Interface"
              eq={<>f<sub>ax</sub> &gt; 25 Hz<br/>f<sub>lat</sub> &gt; 10 Hz<br/><br/>f<sub>1</sub> = <Fr n={<>√(k/m)</>} d="2π"/></>}
              note="The frequency floor prevents the spacecraft from coupling with the launch vehicle's structural modes, which would amplify QSLs by 3–10×. Falcon 9 EELV requirements: first longitudinal mode above 25 Hz, lateral above 10 Hz. A failed frequency verification triggers a full CLA rerun — potentially requiring hardware modifications and delaying launch by months. Stiffness requirements, not strength, typically set honeycomb panel skin thicknesses and central cylinder wall gauges." />
            <EqCard label="Euler Column Buckling"
              eq={<>P<sub>cr</sub> = <Fr n={<>π<sup>2</sup>EI</>} d={<>(KL)<sup>2</sup></>}/></>}
              note="The critical compressive load for an ideal slender column. E is Young's modulus, I is second moment of area, L is length, K is the effective length factor (K=1 pinned-pinned, K=0.5 fixed-fixed). Spacecraft primary structure — thrust tubes and central cylinders — fails by shell buckling, which is more complex; knockdown factors (KDFs) of 0.3–0.65 below classical theory are applied to account for geometric imperfections, using databases such as NASA SP-8007 and the DESICOS knockdown map." />
            <EqCard label="Thin-Walled Pressure Vessel — Habitable Modules"
              eq={<>σ<sub>hoop</sub> = <Fr n="pR" d="t"/><br/><br/>σ<sub>axial</sub> = <Fr n="pR" d="2t"/></>}
              note="Hoop stress governs cylindrical shells. For the ISS Quest airlock (p = 103 kPa, R = 1.0 m, Al 2219-T8 wall t = 3 mm): σ_hoop = 34 MPa, well within the 450 MPa UTS with margin. NASA's BEAM inflatable module (deployed on ISS 2016) uses layered Vectran fabric at 60 kg/m² areal density, lighter than equivalent aluminium walls above ~4 m diameter — demonstrating that textile-based pressure vessels are viable for deep-space habitats." />
            <EqCard label="Specific Stiffness — Material Selection"
              eq={<><Fr n="E" d="ρ"/> [GPa·m³/Mg]<br/><br/>Al 7075: 26&ensp;Ti-6Al-4V: 25<br/>CFRP M55J: 120</>}
              note="Specific stiffness (E/ρ) governs when frequency requirements drive sizing rather than strength. CFRP is five times stiffer per unit mass than aluminium — which is why composite sandwich panels and CFRP central cylinders dominate modern spacecraft. The Hubble primary mirror used ultra-low-expansion (ULE) glass (E/ρ = 34, CTE = 0.03 ppm/K) to hold the optical prescription through 16 thermal cycles per orbit. Material selection trades E/ρ, CTE, outgassing rate, and space radiation embrittlement simultaneously." />
            <EqCard label="LEO Thermal Fatigue — Cycle Budget"
              eq={<>N<sub>cyc</sub> = <Fr n={<>t<sub>mission</sub></>} d={<>T<sub>orbit</sub></>}/> · <Fr n="86400" d="92&thinsp;min"/> ≈ 16&thinsp;cycles/day</>}
              note="At 400 km altitude (T = 92 min), a spacecraft experiences 16 eclipse/sunlight cycles per day, each cycling joint temperatures through ΔT ≈ 100–150°C. Over 5 years: ~29,000 cycles. Aluminium-to-CFRP bonded joints in honeycomb panels are susceptible to fatigue-driven debonding due to CTE mismatch (α_Al = 23 ppm/K vs α_CFRP ≈ 0–2 ppm/K). ECSS-E-ST-32 requires qualification testing at 3× the mission cycle count." />
          </div>
        </div>
      </section>

      {/* ── 4 · Orbital Mechanics ────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Orbital Mechanics</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Kepler, Newton, and the Δv Budget.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Orbital mechanics governs every trajectory decision in spaceflight. The same inverse-square
            gravity law Kepler described geometrically in 1619 and Newton derived analytically in 1687
            is what mission designers use today to plan billion-dollar missions to the outer planets.
            Everything follows from the vis-viva equation.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Kepler's Third Law"
              eq={<>T² = <Fr n={<>4π²</>} d="μ"/> a³<br/><br/>μ<sub>⊕</sub> = 3.986×10<sup>14</sup>&thinsp;m³/s²</>}
              note="T is orbital period, a is semi-major axis, μ = GM is the standard gravitational parameter. For circular LEO at r = 6,771 km (400 km altitude): T = 2π√(r³/μ) = 5,559 s (92.6 min). GEO at r = 42,164 km: T = 86,164 s — exactly one sidereal day, making the satellite appear stationary. Kepler derived this relation empirically from Tycho Brahe's observations in 1619; Newton proved it from the inverse-square law in 1687." />
            <EqCard label="Vis-Viva Equation"
              eq={<>v² = μ<span className="text-base">(</span><Fr n="2" d="r"/> − <Fr n="1" d="a"/><span className="text-base">)</span></>}
              note="The fundamental energy equation for a Keplerian orbit. r is current distance from the central body; a is semi-major axis. For a circular orbit (a = r): v = √(μ/r). For hyperbolic escape (a → −∞): v² = 2μ/r, giving v_esc = √(2μ/r). Vis-viva underpins every Δv calculation — Hohmann transfers, bi-elliptic transfers, and plane changes are all derived by evaluating vis-viva at the burn points." />
            <EqCard label="Circular and Escape Velocity"
              eq={<>v<sub>c</sub> = <Fr n={<>√μ</>} d={<>√r</>}/><br/><br/>v<sub>esc</sub> = <Fr n={<>√(2μ)</>} d={<>√r</>}/> = √2 · v<sub>c</sub></>}
              note="At LEO (r = 6,771 km): v_c = 7.67 km/s, v_esc = 10.85 km/s. The 3.18 km/s gap between orbit and escape from LEO is why all planetary missions require large upper stages. At GEO (r = 42,164 km): v_c = 3.07 km/s — GEO satellites must maintain station against J2, solar radiation pressure, and lunar/solar gravity with north-south stationkeeping burns of ~50 m/s/yr." />
            <EqCard label="Hohmann Transfer — Minimum-Δv Manoeuvre"
              eq={<>Δv<sub>1</sub> = v<sub>1</sub><span className="text-base">(</span><Fr n={<>√(2r<sub>2</sub>)</>} d={<>√(r<sub>1</sub>+r<sub>2</sub>)</>}/>−1<span className="text-base">)</span><br/><br/>Δv<sub>2</sub> = v<sub>2</sub><span className="text-base">(</span>1−<Fr n={<>√(2r<sub>1</sub>)</>} d={<>√(r<sub>1</sub>+r<sub>2</sub>)</>}/><span className="text-base">)</span></>}
              note="The two-impulse transfer between coplanar circular orbits that minimises total Δv. LEO→GEO: Δv₁ ≈ 2.42 km/s (raise apogee), Δv₂ ≈ 1.47 km/s (circularise) = 3.89 km/s total. Combined with the 28.5° plane change at apogee, the real budget is ~6.3 km/s — carried entirely by the spacecraft's apogee engine (NTO/MMH bipropellant, Isp ≈ 321 s). This propellant mass is typically 45–50% of the satellite's launch mass." />
            <EqCard label="Classical Orbital Elements"
              eq={<>a,&thinsp;e,&thinsp;i,&thinsp;Ω,&thinsp;ω,&thinsp;ν</>}
              note="Semi-major axis (a) and eccentricity (e) define orbit size and shape. Inclination (i) is the angle to the equatorial plane. RAAN (Ω, right ascension of ascending node) and argument of perigee (ω) orient the orbit in 3D space. True anomaly (ν) is the current position in the orbit. These six elements fully define the state vector at any epoch. TLE (two-line element) sets — the standard tracking format from NORAD/SpaceTrack — encode the same six quantities plus drag and epoch." />
            <EqCard label="J2 Perturbation — RAAN Drift"
              eq={<><Fr n="dΩ" d="dt"/> = −<Fr n={<>3nJ<sub>2</sub>R<sub>⊕</sub><sup>2</sup></>} d={<>2a<sup>2</sup>(1−e<sup>2</sup>)<sup>2</sup></>}/> cos i</>}
              note="Earth's equatorial bulge (J2 = 1.083×10⁻³) causes the orbital plane to precess in RAAN. At i = 98.2°, cos i < 0, giving a prograde (eastward) precession of exactly +0.9856°/day — matching Earth's revolution around the Sun. This is the sun-synchronous orbit (SSO): the spacecraft crosses the same local solar time on every pass, giving consistent illumination for Earth observation. ESA Sentinel-2, NASA Landsat, and CNES SPOT all operate in SSO." />
          </div>
        </div>
      </section>

      {/* ── 5 · Spacecraft Propulsion ────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Spacecraft Propulsion</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">The Rocket Equation and Beyond.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Tsiolkovsky's rocket equation — derived in 1897, published in 1903 — remains the master
            constraint of all spaceflight. Every propulsion system is an attempt to maximise exhaust
            velocity within the constraints of mass, volume, power, and propellant storability.
            The tyranny of the exponential punishes low Isp mercilessly.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Tsiolkovsky Rocket Equation"
              eq={<>Δv = I<sub>sp</sub>·g<sub>0</sub>·ln<Fr n={<>m<sub>0</sub></>} d={<>m<sub>f</sub></>}/></>}
              note="m₀ is initial (wet) mass, m_f is final (dry) mass, Isp is specific impulse, g₀ = 9.80665 m/s². The logarithm is the tyrant: to achieve Δv = Isp·g₀, half the initial mass must be propellant. For Δv = 2·Isp·g₀, 86% must be propellant. This exponential penalty is why staging is mandatory for launch — and why electric propulsion (high Isp) is essential for deep space missions where carrying chemical propellant for a 10 km/s manoeuvre is physically impossible." />
            <EqCard label="Specific Impulse — Efficiency Figure of Merit"
              eq={<>I<sub>sp</sub> = <Fr n="F" d={<>ṁ·g<sub>0</sub></>}/> [s]<br/><br/>v<sub>e</sub> = I<sub>sp</sub>·g<sub>0</sub> [m/s]</>}
              note="Isp is the thrust per unit weight flow rate. Cold gas N₂: 65 s. Monopropellant hydrazine: 220 s. Bipropellant NTO/MMH: 310 s. LOX/LH₂ (RL-10C): 465 s. Hall-effect thruster: 1,500–3,000 s. Ion engine (Dawn's NSTAR): 3,100 s. Higher Isp reduces propellant mass fraction at the cost of lower thrust — which is acceptable in space where trajectory corrections can be made slowly but not on a launch pad." />
            <EqCard label="Thrust — Momentum and Pressure"
              eq={<>F = ṁ·v<sub>e</sub> + (p<sub>e</sub>−p<sub>a</sub>)A<sub>e</sub></>}
              note="Thrust is momentum flux plus pressure thrust. The pressure term vanishes when perfectly expanded (p_e = p_a). In vacuum (p_a = 0), pressure thrust is always additive — which is why vacuum-optimised nozzles with large expansion ratios outperform sea-level nozzles by 10–15% in Isp. The Merlin Vacuum has an area ratio of 165:1 vs 16:1 for the sea-level version; the RL-10 achieves up to 40:1 with its extendable nozzle." />
            <EqCard label="Propellant Mass Fraction"
              eq={<>ζ = <Fr n={<>m<sub>prop</sub></>} d={<>m<sub>0</sub></>}/> = 1 − e<sup>−Δv/v<sub>e</sub></sup></>}
              note="For a GEO satellite requiring Δv = 2 km/s stationkeeping over 15 years using a 290 s bipropellant system (v_e = 2,844 m/s): ζ = 1 − e^(−2000/2844) = 0.50. Half the launch mass is propellant. The same mission using a Hall thruster at Isp = 1,600 s (v_e = 15,696 m/s): ζ = 0.12. This mass saving translates directly to additional revenue payload — the entire business case for all-electric GEO buses like Boeing 702SP and Airbus Eurostar Neo." />
            <EqCard label="Chemical vs Electric — Isp Landscape"
              eq={<>cold gas:&ensp;60–80 s<br/>hydrazine:&ensp;200–240 s<br/>biprop:&ensp;290–460 s<br/>Hall thruster:&ensp;1,500–3,000 s<br/>ion engine:&ensp;3,000–10,000 s</>}
              note="Chemical propulsion is energy-limited by propellant bond enthalpy — theoretical maximum ~500 s for LOX/LH₂. Electric propulsion (EP) is power-limited: ion and Hall thrusters ionise and electromagnetically accelerate propellant, decoupling exhaust velocity from chemistry entirely. Dawn (ion engine, 2007–2018) accumulated 11 km/s Δv — impossible with any chemical system at its 1.22 t launch mass. The cost is time: weeks of continuous low-thrust burns versus minutes of chemical impulsive firing." />
            <EqCard label="Electric Propulsion — Power–Thrust Relation"
              eq={<>P = <Fr n={<>F·I<sub>sp</sub>·g<sub>0</sub></>} d={<>2η</>}/></>}
              note="Power scales with both thrust and exhaust velocity — raising Isp requires more power per unit thrust. A Hall thruster at η = 55%, F = 100 mN, Isp = 1,800 s needs P = 100×10⁻³ × 1,800 × 9.81 / (2 × 0.55) = 1.6 kW. The Boeing 702SP carries four 3.5 kW Hall thrusters — but its transfer to GEO takes 6 months instead of the 2 weeks needed with a chemical apogee engine. The electric bus is 30% lighter at launch and carries 30% more revenue payload at EOL." />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Key constants", items: [
                "μ⊕ = 3.986×10¹⁴ m³/s²",
                "R⊕ = 6,371 km",
                "g₀ = 9.80665 m/s²",
                "J2 = 1.083×10⁻³",
                "h_GEO = 35,786 km",
              ]},
              { label: "Orbit regimes", items: [
                "LEO: 200–2,000 km",
                "MEO: 2,000–35,786 km",
                "GEO: 35,786 km",
                "SSO: i ≈ 98.2°",
                "L-points: Lagrange orbits",
              ]},
              { label: "Propulsion", items: [
                "Isp — specific impulse (s)",
                "ṁ — mass flow (kg/s)",
                "v_e — exhaust velocity (m/s)",
                "ζ — propellant mass fraction",
                "η — thruster efficiency",
              ]},
              { label: "Structures", items: [
                "E/ρ — specific stiffness",
                "KDF — knockdown factor",
                "MGA — mass growth allowance",
                "QSL — quasi-static load",
                "FoS — factor of safety",
              ]},
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-indigo-400/60">{col.label}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="font-mono text-xs text-[#94a3b8]">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">
              AVIA · Engineering Theory · Spacecraft Systems
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
