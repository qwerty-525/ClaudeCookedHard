"use client"
import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Typewriter } from "@/components/ui/typewriter"
import TheoryToc from "@/components/TheoryToc"
import ChipLinks from "@/components/ChipLinks"

const TOC = [
  { id: "governing", label: "Governing Eqns" },
  { id: "isentropic", label: "Isentropic Flow" },
  { id: "shocks", label: "Normal Shocks" },
  { id: "oblique", label: "Oblique Shocks" },
  { id: "nozzles", label: "Nozzle Flow" },
  { id: "fanno-rayleigh", label: "Fanno · Rayleigh" },
  { id: "inlets", label: "Inlets & Ramjets" },
]

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
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-orange-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SL({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-orange-400/70">{children}</p>
}

// C-D nozzle paths — viewBox 0 0 800 300
const NOZZLE_TOP    = "M 0,58  C 180,58  280,128 400,138 C 520,148 630,92  800,88"
const NOZZLE_BOTTOM = "M 0,242 C 180,242 280,172 400,162 C 520,152 630,208 800,212"
const NOZZLE_FILL   = "M 0,58 C 180,58 280,128 400,138 C 520,148 630,92 800,88 L 800,212 C 630,208 520,152 400,162 C 280,172 180,242 0,242 Z"

const STREAMS = [
  { d: "M 0,150 C 200,150 320,150 400,150 C 480,150 600,150 800,150", op: 0.55, spd: 1.6 },
  { d: "M 0,118 C 200,118 300,136 400,143 C 480,150 600,126 800,122", op: 0.40, spd: 1.4 },
  { d: "M 0,182 C 200,182 300,164 400,157 C 480,150 600,174 800,178", op: 0.40, spd: 1.4 },
  { d: "M 0,90  C 200,90  290,124 400,137 C 480,149 600,108 800,105", op: 0.25, spd: 1.2 },
  { d: "M 0,210 C 200,210 290,176 400,163 C 480,151 600,192 800,195", op: 0.25, spd: 1.2 },
]

const D1 = "M 508,150 L 556,128 L 604,150 L 556,172 Z"
const D2 = "M 645,150 L 693,136 L 741,150 L 693,164 Z"

export default function GasDynamicsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">
      <TheoryToc sections={TOC} accent="#fb923c" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, #1a0800 0%, #04060a 68%)" }} />

        <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-65" aria-hidden>
          <rect x="0"   y="0" width="400" height="300" fill="rgba(34,211,238,0.025)"/>
          <rect x="400" y="0" width="400" height="300" fill="rgba(239,68,68,0.025)"/>
          <path d={NOZZLE_FILL} fill="rgba(251,146,60,0.03)" stroke="none"/>
          <path d={NOZZLE_TOP}    fill="none" stroke="rgba(251,146,60,0.50)" strokeWidth="1.5"/>
          <path d={NOZZLE_BOTTOM} fill="none" stroke="rgba(251,146,60,0.50)" strokeWidth="1.5"/>
          <line x1="400" y1="136" x2="400" y2="164" stroke="rgba(255,255,255,0.30)" strokeWidth="1" strokeDasharray="4 3"/>
          <text x="407" y="126" fill="rgba(255,255,255,0.40)" fontSize="9" fontFamily="monospace" letterSpacing="2">M = 1</text>
          <text x="407" y="178" fill="rgba(255,255,255,0.22)" fontSize="9" fontFamily="monospace" letterSpacing="2">THROAT</text>
          {STREAMS.map((s, i) => (
            <path key={i} d={s.d} fill="none" stroke={`rgba(251,146,60,${s.op})`} strokeWidth="1"
              strokeDasharray="18 7" className="animate-flow"
              style={{ animationDuration: `${s.spd}s`, animationDelay: `${i * 0.2}s` }}/>
          ))}
          <path d={D1} fill="rgba(251,146,60,0.07)" stroke="rgba(251,146,60,0.55)" strokeWidth="1"/>
          <path d={D2} fill="rgba(251,146,60,0.04)" stroke="rgba(251,146,60,0.38)" strokeWidth="1"/>
          <text x="175" y="38" textAnchor="middle" fill="rgba(34,211,238,0.45)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">SUBSONIC · M &lt; 1</text>
          <text x="615" y="38" textAnchor="middle" fill="rgba(239,68,68,0.45)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">SUPERSONIC · M &gt; 1</text>
          <line x1="20" y1="278" x2="770" y2="278" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
          <text x="400" y="292" textAnchor="middle" fill="rgba(255,255,255,0.14)"
            fontSize="9" fontFamily="monospace" letterSpacing="4">FLOW  →</text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04060a] to-transparent"/>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 px-8 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-orange-400">Engineering Foundation</p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Gas<br/><span className="text-[#94a3b8]">Dynamics</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter words={[
              "Above Mach 0.3, density changes matter.",
              "Shocks convert kinetic energy to heat.",
              "The throat is where flows go critical.",
              "Total pressure lost is thrust never recovered.",
              "Fanno, Rayleigh, and Hugoniot.",
            ]} speed={52} delayBetweenWords={2400} cursorChar="_"/>
          </p>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-16 flex flex-col items-center gap-2 text-[#94a3b8]">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
              <path d="M7 0v16M1 11l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 1 · Governing Equations ──────────────────────────────────── */}
      <section id="governing" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Governing Equations</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Continuity, Momentum, Energy.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Compressible flow is governed by three conservation laws plus the equation of state.
            For steady, one-dimensional, adiabatic flow through a duct these reduce to algebraic
            relations between any two stations — the backbone of all gas turbine and nozzle analysis.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Continuity — Mass Conservation"
              eq={<>ρ<sub>1</sub>A<sub>1</sub>V<sub>1</sub> = ρ<sub>2</sub>A<sub>2</sub>V<sub>2</sub> = ṁ</>}
              note="Mass flow is constant along a stream tube. In compressible flow ρ varies, so density couples directly to velocity and area changes — unlike incompressible flow where AV = const suffices." />
            <EqCard label="Momentum — Euler (No Friction)"
              eq={<>dp + ρV&thinsp;dV = 0<br/><br/>p + ρV² = const</>}
              note="For inviscid steady flow. Across a normal shock the integral form p₁ + ρ₁V₁² = p₂ + ρ₂V₂² still holds — the shock is a momentum-conserving discontinuity even though entropy increases across it." />
            <EqCard label="Energy — Adiabatic Flow"
              eq={<>h + <Fr n="V²" d="2"/> = h<sub>0</sub> = const<br/><br/>c<sub>p</sub>T + <Fr n="V²" d="2"/> = c<sub>p</sub>T<sub>0</sub></>}
              note="Total (stagnation) enthalpy is conserved along any adiabatic streamline. T₀ is the stagnation temperature — what you would measure if the flow were brought to rest without heat transfer. T₀ is conserved through an intake or nozzle but rises through a combustor." />
            <EqCard label="Speed of Sound"
              eq={<>a = √(γRT)<br/><br/>a = √<span className="text-base">(</span><Fr n="∂p" d="∂ρ"/><span className="text-base">)</span><sub>s</sub></>}
              note="Sound propagates as an isentropic pressure disturbance. The second form is the fundamental definition; the first is its ideal-gas simplification. At ISA SL, a₀ = 340.3 m/s. At tropopause (216.7 K), a = 295.1 m/s — roughly 11% lower." />
            <EqCard label="Mach Number"
              eq={<>M = <Fr n="V" d="a"/> = <Fr n="V" d="√(γRT)"/></>}
              note="M < 0.3: incompressible; 0.3–0.8: subsonic compressible; 0.8–1.2: transonic; 1.2–5: supersonic; M > 5: hypersonic. Compressibility error using Bernoulli is < 1% at M = 0.1 but ~30% at M = 0.7." />
            <EqCard label="Stagnation (Total) Conditions"
              eq={<><Fr n={<>T<sub>0</sub></>} d="T"/> = 1 + <Fr n="γ−1" d="2"/>M²<br/><br/><Fr n={<>p<sub>0</sub></>} d="p"/> = <span className="text-base">(</span>1 + <Fr n="γ−1" d="2"/>M²<span className="text-base">)</span><sup>γ/(γ−1)</sup></>}
              note="p₀ and T₀ are conserved along an isentropic streamline — they change only through irreversibilities (shocks, friction, heat transfer). A pitot tube measures p₀ directly; T₀ is measured by a total-temperature probe." />
          </div>
        </div>
      </section>

      {/* ── 2 · Isentropic Flow ──────────────────────────────────────── */}
      <section id="isentropic" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Isentropic Flow Relations</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Critical Conditions and the Area–Mach Relation.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Isentropic flow — adiabatic and reversible — connects all flow properties through
            Mach number alone. Starred (critical) quantities at M = 1 provide the natural
            reference state. The area–Mach relation is the core equation for every nozzle and diffuser.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard label="Critical Temperature and Pressure (M = 1)"
              eq={<><Fr n="T*" d={<>T<sub>0</sub></>}/> = <Fr n="2" d="γ+1"/> = 0.833<br/><br/><Fr n="p*" d={<>p<sub>0</sub></>}/> = <span className="text-base">(</span><Fr n="2" d="γ+1"/><span className="text-base">)</span><sup>γ/(γ−1)</sup> = 0.528</>}
              note="At M = 1 the static pressure is 52.8% of stagnation pressure for air. These constants are universal — if T₀ and p₀ are known, all critical-condition quantities follow without iteration." />
            <EqCard label="Critical Density and Velocity"
              eq={<><Fr n="ρ*" d={<>ρ<sub>0</sub></>}/> = <span className="text-base">(</span><Fr n="2" d="γ+1"/><span className="text-base">)</span><sup>1/(γ−1)</sup> = 0.634<br/><br/>V* = a* = √<span className="text-base">(</span><Fr n={<>2γRT<sub>0</sub></>} d="γ+1"/><span className="text-base">)</span></>}
              note="At M = 1 the flow velocity equals the local speed of sound. V* = a* is a fixed fraction of the maximum possible velocity and is the natural velocity scale for choked duct flows." />
            <EqCard label="Area–Mach Relation"
              eq={<><Fr n="A" d="A*"/> = <Fr n="1" d="M"/><span className="text-base">[</span><Fr n={<>2+(γ−1)M²</>} d="γ+1"/><span className="text-base">]</span><sup>(γ+1)/[2(γ−1)]</sup></>}
              note="For a given area ratio A/A* two Mach solutions exist — one subsonic, one supersonic. A throat (A = A*, M = 1) connects the two regimes. At A/A* = 2: M_sub ≈ 0.31, M_sup ≈ 2.20. This relation sets the geometry of every rocket nozzle and engine bypass duct." />
            <EqCard label="Choked Mass Flow"
              eq={<>ṁ = <Fr n={<>p<sub>0</sub>A*</>} d={<>√T<sub>0</sub></>}/>√<Fr n="γ" d="R"/><span className="text-base">(</span><Fr n="2" d="γ+1"/><span className="text-base">)</span><sup>(γ+1)/[2(γ−1)]</sup></>}
              note="Once choked (M = 1 at throat), mass flow depends only on upstream stagnation conditions and throat area — back pressure cannot increase it further. Engine mass flow at altitude falls as p₀ decreases, directly limiting thrust." />
          </div>
        </div>
      </section>

      {/* ── 3 · Normal Shocks ────────────────────────────────────────── */}
      <section id="shocks" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Normal Shock Waves</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Rankine–Hugoniot Jump Conditions.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A normal shock stands perpendicular to supersonic flow and instantaneously
            decelerates it to subsonic. Static pressure and temperature spike; total pressure
            is irreversibly lost. The jump conditions follow directly from the three conservation
            laws applied across the thin shock interface.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Downstream Mach Number (γ = 1.4)"
              eq={<>M<sub>2</sub>² = <Fr n={<>M<sub>1</sub>² + 5</>} d={<>7M<sub>1</sub>² − 1</>}/></>}
              note="Downstream flow is always subsonic (M₂ < 1). At M₁ = 2: M₂ = 0.577. As M₁→∞, M₂→√(1/6) ≈ 0.408 — the thermodynamic floor." />
            <EqCard label="Static Pressure Jump"
              eq={<><Fr n={<>p<sub>2</sub></>} d={<>p<sub>1</sub></>}/> = <Fr n={<>2γM<sub>1</sub>²−(γ−1)</>} d="γ+1"/></>}
              note="At M₁ = 2: p₂/p₁ = 4.5. At M₁ = 3: 10.3. This large static pressure rise is useful in ramjet inlets but generates structural loads that must be designed for." />
            <EqCard label="Static Temperature Jump"
              eq={<><Fr n={<>T<sub>2</sub></>} d={<>T<sub>1</sub></>}/> = <Fr n={<>p<sub>2</sub></>} d={<>p<sub>1</sub></>}/>·<Fr n={<>ρ<sub>1</sub></>} d={<>ρ<sub>2</sub></>}/> = <Fr n={<>[2γM<sub>1</sub>²−(γ−1)][(γ−1)M<sub>1</sub>²+2]</>} d={<>(γ+1)²M<sub>1</sub>²</>}/></>}
              note="At M₁ = 2: T₂/T₁ = 1.69. At M₁ = 5: 5.80. The extreme temperature rise behind a strong shock requires ceramic thermal protection on hypersonic vehicles." />
            <EqCard label="Density Ratio (Hugoniot Limit)"
              eq={<><Fr n={<>ρ<sub>2</sub></>} d={<>ρ<sub>1</sub></>}/> = <Fr n={<>(γ+1)M<sub>1</sub>²</>} d={<>(γ−1)M<sub>1</sub>²+2</>}/> ≤ <Fr n="γ+1" d="γ−1"/> = 6</>}
              note="Unlike pressure and temperature, the density ratio is bounded by (γ+1)/(γ−1) = 6 for air. The temperature rise absorbs increasing enthalpy as M₁ grows, preventing unlimited compression." />
            <EqCard label="Total Pressure Ratio (Loss)"
              eq={<><Fr n={<>p<sub>02</sub></>} d={<>p<sub>01</sub></>}/> = <span className="text-base">[</span><Fr n={<>(γ+1)M<sub>1</sub>²</>} d={<>(γ−1)M<sub>1</sub>²+2</>}/><span className="text-base">]</span><sup>γ/(γ−1)</sup><span className="text-base">[</span><Fr n="γ+1" d={<>2γM<sub>1</sub>²−(γ−1)</>}/><span className="text-base">]</span><sup>1/(γ−1)</sup></>}
              note="At M₁ = 1.5: 93% of p₀ survives. At M₁ = 2: 72%. At M₁ = 3: only 33%. This catastrophic loss is why supersonic inlets use oblique shock trains rather than one strong normal shock." />
            <EqCard label="Stagnation Temperature — Conserved"
              eq={<>T<sub>01</sub> = T<sub>02</sub></>}
              note="Despite the dramatic static property jumps, stagnation temperature is unchanged across an adiabatic shock — no work or heat transfer crosses the interface. This is the energy-equation statement: h₀ = const for adiabatic flow." />
          </div>
        </div>
      </section>

      {/* ── 4 · Oblique Shocks and Expansion ────────────────────────── */}
      <section id="oblique" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Oblique Shocks and Expansion Waves</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Turning Supersonic Flow.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A supersonic flow turning into a concave surface creates an oblique shock;
            turning away from a convex surface creates a Prandtl–Meyer expansion fan.
            Oblique shocks are weaker than a normal shock at the same M₁ — the principle
            behind all supersonic inlet design.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard label="Oblique Shock — Normal Mach Components"
              eq={<>M<sub>n1</sub> = M<sub>1</sub>&thinsp;sin&thinsp;β<br/><br/>M<sub>n2</sub> = M<sub>2</sub>&thinsp;sin(β−θ)</>}
              note="β is the shock angle from the upstream flow direction. Only M_n1 enters the Rankine-Hugoniot normal shock relations — all jump conditions apply with M_n1 in place of M₁. M₂ follows from M_n2 and the deflection geometry." />
            <EqCard label="θ–β–M Relation"
              eq={<>tan&thinsp;θ = 2 cot&thinsp;β <Fr n={<>M<sub>1</sub>²sin²β − 1</>} d={<>M<sub>1</sub>²(γ+cos 2β)+2</>}/></>}
              note="The fundamental oblique shock equation. For each M₁ and deflection θ, two solutions exist — the weak shock (smaller β, occurs in nature) and the strong shock. Beyond θ_max a detached bow shock forms. Supersonic inlet ramps are designed just below θ_max for maximum pressure recovery." />
            <EqCard label="Mach Angle — Limiting Case"
              eq={<>μ = arcsin<span className="text-base">(</span><Fr n="1" d="M"/><span className="text-base">)</span></>}
              note="As deflection→0, the oblique shock degenerates to a Mach wave at angle μ — the minimum possible shock angle. M = 2: μ = 30°; M = 3: μ = 19.5°. Mach cones from supersonic aircraft and bullets are Mach waves emitted from every surface perturbation." />
            <EqCard label="Prandtl–Meyer Expansion Function"
              eq={<>ν(M) = √<Fr n="γ+1" d="γ−1"/>arctan√<Fr n="γ−1" d="γ+1"/>(M²−1) − arctan√(M²−1)<br/><br/>ν<sub>2</sub> = ν<sub>1</sub> + θ</>}
              note="When supersonic flow turns through angle θ around a convex corner, an isentropic expansion fan forms. ν(M) maps Mach number to cumulative turning from M = 1. ν = 0 at M = 1; ν_max = 130.5° as M→∞ for air. Expansion fans are fully isentropic — zero total pressure loss." />
          </div>
        </div>
      </section>

      {/* ── 5 · Nozzle Flow ──────────────────────────────────────────── */}
      <section id="nozzles" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Convergent–Divergent Nozzle Flow</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Choked Flow and Nozzle Operating Regimes.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The de Laval nozzle converts thermal energy into directed kinetic energy.
            Depending on the pressure ratio across it, five distinct flow regimes exist.
            Every jet engine and rocket nozzle operates in or near the fully-started regime.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Choke Condition"
              eq={<><Fr n={<>p<sub>0</sub></>} d="p*"/> = <span className="text-base">(</span><Fr n="γ+1" d="2"/><span className="text-base">)</span><sup>γ/(γ−1)</sup> = 1.893</>}
              note="Choking occurs when p₀/p_back ≥ 1.893. Once choked, further reduction of back pressure cannot increase mass flow through the throat. All jet nozzles and sonic venturi flowmeters operate in this regime." />
            <EqCard label="Design (Perfectly Expanded) Condition"
              eq={<><Fr n={<>p<sub>e</sub></>} d={<>p<sub>0</sub></>}/> = <span className="text-base">(</span>1+<Fr n="γ−1" d="2"/>M<sub>e</sub>²<span className="text-base">)</span><sup>−γ/(γ−1)</sup></>}
              note="At the design point, exit static pressure equals ambient — no shocks or expansion fans appear outside the nozzle. The exit Mach is set by A_e/A*. Rocket nozzles are designed for one specific altitude; jet engine nozzles often have variable geometry." />
            <EqCard label="Overexpanded — p_e &lt; p_amb"
              eq={<>p<sub>e</sub> &lt; p<sub>amb</sub>&ensp;→&ensp;oblique shocks</>}
              note="The jet is compressed back to ambient pressure by oblique shocks at the nozzle lip, forming visible shock diamonds. At strong overexpansion, a normal shock (Mach disc) forms inside the divergent section, causing flow separation and performance loss." />
            <EqCard label="Underexpanded — p_e &gt; p_amb"
              eq={<>p<sub>e</sub> &gt; p<sub>amb</sub>&ensp;→&ensp;expansion fans</>}
              note="Prandtl-Meyer fans at the nozzle lip continue accelerating the jet after exit. Visible in afterburning fighters at sea level and rockets at low altitude. The plume spreads outward; at extreme underexpansion, barrel shocks enclose a Mach disc." />
            <EqCard label="Nozzle Thrust"
              eq={<>F = ṁV<sub>e</sub> + (p<sub>e</sub>−p<sub>∞</sub>)A<sub>e</sub></>}
              note="Thrust = momentum thrust + pressure thrust. Pressure thrust is positive when underexpanded, negative when overexpanded, and zero at the design point. Variable-area nozzles optimise A_e/A* across the flight envelope." />
            <EqCard label="Specific Impulse"
              eq={<>I<sub>sp</sub> = <Fr n="F" d={<>ṁ<sub>prop</sub>g<sub>0</sub></>}/> = <Fr n={<>V<sub>e,eff</sub></>} d={<>g<sub>0</sub></>}/>&ensp;[s]</>}
              note="Thrust per unit weight-flow of propellant — the universal rocket figure-of-merit. LOX/LH₂: I_sp ≈ 450 s. Kerosene/LOX: ≈ 330 s. Ion thruster: > 3000 s but tiny thrust. Higher I_sp means more payload for a given mission Δv via the Tsiolkovsky equation." />
          </div>
        </div>
      </section>

      {/* ── 6 · Fanno and Rayleigh Flow ──────────────────────────────── */}
      <section id="fanno-rayleigh" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Internal Duct Flows</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Fanno Flow and Rayleigh Flow.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            In a constant-area duct, two mechanisms independently drive flow toward Mach 1:
            wall friction (Fanno flow) and heat addition (Rayleigh flow). Both create a
            thermal choking limit — the maximum duct length or heat addition that the inlet
            condition can support before the throat becomes blocked.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard label="Fanno Flow — Maximum Duct Length"
              eq={<><Fr n="4fL*" d="D"/> = <Fr n="1−M²" d="γM²"/> + <Fr n="γ+1" d="2γ"/>ln<Fr n={<>(γ+1)M²</>} d={<>2+(γ−1)M²</>}/></>}
              note="Friction drives the Mach number toward 1 regardless of whether flow is subsonic (accelerates) or supersonic (decelerates). 4fL*/D is the dimensionless length to the sonic point; f is the Darcy friction factor. Longer ducts require lower inlet Mach numbers to avoid choking." />
            <EqCard label="Fanno — Total Pressure Loss from Friction"
              eq={<><Fr n={<>p<sub>0</sub></>} d={<>p<sub>0</sub>*</>}/> = <Fr n="1" d="M"/><span className="text-base">[</span><Fr n={<>2+(γ−1)M²</>} d="γ+1"/><span className="text-base">]</span><sup>(γ+1)/[2(γ−1)]</sup></>}
              note="Friction destroys total pressure — every percent lost is permanent. Short, large-diameter combustors and diffusers minimise friction losses. This is why military turbofans have short, wide combustors despite the structural weight penalty." />
            <EqCard label="Rayleigh Flow — Heat Addition Limit"
              eq={<><Fr n={<>T<sub>0</sub></>} d={<>T<sub>0</sub>*</>}/> = <Fr n={<>2(γ+1)M²</>} d={<>(1+γM²)²</>}/></>}
              note="Heat addition drives Mach toward 1. T₀* is the maximum stagnation temperature achievable for a given inlet condition. Adding more fuel than this causes thermal choking — the flow cannot pass through the combustor and the inlet unstarts." />
            <EqCard label="Rayleigh — Static Temperature Maximum"
              eq={<>T<sub>max</sub>&ensp;at&ensp;M = <Fr n="1" d="√γ"/> ≈ 0.845</>}
              note="Static temperature peaks at M = 1/√γ ≈ 0.845, not at M = 1. Beyond this, further heat addition lowers static temperature while stagnation temperature continues to rise — because velocity increase dominates. Afterburner exit static temperature limits are set relative to this non-intuitive maximum." />
          </div>
        </div>
      </section>

      {/* ── 7 · Supersonic Inlets and High-Speed Propulsion ──────────── */}
      <section id="inlets" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Applied Gas Dynamics</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Supersonic Inlets, Ramjets, and Beyond.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Everything above compounds into one engineering problem: swallow supersonic air,
            decelerate it with minimum total pressure loss, and burn it. The inlet is where
            most of a high-speed engine&apos;s thermodynamic work happens — and where it can all
            be lost in milliseconds.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Inlet Pressure Recovery"
              eq={<>π<sub>d</sub> = <Fr n={<>p<sub>0,2</sub></>} d={<>p<sub>0,∞</sub></>}/>&ensp;→&ensp;each 1% ≈ 1.3% thrust</>}
              note="The inlet's figure of merit: stagnation pressure delivered to the compressor face over freestream stagnation pressure. Losses come almost entirely from shocks. The sensitivity is brutal — roughly 1.3% of net thrust per 1% of recovery — because thrust is a small difference between large momentum flows. Inlet design is where supersonic aircraft programmes are won." />
            <EqCard label="Oswatitsch Optimum — Shock Staging"
              eq={<>optimum: M<sub>n</sub> equal across each oblique shock<br/><br/>3 shocks @ M2: π<sub>d</sub> ≈ 0.97 vs 0.72 (normal)</>}
              note="Total pressure loss grows steeply with shock strength, so N weak shocks beat one strong one — and Oswatitsch proved recovery is maximised when each oblique shock has the same normal Mach number. Concorde's intake used two variable ramps plus a terminal normal shock to recover ~96% at Mach 2; a pitot inlet swallowing one normal shock would recover 72% and the aircraft could not have cruised." />
            <EqCard label="MIL-E-5008B Recovery Standard"
              eq={<>π<sub>d</sub> = 1 − 0.075(M<sub>∞</sub> − 1)<sup>1.35</sup></>}
              note="The classic military specification for expected inlet recovery from Mach 1 to 5 — the baseline every real inlet is judged against. At M1.6: 0.97. At M2.2: 0.91. At M3.2: 0.77. It quantifies why sustained flight above Mach 3 stopped making sense for air-breathing turbojets: the recoverable pressure, and with it thrust margin, falls away faster than speed adds value." />
            <EqCard label="Inlet Unstart"
              eq={<>mixed-compression inlet:<br/>swallowed shock expelled → π<sub>d</sub> collapses</>}
              note="A mixed-compression inlet decelerates flow through internal shocks positioned by precise backpressure. Any disturbance — a gust, a manoeuvre — can push the terminal shock forward out of the duct in milliseconds: unstart. Recovery collapses, drag spikes, and the asymmetric thrust yaws the aircraft violently. SR-71 crews called them 'unstarts'; the fix was automatic spike scheduling that re-swallowed the shock faster than a human could react." />
            <EqCard label="The Ramjet"
              eq={<>no turbomachinery:<br/>ram compression → burn → expand<br/><br/>useful M ≈ 2–6</>}
              note="Above roughly Mach 2, ram compression alone rivals a mechanical compressor — so remove the compressor, and with it the turbine and its temperature limit. A ramjet is an inlet, a flame holder, and a nozzle. The catch: zero static thrust (it must be boosted to speed) and below ~M2 the cycle barely closes. The SR-71's J58 bled inlet air around the core above M2.5, becoming a de facto ramjet — the reason it got faster more efficiently the faster it flew." />
            <EqCard label="The Scramjet — Supersonic Combustion"
              eq={<>M<sub>combustor</sub> &gt; 1&ensp;(no throat)<br/><br/>X-43A: M 9.6 · X-51: 210 s burn</>}
              note="Past Mach 5–6, decelerating flow to subsonic speed for combustion would heat it beyond dissociation and destroy the recovery — so a scramjet burns while the flow is still supersonic, with microseconds of residence time (likened to lighting a match in a hurricane). NASA's X-43A proved it at Mach 9.6 in 2004; the X-51 sustained combustion for 210 seconds in 2013. It remains the only credible air-breathing path to hypersonic cruise." />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Flow properties",   items: ["p — static pressure", "T — static temperature", "ρ — density", "V — flow velocity", "a = √(γRT) — speed of sound"] },
              { label: "Total conditions",  items: ["p₀ — total pressure", "T₀ — stagnation temp.", "p*/p₀ = 0.528 (air)", "T*/T₀ = 0.833 (air)", "ρ*/ρ₀ = 0.634 (air)"] },
              { label: "Shock notation",    items: ["M₁ — upstream Mach", "M₂ — downstream Mach", "β — shock wave angle", "θ — flow deflection angle", "ν(M) — Prandtl-Meyer fn."] },
              { label: "Key constants (air)", items: ["γ = 1.4", "R = 287 J/kg·K", "c_p = 1005 J/kg·K", "Max density ratio = 6", "Choking: p₀/p* = 1.893"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-orange-400/60">{col.label}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="font-mono text-xs text-[#94a3b8]">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mb-10 border-t border-white/[0.05] pt-8">
            <ChipLinks
              kicker="Continue the Notes"
              chips={[
                { href: "/thermodynamics#propulsion", label: "Propulsion", sub: "nozzle thrust in the cycle", accent: "#34d399" },
                { href: "/aerodynamics#compressibility", label: "Aerodynamics", sub: "wave drag & critical Mach", accent: "#22d3ee" },
                { href: "/engines/olympus-593", label: "Olympus 593", sub: "shock management at Mach 2", accent: "#f59e0b" },
              ]}
            />
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">AVIA · Engineering Theory · Gas Dynamics</p>
          </div>
        </div>
      </section>

    </main>
  )
}
