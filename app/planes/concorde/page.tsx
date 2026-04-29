"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ─── Engineering sections ────────────────────────────────────────────────────

const SECTIONS = [
  {
    label: "01 — Aerodynamics",
    title: "Ogival Delta Wing",
    body: "Concorde has no horizontal tailplane. The wing-body simultaneously generates lift, pitch stability, and control through vortex aerodynamics that become most efficient above Mach 1.3. Leading-edge sweep varies from 55° at the root to 84° at the apex — the S-curve 'ogee' geometry that names the configuration. At low speeds a powerful conical vortex above the wing provides lift at attack angles of 10–17°. At supersonic cruise the same vortex organises into a stable shock system. The consequence: approach attitudes are so steep that forward runway visibility from a conventional fixed cockpit is impossible.",
    stats: [{ value: "167.2 m²", label: "Wing Area" }, { value: "84°", label: "Apex Sweep" }],
    right: false,
  },
  {
    label: "02 — Propulsion",
    title: "Olympus 593 — Dry Supersonic Cruise",
    body: "Four Olympus 593 Mk610 afterburning turbojets produce 38,050 lbf (169.3 kN) with reheat and 31,000 lbf dry. Reheat is used only for takeoff and the transonic push to Mach 1.7. Above that, the engine sustains Mach 2.04 cruise on dry power alone — possible because intake ram compression at Mach 2 pre-heats the incoming air to 127°C and 2.5× ambient pressure before the compressor stage. The compressor receives air already at conditions a sea-level engine would only reach mid-cycle. Concorde is the only commercial aircraft ever to sustain cruise above Mach 1 without afterburner.",
    stats: [{ value: "38,050 lbf", label: "Reheat Thrust" }, { value: "15.5 : 1", label: "Pressure Ratio" }],
    right: true,
  },
  {
    label: "03 — Intake Engineering",
    title: "Shock-Compression Intake System",
    body: "Each engine inlet houses hydraulically actuated variable ramps that adjust continuously from Mach 0 to Mach 2.04. The ramps capture the oblique shock wave created at supersonic speed and use it to decelerate intake air from Mach 2 to subsonic before the compressor face — a process called ram recovery. At cruise, this intake system contributes approximately 63% of total propulsive force, more than engine combustion itself. Four spill doors and auxiliary inlets manage excess airflow across the full flight envelope. Thermodynamically, the intake does more work than the engine it feeds.",
    stats: [{ value: "63%", label: "Thrust from Ram at Mach 2" }, { value: "2 → 0.5", label: "Mach at Compressor Face" }],
    right: false,
  },
  {
    label: "04 — Thermal Engineering",
    title: "Kinetic Heating and the Aluminium Airframe",
    body: "Aerodynamic friction heats the skin to 127°C at cruise and the nose tip to 180°C — temperatures at which standard aerospace aluminium creeps and fatigues. Concorde uses RR.58 (AU2GN), an aluminium-copper alloy originally developed for aero-engine pistons, whose mechanical properties degrade least across 100–180°C. The airframe elongates approximately 300 mm between cold ground and hot cruise. Fuel serves as a primary heat sink, absorbing thermal energy from hydraulics and avionics before combustion. Titanium was used only where unavoidable; its weight penalty across an entire fuselage would have made the programme commercially impossible.",
    stats: [{ value: "127°C", label: "Skin Temp at Cruise" }, { value: "300 mm", label: "Thermal Elongation" }],
    right: true,
  },
  {
    label: "05 — Pilot Visibility",
    title: "Variable-Droop Nose Mechanism",
    body: "The delta wing's 10.5–12° approach angle of attack renders the runway invisible from a conventional fixed cockpit. Concorde's nose droops hydraulically to 12.5° for landing and 5° for takeoff, lowering the entire visor section ahead of the flight deck. The mechanism and visor together weigh approximately 1,800 kg and actuate in 8.5 seconds. At supersonic cruise, the nose locks raised and a metal visor shields the cockpit windows — polycarbonate cannot survive sustained Mach 2 kinetic heating at 180°C. The raised visor also restores the ogival nose profile, reducing aerodynamic drag at cruise.",
    stats: [{ value: "12.5°", label: "Max Droop Angle" }, { value: "1,800 kg", label: "Nose + Visor Mass" }],
    right: false,
  },
  {
    label: "06 — Stability",
    title: "Fuel Transfer for Supersonic Trim",
    body: "As Concorde accelerates through Mach 1, the aerodynamic centre shifts aft by 6–8% of chord — inherent to all supersonic wings. Rather than deflecting trim surfaces (which generate significant drag), Concorde pumps fuel rearward into trim tank 11 (capacity 11,500 L) to shift the centre of gravity aft to match the new aerodynamic centre. The result is zero trim drag at Mach 2 cruise. Deceleration reverses the transfer. Pilots monitor the CG-to-lift margin on a dedicated display throughout acceleration and deceleration. The system saves an estimated 1–2% total fuel burn — significant on a route-limited aircraft carrying 100 passengers over the North Atlantic.",
    stats: [{ value: "11,500 L", label: "Trim Tank 11" }, { value: "6–8%", label: "Chord CG Shift at Mach 1" }],
    right: true,
  },
]

