"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import YouTubeClipLoop, { type Clip } from "@/components/YouTubeClipLoop"
import { commercialPlanes } from "@/lib/data"

type FrameKey = "747" | "a380" | "concorde" | "dc3"

interface FrameDef {
  key: FrameKey
  slug: string
  index: string
  name: string
  nameStyle?: "display" | "serif"
  eyebrow: string
  tagline: string
  badge: string
  badgeMeta: string
  coord: string
  callout?: { x: string; y: string; primary: string; secondary: string; mirror?: boolean }
  callout2?: { x: string; y: string; primary: string; secondary: string; mirror?: boolean }
  specs: { k: string; v: number | string; suffix?: string; small?: string }[]
  variant: "dusk" | "alt" | "gold" | "heritage"
  imageSrc?: string
  imageWidth?: number
  imageHeight?: number
  video?: { videoId: string; clips: Clip[] }
}

const CONCORDE_CLIPS: Clip[] = [
  { start: 181, end: 192 },
  { start: 150, end: 157 },
]

const FRAMES: FrameDef[] = [
  {
    key: "747",
    slug: "boeing-747",
    index: "01",
    name: "747-8 Intercontinental",
    eyebrow: "JUMBOJET · 4 ENGINES · WIDEBODY",
    tagline: "Queen of the skies.",
    badge: "B",
    badgeMeta: "BOEING // EST. 1916",
    coord: "N 51°28′ · W 000°27′",
    callout: {
      x: "34%",
      y: "46%",
      primary: "GEnx-2B67",
      secondary: "HIGH-BYPASS · 66,500 LBF",
    },
    specs: [
      { k: "Range", v: 7730, suffix: "nmi" },
      { k: "Capacity", v: 467, suffix: "pax", small: "3-class" },
      { k: "First flight", v: 2010 },
      { k: "MTOW", v: 447700, suffix: "kg" },
    ],
    variant: "dusk",
    imageSrc: "/planes/boeing747.png",
    imageWidth: 1480,
    imageHeight: 380,
  },
  {
    key: "a380",
    slug: "airbus-a380",
    index: "02",
    name: "A380-800",
    eyebrow: "DOUBLE-DECK · 4 ENGINES · SUPERJUMBO",
    tagline: "A deck above the weather — the largest passenger jet ever flown.",
    badge: "A",
    badgeMeta: "AIRBUS // EST. 1970",
    coord: "N 24°27′ · E 054°22′",
    callout: {
      x: "18%",
      y: "44%",
      primary: "UPPER DECK",
      secondary: "FULL-LENGTH · 538 SEATS MAX",
    },
    callout2: {
      x: "78%",
      y: "52%",
      primary: "WINGSPAN",
      secondary: "79.75 m · GATE-LIMITED",
      mirror: true,
    },
    specs: [
      { k: "Range", v: 8000, suffix: "nmi" },
      { k: "Capacity", v: 525, suffix: "pax", small: "typical" },
      { k: "First flight", v: 2005 },
      { k: "Engines", v: "4", small: "× Trent 900 / GP7200" },
    ],
    variant: "alt",
    imageSrc: "/planes/a380.png",
    imageWidth: 1680,
    imageHeight: 600,
  },
  {
    key: "concorde",
    slug: "concorde",
    index: "03",
    name: "Concorde",
    eyebrow: "SUPERSONIC · DELTA WING · RETIRED ICON",
    tagline: "Faster than the turning of the earth.",
    badge: "SST",
    badgeMeta: "BAC × SUD AVIATION // 1969–2003",
    coord: "N 49°00′ · W 030°00′",
    callout: {
      x: "30%",
      y: "44%",
      primary: "OGIVAL DELTA",
      secondary: "3,856 SQ FT · NO FLAPS",
    },
    specs: [
      { k: "Cruise", v: 2179, suffix: "km/h", small: "Mach 2.04" },
      { k: "Capacity", v: 100, suffix: "pax", small: "all-business" },
      { k: "First flight", v: 1969 },
      { k: "Built", v: 20, suffix: "units" },
    ],
    variant: "gold",
    video: { videoId: "lsqPsX8k5FE", clips: CONCORDE_CLIPS },
  },
  {
    key: "dc3",
    slug: "douglas-dc-3",
    index: "04",
    name: "DC-3",
    nameStyle: "serif",
    eyebrow: "PISTON · TWIN-RADIAL · GRANDFATHER OF MODERN AIR TRAVEL",
    tagline: "The aircraft that taught the world to fly commercially.",
    badge: "D",
    badgeMeta: "DOUGLAS AIRCRAFT // EST. 1921",
    coord: "N 34°02′ · W 118°15′",
    callout: {
      x: "24%",
      y: "48%",
      primary: "P&W R-1830",
      secondary: "TWIN-WASP · 1,200 HP EACH",
    },
    specs: [
      { k: "Range", v: 1500, suffix: "mi" },
      { k: "Capacity", v: 32, suffix: "pax" },
      { k: "First flight", v: 1935 },
      { k: "Built", v: 16079, suffix: "units", small: "incl. C-47" },
    ],
    variant: "heritage",
  },
]

