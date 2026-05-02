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

const FRAMES_MORPH  = 53
const FRAMES_F117   = 144
const TOTAL_FRAMES  = FRAMES_MORPH + FRAMES_F117

// Morph occupies 40% of scroll, f117 the remaining 60%
const MORPH_SCROLL_END = 0.40

function frameUrl(index: number) {
  if (index < FRAMES_MORPH) {
    return `/sequence_papermorphing/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`
  }
  return `/sequence_f117/ezgif-frame-${String(index - FRAMES_MORPH + 1).padStart(3, "0")}.png`
}

function progressToIndex(progress: number): number {
  if (progress <= MORPH_SCROLL_END) {
    return Math.round((progress / MORPH_SCROLL_END) * (FRAMES_MORPH - 1))
  }
  const f117Progress = (progress - MORPH_SCROLL_END) / (1 - MORPH_SCROLL_END)
  return FRAMES_MORPH + Math.round(f117Progress * (FRAMES_F117 - 1))
}

export default function F117Scroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [loadedCount, setLoadedCount] = useState(0)
  const isLoaded = loadedCount === TOTAL_FRAMES

  const { scrollYProgress } = useScroll({ target: containerRef })

  // s0 plays during papermorphing (frames 0–55 = scroll 0–0.28)
  const s0Opacity = useTransform(scrollYProgress, [0, 0.03, 0.18, 0.24], [0, 1, 1, 0])
  const s0Y       = useTransform(scrollYProgress, [0, 0.24], ["24px", "-24px"])

  // s1 bridges morph→f117 transition (~0.32–0.50)
  const s1Opacity = useTransform(scrollYProgress, [0.32, 0.35, 0.46, 0.52], [0, 1, 1, 0])
  const s1Y       = useTransform(scrollYProgress, [0.32, 0.52], ["24px", "-24px"])

  // s2 mid-f117 sequence (~0.52–0.68)
  const s2Opacity = useTransform(scrollYProgress, [0.52, 0.55, 0.66, 0.72], [0, 1, 1, 0])
  const s2Y       = useTransform(scrollYProgress, [0.52, 0.72], ["24px", "-24px"])

  // s3 end of f117 sequence (~0.84–1.0)
  const s3Opacity = useTransform(scrollYProgress, [0.84, 0.87, 0.96, 1.0], [0, 1, 1, 0])
  const s3Y       = useTransform(scrollYProgress, [0.84, 1.0], ["24px", "-24px"])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    renderFrame(currentFrameRef.current)
  }, [])

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

    const scale = Math.max(cw / iw, ch / ih)
    const sw = iw * scale
    const sh = ih * scale
    const dx = (cw - sw) / 2
    const dy = (ch - sh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, sw, sh)
  }, [])

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

  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (isLoaded) renderFrame(0)
  }, [isLoaded, renderFrame])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isLoaded) return
    const index = Math.min(progressToIndex(latest), TOTAL_FRAMES - 1)
    if (index === currentFrameRef.current) return
    currentFrameRef.current = index
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => renderFrame(index))
  })

  const loadPct = Math.round((loadedCount / TOTAL_FRAMES) * 100)

  return (
    <>
      <AviationLoader loadPct={loadPct} isLoaded={isLoaded} category="fighters" />

      <div ref={containerRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ willChange: "transform" }}
          />

          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04060a] to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04060a] to-transparent pointer-events-none" />

          {/* Section 0: Hero */}
          <motion.div
            style={{ opacity: s0Opacity, y: s0Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none"
          >
            <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-4">
              Lockheed Skunk Works
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white/90 leading-none drop-shadow-[0_0_60px_rgba(239,68,68,0.2)]">
              F-117 Nighthawk.
              <br />
              <span className="text-white/50">First of its Kind.</span>
            </h1>
            <p className="mt-6 text-white/50 text-base md:text-lg max-w-md leading-relaxed">
              The world's first operational stealth aircraft.
            </p>
          </motion.div>

          {/* Section 1: Left */}
          <motion.div
            style={{ opacity: s1Opacity, y: s1Y }}
            className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 pointer-events-none"
          >
            <p className="text-red-400/50 text-xs tracking-[0.4em] uppercase mb-4">
              Faceted Geometry
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 leading-tight max-w-lg drop-shadow-[0_0_40px_rgba(239,68,68,0.15)]">
              Built From
              <br />
              Flat Planes.
            </h2>
            <p className="mt-4 text-white/50 text-sm md:text-base max-w-sm leading-relaxed">
              Designed by computer before computers were powerful.
              Each angled facet scatters radar in every direction except back.
            </p>
          </motion.div>

          {/* Section 2: Right */}
          <motion.div
            style={{ opacity: s2Opacity, y: s2Y }}
            className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-20 pointer-events-none"
          >
            <div className="text-right max-w-lg">
              <p className="text-red-400/50 text-xs tracking-[0.4em] uppercase mb-4">
                Black Programme
              </p>
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white/90 leading-tight drop-shadow-[0_0_40px_rgba(239,68,68,0.15)]">
                Classified.
                <br />
                For a Decade.
              </h2>
              <p className="mt-4 text-white/50 text-sm md:text-base max-w-sm leading-relaxed ml-auto">
                Flew operationally from 1983. The public didn't know it existed
                until 1988. It struck Baghdad on the first night of Desert Storm.
              </p>
            </div>
          </motion.div>

          {/* Section 3: CTA */}
          <motion.div
            style={{ opacity: s3Opacity, y: s3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <p className="text-red-400/50 text-xs tracking-[0.4em] uppercase mb-6">
              F-117 Nighthawk
            </p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/90 leading-tight max-w-2xl drop-shadow-[0_0_60px_rgba(239,68,68,0.2)]">
              The Original
              <br />
              Ghost.
            </h2>
            <motion.a
              href="/fighters"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-full border border-red-400/20 backdrop-blur-sm hover:bg-red-400/10 hover:border-red-400/40 transition-colors duration-200"
            >
              <TextScramble text="Back to the Squadron" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </>
  )
}
