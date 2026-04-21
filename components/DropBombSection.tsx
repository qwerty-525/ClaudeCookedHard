"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import {
  useScroll,
  useTransform,
  useMotionValueEvent,
  motion,
} from "framer-motion"
import TextExplode from "@/components/ui/text-explode"

const TOTAL_FRAMES = 33

function frameUrl(index: number) {
  return `/sequence_dropbombs/ezgif-frame-${String(index + 1).padStart(3, "0")}.png`
}

interface DropBombSectionProps {
  exploreHref?: string
}

export default function DropBombSection({ exploreHref = "/fighters/f35" }: DropBombSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const currentFrameRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const [loadedCount, setLoadedCount] = useState(0)
  const [startedLoading, setStartedLoading] = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const [showCta, setShowCta] = useState(false)
  const isLoaded = loadedCount === TOTAL_FRAMES

  const { scrollYProgress } = useScroll({ target: containerRef })

  // Mission label — top left, early
  const s0Opacity = useTransform(scrollYProgress, [0, 0.03, 0.16, 0.22], [0, 1, 1, 0])
  const s0Y       = useTransform(scrollYProgress, [0, 0.22], ["20px", "-20px"])

  // Terminal velocity — bottom right
  const s1Opacity = useTransform(scrollYProgress, [0.15, 0.16, 0.28, 0.34], [0, 1, 1, 0])
  const s1Y       = useTransform(scrollYProgress, [0.15, 0.34], ["20px", "-20px"])

  const ctaY = useTransform(scrollYProgress, [0.88, 1.0], ["14px", "0px"])

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

  // Only start loading frames when the section scrolls near the viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartedLoading(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200% 0px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!startedLoading) return
    const images: HTMLImageElement[] = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      const img = new Image()
      img.src = frameUrl(i)
      img.onload = () => setLoadedCount((n) => n + 1)
      img.onerror = () => setLoadedCount((n) => n + 1)
      return img
    })
    imagesRef.current = images
  }, [startedLoading])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    return () => window.removeEventListener("resize", resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (isLoaded) renderFrame(0)
  }, [isLoaded, renderFrame])

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setShowImpact(latest >= 0.75)
    setShowCta(latest >= 0.85)
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

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Loading shimmer while frames preload */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#04060a]">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full border border-red-400/10" />
                <div className="absolute inset-0 rounded-full border-t border-red-400/60 animate-spin" />
              </div>
              <p className="text-red-400/30 text-xs tracking-[0.3em] uppercase">
                {Math.round((loadedCount / TOTAL_FRAMES) * 100)}%
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ willChange: "transform" }}
        />

        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#04060a] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#04060a] to-transparent pointer-events-none" />

        {/* Mission briefing — top left */}
        <motion.div
          style={{ opacity: s0Opacity, y: s0Y }}
          className="absolute inset-0 flex flex-col justify-start items-start px-8 md:px-20 pt-28 pointer-events-none"
        >
          <p className="text-red-400/60 text-xs tracking-[0.4em] uppercase mb-4">
            Precision Strike
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 leading-none drop-shadow-[0_0_60px_rgba(239,68,68,0.25)]">
            Payload
            <br />
            <span className="text-white/50">Armed.</span>
          </h2>
          <p className="mt-5 text-white/40 text-sm max-w-xs leading-relaxed">
            GBU-31 JDAM. GPS-guided. 2,000 lb warhead.
            Circular error probability: under 5 metres.
          </p>
        </motion.div>

        {/* Terminal velocity — bottom right */}
        <motion.div
          style={{ opacity: s1Opacity, y: s1Y }}
          className="absolute right-12 md:right-24 bottom-80 flex flex-col items-end text-right pointer-events-none"
        >
          <p className="text-red-400/50 text-xs tracking-[0.4em] uppercase mb-4">
            In Free Fall
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white/90 leading-tight drop-shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            Terminal
            <br />
            Velocity.
          </h2>
          <p className="mt-3 text-white/40 text-sm leading-relaxed max-w-[220px]">
            No engine. No guidance until release.
            Gravity does the work.
          </p>
        </motion.div>

        {/* IMPACT text — bottom centre */}
        <div
          className={`absolute inset-x-0 bottom-48 flex flex-col items-center text-center z-10 pointer-events-none transition-opacity duration-300 ${showImpact ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-red-400/70 text-xs tracking-[0.5em] uppercase mb-3">
            Target Confirmed
          </p>
          <TextExplode
            text="IMPACT."
            mode="loop"
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none drop-shadow-[0_0_80px_rgba(239,68,68,0.5)]"
          />
        </div>

        {/* Click to explore — after impact */}
        <motion.div
          style={{ y: ctaY }}
          className={`absolute inset-x-0 bottom-14 flex flex-col items-center z-10 transition-opacity duration-500 ${showCta ? "opacity-100" : "opacity-0"}`}
        >
          <a
            href={exploreHref}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-red-400/25 text-white/80 text-sm font-medium backdrop-blur-sm hover:bg-red-400/10 hover:border-red-400/50 transition-all duration-200"
          >
            Click to explore more
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