const SPECS = [
  { value: "Mach 2.04", label: "Cruise Speed" },
  { value: "60,000 ft", label: "Cruise Altitude" },
  { value: "127°C", label: "Skin Temperature" },
  { value: "3h 30m", label: "London → New York" },
]

// Scroll-driven model pose per section.
// posX/posY : shift model left/right/up/down in frame (camera fixed at origin)
// rotX : tilt up/down.  rotY : spin left/right.  rotZ : roll/bank
// camZ : camera distance — smaller = zoomed in
const POSES = [
  // Hero — full aircraft, gentle front-left 3/4, wide  
  { scrollStart: 0,    scrollEnd: 0.14, posX:  0.30, posY:  2.45, rotX:  0.00, rotY:  0.00,          rotZ: 0,    camZ: 3.8, scale: 1.2  },
  // Delta wing — tilt nose down ~60° so the ogee planform is exposed from above 
  { scrollStart: 0.14, scrollEnd: 0.28, posX: -0.80, posY:  8.00, rotX:  1.20, rotY:  0.30,          rotZ: 0,    camZ: 3.8, scale: 3.9  },
  // Engines — rotate to rear (~150°), tilt to expose four Olympus nacelles on underside   
  { scrollStart: 0.28, scrollEnd: 0.42, posX:  0.75, posY:  2.00, rotX: -0.22, rotY: -0.64,          rotZ: 0,    camZ: 3.3, scale: 1.2  },
  // Intake ramps — front-under angle: slight tilt upward exposes the intake faces
  { scrollStart: 0.42, scrollEnd: 0.56, posX: -3.5, posY:  6.90, rotX:  0.31, rotY:  1.16,          rotZ: -0.39, camZ: 3.20, scale: 3.0  },
  // Thermal — pure side profile, full fuselage skin surface visible end-to-end 
  { scrollStart: 0.56, scrollEnd: 0.70, posX: -0.55, posY:  6.90, rotX:  0.36, rotY:  0.46,          rotZ: -0.39,  camZ: 10.0, scale: 3.0  },
  // Droop nose — close front view, nose and cockpit fill the frame 
  { scrollStart: 0.70, scrollEnd: 0.89, posX:  0.75, posY:  4.90, rotX:  0.41, rotY: 0.36,          rotZ: -0.04,    camZ: 3.00, scale: 1.90 },
  // Fuel trim — pull back wide, pure side profile shows full fuselage tank layout
  { scrollStart: 0.89, scrollEnd: 0.93, posX: -1.45, posY:  2.80, rotX:  0.31, rotY:  -3.14,  rotZ: -0.14,    camZ: 1.0, scale: 1.90 },
  // Specs — clean left-profile wide shot for the summary stats strip
  { scrollStart: 0.93, scrollEnd: 1.0,  posX:  -1.45, posY:  2.80, rotX:  0.31, rotY:  -3.14,   rotZ:  -2.2,    camZ: 1.0, scale: 1.90v},
]

