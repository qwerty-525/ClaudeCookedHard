"use client"
import { useCompare } from "@/components/compare/CompareProvider"

export default function CompareToggle({ slug }: { slug: string }) {
  const compare = useCompare()
  if (!compare) return null

  const selected = compare.isSelected(slug)
  const blocked = !selected && compare.atCap

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        if (!blocked) compare.toggle(slug)
      }}
      title={blocked ? "Up to 3 aircraft" : undefined}
      aria-pressed={selected}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors duration-200 ${
        selected
          ? "border-[#3b82f6]/50 bg-[#3b82f6]/15"
          : "border-white/[0.08] bg-white/[0.03] hover:border-white/20"
      } ${blocked ? "cursor-not-allowed opacity-40" : ""}`}
    >
      <span
        className={`flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
          selected ? "border-[#3b82f6] bg-[#3b82f6]" : "border-white/30"
        }`}
      >
        {selected && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
            <path d="M1.5 4l1.8 1.8L6.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span
        className={`text-[10px] font-medium tracking-wide ${selected ? "text-[#7dd3fc]" : "text-[#94a3b8]"}`}
      >
        Compare
      </span>
    </button>
  )
}
