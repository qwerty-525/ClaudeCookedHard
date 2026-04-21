"use client"
import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

gsap.registerPlugin(ScrollTrigger)

interface ThreeRefs {
  scene: THREE.Scene | null
  camera: THREE.PerspectiveCamera | null
  renderer: THREE.WebGLRenderer | null
  composer: EffectComposer | null
  stars: THREE.Points[]
  nebula: THREE.Mesh | null
  mountains: THREE.Mesh[]
  animationId: number | null
  targetCameraX?: number
  targetCameraY?: number
  targetCameraZ?: number
  locations?: number[]
}

export const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const titleRef     = useRef<HTMLHeadingElement>(null)
  const subtitleRef  = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<HTMLDivElement>(null)

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const totalSections = 2

  const threeRefs = useRef<ThreeRefs>({
    scene: null, camera: null, renderer: null, composer: null,
    stars: [], nebula: null, mountains: [], animationId: null,
  })

  useEffect(() => {
    if (!canvasRef.current) return
    const refs = threeRefs.current

    refs.scene = new THREE.Scene()
    refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025)

    refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    refs.camera.position.set(0, 20, 100)

    refs.renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    refs.renderer.setSize(window.innerWidth, window.innerHeight)
    refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    refs.renderer.toneMapping = THREE.ACESFilmicToneMapping
    refs.renderer.toneMappingExposure = 0.5

    refs.composer = new EffectComposer(refs.renderer)
    refs.composer.addPass(new RenderPass(refs.scene, refs.camera))
    refs.composer.addPass(new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.4, 0.3, 0.9
    ))

    // Stars
    for (let i = 0; i < 3; i++) {
      const count = 5000
      const geo = new THREE.BufferGeometry()
      const pos = new Float32Array(count * 3)
      const col = new Float32Array(count * 3)
      const sz  = new Float32Array(count)

      for (let j = 0; j < count; j++) {
        const r = 200 + Math.random() * 800
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(Math.random() * 2 - 1)
        pos[j*3]   = r * Math.sin(phi) * Math.cos(theta)
        pos[j*3+1] = r * Math.sin(phi) * Math.sin(theta)
        pos[j*3+2] = r * Math.cos(phi)
        const c = new THREE.Color()
        const t = Math.random()
        if (t < 0.7) c.setHSL(0, 0, 0.8 + Math.random() * 0.2)
        else if (t < 0.9) c.setHSL(0.08, 0.5, 0.8)
        else c.setHSL(0.6, 0.5, 0.8)
        col[j*3] = c.r; col[j*3+1] = c.g; col[j*3+2] = c.b
        sz[j] = Math.random() * 2 + 0.5
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
      geo.setAttribute("color",    new THREE.BufferAttribute(col, 3))
      geo.setAttribute("size",     new THREE.BufferAttribute(sz,  1))

      const mat = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: i } },
        vertexShader: `
          attribute float size; attribute vec3 color; varying vec3 vColor;
          uniform float time; uniform float depth;
          void main() {
            vColor = color;
            vec3 p = position;
            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
            p.xy = rot * p.xy;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = size * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - vec2(0.5));
            if (d > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0 - smoothstep(0.0, 0.5, d));
          }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const stars = new THREE.Points(geo, mat)
      refs.scene.add(stars)
      refs.stars.push(stars)
    }

    // Nebula
    const nebGeo = new THREE.PlaneGeometry(8000, 4000, 100, 100)
    const nebMat = new THREE.ShaderMaterial({
      uniforms: {
        time:    { value: 0 },
        color1:  { value: new THREE.Color(0x0033ff) },
        color2:  { value: new THREE.Color(0xff6600) },
        opacity: { value: 0.3 },
      },
      vertexShader: `
        varying vec2 vUv; varying float vElevation; uniform float time;
        void main() {
          vUv = uv; vec3 p = position;
          float e = sin(p.x * 0.01 + time) * cos(p.y * 0.01 + time) * 20.0;
          p.z += e; vElevation = e;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: `
        uniform vec3 color1; uniform vec3 color2; uniform float opacity; uniform float time;
        varying vec2 vUv; varying float vElevation;
        void main() {
          float m = sin(vUv.x*10.0+time)*cos(vUv.y*10.0+time);
          vec3 col = mix(color1, color2, m*0.5+0.5);
          float a = opacity * (1.0 - length(vUv-0.5)*2.0);
          gl_FragColor = vec4(col, a);
        }`,
      transparent: true, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide, depthWrite: false,
    })
    refs.nebula = new THREE.Mesh(nebGeo, nebMat)
    refs.nebula.position.z = -1050
    refs.scene.add(refs.nebula)

    // Mountains
    const layers = [
      { distance: -50,  height: 60,  color: 0x1a1a2e, opacity: 1   },
      { distance: -100, height: 80,  color: 0x16213e, opacity: 0.8  },
      { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6  },
      { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4  },
    ]
    layers.forEach((layer, idx) => {
      const pts: THREE.Vector2[] = []
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50 - 0.5) * 1000
        const y = Math.sin(i * 0.1) * layer.height +
                  Math.sin(i * 0.05) * layer.height * 0.5 +
                  Math.random() * layer.height * 0.2 - 100
        pts.push(new THREE.Vector2(x, y))
      }
      pts.push(new THREE.Vector2(5000, -300), new THREE.Vector2(-5000, -300))
      const shape = new THREE.Shape(pts)
      const geo   = new THREE.ShapeGeometry(shape)
      const mat   = new THREE.MeshBasicMaterial({
        color: layer.color, transparent: true, opacity: layer.opacity, side: THREE.DoubleSide,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, layer.distance, layer.distance)
      mesh.userData = { baseZ: layer.distance, index: idx }
      refs.scene.add(mesh)
      refs.mountains.push(mesh)
    })

    // Store original z positions
    refs.locations = refs.mountains.map(m => m.position.z)

    // Atmosphere
    const atmGeo = new THREE.SphereGeometry(600, 32, 32)
    const atmMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec3 vNormal; uniform float time;
        void main() {
          float i = pow(0.7 - dot(vNormal, vec3(0,0,1)), 2.0);
          vec3 atm = vec3(0.3, 0.6, 1.0) * i * (sin(time*2.0)*0.1+0.9);
          gl_FragColor = vec4(atm, i * 0.25);
        }`,
      side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true,
    })
    refs.scene.add(new THREE.Mesh(atmGeo, atmMat))

    // Animate loop
    const animate = () => {
      refs.animationId = requestAnimationFrame(animate)
      const time = Date.now() * 0.001
      refs.stars.forEach(s => { if (s.material instanceof THREE.ShaderMaterial) s.material.uniforms.time.value = time })
      if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial)
        refs.nebula.material.uniforms.time.value = time * 0.5

      if (refs.camera && refs.targetCameraX !== undefined) {
        const f = 0.05
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * f
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * f
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * f
        refs.camera.position.set(
          smoothCameraPos.current.x + Math.sin(time * 0.1) * 2,
          smoothCameraPos.current.y + Math.cos(time * 0.15),
          smoothCameraPos.current.z,
        )
        refs.camera.lookAt(0, 10, -600)
      }

      refs.mountains.forEach((m, i) => {
        m.position.x = Math.sin(time * 0.1) * 2 * (1 + i * 0.5)
      })

      refs.composer?.render()
    }
    animate()
    setIsReady(true)

    const onResize = () => {
      if (!refs.camera || !refs.renderer || !refs.composer) return
      refs.camera.aspect = window.innerWidth / window.innerHeight
      refs.camera.updateProjectionMatrix()
      refs.renderer.setSize(window.innerWidth, window.innerHeight)
      refs.composer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", onResize)
      refs.stars.forEach(s => { s.geometry.dispose(); (s.material as THREE.Material).dispose() })
      refs.mountains.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose() })
      refs.nebula?.geometry.dispose()
      if (refs.nebula) (refs.nebula.material as THREE.Material).dispose()
      refs.renderer?.dispose()
    }
  }, [])

  // Entrance animations
  useEffect(() => {
    if (!isReady) return
    const tl = gsap.timeline()
    if (titleRef.current)    tl.from(titleRef.current,    { y: 60, opacity: 0, duration: 1.4, ease: "power4.out" })
    if (subtitleRef.current) tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 1,   ease: "power3.out" }, "-=0.8")
    if (scrollProgressRef.current) tl.from(scrollProgressRef.current, { opacity: 0, y: 20, duration: 0.8 }, "-=0.4")
    return () => { tl.kill() }
  }, [isReady])

  // Scroll → camera
  useEffect(() => {
    const onScroll = () => {
      const refs      = threeRefs.current
      const container = containerRef.current
      if (!container) return
      const scrolled  = window.scrollY - container.offsetTop
      const totalHeight = container.offsetHeight - window.innerHeight
      const progress  = Math.max(0, Math.min(scrolled / totalHeight, 1))
      setScrollProgress(progress)
      setCurrentSection(Math.floor(progress * totalSections))

      const positions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ]
      const sec     = Math.floor(progress * totalSections)
      const secProg = (progress * totalSections) % 1
      const cur  = positions[sec]  ?? positions[0]
      const next = positions[sec + 1] ?? cur

      refs.targetCameraX = cur.x + (next.x - cur.x) * secProg
      refs.targetCameraY = cur.y + (next.y - cur.y) * secProg
      refs.targetCameraZ = cur.z + (next.z - cur.z) * secProg

      refs.mountains.forEach((m, i) => {
        if (progress > 0.7) {
          m.position.z = 600000
        } else {
          m.position.z = refs.locations?.[i] ?? m.userData.baseZ
        }
        if (refs.nebula) refs.nebula.position.z = refs.mountains[3].position.z
      })
    }
    window.addEventListener("scroll", onScroll)
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [totalSections])

  const sections = [
    { title: "HORIZON",  sub: "The world from 35,000 feet." },
    { title: "ALTITUDE", sub: "Eight miles above the ocean." },
    { title: "BEYOND",   sub: "The jets that made it possible." },
  ]

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: `${(totalSections + 1) * 100}vh` }}>
      {/* Sticky canvas */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Dark vignette so text stays legible against bright stars */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Main title */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <h2
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold tracking-tight text-white"
            style={{
              opacity: isReady ? undefined : 0,
              textShadow: "0 2px 24px rgba(0,0,0,0.8)",
            }}
          >
            {sections[currentSection]?.title ?? "HORIZON"}
          </h2>
          <div
            ref={subtitleRef}
            className="mt-4"
            style={{ opacity: isReady ? undefined : 0 }}
          >
            <p className="text-white/55 text-sm tracking-[0.25em] uppercase"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}>
              {sections[currentSection]?.sub}
            </p>
          </div>
        </div>

        {/* Scroll progress */}
        <div
          ref={scrollProgressRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{ opacity: isReady ? undefined : 0 }}
        >
          <span className="text-[10px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
          <div className="w-32 h-px bg-white/10 overflow-hidden rounded-full">
            <div
              className="h-full bg-white/50 rounded-full transition-all duration-100"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/20 tabular-nums">
            {String(currentSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  )
}
