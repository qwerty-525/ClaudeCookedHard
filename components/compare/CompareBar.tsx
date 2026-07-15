"use client"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { commercialPlanes } from "@/lib/data"
import { useCompare, COMPARE_CAP } from "@/components/compare/CompareProvider"

export default function CompareBar() {
  const compare = useCompare()
  if (!compare) return null

  const { selected, remove, clear, setPanelOpen } = compare
  const planes = selected
    .map((slug) => commercialPlanes.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
  const canCompare = planes.length >= 2

  return (
    <AnimatePresence>
      {planes.length > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } }}
          exit={{ y: 24, opacity: 0, transition: { duration: 0.25 } }}
          className="fixed bottom-6 left-1/2 z-[70] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2"
        >
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.1] bg-[#0e1018]/95 px-4 py-3 shadow-[0_18px_60px_rgba(2,6,23,0.6)] backdrop-blur-md">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              {planes.map((plane) => (
                <motion.span
                  key={plane.slug}
                  layout
                  className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] py-1 pl-2 pr-1"
                >
                  {plane.image && (
                    <Image src={plane.image} alt="" width={44} height={18} className="object-contain" />
                  )}
                  <span className="text-xs font-medium text-white">{plane.name}</span>
                  <button
                    type="button"
                    onClick={() => remove(plane.slug)}
                    aria-label={`Remove ${plane.name}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[#94a3b8] transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                      <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </div>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#94a3b8]">
              {planes.length} / {COMPARE_CAP}
            </span>
            <button
              type="button"
              onClick={clear}
              className="text-xs text-[#94a3b8] transition-colors hover:text-white"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => canCompare && setPanelOpen(true)}
              disabled={!canCompare}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
                canCompare
                  ? "bg-[#3b82f6] text-white hover:bg-[#2f6fe0]"
                  : "cursor-not-allowed bg-[#3b82f6]/25 text-white/40"
              }`}
            >
              Compare
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
