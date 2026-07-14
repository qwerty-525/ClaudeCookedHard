"use client"
import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Typewriter } from "@/components/ui/typewriter"
import TheoryToc from "@/components/TheoryToc"
import ChipLinks from "@/components/ChipLinks"

const TOC = [
  { id: "forces", label: "Four Forces" },
  { id: "lift", label: "Lift" },
  { id: "drag", label: "Drag" },
  { id: "wing", label: "Wing Geometry" },
  { id: "high-lift", label: "High-Lift" },
  { id: "vortex", label: "Vortex Lift" },
  { id: "compressibility", label: "Compressibility" },
  { id: "boundary-layer", label: "Boundary Layer" },
  { id: "stability", label: "Stability" },
  { id: "performance", label: "Performance" },
]

// ── Math typesetting helpers ───────────────────────────────────────────────

function Fr({ n, d }: { n: ReactNode; d: ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center align-middle mx-[0.15em] text-[0.8em] leading-none">
      <span className="border-b border-current pb-[2px] px-[3px]">{n}</span>
      <span className="pt-[2px] px-[3px]">{d}</span>
    </span>
  )
}

function EqCard({
  label, eq, note, wide,
}: { label: string; eq: ReactNode; note?: string; wide?: boolean }) {
  return (
    <div className={`rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 ${wide ? "md:col-span-2" : ""}`}>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-cyan-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-cyan-400/70">{children}</p>
  )
}

// ── Lecture-prose helpers ──────────────────────────────────────────────────

// Body paragraph — brighter than the muted intro grey, sized for sustained reading.
function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.85] text-[#b6c2d4]">{children}</p>
}

// In-lecture subheading.
function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">{children}</h3>
  )
}

