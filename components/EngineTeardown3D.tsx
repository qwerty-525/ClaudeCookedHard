"use client"

import { useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  type MotionValue,
} from "framer-motion"

// ── Scroll phase map ──────────────────────────────────────────────────────────
const EXPLODE_START = 0.055
const EXPLODE_END = 0.2
const TOUR_START = 0.205
const TOUR_END = 0.825
const REASM_START = 0.835
const REASM_END = 0.915

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}

function explodeAmount(p: number) {
  if (p < EXPLODE_START) return 0
  if (p < EXPLODE_END) return smooth((p - EXPLODE_START) / (EXPLODE_END - EXPLODE_START))
  if (p < REASM_START) return 1
  if (p < REASM_END) return 1 - smooth((p - REASM_START) / (REASM_END - REASM_START))
  return 0
}

function sectionAt(p: number) {
  if (p < TOUR_START || p >= TOUR_END) return -1
  const w = (TOUR_END - TOUR_START) / SECTIONS.length
  return Math.min(SECTIONS.length - 1, Math.floor((p - TOUR_START) / w))
}

type Phase = "intro" | "disasm" | "tour" | "reasm" | "finale"

function phaseAt(p: number): Phase {
  if (p < EXPLODE_START) return "intro"
  if (p < TOUR_START) return "disasm"
  if (p < REASM_START) return "tour"
  if (p < REASM_END) return "reasm"
  return "finale"
}

// ── Educational content ───────────────────────────────────────────────────────
interface Section {
  station: string
  kicker: string
  title: string
  body: string
  facts: { label: string; value: string }[]
  parts: PartId[]
  cam: { pos: [number, number, number]; look: [number, number, number] }
}