function fmtCount(n: number, target: number) {
  if (target >= 10000) return Math.round(n).toLocaleString("en-US")
  return Math.round(n).toString()
}

function Counter({ target, suffix, small, active }: { target: number | string; suffix?: string; small?: string; active: boolean }) {
  const [val, setVal] = useState<number | string>(typeof target === "number" ? 0 : target)
  const fired = useRef(false)
  useEffect(() => {
    if (!active || fired.current || typeof target !== "number") return
    fired.current = true
    const start = performance.now()
    const dur = 1400
    let raf = 0
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(target * eased)
      if (t < 1) raf = requestAnimationFrame(step)
      else setVal(target)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active, target])
  const display = typeof val === "number" ? fmtCount(val, target as number) : val
  return (
    <span className="font-semibold text-[15px] tracking-tight whitespace-nowrap md:text-[17px]">
      {display}
      {suffix && <span className="ml-1 text-[0.62em] font-normal opacity-70 tracking-wider">{suffix}</span>}
      {small && !suffix && <span className="ml-1 text-[0.62em] font-normal opacity-70 tracking-wider">{small}</span>}
      {small && suffix && <span className="ml-1 text-[0.62em] font-normal opacity-70 tracking-wider">· {small}</span>}
    </span>
  )
}

export default function SnapScrollShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [utc, setUtc] = useState("UTC --:--:--")

  useEffect(() => {
    const t = () => {
      const d = new Date()
      const hh = String(d.getUTCHours()).padStart(2, "0")
      const mm = String(d.getUTCMinutes()).padStart(2, "0")
      const ss = String(d.getUTCSeconds()).padStart(2, "0")
      setUtc(`UTC ${hh}:${mm}:${ss}`)
    }
    t()
    const id = setInterval(t, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const sy = el.scrollTop
        if (sy > 50) setScrolled(true)
        else setScrolled(false)
        let best = Infinity
        let idx = 0
        frameRefs.current.forEach((f, i) => {
          if (!f) return
          const d = Math.abs(f.offsetTop - sy)
          if (d < best) {
            best = d
            idx = i
          }
        })
        setActiveIdx(idx)
        // parallax
        const vh = el.clientHeight
        frameRefs.current.forEach((f) => {
          if (!f) return
          const rel = (sy - f.offsetTop) / vh
          f.querySelectorAll<HTMLElement>("[data-parallax]").forEach((p) => {
            const k = parseFloat(p.dataset.parallax || "0")
            p.style.transform = `translateY(${rel * vh * k}px)`
          })
        })
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => {
      el.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  const goTo = (i: number) => {
    const f = frameRefs.current[i]
    const el = scrollerRef.current
    if (!f || !el) return
    el.scrollTo({ top: f.offsetTop, behavior: "smooth" })
  }

  const fleetNames = useMemo(
    () =>
      commercialPlanes
        .filter((p) => p.status !== "retired" || p.slug === "concorde")
        .map((p) => p.name),
    [],
  )

  const totalFrames = FRAMES.length
  const hudFrame = activeIdx < totalFrames ? FRAMES[activeIdx].index : "→"
  const hudCoord = activeIdx < totalFrames ? FRAMES[activeIdx].coord : "DEPARTURE · FLEET"

  return (
    <section className="relative w-full" aria-label="Aviation snap-scroll showcase">
      <style jsx>{`
        .sss-scroller::-webkit-scrollbar { display: none }
        .sss-frame > * { will-change: transform }

        .sky-dusk {
          background: radial-gradient(ellipse 80% 50% at 70% 70%, #f4a261 0%, #e76f51 22%, #b04a3a 42%, #4a2a3a 62%, #1a1422 82%, #0a0a14 100%);
        }
        .sky-dusk::before {
          content: ""; position: absolute; left: 62%; top: 55%; width: 18vw; height: 18vw; border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, #ffd9a8 30%, rgba(255,180,120,.4) 55%, transparent 75%);
          filter: blur(2px);
        }
        .sky-dusk::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,20,.65) 0%, transparent 35%, transparent 65%, rgba(10,10,20,.4) 100%);
        }

        .sky-alt {
          background: linear-gradient(to bottom, #0a1628 0%, #0e2440 18%, #2d5a8a 45%, #6890b8 72%, #b8d4e8 92%, #e8f0f5 100%);
        }
        .sky-alt::before {
          content: ""; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 120% 30% at 50% 100%, rgba(255,255,255,.5), transparent 60%),
            radial-gradient(ellipse 60% 20% at 30% 75%, rgba(255,255,255,.18), transparent 70%),
            radial-gradient(ellipse 70% 15% at 75% 80%, rgba(255,255,255,.22), transparent 70%);
        }

        .sky-gold {
          background: linear-gradient(to bottom, #0a1428 0%, #1a2440 12%, #3a3050 24%, #7a4530 42%, #c75a2c 58%, #f5a623 76%, #ffd166 92%, #fff2c4 100%);
        }
        .sky-gold::before {
          content: ""; position: absolute; left: 50%; top: 62%; width: 30vw; height: 30vw; transform: translate(-50%, -50%); border-radius: 50%;
          background: radial-gradient(circle, #fff 0%, #fff2c4 18%, rgba(255,209,102,.6) 38%, transparent 65%);
          filter: blur(4px);
        }

        .sky-heritage {
          background: radial-gradient(ellipse 100% 80% at 50% 100%, #d4b896 0%, #a88a64 25%, #6b563a 55%, #2e2418 85%, #0f0a06 100%);
        }
        .sky-heritage::after {
          content: ""; position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 13% 24%, rgba(255,255,255,.04) 0, transparent 2px),
            radial-gradient(circle at 67% 71%, rgba(255,255,255,.05) 0, transparent 2px),
            radial-gradient(circle at 38% 88%, rgba(255,255,255,.03) 0, transparent 2px),
            radial-gradient(circle at 88% 12%, rgba(255,255,255,.04) 0, transparent 2px),
            radial-gradient(circle at 22% 56%, rgba(255,255,255,.04) 0, transparent 2px),
            radial-gradient(circle at 56% 33%, rgba(255,255,255,.03) 0, transparent 2px);
          background-size: 7px 7px, 11px 11px, 5px 5px, 9px 9px, 13px 13px, 6px 6px;
          mix-blend-mode: overlay; opacity: .9;
        }

        .cloud-band {
          position: absolute; left: -10%; right: -10%; height: 14%;
          background:
            radial-gradient(ellipse 60% 100% at 30% 50%, rgba(255,255,255,.55), transparent 70%),
            radial-gradient(ellipse 50% 100% at 70% 50%, rgba(255,255,255,.45), transparent 70%);
          filter: blur(8px);
        }
        .sky-alt + .clouds .cloud-band {
          background:
            radial-gradient(ellipse 60% 100% at 30% 50%, rgba(255,255,255,.7), transparent 70%),
            radial-gradient(ellipse 50% 100% at 70% 50%, rgba(255,255,255,.6), transparent 70%);
        }

        @keyframes sss-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: .15 } }
        .blink-dot { animation: sss-blink 2s infinite }

        @keyframes sss-drift {
          0%, 100% { transform: translate(0, 0) scale(1) }
          50% { transform: translate(-1.2%, .8%) scale(1.03) }
        }
        .drift { animation: sss-drift 14s ease-in-out infinite }

        @keyframes sss-drop {
          0% { transform: scaleY(0); transform-origin: top }
          50% { transform: scaleY(1); transform-origin: top }
          51% { transform-origin: bottom }
          100% { transform: scaleY(0); transform-origin: bottom }
        }
        .drop-line { animation: sss-drop 2.4s ease-in-out infinite }

        @keyframes sss-marquee {
          from { transform: translateY(0) }
          to { transform: translateY(-50%) }
        }
        .v-marquee { animation: sss-marquee 22s linear infinite }
      `}</style>

      <div
        ref={scrollerRef}
        className="sss-scroller relative h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#0a0e14] [scrollbar-width:none]"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* HUD overlay — sticky so it stays pinned to viewport across all snapped frames.
            Negative margin pulls the first frame back up so the HUD overlaps it. */}
        <div
          className="pointer-events-none sticky top-0 left-0 z-50 h-screen w-full"
          style={{ marginBottom: "-100vh" }}
          aria-hidden
        >
          <div
            className="relative h-full w-full font-mono text-[10px] uppercase tracking-[0.16em] text-[#e8e6e1]/60"
            style={{ mixBlendMode: "difference" }}
          >
            <div className="absolute left-0 top-0 flex items-center gap-3 px-7 py-5">
              <span className="block h-1.5 w-1.5 rounded-full bg-[#ff5d4d] blink-dot" />
              <span>REC</span>
              <span className="opacity-40">/</span>
              <span>ABOVE&nbsp;//&nbsp;FLEET STUDY</span>
            </div>
            <div className="absolute right-0 top-0 flex items-center gap-3 px-7 py-5">
              <span>{hudCoord}</span>
              <span className="opacity-40">/</span>
              <span>{utc}</span>
            </div>
            <div className="absolute bottom-0 left-0 flex items-center gap-3 px-7 py-5">
              <span>FRAME</span>
              <span className="font-medium text-[#e8e6e1]">{hudFrame}</span>
              <span className="opacity-40">/</span>
              <span>0{totalFrames}</span>
            </div>
            <div className="absolute bottom-0 right-0 px-7 py-5">
              <span>FRAME&nbsp;<span className="font-medium text-[#e8e6e1]">{hudFrame}</span></span>
            </div>
          </div>
        </div>

        {/* Side rail + scroll cue — second sticky layer (no blend mode, interactive). */}
        <div
          className="pointer-events-none sticky top-0 left-0 z-[51] h-screen w-full"
          style={{ marginBottom: "-100vh" }}
        >
          <nav
            className="pointer-events-auto absolute right-7 top-1/2 flex -translate-y-1/2 flex-col gap-4"
            aria-label="Frames"
          >
            {[...FRAMES.map((f) => f.index), "→"].map((label, i) => {
              const isActive = i === activeIdx
              return (
                <button
                  key={label + i}
                  onClick={() => goTo(i)}
                  className="group flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] transition-colors"
                  style={{ color: isActive ? "#e8e6e1" : "rgba(232,230,225,0.45)" }}
                  aria-label={`Go to frame ${i + 1}`}
                >
                  <span
                    className="block h-px transition-all duration-300"
                    style={{
                      width: isActive ? 28 : 14,
                      background: isActive ? "#c9a96e" : "currentColor",
                    }}
                  />
                  {label}
                </button>
              )
            })}
          </nav>

          <div
            className={`absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] text-[#e8e6e1]/55 transition-opacity duration-300 ${
              scrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            <span>SCROLL</span>
            <span className="block h-8 w-px bg-gradient-to-b from-transparent to-[#e8e6e1] drop-line" />
          </div>
        </div>

        {/* Frames */}
        {FRAMES.map((f, i) => {
          const active = i === activeIdx
          const isHeritageType = f.variant === "heritage"
          const isGold = f.variant === "gold"
          return (
            <article
              key={f.key}
              ref={(el) => { frameRefs.current[i] = el }}
              className="sss-frame relative h-screen w-full snap-start snap-always overflow-hidden"
              style={{ isolation: "isolate" }}
            >
              {/* sky */}
              <div className={`absolute inset-0 z-0 sky-${f.variant}`} />

              {/* clouds */}
              <div className="clouds pointer-events-none absolute inset-[-10%_-5%] z-[1] opacity-70" data-parallax="0.18">
                <div className="cloud-band" style={{ top: "62%" }} />
                <div className="cloud-band" style={{ top: "74%", height: "20%", filter: "blur(14px)", opacity: 0.85 }} />
                <div className="cloud-band" style={{ top: "86%", height: "24%", filter: "blur(18px)", opacity: 0.95 }} />
              </div>

              {/* craft */}
              <div
                className="absolute inset-0 z-[2] grid place-items-center drift"
                data-parallax={f.variant === "gold" ? "-0.1" : f.variant === "heritage" ? "-0.05" : "-0.08"}
                style={{ opacity: active ? 1 : 0, transform: active ? "scale(1)" : "scale(1.02)", transition: "opacity 1.4s ease, transform 1.8s ease" }}
              >
                {f.video ? (
                  <div
                    className="relative"
                    style={{
                      width: "min(90vw, 1500px)",
                      aspectRatio: "16/8",
                      filter: "drop-shadow(0 30px 60px rgba(0,0,0,.55))",
                    }}
                  >
                    <YouTubeClipLoop
                      videoId={f.video.videoId}
                      clips={f.video.clips}
                      className="absolute inset-0 h-full w-full scale-[1.35]"
                    />
                    {/* Gentle vignette to anchor video into the gold-hour sky */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.35)_100%)]" />
                  </div>
                ) : f.imageSrc ? (
                  <Image
                    src={f.imageSrc}
                    alt={f.name}
                    width={f.imageWidth}
                    height={f.imageHeight}
                    priority={i === 0}
                    className="pointer-events-none select-none"
                    style={{
                      width: f.variant === "alt" ? "min(94vw, 1680px)" : "min(86vw, 1480px)",
                      height: "auto",
                      filter: "drop-shadow(0 30px 60px rgba(0,0,0,.55))",
                    }}
                  />
                ) : (
                  // DC-3 silhouette fallback
                  <svg
                    viewBox="0 0 1480 380"
                    aria-hidden
                    style={{
                      width: "min(94vw, 1680px)",
                      height: "auto",
                      filter: "drop-shadow(0 30px 60px rgba(0,0,0,.55)) sepia(.55) hue-rotate(-12deg) saturate(.9)",
                    }}
                  >
                    <g fill="#3b2a1c">
                      <ellipse cx="740" cy="200" rx="540" ry="34" />
                      <path d="M740 168 L1180 196 L1240 206 L1180 216 L740 232 Z" />
                      <path d="M200 196 L740 168 L740 232 L260 226 Z" opacity=".95" />
                      <path d="M200 200 L120 250 L260 230 Z" />
                      <ellipse cx="540" cy="186" rx="60" ry="22" />
                      <ellipse cx="940" cy="186" rx="60" ry="22" />
                      <path d="M540 166 L560 110 L580 110 L590 166 Z" />
                      <path d="M940 166 L960 110 L980 110 L990 166 Z" />
                      <path d="M460 196 L740 130 L1020 196 Z" opacity=".88" />
                      <path d="M1170 198 L1230 158 L1260 168 L1230 200 Z" />
                    </g>
                  </svg>
                )}
              </div>

              {/* grain */}
              <div
                className="pointer-events-none absolute inset-0 z-[9]"
                style={{
                  opacity: f.variant === "heritage" ? 0.55 : f.variant === "gold" ? 0.28 : f.variant === "alt" ? 0.22 : 0.35,
                  mixBlendMode: "overlay",
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
                }}
              />

              {/* copy */}
              <div className="pointer-events-none absolute inset-0 z-[3]">
                {/* logomark */}
                <div
                  className="absolute right-[5vw] top-[8vh] flex items-center gap-3 transition-all duration-1000"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(28px)",
                    transitionDelay: active ? "600ms" : "0ms",
                    color: isGold ? "#1a0f08" : "#e8e6e1",
                  }}
                >
                  <span
                    className="grid h-[42px] w-[42px] place-items-center rounded-full border text-[11px] font-semibold"
                    style={{ borderColor: isGold ? "rgba(26,15,8,0.55)" : "rgba(232,230,225,0.5)" }}
                  >
                    {f.badge}
                  </span>
                  <span
                    className={`text-[13px] font-extrabold uppercase tracking-[0.32em] ${isHeritageType ? "" : ""}`}
                  >
                    {f.badgeMeta}
                  </span>
                </div>

                {/* index numeral */}
                <div
                  className="absolute left-[5vw] top-[8vh] select-none transition-all duration-1000"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(28px)",
                    transitionDelay: active ? "50ms" : "0ms",
                    fontSize: "clamp(120px, 22vw, 360px)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.04em",
                    fontWeight: isHeritageType ? 400 : 200,
                    fontFamily: isHeritageType ? "Georgia, 'Times New Roman', serif" : "var(--font-inter), Inter, sans-serif",
                    color: "transparent",
                    WebkitTextStroke: isGold
                      ? "1px rgba(26,15,8,0.22)"
                      : isHeritageType
                        ? "1px rgba(212,184,150,0.32)"
                        : "1px rgba(232,230,225,0.18)",
                  }}
                >
                  {f.index}
                </div>

                {/* nameblock */}
                <div
                  className="pointer-events-auto absolute bottom-[14vh] left-[5vw] max-w-[60vw] transition-all duration-1000"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(28px)",
                    transitionDelay: active ? "180ms" : "0ms",
                  }}
                >
                  <div
                    className="mb-4 flex items-center gap-3.5 font-mono text-[11px] uppercase tracking-[0.4em]"
                    style={{ color: isGold ? "#7a2c1e" : "#c9a96e" }}
                  >
                    <span className="block h-px w-9" style={{ background: isGold ? "#7a2c1e" : "#c9a96e" }} />
                    {f.eyebrow}
                  </div>
                  <h2
                    className="text-balance"
                    style={{
                      fontWeight: isHeritageType ? 500 : 800,
                      fontSize: "clamp(56px, 9vw, 160px)",
                      lineHeight: 0.9,
                      letterSpacing: isHeritageType ? "-0.02em" : "-0.045em",
                      fontFamily: isHeritageType ? "Georgia, 'Times New Roman', serif" : "var(--font-inter), Inter, sans-serif",
                      color: isGold ? "#1a0f08" : "#e8e6e1",
                    }}
                  >
                    {f.name}
                  </h2>
                  <p
                    className="mt-5 max-w-[38ch] italic"
                    style={{
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      fontSize: "clamp(18px, 1.7vw, 28px)",
                      lineHeight: 1.3,
                      color: isGold ? "rgba(26,15,8,0.7)" : isHeritageType ? "rgba(232,220,200,0.78)" : "rgba(232,230,225,0.72)",
                    }}
                  >
                    {f.tagline}
                  </p>

                  {/* CTA */}
                  <Link
                    href={`/planes/${f.slug}`}
                    className="group mt-7 inline-flex items-center gap-3 border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] backdrop-blur-sm transition-colors"
                    style={{
                      borderColor: isGold ? "rgba(26,15,8,0.35)" : "rgba(232,230,225,0.25)",
                      color: isGold ? "#1a0f08" : "#e8e6e1",
                      background: isGold ? "rgba(255,242,196,0.18)" : "rgba(10,14,20,0.18)",
                    }}
                  >
                    Click to explore more
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                      <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>

                {/* callouts */}
                {f.callout && (
                  <Callout
                    {...f.callout}
                    isGold={isGold}
                    active={active}
                  />
                )}
                {f.callout2 && (
                  <Callout
                    {...f.callout2}
                    isGold={isGold}
                    active={active}
                  />
                )}

                {/* specs */}
                <div
                  className="pointer-events-auto absolute bottom-[5vh] right-[5vw] grid grid-cols-2 gap-px md:grid-cols-4 transition-all duration-1000"
                  style={{
                    opacity: active ? 1 : 0,
                    transform: active ? "translateY(0)" : "translateY(28px)",
                    transitionDelay: active ? "550ms" : "0ms",
                    background: isGold ? "rgba(26,15,8,0.1)" : "rgba(232,230,225,0.12)",
                    borderTop: `1px solid ${isGold ? "rgba(26,15,8,0.18)" : "rgba(232,230,225,0.18)"}`,
                    borderBottom: `1px solid ${isGold ? "rgba(26,15,8,0.18)" : "rgba(232,230,225,0.18)"}`,
                  }}
                >
                  {f.specs.map((s) => (
                    <div
                      key={s.k}
                      className="px-4 py-2.5 backdrop-blur"
                      style={{
                        background: isGold ? "rgba(255,242,196,0.32)" : "rgba(10,14,20,0.55)",
                        color: isGold ? "#1a0f08" : "#e8e6e1",
                      }}
                    >
                      <div
                        className="mb-1 font-mono text-[8px] uppercase tracking-[0.24em]"
                        style={{ color: isGold ? "rgba(26,15,8,0.6)" : "rgba(232,230,225,0.55)" }}
                      >
                        {s.k}
                      </div>
                      <Counter target={s.v} suffix={s.suffix} small={s.small} active={active} />
                    </div>
                  ))}
                </div>
              </div>
            </article>
          )
        })}

        {/* Coda — Fleet Redefined */}
        <article
          ref={(el) => { frameRefs.current[FRAMES.length] = el }}
          className="relative h-screen w-full snap-start snap-always overflow-hidden bg-gradient-to-b from-[#06080c] to-[#0b0b10]"
        >
          {/* faint dot grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(232,230,225,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,230,225,0.05) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 60% at 50% 50%, #000 30%, transparent 80%)",
            }}
          />

          <div className="relative z-10 mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-12 px-8 lg:grid-cols-2 lg:gap-24 lg:px-12">
            {/* Left — copy */}
            <div className="space-y-7 max-w-xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#3b82f6]">
                Modern Aviation
              </p>
              <h2 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                The Fleet.
                <br />
                <span className="text-[#94a3b8]">Redefined.</span>
              </h2>
              <p className="text-base leading-relaxed text-[#94a3b8] md:text-lg">
                From the double-deck Airbus A380 to the carbon-fibre Dreamliner —
                each aircraft is a leap in what flight can be.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#fleet"
                  className="group relative inline-flex overflow-hidden rounded-md bg-[#e8e6e1] px-7 py-3 text-sm font-medium tracking-wide text-[#0a0e14] transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-white/10"
                >
                  <span className="relative z-10">EXPLORE THE FLEET</span>
                  <div className="absolute inset-0 -translate-x-[200%] bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[200%]" />
                </a>
                <button
                  onClick={() => goTo(0)}
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-5 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-white/85 transition hover:border-white/30 hover:bg-white/10"
                >
                  ↑ Restart the showcase
                </button>
              </div>
            </div>

            {/* Right — vertical marquee */}
            <div
              className="relative h-[420px] overflow-hidden lg:h-[560px]"
              aria-hidden
            >
              <div className="v-marquee flex flex-col">
                {[...fleetNames, ...fleetNames].map((name, i) => (
                  <div
                    key={i}
                    className="py-5 text-3xl font-light tracking-tight text-white md:text-4xl lg:text-5xl"
                  >
                    {name}
                  </div>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-[#0b0b10] via-[#0b0b10]/60 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-[#0b0b10] via-[#0b0b10]/60 to-transparent" />
            </div>
          </div>

          {/* coda HUD echo */}
          <div
            className="pointer-events-none absolute bottom-0 left-0 px-7 py-5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55"
            aria-hidden
          >
            DEPARTURE · FLEET · {totalFrames + 1}/{totalFrames + 1}
          </div>
        </article>
      </div>
    </section>
  )
}

function Callout({
  x,
  y,
  primary,
  secondary,
  mirror,
  isGold,
  active,
}: {
  x: string
  y: string
  primary: string
  secondary: string
  mirror?: boolean
  isGold: boolean
  active: boolean
}) {
  return (
    <div
      className="pointer-events-none absolute flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-1000"
      style={{
        left: mirror ? undefined : x,
        right: mirror ? `calc(100% - ${x})` : undefined,
        top: y,
        flexDirection: mirror ? "row-reverse" : "row",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(28px)",
        transitionDelay: active ? "700ms" : "0ms",
        color: isGold ? "rgba(26,15,8,0.85)" : "rgba(232,230,225,0.85)",
      }}
    >
      <span className="relative block h-[18px] w-[18px] flex-none rounded-full border" style={{ borderColor: "#c9a96e" }}>
        <span className="absolute inset-[6px] rounded-full bg-[#c9a96e]" />
      </span>
      <span className="block h-px w-[60px]" style={{ background: isGold ? "rgba(26,15,8,0.4)" : "rgba(232,230,225,0.35)" }} />
      <span className={`flex flex-col gap-0.5 ${mirror ? "text-right" : ""}`}>
        <span>{primary}</span>
        <span className="text-[9px]" style={{ color: isGold ? "rgba(26,15,8,0.55)" : "rgba(232,230,225,0.45)" }}>
          {secondary}
        </span>
      </span>
    </div>
  )
}
