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
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-purple-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SL({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-purple-400/70">{children}</p>
}

// Composite wall cross-section — viewBox 0 0 720 300
// Zones: left convection (0–160), wall A (160–360), wall B (360–520), right convection (520–720)
const FLUX_ARROWS = [80, 130, 175, 220, 265].map((y) => ({ y }))
const ISOTHERMS = [
  { y: 72,  op: 0.22 },
  { y: 108, op: 0.18 },
  { y: 145, op: 0.16 },
  { y: 182, op: 0.16 },
  { y: 220, op: 0.18 },
  { y: 252, op: 0.22 },
]

export default function HeatTransferPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, #0d0518 0%, #04060a 68%)" }} />

        <svg viewBox="0 0 720 300" preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-70" aria-hidden>
          <defs>
            <linearGradient id="htHotGrad" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%"   stopColor="#f97316" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="#f97316" stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="htColdGrad" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop offset="0%"   stopColor="#818cf8" stopOpacity="0"/>
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.12"/>
            </linearGradient>
            <marker id="htArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(192,132,252,0.55)"/>
            </marker>
          </defs>

          {/* Zone fills */}
          <rect x="0"   y="0" width="160" height="300" fill="url(#htHotGrad)"/>
          <rect x="160" y="0" width="200" height="300" fill="rgba(192,132,252,0.04)"/>
          <rect x="360" y="0" width="160" height="300" fill="rgba(192,132,252,0.025)"/>
          <rect x="520" y="0" width="200" height="300" fill="url(#htColdGrad)"/>

          {/* Wall boundaries */}
          <line x1="160" y1="15" x2="160" y2="285" stroke="rgba(192,132,252,0.35)" strokeWidth="1.5"/>
          <line x1="360" y1="15" x2="360" y2="285" stroke="rgba(192,132,252,0.25)" strokeWidth="1" strokeDasharray="5 4"/>
          <line x1="520" y1="15" x2="520" y2="285" stroke="rgba(192,132,252,0.35)" strokeWidth="1.5"/>

          {/* Isotherms */}
          {ISOTHERMS.map((iso, i) => (
            <line key={i} x1="20" y1={iso.y} x2="700" y2={iso.y}
              stroke={`rgba(192,132,252,${iso.op})`} strokeWidth="1" strokeDasharray="8 5"/>
          ))}

          {/* Temperature profile */}
          <path d="M 0,52 C 80,52 130,88 160,108 L 360,200 C 390,212 460,232 520,244 C 600,244 660,262 720,264"
            fill="none" stroke="rgba(192,132,252,0.75)" strokeWidth="2"/>

          {/* Heat flux arrows */}
          {FLUX_ARROWS.map((a, i) => (
            <line key={i} x1="60" y1={a.y} x2="650" y2={a.y}
              stroke={`rgba(192,132,252,${0.18 + i * 0.02})`} strokeWidth="1"
              strokeDasharray="12 6" markerEnd="url(#htArrow)"
              className="animate-flow"
              style={{ animationDuration: `${2.2 + i * 0.15}s`, animationDelay: `${i * 0.25}s` }}/>
          ))}

          {/* Zone labels */}
          <text x="80"  y="35" textAnchor="middle" fill="rgba(249,115,22,0.55)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">HOT  T&#x210E;</text>
          <text x="255" y="35" textAnchor="middle" fill="rgba(192,132,252,0.45)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">WALL  A</text>
          <text x="440" y="35" textAnchor="middle" fill="rgba(192,132,252,0.35)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">WALL  B</text>
          <text x="620" y="35" textAnchor="middle" fill="rgba(129,140,248,0.50)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">COLD  T&#x2C;</text>

          {/* Axes */}
          <text x="14" y="165" textAnchor="middle" fill="rgba(255,255,255,0.18)"
            fontSize="10" fontFamily="monospace" letterSpacing="3"
            transform="rotate(-90,14,165)">TEMP  T</text>
          <text x="365" y="295" textAnchor="middle" fill="rgba(255,255,255,0.14)"
            fontSize="9" fontFamily="monospace" letterSpacing="4">POSITION  →</text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#04060a] to-transparent"/>

        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 px-8 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-purple-400">Engineering Foundation</p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Heat<br/><span className="text-[#94a3b8]">Transfer</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter words={[
              "Heat flows from hot to cold. Always.",
              "Conduction, convection, radiation.",
              "Turbine blades run hotter than they melt.",
              "The Nusselt number is the key to convection.",
              "Every efficiency limit is a thermal limit.",
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

      {/* ── 1 · The Three Modes ──────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Mechanisms</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Conduction, Convection, Radiation.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Every heat transfer problem involves one or more of three fundamental mechanisms.
            In aerospace engineering all three appear simultaneously — the turbine blade
            sees hot combustion gas (convection), conducts heat through its wall, and radiates
            to cooler structures nearby.
          </p>
          <div className="grid gap-5 md:grid-cols-3">
            <EqCard label="Conduction — Fourier's Law"
              eq={<>q″ = −k<Fr n="dT" d="dx"/><br/><br/>Q = −kA<Fr n="dT" d="dx"/></>}
              note="Heat flux q″ is proportional to the temperature gradient and the thermal conductivity k. The negative sign: heat flows down the gradient. k for metals: 10–400 W/m·K; ceramics: 1–10; air: 0.026. The low k of turbine blade superalloys (~13 W/m·K) means the blade must be actively cooled." />
            <EqCard label="Convection — Newton's Law of Cooling"
              eq={<>Q = hA(T<sub>s</sub>−T<sub>∞</sub>)<br/><br/>q″ = h(T<sub>s</sub>−T<sub>∞</sub>)</>}
              note="The convective heat transfer coefficient h [W/m²·K] encapsulates all the fluid mechanics. h for natural convection in air: 2–25; forced air: 25–250; water: 250–10,000; boiling: 2,500–100,000. Predicting h requires solving the turbulent boundary layer — hence dimensional analysis and Nusselt correlations." />
            <EqCard label="Radiation — Stefan–Boltzmann"
              eq={<>Q = εσA(T<sub>s</sub>⁴−T<sub>sur</sub>⁴)<br/><br/>σ = 5.67×10<sup>−8</sup>&thinsp;W/m²K⁴</>}
              note="ε is the surface emissivity (0 = perfect mirror, 1 = blackbody). Radiation scales as T⁴ — dominant at high temperatures. At 1500 K a blackbody emits ~290 kW/m². This T⁴ dependence makes radiation critical in combustors and re-entry vehicles but negligible for cooled engine components at moderate temperatures." />
          </div>
        </div>
      </section>

      {/* ── 2 · Conduction ───────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Conduction</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Thermal Resistance and the Heat Equation.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Steady conduction through solids can be solved by analogy with electrical circuits —
            temperature difference drives heat flow; thermal resistance opposes it. The transient
            heat equation governs how temperature fields evolve in time, critical for thermal
            fatigue analysis of engine components.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Thermal Resistance — Plane Wall"
              eq={<>R<sub>cond</sub> = <Fr n="L" d="kA"/>&ensp;[K/W]</>}
              note="Directly analogous to electrical resistance R = L/(σA). Heat flow Q = ΔT / R_total. For a composite wall with n layers in series, R_total = Σ(L_i / k_i A). Thermal contact resistance between surfaces adds extra series terms — significant in heat exchanger design." />
            <EqCard label="Thermal Resistance — Convection"
              eq={<>R<sub>conv</sub> = <Fr n="1" d="hA"/>&ensp;[K/W]</>}
              note="Combined with conduction resistance, the overall heat transfer from a hot fluid through a wall to a cold fluid is Q = (T_hot − T_cold) / (R_conv,1 + R_wall + R_conv,2). This thermal circuit approach extends to any series/parallel combination." />
            <EqCard label="Critical Insulation Radius — Cylinder"
              eq={<>r<sub>cr</sub> = <Fr n="k" d="h"/></>}
              note="Adding insulation to a cylinder increases conduction resistance but also increases outer surface area (reducing convection resistance). The critical radius r_cr = k/h is where total resistance is minimum — adding insulation below this radius actually increases heat loss. For typical insulation in air, r_cr ≈ 2–4 mm." />
            <EqCard label="Transient Heat Equation — 1D"
              eq={<>ρc<sub>p</sub><Fr n="∂T" d="∂t"/> = k<Fr n="∂²T" d="∂x²"/> + q̇</>}
              note="q̇ is volumetric heat generation [W/m³]. The ratio k/(ρc_p) = α is thermal diffusivity [m²/s] — how fast temperature disturbances propagate. High α: temperature equilibrates quickly (metals). Low α: slow equilibration (ceramics). Turbine disc thermal fatigue is governed by this equation during engine transients." />
            <EqCard label="Thermal Diffusivity and Fourier Number"
              eq={<>α = <Fr n="k" d={<>ρc<sub>p</sub></>}/>&ensp;Fo = <Fr n="αt" d="L²"/></>}
              note="The Fourier number Fo is the dimensionless time for transient conduction. Fo >> 1: steady state approached. For engine start-up transients in a turbine disc (L ~ 0.05 m, α_steel ~ 10⁻⁵ m²/s), Fo = 1 is reached in ~250 seconds — consistent with observed thermal equilibration times." />
            <EqCard label="Fin Efficiency"
              eq={<>η<sub>f</sub> = <Fr n="tanh(mL)" d="mL"/>&ensp;m = √<Fr n="hP" d={<>kA<sub>c</sub></>}/></>}
              note="A fin of length L, perimeter P, cross-section A_c. The parameter m characterises the balance between convection (h) and conduction (k). Low m: η_f → 1, the fin is nearly isothermal — efficient. High m: temperature drops steeply, the tip contributes little. Turbine blade cooling fins are designed for η_f > 0.7." />
          </div>
        </div>
      </section>

      {/* ── 3 · Convection ───────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Convection</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Dimensionless Numbers and Nusselt Correlations.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Convective heat transfer is described by four dimensionless groups. The Nusselt
            number expresses the convective coefficient as a ratio to pure conduction; it is
            correlated empirically as a function of Reynolds and Prandtl numbers through
            decades of experimental data.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Nusselt Number"
              eq={<>Nu = <Fr n="hL" d={<>k<sub>f</sub></>}/> = f(Re, Pr)</>}
              note="Nu is the ratio of convective to conductive heat transfer across the fluid layer. Nu = 1 means pure conduction; high Nu means turbulent mixing dominates. L is the characteristic length (diameter for pipes, chord for airfoils)." />
            <EqCard label="Reynolds Number"
              eq={<>Re = <Fr n="ρVL" d="μ"/> = <Fr n="VL" d="ν"/></>}
              note="Ratio of inertial to viscous forces. Re < 2300: laminar pipe flow; > 4000: turbulent. Turbulent flow gives 5–10× higher h than laminar at the same Re, hence why compressors and turbines are designed to maintain turbulent flow over the blades." />
            <EqCard label="Prandtl Number"
              eq={<>Pr = <Fr n={<>μc<sub>p</sub></>} d="k"/> = <Fr n="ν" d="α"/></>}
              note="Ratio of momentum diffusivity to thermal diffusivity. Liquid metals Pr ~ 0.003–0.03; air Pr ≈ 0.71; water Pr ≈ 6; oils Pr = 100–1000. Pr governs the relative thickness of velocity and thermal boundary layers." />
            <EqCard label="Dittus–Boelter — Turbulent Pipe Flow"
              eq={<>Nu = 0.023&thinsp;Re<sup>0.8</sup>&thinsp;Pr<sup>n</sup><br/><br/>n = 0.4&thinsp;(heating),&ensp;0.3&thinsp;(cooling)</>}
              note="Valid for Re > 10,000, 0.6 < Pr < 160, L/D > 10. The workhorse correlation for turbine blade internal cooling passages, combustor liner cooling, and heat exchanger tubes. Re⁰·⁸ shows the strong benefit of high flow velocity; doubling flow speed increases h by 74%." />
            <EqCard label="Churchill–Bernstein — Cylinder in Crossflow"
              eq={<>Nu = 0.3 + <Fr n={<>0.62 Re<sup>½</sup>Pr<sup>⅓</sup></>} d={<>[1+(0.4/Pr)<sup>⅔</sup>]<sup>¼</sup></>}/><span className="text-base">[</span>1+<span className="text-base">(</span><Fr n="Re" d="282000"/><span className="text-base">)</span><sup>5/8</sup><span className="text-base">]</span><sup>4/5</sup></>}
              note="For a cylinder in crossflow across all Re. Used for turbine support struts, fuel injector stems, and instrumentation probes in the engine gas path." />
            <EqCard label="Grashof Number — Natural Convection"
              eq={<>Gr = <Fr n={<>gβ(T<sub>s</sub>−T<sub>∞</sub>)L³</>} d="ν²"/><br/><br/>Ra = Gr·Pr</>}
              note="β is the thermal expansion coefficient (1/T for ideal gases). The Rayleigh number Ra = Gr·Pr governs natural convection. Natural convection dominates on uncooled engine casings and nacelle surfaces at low flight speeds." />
          </div>
        </div>
      </section>

      {/* ── 4 · Radiation ────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Thermal Radiation</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Blackbody Radiation, Emissivity, and View Factors.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Radiation requires no medium and dominates at high temperatures. In combustors,
            turbine entry temperatures exceed 1700 K — flame radiation contributes
            significantly to blade heat load. In space, radiation is the only heat rejection
            mechanism available.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Blackbody Emissive Power"
              eq={<>E<sub>b</sub> = σT⁴<br/><br/>σ = 5.67×10<sup>−8</sup>&thinsp;W/m²K⁴</>}
              note="A blackbody (ε = 1) is the ideal emitter and absorber. At 1800 K (turbine entry temperature), E_b = 530 kW/m². At 290 K (aircraft skin in cruise), E_b = 401 W/m². This 1300× difference underscores why radiation is critical in combustors but negligible for most structural components." />
            <EqCard label="Real Surface — Emissivity and Absorptivity"
              eq={<>q″ = εσT<sub>s</sub>⁴ − αG<br/><br/>ε = α&ensp;(Kirchhoff&apos;s Law)</>}
              note="ε is emissivity, α is absorptivity for incident irradiation G. Kirchhoff's law: for a surface in thermal equilibrium, ε = α. Polished metals: ε ~ 0.03; oxidised metals: ε ~ 0.7–0.9; white paint: ε ~ 0.93. Spacecraft use selective emissivity coatings to control equilibrium temperature." />
            <EqCard label="View Factor (Configuration Factor)"
              eq={<>Q<sub>12</sub> = F<sub>12</sub>A<sub>1</sub>εσ(T<sub>1</sub>⁴−T<sub>2</sub>⁴)<br/><br/>F<sub>12</sub>A<sub>1</sub> = F<sub>21</sub>A<sub>2</sub></>}
              note="F₁₂ is the fraction of radiation leaving surface 1 that strikes surface 2. The reciprocity relation F₁₂A₁ = F₂₁A₂ allows unknown view factors to be found from known ones. For a convex surface (no self-view), F₁₁ = 0. View factors are purely geometric — independent of temperature or material." />
            <EqCard label="Radiation Heat Transfer Coefficient"
              eq={<>h<sub>r</sub> = εσ(T<sub>s</sub>+T<sub>sur</sub>)(T<sub>s</sub>²+T<sub>sur</sub>²)</>}
              note="When temperature differences are small, radiation can be linearised as Q = h_r A(T_s − T_sur), combining with convection in a parallel thermal circuit. h_r grows rapidly with temperature; at 900 K, h_r ~ 50 W/m²K — comparable to forced convection." />
            <EqCard label="Wien's Displacement Law"
              eq={<>λ<sub>max</sub>T = 2898&thinsp;μm·K</>}
              note="Peak emission wavelength shifts with temperature. At 5800 K (sun): λ_max = 0.5 μm (visible). At 1200 K (turbine blade): λ_max = 2.4 μm (near-IR). At 300 K (aircraft skin): λ_max = 9.7 μm. Infrared cameras are tuned to 3–5 μm or 8–12 μm bands to image engine thermal signatures." />
            <EqCard label="Re-entry Stagnation Heat Flux"
              eq={<>q<sub>stag</sub> ∝ √<Fr n={<>ρ<sub>∞</sub></>} d={<>R<sub>N</sub></>}/>V<sub>∞</sub>³</>}
              note="Peak heating at the stagnation point scales as V³ — a small speed increase is catastrophic. R_N is the nose radius; larger noses reduce heating (blunt body re-entry). The Space Shuttle experienced ~50 kW/m² peak stagnation heating; ICBM warheads see 100+ MW/m². Ablative TPS and ceramic tiles exploit low k and high heat capacity to survive." />
          </div>
        </div>
      </section>

      {/* ── 5 · Heat Exchangers ──────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Heat Exchanger Design</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">LMTD and Effectiveness–NTU Methods.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Heat exchangers appear throughout aviation: oil coolers, pre-coolers, intercoolers
            in multi-spool engines, and the precooled cycle in SABRE-type engines.
            Two design methods handle all configurations — LMTD for known outlet temperatures,
            effectiveness–NTU for unknown outlets.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard label="Log Mean Temperature Difference (LMTD)"
              eq={<>Q = UA&thinsp;ΔT<sub>lm</sub><br/><br/>ΔT<sub>lm</sub> = <Fr n={<>ΔT<sub>1</sub>−ΔT<sub>2</sub></>} d={<>ln(ΔT<sub>1</sub>/ΔT<sub>2</sub>)</>}/></>}
              note="U is the overall heat transfer coefficient [W/m²·K], A is heat transfer area. ΔT₁ and ΔT₂ are temperature differences at each end of the exchanger. For counter-flow, ΔT₁ = T_h,in − T_c,out and ΔT₂ = T_h,out − T_c,in. Counter-flow always gives higher LMTD than parallel-flow for the same terminal temperatures." />
            <EqCard label="Overall Heat Transfer Coefficient"
              eq={<><Fr n="1" d="UA"/> = <Fr n="1" d={<>h<sub>h</sub>A<sub>h</sub></>}/> + R<sub>fouling</sub> + <Fr n="L" d={<>kA<sub>w</sub></>}/> + <Fr n="1" d={<>h<sub>c</sub>A<sub>c</sub></>}/></>}
              note="All thermal resistances in series. Fouling resistance R_f accounts for scale, deposits, and oxidation buildup — it grows with service life and dominates in oil/fuel heat exchangers after many hours. Design must include a fouling allowance, which typically increases the required heat transfer area by 15–40%." />
            <EqCard label="Effectiveness–NTU Method"
              eq={<>ε = <Fr n="Q" d={<>Q<sub>max</sub></>}/>&ensp;NTU = <Fr n="UA" d={<>C<sub>min</sub></>}/><br/><br/>Q<sub>max</sub> = C<sub>min</sub>(T<sub>h,in</sub>−T<sub>c,in</sub>)</>}
              note="Effectiveness ε is the ratio of actual to maximum possible heat transfer. C_min = (ṁc_p)_min is the smaller heat capacity rate. NTU is a dimensionless measure of heat exchanger size. Used when outlet temperatures are unknown — typical of a design-point analysis." />
            <EqCard label="Counter-Flow ε–NTU Relation"
              eq={<>ε = <Fr n="1−exp[−NTU(1−C*)]" d="1−C*·exp[−NTU(1−C*)]"/>&ensp;C* = <Fr n={<>C<sub>min</sub></>} d={<>C<sub>max</sub></>}/></>}
              note="Counter-flow gives the highest possible effectiveness for a given NTU — the fluid streams run in opposite directions, maintaining the largest temperature difference throughout. At NTU → ∞, ε → 1/(1+C*). All high-performance heat exchangers use counter-flow or cross-counter-flow arrangements." />
          </div>
        </div>
      </section>

      {/* ── 6 · Aerospace Applications ───────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SL>Aerospace Applications</SL>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Turbine Cooling, TPS, and Aerodynamic Heating.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Heat transfer engineering determines the performance ceiling of every gas turbine.
            Turbine entry temperatures already far exceed material melting points — only
            aggressive cooling makes modern engine efficiency possible. At the other extreme,
            re-entry vehicles must survive hypersonic aerodynamic heating for only minutes.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard label="Film Cooling Effectiveness"
              eq={<>η<sub>f</sub> = <Fr n={<>T<sub>∞</sub>−T<sub>aw</sub></>} d={<>T<sub>∞</sub>−T<sub>c</sub></>}/></>}
              note="η_f measures how well a cool air film protects the blade surface. T_aw is the adiabatic wall temperature with cooling, T_∞ is hot gas temperature, T_c is coolant temperature. η_f = 1 means perfect protection. Modern HPT blades achieve η_f = 0.4–0.65, allowing metal temperatures 400–600 K below the gas stream." />
            <EqCard label="Blowing Ratio"
              eq={<>M = <Fr n={<>(ρV)<sub>c</sub></>} d={<>(ρV)<sub>∞</sub></>}/></>}
              note="M governs film cooling coverage. M < 0.5: coolant hugs surface (good film). M = 0.5–1.5: optimal. M > 2: coolant jet penetrates into main flow, losing the protective film. Designers balance M across the blade surface using shaped holes to improve coverage by up to 30% over round holes." />
            <EqCard label="Aerodynamic Heating — Recovery Temperature"
              eq={<>T<sub>aw</sub> = T<sub>∞</sub> + r<Fr n={<>V<sub>∞</sub>²</>} d={<>2c<sub>p</sub></>}/><br/><br/>r = Pr<sup>½</sup>&ensp;(laminar)</>}
              note="The adiabatic wall temperature — the skin temperature of an uncooled surface at high speed. For a supersonic aircraft at Mach 2 at altitude (T_∞ = 217 K): T_aw ≈ 362 K (89°C). At Mach 3: T_aw ≈ 622 K — structural aluminium limit (~450 K) is already exceeded." />
            <EqCard label="Thermal Barrier Coating (TBC)"
              eq={<>ΔT<sub>TBC</sub> = q″·<Fr n={<>L<sub>TBC</sub></>} d={<>k<sub>TBC</sub></>}/></>}
              note="TBCs (yttria-stabilised zirconia, k ~ 1.5 W/m·K) deposit 100–300 μm on turbine blades. At typical heat flux of 5 MW/m², a 200 μm TBC drops metal temperature by ~67 K. Combined with film cooling, modern HPT blades operate with metal temperatures 700 K below the gas." />
            <EqCard label="Biot Number — Lumped Capacity Validity"
              eq={<>Bi = <Fr n={<>hL<sub>c</sub></>} d={<>k<sub>solid</sub></>}/> &lt; 0.1&ensp;→&ensp;lumped</>}
              note="If Bi < 0.1, temperature gradients within the solid are negligible — the entire body heats as a single lump: ρVc_p(dT/dt) = hA(T_∞ − T). For thin turbine blades with high k, Bi < 0.1 is often satisfied, simplifying transient thermal analysis to a first-order ODE." />
            <EqCard label="Time Constant — Lumped Thermal System"
              eq={<>τ = <Fr n={<>ρVc<sub>p</sub></>} d="hA"/>&ensp;T(t) = T<sub>∞</sub>+(T<sub>0</sub>−T<sub>∞</sub>)e<sup>−t/τ</sup></>}
              note="The thermal time constant τ governs how fast the body equilibrates. A turbine blade (ρ ~ 8400 kg/m³, L_c ~ 1 mm, c_p ~ 500 J/kg·K) with h ~ 2000 W/m²·K has τ ~ 2 s — it reaches 63% of its final temperature in 2 seconds during an engine surge." />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Conduction",       items: ["k — thermal conductivity", "q″ = −k·dT/dx", "R_cond = L/(kA)", "α = k/(ρc_p) — diffusivity", "Fo = αt/L² — Fourier No."] },
              { label: "Convection",       items: ["h — heat transfer coeff.", "Nu = hL/k_f", "Re = VL/ν", "Pr = ν/α", "Ra = Gr·Pr (natural conv.)"] },
              { label: "Radiation",        items: ["σ = 5.67×10⁻⁸ W/m²K⁴", "ε — emissivity", "F₁₂ — view factor", "h_r ≈ 4εσT³_mean", "λ_max·T = 2898 μm·K"] },
              { label: "Heat exchangers",  items: ["U — overall HTC", "LMTD — log mean ΔT", "ε — effectiveness", "NTU = UA/C_min", "C* = C_min/C_max"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-purple-400/60">{col.label}</p>
                <ul className="space-y-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="font-mono text-xs text-[#94a3b8]">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">AVIA · Engineering Theory · Heat Transfer</p>
          </div>
        </div>
      </section>

    </main>
  )
}