const SECTIONS: Section[] = [
  {
    station: "STN 1 → 2",
    kicker: "Intake · Fan",
    title: "22 blades. 80% of the thrust.",
    body: "The fan is a propeller in disguise: it swallows over a tonne of air per second, and roughly 80% of total thrust comes from bypass air that never touches the core. Wide-chord blades — hollow titanium or 3D-woven carbon composite — run supersonic at the tip while the root stays subsonic, which is why the twist angle varies 40° along the span. Propulsive efficiency obeys Froude: η = 2/(1 + Vⱼ/V₀). Accelerating more air more gently always beats a fast, narrow jet — that single equation is the entire case for high bypass ratio.",
    facts: [
      { label: "Bypass ratio", value: "9–12 : 1" },
      { label: "Tip speed", value: "≈ 460 m/s" },
      { label: "Fan PR", value: "1.4 – 1.5" },
    ],
    parts: ["spinner", "fan"],
    cam: { pos: [-4.95, 0.7, 9.6], look: [-4.0, -0.1, 0] },
  },
  {
    station: "STN 2.3 → 2.5",
    kicker: "LP Compressor · Booster",
    title: "Supercharging the core.",
    body: "Three to four booster stages pre-compress the core stream before handing it to the HP spool. They sit on the N1 shaft, locked to fan speed — a forced marriage, since the fan wants to spin slowly and the compressor fast. (The geared turbofan inserts a 3:1 planetary gearbox precisely to divorce them.) Each stage works by Euler's turbomachinery equation, w = U·ΔCθ: the rotor adds swirl kinetic energy, the stator diffuses it back into static pressure. A well-behaved axial stage manages only ~1.25:1 — compression is a game of patience.",
    facts: [
      { label: "Stages", value: "3 – 4" },
      { label: "Stage PR", value: "≈ 1.25 : 1" },
      { label: "Spool", value: "N1 · fan-locked" },
    ],
    parts: ["booster"],
    cam: { pos: [-2.95, 0.6, 5.4], look: [-2.45, -0.05, 0] },
  },
  {
    station: "STN 2.5 → 3",
    kicker: "HP Compressor",
    title: "40 atmospheres. No combustion yet.",
    body: "Nine to ten stages of escalating violence raise overall pressure ratio to 40–60:1. Air leaves at ~950 K — hot enough to glow faintly — from compression alone. The annulus visibly converges: as density climbs 30×, the flow area must shrink to hold axial velocity constant. The front stages carry variable stator vanes that re-stagger at part speed; without them the rear stages choke, the front stages stall, and the engine surges — a violent flow reversal that can eject flame out of the intake. Modern HPCs hit ~91% polytropic efficiency with blisks: blade and disk machined from a single forging.",
    facts: [
      { label: "OPR", value: "40 – 60 : 1" },
      { label: "T₃ exit", value: "≈ 950 K" },
      { label: "Polytropic", value: "≈ 91% eff." },
    ],
    parts: ["hpc"],
    cam: { pos: [-1.95, 0.6, 6.0], look: [-1.25, -0.05, 0] },
  },
  {
    station: "STN 3 → 4",
    kicker: "Combustor",
    title: "A controlled explosion, held in mid-air.",
    body: "The paradox at the heart of the engine: overall the mixture is far too lean to burn (equivalence ratio φ ≈ 0.3), so the annular combustor builds a near-stoichiometric primary zone at ~2,300 K, anchored by swirler-driven recirculation, then dilutes it downstream. Residence time is 3–5 milliseconds, yet combustion efficiency exceeds 99.9%. The liner survives via effusion cooling through thousands of laser-drilled holes; LEAP's ceramic-matrix liner runs ~270 K hotter than any nickel alloy could. NOx formation grows exponentially with flame temperature — the whole reason rich-quench-lean staging exists.",
    facts: [
      { label: "Flame temp", value: "≈ 2,300 K" },
      { label: "Residence", value: "3 – 5 ms" },
      { label: "Burn eff.", value: "99.9%" },
    ],
    parts: ["combustor"],
    cam: { pos: [0.4, 0.6, 5.4], look: [1.25, 0, 0] },
  },
  {
    station: "STN 4 → 4.5",
    kicker: "HP Turbine",
    title: "Gas hotter than the metal's melting point.",
    body: "Gas hits the first rotor at 1,800–2,000 K — about 300 K above the melting point of the nickel superalloy it's cast from. Survival is plumbing: each blade is a single crystal (no grain boundaries, so no easy creep paths) threaded with serpentine cooling passages. Compressor bleed air exits through hundreds of film-cooling holes and wraps the blade in a sacrificial cool boundary layer under a ceramic thermal-barrier coat. Each blade extracts roughly 1,000 hp — a Formula 1 car per blade — while its root carries ~20,000 g of centrifugal load at 12,000+ rpm. All of it exists to spin one thing: the HP compressor, via the hollow N2 shaft.",
    facts: [
      { label: "TIT", value: "1,800–2,000 K" },
      { label: "Blade load", value: "≈ 20,000 g" },
      { label: "Per blade", value: "≈ 1,000 hp" },
    ],
    parts: ["hpt"],
    cam: { pos: [1.6, 0.55, 5.2], look: [2.45, 0, 0] },
  },
  {
    station: "STN 4.5 → 5",
    kicker: "LP Turbine",
    title: "The transmission with no gearbox.",
    body: "Five to seven stages of patient energy extraction drive the fan and booster through the long N1 shaft threading inside the N2 spool. The annulus grows aft — the exact mirror of the compressor's contraction — because the gas is expanding and slowing as enthalpy is drained. The LPT is typically the heaviest module on the engine, and its efficiency is precious leverage: one point of LPT efficiency is worth nearly a point of total fuel burn. Geared turbofans shrink it from seven stages to three by letting it spin 3× faster than the fan it drives.",
    facts: [
      { label: "Stages", value: "5 – 7" },
      { label: "Drives", value: "fan + booster · N1" },
      { label: "Exit temp", value: "≈ 850 K" },
    ],
    parts: ["lpt"],
    cam: { pos: [2.85, 0.75, 6.6], look: [3.6, 0, 0] },
  },
  {
    station: "STN 5 → 8",
    kicker: "Exhaust · Nozzle",
    title: "Where the accounting closes.",
    body: "Thrust is settled here: F = ṁ(Vⱼ − V₀) + (pₑ − pₐ)Aₑ. At takeoff power the convergent core nozzle chokes — Mach 1 exactly at the throat — and the tail cone forms the inner wall of an annular duct that trades the last of the pressure for velocity. Chevrons, the sawtooth trailing edges, deliberately thicken the shear layer between core, bypass, and ambient streams: large noisy turbulent structures break into small quiet ones, cutting low-frequency jet noise by ~3 dB. The gas leaves at ~600°C and 400 m/s, having surrendered almost everything to the turbines first.",
    facts: [
      { label: "Core jet", value: "≈ 400 m/s" },
      { label: "Throat", value: "choked · M = 1" },
      { label: "Chevrons", value: "−3 dB noise" },
    ],
    parts: ["nozzle"],
    cam: { pos: [4.6, 1.6, 7.4], look: [5.45, -0.1, 0] },
  },
]

const RAIL = ["FAN", "LPC", "HPC", "BURN", "HPT", "LPT", "NOZ"]

// ── Engine model (imperative three.js) ───────────────────────────────────────
type PartId =
  | "nacelleTop" | "nacelleBottom" | "cowlTop" | "cowlBottom"
  | "spinner" | "fan" | "booster" | "hpc" | "combustor"
  | "hpt" | "lpt" | "nozzle" | "shaft"

type Spool = "n1" | "n2"

interface PartHandle {
  id: PartId
  group: THREE.Group
  offset: THREE.Vector3
  stagger: number
  rotors: { obj: THREE.Object3D; spool: Spool }[]
  mats: THREE.MeshStandardMaterial[]
  dim: number
  lit: number
}

interface EngineHandle {
  root: THREE.Group
  parts: Record<PartId, PartHandle>
  flameMats: THREE.MeshStandardMaterial[]
  plumeMats: THREE.MeshBasicMaterial[]
  glowMats: THREE.MeshStandardMaterial[]
  flameLight: THREE.PointLight
  exhaustLight: THREE.PointLight
}

