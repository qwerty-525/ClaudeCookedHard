"use client"
import { ReactNode, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Typewriter } from "@/components/ui/typewriter"
import TheoryToc from "@/components/TheoryToc"
import ChipLinks from "@/components/ChipLinks"

const TOC = [
  { id: "stack", label: "The Stack" },
  { id: "structure", label: "Structure" },
  { id: "controls", label: "Flight Controls" },
  { id: "fbw", label: "Fly-By-Wire" },
  { id: "hydraulics", label: "Hydraulics" },
  { id: "electrical", label: "Electrical" },
  { id: "fuel", label: "Fuel" },
  { id: "bleed", label: "Bleed Air" },
  { id: "pressurization", label: "Pressurization" },
  { id: "avionics", label: "Avionics" },
  { id: "gear", label: "Landing Gear" },
  { id: "protection", label: "Ice & Fire" },
  { id: "redundancy", label: "Certification" },
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
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-rose-400/60">{label}</p>
      <div className="font-mono text-lg leading-relaxed text-white md:text-xl">{eq}</div>
      {note && <p className="mt-4 text-sm leading-relaxed text-[#94a3b8]">{note}</p>}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-rose-400/70">{children}</p>
  )
}

// ── Lecture-prose helpers ──────────────────────────────────────────────────

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.85] text-[#b6c2d4]">{children}</p>
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 text-lg font-semibold tracking-tight text-white md:text-xl">{children}</h3>
  )
}

