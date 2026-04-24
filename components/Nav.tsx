"use client"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { TextScramble } from "@/components/ui/text-scramble"
import { usePageTransition } from "@/components/PageTransitionOverlay"

const TABS = [
  { href: "/",         label: "Commercial",  accent: "#3b82f6", wipe: "#0e2244", shadow: "shadow-blue-500/25"  },
  { href: "/fighters", label: "Fighter Jets", accent: "#ef4444", wipe: "#3b0a0a", shadow: "shadow-red-500/25"   },
  { href: "/engines",  label: "Engines",      accent: "#f59e0b", wipe: "#3d1a00", shadow: "shadow-amber-500/25" },
]

export default function Nav() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)
  const { triggerTransition } = usePageTransition()

  const activeAccent = TABS.find((t) => t.href === pathname)?.accent ?? "#3b82f6"

  const scaleFor = (href: string) => {
    if (hovered === null) return "scale-100"
    return hovered === href ? "scale-110" : "scale-90"
  }

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 border-b bg-[#0b0b10]/72 px-5 py-4 backdrop-blur-xl transition-colors duration-500 md:px-8 md:py-5"
      style={{ borderColor: `${activeAccent}33` }}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
            style={{ color: activeAccent, backgroundColor: activeAccent }}
          />
          <div>
            <span className="block select-none text-[11px] font-semibold uppercase tracking-[0.42em] text-[#e2e8f0]">
              AVIA
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] md:block">
              Flight archive
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-[rgba(20,24,34,0.78)] p-1 shadow-[0_10px_30px_rgba(2,6,23,0.28)]">
        {TABS.map(({ href, label, accent, wipe, shadow }) => {
          const isActive = pathname === href
          return (
            <button
              key={href}
              onClick={() => { if (!isActive) triggerTransition(href, accent, label) }}
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
              className={`flex h-9 items-center rounded-full px-4 font-mono text-sm font-medium transition-all duration-200 md:px-5 md:text-base ${scaleFor(href)} ${
                isActive
                  ? `text-white shadow-lg ${shadow}`
                  : "text-[#94a3b8] hover:text-white cursor-pointer"
              }`}
              style={isActive ? { backgroundColor: accent, boxShadow: `0 10px 30px ${accent}33` } : {}}
            >
              {isActive ? (
                label
              ) : (
                <TextScramble
                  text={label}
                  showUnderline={false}
                  className="leading-none"
                  textClassName="font-mono text-base font-medium"
                />
              )}
            </button>
          )
        })}
        </div>
      </div>
    </nav>
  )
}
