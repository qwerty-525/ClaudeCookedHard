import Link from "next/link"

export type Chip = { href: string; label: string; sub?: string; accent: string }

export default function ChipLinks({ kicker = "Go Deeper", chips }: { kicker?: string; chips: Chip[] }) {
  if (chips.length === 0) return null
  return (
    <div>
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[#94a3b8]/70">{kicker}</p>
      <div className="flex flex-wrap gap-3">
        {chips.map((c) => (
          <Link
            key={c.href + c.label}
            href={c.href}
            className="group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm transition-transform duration-200 hover:-translate-y-0.5"
            style={{ borderColor: `${c.accent}30`, backgroundColor: `${c.accent}0d` }}
          >
            <span className="h-1.5 w-1.5 flex-none rounded-full" style={{ backgroundColor: c.accent, boxShadow: `0 0 6px ${c.accent}99` }} />
            <span className="font-medium text-white/90">{c.label}</span>
            {c.sub && <span className="font-mono text-xs text-[#94a3b8]">{c.sub}</span>}
            <svg
              width="12" height="12" viewBox="0 0 13 13" fill="none" aria-hidden
              className="flex-none transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: c.accent }}
            >
              <path d="M2 6.5h9M6.5 2l4.5 4.5L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