const POSE_LABELS = ["Hero", "Delta", "Engines", "Intakes", "Thermal", "Nose", "Fuel", "Specs"]
const SLIDERS = [
  { key: "posX",  min: -3,       max: 3,       step: 0.05 },
  { key: "posY",  min: -10,      max: 20,      step: 0.05 },
  { key: "rotX",  min: -3.14,    max: 3.14,    step: 0.05 },
  { key: "rotY",  min: -3.14,    max: 3.14,    step: 0.05 },
  { key: "rotZ",  min: -3.14,    max: 3.14,    step: 0.05 },
  { key: "camZ",  min: 1,        max: 10,      step: 0.1  },
  { key: "scale", min: 0.1,      max: 10,      step: 0.05 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function smoothstep(a: number, b: number, t: number) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return x * x * (3 - 2 * x)
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConcordePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posesRef   = useRef(POSES.map(p => ({ ...p })))
  const editIdxRef = useRef(0)
  const previewRef = useRef(false)
  const [editIdx,   setEditIdx]   = useState(0)
  const [preview,   setPreview]   = useState(false)
  const [, redraw] = useState(0)

  const setEdit = (i: number) => { editIdxRef.current = i; setEditIdx(i) }
  const togglePreview = () => {
    previewRef.current = !previewRef.current
    setPreview(p => !p)
  }
  const updatePose = (key: string, val: number) => {
    ;(posesRef.current[editIdxRef.current] as Record<string, number>)[key] = val
    redraw(n => n + 1)
  }

  useEffect(() => {
    if (!canvasRef.current) return

    let animId: number
    let cancelled = false
    const cleanupFns: Array<() => void> = []

    ;(async () => {
      const THREE   = await import("three")
      if (cancelled) return
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js" as string)
      const { RGBELoader } = await import("three/examples/jsm/loaders/RGBELoader.js" as string)
      if (cancelled || !canvasRef.current) return

      // ── Renderer ────────────────────────────────────────────────────────────
      const canvas = canvasRef.current
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 0.9
      renderer.setClearColor(0x04060a, 1)
      cleanupFns.push(() => renderer.dispose())

      // ── Scene / camera ───────────────────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100)
      camera.position.set(0, 0, 4.5)
      camera.lookAt(0, 0, 0)

      // ── Lighting ─────────────────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x0d1a33, 1.2))

      const key = new THREE.DirectionalLight(0xffffff, 2.0)
      key.position.set(4, 3, 6)
      scene.add(key)

      const fill = new THREE.DirectionalLight(0x2244aa, 0.8)
      fill.position.set(-4, 1, -2)
      scene.add(fill)

      const rim = new THREE.DirectionalLight(0x3b82f6, 1.2)
      rim.position.set(0, -2, -6)
      scene.add(rim)

      const top = new THREE.DirectionalLight(0x8899cc, 0.5)
      top.position.set(0, 8, 2)
      scene.add(top)

      // ── HDRI ─────────────────────────────────────────────────────────────────
      new (RGBELoader as any)().load(
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/qwantani_dusk_2_1k.hdr",
        (tex: any) => {
          tex.mapping = THREE.EquirectangularReflectionMapping
          scene.environment = tex
        },
      )

      // ── Model ─────────────────────────────────────────────────────────────────
      let model: InstanceType<typeof THREE.Group> | null = null

      new (GLTFLoader as any)().load(
        "/models/concorde.glb",
        (gltf: any) => {
          if (cancelled) return
          const mesh = gltf.scene as InstanceType<typeof THREE.Group>

          // Normalise position and scale to fit view
          const box  = new THREE.Box3().setFromObject(mesh)
          const ctr  = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const max  = Math.max(size.x, size.y, size.z)
          mesh.position.sub(ctr)
          mesh.scale.setScalar(2.4 / max)

          // Correct GLB base orientation — belly faces +Z by default; rotate so
          // nose points toward camera and top faces up. Wrapped in a Group so
          // the animate loop can drive rotation independently of this correction.
          mesh.rotation.x = 0
          mesh.rotation.y = Math.PI / 2 

          model = new THREE.Group()
          model.add(mesh)
          scene.add(model)
        },
        undefined,
        () => { /* model missing — silently skip */ },
      )

      // ── Scroll state ──────────────────────────────────────────────────────────
      let scrollProg  = 0
      let targetScroll = 0

      const onScroll = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight
        targetScroll = h > 0 ? window.scrollY / h : 0
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      cleanupFns.push(() => window.removeEventListener("scroll", onScroll))

      // ── Drag-to-orbit ─────────────────────────────────────────────────────────
      let isDragging   = false
      let dragX        = 0, dragY = 0
      let orbitX       = 0, orbitY = 0
      let targetOrbitX = 0, targetOrbitY = 0

      const onDown = (e: PointerEvent) => {
        isDragging = true
        dragX = e.clientX
        dragY = e.clientY
        canvas.style.cursor = "grabbing"
      }
      const onMove = (e: PointerEvent) => {
        if (!isDragging) return
        targetOrbitX = (e.clientX - dragX) * 0.006
        targetOrbitY = (e.clientY - dragY) * 0.006
      }
      const onUp = () => {
        isDragging = false
        canvas.style.cursor = "grab"
      }

      window.addEventListener("pointerdown", onDown)
      window.addEventListener("pointermove", onMove)
      window.addEventListener("pointerup",   onUp)
      cleanupFns.push(
        () => window.removeEventListener("pointerdown", onDown),
        () => window.removeEventListener("pointermove", onMove),
        () => window.removeEventListener("pointerup",   onUp),
      )

      // ── Resize ────────────────────────────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", onResize)
      cleanupFns.push(() => window.removeEventListener("resize", onResize))

      // ── Animation loop ────────────────────────────────────────────────────────
      const clock = new THREE.Clock()

      const animate = () => {
        if (cancelled) return
        animId = requestAnimationFrame(animate)

        const elapsed = clock.getElapsedTime()
        scrollProg += (targetScroll - scrollProg) * 0.055

        if (model) {
          const P = posesRef.current

          let posX: number, posY: number, rotX: number, rotY: number,
              rotZ: number, camZ: number, scale: number

          if (previewRef.current) {
            // Preview mode: show exactly this pose, no scroll blending
            const pose = P[editIdxRef.current]
            posX = pose.posX; posY = pose.posY; rotX = pose.rotX
            rotY = pose.rotY; rotZ = pose.rotZ; camZ = pose.camZ; scale = pose.scale
          } else {
            // Normal scroll-driven blending
            let cur  = P[0]
            let next = P[1]
            let t    = 0

            for (let i = 0; i < P.length; i++) {
              if (scrollProg >= P[i].scrollStart && scrollProg <= P[i].scrollEnd) {
                cur  = P[i]
                next = P[Math.min(i + 1, P.length - 1)]
                t    = smoothstep(cur.scrollStart, cur.scrollEnd, scrollProg)
                break
              }
              if (i === P.length - 1) { cur = P[i]; next = P[i]; t = 1 }
            }

            posX  = lerp(cur.posX,  next.posX,  t)
            posY  = lerp(cur.posY,  next.posY,  t)
            rotX  = lerp(cur.rotX,  next.rotX,  t)
            rotY  = lerp(cur.rotY,  next.rotY,  t)
            rotZ  = lerp(cur.rotZ,  next.rotZ,  t)
            camZ  = lerp(cur.camZ,  next.camZ,  t)
            scale = lerp(cur.scale, next.scale, t)
          }

          // Orbit decay
          if (isDragging) {
            orbitX += (targetOrbitX - orbitX) * 0.12
            orbitY += (targetOrbitY - orbitY) * 0.12
          } else {
            orbitX       += (0 - orbitX)       * 0.03
            orbitY       += (0 - orbitY)       * 0.03
            targetOrbitX += (0 - targetOrbitX) * 0.03
            targetOrbitY += (0 - targetOrbitY) * 0.03
          }

          model.position.x = lerp(model.position.x, posX, 0.06)
          model.position.y = lerp(model.position.y, posY + Math.sin(elapsed * 0.28) * 0.04, 0.06)
          model.rotation.x = lerp(model.rotation.x, rotX + orbitY, 0.06)
          model.rotation.y = lerp(model.rotation.y, rotY + Math.sin(elapsed * 0.18) * 0.025 + orbitX, 0.06)
          model.rotation.z = lerp(model.rotation.z, rotZ, 0.06)
          model.scale.setScalar(lerp(model.scale.x, scale, 0.06))

          camera.position.z = lerp(camera.position.z, camZ, 0.05)
          camera.lookAt(0, 0, 0)

        }

        renderer.render(scene, camera)
      }
      animate()
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(animId)
      cleanupFns.forEach(fn => fn())
    }
  }, [])

  // ── Intersection observer for fade-ins ────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".c-fade")
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("c-visible") }),
      { threshold: 0.12 },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* ── Canvas ──────────────────────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        style={{ zIndex: 0, cursor: "grab" }}
      />

      {/* ── Pose tuner ──────────────────────────────────────────────────────── */}
      <div className="fixed right-4 top-20 z-[100] w-52 rounded-2xl border border-white/10 bg-black/90 p-4 backdrop-blur-md"
        style={{ pointerEvents: "auto" }}>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] uppercase tracking-widest text-white/30">Pose</p>
          <button onClick={togglePreview}
            className={`rounded px-2 py-0.5 text-[9px] font-mono font-semibold transition-colors ${
              preview ? "bg-emerald-500 text-black" : "bg-white/10 text-white/40 hover:text-white"
            }`}>
            {preview ? "● Preview ON" : "○ Preview"}
          </button>
        </div>
        <div className="mb-3 flex flex-wrap gap-1">
          {POSE_LABELS.map((label, i) => (
            <button key={i} onClick={() => setEdit(i)}
              className={`rounded px-2 py-0.5 font-mono text-[10px] transition-colors ${
                editIdx === i ? "bg-blue-600 text-white" : "bg-white/10 text-white/40 hover:text-white"
              }`}>
              {i} {label}
            </button>
          ))}
        </div>
        {SLIDERS.map(({ key, min, max, step }) => {
          const val = (posesRef.current[editIdx] as Record<string, number>)[key]
          return (
            <div key={key} className="mb-2">
              <div className="mb-0.5 flex justify-between">
                <span className="font-mono text-[10px] text-white/50">{key}</span>
                <span className="font-mono text-[10px] text-emerald-400">{val.toFixed(2)}</span>
              </div>
              <input type="range" min={min} max={max} step={step} value={val}
                onChange={e => updatePose(key, parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer accent-blue-500" />
            </div>
          )
        })}
        <div className="mt-3 rounded-lg bg-white/5 p-2">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-white/20">Copy</p>
          <p className="break-all font-mono text-[9px] leading-[1.6] text-white/50">
            {SLIDERS.map(({ key }) =>
              `${key}:${((posesRef.current[editIdx] as Record<string, number>)[key]).toFixed(2)}`
            ).join("  ")}
          </p>
        </div>
      </div>

      {/* ── Fade-in animation ───────────────────────────────────────────────── */}
      <style>{`
        .c-fade { opacity: 0; transform: translateY(32px); transition: opacity .9s ease, transform .9s ease; }
        .c-visible { opacity: 1; transform: translateY(0); }
      `}</style>

      {/* ── Scroll content ──────────────────────────────────────────────────── */}
      <div className="relative" style={{ zIndex: 10, pointerEvents: "none" }}>

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="flex h-screen flex-col justify-end px-10 pb-12 md:px-16"
          style={{ pointerEvents: "auto" }}>
          <div className="c-fade max-w-lg">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-[#3b82f6]">
              Aérospatiale / BAC · 1969
            </p>
            <h1 className="mb-5 text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-tight">
              CONCORDE
            </h1>
            <p className="max-w-sm text-sm leading-relaxed text-[#94a3b8]">
              The only supersonic passenger aircraft in sustained commercial service.
              Mach 2.04 at 60,000 ft — above the weather, above most military traffic,
              halfway to space.
            </p>
          </div>

          <div className="absolute bottom-12 right-10 flex flex-col items-center gap-2 md:right-16"
            style={{ pointerEvents: "none" }}>
            <span className="text-[10px] uppercase tracking-[3px] text-[#94a3b8]"
              style={{ writingMode: "vertical-rl" }}>
              Scroll
            </span>
            <div className="h-14 w-px origin-top animate-pulse bg-[#94a3b8]/40" />
          </div>
        </section>

        {/* ── Engineering sections ─────────────────────────────────────────── */}
        {SECTIONS.map((s, i) => (
          <section key={i}
            className={`flex min-h-screen items-center px-10 md:px-16 ${s.right ? "justify-end" : ""}`}
            style={{ pointerEvents: "auto" }}>
            <div className="c-fade w-full max-w-[420px]">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#3b82f6]/70">
                {s.label}
              </p>
              <h2 className="mb-5 text-4xl font-bold leading-tight tracking-tight md:text-[2.6rem]">
                {s.title}
              </h2>
              <p className="text-sm leading-[1.85] text-[#94a3b8]">{s.body}</p>
              <div className="mt-8 flex gap-10">
                {s.stats.map(st => (
                  <div key={st.label}>
                    <p className="font-mono text-2xl font-bold text-white">{st.value}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">
                      {st.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ── Specs strip ──────────────────────────────────────────────────── */}
        <section className="flex min-h-[50vh] items-center justify-center px-10 md:px-16"
          style={{ pointerEvents: "auto" }}>
          <div className="c-fade w-full max-w-4xl">
            <div className="grid grid-cols-2 gap-px bg-white/[0.06] md:grid-cols-4">
              {SPECS.map(sp => (
                <div key={sp.label}
                  className="flex flex-col items-center justify-center bg-[#04060a]/80 px-6 py-10 text-center backdrop-blur-sm">
                  <p className="mb-2 font-mono text-2xl font-bold text-white md:text-3xl">
                    {sp.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#94a3b8]">
                    {sp.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/[0.06] bg-[#04060a]/90 px-10 py-10 backdrop-blur-sm md:px-16"
          style={{ pointerEvents: "auto" }}>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <Link href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Commercial Airliners
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
              AVIA · Concorde · 1969–2003
            </p>
          </div>
        </footer>

      </div>
    </>
  )
}