const PART_DEFS: { id: PartId; offset: [number, number, number]; stagger: number }[] = [
  { id: "nacelleTop", offset: [0, 3.7, 0], stagger: 0 },
  { id: "nacelleBottom", offset: [0, -3.7, 0], stagger: 0 },
  { id: "cowlTop", offset: [0.2, 2.5, 0], stagger: 0.1 },
  { id: "cowlBottom", offset: [0.2, -2.5, 0], stagger: 0.1 },
  { id: "spinner", offset: [-2.0, 0, 0], stagger: 0.18 },
  { id: "fan", offset: [-1.35, 0, 0], stagger: 0.26 },
  { id: "booster", offset: [-0.8, 0, 0], stagger: 0.36 },
  { id: "hpc", offset: [-0.32, 0, 0], stagger: 0.46 },
  { id: "combustor", offset: [0.37, 0, 0], stagger: 0.56 },
  { id: "hpt", offset: [1.0, 0, 0], stagger: 0.66 },
  { id: "lpt", offset: [1.72, 0, 0], stagger: 0.76 },
  { id: "nozzle", offset: [2.6, 0, 0], stagger: 0.86 },
  { id: "shaft", offset: [0, 0, 0], stagger: 1 },
]

function std(part: PartHandle, color: string, metalness: number, roughness: number) {
  const m = new THREE.MeshStandardMaterial({ color, metalness, roughness, transparent: true })
  m.userData.baseEmissive = m.emissive.clone()
  part.mats.push(m)
  return m
}

const X_AXIS_FIX = -Math.PI / 2 // cylinder/lathe Y axis → engine X axis

function cyl(
  part: PartHandle, mat: THREE.Material,
  o: { x0: number; x1: number; r0: number; r1: number; open?: boolean; thetaStart?: number; thetaLength?: number; seg?: number }
) {
  const g = new THREE.CylinderGeometry(
    o.r1, o.r0, o.x1 - o.x0, o.seg ?? 48, 1, o.open ?? false,
    o.thetaStart ?? 0, o.thetaLength ?? Math.PI * 2
  )
  const mesh = new THREE.Mesh(g, mat)
  mesh.rotation.z = X_AXIS_FIX
  mesh.position.x = (o.x0 + o.x1) / 2
  part.group.add(mesh)
  return mesh
}

function lathe(
  part: PartHandle, mat: THREE.Material, pts: [number, number][],
  phiStart = 0, phiLength = Math.PI * 2, seg = 48
) {
  const points = pts.map(([x, r]) => new THREE.Vector2(r, x))
  const g = new THREE.LatheGeometry(points, seg, phiStart, phiLength)
  const mesh = new THREE.Mesh(g, mat)
  mesh.rotation.z = X_AXIS_FIX
  part.group.add(mesh)
  return mesh
}

function ringTorus(part: PartHandle, mat: THREE.Material, x: number, r: number, tube: number) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 10, 64), mat)
  mesh.rotation.y = Math.PI / 2
  mesh.position.x = x
  part.group.add(mesh)
  return mesh
}

interface BladeRingOpts {
  x: number
  hub: number
  tip: number
  count: number
  chord: number
  thick: number
  pitch: number
  mat: THREE.Material
  spool?: Spool
  geometry?: THREE.BufferGeometry
}

function bladeRing(part: PartHandle, o: BladeRingOpts) {
  const span = o.tip - o.hub
  const g = o.geometry ?? new THREE.BoxGeometry(o.chord, span, o.thick)
  const inst = new THREE.InstancedMesh(g, o.mat, o.count)
  inst.frustumCulled = false
  const m = new THREE.Matrix4()
  const t = new THREE.Matrix4()
  for (let i = 0; i < o.count; i++) {
    const th = (i / o.count) * Math.PI * 2
    m.makeRotationX(th)
    t.makeTranslation(0, o.hub + span / 2, 0)
    m.multiply(t)
    t.makeRotationY(o.pitch)
    m.multiply(t)
    inst.setMatrixAt(i, m)
  }
  inst.instanceMatrix.needsUpdate = true
  const holder = new THREE.Group()
  holder.position.x = o.x
  holder.add(inst)
  part.group.add(holder)
  if (o.spool) part.rotors.push({ obj: holder, spool: o.spool })
  return holder
}

function fanBladeGeometry() {
  const chord = 0.36
  const span = 1.66
  const geo = new THREE.PlaneGeometry(chord, span, 6, 14)
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const v = (y + span / 2) / span
    const c = x / (chord / 2)
    const camber = 0.045 * Math.cos((c * Math.PI) / 2) * (0.4 + 0.6 * v)
    const widen = 0.7 + 0.45 * v
    const sweptX = x * widen + 0.1 * v * v
    const tw = 0.9 - 0.55 * v
    const cos = Math.cos(tw)
    const sin = Math.sin(tw)
    pos.setXYZ(i, sweptX * cos + camber * sin, y, -sweptX * sin + camber * cos)
  }
  geo.computeVertexNormals()
  return geo
}

// additive plume that fades to black (= invisible) toward the tail
function plumeCone(
  part: PartHandle,
  o: { x0: number; x1: number; r0: number; r1: number; c0: string; c1: string }
) {
  const len = o.x1 - o.x0
  const g = new THREE.CylinderGeometry(o.r1, o.r0, len, 32, 12, true)
  const pos = g.attributes.position as THREE.BufferAttribute
  const colors = new Float32Array(pos.count * 3)
  const cHead = new THREE.Color(o.c0)
  const cTail = new THREE.Color(o.c1)
  const tmp = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const u = (pos.getY(i) + len / 2) / len // 0 front → 1 rear after axis fix
    tmp.copy(cHead).lerp(cTail, u * u)
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3))
  const mat = new THREE.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
    side: THREE.DoubleSide, toneMapped: false,
  })
  const mesh = new THREE.Mesh(g, mat)
  mesh.rotation.z = X_AXIS_FIX
  mesh.position.x = (o.x0 + o.x1) / 2
  part.group.add(mesh)
  return mat
}

