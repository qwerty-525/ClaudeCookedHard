"use client"
import { useRef, useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"

interface Props {
  detail: string
  name: string
  year: number
}

export default function ConcordeVideoPlayer({ detail, name, year }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showSlider, setShowSlider] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const sync = () => {
      if (v.duration && !isNaN(v.duration)) setDuration(v.duration)
      setProgress(v.currentTime)
    }
    if (v.readyState >= 1) sync()
    v.addEventListener("loadedmetadata", sync)
    v.addEventListener("timeupdate", sync)
    return () => {
      v.removeEventListener("loadedmetadata", sync)
      v.removeEventListener("timeupdate", sync)
    }
  }, [])

  // Click to seek and pause
  function handleSeek(val: number[]) {
    const v = videoRef.current
    if (!v || !v.duration) return
    const t = (val[0] / 100) * v.duration
    v.currentTime = t
    v.pause()
    setProgress(t)
  }

  const pct = duration ? (progress / duration) * 100 : 0
  const thumbColor = `rgb(${lerp(245,59,pct/100)},${lerp(158,130,pct/100)},${lerp(11,246,pct/100)})`

  return (
    <div className="relative w-screen left-1/2 -translate-x-1/2 h-screen overflow-hidden mb-10">
      {/* Full-screen video */}
      <video
        ref={videoRef}
        src="/concorded2n.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

      {/* Header overlay */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center pointer-events-none">
        <p className="text-[#3b82f6] text-xs tracking-[0.45em] uppercase mb-3 font-medium">
          {detail}
        </p>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          {name}
        </h1>
        <p className="text-white/40 text-sm mt-3 tracking-widest uppercase">
          First flight · {year}
        </p>
      </div>

      {/* Bottom hover zone — triggers slider */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 z-10"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      />

      {/* Liquid glass scrubber */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[min(680px,calc(100%-3rem))] z-20 transition-all duration-300 ${showSlider ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <div
          className="rounded-3xl px-6 py-5"
          style={{
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
            WebkitBackdropFilter: "blur(24px) saturate(200%) brightness(1.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1.5px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.2)",
          }}
        >
          <Slider
            value={[pct]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="concorde-slider w-full"
            style={{ "--thumb-color": thumbColor } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  )
}

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t)
}
