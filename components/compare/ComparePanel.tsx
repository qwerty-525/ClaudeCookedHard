"use client"
import { useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { commercialPlanes, type Aircraft, type CompareSpec } from "@/lib/data"
import { COMPARE_ROWS, COMPARE_GROUPS, winnersFor } from "@/lib/compare"
import { useCompare } from "@/components/compare/CompareProvider"

const STATUS_CONFIG = {
  active: { dot: "#22c55e", label: "In Service" },
  legacy: { dot: "#f59e0b", label: "Production Ended" },
  retired: { dot: "#ef4444", label: "Retired" },
}

type Entry = { plane: Aircraft; spec: CompareSpec }

export default function ComparePanel() {
  const compare = useCompare()
  const open = compare?.panelOpen ?? false
  const setPanelOpen = compare?.setPanelOpen

  useEffect(() => {
    if (!open || !setPanelOpen) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanelOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open, setPanelOpen])

  if (!compare) return null

  const entries: Entry[] = compare.selected
    .map((slug) => commercialPlanes.find((p) => p.slug === slug))
    .filter((p): p is Aircraft => Boolean(p && p.compare))
    .map((plane) => ({ plane, spec: plane.compare! }))

  const n = entries.length
  const show = open && n >= 2
  const gridMobile = n === 3 ? "grid-cols-3" : "grid-cols-2"
  const gridMd = n === 3 ? "md:grid-cols-[150px_1fr_1fr_1fr]" : "md:grid-cols-[150px_1fr_1fr]"
  const winnerEntries = entries.map((e) => ({ slug: e.plane.slug, spec: e.spec }))

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/70 backdrop-blur-sm"
          onClick={() => compare.setPanelOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } }}
            exit={{ opacity: 0, y: 24, scale: 0.98, transition: { duration: 0.25 } }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-auto my-8 w-[calc(100vw-2rem)] max-w-5xl rounded-[32px] border border-white/[0.08] bg-[#0b0d14] p-6 md:p-10"
          >
            <button
              type="button"
              onClick={() => compare.setPanelOpen(false)}
              aria-label="Close comparison"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#94a3b8] transition-colors hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1.5 1.5l9 9M10.5 1.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.4em] text-[#3b82f6]">
              Side by Side
            </p>
            <h2 className="mb-10 text-3xl font-bold text-white md:text-4xl">Compare Airliners.</h2>

            {/* Model headers */}
            <div className={`mb-8 grid gap-3 ${gridMobile} ${gridMd}`}>
              <div className="hidden md:block" />
              {entries.map(({ plane, spec }) => {
                const statusCfg = STATUS_CONFIG[plane.status ?? "active"]
                return (
                  <div
                    key={plane.slug}
                    className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-center"
                  >
                    <div className="relative mx-auto mb-3 h-14 w-full">
                      {plane.image ? (
                        <Image src={plane.image} alt={plane.name} fill className="object-contain" />
                      ) : (
                        <span className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-[0.3em] text-white/25">
                          {plane.detail.split(" · ")[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold leading-tight text-white md:text-base">{plane.name}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.18em] text-[#94a3b8]">{spec.variant}</p>
                    <div className="mt-2 flex items-center justify-center gap-1.5">
                      <span
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{ background: statusCfg.dot, boxShadow: `0 0 5px ${statusCfg.dot}99` }}
                      />
                      <span className="text-[10px] font-medium tracking-wide" style={{ color: statusCfg.dot }}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => compare.remove(plane.slug)}
                      className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#94a3b8] transition-colors hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Grouped spec rows */}
            {COMPARE_GROUPS.map((group) => {
              const rows = COMPARE_ROWS.filter((r) => r.group === group)
              return (
                <div key={group} className="mb-8 last:mb-0">
                  <div className="mb-4 flex items-center gap-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">{group}</p>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  {rows.map((row) => {
                    const winners = winnersFor(row, winnerEntries)
                    return (
                      <div
                        key={row.key}
                        className={`grid gap-3 border-b border-white/[0.05] py-3 last:border-b-0 ${gridMobile} ${gridMd}`}
                      >
                        <p className="col-span-full self-center text-xs uppercase tracking-[0.18em] text-[#94a3b8] md:col-span-1">
                          {row.label}
                        </p>
                        {entries.map(({ plane, spec }) => {
                          const isWinner = winners.has(plane.slug)
                          return (
                            <div
                              key={plane.slug}
                              className={`flex items-center justify-center gap-2 rounded-xl px-2 py-2 text-center font-mono text-xs md:text-sm ${
                                isWinner ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "text-white"
                              }`}
                            >
                              {isWinner && <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[#3b82f6]" />}
                              <span className="break-words">{row.format(spec)}</span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}

                  {group === "Features" && (
                    <div className={`grid gap-3 py-3 ${gridMobile} ${gridMd}`}>
                      <p className="col-span-full pt-1 text-xs uppercase tracking-[0.18em] text-[#94a3b8] md:col-span-1">
                        Highlights
                      </p>
                      {entries.map(({ plane, spec }) => (
                        <ul key={plane.slug} className="flex flex-col gap-2">
                          {spec.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-left text-xs leading-5 text-[#b8c7dc]">
                              <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#3b82f6]/70" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