function buildEngine(): EngineHandle {
  const root = new THREE.Group()
  const parts = {} as Record<PartId, PartHandle>
  for (const def of PART_DEFS) {
    const part: PartHandle = {
      id: def.id,
      group: new THREE.Group(),
      offset: new THREE.Vector3(...def.offset),
      stagger: def.stagger,
      rotors: [],
      mats: [],
      dim: 1,
      lit: 0,
    }
    parts[def.id] = part
    root.add(part.group)
  }

  // ── Nacelle halves — thin shell, long cowl ──
  const nacelleProfile: [number, number][] = [
    [-3.5, 2.14], [-3.46, 2.27], [-3.28, 2.37], [-2.7, 2.45], [-1.9, 2.48],
    [-1.1, 2.45], [-0.5, 2.32], [-0.25, 2.17],
    [-0.32, 2.12], [-1.1, 2.38], [-2.2, 2.41], [-3.1, 2.31], [-3.42, 2.19], [-3.5, 2.14],
  ]
  for (const [id, phi] of [["nacelleTop", Math.PI], ["nacelleBottom", 0]] as const) {
    const p = parts[id]
    const skin = std(p, "#e2e6ea", 0.15, 0.48)
    skin.side = THREE.DoubleSide
    lathe(p, skin, nacelleProfile, phi, Math.PI, 64)
    const linerMat = std(p, "#566071", 0.55, 0.5)
    linerMat.side = THREE.DoubleSide
    cyl(p, linerMat, { x0: -3.3, x1: -0.4, r0: 2.26, r1: 2.3, open: true, thetaStart: phi, thetaLength: Math.PI })
  }

  // ── Core cowl halves ──
  const cowlProfile: [number, number][] = [
    [-1.75, 1.06], [-1.2, 1.11], [-0.3, 1.06], [0.7, 1.0], [1.5, 1.05], [2.15, 1.14], [2.6, 1.18],
    [2.56, 1.13], [2.15, 1.09], [1.5, 1.0], [0.6, 0.96], [-0.6, 1.02], [-1.7, 1.02], [-1.75, 1.06],
  ]
  for (const [id, phi] of [["cowlTop", Math.PI], ["cowlBottom", 0]] as const) {
    const p = parts[id]
    const m = std(p, "#b4bac3", 0.78, 0.38)
    m.side = THREE.DoubleSide
    lathe(p, m, cowlProfile, phi, Math.PI, 56)
  }

  // ── Spinner ──
  {
    const p = parts.spinner
    const mat = std(p, "#c9ced8", 0.9, 0.3)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.62, 40), mat)
    cone.rotation.z = Math.PI / 2 // tip → −x
    cone.position.x = -2.76
    p.group.add(cone)
    p.rotors.push({ obj: cone, spool: "n1" })
  }

  // ── Fan ──
  {
    const p = parts.fan
    const hubMat = std(p, "#b6bcc6", 0.9, 0.35)
    cyl(p, hubMat, { x0: -2.45, x1: -2.02, r0: 0.56, r1: 0.5 })
    const bladeMat = std(p, "#d9dde4", 0.95, 0.22)
    bladeMat.side = THREE.DoubleSide
    bladeRing(p, {
      x: -2.26, hub: 0.54, tip: 2.2, count: 22, chord: 0.36, thick: 0.018,
      pitch: 0, mat: bladeMat, spool: "n1", geometry: fanBladeGeometry(),
    })
    ringTorus(p, std(p, "#7d838d", 0.9, 0.4), -2.26, 0.56, 0.04)
  }

  // ── Booster (LPC) ──
  {
    const p = parts.booster
    const drumMat = std(p, "#9aa1ad", 0.88, 0.42)
    cyl(p, drumMat, { x0: -1.88, x1: -1.28, r0: 0.5, r1: 0.52 })
    const rotorMat = std(p, "#cfd4dc", 0.92, 0.28)
    const statorMat = std(p, "#565d68", 0.85, 0.5)
    const tips = [0.92, 0.85, 0.79]
    for (let i = 0; i < 3; i++) {
      bladeRing(p, {
        x: -1.78 + i * 0.19, hub: 0.5, tip: tips[i], count: 28,
        chord: 0.09, thick: 0.013, pitch: 0.58, mat: rotorMat, spool: "n1",
      })
      if (i < 2) {
        bladeRing(p, {
          x: -1.685 + i * 0.19, hub: 0.5, tip: tips[i] - 0.03, count: 32,
          chord: 0.07, thick: 0.011, pitch: -0.5, mat: statorMat,
        })
      }
    }
  }

  // ── HP compressor ──
  {
    const p = parts.hpc
    const drumMat = std(p, "#a7adb8", 0.9, 0.4)
    lathe(p, drumMat, [
      [-1.1, 0.38], [-0.7, 0.4], [-0.2, 0.42], [0.25, 0.43], [0.5, 0.42],
      [0.5, 0.3], [-1.1, 0.3], [-1.1, 0.38],
    ], 0, Math.PI * 2, 40)
    const rotorMat = std(p, "#d4d8df", 0.92, 0.26)
    const statorMat = std(p, "#525965", 0.85, 0.52)
    for (let i = 0; i < 9; i++) {
      const x = -1.0 + i * 0.165
      const tip = 0.8 - i * 0.036
      bladeRing(p, {
        x, hub: 0.4, tip, count: 30, chord: 0.078, thick: 0.011,
        pitch: 0.55, mat: rotorMat, spool: "n2",
      })
      if (i < 8) {
        bladeRing(p, {
          x: x + 0.082, hub: 0.4, tip: tip - 0.025, count: 34,
          chord: 0.06, thick: 0.009, pitch: -0.5, mat: statorMat,
        })
      }
    }
  }

  // ── Combustor ──
  {
    const p = parts.combustor
    const cut = { thetaStart: 0.85, thetaLength: Math.PI * 2 - 1.7 }
    const caseMat = std(p, "#b08d57", 0.85, 0.42)
    caseMat.side = THREE.DoubleSide
    cyl(p, caseMat, { x0: 0.5, x1: 1.25, r0: 0.86, r1: 0.84, open: true, ...cut })
    const linerMat = std(p, "#8a6f47", 0.8, 0.5)
    linerMat.side = THREE.DoubleSide
    cyl(p, linerMat, { x0: 0.58, x1: 1.18, r0: 0.66, r1: 0.64, open: true, ...cut })
    cyl(p, linerMat, { x0: 0.58, x1: 1.18, r0: 0.4, r1: 0.4, open: true })
    const domeMat = std(p, "#6e5b3d", 0.8, 0.55)
    domeMat.side = THREE.DoubleSide
    const dome = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.66, 48), domeMat)
    dome.rotation.y = -Math.PI / 2
    dome.position.x = 0.58
    p.group.add(dome)
    const nozzleMat = std(p, "#7d838d", 0.9, 0.4)
    for (let i = 0; i < 14; i++) {
      const th = (i / 14) * Math.PI * 2
      const inj = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 10), nozzleMat)
      inj.rotation.z = X_AXIS_FIX
      inj.position.set(0.5, Math.cos(th) * 0.53, Math.sin(th) * 0.53)
      p.group.add(inj)
    }
    // flame — emissive, bloom-caught
    const flameMat = new THREE.MeshStandardMaterial({
      color: "#000000", emissive: "#ff7b1f", emissiveIntensity: 0,
      transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    })
    const coreFlameMat = new THREE.MeshStandardMaterial({
      color: "#000000", emissive: "#ffc46b", emissiveIntensity: 0,
      transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
    })
    cyl(p, flameMat, { x0: 0.62, x1: 1.16, r0: 0.53, r1: 0.52, open: true })
    cyl(p, coreFlameMat, { x0: 0.62, x1: 0.98, r0: 0.49, r1: 0.47, open: true })
    const flameLight = new THREE.PointLight("#ff8a2a", 0, 7, 1.8)
    flameLight.position.set(0.88, 0.1, 0.6)
    p.group.add(flameLight)
    p.group.userData.flameLight = flameLight
    p.group.userData.flameMats = [flameMat, coreFlameMat]
  }

  // ── HP turbine ──
  {
    const p = parts.hpt
    const hotMat = std(p, "#7d7268", 0.9, 0.45)
    const ngvMat = std(p, "#5c5248", 0.85, 0.5)
    bladeRing(p, { x: 1.32, hub: 0.42, tip: 0.74, count: 30, chord: 0.085, thick: 0.013, pitch: -0.6, mat: ngvMat })
    for (let i = 0; i < 2; i++) {
      const x = 1.44 + i * 0.17
      cyl(p, hotMat, { x0: x - 0.04, x1: x + 0.04, r0: 0.46, r1: 0.46, seg: 36 })
      bladeRing(p, {
        x, hub: 0.46, tip: 0.78 + i * 0.04, count: 38, chord: 0.09,
        thick: 0.013, pitch: 0.62, mat: hotMat, spool: "n2",
      })
    }
  }

  // ── LP turbine — diverging annulus, shrouded tips ──
  {
    const p = parts.lpt
    const lptMat = std(p, "#8b8278", 0.9, 0.42)
    const statMat = std(p, "#544c44", 0.85, 0.52)
    lathe(p, std(p, "#9a917f", 0.88, 0.45), [
      [1.74, 0.38], [2.3, 0.37], [2.72, 0.36], [2.72, 0.3], [1.74, 0.32], [1.74, 0.38],
    ], 0, Math.PI * 2, 36)
    for (let i = 0; i < 5; i++) {
      const x = 1.82 + i * 0.21
      const tip = 0.78 + i * 0.08
      cyl(p, lptMat, { x0: x - 0.035, x1: x + 0.035, r0: 0.42, r1: 0.42, seg: 32 })
      const holder = bladeRing(p, {
        x, hub: 0.4, tip, count: 30, chord: 0.12, thick: 0.013,
        pitch: 0.5, mat: lptMat, spool: "n1",
      })
      const shroud = new THREE.Mesh(new THREE.TorusGeometry(tip, 0.012, 8, 64), lptMat)
      shroud.rotation.y = Math.PI / 2
      holder.add(shroud)
      if (i < 4) {
        bladeRing(p, {
          x: x + 0.105, hub: 0.4, tip: tip + 0.02, count: 34,
          chord: 0.08, thick: 0.01, pitch: -0.45, mat: statMat,
        })
      }
    }
  }

  // ── Nozzle + tail plug + exhaust plume ──
  {
    const p = parts.nozzle
    const hotMat = std(p, "#5d5750", 0.9, 0.4)
    hotMat.side = THREE.DoubleSide
    lathe(p, hotMat, [[2.62, 1.18], [2.9, 1.0], [3.2, 0.8], [3.5, 0.66], [3.72, 0.58]], 0, Math.PI * 2, 56)
    const plugMat = std(p, "#74695f", 0.9, 0.42)
    const plug = new THREE.Mesh(new THREE.ConeGeometry(0.46, 1.15, 36), plugMat)
    plug.rotation.z = X_AXIS_FIX // tip → +x
    plug.position.x = 3.4
    p.group.add(plug)
    // hot ring just inside the exit — gives bloom something to catch
    const glowMat = new THREE.MeshStandardMaterial({
      color: "#000000", emissive: "#ff9544", emissiveIntensity: 0,
      transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide,
    })
    cyl(p, glowMat, { x0: 3.56, x1: 3.7, r0: 0.6, r1: 0.56, open: true })
    const plumeMats = [
      plumeCone(p, { x0: 3.72, x1: 5.7, r0: 0.52, r1: 1.0, c0: "#d85a14", c1: "#000000" }),
      plumeCone(p, { x0: 3.72, x1: 4.9, r0: 0.38, r1: 0.52, c0: "#ffd9a0", c1: "#000000" }),
    ]
    const exhaustLight = new THREE.PointLight("#ff9a40", 0, 8, 1.8)
    exhaustLight.position.set(4.2, 0, 0)
    p.group.add(exhaustLight)
    p.group.userData.exhaustLight = exhaustLight
    p.group.userData.plumeMats = plumeMats
    p.group.userData.glowMats = [glowMat]
  }

  // ── Shaft (N1) ──
  {
    const p = parts.shaft
    const mat = std(p, "#b3b9c3", 0.92, 0.3)
    cyl(p, mat, { x0: -2.4, x1: 2.72, r0: 0.085, r1: 0.085, seg: 20 })
    const ringMat = std(p, "#6e747e", 0.88, 0.45)
    for (const x of [-1.4, 0.2, 1.7]) ringTorus(p, ringMat, x, 0.12, 0.03)
  }

  // lets the fan read inside the assembled intake instead of a black hole
  const intakeLight = new THREE.PointLight("#dce6f5", 11, 5.5, 1.5)
  intakeLight.position.set(-3.0, 0.2, 0.7)
  root.add(intakeLight)

  return {
    root,
    parts,
    flameMats: parts.combustor.group.userData.flameMats as THREE.MeshStandardMaterial[],
    plumeMats: parts.nozzle.group.userData.plumeMats as THREE.MeshBasicMaterial[],
    glowMats: parts.nozzle.group.userData.glowMats as THREE.MeshStandardMaterial[],
    flameLight: parts.combustor.group.userData.flameLight as THREE.PointLight,
    exhaustLight: parts.nozzle.group.userData.exhaustLight as THREE.PointLight,
  }
}

