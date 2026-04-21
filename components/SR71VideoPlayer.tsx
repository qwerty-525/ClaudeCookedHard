"use client"
import { useRef, useEffect, useState } from "react"
import { LightPullThemeSwitcher } from "@/components/ui/light-pull-theme-switcher"

const DAY_START   = 0
const DAY_END     = 3
const NIGHT_START = 3
const NIGHT_END   = 7

interface Props {
  detail: string
  name: string
  year: number
}

export default function SR71VideoPlayer({ detail, name, year }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsDark(root.classList.contains("dark"))
    update()
    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.currentTime = isDark ? NIGHT_START : DAY_START
    v.play()
  }, [isDark])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onTime = () => {
      const end   = isDark ? NIGHT_END   : DAY_END
      const start = isDark ? NIGHT_START : DAY_START
      if (v.currentTime >= end) v.currentTime = start
    }
    v.addEventListener("timeupdate", onTime)
    return () => v.removeEventListener("timeupdate", onTime)
  }, [isDark])

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 h-screen overflow-hidden mb-10">
      <video
        ref={videoRef}
        src="/sr71d2n.mp4"
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Header overlay — bottom centre */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-red-400/70 text-xs tracking-[0.45em] uppercase mb-3 font-medium">
          {detail}
        </p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          {name}
        </h1>
        <p className="text-white/40 text-sm mt-3 tracking-widest uppercase">
          Entered service · {year}
        </p>
      </div>

      {/* Day / Night label */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-white/40">
          {isDark ? "Night" : "Day"}
        </span>
      </div>

      {/* Pull-cord — bottom centre, above header */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase mb-1">
          Pull to switch
        </p>
        <LightPullThemeSwitcher />
      </div>
    </div>
  )
}
