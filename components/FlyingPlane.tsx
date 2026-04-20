"use client"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const ConcordeSVG = () => (
  <svg width="480" height="90" viewBox="0 0 480 90" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Long slender fuselage */}
    <path
      d="M 468 41 L 440 37 L 300 35 L 80 35 C 52 35 22 38 6 42 C 22 46 52 47 80 47 L 300 47 L 440 45 L 468 41 Z"
      fill="white"
    />
    {/* Ogival delta wing — bottom */}
    <path
      d="M 395 47 C 280 53 145 63 62 82 L 57 80 C 140 61 275 51 390 47 Z"
      fill="white"
      fillOpacity="0.88"
    />
    {/* Ogival delta wing — top */}
    <path
      d="M 395 35 C 280 29 145 19 62 2 L 57 4 C 140 21 275 31 390 35 Z"
      fill="white"
      fillOpacity="0.88"
    />
    {/* Engine pod 1 */}
    <ellipse cx="195" cy="75" rx="28" ry="5" fill="white" fillOpacity="0.72"/>
    {/* Engine pod 2 */}
    <ellipse cx="220" cy="82" rx="24" ry="4.5" fill="white" fillOpacity="0.65"/>
    {/* Vertical stabiliser (Concorde's is small) */}
    <path d="M 432 35 L 444 14 L 449 15 L 438 35 Z" fill="white" fillOpacity="0.78"/>
    {/* Drooped nose tip */}
    <path d="M 6 42 C 0 43 -5 45 -3 47 C -1 49 4 46 6 42 Z" fill="white"/>
    {/* Soft glow */}
    <ellipse cx="240" cy="42" rx="180" ry="7" fill="white" fillOpacity="0.04"/>
  </svg>
)

const F35SVG = () => (
  <svg width="420" height="86" viewBox="0 0 420 86" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Angular fuselage */}
    <path
      d="M 408 40 L 375 33 L 245 30 L 105 32 C 68 34 32 37 6 41 C 32 45 68 47 105 46 L 245 48 L 375 49 L 408 42 Z"
      fill="white"
    />
    {/* Swept delta wing — bottom */}
    <path
      d="M 305 48 L 58 76 L 53 73 L 295 48 Z"
      fill="white"
      fillOpacity="0.87"
    />
    {/* Swept delta wing — top */}
    <path
      d="M 305 33 L 58 5 L 53 8 L 295 33 Z"
      fill="white"
      fillOpacity="0.87"
    />
    {/* Horizontal stabiliser */}
    <path d="M 370 48 L 395 64 L 390 64 L 366 48 Z" fill="white" fillOpacity="0.7"/>
    <path d="M 370 33 L 395 17 L 390 17 L 366 33 Z" fill="white" fillOpacity="0.7"/>
    {/* Engine nozzle */}
    <ellipse cx="412" cy="41" rx="9" ry="11" fill="white" fillOpacity="0.42"/>
    {/* Afterburner glow */}
    <ellipse cx="420" cy="41" rx="7" ry="8" fill="#f97316" fillOpacity="0.35"/>
    {/* Bubble canopy */}
    <path d="M 165 30 Q 182 19 215 22 L 218 30 Z" fill="white" fillOpacity="0.55"/>
    {/* Intake (bottom) */}
    <path d="M 168 48 L 205 48 L 205 56 L 163 56 Z" fill="white" fillOpacity="0.38"/>
    {/* Dorsal spine */}
    <path d="M 210 30 L 355 28 L 360 30 L 210 32 Z" fill="white" fillOpacity="0.28"/>
    {/* Soft glow */}
    <ellipse cx="210" cy="41" rx="170" ry="7" fill="white" fillOpacity="0.04"/>
  </svg>
)

interface FlyingPlaneProps {
  type?: "concorde" | "f35"
  imageSrc?: string
  imageWidth?: number
  imageHeight?: number
  label: string
}

export default function FlyingPlane({
  type,
  imageSrc,
  imageWidth = 520,
  imageHeight = 200,
  label,
}: FlyingPlaneProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Phase 1 (0→0.5): fly in from left to centre
  // Phase 2 (0.5→1): stay centred, scale up
  const x = useTransform(scrollYProgress, [0, 0.5, 1], ["-120vw", "0vw", "0vw"])
  const scale = useTransform(scrollYProgress, [0, 0.38, 1], [1, 1, 4.5])
  const opacity = useTransform(scrollYProgress, [0, 0.08, 0.75, 1], [0, 1, 1, 0])

  return (
    <div
      ref={ref}
      className="relative h-[60vh] flex items-center justify-center overflow-hidden"
    >
      {/* Atmospheric glow behind plane */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent pointer-events-none" />

      {/* Label */}
      <motion.p
        style={{ opacity }}
        className="absolute top-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.35em] text-[#94a3b8] uppercase whitespace-nowrap"
      >
        {label}
      </motion.p>

      {/* Flying plane */}
      <motion.div
        style={{ x, scale, opacity }}
        className="drop-shadow-[0_0_32px_rgba(255,255,255,0.2)]"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={label}
            width={imageWidth}
            height={imageHeight}
            className="object-contain"
            priority
          />
        ) : type === "concorde" ? (
          <ConcordeSVG />
        ) : (
          <F35SVG />
        )}
      </motion.div>
    </div>
  )
}