// ── Camera keyframes ──────────────────────────────────────────────────────────
interface CamKf { p: number; pos: THREE.Vector3; look: THREE.Vector3 }

function buildCameraKeyframes(): CamKf[] {
  const kf = (p: number, pos: [number, number, number], look: [number, number, number]): CamKf => ({
    p, pos: new THREE.Vector3(...pos), look: new THREE.Vector3(...look),
  })
  const list: CamKf[] = [
    kf(0, [-6.6, 1.2, 7.4], [-1.3, -0.62, 0]),
    kf(EXPLODE_START, [-5.0, 1.6, 9.6], [-0.6, -0.2, 0]),
    kf(0.135, [1.6, 2.4, 13.0], [0.4, 0, 0]),
    kf(EXPLODE_END, [0.6, 1.6, 14.2], [0.5, 0, 0]),
  ]
  const w = (TOUR_END - TOUR_START) / SECTIONS.length
  SECTIONS.forEach((s, i) => {
    const a = TOUR_START + i * w
    list.push(kf(a + 0.014, s.cam.pos, s.cam.look))
    const drift: [number, number, number] = [s.cam.pos[0] + 0.3, s.cam.pos[1] + 0.1, s.cam.pos[2]]
    list.push(kf(a + w - 0.014, drift, s.cam.look))
  })
  list.push(kf(REASM_START + 0.012, [1.4, 2.2, 13.2], [0.3, 0, 0]))
  list.push(kf(REASM_END, [4.9, 1.5, 9.6], [0.2, -0.3, 0]))
  list.push(kf(1, [5.8, 1.1, 8.8], [0.4, -0.35, 0]))
  return list
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ progress }: { progress: MotionValue<number> }) {
  const engine = useMemo(buildEngine, [])
  const camKfs = useMemo(buildCameraKeyframes, [])
  const spotRef = useRef<THREE.PointLight>(null)
  const tmp = useMemo(() => ({
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    amber: new THREE.Color("#f59e0b"),
    speed: { n1: 0, n2: 0 },
  }), [])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    const t = state.clock.elapsedTime
    const p = progress.get()
    const e = explodeAmount(p)
    const active = sectionAt(p)
    const k = 1 - Math.exp(-6 * dt)

    // running intensity: full when assembled at the ends, gentle during the tour
    const running =
      p < EXPLODE_START ? 1 :
      p > REASM_END ? 0.8 + 1.6 * smooth((p - REASM_END) / (1 - REASM_END)) :
      0.3
    const targetN1 = 2.3 * running
    const targetN2 = -3.7 * running
    tmp.speed.n1 += (targetN1 - tmp.speed.n1) * k
    tmp.speed.n2 += (targetN2 - tmp.speed.n2) * k

    for (const id of Object.keys(engine.parts) as PartId[]) {
      const part = engine.parts[id]
      const f = smooth(clamp01((e - part.stagger * 0.4) / 0.6))
      part.group.position.copy(part.offset).multiplyScalar(f)

      for (const r of part.rotors) {
        r.obj.rotation.x += (r.spool === "n1" ? tmp.speed.n1 : tmp.speed.n2) * dt
      }

      let targetDim = 1
      let targetLit = 0
      if (active >= 0) {
        const focused = SECTIONS[active].parts.includes(id)
        targetDim = focused ? 1 : id === "shaft" ? 0.3 : 0.12
        targetLit = focused ? 1 : 0
      }
      part.dim += (targetDim - part.dim) * k
      part.lit += (targetLit - part.lit) * k
      for (const m of part.mats) {
        m.opacity = part.dim
        m.envMapIntensity = part.dim // reflections ignore opacity, so dim them too
        m.emissive.copy(m.userData.baseEmissive as THREE.Color).lerp(tmp.amber, part.lit * 0.09)
      }
    }

    // combustion: alive when assembled-running or when the burner is on stage
    const flick = 0.78 + 0.16 * Math.sin(t * 21) * Math.sin(t * 7.3 + 1.7) + 0.06 * Math.sin(t * 47)
    const flameOn =
      p < EXPLODE_START ? 0.7 :
      active === 3 ? 1.25 :
      p > REASM_END ? 1.4 : 0.06
    for (const m of engine.flameMats) {
      m.emissiveIntensity += (flameOn * 3.2 * flick - m.emissiveIntensity) * k
      m.opacity += (Math.min(1, flameOn) * 0.85 - m.opacity) * k
    }
    engine.flameLight.intensity += (flameOn * 26 * flick - engine.flameLight.intensity) * k

    const exhaustOn = p < EXPLODE_START ? 0.8 : active === 6 ? 1.0 : p > REASM_END ? 1.25 : 0
    for (const m of engine.plumeMats) {
      m.opacity += (Math.min(1, exhaustOn) * 0.46 * flick - m.opacity) * k
    }
    for (const m of engine.glowMats) {
      m.emissiveIntensity += (exhaustOn * 2.8 * flick - m.emissiveIntensity) * k
    }
    engine.exhaustLight.intensity += (exhaustOn * 18 * flick - engine.exhaustLight.intensity) * k

    // highlight spotlight follows the active part
    if (spotRef.current) {
      const targetI = active >= 0 ? 42 : 0
      spotRef.current.intensity += (targetI - spotRef.current.intensity) * k
      if (active >= 0) {
        const look = SECTIONS[active].cam.look
        spotRef.current.position.set(look[0], 2.4, 2.4)
      }
    }

    // camera along keyframes
    let i = 0
    while (i < camKfs.length - 2 && camKfs[i + 1].p < p) i++
    const a = camKfs[i]
    const b = camKfs[i + 1]
    const u = smooth(clamp01((p - a.p) / Math.max(1e-5, b.p - a.p)))
    tmp.pos.lerpVectors(a.pos, b.pos, u)
    tmp.look.lerpVectors(a.look, b.look, u)
    tmp.pos.y += Math.sin(t * 0.5) * 0.05
    // distances are tuned for widescreen — back off as the viewport narrows
    const cam = state.camera as THREE.PerspectiveCamera
    const widen = Math.min(2.2, Math.max(1, 1.45 / cam.aspect))
    tmp.pos.sub(tmp.look).multiplyScalar(widen).add(tmp.look)
    state.camera.position.copy(tmp.pos)
    state.camera.lookAt(tmp.look)
  })

  return (
    <>
      <primitive object={engine.root} />
      <ambientLight intensity={0.26} />
      <directionalLight position={[6, 9, 7]} intensity={1.9} />
      <directionalLight position={[-7, 4, -6]} intensity={0.55} color="#9bb4ff" />
      <directionalLight position={[0, -5, 4]} intensity={0.25} color="#8fa3bd" />
      <pointLight ref={spotRef} color="#f59e0b" intensity={0} distance={9} decay={1.8} />
      <Environment resolution={128}>
        <Lightformer intensity={2.4} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[16, 7, 1]} />
        <Lightformer intensity={1.1} position={[-8, 2, 6]} rotation-y={Math.PI / 3} scale={[9, 3, 1]} color="#cfe0ff" />
        <Lightformer intensity={0.9} position={[9, -1, 5]} rotation-y={-Math.PI / 3} scale={[7, 3, 1]} color="#ffd9a0" />
      </Environment>
      <EffectComposer>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1.1} luminanceSmoothing={0.3} />
      </EffectComposer>
    </>
  )
}

