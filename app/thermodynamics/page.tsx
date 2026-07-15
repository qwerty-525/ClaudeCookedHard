"use client"
import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Typewriter } from "@/components/ui/typewriter"
import TheoryToc from "@/components/TheoryToc"
import ChipLinks from "@/components/ChipLinks"

const TOC = [
  { id: "laws", label: "Laws" },
  { id: "state", label: "State Variables" },
  { id: "brayton", label: "Brayton Cycle" },
  { id: "turbomachinery", label: "Turbomachinery" },
  { id: "propulsion", label: "Propulsion" },
  { id: "combustion", label: "Combustion" },
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
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-emerald-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SL({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-emerald-400/70">{children}</p>
}

// Brayton T-s cycle path data (viewBox 0 0 560 320)
// States: 1=inlet(60,260), 2=comp exit(180,100), 3=turb entry(380,80), 4=turb exit(500,230)
// 1→2: isentropic compression (near vertical, S ≈ const)
// 2→3: isobaric heat addition (horizontal to right, T rises)
// 3→4: isentropic expansion (near vertical, S ≈ const)
// 4→1: isobaric heat rejection (horizontal to left, T drops)
const CYCLE = "M 60,260 C 80,240 160,120 180,100 L 380,80 C 410,82 470,200 500,230 Z"
const STATES = [
  { x: 60,  y: 260, label: "1",  sub: "Inlet"     },
  { x: 180, y: 100, label: "2",  sub: "Comp. Exit" },
  { x: 380, y: 80,  label: "3",  sub: "Turb. Entry"},
  { x: 500, y: 230, label: "4",  sub: "Turb. Exit" },
]

export default function ThermodynamicsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">
      <TheoryToc sections={TOC} accent="#34d399" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef}
        className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 50%, #001a0d 0%, #04060a 68%)" }} />

        {/* Brayton T-s diagram */}
        <svg viewBox="0 0 560 320" preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-60" aria-hidden>
          {/* Axes */}
          <line x1="30" y1="290" x2="540" y2="290" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
          <line x1="30" y1="290" x2="30"  y2="30"  stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
          <text x="290" y="313" textAnchor="middle" fill="rgba(255,255,255,0.18)"
            fontSize="10" fontFamily="monospace" letterSpacing="3">ENTROPY  s</text>
          <text x="14" y="160" textAnchor="middle" fill="rgba(255,255,255,0.18)"
            fontSize="10" fontFamily="monospace" letterSpacing="3"
            transform="rotate(-90,14,160)">TEMP  T</text>

          {/* Cycle fill */}
          <path d={CYCLE} fill="rgba(52,211,153,0.06)" stroke="none"/>

          {/* Cycle path — animated draw */}
          <path d={CYCLE} fill="none" stroke="rgba(52,211,153,0.50)" strokeWidth="1.5"
            strokeDasharray="1200" strokeDashoffset="1200"
            className="animate-flow" style={{ animationDuration: "4s", animationTimingFunction: "ease-in-out" }}/>

          {/* State point dots */}
          {STATES.map((s) => (
            <g key={s.label}>
              <circle cx={s.x} cy={s.y} r="5" fill="rgba(52,211,153,0.70)"/>
              <text x={s.x + 9} y={s.y - 8} fill="rgba(52,211,153,0.90)"
                fontSize="11" fontFamily="monospace" fontWeight="bold">{s.label}</text>
              <text x={s.x + 9} y={s.y + 5} fill="rgba(255,255,255,0.30)"
                fontSize="9" fontFamily="monospace">{s.sub}</text>
            </g>
          ))}

          {/* Process labels */}
          <text x="90"  y="155" fill="rgba(52,211,153,0.45)" fontSize="9" fontFamily="monospace">Compression</text>
          <text x="255" y="64"  fill="rgba(52,211,153,0.45)" fontSize="9" fontFamily="monospace">Heat Addition  q_in</text>
          <text x="445" y="145" fill="rgba(52,211,153,0.45)" fontSize="9" fontFamily="monospace" textAnchor="middle">Expansion</text>
          <text x="270" y="280" fill="rgba(52,211,153,0.30)" fontSize="9" fontFamily="monospace" textAnchor="middle">Heat Rejection  q_out</text>

          {/* W_net shaded area label */}
          <text x="270" y="185" textAnchor="middle" fill="rgba(52,211,153,0.25)"
            fontSize="14" fontFamily="monospace" fontWeight="bold">W_net</text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48
          bg-gradient-to-t from-[#04060a] to-transparent" />

        <motion.div style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 px-8 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-emerald-400">
            Engineering Foundation
          </p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Thermo
            <br/><span className="text-[#94a3b8]">dynamics</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter words={[
              "Energy cannot be created or destroyed.",
              "Entropy always increases.",
              "The Brayton cycle powers every jet engine.",
              "T-s diagrams tell the whole story.",
              "Heat in, work out, entropy up.",
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

      {/* ── 1 · Laws ─────────────────────────────────────────────────── */}
      <section id="laws" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>The Laws</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Zeroth, First, Second.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Three laws that constrain every energy conversion in the universe.
            No device — however cleverly engineered — can circumvent any of them.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <EqCard label="Zeroth Law — Thermal Equilibrium"
              eq={<>A ≡ B,&ensp;B ≡ C<br/>⟹ A ≡ C</>}
              note="If two systems are each in thermal equilibrium with a third, they are in equilibrium with each other. This defines temperature as a measurable, transitive property — the foundation on which the other laws rest." />
            <EqCard label="First Law — Energy Conservation"
              eq={<>dU = δQ − δW<br/><br/>ΔU = Q − W</>}
              note="The total internal energy change of a closed system equals the heat added minus the work done by the system. Energy is neither created nor destroyed — only converted between forms. δ (inexact differential) for Q and W signals they are path-dependent; dU is state-dependent." />
            <EqCard label="Second Law — Entropy"
              eq={<>dS ≥ <Fr n="δQ" d="T"/><br/><br/>dS = 0 (reversible)<br/>dS &gt; 0 (irreversible)</>}
              note="Every real process generates entropy. Heat engines must reject heat to a cold reservoir. No cycle can be more efficient than a Carnot cycle operating between the same temperature limits. This is why jet engines have a theoretical efficiency ceiling." />
          </div>
        </div>
      </section>

      {/* ── 2 · State Variables ──────────────────────────────────────── */}
      <section id="state" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>State Variables</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Properties of a Thermodynamic System.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A thermodynamic state is fully defined by a small set of independent
            intensive properties. For an ideal gas — the working fluid approximation
            for most propulsion analysis — two are sufficient.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Ideal Gas Law"
              eq={<>pv = RT<br/><br/>p = ρRT</>}
              note="v is specific volume (m³/kg), R is the specific gas constant (287 J/kg·K for air). Valid when intermolecular forces are negligible — a good approximation for air below ~10 MPa and above ~200 K. Deviations at extreme conditions require compressibility factor Z: pv = ZRT." />
            <EqCard label="Specific Heats"
              eq={<>c<sub>p</sub> − c<sub>v</sub> = R<br/><br/>γ = <Fr n={<>c<sub>p</sub></>} d={<>c<sub>v</sub></>}/> = 1.4 (air)</>}
              note="c_p is heat added per unit mass at constant pressure; c_v at constant volume. For air: c_p = 1005 J/kg·K, c_v = 718 J/kg·K, R = 287 J/kg·K. γ (gamma) governs compressibility effects and isentropic relations. At high temperatures in combustors, γ drops toward 1.3 as vibrational modes activate." />
            <EqCard label="Internal Energy and Enthalpy"
              eq={<>u = c<sub>v</sub>T<br/><br/>h = u + pv = c<sub>p</sub>T</>}
              note="For an ideal gas, u and h depend only on temperature (Joule's law). Enthalpy h = u + pv is the natural energy variable for open systems (turbines, compressors) because it accounts for the flow work pv needed to push fluid through control volume boundaries." />
            <EqCard label="Entropy Relations — Ideal Gas"
              eq={<>ds = c<sub>p</sub><Fr n="dT" d="T"/> − R<Fr n="dp" d="p"/><br/><br/>Δs = c<sub>p</sub>ln<Fr n={<>T<sub>2</sub></>} d={<>T<sub>1</sub></>}/> − R ln<Fr n={<>p<sub>2</sub></>} d={<>p<sub>1</sub></>}/></>}
              note="Entropy change depends on both temperature and pressure changes. A compression that raises T while raising p proportionally (isentropic, Δs=0) results in zero entropy generation. Real compressors generate entropy through viscous dissipation — the isentropic efficiency η_c quantifies this loss." />
            <EqCard label="Isentropic Process (Δs = 0)"
              eq={<>TV<sup>γ−1</sup> = const<br/><br/><Fr n={<>T<sub>2</sub></>} d={<>T<sub>1</sub></>}/> = <span className="text-base">(</span><Fr n={<>p<sub>2</sub></>} d={<>p<sub>1</sub></>}/><span className="text-base">)</span><sup>(γ−1)/γ</sup></>}
              note="An isentropic process is both adiabatic (no heat transfer) and reversible (no entropy generation). The p-T relation is the key equation for compressor and turbine analysis: given a pressure ratio, the isentropic temperature ratio follows directly. Real machines are quantified by their deviation from this ideal." />
            <EqCard label="Carnot Efficiency — Upper Bound"
              eq={<>η<sub>Carnot</sub> = 1 − <Fr n={<>T<sub>cold</sub></>} d={<>T<sub>hot</sub></>}/></>}
              note="The maximum possible efficiency of any heat engine operating between T_hot and T_cold. No engine — not even a theoretically perfect one — can exceed this. For a modern turbofan: T_hot ≈ 1800 K (turbine entry), T_cold ≈ 250 K (ambient at altitude). η_Carnot ≈ 86%. Real cycle efficiency is 45–55%." />
          </div>
        </div>
      </section>

      {/* ── 3 · The Brayton Cycle ────────────────────────────────────── */}
      <section id="brayton" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>The Jet Engine Cycle</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">The Brayton Cycle.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Every gas turbine — turbojet, turbofan, turboprop, turboshaft — operates
            on the Brayton cycle. Four processes. Four states. The cycle area on the
            T-s diagram is the net specific work output.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard label="Process 1→2 — Isentropic Compression"
              eq={<><Fr n={<>T<sub>2</sub></>} d={<>T<sub>1</sub></>}/> = <span className="text-base">(</span><Fr n={<>p<sub>2</sub></>} d={<>p<sub>1</sub></>}/><span className="text-base">)</span><sup>(γ−1)/γ</sup><br/><br/>w<sub>c</sub> = c<sub>p</sub>(T<sub>2</sub> − T<sub>1</sub>)</>}
              note="The compressor raises pressure from p₁ to p₂. For a pressure ratio of 40:1 (GE90-115B), the isentropic temperature ratio is 40^(0.4/1.4) ≈ 3.1. T₁ = 220 K at altitude → T₂,ideal ≈ 680 K. Real compressor T₂ is higher (typically 720–740 K) due to isentropic efficiency η_c = 85–92%." />
            <EqCard label="Process 2→3 — Isobaric Combustion (Constant Pressure)"
              eq={<>q<sub>in</sub> = c<sub>p</sub>(T<sub>3</sub> − T<sub>2</sub>)<br/><br/>T<sub>3</sub> : Turbine Entry Temperature</>}
              note="Heat addition at constant pressure — in a real combustor, p₃ ≈ 0.95 p₂ (small pressure drop). T₃ is the turbine entry temperature (TET), the most thermodynamically critical parameter. Modern aero-engines achieve TET of 1700–1900 K. Turbine blade material limits are ~1200 K metal temperature; the gap is bridged by film cooling and thermal barrier coatings." />
            <EqCard label="Process 3→4 — Isentropic Expansion"
              eq={<><Fr n={<>T<sub>4</sub></>} d={<>T<sub>3</sub></>}/> = <span className="text-base">(</span><Fr n={<>p<sub>4</sub></>} d={<>p<sub>3</sub></>}/><span className="text-base">)</span><sup>(γ−1)/γ</sup><br/><br/>w<sub>t</sub> = c<sub>p</sub>(T<sub>3</sub> − T<sub>4</sub>)</>}
              note="The turbine extracts work from the hot, high-pressure gas. In a jet engine, the turbine extracts only enough work to drive the compressor (w_t = w_c). The remaining enthalpy drop is converted to kinetic energy in the propelling nozzle. In a turboshaft (helicopter), the power turbine extracts virtually all available work." />
            <EqCard label="Thermal Efficiency — Ideal Brayton"
              eq={<>η<sub>th</sub> = 1 − <Fr n={<>T<sub>1</sub></>} d={<>T<sub>2</sub></>}/> = 1 − <span className="text-base">(</span><Fr n="1" d={<>r<sub>p</sub></>}/><span className="text-base">)</span><sup>(γ−1)/γ</sup></>}
              note="r_p = p₂/p₁ is the overall pressure ratio. Higher r_p means higher T₂ and better efficiency — the thermodynamic argument for ever-increasing compressor pressure ratios. At r_p = 40, η_th,ideal ≈ 57%. Real cycle efficiency is lower due to component losses, cooling air mixing, and nozzle inefficiencies." />
            <EqCard label="Specific Net Work Output"
              eq={<>w<sub>net</sub> = w<sub>t</sub> − w<sub>c</sub> = c<sub>p</sub>[(T<sub>3</sub>−T<sub>4</sub>) − (T<sub>2</sub>−T<sub>1</sub>)]</>}
              note="The net work is the turbine work minus the compressor work. The compressor work penalty grows faster than turbine work as pressure ratio increases, defining an optimal pressure ratio for maximum specific work. For fixed T₃, optimal r_p for max work is lower than for max efficiency — the designer must choose a compromise." />
            <EqCard label="Work-Back Fraction — Compressor Work Ratio"
              eq={<>β = <Fr n={<>w<sub>c</sub></>} d={<>w<sub>t</sub></>}/> = <Fr n={<>T<sub>2</sub>−T<sub>1</sub></>} d={<>T<sub>3</sub>−T<sub>4</sub></>}/></>}
              note="β is the fraction of turbine work consumed by the compressor. For a modern high-bypass turbofan, β ≈ 0.55–0.65 — more than half the turbine's output goes straight back to the compressor. This is why turbine entry temperature matters so much: raising T₃ increases the denominator, reducing β and improving the work-back fraction." />
          </div>
        </div>
      </section>

      {/* ── 4 · Turbomachinery ───────────────────────────────────────── */}
      <section id="turbomachinery" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Turbomachinery Thermodynamics</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Compressors, Turbines, and Efficiency.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Real compressors and turbines deviate from the isentropic ideal. Isentropic
            efficiency and polytropic efficiency quantify these deviations differently —
            one as a single-stage result, the other as an infinitesimal stage efficiency.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Isentropic Efficiency — Compressor"
              eq={<>η<sub>c</sub> = <Fr n={<>w<sub>c,ideal</sub></>} d={<>w<sub>c,actual</sub></>}/> = <Fr n={<>T<sub>2s</sub>−T<sub>1</sub></>} d={<>T<sub>2</sub>−T<sub>1</sub></>}/></>}
              note="T₂s is the isentropic exit temperature; T₂ is the actual (higher) exit temperature. A less efficient compressor requires more work to achieve the same pressure ratio, delivering hotter air to the combustor. Modern axial compressors achieve η_c = 87–92%." />
            <EqCard label="Isentropic Efficiency — Turbine"
              eq={<>η<sub>t</sub> = <Fr n={<>w<sub>t,actual</sub></>} d={<>w<sub>t,ideal</sub></>}/> = <Fr n={<>T<sub>3</sub>−T<sub>4</sub></>} d={<>T<sub>3</sub>−T<sub>4s</sub></>}/></>}
              note="The turbine extracts less work than the isentropic ideal. T₄s is the isentropic exit temperature (colder than actual T₄). Modern high-pressure turbines achieve η_t = 88–93% despite operating at temperatures far above material limits, enabled by sophisticated cooling." />
            <EqCard label="Polytropic Efficiency"
              eq={<>η<sub>∞,c</sub> = <Fr n="(γ−1)/γ" d="(n−1)/n"/> → n = <Fr n="γ" d={<>1−(γ−1)/η<sub>∞</sub></>}/></>}
              note="Polytropic efficiency is the isentropic efficiency of an infinitesimal stage — it is independent of pressure ratio and reflects true blade row performance. Overall isentropic efficiency falls as pressure ratio increases even at constant polytropic efficiency, because errors compound stage by stage." />
            <EqCard label="Euler Turbomachinery Equation"
              eq={<>w = U<sub>1</sub>C<sub>θ1</sub> − U<sub>2</sub>C<sub>θ2</sub></>}
              note="The specific work input/output depends on blade speed U and the change in tangential (swirl) velocity C_θ of the working fluid. For a compressor, swirl is added (C_θ2 > C_θ1); for a turbine, swirl is extracted. This is the fundamental velocity triangle equation from which all blade design follows." />
            <EqCard label="Degree of Reaction"
              eq={<>R = 1 − <Fr n={<>C<sub>θ1</sub>+C<sub>θ2</sub></>} d="2U"/></>}
              note="Reaction R is the fraction of the stage enthalpy rise that occurs in the rotor (vs. stator). R = 0.5 (50% reaction) distributes pressure rise equally between rotor and stator — minimising blade loading and improving efficiency. High-pressure turbine stages use R ≈ 0.3–0.5; first-stage impulse turbines approach R = 0." />
            <EqCard label="Corrected Mass Flow and Speed"
              eq={<>ṁ<sub>corr</sub> = ṁ<Fr n={<>√T<sub>0</sub>/T<sub>ref</sub></>} d={<>p<sub>0</sub>/p<sub>ref</sub></>}/>&ensp;N<sub>corr</sub> = <Fr n="N" d={<>√T<sub>0</sub>/T<sub>ref</sub></>}/></>}
              note="Corrected (referred) quantities collapse compressor and turbine maps to a single characteristic curve independent of inlet conditions. Engine performance maps are drawn in corrected coordinates; the operating point is determined by matching these across all components simultaneously." />
          </div>
        </div>
      </section>

      {/* ── 5 · Propulsion ───────────────────────────────────────────── */}
      <section id="propulsion" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>From Cycle to Thrust</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Propulsion Thermodynamics.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The Brayton cycle produces net work — propulsion converts it into thrust.
            Two separate efficiencies govern the conversion, and their product explains
            every architecture decision from the turbojet to the 12:1-bypass geared turbofan.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="The Thrust Equation"
              eq={<>F = ṁ(V<sub>e</sub> − V<sub>0</sub>) + (p<sub>e</sub> − p<sub>∞</sub>)A<sub>e</sub></>}
              note="Thrust is momentum change plus pressure thrust. ṁ is the air mass flow, V₀ flight velocity, V_e exhaust velocity. The same thrust can come from a small ṁ with large ΔV (turbojet) or a huge ṁ with small ΔV (high-bypass turbofan) — and the second is dramatically more efficient. This one equation drives the entire history of engine architecture." />
            <EqCard label="Propulsive (Froude) Efficiency"
              eq={<>η<sub>p</sub> = <Fr n="2" d={<>1 + V<sub>e</sub>/V<sub>0</sub></>}/></>}
              note="The fraction of jet kinetic energy that becomes useful thrust work. η_p → 1 as V_e → V₀, but thrust → 0 there too. A turbojet at V_e/V₀ ≈ 3 wastes half its jet energy stirring the atmosphere; a modern turbofan at V_e/V₀ ≈ 1.35 achieves η_p ≈ 0.85. This is the thermodynamic argument for ever-higher bypass ratios." />
            <EqCard label="Thermal and Overall Efficiency"
              eq={<>η<sub>th</sub> = <Fr n={<>ΔKE&#775;<sub>jet</sub></>} d={<>ṁ<sub>f</sub>·LHV</>}/><br/><br/>η<sub>0</sub> = η<sub>th</sub>·η<sub>p</sub> = <Fr n={<>F·V<sub>0</sub></>} d={<>ṁ<sub>f</sub>·LHV</>}/></>}
              note="Thermal efficiency measures fuel energy converted to jet kinetic energy (set by OPR and TET — the cycle). Propulsive efficiency measures kinetic energy converted to thrust work (set by bypass ratio). Overall efficiency is their product: ~55% × ~80% ≈ 40–45% for a modern turbofan at cruise. The two levers are independent — hence OPR and BPR both keep climbing." />
            <EqCard label="Thrust Specific Fuel Consumption"
              eq={<>TSFC = <Fr n={<>ṁ<sub>f</sub></>} d="F"/>&ensp;[lb/lbf·hr]</>}
              note="The airline-facing efficiency metric — it plugs straight into the Breguet range equation. Early turbojets: ~0.9 at cruise. CFM56 generation: ~0.6. LEAP/GTF/GEnx generation: ~0.5. Afterburning roughly doubles or triples TSFC, which is why supercruise (dry supersonic cruise) was worth an entire engine development programme." />
            <EqCard label="Specific Thrust — The Design Trade"
              eq={<><Fr n="F" d="ṁ"/> = (1+f)V<sub>e</sub> − V<sub>0</sub>&ensp;[N·s/kg]</>}
              note="Thrust per unit of air swallowed. High specific thrust = small frontal area, high jet velocity — fighters, where drag and volume dominate. Low specific thrust = huge fan, slow jet — airliners, where fuel burn dominates. A fighter engine and an airliner engine are the same cycle tuned to opposite ends of this single parameter." />
            <EqCard label="Afterburning — Rayleigh Heat Addition"
              eq={<>F<sub>AB</sub>/F<sub>dry</sub> ≈ √(T<sub>0,AB</sub>/T<sub>0,dry</sub>)</>}
              note="An afterburner adds fuel in the tailpipe (Rayleigh flow) raising exhaust stagnation temperature from ~1000 K to ~2000+ K; jet velocity — and thrust — scale with √T₀. A 50–70% thrust boost with no extra turbomachinery, paid for with 2–3× the TSFC and a huge IR signature. There is no turbine downstream, so the flame can run far hotter than TET limits." />
          </div>
        </div>
      </section>

      {/* ── 6 · Combustion ───────────────────────────────────────────── */}
      <section id="combustion" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Heat Addition</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Combustion and the Combustor.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The combustor is where the cycle&apos;s q<sub>in</sub> actually happens: kerosene spray,
            a stoichiometric primary zone, and a carefully staged dilution that delivers gas to
            the turbine at exactly the temperature the blades can survive.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Fuel Energy — Lower Heating Value"
              eq={<>Q&#775;<sub>in</sub> = ṁ<sub>f</sub>·LHV<br/><br/>LHV<sub>Jet-A</sub> = 43.1&thinsp;MJ/kg</>}
              note="LHV is the usable chemical energy per kilogram of fuel (water in the exhaust stays as vapour, hence 'lower'). Jet-A at 43.1 MJ/kg carries ~60× the energy density of the best lithium-ion batteries — the single number that explains why electric airliners remain hard. Hydrogen: 120 MJ/kg by mass, but ~4× the volume even as cryogenic liquid." />
            <EqCard label="Fuel–Air Ratio and Equivalence Ratio"
              eq={<>f = <Fr n={<>ṁ<sub>f</sub></>} d={<>ṁ<sub>air</sub></>}/>&ensp;&ensp;φ = <Fr n="f" d={<>f<sub>stoich</sub></>}/></>}
              note="For kerosene, f_stoich ≈ 0.068 (φ = 1: exactly enough air to burn all fuel). A jet engine at cruise runs overall f ≈ 0.02 — φ ≈ 0.3, far too lean to burn stably. The combustor solves this by burning near-stoichiometric in the primary zone, then diluting with the remaining ~70% of the air to reach turbine-safe temperature." />
            <EqCard label="Energy Balance — Temperature Rise"
              eq={<>ṁ<sub>f</sub>·LHV·η<sub>b</sub> = ṁc<sub>p,g</sub>(T<sub>03</sub> − T<sub>02</sub>)</>}
              note="The combustor energy balance ties fuel flow to the temperature rise from compressor delivery T₀₂ to turbine entry T₀₃. Combustion efficiency η_b exceeds 99.9% in modern annular combustors at design point — combustion itself is essentially solved; the open problems are emissions, stability, and liner life. c_p,g ≈ 1150 J/kg·K for burnt gas (γ ≈ 1.33)." />
            <EqCard label="Adiabatic Flame Temperature"
              eq={<>T<sub>ad</sub> ≈ 2300&thinsp;K&ensp;(kerosene–air, φ = 1)</>}
              note="The temperature a stoichiometric kerosene-air flame reaches with no heat loss — far above any turbine material limit and above the ~2200 K where nitrogen chemistry runs away. Every combustor is therefore a dilution machine: create a small φ ≈ 1 flame for stability, then quench it fast to T₀₃ = 1700–1900 K before the first nozzle guide vane." />
            <EqCard label="Thermal NOx — The Zeldovich Mechanism"
              eq={<>d[NO]/dt ∝ exp<span className="text-base">(</span>−<Fr n="69,090" d="T"/><span className="text-base">)</span></>}
              note="NOx formation is exponentially sensitive to flame temperature and nearly all of it forms above ~1850 K. Halving residence time or shaving 100 K off peak temperature cuts NOx dramatically — hence rich-quench-lean (RQL) combustors that avoid dwelling at φ = 1, and lean-premixed designs (GEnx TAPS) that never create a stoichiometric zone at all." />
            <EqCard label="Combustor Loss Budget"
              eq={<>Δp<sub>0</sub>/p<sub>02</sub> ≈ 3–6%<br/><br/>~20% of air burns; ~80% cools &amp; dilutes</>}
              note="Total pressure lost in the combustor is thrust never recovered (Rayleigh + friction losses), so liners are designed to the minimum ΔP that still achieves mixing. Of the core airflow, only about a fifth passes through the primary zone flame; the rest enters through liner film-cooling holes and dilution ports, shaping the exit temperature profile so the hottest gas avoids the blade root where stress is highest." />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "State variables", items: ["p — pressure", "T — temperature", "ρ — density", "v — specific volume", "u — internal energy"] },
              { label: "Derived quantities", items: ["h = u + pv (enthalpy)", "s — specific entropy", "g = h − Ts (Gibbs)", "c_p, c_v — specific heats", "γ = c_p/c_v"] },
              { label: "Process labels", items: ["Isothermal: T = const", "Isobaric: p = const", "Isochoric: v = const", "Isentropic: s = const", "Polytropic: pv^n = const"] },
              { label: "Key constants (air)", items: ["R = 287 J/kg·K", "c_p = 1005 J/kg·K", "c_v = 718 J/kg·K", "γ = 1.4 (cold)", "γ ≈ 1.3 (hot, combustor)"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-emerald-400/60">{col.label}</p>
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
                { href: "/gas-dynamics", label: "Gas Dynamics", sub: "when the flow goes supersonic", accent: "#fb923c" },
                { href: "/heat-transfer#applications", label: "Heat Transfer", sub: "cooling the cycle's hot end", accent: "#c084fc" },
                { href: "/engines", label: "The Engines", sub: "the Brayton cycle in hardware", accent: "#f59e0b" },
              ]}
            />
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">
              AVIA · Engineering Theory · Thermodynamics
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