function T({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-white">{children}</strong>
}

function KeyIdea({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="my-2 rounded-r-xl border-l-2 border-rose-400/50 bg-rose-400/[0.04] px-5 py-4">
      {title && (
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-rose-400/70">{title}</p>
      )}
      <p className="text-[15px] leading-[1.8] text-[#c4d0e0]">{children}</p>
    </div>
  )
}

function Lecture({ children }: { children: ReactNode }) {
  return <div className="mb-16 max-w-3xl space-y-5">{children}</div>
}

function FormulaSheet({ children }: { children?: ReactNode }) {
  return (
    <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-white/30">
      {children ?? "The numbers"}
    </p>
  )
}

// ── Hero SVG: top-down planform with system routing ────────────────────────
// Colour code follows the Airbus convention: green / blue / yellow hydraulics,
// rose for the FBW data bus.

const FUSELAGE = "M 90,260 C 104,236 150,228 210,228 L 730,228 C 800,228 852,242 880,260 C 852,278 800,292 730,292 L 210,292 C 150,292 104,284 90,260 Z"
const WING_UP   = "M 385,230 L 560,62  L 616,62  L 495,230 Z"
const WING_DN   = "M 385,290 L 560,458 L 616,458 L 495,290 Z"
const STAB_UP   = "M 775,232 L 845,168 L 880,168 L 838,232 Z"
const STAB_DN   = "M 775,288 L 845,352 L 880,352 L 838,288 Z"

const SYS_LINES = [
  // Green hydraulic: E/E bay → upper wing trailing edge
  { d: "M 205,252 L 420,252 L 452,230 L 575,110", color: "#34d399", spd: 2.2 },
  // Yellow hydraulic: E/E bay → lower wing trailing edge
  { d: "M 205,268 L 420,268 L 452,290 L 575,410", color: "#f59e0b", spd: 2.5 },
  // Blue hydraulic: full run to the tail surfaces
  { d: "M 205,260 L 855,260", color: "#3b82f6", spd: 3.0 },
  // FBW data bus: flight deck → computers → everywhere
  { d: "M 130,244 L 420,244 L 700,244 L 820,244", color: "#f472b6", spd: 1.6 },
]

const ACTUATOR_DOTS = [
  { x: 575, y: 110 }, { x: 575, y: 410 },
  { x: 855, y: 260 }, { x: 845, y: 200 }, { x: 845, y: 320 },
]

// ── Page ──────────────────────────────────────────────────────────────────

export default function SystemsPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const titleY       = useTransform(heroProgress, [0, 1], [0, -90])
  const titleOpacity = useTransform(heroProgress, [0, 0.65], [1, 0])

  return (
    <main className="bg-[#04060a]">
      <TheoryToc sections={TOC} accent="#f472b6" />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, #23000f 0%, #04060a 68%)" }}
        />

        {/* Planform + system routing SVG */}
        <svg
          viewBox="0 0 960 520"
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full opacity-70"
          aria-hidden
        >
          {/* Airframe */}
          {[WING_UP, WING_DN, STAB_UP, STAB_DN].map((d, i) => (
            <path key={i} d={d} fill="rgba(244,114,182,0.04)" stroke="rgba(244,114,182,0.30)" strokeWidth="1.2" />
          ))}
          <path d={FUSELAGE} fill="rgba(244,114,182,0.05)" stroke="rgba(244,114,182,0.40)" strokeWidth="1.5" />

          {/* System routing lines */}
          {SYS_LINES.map((s, i) => (
            <path key={`s${i}`} d={s.d} fill="none"
              stroke={s.color} strokeOpacity="0.5" strokeWidth="1.2"
              strokeDasharray="14 8"
              className="animate-flow"
              style={{ animationDuration: `${s.spd}s`, animationDelay: `${i * 0.2}s` }}
            />
          ))}

          {/* Source & actuator nodes */}
          <circle cx="205" cy="260" r="4" fill="rgba(255,255,255,0.6)" />
          <circle cx="130" cy="244" r="3" fill="rgba(244,114,182,0.8)" />
          {ACTUATOR_DOTS.map((p, i) => (
            <circle key={`a${i}`} cx={p.x} cy={p.y} r="2.5" fill="rgba(255,255,255,0.45)" />
          ))}

          {/* Labels */}
          <text x="205" y="315" textAnchor="middle" fill="rgba(255,255,255,0.40)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">E/E BAY</text>
          <text x="130" y="230" textAnchor="middle" fill="rgba(244,114,182,0.65)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">FBW BUS</text>
          <text x="510" y="96" fill="rgba(52,211,153,0.65)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">GREEN HYD · 3000 PSI</text>
          <text x="510" y="432" fill="rgba(245,158,11,0.60)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">YELLOW HYD · 3000 PSI</text>
          <text x="690" y="278" fill="rgba(59,130,246,0.65)"
            fontSize="9" fontFamily="monospace" letterSpacing="2">BLUE HYD</text>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48
          bg-gradient-to-t from-[#04060a] to-transparent" />

        {/* Hero text */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 px-8 text-center"
        >
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.45em] text-rose-400">
            Aviation Encyclopedia
          </p>
          <h1 className="mb-6 text-6xl font-bold leading-none tracking-tight md:text-8xl">
            Aircraft
            <br />
            <span className="text-[#94a3b8]">Systems</span>
          </h1>
          <p className="mx-auto max-w-md font-mono text-[#94a3b8]">
            <Typewriter
              words={[
                "Everything between the stick and the surface.",
                "Hydraulics, electrics, and the buses between.",
                "The layers beneath the skin.",
                "How a million parts become one machine.",
                "From control law to control surface.",
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

      {/* ── 1 · The Stack ────────────────────────────────────────────── */}
      <section id="stack" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px
          bg-gradient-to-r from-transparent via-rose-400/20 to-transparent" />
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Foundation</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">The Layer Stack.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            An aircraft is not a wing with an engine. It is roughly a dozen interlocking
            systems, each of which would be a respectable machine on its own. This page is
            the map: if you were building an aeroplane from scratch, these are the layers
            you would have to build, in roughly the order you would have to build them.
          </p>

          <Lecture>
            <P>
              Start with the thought experiment in the title. You want to build a flying machine
              from nothing. The aerodynamics notes tell you how to shape it and the propulsion
              notes tell you how to push it — but shape and thrust give you a projectile, not an
              aircraft. To make it <T>functionable</T> — controllable, survivable, repeatable —
              you have to add layer after layer, and each layer creates the need for the next.
            </P>
            <P>
              Layer one is <T>structure</T>: a frame that carries flight loads and, once you fly
              high, doubles as a pressure vessel. Layer two is <T>control</T>: hinged surfaces and
              some way to move them. But on anything larger than a light aircraft the air pushes
              back on those surfaces harder than a human can, so layer three is <T>muscle</T> —
              hydraulic and electrical power generated from the engines and distributed through
              the airframe like a grid. Muscle needs a brain, so layer four is <T>sensing and
              computing</T>: air data, inertial reference, flight computers. The people inside
              need to survive 11 km of altitude, so layer five is <T>life support</T> —
              pressurization and air conditioning. And because every one of those layers can
              fail, the final layer is not hardware at all: it is <T>redundancy and certification
              philosophy</T>, the discipline that decides how many of everything you carry.
            </P>
            <KeyIdea title="The three power systems">
              Almost everything on this page reduces to one question: <em>how do you move energy
              from the engines to the far corners of the airframe?</em> Aviation settled on three
              currencies — <em>hydraulic</em> (dense, stiff, ideal for brute-force actuation),{" "}
              <em>electrical</em> (flexible, ideal for computing and small motors), and{" "}
              <em>pneumatic</em> (hot compressed air bled from the engines, ideal for heating and
              pressurizing). Every system that follows is a producer, a distributor, or a consumer
              of one of these three. The modern trend — the 787 most aggressively — is to collapse
              all three into one: electricity.
            </KeyIdea>
            <P>
              The industry even has an A-to-Z index for all of this. Every manual, part, and
              maintenance task on a transport aircraft is filed under an <T>ATA chapter</T> — a
              numbering system from 1956 that is still universal. Flight controls are ATA 27 on a
              Cessna and ATA 27 on an A380. Learn the chapter numbers and you can navigate the
              documentation of any aircraft ever built.
            </P>
          </Lecture>

          <FormulaSheet>The map</FormulaSheet>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <EqCard
              label="The Power Trinity"
              eq={<>HYD · ELEC · PNEU</>}
              note="Hydraulic: 3,000–5,000 psi fluid for flight controls, gear, brakes. Electrical: 115 V AC / 28 V DC for avionics, pumps, lighting. Pneumatic: ~200 °C bleed air for pressurization, anti-ice, engine start. Three grids, all fed by the engines, all with independent backups."
            />
            <EqCard
              label="ATA Chapters — the industry's index"
              eq={<>21 24 27 28 29 32 34 36</>}
              note="Air conditioning (21), electrical power (24), flight controls (27), fuel (28), hydraulic power (29), landing gear (32), navigation (34), pneumatic (36). This page walks the list. The numbering is identical on every transport aircraft in the world — a mechanic's mental filesystem since 1956."
            />
            <EqCard
              label="The Dependency Chain"
              eq={<>engines → power → control → life</>}
              note="The engines generate all onboard power; hydraulics and electrics distribute it; flight controls and avionics consume it; pressurization keeps the humans alive to command it. Certification then asks of every link: what happens when this fails? The answer to that question is half the parts count of the aircraft."
            />
          </div>
        </div>
      </section>

      {/* ── 2 · Structure ────────────────────────────────────────────── */}
      <section id="structure" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Airframe</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Structure — the Load Path.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Before anything can fly, something must carry the loads: lift bending the wings up,
            400 tonnes hanging from the wing box, and — every flight — the fuselage inflating
            like a balloon to 60 kPa above the outside world.
          </p>

          <Lecture>
            <P>
              Nearly every metal airliner is a <T>semi-monocoque</T>: a thin skin stiffened by
              frames (hoops) and stringers (lengthwise stiffeners), so the skin itself carries
              much of the load rather than riding on an internal skeleton. The wing is built
              around a <T>wing box</T> — front and rear spars joined by the skin into a closed
              torsion box that is simultaneously the main lifting structure and the fuel tank.
              The single most loaded piece of the aircraft is the <T>centre wing box</T> under
              the cabin floor, where the bending moment of both wings meets the weight of the
              entire fuselage.
            </P>
            <H3>How strong is strong enough?</H3>
            <P>
              Certification defines a <T>limit load</T> — the worst load expected once in service,
              +2.5g to −1.0g for a transport — which the structure must carry with no permanent
              deformation, and an <T>ultimate load</T> of 1.5× limit, which it must survive for
              three seconds without collapse. That factor of 1.5 is aviation&apos;s entire margin
              of safety, which is why wings in the certification rig are bent until they shatter —
              the 777 wing famously failed at 154% of limit load, almost exactly on target. More
              margin would simply be weight.
            </P>
            <KeyIdea title="Fatigue — the lesson bought with the Comet">
              Metal fails below its static strength if you load and unload it enough times, and a
              pressurized fuselage is loaded and unloaded <em>every single flight</em>. The de
              Havilland Comets that broke up in 1954 taught the industry that cracks grow from
              stress concentrations (theirs started near sharp-cornered cutouts) cycle by cycle.
              The modern answer is <em>damage tolerance</em>: assume cracks exist, design the
              structure so a crack grows slowly and gets caught by scheduled inspection before it
              becomes critical, and prove crack-growth rates by test. Airframes are certified in
              flight <em>cycles</em>, not years, for exactly this reason.
            </KeyIdea>
            <P>
              Materials follow the loads. Classic airframes pair <T>2024 aluminium</T> (damage
              tolerant — fuselage skins) with <T>7075</T> (strong — upper wing skins in
              compression). The 787 and A350 switched to roughly 50% <T>carbon-fibre composite</T>
              by weight: CFRP barely fatigues and never corrodes, which is precisely what a
              pressure vessel wants — and it is why those two aircraft can afford a more
              comfortable cabin pressure and humidity than any metal jet.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Design Loads"
              eq={<>n<sub>limit</sub> = +2.5g / −1.0g<br/>ultimate = 1.5 × limit</>}
              note="Limit load: no permanent deformation. Ultimate load: carried for 3 s without failure. The 1.5 safety factor has been essentially unchanged since the 1940s. Fighters certify to +9g; aerobatic aircraft to ±10g or more."
            />
            <EqCard
              label="Pressure Vessel — Hoop Stress"
              eq={<>σ<sub>hoop</sub> = <Fr n="p·r" d="t"/></>}
              note="Cabin differential pressure p acting on fuselage radius r is carried by skin thickness t. Hoop stress is twice the longitudinal stress — which is why fatigue cracks in a fuselage tend to run lengthwise, and why every window and door cutout needs heavy reinforcement to carry the stress around the hole."
            />
            <EqCard
              label="Fatigue Life"
              eq={<>certified in cycles, not hours<br/>≈ 60,000–100,000 flights</>}
              note="One flight = one pressurization cycle = one fatigue cycle on the fuselage plus one ground-air-ground bending cycle on the wing. Short-haul airframes age faster than long-haul ones at the same flight hours. Full-scale fatigue test articles are cycled to 2–3 lifetimes on the ground before the fleet gets there."
            />
            <EqCard
              label="Materials Split"
              eq={<>787 / A350 ≈ 50% CFRP<br/>737 / A320 ≈ 60% aluminium</>}
              note="CFRP is stiffer and lighter per unit strength, doesn't corrode, and barely fatigues — but it hides impact damage internally and conducts lightning poorly (copper mesh is embedded in the skin). Aluminium is cheap, inspectable, and repairable anywhere on Earth. Both philosophies currently coexist."
            />
          </div>
        </div>
      </section>

      {/* ── 3 · Flight Controls ──────────────────────────────────────── */}
      <section id="controls" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 27</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Flight Controls — Moving the Surfaces.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The aerodynamics notes explain what a control surface does to the flow. This is the
            other half: the mechanical chain that connects a pilot&apos;s hand to a slab of
            aluminium fighting a 500 km/h airstream.
          </p>

          <Lecture>
            <P>
              The <T>primary controls</T> command the three rotation axes: <T>ailerons</T> roll,
              the <T>elevator</T> pitches, the <T>rudder</T> yaws. The <T>secondary controls</T>{" "}
              reshape the aircraft: flaps and slats for high lift (covered in the aerodynamics
              notes), <T>spoilers</T>, and <T>trim</T>. Spoilers are the great multitaskers of the
              wing — raised asymmetrically they assist roll, raised together in flight they are
              speedbrakes, and slammed fully up at touchdown they dump the wing&apos;s lift so the
              full weight lands on the wheels and the brakes can actually work.
            </P>
            <H3>From cables to actuators</H3>
            <P>
              A light aircraft uses <T>reversible</T> controls — cables and pushrods — where the
              pilot literally holds the surface against the air, feeling every gust. Scale up and
              the aerodynamic <T>hinge moment</T>, which grows with dynamic pressure and the cube
              of size, overwhelms human muscle. Big aircraft therefore use <T>irreversible</T>{" "}
              controls: the pilot moves a valve, and a hydraulic actuator moves the surface with
              tonnes of force. Nothing flows back — which creates a strange problem. The pilot now
              feels <em>nothing</em>, and a pilot who cannot feel airspeed in the stick will
              over-stress the airframe at speed. So engineers build <T>artificial feel</T>:
              springs and q-pots that fake the missing forces, loading the column artificially
              harder as dynamic pressure rises.
            </P>
            <KeyIdea title="Trim — flying with the ballpoint, not the fist">
              An aircraft in cruise must hold a pitch attitude for hours. Instead of the pilot (or
              autopilot) holding a constant elevator force, the whole <em>horizontal stabiliser</em>
              slowly rotates — the trimmable horizontal stabiliser, THS — until the residual force
              is zero. The elevator handles fast, fine control; the THS handles slow, powerful
              re-centring. This division — a small fast surface riding on a big slow one — is why
              a runaway trim motor is a serious emergency: the big slow surface always wins.
            </KeyIdea>
            <P>
              One more scaling trick: on surfaces too big even for early hydraulics, a small{" "}
              <T>servo tab</T> on the trailing edge of the surface is moved by the pilot, and the
              tab&apos;s aerodynamic force flies the main surface into position — the air itself
              is the actuator. The 707 still landed this way. Modern jets have abandoned tabs for
              full hydraulic actuation, with two or three actuators per surface fed from different
              hydraulic systems, so no single failure ever freezes a primary control.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Hinge Moment — why muscles gave out"
              eq={<>H = C<sub>h</sub>·½ρV²·S<sub>c</sub>·c<sub>c</sub></>}
              note="Control force scales with dynamic pressure times surface area times chord — roughly the cube of aircraft size at fixed speed. A 737 elevator at V_MO would need hundreds of kilograms of pull. Above roughly 50 tonnes, fully powered irreversible controls are the only option."
            />
            <EqCard
              label="The Spoiler's Three Jobs"
              eq={<>roll assist · speedbrake · lift dump</>}
              note="Asymmetric: augments ailerons, especially at low speed. Symmetric in flight: drag without configuration change. Full extension on touchdown (armed ground spoilers): kills ~80% of lift instantly, planting the gear so wheel brakes get grip. Landing distance calculations assume they deploy — a spoiler failure lengthens the landing roll dramatically."
            />
            <EqCard
              label="Reversible vs Irreversible"
              eq={<>cables → boost → full power + feel</>}
              note="Reversible (Cessna → DC-3): pilot force = surface force, natural feel. Boosted (early jets): hydraulics multiply pilot force. Irreversible (every modern jet): pilot commands a valve; artificial feel units fake the force gradient, stiffening with dynamic pressure so the aircraft 'feels' the same at 250 kt as at 150 kt."
            />
            <EqCard
              label="Actuation Redundancy"
              eq={<>2–3 actuators / surface<br/>≥ 2 hydraulic sources each</>}
              note="Each elevator half on a 747 is driven by multiple actuators fed from different hydraulic systems. Rudders get two or three. The design rule: no single hydraulic failure, actuator jam, or line burst may take away control of an axis. Surface position feedback closes the loop back to the flight computers."
            />
          </div>
        </div>
      </section>

      {/* ── 4 · Fly-By-Wire ──────────────────────────────────────────── */}
      <section id="fbw" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Flight Control Computers</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Fly-By-Wire — Handling as Software.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Cut the last mechanical link. The stick becomes a sensor, the surface follows a
            computer, and everything in between — feel, stability, protection — becomes a
            control law you can design.
          </p>

          <Lecture>
            <P>
              In a <T>fly-by-wire</T> aircraft the sidestick or column produces only an electrical
              signal. Flight control computers read it, blend it with hundreds of sensor inputs —
              air data, inertial rates, accelerations, configuration — compute what the surfaces
              should do, and command the actuators over data buses. The A320 (1988) was the first
              airliner to fly this way; every Airbus since, the 777, the 787, and every modern
              fighter followed. The wire replaced the cable for three reasons: weight (copper is
              lighter than cables, pulleys and bellcranks), maintenance, and — most importantly —
              because a computer in the loop can <em>reshape the aircraft&apos;s behaviour</em>.
            </P>
            <H3>Control laws — what the stick actually commands</H3>
            <P>
              In an Airbus in <T>normal law</T>, the sidestick does not command elevator position.
              Pitch input commands a blend of <T>load factor</T> and pitch rate (the C* law); roll
              input commands roll <em>rate</em>. Release the stick and the computers hold 1g and
              the current bank — the aircraft is effectively auto-trimmed at all times. On top of
              this sits <T>envelope protection</T>: hard limits at maximum angle of attack, +2.5g
              to −1g, 67° bank, and overspeed. Pull full aft in an A320 at low speed and you get
              exactly maximum-lift alpha — no more, no stall. Boeing&apos;s 777/787 FBW makes the
              opposite philosophical choice: the same computed smoothness, but protections are{" "}
              <em>soft</em> — the aircraft resists leaving the envelope with heavy artificial
              forces, yet a determined pilot can always override. Neither philosophy has proven
              statistically superior; both are certified; the argument continues in every crew
              room on Earth.
            </P>
            <KeyIdea title="Why fighters need FBW to exist at all">
              The aerodynamics notes cover relaxed static stability: an F-16 is deliberately built
              unstable, its natural response to any disturbance being divergence in under a second
              — far faster than human reflexes. FBW is what makes such an aircraft flyable: the
              computers restabilise it 40–80 times per second, and the pilot flies the
              <em> computed</em> aircraft, which behaves beautifully. Instability buys agility;
              software buys back safety. No FBW, no modern fighter.
            </KeyIdea>
            <H3>Trusting the computer — the redundancy problem</H3>
            <P>
              If computers fly the aircraft, computer failure must be survivable — and so must
              computer <em>bugs</em>. The A320 carries multiple flight control computers split
              into two groups (ELAC and SEC) built by <T>different manufacturers, on different
              processors, running software written by separate teams</T> to different halves of
              the spec — so no single design error can take them all down. Degradation is
              graceful: lose enough sensors or computers and the aircraft steps down from normal
              law to <T>alternate law</T> (protections lost) to <T>direct law</T> (stick maps
              directly to surfaces — an ordinary aeroplane again). Beneath it all, most FBW
              airliners keep one last mechanical path — on the A320, THS trim and the rudder —
              enough to keep wings level while computers are restarted.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="C* Pitch Law"
              eq={<>C* = n<sub>z</sub> + <Fr n="V<sub>co</sub>" d="g"/>·q</>}
              note="The blended quantity the sidestick commands: load factor n_z dominating at high speed, pitch rate q dominating at low speed, crossing over near V_co ≈ 120 kt. This single law makes a 70-tonne jet feel identical on approach and in cruise — handling qualities as a design variable rather than an aerodynamic accident."
            />
            <EqCard
              label="Airbus Normal Law Protections"
              eq={<>α ≤ α<sub>max</sub> · n = −1…+2.5g<br/>bank ≤ 67° · V ≤ V<sub>MO</sub>+</>}
              note="Hard envelope limits: full aft stick delivers α_max (maximum lift, no stall), pitch is g-limited, bank beyond 33° needs held stick, overspeed commands nose-up. In windshear or terrain escape the pilot can pull full aft and get maximum aircraft performance without stalling — the design case that justified hard protection."
            />
            <EqCard
              label="Dissimilar Redundancy (A320)"
              eq={<>2× ELAC + 3× SEC + 2× FAC<br/>≠ CPUs · ≠ vendors · ≠ code</>}
              note="Elevator/aileron computers and spoiler/elevator computers use different processors from different manufacturers with software from independent teams — protection against common-mode design error, not just hardware failure. Any single computer can fly the aircraft in a degraded law. Mechanical backup: THS + rudder."
            />
            <EqCard
              label="Data Buses"
              eq={<>ARINC 429: 100 kbit/s<br/>AFDX (A380/787): 100 Mbit/s</>}
              note="ARINC 429 — one transmitter, up to 20 receivers, 32-bit words — carried avionics data from the 1970s on. The A380 introduced AFDX: switched full-duplex Ethernet with guaranteed bandwidth per virtual link. The nervous system's bandwidth grew a thousandfold in one generation."
            />
          </div>
        </div>
      </section>

      {/* ── 5 · Hydraulics ───────────────────────────────────────────── */}
      <section id="hydraulics" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 29</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Hydraulics — the Muscle.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A fluid at 200+ bar, pumped by the engines, piped to every corner of the airframe.
            Wherever the aircraft needs brute force — flight controls, landing gear, brakes,
            nose steering, flaps — hydraulics deliver it.
          </p>

          <Lecture>
            <P>
              Why hydraulics at all? <T>Power density</T>. Pascal&apos;s law says pressure applied
              to a confined fluid acts everywhere in it: put 3,000 psi behind a piston of modest
              area and you get tonnes of force from an actuator the size of your forearm — far
              lighter than any electric motor of equal force, stiff (fluid barely compresses, so
              surfaces hold position against gusts), and fast. An <T>engine-driven pump</T> (EDP)
              on each engine&apos;s gearbox pressurises the system; electric pumps supplement and
              back up; an <T>accumulator</T> — a nitrogen-charged pressure bottle — smooths
              demand spikes and stores emergency energy for the brakes.
            </P>
            <H3>Three systems, no single failure</H3>
            <P>
              Because a burst line drains a hydraulic system entirely, transports carry two to
              four <T>fully independent</T> systems — separate reservoirs, pumps, and plumbing,
              deliberately routed apart so one uncontained engine failure cannot cut them all.
              Airbus names them <T>Green, Blue, Yellow</T>; Boeing A, B, Standby. Every primary
              surface is fed by at least two. The 737&apos;s <T>PTU</T> — power transfer unit — is
              a hydraulic motor-pump pair that lets one system power another&apos;s load without
              sharing a drop of fluid; on the A320 it produces the famous barking-dog noise at the
              gate. And when everything fails, a <T>ram air turbine</T> drops out of the belly —
              a windmill in the slipstream, generating just enough hydraulic and electrical power
              to fly the aircraft.
            </P>
            <KeyIdea title="Sioux City, 1989 — why routing matters">
              United 232&apos;s tail engine disintegrated and the shrapnel severed the lines of
              all three hydraulic systems where they converged near the tail — the aircraft lost
              every flight control at once. The crew steered to a crash landing on differential
              engine thrust alone, saving 184 of 296 aboard. Every subsequent design separates
              hydraulic routing more aggressively, adds hydraulic fuses that seal off burst
              lines, and — most radically — breaks the assumption that flight controls need
              central hydraulics at all.
            </KeyIdea>
            <H3>The electric erosion</H3>
            <P>
              That last idea became the A380&apos;s <T>2H/2E</T> architecture: two hydraulic
              systems plus two <em>electrical</em> actuation channels. Some surfaces carry{" "}
              <T>electro-hydrostatic actuators</T> (EHAs) — each actuator is its own sealed
              mini-hydraulic system with a local electric pump, fed only by wires. No central
              plumbing to sever. The A380 also raised system pressure to 5,000 psi: higher
              pressure means smaller actuators and thinner lines for the same force, saving
              roughly a tonne. Wires are lighter than pipes; expect every future design to keep
              trading fluid for copper.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Pascal's Law — Force from Pressure"
              eq={<>F = p·A<br/><br/>P<sub>hyd</sub> = p·Q</>}
              note="At 3,000 psi (207 bar), a 100 cm² piston delivers ~21 tonnes of force. Hydraulic power is pressure times flow rate — a large jet's pumps deliver hundreds of kilowatts during flap and gear cycles. Stiffness matters as much as force: virtually incompressible fluid holds a surface rigidly against flutter and gust loads."
            />
            <EqCard
              label="System Pressure Generations"
              eq={<>3,000 psi — classic<br/>5,000 psi — A380, 787, A350</>}
              note="Doubling pressure nearly halves actuator piston area and line diameter for the same force. The A380 saved roughly a tonne of weight by going to 5,000 psi. The price: more demanding seals, fatigue-rated titanium plumbing, and tighter contamination control. Fluid is phosphate-ester (Skydrol) — fire-resistant, and famously merciless to paint and skin."
            />
            <EqCard
              label="Redundant Architecture"
              eq={<>A320: G + B + Y<br/>A380: 2H + 2E (EHA/EBHA)</>}
              note="Three independent systems, cross-connected by a PTU (motor-pump pair — power transfers, fluid doesn't). The A380 replaced one whole hydraulic system with electrically powered actuators: an EHA is a self-contained actuator with its own pump and reservoir, immune to airframe-wide fluid loss. Sioux City made this architecture inevitable."
            />
            <EqCard
              label="Last Resort — the RAT"
              eq={<>ram air turbine<br/>≈ 5–70 kW from the slipstream</>}
              note="A propeller on a leg that deploys into the airstream when engines or all generators fail, driving a hydraulic pump and/or generator. Sized for bare-minimum flight controls and instruments. Air Transat 236 (2001) glided 120 km to the Azores on RAT power after fuel exhaustion — 306 people landed safely on a windmill."
            />
          </div>
        </div>
      </section>

      {/* ── 6 · Electrical ───────────────────────────────────────────── */}
      <section id="electrical" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 24</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Electrical Power — the Grid.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Every aircraft is a flying power station: generators on each engine, an APU in the
            tail, batteries for the darkest minute, and a bus network that decides — automatically,
            in milliseconds — who gets power when a source dies.
          </p>

          <Lecture>
            <P>
              The primary sources are <T>engine-driven generators</T>, one or two per engine, on
              the same accessory gearbox as the hydraulic pumps and fuel pumps. Classic aircraft
              generate <T>115 V AC at a fixed 400 Hz</T> — a frequency chosen because transformers
              and motors shrink dramatically as frequency rises (400 Hz gear is several times
              lighter than 50 Hz gear), and the transmission losses that rule 400 Hz out for
              national grids don&apos;t matter over an airframe-length wire run. Since the engine
              spools change speed constantly, each generator hangs on an <T>integrated drive
              generator</T> (IDG) — a mechanical continuously-variable transmission holding the
              generator at constant RPM. Transformer-rectifier units then derive <T>28 V DC</T>{" "}
              for avionics and battery charging.
            </P>
            <H3>The bus hierarchy — triage by design</H3>
            <P>
              Power flows through a hierarchy of <T>buses</T>: AC 1 and AC 2 fed by their own
              engines, tied together automatically if a generator fails, backed by the{" "}
              <T>APU generator</T> and, on the ground, external power. The critical trick is the{" "}
              <T>essential bus</T>: a curated subset of loads — flight instruments, FBW computers,
              fuel pumps, radios — that every surviving source is automatically routed to feed.
              Lose generators and the system <T>load-sheds</T> the galleys and cabin comforts
              without a pilot touching anything. At the bottom of the chain sit the{" "}
              <T>batteries</T>, sized for roughly 30 minutes of essential flight — enough time to
              deploy the RAT, start the APU, or find a runway.
            </P>
            <KeyIdea title="The 787 — the all-electric bet">
              The 787 generates about 1.45 megawatts — nearly five times a 767 — from four 235 V AC{" "}
              <em>variable-frequency</em> generators (no IDG; power electronics condition the
              output instead). With that much electricity it abolished bleed air: cabin
              pressurization runs on electric compressors, wing anti-ice on heater mats, engine
              start by running the generators backwards as motors, brakes are electro-mechanical
              — no brake hydraulics at all. One power currency instead of three. The teething cost
              was real (the 2013 lithium-battery grounding), but the fuel savings of not bleeding
              the engines won the argument: the A350 kept only partial bleed, and future designs
              are more electric still.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="The Classic Standard"
              eq={<>115 V AC · 400 Hz · 3φ<br/>28 V DC via TRUs</>}
              note="400 Hz means small, light magnetics — a WWII-era choice that stuck. IDGs hold generator speed constant as the engine spools vary (a CVT in the gearbox). DC side: transformer-rectifier units feed avionics and charge the batteries. Typical large-jet generation: 90–120 kVA per engine channel."
            />
            <EqCard
              label="Source Priority Ladder"
              eq={<>GEN 1/2 → APU → EXT → BAT → RAT</>}
              note="Bus tie contactors reconfigure automatically on any source loss — the priority logic is hardwired. Batteries carry the essential bus for ~30 min. The APU (a small turbine in the tailcone) provides full electrical and pneumatic power up to cruise altitude and is why a jet at the gate hums with the engines off."
            />
            <EqCard
              label="787 More-Electric Numbers"
              eq={<>4 × 235 V AC VF + 2 × APU<br/>≈ 1.45 MW installed</>}
              note="Variable-frequency generation (360–800 Hz) deletes the IDG — the least reliable box in the classic chain — and lets power electronics do the conditioning. The generators double as engine starters. Electricity replaced bleed air for pressurization and anti-ice, and hydraulics for the brakes."
            />
            <EqCard
              label="Load Shedding"
              eq={<>galleys → cabin → utility → never: flight</>}
              note="On source loss the system sheds loads in strict priority order — ovens and IFE first, essential flight loads never. A fully loaded galley pulls tens of kilowatts (each oven ~5 kW), which is why cabin crew lose their coffee makers before pilots lose a single instrument."
            />
          </div>
        </div>
      </section>

      {/* ── 7 · Fuel ─────────────────────────────────────────────────── */}
      <section id="fuel" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 28</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Fuel — Tank, Ballast, Coolant.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Fuel is up to half the takeoff weight of a long-haul jet — so the fuel system is
            not a gas tank with a pipe. It is a structural load manager, a centre-of-gravity
            control system, and the aircraft&apos;s primary heat sink.
          </p>

          <Lecture>
            <P>
              The tanks are not containers <em>inside</em> the wing — the sealed wing box{" "}
              <em>is</em> the tank (an <T>integral tank</T>). A big twin carries most fuel in two
              wing tanks plus a centre tank in the wing box under the cabin; long-haulers add a
              tail <T>trim tank</T>. Electric <T>boost pumps</T> in each tank push fuel to the
              engines (with gravity feed as the wing-tank fallback), and a <T>crossfeed</T> valve
              lets any engine drink from any tank — the first lever pulled when an engine fails
              and the fuel load starts going asymmetric.
            </P>
            <H3>Fuel as structure: bending relief</H3>
            <P>
              Recall the wing root carrying the bending moment of the whole aircraft. Weight{" "}
              <em>in the wing</em> pushes down right where lift pushes up — it cancels bending
              at the root rather than adding to it. Fuel in the wings is therefore almost
              structurally free, while fuel in the fuselage is pure load. This is why the burn
              order is always <T>centre tank first, wing tanks last</T>, and why outboard wing
              fuel is held longest: keeping weight out where the lift is unloads the spar for
              the whole cruise.
            </P>
            <KeyIdea title="Fuel as flight control — the CG machines">
              Concorde pumped up to 20 tonnes of fuel rearward during acceleration through Mach 1
              — not for range, but because the centre of lift moves aft ~2 m going supersonic, and
              moving the centre of gravity to chase it was lighter than carrying huge trim
              surfaces. Modern long-haulers do the subsonic version: the A380 and 777 transfer
              fuel to a tailplane trim tank in cruise, shifting the CG aft to shrink the
              tail&apos;s download and cut trim drag by a percent or two — millions of dollars of
              fuel across a fleet, from plumbing.
            </KeyIdea>
            <H3>Fuel as coolant — and the safety chapter</H3>
            <P>
              Cold fuel on its way to the engines flows through heat exchangers cooling engine
              oil, IDG oil, and on some types hydraulics and avionics — a free heat sink that
              would otherwise demand radiators and drag. The limits show up at the corners: fuel
              can be heated too far, and on long polar sectors Jet A&apos;s freeze point (−40 to
              −47 °C) becomes a real operational constraint. The dark lesson of the chapter is
              TWA 800 (1996): a nearly empty centre tank full of fuel vapour, heated by air
              conditioning packs below it, ignited by a spark. The fix, mandated fleet-wide, is{" "}
              <T>inerting</T> — an onboard membrane system that fills tank ullage with
              nitrogen-enriched air so the vapour space can no longer burn.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Scale"
              eq={<>A380: 320,000 L<br/>≈ 47% of MTOW as fuel</>}
              note="A long-haul departure can be nearly half fuel by weight. Managing where that mass sits — spanwise for bending, fore-aft for trim — is as important as delivering it. Fuel quantity is measured by capacitance probes throughout each tank, compensated for density and attitude."
            />
            <EqCard
              label="Bending Relief — Burn Order"
              eq={<>centre first → inboard → outboard</>}
              note="Wing fuel weight opposes lift's upward bending at the root; fuselage fuel just adds load. Burning the centre tank first keeps the wings heavy while the moment matters most. Some types also carry maximum-zero-fuel-weight limits for exactly this reason: above MZFW, additional weight must be fuel, in the wings."
            />
            <EqCard
              label="CG Control — Trim Transfer"
              eq={<>Concorde: 20 t aft, M0.9→2.0<br/>A380: THS trim tank in cruise</>}
              note="Concorde's aerodynamic centre shifted ~2 m aft through the transonic regime; pumping fuel aft moved the CG to match, replacing draggy trim deflection with plumbing. Subsonic long-haulers use the same trick gently — aft CG shrinks the tailplane download, cutting induced trim drag ~1–2%."
            />
            <EqCard
              label="Inerting — the TWA 800 Fix"
              eq={<>OBIGGS: ullage O<sub>2</sub> &lt; 12%</>}
              note="Onboard inert gas generation: bleed air pushed through hollow-fibre membranes separates an oxygen-depleted stream that blankets the fuel tank ullage. Below ~12% oxygen, Jet A vapour cannot ignite regardless of spark sources. Required on centre tanks of all new transport aircraft since 2008."
            />
          </div>
        </div>
      </section>

      {/* ── 8 · Bleed Air ────────────────────────────────────────────── */}
      <section id="bleed" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 36 · ATA 21</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Bleed Air — the Third Grid.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Tap the engine compressor and you get air at 40 psi and 200+ °C — free heat and
            pressure, already onboard. For sixty years this single tap has pressurized the
            cabin, melted wing ice, and started the engines.
          </p>

          <Lecture>
            <P>
              A turbofan&apos;s compressor is the best air pump ever flown, so classic designs
              simply <T>bleed</T> a few percent of core airflow from two ports — an intermediate
              stage for cruise, a high-pressure stage for idle and descent — regulate it to
              roughly 40 psi, cool it in a <T>precooler</T> against fan air, and pipe it down the
              wing and fuselage. From that one duct: cabin pressurization and air conditioning,
              wing and engine anti-ice, hydraulic reservoir pressurization, water tanks, and{" "}
              <T>engine starting</T> — the starter is an air turbine, spun by APU bleed or by
              crossbleed from a running engine. That is why engines start one at a time, and why
              you hear the packs go quiet during start at the gate.
            </P>
            <H3>The air cycle machine — refrigeration with no refrigerant</H3>
            <P>
              Bleed air arrives far too hot for a cabin. The <T>packs</T> cool it with a
              beautifully aviation-grade trick: an <T>air cycle machine</T> — the reverse Brayton
              cycle. Compress the bleed further, dump the heat overboard through ram-air heat
              exchangers, then expand it through a turbine that <em>extracts work</em> (driving
              its own compressor) so the air leaves genuinely cold — near 0 °C — no freon, no
              phase change, just turbomachinery the size of a beach ball. Mixed with recirculated
              cabin air, it holds a 40-degree gap between −55 °C outside and 22 °C inside for
              twelve hours at a stretch.
            </P>
            <KeyIdea title="Nothing from the engine is free">
              Every kilogram of bleed is air the compressor worked hard on that never reaches
              the combustor — a direct thrust and fuel-burn penalty of several percent, worst
              exactly when you need thrust most. That accounting is what killed bleed air on the
              787: electric cabin compressors let the engines keep every gram of core flow, and
              the engine can be optimised without reserving margin for the tap. The 787 kept
              bleed only where hot air is irreplaceably convenient — engine cowl anti-ice.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="The Bleed Tap"
              eq={<>IP + HP ports → ~40 psi, 200 °C<br/>precooler vs fan air</>}
              note="Two ports because the compressor's pressure varies hugely with throttle: the IP stage suffices at high power, the HP stage takes over at idle. The precooler drops the air to ~200 °C before it enters wing ducts — overheat detection loops line every bleed duct, because a leak can cook structure and wiring."
            />
            <EqCard
              label="Air Cycle Machine"
              eq={<>compress → cool → expand<br/>T drops through the turbine</>}
              note="Reverse Brayton refrigeration: the expansion turbine extracts work from the air, so temperature falls far below what heat exchangers alone could reach. No refrigerant, minimal moving parts, tolerant of huge inlet temperature swings — the same machine cools the cabin at −55 °C cruise and +45 °C tarmac."
            />
            <EqCard
              label="Pneumatic Engine Start"
              eq={<>APU bleed → air turbine starter<br/>then crossbleed 1 → 2</>}
              note="The starter is a small air turbine on the accessory gearbox, spun by ~40 psi bleed to crank the HP spool to light-off speed. First engine starts on APU air; the second can start on crossbleed from the first. Electric-start aircraft (787) instead motor their starter-generators — no air involved."
            />
            <EqCard
              label="The Cost of Bleed"
              eq={<>Δ fuel burn ≈ +1–3%<br/>787: bleedless, electric CACs</>}
              note="Bleed extraction raises TSFC and shrinks surge margin. The 787 replaced pack supply with dedicated electric cabin air compressors drawing outside air through dedicated inlets — the engines burn measurably less fuel, at the price of the ~1.45 MW electrical system that makes it possible."
            />
          </div>
        </div>
      </section>

      {/* ── 9 · Pressurization ───────────────────────────────────────── */}
      <section id="pressurization" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>Environmental Control</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Pressurization — Carrying the Sky.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            At 40,000 ft the outside air holds a conscious human for about fifteen seconds.
            The cabin is a life-support vessel — inflated by the packs, regulated by a single
            modulating valve, and backed by chemistry when it all goes wrong.
          </p>

          <Lecture>
            <P>
              The physics is unforgiving: at cruise altitude, ambient pressure is a fifth of sea
              level, and the partial pressure of oxygen is below what human blood can load.{" "}
              <T>Time of useful consciousness</T> at 40,000 ft is 15–20 seconds. So the fuselage
              is inflated to a <T>cabin altitude</T> — the altitude the pressure inside
              corresponds to — that certification caps at <T>8,000 ft</T>, where a healthy
              passenger barely notices. The 787 and A350, with fatigue-immune composite hulls,
              hold 6,000 ft and higher humidity: measurably fresher arrival, a direct dividend of
              the structures chapter.
            </P>
            <H3>One valve runs the show</H3>
            <P>
              Air flows in continuously from the packs; pressure is controlled entirely by
              modulating how fast it <em>leaves</em>, through the <T>outflow valve</T> — one or
              two motorised doors in the rear fuselage. The controller schedules cabin altitude
              smoothly up during climb and down during descent (cabin rates are kept to a few
              hundred feet per minute — ears are the limiting instrument), targeting touchdown
              with zero differential. Mechanical <T>positive-pressure relief valves</T> guard the
              hull&apos;s ~9 psi structural limit, and <T>negative relief</T> doors open inward
              if a descent ever outruns the cabin — the vessel must never be crushed from
              outside.
            </P>
            <KeyIdea title="When it fails — the fifteen-second problem">
              Depressurization inverts the priority list: masks drop automatically at ~14,000 ft
              cabin altitude, fed by chemical oxygen generators — sodium-chlorate candles that
              burn for 12–20 minutes, which is not much oxygen but is exactly enough for the only
              manoeuvre that matters: the emergency descent to 10,000 ft, flown at near-V_MO with
              speedbrakes out. The crew get pressure-demand masks from bottled oxygen good for
              much longer. Helios 522 (2005) — a pressurization mode switch left in manual, a
              crew who misread the warnings, and a fully fuelled 737 that cruised on autopilot
              until fuel exhaustion with everyone aboard unconscious — is the case study in why
              this system&apos;s alerts are now unmissable.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="The Numbers"
              eq={<>cabin ≤ 8,000 ft (787: 6,000)<br/>ΔP ≈ 8–9.4 psi</>}
              note="At 40,000 ft ambient (2.7 psi) with an 8,000 ft cabin (10.9 psi), the hull carries ~8.2 psi differential — about 60 kPa trying to burst every square metre of skin. The 787's 9.4 psi differential for its 6,000 ft cabin is only affordable because CFRP doesn't fatigue like aluminium."
            />
            <EqCard
              label="Outflow Control"
              eq={<>ṁ<sub>in</sub> (packs) − ṁ<sub>out</sub> (valve) → p<sub>cab</sub></>}
              note="Constant inflow, modulated outflow. The controller flies the cabin on its own altitude schedule — cabin climbs at ~500 ft/min while the aircraft climbs at 2,500 ft/min. Backup modes run from semi-automatic down to a manual toggle switch driving the valve motor directly."
            />
            <EqCard
              label="Time of Useful Consciousness"
              eq={<>25,000 ft: 3–5 min<br/>35,000 ft: 30–60 s · 40,000 ft: 15–20 s</>}
              note="The certification driver for automatic mask deployment and the memorised emergency descent. Rapid decompression halves these times — lung air is lost outward in the first second. This is also why crews don masks first, before diagnosis: the window for useful action closes in seconds."
            />
            <EqCard
              label="Emergency Oxygen"
              eq={<>pax: chemical, 12–20 min<br/>crew: gaseous, pressure-demand</>}
              note="Chlorate candles are light and storable for years but burn hot (the ValuJet 592 cargo fire was improperly shipped generators) and cannot be shut off. Their duration is matched to one task: surviving the dive to breathable air. Crew bottles must also cover a smoke-in-cockpit scenario, hence the larger supply."
            />
          </div>
        </div>
      </section>

      {/* ── 10 · Avionics ────────────────────────────────────────────── */}
      <section id="avionics" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 34 · ATA 22</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Avionics — Sensing and Deciding.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Everything the aircraft knows about the world enters through two humble channels —
            air pressure and inertia — and everything it does with that knowledge flows through
            the flight management and autoflight stack.
          </p>

          <Lecture>
            <P>
              Start at the sensors. The <T>pitot tube</T> faces the airstream and measures total
              pressure; <T>static ports</T> on the fuselage flank measure ambient. From just
              these, the <T>air data</T> computers derive airspeed (from the difference — dynamic
              pressure), altitude (from static, via the standard atmosphere), vertical speed, and
              with a temperature probe, Mach and true airspeed. Vanes measure angle of attack.
              This is why <T>probe icing</T> is so vicious a failure mode — AF447 began with
              nothing more than iced pitots — and why every probe is heated, triplicated, and
              cross-compared by the computers with voting logic.
            </P>
            <P>
              The second channel is inertia. The <T>ADIRU</T> — air data inertial reference unit
              — carries ring-laser gyros and accelerometers that integrate rotation and
              acceleration into attitude, heading, groundspeed, and position with no outside
              reference at all. GNSS corrects the slow drift; the inertial platform carries
              through GNSS gaps. Blended, they feed everything: the FBW computers, the displays,
              the autopilot, the navigation.
            </P>
            <H3>The autoflight ladder</H3>
            <P>
              Above the sensors sits a stack of increasing authority. The <T>flight director</T>{" "}
              computes steering and draws it on the display for the pilot to follow. The{" "}
              <T>autopilot</T> follows it with the actual controls; the <T>autothrottle</T> does
              the same for speed. At the top, the <T>flight management system</T> holds the whole
              flight plan — route, altitudes, winds, performance model — and feeds the autopilot
              its targets, optimising climb, cruise and descent against a <T>cost index</T>, the
              airline&apos;s chosen exchange rate between fuel and time. A modern jet can couple
              this chain to an ILS all the way to an automatic landing in fog (CAT IIIb: decision
              height effectively zero) — which, notably, requires <em>fail-operational</em>{" "}
              autopilots: two or three channels comparing, any failure below 200 ft leaving a
              working one in command.
            </P>
            <KeyIdea title="The safety nets — machines that overrule the plan">
              Independent of the navigation stack, three systems exist purely to interrupt:{" "}
              <em>TCAS</em> interrogates nearby transponders and — coordinating with the other
              aircraft&apos;s TCAS — commands climb/descend resolutions that crews must follow even
              against air traffic control (the lesson of Überlingen, 2002). <em>EGPWS</em>{" "}
              compares position against a global terrain database and calls &quot;PULL UP&quot;
              with enough margin to escape. Windshear detection commands the full-performance
              go-around the FBW protections were built for. Each addresses a killer of the
              pre-1990 era — mid-air collision, controlled flight into terrain, microburst — and
              together they have made those accident categories nearly extinct.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Pitot-Static — Where Speed Comes From"
              eq={<>q = p<sub>t</sub> − p<sub>s</sub> = ½ρV²</>}
              note="Indicated airspeed is calibrated on sea-level density, which is exactly why IAS — not true airspeed — is what the wing cares about: it is a direct proxy for dynamic pressure, and stall, flap and gear limits are all IAS numbers. True airspeed at cruise runs ~60% higher than indicated."
            />
            <EqCard
              label="Inertial Reference"
              eq={<>∫ω dt → attitude<br/>∬a dt² → position</>}
              note="Ring-laser gyros measure rotation via counter-propagating light beams — no moving parts, drift under 0.1°/hr. Pure inertial position drifts ~1–2 NM/hr, so GNSS updates it continuously; in return the IRS rides through GNSS outages and jamming. Alignment before flight is why the aircraft must know where it starts."
            />
            <EqCard
              label="Autoflight Authority Ladder"
              eq={<>sensors → FD → AP/AT → FMS</>}
              note="Flight director suggests, autopilot steers, autothrottle manages energy, FMS plans. Autoland (CAT IIIb) requires fail-operational redundancy: multiple autopilot channels in agreement, radio altimeters voting, and rollout steering — the aircraft can land with visibility of 75 m."
            />
            <EqCard
              label="The Interrupting Machines"
              eq={<>TCAS · EGPWS · windshear · ADS-B</>}
              note="TCAS resolution advisories are coordinated between aircraft over the transponder link — one climbs, one descends — and outrank ATC instructions. EGPWS's terrain database turned 'controlled flight into terrain', historically the biggest killer in aviation, into one of the rarest accident types. ADS-B broadcasts every aircraft's GNSS position once per second."
            />
          </div>
        </div>
      </section>

      {/* ── 11 · Landing Gear ────────────────────────────────────────── */}
      <section id="gear" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 32</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Landing Gear — the Contact Patch.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            A few square metres of rubber and forged steel absorb a 300-tonne aircraft arriving
            at 260 km/h — then stop it, steer it, and fold themselves into the belly.
          </p>

          <Lecture>
            <P>
              The heart of every leg is the <T>oleo-pneumatic strut</T>: a telescoping cylinder
              where compressed nitrogen is the spring and oil forced through a metering orifice
              is the damper. A tapered <T>metering pin</T> varies the orifice with stroke, so
              resistance rises through the compression — soaking up a firm touchdown (certified
              at 10 ft/s descent) without bouncing the aircraft back into the air. The legs
              retract via hydraulics into sealed bays, with mechanical <T>overcentre locks</T>{" "}
              holding them both up and down; if hydraulics die, unlocking the doors lets{" "}
              <T>gravity free-fall</T> the gear into the locked-down position — the one system
              where the failure mode is designed to be &quot;just let go&quot;.
            </P>
            <H3>Stopping: the energy problem</H3>
            <P>
              Brakes are the underrated giants of the aircraft. Stopping is an energy problem —
              kinetic energy grows with the <em>square</em> of speed — and the worst case is not
              landing but the <T>rejected takeoff</T>: maximum weight, decision speed, and all of
              it into the brakes. Certification demands a full-scale demonstration with{" "}
              <em>fully worn</em> brakes and no reverse thrust, after which the glowing stacks
              must sit for five minutes untouched by fire crews. Modern discs are{" "}
              <T>carbon-carbon</T> — half the weight of steel, better with heat. Each wheel has{" "}
              <T>anti-skid</T> holding the tyre at peak grip (the technology ABS descended from),
              and <T>autobrake</T> applies a selected deceleration on touchdown before human feet
              react. The tyres themselves are engineering artefacts: inflated to ~14 bar with
              nitrogen, speed-rated past 380 km/h, and fitted with <T>fusible plugs</T> that
              deflate them gently if brake heat soaks in — a tyre must never explode in the bay.
            </P>
            <KeyIdea title="The RTO arithmetic">
              An A380 rejecting at MTOW near V<sub>1</sub> must dissipate on the order of two
              gigajoules — the kinetic energy of ~570 tonnes at 300 km/h — almost entirely in
              sixteen wheel brakes within about 30 seconds. The discs pass 1,000 °C and stay
              hazardous for an hour. This single certification case sizes the brakes, the wheels,
              the fuse plugs, and the V<sub>1</sub> decision-speed logic in every performance
              calculation the crew makes before every takeoff.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Touchdown Energy"
              eq={<>E = ½mV<sub>vert</sub>²&ensp;absorbed / strut<br/>cert: 10 ft/s sink at MLW</>}
              note="The oleo converts descent energy into heated oil across the metering orifice — a shock absorber tuned so the peak load stays within the airframe's landing case. A 'firm' airline landing at 5 ft/s uses a quarter of the certified energy; the design case at 10 ft/s feels like a crash to passengers and is routine for carrier jets."
            />
            <EqCard
              label="Rejected Takeoff — Brake Energy"
              eq={<>E<sub>RTO</sub> = ½·m·V<sub>1</sub>² ≈ 2 GJ (A380)</>}
              note="Certified with 100% worn brakes, no reversers, and a 5-minute no-intervention fire wait. Carbon heat packs absorb ~50% more energy per kilogram than steel and last several times longer. After a high-energy RTO the brakes are scrap — and the performance charts include mandatory cooling times before the next attempt."
            />
            <EqCard
              label="Anti-Skid & Autobrake"
              eq={<>slip ratio held near μ<sub>peak</sub> ≈ 0.1–0.2</>}
              note="Wheel speed sensors detect impending lock-up and release individual brakes dozens of times per second, keeping each tyre at peak friction on any surface — braking distance on a wet runway can double without it. Autobrake targets a constant deceleration; MAX setting on landing, RTO setting armed for every takeoff."
            />
            <EqCard
              label="Extension of Last Resort"
              eq={<>unlock → free fall → locked down</>}
              note="Alternate extension needs no power: release the uplocks (mechanically or via a small standby system) and gravity plus airload swing the gear down into the overcentre locks. Nosewheel steering: tiller for ±70°+ taxi turns, rudder pedals for a few degrees of high-speed centreline tracking on the runway."
            />
          </div>
        </div>
      </section>

      {/* ── 12 · Ice & Fire ──────────────────────────────────────────── */}
      <section id="protection" className="scroll-mt-14 border-t border-white/[0.05] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>ATA 30 · ATA 26</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Ice & Fire — the Protection Systems.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            Two environmental enemies get their own dedicated ATA chapters. Ice quietly rebuilds
            the aerodynamics you designed; fire gets ninety seconds of attention before it
            decides the flight.
          </p>

          <Lecture>
            <P>
              Icing happens when the aircraft flies through <T>supercooled water</T> — droplets
              below 0 °C that stay liquid until something touches them, then freeze on impact.
              They strike exactly where the flow stagnates: leading edges, engine lips, probes.
              A few millimetres of rough ice on a wing&apos;s leading edge can cut maximum lift
              by 30% and add drag like a spoiler — the aerodynamics section&apos;s clean
              boundary layer simply no longer exists. The defence is split by philosophy:{" "}
              <T>anti-ice</T> (keep protected surfaces continuously hot — engine inlets, always,
              because shed ice entering the fan is its own hazard) versus <T>de-ice</T> (let a
              thin layer form, then shed it cyclically — the pneumatic rubber boots on
              turboprops). Jets bathe wing leading edges in bleed air; the 787 uses embedded
              electric heater mats; every probe that feeds the air data chapter carries its own
              heater, for AF447 reasons.
            </P>
            <H3>Fire — detect, isolate, smother</H3>
            <P>
              An engine fire is fought by geometry and chemistry. Detection first: continuous{" "}
              <T>fire loops</T> — temperature-sensitive sensing elements snaked around each
              engine and the APU — wired in pairs with <T>AND logic</T>, both loops agreeing
              before the bell rings, so a chafed wire cannot trigger a false engine shutdown.
              Then the <T>fire handle</T>: one pull closes the fuel valve, the hydraulic supply,
              the bleed duct and the generator — everything that feeds the nacelle — and arms two{" "}
              <T>extinguisher bottles</T> of Halon that discharge through the zone. The engine is
              sacrificed without hesitation; the aircraft flies fine on the rest.
            </P>
            <KeyIdea title="The compartments you cannot reach">
              Cargo holds burn beyond anyone's reach, so the design does what a crew cannot:
              detection by smoke, oxygen starvation by sealing the compartment, an immediate
              Halon knockdown shot, then a low-rate metered discharge that keeps the hold inert
              for up to three-plus hours — the ETOPS diversion time. The APU, tail-mounted and
              unattended, fights its own fires entirely automatically, even on the ground with
              no one aboard. Fire is the one emergency where the checklist&apos;s first step is
              always the same: point the aircraft at the nearest runway <em>now</em>.
            </KeyIdea>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="Icing Envelope"
              eq={<>0 to −40 °C · visible moisture<br/>worst: −10 to −20 °C</>}
              note="Supercooled large droplets (freezing drizzle) are the killer corner — they flow aft past protected leading edges before freezing, building ridges where no heater lives. The ATR-72 accident at Roselawn (1994) drove new SLD certification rules. Below about −40 °C, ice crystals no longer stick to airframes — but can still choke engine cores."
            />
            <EqCard
              label="Protection Methods"
              eq={<>bleed thermal · electro-thermal<br/>boots · fluid (TKS)</>}
              note="Bleed air: powerful, 'free' heat, but a duct network and an engine penalty. Electric mats (787): efficient, controllable, needs the big generators. Pneumatic boots: light, cheap, turboprop standard — inflate to crack ice off cyclically. Ground icing is a separate regime entirely: Type I/IV fluids and holdover time tables before takeoff."
            />
            <EqCard
              label="Dual-Loop Fire Detection"
              eq={<>loop A ∧ loop B → FIRE<br/>single loop fault → advisory only</>}
              note="Averaging gas-pressure or resistive sensing elements run in parallel loops around each fire zone. AND logic suppresses false alarms; if one loop self-tests as failed, the system quietly reverts to single-loop operation. Overheat detection along bleed ducts uses the same technology at lower thresholds."
            />
            <EqCard
              label="The Fire Handle Sequence"
              eq={<>pull: fuel ∥ hyd ∥ bleed ∥ gen<br/>twist: bottle 1 → wait → bottle 2</>}
              note="One handle isolates every flammable and every ignition source feeding the nacelle, then discharges Halon 1301 — still aviation's agent of choice because it interrupts combustion chemically at ~3% concentration without harming equipment or (briefly exposed) people. If the fire warning persists 30 s after bottle one, bottle two follows."
            />
          </div>
        </div>
      </section>

      {/* ── 13 · Certification ───────────────────────────────────────── */}
      <section id="redundancy" className="scroll-mt-14 border-t border-white/[0.05] bg-[#06080e] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>The Meta-System</SectionLabel>
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Redundancy & Certification — the Philosophy.</h2>
          <p className="mb-14 max-w-2xl text-lg leading-relaxed text-[#94a3b8]">
            The final layer is not hardware. It is the discipline that decided how many of
            everything the aircraft carries — and it is written in probabilities.
          </p>

          <Lecture>
            <P>
              Every system on this page exists in the shape it does because of one paragraph of
              regulation — CS/FAR 25.1309 — which demands that the probability of a{" "}
              <T>catastrophic</T> failure condition be <T>extremely improbable</T>: on the order
              of 10⁻⁹ per flight hour, per condition. The number is not arbitrary. A fleet of
              thousands of aircraft flying for decades accumulates on the order of 10⁹ hours; the
              target means a given catastrophic failure should be expected <em>roughly never</em>{" "}
              in the life of the entire world fleet. Beneath it runs a ladder: minor failures may
              be probable, hazardous ones must be below 10⁻⁷, and the design must show — by fault
              trees, by analysis, by test — that the ladder holds for every failure combination
              anyone can enumerate.
            </P>
            <P>
              From that number, everything follows. A single component cannot honestly claim 10⁻⁹
              — real hydraulic pumps fail every ~10⁵ hours — so the arithmetic forces{" "}
              <T>redundancy</T>: three independent 10⁻⁵ systems multiply to meet the target,{" "}
              <em>provided they fail independently</em>. That proviso is the deep design driver.
              It is why hydraulic lines route down opposite sides of the fuselage, why the FBW
              computers use dissimilar processors and separate software teams, why certification
              obsesses over <T>common-mode failures</T> — the rotor burst, the fuel exhaustion,
              the software bug, the volcanic ash that takes out &quot;independent&quot; systems
              together. Software cannot be made redundant by copying it, so it is graded instead:{" "}
              <T>Design Assurance Levels</T> A through E, with Level A code — FBW, autoland —
              developed under DO-178C's most exhaustive verification regime, costing hundreds of
              dollars per line.
            </P>
            <KeyIdea title="Graceful degradation — the deepest pattern">
              Look back across every chapter and one pattern repeats: normal law → alternate law
              → direct law → mechanical. Green → Blue → Yellow → RAT. Generators → APU → battery.
              Autoland → flight director → raw data. Packs → masks → emergency descent. Every
              system is a staircase, each step less capable and more robust than the one above,
              and the bottom step never needs electronics, software, or luck. An airliner is not
              designed to avoid failure — it is designed so that failure, arriving in any order,
              always lands on another step of the staircase.
            </KeyIdea>
            <P>
              The philosophy even follows the aircraft into service. The <T>minimum equipment
              list</T> defines what may be broken at dispatch — fly with one pack inoperative,
              but restricted to lower altitude; the redundancy analysis is re-run in the
              dispatcher&apos;s office. <T>ETOPS</T> extends twin-engine aircraft over oceans by
              auditing exactly the systems on this page — electrical, fire suppression, cargo
              hold protection — against a 180- or 370-minute single-engine diversion. And when
              the analysis is wrong, the accident investigation feeds the correction back into
              the rules: almost every system above carries the name of the flight that taught
              its lesson. That loop — design, fail, learn, redesign — is the actual reason a
              machine of a million parts, any of which can break, is the safest way to travel
              ever devised.
            </P>
          </Lecture>

          <FormulaSheet />
          <div className="grid gap-5 md:grid-cols-2">
            <EqCard
              label="The 10⁻⁹ Rule"
              eq={<>P(catastrophic) ≤ 10<sup>−9</sup> / fl·hr<br/>hazardous ≤ 10<sup>−7</sup> · major ≤ 10<sup>−5</sup></>}
              note="Severity and probability must be inversely related — the more dangerous the failure condition, the less probable the design must prove it to be. Demonstrated by fault-tree analysis over every enumerable failure combination, plus the blunt rule that survives every analysis: no single failure may be catastrophic."
            />
            <EqCard
              label="Redundancy Arithmetic"
              eq={<>P<sub>total</sub> = P₁·P₂·P₃&ensp;iff independent</>}
              note="Three 10⁻⁵ systems reach 10⁻¹⁵ on paper — but only if nothing couples them. Physical segregation, dissimilar hardware, separate software teams and even different power sources exist to defend the independence assumption, because the multiplication is worthless the moment failures correlate."
            />
            <EqCard
              label="Software Assurance"
              eq={<>DAL A → E&ensp;(DO-178C)</>}
              note="Level A (failure could be catastrophic: FBW, autoland) requires requirements-to-code-to-test traceability, structural coverage analysis, and independent verification. Level E (no safety effect: IFE) requires none. Grading the rigor to the hazard is how a jet carries both 10⁻⁹ flight software and a buggy seatback movie player."
            />
            <EqCard
              label="The Service Loop"
              eq={<>MEL · ETOPS · AD → redesign</>}
              note="The MEL re-runs the redundancy analysis at dispatch: what may be inoperative, with what compensations. ETOPS audits systems against hours-long single-engine diversions. Airworthiness Directives push mandatory fixes fleet-wide when service finds what analysis missed — the regulatory feedback loop that turns accidents into rules."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.04] bg-[#04060a] px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Power",       items: ["EDP — engine-driven pump", "PTU — power transfer unit", "RAT — ram air turbine", "IDG — integrated drive generator", "APU — auxiliary power unit"] },
              { label: "Computers",   items: ["ELAC/SEC — Airbus FCCs", "ADIRU — air data + inertial", "FMS — flight management", "FADEC — engine control", "AFDX — avionics Ethernet"] },
              { label: "Air",         items: ["ACM — air cycle machine", "pack — A/C unit", "outflow valve — cabin pressure", "OBIGGS — tank inerting", "precooler — bleed cooling"] },
              { label: "Philosophy",  items: ["25.1309 — the 10⁻⁹ rule", "DAL — software assurance", "MEL — dispatch with failures", "ETOPS — twin overwater ops", "AD — airworthiness directive"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-rose-400/60">{col.label}</p>
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
                { href: "/aerodynamics#stability", label: "Stability & FBW", sub: "why relaxed stability needs computers", accent: "#22d3ee" },
                { href: "/aerodynamics#high-lift", label: "High-Lift Systems", sub: "the surfaces these systems move", accent: "#22d3ee" },
                { href: "/thermodynamics#propulsion", label: "Propulsion", sub: "where all this power comes from", accent: "#34d399" },
                { href: "/", label: "Commercial Fleet", sub: "the aircraft that carry it all", accent: "#3b82f6" },
              ]}
            />
          </div>
          <div className="border-t border-white/[0.05] pt-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-white/20">
              AVIA · Aviation Encyclopedia · Aircraft Systems Reference
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
