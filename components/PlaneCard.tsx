"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, useAnimation } from "framer-motion"
import { FlowButton } from "@/components/ui/flow-button"
import CompareToggle from "@/components/compare/CompareToggle"

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
  role?: string
  roleColor?: string
  routes?: string[]
  compareSlug?: string
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
  role,
  roleColor,
  routes,
  compareSlug,
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
      className="group relative overflow-hidden rounded-[26px] border border-white/[0.08] bg-[linear-gradient(180deg,#171822_0%,#10131b_100%)] p-6 cursor-pointer shadow-[0_18px_60px_rgba(2,6,23,0.22)]"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${accent}66, transparent)` }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-[26px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(ellipse at top, ${accent}12, transparent 70%)` }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_32%)]" />

      <div className="relative z-10 flex flex-col h-full">
        {image && (
          <div
            className="mb-6 flex justify-end"
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
          <div className="mb-3 flex items-center justify-between gap-3">
            <span
              className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: accent, borderColor: `${accent}33`, backgroundColor: `${accent}14` }}
            >
              {year}
            </span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: statusCfg.dot, boxShadow: `0 0 5px ${statusCfg.dot}99` }}
                />
                <span className="text-[10px] font-medium tracking-wide" style={{ color: statusCfg.dot }}>
                  {statusCfg.label}
                </span>
              </span>
              {compareSlug && <CompareToggle slug={compareSlug} />}
            </span>
          </div>
          {role && roleColor && (
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1"
              style={{ borderColor: `${roleColor}40`, backgroundColor: `${roleColor}12` }}
            >
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: roleColor, boxShadow: `0 0 5px ${roleColor}bb` }}
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: roleColor }}>
                {role}
              </span>
            </div>
          )}
          <h3 className="mt-2 mb-2 text-xl font-semibold leading-tight text-[#f8fafc] md:text-[1.35rem]">{name}</h3>
          <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#94a3b8]">{detail}</p>
          <div className="mb-5 h-px w-10 bg-white/10" />
          <p className="text-sm leading-7 text-[#b5c1d3]">{fact}</p>
        </div>

        {routes && routes.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#94a3b8] mb-2.5">Known Routes</p>
            <div className="flex flex-wrap gap-1.5">
              {routes.map((route) => (
                <span
                  key={route}
                  className="inline-flex items-center gap-1 rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-[#94a3b8]"
                >
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: accent, opacity: 0.6 }} />
                  {route}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-white/[0.07] pt-5">
          <FlowButton text="Read more" accent={accent} />
        </div>
      </div>
    </motion.article>
  )
}
