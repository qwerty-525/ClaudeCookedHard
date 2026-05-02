"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion"
import { TextScramble } from "@/components/ui/text-scramble"
import AviationLoader from "@/components/AviationLoader"

const TOTAL_FRAMES = 156

function frameUrl(index: number) {
  return `/sequence/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`
}

export default function ChipScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [loadedCount, setLoadedCount] = useState(0)
  const isLoaded = loadedCount === TOTAL_FRAMES

  // ── Scroll progress ────────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({ target: containerRef })

  // ── Text section opacities ─────────────────────────────────────────────────
  const s0Opacity = useTransform(scrollYProgress, [0, 0.04, 0.18, 0.24], [0, 1, 1, 0])
  const s0Y       = useTransform(scrollYProgress, [0, 0.24], ["24px", "-24px"])

  const s1Opacity = useTransform(scrollYProgress, [0.26, 0.31, 0.45, 0.50], [0, 1, 1, 0])
  const s1Y       = useTransform(scrollYProgress, [0.26, 0.50], ["24px", "-24px"])

  const s2Opacity = useTransform(scrollYProgress, [0.53, 0.58, 0.72, 0.77], [0, 1, 1, 0])
  const s2Y       = useTransform(scrollYProgress, [0.53, 0.77], ["24px", "-24px"])

  const s3Opacity = useTransform(scrollYProgress, [0.83, 0.88, 0.97, 1.0], [0, 1, 1, 0])
  const s3Y       = useTransform(scrollYProgress, [0.83, 1.0], ["24px", "-24px"])

  // ── Canvas sizing ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    renderFrame(currentFrameRef.current)
  }, [])

  // ── Draw a single frame ────────────────────────────────────────────────────
  const renderFrame = useCallback((index: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const img = imagesRef.current[index]
    if (!ctx || !img?.complete || !img.naturalWidth) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight

    // cover fill — no black bars
    const scale = Math.max(cw / iw, ch / ih)
    const sw = iw * scale
    const sh = ih * scale
    const dx = (cw - sw) / 2
    const dy = (ch - sh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, sw, sh)
  }, [])

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    const loaded = new Set<number>()
    let cancelled = false
    const images: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      const mark = () => {
        if (cancelled || loaded.has(i)) return
        loaded.add(i)
        setLoadedCount(loaded.size)
      }
      img.onload = mark
      img.onerror = mark
      img.src = frameUrl(i)
      return img
    })
    imagesRef.current = images
    return () => {
      cancelled = true
      for (const img of images) {
        img.onload = null
        img.onerror = null
      }
    }
  }, [])

  // ── Resize listener ────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [resizeCanvas])

  // ── Draw first frame once loaded ───────────────────────────────────────────
  useEffect(() => {
    if (isLoaded) renderFrame(0)
  }, [isLoaded, renderFrame])

  // ── Scroll → frame ─────────────────────────────────────────────────────────
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded) return
    const index = Math.min(
      Math.round(latest * (TOTAL_FRAMES - 1)),
      TOTAL_FRAMES - 1
    )
    if (index === currentFrameRef.current) return
    currentFrameRef.current = index
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => renderFrame(index))
  })

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100)

  return (
    <>
      <AviationLoader loadPct={loadPct} isLoaded={isLoaded} category="fighters" />

      {/* ── Scroll container ────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative h-[400vh]">
        {/* Sticky canvas */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: "transform" }}
          />

          {/* Top vignette — blends into dark page header */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none" />
          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />

          {/* ── Section 0: 0–22% — Centred hero title ──────────────────── */}
          <motion.div
            style={{ opacity: s0Opacity, y: s0Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <p className="text-white/50 text-xs tracking-[0.4em] uppercase mb-4">
              Northrop Grumman
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white/90 leading-none drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              B-2 Spirit.
              <br />
              <span className="text-white/50">Born in Shadow.</span>
            </h1>
            <p className="mt-6 text-white/50 text-base md:text-lg max-w-md leading-relaxed">
              The aircraft that made invisibility a weapon.
            </p>
          </motion.div>

          {/* ── Section 1: 26–50% — Left ───────────────────────────────── */}
          <motion.div
            style={{ opacity: s1Opacity, y: s1Y }}
            className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none"
          >
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-4">
              Stealth Architecture
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 leading-tight max-w-lg drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]">
              Zero Vertical
              <br />
              Surfaces.
            </h2>
            <p className="mt-4 text-white/50 text-sm md:text-base max-w-sm leading-relaxed">
              Every edge angled to scatter radar waves. No tail fins. No visible intakes.
              A shape engineered purely to disappear.
            </p>
          </motion.div>

          {/* ── Section 2: 53–77% — Right ──────────────────────────────── */}
          <motion.div
            style={{ opacity: s2Opacity, y: s2Y }}
            className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-20 pointer-events-none"
          >
            <div className="text-right max-w-lg">
              <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-4">
                Global Strike
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 leading-tight drop-shadow-[0_0_40px_rgba(255,255,255,0.12)]">
                Undetected.
                <br />
                Unstoppable.
              </h2>
              <p className="mt-4 text-white/50 text-sm md:text-base max-w-sm leading-relaxed ml-auto">
                12,000 km unrefuelled. Nuclear-capable. Two crew.
                Able to strike any target on Earth within hours.
              </p>
            </div>
          </motion.div>

          {/* ── Section 3: 83–100% — Centred CTA ──────────────────────── */}
          <motion.div
            style={{ opacity: s3Opacity, y: s3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-6">
              B-2 Spirit
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/90 leading-tight max-w-2xl drop-shadow-[0_0_60px_rgba(255,255,255,0.15)]">
              The Sky Belongs
              <br />
              to Those Who Dare.
            </h2>
            <motion.a
              href="/fighters"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
            >
              <TextScramble text="Explore the Squadron" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  )
}