// Emphasised term on first introduction.
function T({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>
}

// Highlighted key-idea / intuition callout.
function KeyIdea({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-2 rounded-r-xl border-l-2 border-cyan-400/50 bg-cyan-400/[0.04] px-5 py-4">
      {title && (
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-400/70">{title}</p>
      )}
      <p className="text-[15px] leading-[1.8] text-[#c4d0e0]">{children}</p>
    </div>
  )
}

// Lecture body: a readable single-column prose stack that sits above the equation grid.
function Lecture({ children }: { children: ReactNode }) {
  return <div className="mb-16 max-w-3xl space-y-5">{children}</div>
}

// Small caption framing the equation grid as the takeaway "formula sheet".
function FormulaSheet({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-white/30">
      {children ?? "The equations"}
    </p>
  )
}

// ── SVG airfoil data ───────────────────────────────────────────────────────

const AIRFOIL = "M 270,135 C 300,108 385,84 425,82 C 478,80 595,106 690,135 C 595,150 478,157 425,157 C 385,157 300,150 270,135 Z"

// Upper streamlines: closer to wing = faster = shorter animationDuration
const UPPER = [
  { d: "M 0,14  C 480,14  480,14  960,14",                                               spd: 2.8 },
  { d: "M 0,42  C 220,42  380,35  480,34  C 600,34  750,40  960,42",                     spd: 2.3 },
  { d: "M 0,68  C 220,68  340,52  395,48  C 460,45  580,54  690,60  C 800,65  900,67  960,68",  spd: 1.9 },
  { d: "M 0,90  C 220,90  310,66  375,58  C 430,53  520,59  620,70  C 700,76  850,87  960,90",  spd: 1.5 },
  { d: "M 0,112 C 220,112 295,78  358,65  C 410,57  490,63  570,76  C 630,84  780,107 960,112", spd: 1.2 },
]
// Lower streamlines: slightly deflected downward (downwash)
const LOWER = [
  { d: "M 0,152 C 220,152 380,163 480,165 C 580,165 700,157 960,152",                    spd: 2.2 },
  { d: "M 0,174 C 220,174 380,178 480,179 C 580,179 700,176 960,174",                    spd: 2.5 },
  { d: "M 0,200 C 480,200 480,201 960,200",                                              spd: 2.8 },
  { d: "M 0,228 C 480,228 480,228 960,228",                                              spd: 3.0 },
]

// ── Page ──────────────────────────────────────────────────────────────────

export default function AerodynamicsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const titleY       = useTransform(heroProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">
      <TheoryToc sections={TOC} accent="#22d3ee" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center justify-center overflow-hidden"
      >
        {/* Cyan radial glow */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, #001e2e 0%, #04060a 68%)" }}
        />

        {/* Airfoil SVG */}
        <svg
          viewBox="0 0 960 270"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-75"
          aria-hidden
        >
          <defs>
            <radialGradient id="lowP" cx="50%" cy="55%" r="45%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.14"/>
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="highP" cx="50%" cy="45%" r="38%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.10"/>
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
            </radialGradient>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(34,211,238,0.55)"/>
            </marker>
          </defs>

          {/* Pressure zones */}
          <ellipse cx="480" cy="102" rx="170" ry="55" fill="url(#lowP)"/>
          <ellipse cx="480" cy="168" rx="120" ry="30" fill="url(#highP)"/>

          {/* Upper streamlines */}
          {UPPER.map((s, i) => (
            <path key={`u${i}`} d={s.d} fill="none"
              stroke="rgba(34,211,238,0.38)" strokeWidth="1"
              strokeDasharray="20 8"
              className="animate-flow"
              style={{ animationDuration: `${s.spd}s`, animationDelay: `${i * 0.14}s` }}
            />
          ))}

          {/* Lower streamlines */}
          {LOWER.map((s, i) => (
            <path key={`l${i}`} d={s.d} fill="none"
              stroke="rgba(34,211,238,0.22)" strokeWidth="1"
              strokeDasharray="20 8"
              className="animate-flow"
              style={{ animationDuration: `${s.spd}s`, animationDelay: `${i * 0.18}s` }}
            />
          ))}

          {/* Airfoil body */}
          <path d={AIRFOIL}
            fill="rgba(34,211,238,0.05)"
            stroke="rgba(34,211,238,0.45)"
            strokeWidth="1.5"
          />

          {/* Chord line */}
          <line x1="270" y1="135" x2="690" y2="135"
            stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="7 5"
          />

          {/* Lift arrow */}
          <line x1="480" y1="157" x2="480" y2="92"
            stroke="rgba(34,211,238,0.50)" strokeWidth="1.5"
            markerEnd="url(#arrow)"
          />

          {/* Stagnation point */}
          <circle cx="270" cy="135" r="3" fill="rgba(255,255,255,0.55)"/>
          <circle cx="690" cy="135" r="2" fill="rgba(255,255,255,0.30)"/>

          {/* Labels */}
          <text x="480" y="58" textAnchor="middle" fill="rgba(34,211,238,0.65)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">LOW P · HIGH V</text>
          <text x="480" y="195" textAnchor="middle" fill="rgba(245,158,11,0.55)"
            fontSize="9" fontFamily="monospace" letterSpacing="3">HIGH P · LOW V</text>
          <text x="492" y="125" fill="rgba(34,211,238,0.55)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">L ↑</text>
        </svg>

        {/* Gradient fade bottom */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48
          bg-gradient-to-t from-[#04060a] to-transparent" />

        {/* Hero text */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 px-8 text-center"
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-cyan-400">
            Aviation Encyclopedia
          </p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Aero
            <br />
            <span className="text-[#94a3b8]">dynamics</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter
              words={[
                "The physics of lift.",
                "Newton, Bernoulli, and the wing.",
                "How 400 tonnes leave the ground.",
                "Reynolds, Mach, and the boundary layer.",
                "Every equation behind every flight.",
              ]}
              speed={52}
              delayBetweenWords={2400}
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
              <path d="M7 0v16M1 11l6 6 6-6"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 1 · The Four Forces ──────────────────────────────────────── */}
      <section id="forces" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px
          bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Foundation</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">The Four Forces.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Every aircraft in steady level flight satisfies two deceptively simple
            equilibria. Violate either and the aircraft climbs, dives, accelerates, or stops.
          </p>

          <Lecture>
            <P>
              Start where every flight-dynamics course starts: draw a free-body diagram of an
              aeroplane and you find exactly four forces acting through it. <T>Lift</T> and
              <T> weight</T> act roughly vertically; <T>thrust</T> and <T>drag</T> act roughly
              along the flight path. Weight is set by gravity and is very nearly constant over a
              flight (it decays slowly as fuel burns). The other three are ours to control — with
              the throttle, the elevator, and the airframe&apos;s shape.
            </P>
            <P>
              The reason we bother naming a &quot;steady&quot; condition is that Newton&apos;s
              second law, <span className="font-mono text-white">ΣF = ma</span>, collapses into
              something trivial when the acceleration is zero. In <T>unaccelerated level
              flight</T> the vector sum of the four forces is zero, which — because lift/weight
              are perpendicular to thrust/drag — splits cleanly into two scalar balances: lift
              equals weight, and thrust equals drag. That is the whole of cruise, and it is the
              baseline every manoeuvre is measured against.
            </P>
            <KeyIdea title="The governing idea">
              An aeroplane doesn&apos;t need excess lift to climb and it doesn&apos;t need excess
              thrust to go fast. It climbs on <em>excess thrust</em>. Tilt the flight path up and
              a slice of weight, <span className="font-mono text-white">W&thinsp;sin&thinsp;γ</span>,
              now opposes motion; only thrust in excess of drag can pay for it. This single
              insight — that climb and acceleration both draw from the same pool of surplus
              thrust — reappears at the end of the page as <em>specific excess power</em>.
            </KeyIdea>
            <H3>From balance to motion</H3>
            <P>
              Relax the steady assumption and the longitudinal equation of motion returns in
              full. The excess of thrust over drag, <span className="font-mono text-white">T − D</span>,
              is spent on two things at once: accelerating the aircraft along its path (the
              inertial term) and lifting it against the along-path component of gravity (the
              climb term). Which of the two dominates is a choice the pilot makes with the stick:
              trade the surplus for speed, or trade it for height. You cannot spend the same
              newton twice — the energy bookkeeping is exact.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard
              label="Level Flight — Force Balance"
              eq={<>L&nbsp;=&nbsp;W<br/>T&nbsp;=&nbsp;D</>}
              note="Lift equals weight; thrust equals drag. Both conditions must hold simultaneously for unaccelerated level flight. Break either and you have a manoeuvre."
            />
            <EqCard
              label="Climb Angle"
              eq={<>sin&thinsp;γ = <Fr n="T − D" d="W"/></>}
              note="γ is the flight path angle. At max continuous thrust, γ_max determines the steepest steady climb the aircraft can sustain. Jet fighters routinely exceed 70°; airliners rarely exceed 15°."
            />
            <EqCard
              label="Equation of Motion — Accelerating"
              eq={<>T − D = W<Fr n="dV/dt" d="g"/> + W&thinsp;sin&thinsp;γ</>}
              note="The full longitudinal equation. The first right-hand term is inertial resistance to acceleration; the second is the gravitational component along the flight path. Both draw from excess thrust."
            />
          </div>
        </div>
      </section>

      {/* ── 2 · Lift ─────────────────────────────────────────────────── */}
      <section id="lift" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Lift Generation</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Bernoulli, Circulation, and C<sub>L</sub>.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Lift is not produced by one mechanism — it is the integral of a pressure
            field over the wing surface. Bernoulli describes the local relationship;
            the Kutta condition and circulation explain why a wing generates a net
            upward force at all.
          </p>

          <Lecture>
            <P>
              Ask &quot;what makes lift?&quot; and you will get two answers that sound like rivals
              and are in fact the same statement seen from two sides. The <T>Newtonian</T> view:
              a wing deflects a great deal of air gently downward, and by the third law the air
              pushes the wing up. The <T>pressure</T> view: the wing sets up a field of low
              pressure above and higher pressure below, and lift is that pressure difference
              integrated over the surface. Both are correct because they are the same momentum
              balance — you cannot deflect air downward without a pressure field, and you cannot
              have that pressure field without deflecting air. Never let anyone tell you one is
              &quot;the real&quot; explanation.
            </P>
            <H3>Where Bernoulli helps — and where it misleads</H3>
            <P>
              Bernoulli&apos;s equation is a statement of energy conservation along a streamline:
              speed up the flow and its static pressure must fall. Over the curved upper surface
              the flow does accelerate, pressure drops, and suction results. This is true and
              useful. What Bernoulli does <em>not</em> tell you is <em>why</em> the flow speeds
              up — and the popular &quot;equal transit time&quot; story (that two parcels split at
              the nose must rejoin at the tail) is simply false. The upper-surface flow arrives at
              the trailing edge sooner, not together. Bernoulli gives you the pressure once you
              know the velocity field; it does not hand you the velocity field for free.
            </P>
            <H3>Circulation and the Kutta condition — the honest answer</H3>
            <P>
              The velocity field comes from <T>circulation</T>, Γ — a measure of the net swirl the
              wing imposes on the flow around it. The Kutta–Joukowski theorem says lift per unit
              span is simply <span className="font-mono text-white">ρVΓ</span>: no circulation, no
              lift. But an ideal (inviscid) analysis allows infinitely many values of Γ, so which
              does nature pick? The <T>Kutta condition</T> resolves it: a real wing has a sharp
              trailing edge, and viscosity forbids the flow from whipping around that razor edge
              from below to above. The flow must leave smoothly. That single physical requirement
              selects exactly one circulation — the one that produces the lift we measure.
            </P>
            <KeyIdea title="Angle of attack is the master control">
              For a thin wing in attached flow, lift grows almost perfectly linearly with angle of
              attack — the lift-curve slope is close to the theoretical 2π per radian. Camber
              simply shifts that line, setting a negative zero-lift angle so the wing lifts even at
              α = 0. This linearity is why pilots and control laws can treat α as a lever: pull the
              nose up a degree, get a predictable slug of extra lift — right up until the boundary
              layer separates and the line bends over into stall.
            </KeyIdea>
            <P>
              That ceiling is the last piece. <T>Stall</T> is not the wing &quot;running out of
              speed&quot;; it is the flow separating once the angle of attack exceeds a critical
              value (typically 15–18°), after which <span className="font-mono text-white">C
              <sub>L</sub></span> falls rather than rises. Because lift must equal weight, the
              lowest speed at which the wing can still make enough of it — the stall speed — scales
              with the square root of wing loading over{" "}
              <span className="font-mono text-white">C<sub>L,max</sub></span>. Every takeoff,
              landing, and turn limit on the aircraft traces back to that number.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Bernoulli's Equation (incompressible, along a streamline)"
              eq={<>p + ½ρV² = const</>}
              note="Along any streamline in inviscid incompressible flow, static pressure and dynamic pressure sum to a constant. Where the wing accelerates flow — above the cambered surface — static pressure drops. The pressure difference integrated over the wing area is lift."
            />
            <EqCard
              label="Lift Coefficient"
              eq={<>C<sub>L</sub> = <Fr n="L" d="½ρV²S"/><br/><br/>L = ½ρV²SC<sub>L</sub></>}
              note="The lift equation. ρ is air density (1.225 kg/m³ at ISA sea level), V is true airspeed, S is reference wing area, and C_L is the dimensionless lift coefficient — a function of angle of attack, Mach number, and wing geometry."
            />
            <EqCard
              label="Kutta–Joukowski Theorem (per unit span)"
              eq={<>L&prime; = ρ<sub>∞</sub>V<sub>∞</sub>Γ</>}
              note="Γ (circulation) is the line integral of velocity around any closed contour enclosing the airfoil. The Kutta condition — that the flow leaves the trailing edge smoothly — determines the unique value of Γ that produces the observed lift. This is the inviscid, potential-flow foundation of wing theory."
            />
            <EqCard
              label="Thin Airfoil Theory — Lift-Curve Slope"
              eq={<><Fr n="dC<sub>L</sub>" d="dα"/> = 2π&thinsp;rad<sup>−1</sup><br/><br/>C<sub>L</sub> = 2π(α − α<sub>L=0</sub>)</>}
              note="For a thin airfoil in subsonic inviscid flow, the lift-curve slope is exactly 2π per radian (0.110 per degree). Real wings achieve ~0.095/° due to viscosity. α_L=0 is the zero-lift angle — negative for cambered airfoils, zero for symmetric ones."
            />
            <EqCard
              label="Stall Speed"
              eq={<>V<sub>S</sub> = <Fr n={<>√(2W)</>} d={<>√(ρSC<sub>L,max</sub>)</>}/></>}
              note="The minimum speed at which the wing can generate lift equal to aircraft weight. C_L,max is reached at the critical angle of attack (~15–18° for most airfoils); above it, the boundary layer separates and lift collapses. Wing loading W/S directly sets stall speed — heavier or smaller wings stall faster."
            />
            <EqCard
              label="Pressure Coefficient"
              eq={<>C<sub>p</sub> = <Fr n="p − p<sub>∞</sub>" d="½ρ<sub>∞</sub>V<sub>∞</sub>²"/> = 1 − <Fr n="V²" d="V<sub>∞</sub>²"/></>}
              note="C_p = 0 at a stagnation point (V=0), C_p = −1 where local velocity equals freestream, and C_p becomes strongly negative over the upper surface suction peak. Integrating C_p around the airfoil contour gives lift and pitching-moment coefficients directly."
            />
          </div>
        </div>
      </section>

      {/* ── 3 · Drag ─────────────────────────────────────────────────── */}
      <section id="drag" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Drag Polar</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Parasite, Induced, and the Polar.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Total drag is the sum of two fundamentally different mechanisms. Parasite drag
            grows with speed squared. Induced drag — the cost of generating lift — falls
            with speed squared. Their intersection defines the most efficient operating point.
          </p>

          <Lecture>
            <P>
              Drag is not one thing. The most useful split for a whole aircraft is into two
              families that behave in <em>opposite</em> ways with speed, and understanding that
              opposition explains almost every performance chart you will ever read.
            </P>
            <H3>Parasite drag — the cost of moving through air</H3>
            <P>
              <T>Parasite drag</T> is everything that isn&apos;t a by-product of lift: skin
              friction as air shears over the skin, form drag from the pressure imbalance around a
              blunt shape, and interference drag where components meet. It scales with dynamic
              pressure, <span className="font-mono text-white">½ρV²</span> — so it grows with the
              <em> square</em> of speed. Double your airspeed and parasite drag quadruples. This is
              the drag that dominates at the fast end of the envelope.
            </P>
            <H3>Induced drag — the unavoidable tax on lift</H3>
            <P>
              <T>Induced drag</T> is the part you pay purely for making lift, and it comes from the
              wing being finite. High pressure below and low pressure above meet at the wingtip, and
              air spills around it, rolling the whole wake into two trailing vortices. Those
              vortices induce a <T>downwash</T> over the wing that tilts the local flow — and with
              it the lift vector — slightly backward. The rearward component of a force that was
              supposed to be purely vertical is induced drag. Because you need a larger lift
              coefficient to hold the aircraft up as you slow down, induced drag grows as speed
              <em> falls</em>: it varies with{" "}
              <span className="font-mono text-white">C<sub>L</sub>²</span>, and it dominates the
              slow end of the envelope.
            </P>
            <KeyIdea title="Why the drag curve is a bucket">
              One term rises with speed, the other falls with it, so total drag traces a U-shaped
              &quot;bucket.&quot; The bottom of the bucket — where the two are exactly equal — is the
              minimum-drag speed, and it is also the speed of maximum lift-to-drag ratio. Fly
              faster and parasite drag punishes you; fly slower and induced drag does. Almost every
              &quot;best&quot; speed in the aircraft manual is defined relative to this crossover.
            </KeyIdea>
            <H3>The drag polar</H3>
            <P>
              Collapse both families onto one curve of{" "}
              <span className="font-mono text-white">C<sub>D</sub></span> versus{" "}
              <span className="font-mono text-white">C<sub>L</sub></span> and you get the <T>drag
              polar</T> — arguably the single most important plot in aircraft performance. Its
              parabolic form has a constant floor (zero-lift drag,{" "}
              <span className="font-mono text-white">C<sub>D0</sub></span>) plus a term that climbs
              with the square of lift, scaled by the induced-drag factor{" "}
              <span className="font-mono text-white">K = 1/πeAR</span>. Draw a straight line from
              the origin tangent to this curve and its touch-point is the maximum L/D — the most
              aerodynamically efficient way the aircraft can fly, and, for a jet, the anchor for the
              best-range speed.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Drag Polar (parabolic approximation)"
              eq={<>C<sub>D</sub> = C<sub>D0</sub> + <Fr n="C<sub>L</sub>²" d="πeAR"/></>}
              note="C_D0 is the zero-lift (parasite) drag coefficient; the second term is induced drag. e is the Oswald span efficiency factor (0.75–0.95 for most wings); AR is aspect ratio. This parabolic polar is accurate for moderate lift coefficients away from stall."
            />
            <EqCard
              label="Induced Drag — The Cost of Lift"
              eq={<>C<sub>Di</sub> = <Fr n="C<sub>L</sub>²" d="πeAR"/><br/><br/>K = <Fr n="1" d="πeAR"/></>}
              note="Finite wings shed trailing vortices that induce a downwash reducing the effective angle of attack. The result is a rearward tilt of the lift vector — induced drag. High aspect ratio (long, slender wings) minimises this. The Oswald factor e accounts for non-elliptic lift distributions."
            />
            <EqCard
              label="Maximum Lift-to-Drag Ratio"
              eq={<><span className="text-base">(L/D)</span><sub>max</sub> = <Fr n="1" d={<>2√(KC<sub>D0</sub>)</>}/></>}
              note="Occurs where parasite drag equals induced drag: C_D0 = KC_L². This is the aerodynamically most efficient speed — minimum drag-to-lift ratio, maximum range for a jet. Operating above or below this speed increases total drag."
            />
            <EqCard
              label="Best-Range Speed (jet)"
              eq={<>V<sub>BR</sub> = <span className="text-base">(</span><Fr n={<>2W</>} d={<>ρS</>}/><span className="text-base">)</span><sup>½</sup>&thinsp;<span className="text-base">(</span><Fr n={<>K</>} d={<>C<sub>D0</sub></>}/><span className="text-base">)</span><sup>¼</sup></>}
              note="At V_BR, the drag polar is tangent to a line from the origin — the lift-to-drag ratio is maximised. For a turbofan aircraft, flying here minimises fuel per nautical mile. For best endurance (minimum fuel per hour) fly at 76% of V_BR."
            />
          </div>
        </div>
      </section>

      {/* ── 4 · Wing Design ──────────────────────────────────────────── */}
      <section id="wing" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Wing Geometry</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Aspect Ratio, Sweep, and Efficiency.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The wing planform encodes the designer&apos;s compromise between induced drag,
            wave drag, structural weight, stall characteristics, and manufacturability.
            Aspect ratio is the most powerful single parameter.
          </p>

          <Lecture>
            <P>
              A wing planform is a negotiation. Every parameter you dial in to improve one thing
              costs you somewhere else, and the shapes that end up on real aircraft are the visible
              record of which compromises the mission demanded. Four parameters carry most of the
              argument: aspect ratio, sweep, taper, and wing loading.
            </P>
            <H3>Aspect ratio — the induced-drag lever</H3>
            <P>
              <T>Aspect ratio</T> (span squared over area) measures how long and slender a wing is.
              Because induced drag comes from tip effects, and a high-aspect-ratio wing has its tips
              far from most of its lifting span, stretching the wing directly cuts induced drag — the
              term goes as <span className="font-mono text-white">1/AR</span>. This is why a sailplane,
              which lives or dies on low-speed efficiency, has an aspect ratio above 30, while a
              fighter that must roll fast and survive supersonic wave drag settles for 3 or 4. The
              catch is structural: a long slender wing is a long lever arm for the bending moment at
              the root, so it must be heavier, and it flexes.
            </P>
            <H3>Sweep — buying Mach number</H3>
            <P>
              <T>Sweep</T> exists almost entirely to fight compressibility. Only the component of the
              airflow <em>normal</em> to the leading edge &quot;feels&quot; the aerofoil, and that
              component is the flight Mach number times the cosine of the sweep angle. Sweep the wing
              back 35° and you have hidden roughly 18% of your Mach number from the wing, delaying the
              formation of shock waves and their wave drag to a higher flight speed. That is the whole
              reason every jet airliner has swept wings — and the reason they pay for it with worse
              low-speed behaviour, needing elaborate high-lift devices to land.
            </P>
            <KeyIdea title="The elliptic ideal">
              Prandtl&apos;s lifting-line theory delivers one clean, quotable result: for a given lift
              and span, induced drag is minimised when the lift is distributed <em>elliptically</em>
              across the span. Real wings chase this ideal indirectly — through <T>taper</T> (narrowing
              the chord toward the tip) and twist — because a truly elliptic planform, like the
              Spitfire&apos;s, is expensive to build. Taper also shifts lift inboard, shrinking the root
              bending moment, so it pays a structural dividend as well.
            </KeyIdea>
            <P>
              <T>Wing loading</T> (weight per unit wing area) ties the planform back to how the aircraft
              actually flies. High wing loading means a fast, gust-insensitive ride and a small wing —
              at the price of high stall and approach speeds and long runways. Low wing loading gives a
              docile, short-field aircraft that gets tossed around in turbulence. And when span is capped
              by airport gates, a <T>winglet</T> recovers some of the lost efficiency by adding effective
              aspect ratio without adding physical span — turning the tip vortex&apos;s energy into a
              small forward thrust rather than pure waste.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard
              label="Aspect Ratio"
              eq={<>AR = <Fr n="b²" d="S"/> = <Fr n="b" d="c̄"/></>}
              note="b is span, S is reference wing area, c̄ is mean aerodynamic chord. High AR (glider: 30+, airliner: 9–12, fighter: 2–4) reduces induced drag. The A380's AR of 7.8 was a deliberate trade against structural weight and gate compatibility."
            />
            <EqCard
              label="Wing Loading"
              eq={<>W/S&ensp;[N/m² or lb/ft²]<br/><br/>V<sub>S</sub> ∝ √(W/S)</>}
              note="Wing loading governs stall speed, gust response, and ride quality. A Cessna 172 is 540 N/m²; a 747-8 is 740 N/m²; an F-16 at max weight exceeds 4,300 N/m². Higher W/S means faster and less gust-sensitive — at the cost of a longer takeoff run."
            />
            <EqCard
              label="Sweep and the Cosine Rule"
              eq={<>M<sub>normal</sub> = M·cos&thinsp;Λ</>}
              note="Sweeping the wing back means the component of Mach number normal to the leading edge is reduced by cosΛ. A 35° sweep reduces the effective Mach by ~18%, delaying the onset of wave drag and raising the drag-divergence Mach number — the core reason all transonic aircraft use swept wings."
            />
            <EqCard
              label="Elliptic Lift Distribution"
              eq={<>e = 1 (ideal)<br/>C<sub>Di</sub> = <Fr n="C<sub>L</sub>²" d="πAR"/> (minimum)</>}
              note="An elliptic lift distribution — where local lift varies as the semi-ellipse across the span — minimises induced drag for a given total lift. The Spitfire's elliptic wing was designed for exactly this reason. Modern winglets extend the effective span by redirecting tip vortex energy, increasing the effective Oswald factor above 1."
            />
            <EqCard
              label="Winglet Benefit"
              eq={<>AR<sub>eff</sub> = AR<span className="text-base">(</span>1 + <Fr n="h" d="b"/><span className="text-base">)</span></>}
              note="h is the winglet height, b is the span. A winglet adds effective aspect ratio without increasing physical span (gate-limited aircraft benefit most). The 737 MAX's Split Scimitar winglets improve AR_eff by ~4%, directly reducing induced drag at cruise C_L."
            />
            <EqCard
              label="Taper Ratio and Root Bending Moment"
              eq={<>λ = <Fr n="c<sub>tip</sub>" d="c<sub>root</sub>"/>&ensp;&ensp;0 &lt; λ &lt; 1</>}
              note="A tapered wing shifts the lift distribution inboard, reducing the root bending moment that the spar must carry — the primary structural driver. Taper ratios of 0.3–0.5 approximate the elliptic lift distribution while remaining manufacturable. λ=1 is a rectangular wing; λ=0 is a pure delta."
            />
          </div>
        </div>
      </section>

      {/* ── 4b · High-Lift Systems ───────────────────────────────────── */}
      <section id="high-lift" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>High-Lift Systems</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Flaps, Slats, and C<sub>L,max</sub>.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A wing optimised for Mach 0.85 cruise cannot land at survivable speeds — its clean
            C<sub>L,max</sub> of ~1.5 would demand 170+ knot approaches. High-lift devices
            temporarily transform the wing into a different aerofoil: more camber, more chord,
            and boundary-layer control, roughly doubling maximum lift for landing.
          </p>

          <Lecture>
            <P>
              Here is the design tension in one sentence: the wing that makes an airliner efficient at
              Mach 0.85 and 35,000 feet is a terrible wing for touching down. It is thin, modestly
              cambered, and heavily loaded — perfect for slicing through thin cruise air, hopeless at
              generating the lift needed to fly slowly near the ground. High-lift devices exist to
              temporarily convert that cruise wing into a completely different, fat, high-camber
              low-speed wing for the few minutes it matters.
            </P>
            <H3>Why the approach speed must come down</H3>
            <P>
              Certification pins the approach speed at 1.23 times the stall speed in landing
              configuration, and stall speed scales with the square root of wing loading over{" "}
              <span className="font-mono text-white">C<sub>L,max</sub></span>. Wing loading is fixed by
              cruise economics — you can&apos;t grow the wing just for landing — so the <em>only</em>
              lever left is raising the maximum lift coefficient. Pushing it from a clean ~1.5 to a
              flapped-and-slatted ~3.0 cuts approach speed by about 30% and, because kinetic energy goes
              as speed squared, roughly <em>halves</em> the energy the brakes and runway must absorb.
              That is the difference between a 2,000 m and a 3,500 m runway.
            </P>
            <H3>Two devices, two different jobs</H3>
            <P>
              <T>Trailing-edge flaps</T> add camber (and, on a Fowler flap, chord and area too), which
              shifts the whole lift curve upward — more lift at any given angle of attack.{" "}
              <T>Leading-edge devices</T> — slats and Krueger flaps — do something different: they attack
              stall at its source. The upper-surface suction peak near the leading edge is where
              separation first begins; opening a slot there feeds fresh, high-energy air into the boundary
              layer and flattens the peak, letting the wing reach a much higher angle of attack before it
              lets go. Flaps raise the lift curve; slats extend it. You need both to double{" "}
              <span className="font-mono text-white">C<sub>L,max</sub></span>.
            </P>
            <KeyIdea title="It's all boundary-layer management">
              The recurring trick behind slotted flaps, slats, and blown flaps is the same: keep the
              boundary layer attached against a steep adverse pressure gradient by re-energising it —
              with a slot that bleeds fast air from below, or, at the extreme, with engine exhaust blown
              directly over the flap. Do that and you can force the flow to stay glued to a surface it
              would otherwise abandon, buying lift coefficients that &quot;clean&quot; aerodynamics
              simply cannot reach. The C-17 lands 265 tonnes on assault strips this way.
            </KeyIdea>
            <P>
              None of this is free. Deployed flaps carry large aerodynamic loads that scale with dynamic
              pressure, so each setting has a placard speed you must not exceed; the mechanisms are heavy,
              complex, and live inside the canoe-shaped fairings under the wing; and the extra drag, while
              a nuisance on takeoff, is actually welcome on approach — it lets the aircraft fly a steep,
              powered, well-controlled descent instead of floating.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard
              label="Why It Matters — Approach Speed"
              eq={<>V<sub>REF</sub> = 1.23&thinsp;V<sub>S0</sub><br/><br/>V<sub>S0</sub> ∝ √<Fr n="W/S" d={<>C<sub>L,max</sub></>}/></>}
              note="Certification requires approach at 23% above the stall speed in landing configuration. Since wing loading is fixed by cruise economics, the only lever left is C_L,max. Raising it from 1.5 (clean) to 3.0 (full flaps + slats) cuts approach speed by ~30% and kinetic energy at touchdown by half — the difference between a 2,000 m and a 3,500 m runway."
            />
            <EqCard
              label="Trailing-Edge Flaps — Camber and Chord"
              eq={<>ΔC<sub>L,max</sub>: plain ≈ 0.9<br/>slotted ≈ 1.3&ensp;Fowler ≈ 1.9</>}
              note="A plain flap adds camber. A slotted flap also bleeds high-pressure air through the gap to re-energise the upper-surface boundary layer, delaying separation. A Fowler flap slides aft before rotating — adding wing area as well as camber. The 747's triple-slotted Fowler flaps grow the wing chord by ~25% and were the key to operating 400 tonnes from 1960s runways."
            />
            <EqCard
              label="Leading-Edge Devices — Stall Angle"
              eq={<>slat gap → re-energised BL<br/><br/>Δα<sub>stall</sub> ≈ +7–10°</>}
              note="Slats and Krueger flaps attack stall at its origin: the leading-edge suction peak. Opening a slot ahead of the main element flattens the pressure spike and feeds fresh high-energy flow into the boundary layer, letting the wing reach far higher angles of attack before separating. Trailing-edge flaps raise the lift curve; leading-edge devices extend it."
            />
            <EqCard
              label="The Landing Configuration Budget"
              eq={<>C<sub>L,max</sub>: clean ≈ 1.5<br/>+ slats + full flaps ≈ 2.8–3.2</>}
              note="A modern airliner roughly doubles its maximum lift coefficient between cruise and landing configuration. The cost is drag (useful on approach — it allows a steeper, powered descent), complexity (flap tracks, actuators, asymmetry protection), and weight. Flap-track fairings — the canoe-shaped pods under the wing — exist purely to house the Fowler motion hardware."
            />
            <EqCard
              label="Deployment Limits"
              eq={<>V<sub>FE</sub> — max flaps-extended speed<br/><br/>load ∝ ½ρV²·δ<sub>f</sub></>}
              note="Aerodynamic load on a deflected flap scales with dynamic pressure, so each flap setting carries a placard speed V_FE. Overspeed with flaps out is a structural event, not just a handling one. This is why flaps deploy in scheduled stages during deceleration on approach — and why gusts near V_FE trigger automatic flap load-relief on the A350 and 787."
            />
            <EqCard
              label="Powered Lift — Blown Flaps"
              eq={<>C<sub>L,max</sub> &gt; 5 (externally blown)</>}
              note="Directing engine exhaust or bleed air over the flap system adds momentum directly to the boundary layer — circulation control. The C-17 blows its four engines' exhaust through slotted flaps to land 265 tonnes on 1,000 m assault strips at C_L values impossible aerodynamically. The upper limit of this family: the F-35B, where lift is simply engine thrust rotated vertical."
            />
          </div>
        </div>
      </section>

      {/* ── 4c · Delta Wings and Vortex Lift ─────────────────────────── */}
      <section id="vortex" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Vortex Aerodynamics</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Delta Wings and Vortex Lift.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Below ~10° angle of attack a delta wing is just a low-aspect-ratio wing. Above it,
            the sharp leading edge deliberately separates the flow into two stable, coiled
            vortices whose cores sit above the upper surface — a second, nonlinear source of
            lift that attached-flow theory cannot produce. Concorde landed on it; every
            LERX-equipped fighter manoeuvres on it.
          </p>

          <Lecture>
            <P>
              Conventional wing theory has a blind spot, and the delta wing lives inside it. Everything
              in the lift section assumed the flow stays <em>attached</em> — glued to the surface. A
              highly swept delta deliberately does the opposite: it forces the flow to separate, in a
              controlled way, and then harvests lift from the separation itself.
            </P>
            <H3>Turning separation into a feature</H3>
            <P>
              Air cannot round a sharp, highly swept leading edge, so it lets go along the entire edge
              and rolls up into a tight, conical <T>leading-edge vortex</T> sitting just above the upper
              surface. The core of that vortex spins ferociously fast, and by Bernoulli fast means
              low-pressure — it paints a powerful suction footprint on the wing. Crucially, unlike the
              chaotic, unsteady separation of a stalling conventional wing, this structure is <em>stable
              </em> and it gets <em>stronger</em> as angle of attack increases. That extra suction is
              vortex lift, and no attached-flow theory can produce it.
            </P>
            <KeyIdea title="Two lift mechanisms in one wing">
              Polhamus&apos;s suction analogy captures it beautifully: total lift is ordinary
              potential-flow lift (growing with sin&thinsp;α&thinsp;cos²α) <em>plus</em> a vortex term
              growing with sin²α. At cruise angles the vortex term is negligible; at the high angles of a
              hard turn or a landing flare it dominates. The leading-edge suction that a rounded aerofoil
              would recover as thrust reappears, rotated 90°, as extra normal force on the vortex-covered
              upper surface — hence &quot;suction analogy.&quot;
            </KeyIdea>
            <P>
              This is why every modern fighter carries strakes or leading-edge root extensions (LERX)
              ahead of the main wing: they shed a strong vortex that both adds lift and, sweeping back over
              the wing, keeps its boundary layer energised deep into the stall — an F-16 or F/A-18 is still
              controllable at angles of attack that would have ended a 1950s jet.
            </P>
            <H3>The limits — breakdown and the drag price</H3>
            <P>
              The vortex is not free and not infinitely reliable. Push angle of attack far enough and the
              core abruptly bursts — <T>vortex breakdown</T> — its ordered rotation collapsing into a
              turbulent bubble. Lift falls off gradually (not the sharp let-go of a conventional stall),
              and the burst wake batters anything downstream; F/A-18 tailfins cracked from LERX-vortex
              buffet until the fix. And because a delta has a tiny aspect ratio (Concorde&apos;s was about
              1.7), induced drag at low speed is enormous. Concorde approached nose-high at ~10.5° and 160
              knots with the engines, not the elevons, controlling the glide path — and drooped its nose
              simply because the wing&apos;s physics demanded a deck angle the pilots could not otherwise
              see over.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Polhamus Suction Analogy"
              eq={<>C<sub>L</sub> = K<sub>p</sub>&thinsp;sin&thinsp;α&thinsp;cos²α + K<sub>v</sub>&thinsp;cos&thinsp;α&thinsp;sin²α</>}
              note="The first term is ordinary potential-flow (attached) lift; the second is vortex lift, growing with sin²α — negligible at cruise, dominant at high α. K_p and K_v depend on planform (for a slender delta, K_v ≈ π). The analogy: the leading-edge suction force that a rounded aerofoil would recover as thrust reappears, rotated 90°, as extra normal force on the vortex-covered upper surface."
            />
            <EqCard
              label="The Vortex Mechanism"
              eq={<>sharp LE → fixed separation<br/>→ stable coiled vortex → suction peak</>}
              note="Flow cannot negotiate a sharp, highly swept leading edge; it separates along the entire edge and rolls into a conical vortex that reattaches inboard. The vortex core spins at high velocity — locally very low pressure — painting a strong suction footprint on the upper surface. Unlike a stalled wing's chaotic separation, this structure is stable and strengthens with angle of attack, up to breakdown."
            />
            <EqCard
              label="Vortex Breakdown"
              eq={<>α ≈ 30–40° (slender delta)<br/>→ core bursts → buffet, C<sub>L</sub> loss</>}
              note="Above a critical combination of angle of attack and sweep, the vortex core abruptly expands and loses its ordered rotation — vortex breakdown. Lift collapses gradually (not sharply like a conventional stall) and the burst wake buffets whatever it touches downstream; F/A-18 vertical tails cracked from LERX-vortex breakdown buffet until the fix programme. Breakdown position moving forward with α sets the practical manoeuvre limit."
            />
            <EqCard
              label="The Price — and Concorde's Approach"
              eq={<>C<sub>Di</sub> = <Fr n="C<sub>L</sub>²" d="πeAR"/>&ensp;with AR ≈ 1.7</>}
              note="Vortex lift is expensive: with an aspect ratio of 1.7, induced drag at low speed is enormous, and the lift needed for landing arrives only at high α. Concorde approached at 10.5° pitch and ~160 knots with engines carrying much of the descent — the drag was so high that thrust, not pitch, controlled the glide path. The droop nose existed because the wing's physics demanded a deck angle pilots couldn't see over."
            />
          </div>
        </div>
      </section>

      {/* ── 5 · Compressibility ──────────────────────────────────────── */}
      <section id="compressibility" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>High-Speed Aerodynamics</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Mach, Wave Drag, and Shock Waves.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Below Mach 0.3, air behaves as incompressible. Above it, density changes
            as flow accelerates, the Bernoulli equation breaks down, and new phenomena
            — critical Mach, wave drag, shock waves, choked flow — govern the physics.
          </p>

          <Lecture>
            <P>
              Everything so far quietly assumed air&apos;s density is constant. That assumption is
              excellent below about Mach 0.3 and progressively disastrous above it. Once the flow moves
              fast enough that pressure changes noticeably compress the air, a new variable — density —
              joins the problem, Bernoulli&apos;s incompressible form is retired, and a whole family of
              phenomena absent from low-speed flight takes over.
            </P>
            <H3>Why Mach number, not speed, is the ruler</H3>
            <P>
              The thing that matters is not how fast the aircraft moves but how fast it moves <em>relative
              to the speed of sound</em> — the <T>Mach number</T>. The speed of sound is just the speed at
              which pressure disturbances propagate, and it depends only on temperature; at cruise altitude,
              where the air is −55°C, sound travels far slower than at sea level, so the same true airspeed
              is a higher Mach number up high. That is why airliners are commanded in Mach, not knots, in
              the cruise.
            </P>
            <H3>The critical Mach number and the transonic trap</H3>
            <P>
              Here is the catch that dominated 1940s aircraft design. Long before the aircraft itself
              reaches the speed of sound, the flow accelerating over the top of the wing gets there first.
              The flight Mach number at which some point on the wing first hits M = 1 is the <T>critical
              Mach number</T>. Push a little faster and a pocket of supersonic flow forms on the wing,
              terminated by a <T>shock wave</T> — a near-instantaneous, near-discontinuous jump in
              pressure.
            </P>
            <KeyIdea title="Where wave drag comes from">
              A shock wave is thermodynamically lossy: total pressure falls across it and that lost energy
              is felt as a brand-new kind of drag — <em>wave drag</em> — that simply does not exist below
              the critical Mach. Worse, the shock&apos;s steep adverse pressure gradient can separate the
              boundary layer behind it (&quot;shock stall&quot;), causing buffet and loss of control. The
              speed where wave drag rises steeply, the <em>drag-divergence Mach number</em>, is the real
              ceiling on cruise speed — and pushing it higher is what swept wings, thin supercritical
              aerofoils, and the area rule all exist to do.
            </KeyIdea>
            <P>
              The design responses map one-to-one onto the physics. <T>Sweep</T> hides Mach number from the
              wing (the cosine rule from the wing section). The <T>supercritical aerofoil</T> is flattened
              on top to weaken the shock and delay separation, buying a higher critical Mach. And
              Whitcomb&apos;s <T>area rule</T> tackles the whole aircraft: wave drag depends on how smoothly
              the total cross-sectional area varies along the length, so designers &quot;waist&quot; the
              fuselage where the wing bulges the area — the Coke-bottle shape of early supersonic fighters.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Speed of Sound — ISA"
              eq={<>a = √(γRT)<br/><br/>a<sub>0</sub> = 340.3 m/s at SL</>}
              note="γ = 1.4 (ratio of specific heats for dry air), R = 287 J/kg·K (specific gas constant), T is absolute temperature in Kelvin. At FL350 (−54.3°C, T=218.7 K), a = 296 m/s. Aircraft true airspeed in Mach is always referenced to local a, not sea-level a."
            />
            <EqCard
              label="Mach Number"
              eq={<>M = <Fr n="V" d="a"/></>}
              note="M < 0.3: incompressible; 0.3–0.8: subsonic compressible; 0.8–1.2: transonic (mixed sub/supersonic flow); 1.2–5: supersonic; M > 5: hypersonic. Most airliners cruise at M 0.82–0.86 to stay below the drag-divergence Mach number."
            />
            <EqCard
              label="Prandtl–Glauert Compressibility Correction"
              eq={<>C<sub>L</sub> = <Fr n="C<sub>L,inc</sub>" d="√(1 − M²)"/></>}
              note="Valid for M < 0.7. As Mach approaches 1, the denominator → 0 and C_L theoretically → ∞ — the 'Prandtl-Glauert singularity'. In practice, wave drag and shock formation intervene well before M=1. The Karman–Tsien correction is more accurate for 0.5 < M < 0.8."
            />
            <EqCard
              label="Normal Shock — Downstream Mach (γ = 1.4)"
              eq={<>M<sub>2</sub>² = <Fr n="M<sub>1</sub>² + 5" d="7M<sub>1</sub>² − 1"/></>}
              note="A normal shock stands perpendicular to supersonic flow, instantaneously decelerating it to subsonic. Total pressure is lost across the shock — the stronger the shock (higher M₁), the greater the loss. This is the fundamental mechanism of transonic wave drag and why all supersonic inlets use oblique shock trains rather than a single normal shock."
            />
            <EqCard
              label="Critical Mach Number (rule of thumb)"
              eq={<>M<sub>crit</sub> ≈ 1 − 0.6<span className="text-base">(</span><Fr n="t" d="c"/><span className="text-base">)</span><sup>⅔</sup></>}
              note="The Mach at which flow first reaches M=1 somewhere on the wing surface (typically at the suction peak on the upper surface). Thicker airfoils (high t/c) have lower M_crit and stall transonic earlier. The 737's NACA 0012-series wing (12% t/c) has M_crit ≈ 0.74; the 787's advanced supercritical wing reaches M_crit ≈ 0.87."
            />
            <EqCard
              label="Whitcomb Area Rule"
              eq={<><Fr n="d²A" d="dx²"/> → minimise along body axis</>}
              note="Wave drag depends on the second derivative of the aircraft's cross-sectional area distribution along the flight axis. Distributing the volume smoothly — 'waisting' the fuselage where the wing adds area — minimises wave drag. The F-102's Coke-bottle fuselage was the first operational application; every transonic aircraft since uses it."
            />
          </div>
        </div>
      </section>

      {/* ── 6 · Boundary Layer ───────────────────────────────────────── */}
      <section id="boundary-layer" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Viscous Effects</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Reynolds Number and the Boundary Layer.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Real air is viscous. The thin layer of fluid directly adjacent to the surface
            — the boundary layer — is where all skin-friction drag is generated and
            where stall begins. Its character, laminar or turbulent, determines everything.
          </p>

          <Lecture>
            <P>
              Ideal-flow theory gave us lift and induced drag but predicted, absurdly,{" "}
              <em>zero</em> drag for a body moving through fluid — d&apos;Alembert&apos;s paradox. The
              resolution is that real air has <T>viscosity</T>, and its entire effect is concentrated in
              an astonishingly thin sheet next to the surface: the <T>boundary layer</T>, where the flow
              velocity climbs from zero at the wall to the full freestream value over a distance often
              measured in millimetres. Everything viscous — skin-friction drag, stall, the wake — happens
              inside it.
            </P>
            <H3>Reynolds number — which world are you in?</H3>
            <P>
              The single parameter that governs the boundary layer is the <T>Reynolds number</T>, the
              ratio of inertial to viscous forces. It is not a detail; it decides which physical regime you
              are flying in. An insect wing (Re ~ 1,000) and an airliner wing (Re ~ 40 million) obey the
              same equations but behave like different universes — which is exactly why a scale model in a
              wind tunnel can mislead you unless the Reynolds number is matched.
            </P>
            <H3>Laminar versus turbulent — a genuine trade</H3>
            <P>
              Near the leading edge the boundary layer is usually <T>laminar</T>: smooth, orderly, thin,
              and low-drag. Downstream it <T>transitions</T> to <T>turbulent</T>: thicker, chaotic, and
              generating several times more skin friction. So you would always want laminar flow — except
              for one decisive fact.
            </P>
            <KeyIdea title="Why airliners often want turbulence">
              A turbulent boundary layer is messy and draggy, but its constant churning drags high-energy
              air down to the surface, making it far more <em>resistant to separation</em>. A laminar layer
              is efficient but fragile — it separates readily the moment the pressure starts rising. This
              is the whole game of low-speed aerodynamics: separation is stall, so engineers will happily
              trip the flow turbulent (vortex generators, the dimples on a golf ball) to keep it attached
              through an adverse pressure gradient, trading a little friction drag for a lot of retained
              lift.
            </KeyIdea>
            <P>
              And that is the bridge back to stall. As angle of attack rises, the adverse pressure gradient
              over the rear of the wing steepens; the boundary layer, running out of momentum, reverses
              near the wall and <T>separates</T>. The separation point creeps forward, and when it reaches
              the leading edge the wing stalls. Everything from the gentle stall of a trainer to the razor
              edge of a swept-wing jet is a story about how, and how suddenly, this boundary layer lets go.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard
              label="Reynolds Number"
              eq={<>Re = <Fr n="ρVL" d="μ"/> = <Fr n="VL" d="ν"/></>}
              note="L is the reference length (chord for a wing), μ is dynamic viscosity, ν is kinematic viscosity (ν = μ/ρ). For air at ISA sea level: ν = 1.46 × 10⁻⁵ m²/s. A Boeing 777 wing at cruise has Re ≈ 40 million — fully turbulent. A model aircraft wing might be Re 200,000 — a completely different aerodynamic regime."
            />
            <EqCard
              label="Laminar Boundary Layer Thickness"
              eq={<>δ = <Fr n="5x" d="√Re<sub>x</sub>"/>&ensp;Re<sub>x</sub> &lt; 5×10⁵</>}
              note="The boundary layer grows from zero at the leading edge. In the laminar regime it grows as x^(1/2) — relatively thin. Transition to turbulence typically occurs at Re_x ≈ 500,000, after which the layer thickens dramatically. Laminar flow can be maintained further back by a favorable pressure gradient (flow accelerating along the surface)."
            />
            <EqCard
              label="Turbulent Boundary Layer Thickness"
              eq={<>δ ≈ <Fr n="0.37x" d="Re<sub>x</sub><sup>1/5</sup>"/></>}
              note="The turbulent boundary layer is thicker, more energetic, and much more resistant to separation — but generates ~7× more skin-friction drag than laminar flow. Modern natural laminar flow (NLF) wings (787, A220) maintain laminar flow over 15–20% of the chord, saving 2–4% in drag."
            />
            <EqCard
              label="Skin Friction Drag Coefficients"
              eq={<>C<sub>f,lam</sub> = <Fr n="1.328" d="√Re<sub>L</sub>"/><br/><br/>C<sub>f,turb</sub> = <Fr n="0.074" d="Re<sub>L</sub><sup>1/5</sup>"/></>}
              note="These are plate-averaged values. At Re = 10⁷, C_f,lam ≈ 0.00042 versus C_f,turb ≈ 0.0030 — a factor of 7. Transition location determines which regime dominates; real aircraft have mixed laminar-turbulent flow and use interpolation between the two."
            />
            <EqCard
              label="Separation and Stall"
              eq={<><Fr n="dp" d="dx"/> &gt; 0 → adverse pressure gradient</>}
              note="When the pressure rises along the surface (adverse gradient — flow decelerating), the boundary layer loses momentum. If the adverse gradient is strong enough, the near-wall flow reverses and the boundary layer separates. Separation moves forward as angle of attack increases; when it reaches the leading edge, lift collapses — the stall."
            />
            <EqCard
              label="Turbulent Reattachment"
              eq={<>Re<sub>bubble</sub>&ensp;→&ensp;turbulent&ensp;Re-attach</>}
              note="A separated laminar boundary layer can form a short 'laminar separation bubble', transition to turbulence within the bubble, and reattach as a turbulent boundary layer that can withstand a stronger adverse gradient. NACA 6-series airfoils exploit this. At low Reynolds numbers (model aircraft, insects), bubble behaviour dominates performance."
            />
          </div>
        </div>
      </section>

      {/* ── 7 · Stability ────────────────────────────────────────────── */}
      <section id="stability" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Static and Dynamic Stability</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Static Margin, Neutral Point, and Modes.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Stability is the tendency of an aircraft to return to equilibrium after a
            disturbance. Static stability is a necessary but not sufficient condition for
            flying qualities. Dynamic stability — the time history of the return — is
            what pilots actually experience.
          </p>

          <Lecture>
            <P>
              A well-behaved aircraft, nudged by a gust, tends to return to where it was. That tendency is{" "}
              <T>stability</T>, and it is worth separating into two questions. First: does the aircraft{" "}
              <em>initially</em> try to return (static stability)? Second: what does the return actually
              look like over time — a smooth settle, a slow wallow, or a growing oscillation (dynamic
              stability)? An aircraft can pass the first test and fail the second.
            </P>
            <H3>Static stability and the neutral point</H3>
            <P>
              Longitudinal (pitch) static stability comes down to the relative position of two points. The{" "}
              <T>centre of gravity</T> (CG) is where weight acts; the <T>neutral point</T> (NP) is the
              effective point about which the aerodynamic pitching moment doesn&apos;t change with angle of
              attack. If the CG sits <em>ahead</em> of the NP, a gust that pitches the nose up generates a
              restoring nose-down moment — stable. The distance between them, divided by the mean chord, is
              the <T>static margin</T>, and it is the single number that quantifies how stable the aircraft
              is in pitch.
            </P>
            <KeyIdea title="Stability trades against control — and fighters cheat">
              More static margin means a more docile, self-correcting aircraft — and heavier control forces,
              more trim drag, and sluggish manoeuvring. That is fine for an airliner. A fighter wants the
              opposite: designers move the CG <em>aft</em>, to or past the neutral point, making the
              airframe neutrally or even <em>negatively</em> stable so it pitches eagerly. Such an aircraft
              is uncontrollable by a human alone; a fly-by-wire computer makes tiny corrections dozens of
              times a second to hold it steady. Relaxed static stability is a deliberate, computer-enabled
              design choice, not an accident.
            </KeyIdea>
            <H3>The dynamic modes</H3>
            <P>
              Being statically stable only guarantees the aircraft <em>starts</em> back toward equilibrium;
              the motion that follows has characteristic patterns, called <T>modes</T>. In pitch there are
              two: the fast, well-damped <T>short-period</T> (a one-to-few-second bob at nearly constant
              speed) and the slow, lightly damped <T>phugoid</T> (a 30–60 second trade of altitude for
              speed at nearly constant angle of attack). Laterally, the notorious one is <T>Dutch roll</T> —
              a coupled yaw-and-roll waltz that swept wings make worse, tamed on every jet by a yaw damper
              making hundreds of automatic rudder corrections a minute — alongside a slow <T>spiral</T> mode
              in bank. Pilots feel and correct the slow modes instinctively; the flight-control system
              quietly manages the rest.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Static Margin"
              eq={<>SM = <Fr n="x<sub>NP</sub> − x<sub>CG</sub>" d="c̄"/></>}
              note="The neutral point (NP) is the point about which pitching moment is independent of angle of attack. CG ahead of NP (SM > 0) gives static longitudinal stability — a pitch-up disturbance produces a restoring nose-down moment. Typical SM: airliners 5–15%; fighters 5% to −5% (relaxed/unstable). SM can be varied in flight by transferring fuel between trim tanks (A380, Concorde)."
            />
            <EqCard
              label="Pitching Moment Coefficient"
              eq={<>C<sub>M</sub> = C<sub>M,ac</sub> + C<sub>L</sub><Fr n="x<sub>CG</sub> − x<sub>AC</sub>" d="c̄"/></>}
              note="The aerodynamic centre (AC) — where pitching moment is nominally constant — is near the quarter-chord for thin airfoils at subsonic speeds, shifting rearward past the half-chord at supersonic speeds (Concorde's trim problem). The slope dC_M/dC_L = −SM; a statically stable aircraft has a negative slope."
            />
            <EqCard
              label="Phugoid Oscillation Period"
              eq={<>T<sub>ph</sub> ≈ π√2 · <Fr n="V" d="g"/></>}
              note="The phugoid is the long-period (20–60 second) oscillation in which the aircraft exchanges kinetic and potential energy while angle of attack remains nearly constant. Lightly damped in most aircraft — pilots trim it out. At 250 kts, T_ph ≈ 58 seconds. The autopilot's pitch-hold mode suppresses it entirely."
            />
            <EqCard
              label="Short-Period Oscillation"
              eq={<>ω<sub>sp</sub> ≈ √(<Fr n="M<sub>α</sub>" d="I<sub>y</sub>"/>)</>}
              note="The short-period mode is a rapid (1–5 second) pitch oscillation about the CG at nearly constant speed, driven by the pitching moment derivative M_α. Well-damped in conventional aircraft; the pilot's pitch input excites it. Iy is the pitch moment of inertia. Fly-by-wire computers modulate it to match desired handling qualities regardless of CG position."
            />
            <EqCard
              label="Dutch Roll — Lateral-Directional Mode"
              eq={<>coupled yaw (ψ) + roll (φ) oscillation</>}
              note="Dutch roll couples yaw and roll through dihedral and sweep effects. Swept wings exacerbate it because they have strong dihedral effect but weak directional stability. The 747's yaw damper makes 250+ automatic corrections per second to suppress Dutch roll that would be uncomfortable and eventually dangerous without it."
            />
            <EqCard
              label="Spiral Mode"
              eq={<>slow&ensp;divergence&ensp;if&ensp;C<sub>lβ</sub>&thinsp;/&thinsp;C<sub>nβ</sub> &lt; 1</>}
              note="The spiral mode is an extremely slow convergence or divergence in bank. A slightly unstable spiral mode (most airliners) diverges on a timescale of minutes — pilots correct it instinctively. A strongly unstable spiral mode (some fighters) diverges in seconds and must be suppressed by the flight control computer."
            />
          </div>
        </div>
      </section>

      {/* ── 8 · Performance ──────────────────────────────────────────── */}
      <section id="performance" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Flight Performance</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Range, Turning, and Specific Excess Power.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Performance equations translate aerodynamic efficiency into operational reality —
            how far can it fly, how hard can it turn, how fast can it climb? The Breguet
            range equation and the specific excess power concept are the two most important
            tools in aircraft performance engineering.
          </p>

          <Lecture>
            <P>
              The final step is to cash all of this physics out into the numbers an operator actually buys:
              how far, how hard, how high. Two ideas do most of the work — one for the airliner&apos;s
              question (range) and one for the fighter&apos;s (energy) — and both are just the four forces
              rearranged.
            </P>
            <H3>Range — the Breguet equation</H3>
            <P>
              For a jet, the <T>Breguet range equation</T> multiplies three things you now recognise: how
              fast you go, how efficiently the engine turns fuel into thrust (specific fuel consumption),
              and the aerodynamic efficiency <span className="font-mono text-white">L/D</span> — all scaled
              by the logarithm of how much of the takeoff weight was fuel. The lesson is that range is not
              won by any single trick but by pushing all three levers at once, which is exactly what a
              modern airliner does: fast cruise, an <span className="font-mono text-white">L/D</span> around
              20, and an efficient high-bypass turbofan.
            </P>
            <KeyIdea title="Specific excess power — the fighter's currency">
              Remember the opening idea, that climb and acceleration both spend excess thrust. Formalise it
              and you get <T>specific excess power</T>,{" "}
              <span className="font-mono text-white">P<sub>s</sub> = (T − D)V / W</span> — the rate at which
              an aircraft can add <em>total</em> energy, altitude and speed together. It is the master
              variable of air combat: whoever has positive P<sub>s</sub> at the merge can climb,
              accelerate, or turn while the other cannot, dictating the fight. Where P<sub>s</sub> falls to
              zero, the aircraft has reached its ceiling for that speed.
            </KeyIdea>
            <H3>Turning — the cost of pulling g</H3>
            <P>
              Turning is just pointing part of the lift sideways, which means making <em>more</em> total
              lift: a 60°-banked level turn needs a <T>load factor</T> of 2 (2g). More lift means more
              induced drag, so hard turns bleed energy fast — a sustained turn is limited by how much drag
              the engine can overcome. Two limits bracket every turn: the wing&apos;s{" "}
              <span className="font-mono text-white">C<sub>L,max</sub></span> (you can&apos;t pull harder
              than the wing will lift) and the structure&apos;s g-limit (you can&apos;t pull harder than the
              airframe survives). They meet at the <T>corner speed</T> — the sweet spot where the aircraft
              turns its tightest and fastest, and the speed every fighter pilot fights to be at.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Breguet Range Equation — Jet"
              eq={<>R = <Fr n="V" d="TSFC"/> · <Fr n="L" d="D"/> · ln<Fr n="W<sub>0</sub>" d="W<sub>1</sub>"/></>}
              note="V is cruise true airspeed, TSFC is thrust specific fuel consumption (typically 0.55–0.65 lb/lbf·hr for modern turbofans), L/D is lift-to-drag ratio, and W₀/W₁ is the fuel fraction (initial over final weight). The Boeing 787 achieves range advantage by maximising all three simultaneously: high V (M 0.85), high L/D (~20 at cruise), and low TSFC (GEnx at 0.512)."
            />
            <EqCard
              label="Specific Excess Power"
              eq={<>P<sub>s</sub> = <Fr n="(T − D)V" d="W"/> = <Fr n="dh" d="dt"/> + <Fr n="V" d="g"/>·<Fr n="dV" d="dt"/></>}
              note="P_s is the rate at which an aircraft can increase its total energy state (altitude + kinetic). It equals the excess thrust times velocity divided by weight. P_s = 0 defines the aircraft's ceiling at a given speed. A fighter with P_s > 0 at the merge can unilaterally dictate the energy environment of a dogfight."
            />
            <EqCard
              label="Load Factor and Turn"
              eq={<>n = <Fr n="L" d="W"/> = <Fr n="1" d="cos φ"/><br/><br/>r = <Fr n="V²" d={<>g√(n²−1)</>}/></>}
              note="n is the load factor (g loading); φ is the bank angle. A 60° banked level turn requires n=2 (2g). Turn radius r decreases with lower speed or higher n. The minimum turn radius — the tightest possible turn — occurs at the corner speed V*, the intersection of the structural limit and the aerodynamic maximum C_L."
            />
            <EqCard
              label="Turn Rate"
              eq={<>ω = <Fr n={<>g√(n²−1)</>} d="V"/>&ensp;[rad/s]</>}
              note="Maximum instantaneous turn rate occurs at corner speed V* at maximum structural n. Maximum sustained turn rate — limited by available thrust matching drag at elevated n — is the operationally critical quantity. An F-16 Block 50 sustains 9g and 26°/s at corner speed; a commercial airliner is certified to 2.5g and turns at ~3°/s."
            />
            <EqCard
              label="Corner Speed"
              eq={<>V* = <Fr n={<>√(2nW)</>} d={<>√(ρSC<sub>L,max</sub>)</>}/></>}
              note="The speed at which both the aerodynamic maximum g (C_L,max) and the structural limit load factor are simultaneously available. Below V*, the aircraft is aerodynamically limited — it can achieve n_max structurally but not aerodynamically. Above V*, it is structurally limited. Maximum instantaneous turn rate always occurs at V*."
            />
            <EqCard
              label="Rate of Climb — Service Ceiling"
              eq={<>RC = P<sub>s</sub> = 0&ensp;→&ensp;absolute ceiling<br/><br/>RC = 100 ft/min → service ceiling</>}
              note="At the absolute ceiling, all available thrust is consumed by drag — P_s = 0 and no further climb is possible. The service ceiling (RC = 100 ft/min for transport, 500 ft/min for military) is the practically useful upper limit. The 747-8 service ceiling is 43,100 ft; the SR-71 absolute ceiling exceeded 85,000 ft, above which aerodynamic lift became insufficient regardless of engine power."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Key variables",   items: ["ρ — air density", "V — true airspeed", "S — wing reference area", "b — wingspan", "c̄ — mean aerodynamic chord"] },
              { label: "Coefficients",    items: ["C_L — lift coefficient", "C_D — drag coefficient", "C_M — pitching moment", "C_p — pressure coefficient", "e — Oswald efficiency"] },
              { label: "Dimensionless",   items: ["M — Mach number", "Re — Reynolds number", "AR — aspect ratio", "SM — static margin", "n — load factor"] },
              { label: "Greek",           items: ["α — angle of attack", "γ — flight path angle", "ρ — density", "μ — dynamic viscosity", "Γ — circulation"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-cyan-400/60">{col.label}</p>
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
                { href: "/gas-dynamics", label: "Gas Dynamics", sub: "shocks, nozzles, choked flow", accent: "#fb923c" },
                { href: "/thermodynamics#propulsion", label: "Propulsion", sub: "turning L/D into range", accent: "#34d399" },
                { href: "/fighters", label: "Fighter Jets", sub: "turn rate & Ps in practice", accent: "#ef4444" },
              ]}
            />
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">
              AVIA · Aviation Encyclopedia · Aerodynamics Reference
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
