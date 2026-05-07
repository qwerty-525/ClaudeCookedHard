"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import YouTubeClipLoop, { type Clip } from "@/components/YouTubeClipLoop"

const F35_HERO_CLIPS: Clip[] = [{ start: 150, end: 155 }]
const B2_CLIPS: Clip[] = [{ start: 40, end: 56 }]

interface Hotspot {
  x: string
  y: string
  title: string
  body: string
}

const F35_HOTSPOTS: Hotspot[] = [
  { x: "38%", y: "42%", title: "EOTS // SENSOR", body: "Electro-Optical Targeting System — passive IR detect & track." },
  { x: "56%", y: "54%", title: "F135 ENGINE", body: "43,000 lb thrust. Largest fighter engine ever flown." },
  { x: "72%", y: "38%", title: "RAM SKIN", body: "Radar-absorbent coating reduces RCS to ~0.0015 m²." },
]

export default function FightersSnapScroll() {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<Array<HTMLElement | null>>([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const sy = el.scrollTop
        let best = Infinity
        let idx = 0
        frameRefs.current.forEach((f, i) => {
          if (!f) return
          const d = Math.abs(f.offsetTop - sy)
          if (d < best) { best = d; idx = i }
        })
        setActiveIdx(idx)
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

  // Close hotspots when clicking outside
  useEffect(() => {
    const onDocClick = () => setActiveHotspot(null)
    document.addEventListener("click", onDocClick)
    return () => document.removeEventListener("click", onDocClick)
  }, [])

  const frames = [
    { label: "DOSSIER", key: "hero" },
    { label: "F-35 LIGHTNING II", key: "f35" },
    { label: "B-2 SPIRIT", key: "b2" },
    { label: "F-117 NIGHTHAWK", key: "f117" },
    { label: "SR-71 BLACKBIRD", key: "sr71" },
  ]
  const total = frames.length

  return (
    <section className="relative w-full" aria-label="Fighter jets snap-scroll">
      <style jsx>{`
        .fss-scroller::-webkit-scrollbar { display: none }

        .blink-dot { animation: fss-blink 2s infinite }
        @keyframes fss-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: .15 } }

        @keyframes fss-pulse {
          0% { transform: scale(.6); opacity: .7 }
          100% { transform: scale(1.8); opacity: 0 }
        }
        .pulse-ring { animation: fss-pulse 2.4s ease-out infinite }

        @keyframes fss-sweep {
          0%, 100% { left: -30% }
          50% { left: 130% }
        }
        .sweep-anim { animation: fss-sweep 6s ease-in-out infinite }

        @keyframes fss-slide {
          0% { transform: scaleY(0); transform-origin: top }
          50% { transform: scaleY(1); transform-origin: top }
          51% { transform-origin: bottom }
          100% { transform: scaleY(0); transform-origin: bottom }
        }
        .slide-line { animation: fss-slide 2s ease-in-out infinite }

        @keyframes fss-draw {
          to { stroke-dashoffset: 0 }
        }
        .draw-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
        }
        .draw-active .draw-path { animation: fss-draw 3s ease-out forwards .3s }

        .scanlines {
          background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.18) 2px 3px);
          mix-blend-mode: multiply;
        }

        .grid-major {
          background-image:
            linear-gradient(0deg, rgba(120,200,255,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,200,255,.07) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .grid-minor {
          background-image:
            linear-gradient(0deg, rgba(120,200,255,.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,200,255,.03) 1px, transparent 1px);
          background-size: 8px 8px;
        }

        .stars {
          background-image:
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.4), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,.3), transparent),
            radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.25), transparent),
            radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,.2), transparent),
            radial-gradient(1px 1px at 90% 50%, rgba(255,255,255,.3), transparent),
            radial-gradient(1px 1px at 10% 60%, rgba(255,255,255,.25), transparent);
          background-size: 600px 600px;
        }
      `}</style>

      <div
        ref={scrollerRef}
        className="fss-scroller relative h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-[#070707] [scrollbar-width:none]"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* Persistent chrome (sticky overlay) */}
        <div
          className="pointer-events-none sticky top-0 left-0 z-50 h-screen w-full"
          style={{ marginBottom: "-100vh" }}
          aria-hidden
        >
          <div className="relative h-full w-full">
            {/* Brand */}
            <div className="absolute left-8 top-7 flex items-center gap-2.5 font-mono text-[13px] font-semibold uppercase tracking-[0.22em] text-[#f4f3ef]">
              <span className="block h-[7px] w-[7px] rounded-full bg-[#ff2a1f] shadow-[0_0_12px_#ff2a1f]" />
              <span>APEX // AERO INDEX</span>
            </div>
            {/* Top nav */}
            <div className="absolute right-8 top-7 hidden items-center gap-7 font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a87] md:flex">
              <span className="text-[#f4f3ef]">SQUADRON</span>
              <span>ARCHIVE</span>
              <span>DOCTRINE</span>
              <span>CONTACT</span>
            </div>
            {/* Side nav (right, vertically centered) */}
            <nav
              className="pointer-events-auto absolute right-7 top-1/2 flex -translate-y-1/2 flex-col items-end gap-3.5"
              aria-label="Frames"
            >
              {frames.map((f, i) => {
                const active = i === activeIdx
                return (
                  <button
                    key={f.key}
                    onClick={() => goTo(i)}
                    className="group flex items-center gap-2.5 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
                    style={{ color: active ? "#f4f3ef" : "#8a8a87" }}
                    aria-label={`Go to ${f.label}`}
                  >
                    <span
                      className={`transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    >
                      {f.label}
                    </span>
                    <span
                      className="block h-px transition-all duration-300"
                      style={{
                        width: active ? 48 : 24,
                        background: active ? "#ff2a1f" : "currentColor",
                      }}
                    />
                  </button>
                )
              })}
            </nav>

            {/* Frame counter */}
            <div className="absolute left-8 bottom-[190px] font-mono text-[11px] uppercase tracking-[0.18em] text-[#8a8a87]">
              <span className="font-medium text-[#f4f3ef]">{String(activeIdx + 1).padStart(2, "0")}</span>
              {" "}/ {String(total).padStart(2, "0")}
            </div>
            {/* Progress rail */}
            <div className="absolute left-8 bottom-8 h-[140px] w-[2px] bg-[rgba(244,243,239,0.14)]">
              <span
                className="absolute -left-[2px] block w-[6px] bg-[#ff2a1f] transition-transform duration-[350ms]"
                style={{
                  height: "20%",
                  transform: `translateY(${activeIdx * 100}%)`,
                }}
              />
            </div>
            {/* Scroll cue (frame 0 only) */}
            <div
              className={`absolute left-1/2 bottom-7 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#8a8a87] transition-opacity duration-300 ${activeIdx === 0 ? "opacity-100" : "opacity-0"}`}
            >
              <span>SCROLL</span>
              <span className="block h-9 w-px bg-gradient-to-b from-transparent to-[#f4f3ef] slide-line" />
            </div>
          </div>
        </div>

        {/* ─────── FRAME 1 — Hero Video (F-35) ─────── */}
        <article
          ref={(el) => { frameRefs.current[0] = el }}
          className="relative h-screen w-full snap-start snap-always overflow-hidden bg-black"
        >
          {/* Hero video */}
          <div className="absolute inset-0">
            <YouTubeClipLoop
              videoId="W41nCCFZgyA"
              clips={F35_HERO_CLIPS}
              className="absolute inset-0 h-full w-full scale-[1.35] pointer-events-none"
            />
          </div>

          {/* Scanlines + vignette */}
          <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.55) 75%, #000 100%), linear-gradient(180deg, rgba(0,0,0,.4) 0%, transparent 18%, transparent 70%, rgba(0,0,0,.7) 100%)",
            }}
          />

          {/* Crosshair */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2"
            style={{ mixBlendMode: "screen" }}
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[#ff2a1f]" />
            <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#ff2a1f]" />
            <span className="absolute left-0 top-0 h-2.5 w-2.5 border-l border-t border-[#ff2a1f]" />
            <span className="absolute right-0 top-0 h-2.5 w-2.5 border-r border-t border-[#ff2a1f]" />
            <span className="absolute bottom-0 left-0 h-2.5 w-2.5 border-b border-l border-[#ff2a1f]" />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 border-b border-r border-[#ff2a1f]" />
            <em className="absolute left-1/2 -top-5 -translate-x-1/2 font-mono text-[10px] not-italic tracking-[0.2em] text-[#ff2a1f]">
              TRACKING // 47.2188° N
            </em>
          </div>

          {/* Telemetry */}
          <div className="absolute left-16 top-1/2 -translate-y-1/2 font-mono text-[11px] tracking-[0.1em] text-[#f4f3ef]">
            {[
              { k: "MACH", w: 62 },
              { k: "ALT", w: 78 },
              { k: "G-LOAD", w: 34 },
              { k: "SIGNAL", w: 91 },
            ].map((row) => (
              <div key={row.k} className="mb-1.5 grid grid-cols-[80px_1fr] items-center gap-3.5">
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#8a8a87]">{row.k}</span>
                <span className="relative block h-[4px] w-[140px] bg-white/10">
                  <span
                    className="absolute inset-y-0 left-0 bg-[#ff2a1f]"
                    style={{ width: `${row.w}%` }}
                  />
                </span>
              </div>
            ))}
          </div>

          {/* Foreground copy */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-12 px-16 pb-24">
            <h1
              className="text-balance font-bold uppercase leading-[0.85] tracking-tight text-[#f4f3ef]"
              style={{
                fontSize: "clamp(64px, 11vw, 180px)",
                letterSpacing: "-0.01em",
                textShadow: "0 4px 40px rgba(0,0,0,.6)",
              }}
            >
              Air<br />
              Dom<em className="not-italic text-[#ff2a1f]">i</em>nance<br />
              by Design.
            </h1>
            <div className="flex min-w-[280px] flex-col items-end gap-3.5 text-right">
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8a8a87]">
                <span className="text-[#ff2a1f]">●</span>{" "}LIVE FEED // VOL.04
              </span>
              <span className="font-mono text-[12px] text-[#8a8a87]">
                A FIELD STUDY OF FOUR<br />
                AMERICAN AIRFRAMES THAT<br />
                REWROTE THE SKY.
              </span>
            </div>
          </div>
        </article>

        {/* ─────── FRAME 2 — F-35 Lightning II (Editorial) ─────── */}
        <article
          ref={(el) => { frameRefs.current[1] = el }}
          className="relative h-screen w-full snap-start snap-always overflow-hidden"
          style={{ background: "linear-gradient(180deg,#f4f3ef 0%,#e6e4dc 100%)", color: "#0a0a0a" }}
        >
          <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_1.4fr]">
            {/* Left column */}
            <div className="flex flex-col justify-between px-8 py-20 md:px-16 md:pt-[120px] md:pb-16">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#666]">
                  <span className="text-[#ff2a1f]">02 //</span>&nbsp;&nbsp;LIGHTNING II
                </p>
                <h2
                  className="mt-8 font-bold uppercase leading-[0.82] tracking-tight text-[#0a0a0a]"
                  style={{ fontSize: "clamp(72px, 11vw, 180px)", letterSpacing: "-0.02em" }}
                >
                  F<em className="not-italic font-bold text-[#ff2a1f]">-</em>35<br />
                  Lightning<br />II.
                </h2>
                <p className="mt-7 max-w-md text-[17px] font-light leading-[1.55] text-[#222]">
                  A multirole stealth fighter so quiet on radar it appears no larger than a steel marble. Sensor fusion blends every input — radar, IR, RWR, datalink — into one battlespace truth.
                </p>
                <Link
                  href="/fighters/f35"
                  className="group mt-8 inline-flex items-center gap-3 border border-black/30 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#0a0a0a] transition-colors hover:border-[#ff2a1f] hover:text-[#ff2a1f]"
                >
                  Explore the F-35
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <div className="mt-12 font-mono text-[64px] font-light leading-none text-[#0a0a0a] md:text-[80px]">
                02
                <sup className="ml-1.5 align-top text-[14px] tracking-[0.2em] text-[#666]">// 05</sup>
              </div>
            </div>

            {/* Right column — F-35 image with hotspots */}
            <div className="relative overflow-hidden bg-[#0a0a0a]">
              <div className="absolute inset-0 grid place-items-center">
                <Image
                  src="/planes/f35.png"
                  alt="F-35 Lightning II"
                  width={1400}
                  height={500}
                  className="pointer-events-none select-none"
                  style={{
                    width: "min(100%, 1400px)",
                    height: "auto",
                    filter: "drop-shadow(0 30px 60px rgba(0,0,0,.6))",
                  }}
                />
              </div>
              {/* Sweep light */}
              <div
                className="sweep-anim pointer-events-none absolute inset-y-0 w-[30%]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,.08) 50%, transparent)",
                  mixBlendMode: "screen",
                }}
              />
              {/* Right-edge darkening */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse at 30% 50%, transparent 40%, rgba(0,0,0,.5) 100%)" }}
              />

              {/* Hotspots */}
              {F35_HOTSPOTS.map((h, i) => {
                const active = activeHotspot === i
                return (
                  <button
                    key={h.title}
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveHotspot(active ? null : i)
                    }}
                    onMouseEnter={() => setActiveHotspot(i)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    className="group absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-[#ff2a1f] bg-[rgba(255,42,31,0.25)]"
                    style={{ left: h.x, top: h.y }}
                    aria-label={h.title}
                  >
                    <span className="pulse-ring absolute -inset-2 rounded-full border border-[#ff2a1f]" />
                    <span
                      className="pointer-events-none absolute -top-2.5 left-[30px] w-[220px] border border-[#ff2a1f] bg-[#0a0a0a] p-2.5 px-3.5 font-mono text-[11px] tracking-[0.1em] text-[#f4f3ef] transition-all duration-300"
                      style={{ opacity: active ? 1 : 0, transform: `translateX(${active ? 0 : -6}px)` }}
                    >
                      <b className="mb-1 block text-[9px] uppercase tracking-[0.2em] text-[#ff2a1f]">{h.title.split(" // ")[0]}</b>
                      {h.body}
                    </span>
                  </button>
                )
              })}

              {/* Feature card */}
              <div className="absolute bottom-12 right-12 max-w-[340px] border border-white/10 bg-black/85 p-7 text-[#f4f3ef] backdrop-blur-md">
                <span className="mb-2.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2a1f]">
                  notable feature
                </span>
                <p className="text-[15px] leading-[1.45]">
                  The first fighter where the pilot's helmet sees through the airframe — six DAS cameras stream a 360° composite to the visor.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* ─────── FRAME 3 — B-2 Spirit (Stealth obsidian, video) ─────── */}
        <article
          ref={(el) => { frameRefs.current[2] = el }}
          className="relative h-screen w-full snap-start snap-always overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 70%, #14141a 0%, #050507 70%, #000 100%)" }}
        >
          {/* Iridescent wash */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 20% 30%, rgba(80,60,140,.18), transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(20,80,120,.15), transparent 50%)",
              mixBlendMode: "screen",
            }}
          />
          {/* Stars */}
          <div className="stars pointer-events-none absolute inset-0" />
          {/* Horizon line */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[32%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.2) 30%, rgba(255,255,255,.2) 70%, transparent)" }}
          />
          {/* Wing glow */}
          <div
            className="pointer-events-none absolute left-1/2 top-[55%] h-[60px] w-[90vw] -translate-x-1/2 -translate-y-1/2"
            style={{
              background: "radial-gradient(ellipse at center, rgba(255,42,31,.22), transparent 60%)",
              filter: "blur(20px)",
            }}
          />

          {/* B-2 looping video as the centerpiece */}
          <div
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2"
            style={{ width: "min(78vw, 1200px)", height: "min(50vh, 520px)" }}
          >
            <YouTubeClipLoop
              videoId="7Vb7IKhVKu4"
              clips={B2_CLIPS}
              className="absolute inset-0 h-full w-full scale-[1.35] pointer-events-none"
            />
            {/* Subtle vignette to soften the YT player edges */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.6)_100%)]" />
          </div>

          {/* Stage-inner copy */}
          <div className="relative z-[2] flex h-full flex-col justify-between px-16 pt-[120px] pb-20">
            <div className="flex items-start justify-between gap-12">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#8a8a87]">
                  <span className="text-[#ff2a1f]">03 //</span>&nbsp;&nbsp;SPIRIT
                </p>
                <h2
                  className="mt-4 italic uppercase leading-[0.85] tracking-tight text-[#f4f3ef]"
                  style={{ fontSize: "clamp(64px, 11vw, 180px)", letterSpacing: "-0.01em", fontWeight: 400, fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  B<em className="not-italic font-semibold text-[#ff2a1f]">-</em>2<br />
                  Spirit.
                </h2>
              </div>
              <div className="flex min-w-[240px] flex-col items-end gap-1.5 text-right">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8a87]">First Flight</span>
                <span className="text-[88px] font-light leading-none tracking-tight text-[#f4f3ef]" style={{ fontFamily: "Georgia, serif" }}>'89</span>
                <span className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8a87]">Crew of two</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#8a8a87]">21 built</span>
              </div>
            </div>

            <div className="flex flex-wrap items-end justify-between gap-12">
              <p
                className="max-w-[540px] text-[28px] font-light leading-[1.1] text-[#f4f3ef]"
                style={{ letterSpacing: "-0.005em" }}
              >
                A 172-foot wingspan that <em className="not-italic font-medium text-[#ff2a1f]">dissolves on radar</em> — the entire aircraft is the wing, the wing is the cockpit, there is no tail to give it away.
              </p>
              <div className="flex flex-col items-start gap-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-2.5 font-mono text-[12px]">
                  <dt className="text-[#8a8a87] uppercase tracking-[0.18em]">RCS</dt>
                  <dd className="text-[#f4f3ef]">~0.1 m²</dd>
                  <dt className="text-[#8a8a87] uppercase tracking-[0.18em]">Range</dt>
                  <dd className="text-[#f4f3ef]">11,000 km</dd>
                  <dt className="text-[#8a8a87] uppercase tracking-[0.18em]">Ceiling</dt>
                  <dd className="text-[#f4f3ef]">50,000 ft</dd>
                  <dt className="text-[#8a8a87] uppercase tracking-[0.18em]">Payload</dt>
                  <dd className="text-[#f4f3ef]">40,000 lb</dd>
                </dl>
                <Link
                  href="/b-2"
                  className="group inline-flex items-center gap-3 border border-white/30 bg-white/5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#f4f3ef] backdrop-blur-sm transition-colors hover:border-[#ff2a1f] hover:text-[#ff2a1f]"
                >
                  Explore the B-2
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* ─────── FRAME 4 — F-117 Nighthawk (Blueprint) ─────── */}
        <article
          ref={(el) => { frameRefs.current[3] = el }}
          className={`relative h-screen w-full snap-start snap-always overflow-hidden ${activeIdx === 3 ? "draw-active" : ""}`}
          style={{ background: "#0a1620", color: "#cfe8f5" }}
        >
          <div className="grid-major pointer-events-none absolute inset-0" />
          <div className="grid-minor pointer-events-none absolute inset-0" />

          <div className="relative z-[2] grid h-full grid-rows-[auto_1fr_auto] gap-6 px-16 py-20">
            {/* Top header */}
            <div className="flex items-start justify-between border-b border-[rgba(120,200,255,0.25)] pb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-[#7fb8d8]">
              <div className="flex flex-wrap gap-8">
                <span><b className="font-normal text-[#cfe8f5]">DOC</b> // AAX-117/SCH</span>
                <span><b className="font-normal text-[#cfe8f5]">SHEET</b> // 04 OF 05</span>
                <span><b className="font-normal text-[#cfe8f5]">CLASS</b> // DECLASSIFIED 1988</span>
              </div>
              <span><b className="font-normal text-[#cfe8f5]">SCALE</b> // 1 : 240</span>
            </div>

            {/* Schematic body */}
            <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-[1fr_360px]">
              {/* Canvas */}
              <div className="relative overflow-hidden border border-[rgba(120,200,255,0.3)]" style={{ background: "linear-gradient(135deg,rgba(120,200,255,.02),transparent)" }}>
                {/* Corner brackets */}
                <span className="absolute left-2 top-2 h-5 w-5 border-l border-t border-[#7fb8d8]" />
                <span className="absolute right-2 top-2 h-5 w-5 border-r border-t border-[#7fb8d8]" />
                <span className="absolute left-2 bottom-2 h-5 w-5 border-b border-l border-[#7fb8d8]" />
                <span className="absolute right-2 bottom-2 h-5 w-5 border-b border-r border-[#7fb8d8]" />

                {/* Labels */}
                <span className="absolute left-6 top-6 z-10 border border-[rgba(120,200,255,0.3)] bg-[rgba(10,22,32,0.85)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7fb8d8]">
                  PLAN VIEW // FACETED
                </span>
                <span className="absolute right-6 bottom-6 z-10 border border-[rgba(120,200,255,0.3)] bg-[rgba(10,22,32,0.85)] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#7fb8d8]">
                  SECTION A-A
                </span>

                {/* F-117 silhouette SVG */}
                <svg
                  viewBox="0 0 800 500"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker id="dot-117" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5">
                      <circle cx="5" cy="5" r="3" fill="#ff2a1f" />
                    </marker>
                  </defs>
                  {/* Faceted F-117 silhouette */}
                  <g fill="none" stroke="#7fb8d8" strokeWidth="1.2" opacity="0.55">
                    <polygon points="400,160 460,210 540,260 480,300 400,290 320,300 260,260 340,210" />
                    <polygon points="400,160 480,300 320,300" />
                    <polygon points="400,160 380,140 420,140" />
                    <line x1="320" y1="300" x2="200" y2="340" />
                    <line x1="480" y1="300" x2="600" y2="340" />
                  </g>
                  {/* Callout paths */}
                  <g fill="none">
                    <path className="draw-path" d="M 100 80 L 220 200 L 280 200" stroke="#7fb8d8" strokeWidth="1" markerEnd="url(#dot-117)" />
                    <path className="draw-path" d="M 700 100 L 580 220 L 480 220" stroke="#7fb8d8" strokeWidth="1" markerEnd="url(#dot-117)" />
                    <path className="draw-path" d="M 120 420 L 240 320" stroke="#7fb8d8" strokeWidth="1" markerEnd="url(#dot-117)" />
                    <path className="draw-path" d="M 680 420 L 540 320" stroke="#7fb8d8" strokeWidth="1" markerEnd="url(#dot-117)" />
                  </g>
                  <g fontFamily="monospace" fontSize="10" fill="#7fb8d8" letterSpacing="2">
                    <text x="100" y="70">FACET 17 // 30°</text>
                    <text x="700" y="90" textAnchor="end">RAM EDGE</text>
                    <text x="120" y="438">GRID FIN INTAKE</text>
                    <text x="680" y="438" textAnchor="end">PLATYPUS NOZZLE</text>
                  </g>
                </svg>
              </div>

              {/* Info column */}
              <div className="flex flex-col gap-6 py-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#7fb8d8]">04 // Nighthawk</span>
                <h2
                  className="font-bold uppercase leading-[0.85] tracking-tight text-[#eaf6ff]"
                  style={{ fontSize: "clamp(54px, 7vw, 84px)", letterSpacing: "-0.01em" }}
                >
                  F<em className="not-italic text-[#ff2a1f]">-</em>117
                </h2>
                <p className="border-l-2 border-[#ff2a1f] pl-4 text-[18px] font-light leading-[1.5] text-[#e0eef8]">
                  The first operational stealth aircraft. Its surfaces are <em className="not-italic font-medium text-[#ff2a1f]">flat polygons</em> — radar bounces away in every direction except back at the source.
                </p>
                <div className="grid grid-cols-2 gap-3.5 font-mono text-[11px]">
                  {[
                    { k: "First Flight", v: "1981" },
                    { k: "RCS", v: "0.025 m²" },
                    { k: "Top Speed", v: "Mach 0.92" },
                    { k: "Retired", v: "2008" },
                  ].map((d) => (
                    <div key={d.k} className="flex flex-col gap-1">
                      <span className="text-[#7fb8d8] uppercase tracking-[0.18em]">{d.k}</span>
                      <span className="text-[18px] font-medium text-[#eaf6ff]" style={{ fontFamily: "Inter, sans-serif" }}>{d.v}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/fighters/f117"
                  className="group inline-flex items-center gap-3 self-start border border-[#7fb8d8]/40 bg-[#7fb8d8]/5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#cfe8f5] transition-colors hover:border-[#ff2a1f] hover:text-[#ff2a1f]"
                >
                  Explore the F-117
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Bottom strip */}
            <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[rgba(120,200,255,0.25)] pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#7fb8d8]">
              <span>// SHEET 04</span>
              <span>FACETED EDGE GEOMETRY — DEFLECTION 30° NOMINAL</span>
              <span>RESTRICTED • ARCHIVE</span>
            </div>
          </div>
        </article>

        {/* ─────── FRAME 5 — SR-71 Blackbird (Sunset cinematic) ─────── */}
        <article
          ref={(el) => { frameRefs.current[4] = el }}
          className="relative h-screen w-full snap-start snap-always overflow-hidden"
          style={{ background: "linear-gradient(180deg,#000 0%,#0a0612 35%,#1a0808 70%,#3a0a05 100%)" }}
        >
          {/* Sun */}
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: "-30%",
              width: "120vw",
              height: "120vw",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,80,40,.5) 0%, rgba(255,42,31,.2) 30%, transparent 60%)",
              filter: "blur(40px)",
            }}
          />
          {/* Horizon */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-[30%] h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,150,100,.6) 50%, transparent)",
              boxShadow: "0 0 40px rgba(255,80,40,.4)",
            }}
          />
          {/* Haze */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 60%, rgba(255,80,40,.08) 100%)" }}
          />

          <div className="relative z-[2] grid h-full grid-rows-[auto_1fr_auto] px-16 pt-[120px] pb-20">
            {/* Top */}
            <div className="flex items-start justify-between gap-12">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-[#ffaa88]">
                  <span className="text-[#ff2a1f]">05 //</span>&nbsp;&nbsp;BLACKBIRD
                </p>
                <h2
                  className="mt-4 font-extrabold uppercase leading-[0.82] tracking-tight text-[#f4f3ef]"
                  style={{ fontSize: "clamp(72px, 13vw, 220px)", letterSpacing: "-0.02em", textShadow: "0 0 60px rgba(255,80,40,.3)" }}
                >
                  SR<em className="not-italic text-[#ff2a1f]">-</em>71<br />
                  Blackbird
                </h2>
              </div>
              <div className="flex flex-col items-end gap-1.5 text-right">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffaa88]">Cruise altitude</span>
                <span className="text-[56px] font-light leading-none tracking-tight text-[#f4f3ef]">
                  85,000<sup className="ml-1 align-top text-[14px] tracking-[0.2em] text-[#ffaa88]">FT</sup>
                </span>
                <span className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-[#ffaa88]">Top speed</span>
                <span className="text-[56px] font-light leading-none tracking-tight text-[#f4f3ef]">Mach 3.3</span>
              </div>
            </div>

            {/* Jet stage */}
            <div className="relative flex items-center justify-center">
              {/* Contrail */}
              <div
                className="pointer-events-none absolute left-0 right-[30%] top-[48%] h-[2px]"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,180,140,.5), rgba(255,255,255,.85))",
                  filter: "blur(2px)",
                }}
              >
                <span
                  className="pointer-events-none absolute -top-5 left-0 right-0 h-10"
                  style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,80,40,.15), rgba(255,255,255,.1))",
                    filter: "blur(20px)",
                  }}
                />
              </div>

              {/* SR-71 silhouette SVG */}
              <svg
                viewBox="0 0 1200 460"
                className="relative"
                style={{ width: "min(82vw, 1200px)", height: "min(50vh, 460px)", filter: "drop-shadow(0 30px 60px rgba(255,80,40,.4))" }}
                aria-hidden
              >
                <g fill="#0a0a0a" stroke="rgba(255,150,100,0.55)" strokeWidth="1">
                  {/* Long fuselage */}
                  <ellipse cx="600" cy="240" rx="500" ry="22" />
                  {/* Pointed nose */}
                  <polygon points="1100,240 1180,232 1180,248" />
                  {/* Tail fins */}
                  <polygon points="180,240 130,180 170,180 220,240" />
                  <polygon points="180,240 130,300 170,300 220,240" />
                  {/* Engine nacelles + delta wing */}
                  <ellipse cx="500" cy="240" rx="140" ry="42" />
                  <polygon points="380,240 600,210 740,240 600,272" />
                  {/* Cockpit canopy */}
                  <ellipse cx="950" cy="234" rx="40" ry="10" fill="rgba(255,180,140,0.18)" />
                </g>
                <g stroke="rgba(255,80,40,0.35)" strokeWidth="0.5" fill="none">
                  <line x1="200" y1="240" x2="1100" y2="240" />
                </g>
              </svg>
            </div>

            {/* Bottom */}
            <div className="flex flex-wrap items-end justify-between gap-12">
              <p
                className="max-w-[560px] text-[26px] font-light italic leading-[1.15] text-[#ffe8d8]"
                style={{ letterSpacing: "-0.005em", fontFamily: "Georgia, serif" }}
              >
                It outruns its own missiles. Standard evasion procedure: <em className="not-italic font-medium text-[#ff2a1f]">accelerate</em>. Skin temperatures hit 600°F at cruise — the airframe expands six inches, sealing fuel tanks that leak on the ground.
              </p>
              <div className="flex flex-col items-start gap-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-7 gap-y-2.5 font-mono text-[12px]">
                  <dt className="text-[#ffaa88] uppercase tracking-[0.18em]">First Flight</dt>
                  <dd className="text-[#f4f3ef]">1964</dd>
                  <dt className="text-[#ffaa88] uppercase tracking-[0.18em]">Crew</dt>
                  <dd className="text-[#f4f3ef]">2</dd>
                  <dt className="text-[#ffaa88] uppercase tracking-[0.18em]">Service</dt>
                  <dd className="text-[#f4f3ef]">1966–1999</dd>
                  <dt className="text-[#ffaa88] uppercase tracking-[0.18em]">Built</dt>
                  <dd className="text-[#f4f3ef]">32</dd>
                </dl>
                <Link
                  href="/fighters/sr-71-blackbird"
                  className="group inline-flex items-center gap-3 border border-[#ffaa88]/40 bg-white/5 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.32em] text-[#f4f3ef] backdrop-blur-sm transition-colors hover:border-[#ff2a1f] hover:text-[#ff2a1f]"
                >
                  Explore the SR-71
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
