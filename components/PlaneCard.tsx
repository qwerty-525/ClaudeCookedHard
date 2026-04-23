"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useAnimation } from "framer-motion"
import { FlowButton } from "@/components/ui/flow-button"

const STATUS_CONFIG = {
  active:  { dot: "#22c55e", label: "In Service" },
  legacy:  { dot: "#f59e0b", label: "Production Ended" },
  retired: { dot: "#ef4444", label: "Retired" },
}

interface PlaneCardProps {
  name: string
  detail: string
  fact: string
  year: number
  index: number
  href: string
  accent?: string
  image?: string
  status?: "active" | "legacy" | "retired"
}

export default function PlaneCard({
  name,
  detail,
  fact,
  year,
  index,
  href,
  accent = "#3b82f6",
  image,
  status,
}: PlaneCardProps) {
  const statusCfg = STATUS_CONFIG[status ?? "active"]
  const spinControls = useAnimation()
  const router = useRouter()

  return (
    <motion.article
      initial={{ opacity: 0, y: 64 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
      onClick={() => router.push(href)}
      className="group relative bg-[#232328] border border-[#1e293b] rounded-2xl p-6 overflow-hidden cursor-pointer"
    >
      {/* Top glow on hover — pointer-events-none so it never blocks clicks */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(to right, transparent, ${accent}66, transparent)` }}
      />
      {/* Subtle bg glow on hover — pointer-events-none */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top, ${accent}0d, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col h-full">
        {image && (
          <div
            className="mb-4 flex justify-end"
            onMouseEnter={(e) => {
              e.stopPropagation()
              spinControls.start({
                rotateY: [0, 360],
                transition: { duration: 3.5, ease: "linear", repeat: Infinity },
              })
            }}
            onMouseLeave={() => spinControls.stop()}
          >
            <motion.div
              animate={spinControls}
              style={{ perspective: 180, transformStyle: "preserve-3d", rotateX: 12 }}
            >
              <Image
                src={image}
                alt={name}
                width={120}
                height={48}
                className="object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]"
              />
            </motion.div>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2 mb-0">
            <span className="text-xs font-semibold tracking-widest" style={{ color: accent }}>
              {year}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: statusCfg.dot, boxShadow: `0 0 5px ${statusCfg.dot}99` }}
              />
              <span className="text-[10px] font-medium tracking-wide" style={{ color: statusCfg.dot }}>
                {statusCfg.label}
              </span>
            </span>
          </div>
          <h3 className="text-xl font-semibold mt-2 mb-1 text-[#f8fafc]">{name}</h3>
          <p className="text-sm text-[#94a3b8] mb-4">{detail}</p>
          <div className="w-8 h-px bg-[#1e293b] mb-4" />
          <p className="text-sm text-[#94a3b8] leading-relaxed">{fact}</p>
        </div>

        <div className="mt-6">
          <FlowButton text="Read more" accent={accent} />
        </div>
      </div>
    </motion.article>
  )
}
