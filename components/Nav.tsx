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
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 bg-[#0b0b10]/75 backdrop-blur-md border-b transition-colors duration-500"
      style={{ borderColor: `${activeAccent}33` }}
    >
      <span className="text-xs font-semibold tracking-[0.35em] text-[#94a3b8] uppercase select-none">
        AVIA
      </span>

      <div className="flex items-center gap-1 bg-[#232328] rounded-full p-1">
        {TABS.map(({ href, label, accent, wipe, shadow }) => {
          const isActive = pathname === href
          return (
            <button
              key={href}
              onClick={() => { if (!isActive) triggerTransition(href, accent, label) }}
              onMouseEnter={() => setHovered(href)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center h-9 px-5 rounded-full font-mono text-base font-medium transition-all duration-200 ${scaleFor(href)} ${
                isActive
                  ? `text-white shadow-lg ${shadow}`
                  : "text-[#94a3b8] hover:text-white cursor-pointer"
              }`}
              style={isActive ? { backgroundColor: accent } : {}}
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
    </nav>
  )
}
