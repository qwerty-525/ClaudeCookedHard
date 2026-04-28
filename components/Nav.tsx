"use client"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { TextScramble } from "@/components/ui/text-scramble"
import { usePageTransition } from "@/components/PageTransitionOverlay"

type Tab = { href: string; label: string; accent: string; wipe: string; shadow: string }

const AIRCRAFT: Tab[] = [
  { href: "/",         label: "Commercial",   accent: "#3b82f6", wipe: "#0e2244", shadow: "shadow-blue-500/25"  },
  { href: "/fighters", label: "Fighter Jets", accent: "#ef4444", wipe: "#3b0a0a", shadow: "shadow-red-500/25"   },
  { href: "/engines",  label: "Engines",      accent: "#f59e0b", wipe: "#3d1a00", shadow: "shadow-amber-500/25" },
]
const THEORY: Tab[] = [
  { href: "/thermodynamics", label: "Thermo",   accent: "#34d399", wipe: "#001a0d", shadow: "shadow-emerald-500/25" },
  { href: "/gas-dynamics",   label: "Gas Dyn.", accent: "#fb923c", wipe: "#1a0800", shadow: "shadow-orange-500/25"  },
  { href: "/heat-transfer",  label: "Heat Xfr", accent: "#c084fc", wipe: "#0d0518", shadow: "shadow-violet-500/25"  },
  { href: "/aerodynamics",   label: "Aero",     accent: "#22d3ee", wipe: "#001e2e", shadow: "shadow-cyan-500/25"    },
]
const ALL_TABS = [...AIRCRAFT, ...THEORY]

export default function Nav() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState<string | null>(null)
  const { triggerTransition } = usePageTransition()

  const activeAccent = ALL_TABS.find((t) => t.href === pathname)?.accent ?? "#3b82f6"

  const scaleFor = (href: string) =>
    hovered === null ? "scale-100" : hovered === href ? "scale-110" : "scale-90"

  const renderTab = ({ href, label, accent, shadow }: Tab) => {
    const isActive = pathname === href
    return (
      <button
        key={href}
        onClick={() => { if (!isActive) triggerTransition(href, accent, label) }}
        onMouseEnter={() => setHovered(href)}
        onMouseLeave={() => setHovered(null)}
        className={`flex h-9 items-center rounded-full px-3 font-mono text-sm font-medium transition-all duration-200 md:px-4 ${scaleFor(href)} ${
          isActive ? `text-white shadow-lg ${shadow}` : "cursor-pointer text-[#94a3b8] hover:text-white"
        }`}
        style={isActive ? { backgroundColor: accent, boxShadow: `0 10px 30px ${accent}33` } : {}}
      >
        {isActive ? label : (
          <TextScramble text={label} showUnderline={false} className="leading-none"
            textClassName="font-mono text-sm font-medium" />
        )}
      </button>
    )
  }

  const Pill = ({ tabs, label }: { tabs: Tab[]; label: string }) => (
    <div className="flex flex-col items-start gap-1">
      <span className="hidden pl-2 text-[8px] font-medium uppercase tracking-[0.35em] text-white/20 md:block">
        {label}
      </span>
      <div className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-[rgba(20,24,34,0.78)] p-1 shadow-[0_10px_30px_rgba(2,6,23,0.28)]">
        {tabs.map(renderTab)}
      </div>
    </div>
  )

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 border-b bg-[#0b0b10]/72 px-4 py-3 backdrop-blur-xl transition-colors duration-500 md:px-8 md:py-4"
      style={{ borderColor: `${activeAccent}33` }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex flex-none items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full shadow-[0_0_18px_currentColor]"
            style={{ color: activeAccent, backgroundColor: activeAccent }} />
          <div>
            <span className="block select-none text-[11px] font-semibold uppercase tracking-[0.42em] text-[#e2e8f0]">
              AVIA
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.26em] text-[#94a3b8] md:block">
              Flight archive
            </span>
          </div>
        </div>

        {/* Desktop: two labelled pill groups */}
        <div className="hidden items-end gap-3 md:flex">
          <Pill tabs={AIRCRAFT} label="Aircraft" />
          <Pill tabs={THEORY}   label="Theory"   />
        </div>

        {/* Mobile: single scrollable pill */}
        <div className="flex items-center overflow-x-auto md:hidden"
          style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-0.5 rounded-full border border-white/[0.08] bg-[rgba(20,24,34,0.78)] p-1 whitespace-nowrap">
            {ALL_TABS.map(renderTab)}
          </div>
        </div>
      </div>
    </nav>
  )
}