// ── Overlay pieces ────────────────────────────────────────────────────────────
function SectionCard({ section, visible }: { section: Section; visible: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -24 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="pointer-events-none absolute left-4 right-4 bottom-6 md:bottom-auto md:right-auto md:left-10 lg:left-16 md:top-1/2 md:-translate-y-1/2 md:max-w-[26rem]"
    >
      <div className="rounded-2xl border border-amber-400/20 bg-black/60 backdrop-blur-md p-6 md:p-7">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <span className="text-[10px] font-mono tracking-[0.3em] text-amber-400 uppercase">
            {section.station}
          </span>
          <span className="text-[10px] tracking-[0.3em] text-[#94a3b8]/70 uppercase">
            {section.kicker}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-white leading-snug mb-3">
          {section.title}
        </h3>
        <p className="text-[#94a3b8] text-xs md:text-sm leading-relaxed mb-5">
          {section.body}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {section.facts.map((f) => (
            <div key={f.label} className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-2">
              <p className="text-[9px] uppercase tracking-[0.18em] text-amber-400/80 mb-1">{f.label}</p>
              <p className="text-[11px] md:text-xs font-mono text-white leading-tight">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function EngineTeardown3D() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: "200px 0px 200px 0px" })
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const [active, setActive] = useState(-1)
  const [phase, setPhase] = useState<Phase>("intro")
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(sectionAt(v))
    setPhase(phaseAt(v))
  })

  return (
    <section ref={ref} id="teardown" className="relative h-[1150vh] bg-[#04060a]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <Canvas
          dpr={[1, 1.75]}
          frameloop={inView ? "always" : "never"}
          camera={{ fov: 42, near: 0.1, far: 90, position: [4.8, 1.5, 9.8] }}
          gl={{ antialias: true }}
          className="absolute inset-0 z-0"
        >
          <color attach="background" args={["#04060a"]} />
          <fog attach="fog" args={["#04060a", 18, 38]} />
          <Scene progress={scrollYProgress} />
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-[#04060a] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#04060a] to-transparent" />

        {/* Intro */}
        <motion.div
          data-overlay="intro"
          initial={false}
          animate={{ opacity: phase === "intro" ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-6"
        >
          <p className="text-[10px] tracking-[0.45em] text-amber-400 uppercase mb-4 font-medium">
            Interactive Teardown
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-3">
            Anatomy of Thrust.
          </h2>
          <p className="text-[#94a3b8] text-sm md:text-base max-w-md leading-relaxed">
            Scroll to pull a high-bypass turbofan apart, station by station — from intake to exhaust.
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="mt-6 text-[#94a3b8]"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none" aria-hidden>
              <path d="M7 0v16M1 11l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Disassembly caption */}
        <motion.div
          initial={false}
          animate={{ opacity: phase === "disasm" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center px-6"
        >
          <p className="text-[11px] font-mono tracking-[0.3em] text-amber-400/90 uppercase text-center">
            Modular disassembly — separating along the rotor axis
          </p>
        </motion.div>

        {/* Reassembly caption */}
        <motion.div
          initial={false}
          animate={{ opacity: phase === "reasm" ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center px-6"
        >
          <p className="text-[11px] font-mono tracking-[0.3em] text-amber-400/90 uppercase text-center">
            Reassembly — 30,000 parts, one machine
          </p>
        </motion.div>

        {/* Section cards */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {SECTIONS.map((s, i) => (
            <SectionCard key={s.station} section={s} visible={active === i} />
          ))}
        </div>

        {/* Station rail */}
        <div className="pointer-events-none absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-3">
          {RAIL.map((label, i) => (
            <div key={label} className="flex items-center justify-end gap-2">
              <span
                className={`text-[9px] font-mono tracking-[0.25em] transition-colors duration-300 ${
                  active === i ? "text-amber-400" : "text-[#94a3b8]/40"
                }`}
              >
                {label}
              </span>
              <span
                className={`h-px transition-all duration-300 ${
                  active === i ? "w-6 bg-amber-400" : "w-3 bg-[#94a3b8]/30"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Finale */}
        <motion.div
          initial={false}
          animate={{ opacity: phase === "finale" ? 1 : 0, y: phase === "finale" ? 0 : 24 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex flex-col items-center text-center px-6"
        >
          <p className="text-[10px] tracking-[0.45em] text-amber-400 uppercase mb-4 font-medium">
            The Brayton Cycle
          </p>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-none mb-4">
            Suck. Squeeze. Bang. Blow.
          </h2>
          <p className="text-[#94a3b8] text-sm md:text-base max-w-lg leading-relaxed">
            Ideal thermal efficiency η = 1 − r⁻⁽ᵞ⁻¹⁾ᐟᵞ — at a 50:1 pressure ratio that is 67%,
            and modern cores convert over half the fuel&apos;s energy into work. Ninety years after
            Whittle&apos;s patent, it is still the same four words.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
