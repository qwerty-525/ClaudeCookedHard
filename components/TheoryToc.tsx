"use client"
import { useEffect, useState } from "react"

export type TocSection = { id: string; label: string }

export default function TheoryToc({ sections, accent }: { sections: TocSection[]; accent: string }) {
  const [active, setActive] = useState("")

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // thin band around the viewport centre — the section crossing it becomes active
      { rootMargin: "-35% 0px -55% 0px" }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label="Page sections" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3">
        {sections.map((s) => {
          const isActive = active === s.id
          return (
            <li key={s.id}>
              <button
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })}
                className="group flex cursor-pointer items-center justify-end gap-2.5"
                aria-current={isActive ? "location" : undefined}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive ? "" : "text-[#94a3b8]/45 group-hover:text-[#94a3b8]"
                  }`}
                  style={isActive ? { color: accent } : undefined}
                >
                  {s.label}
                </span>
                <span
                  className="h-px transition-all duration-200"
                  style={{
                    width: isActive ? 24 : 12,
                    backgroundColor: isActive ? accent : "rgba(148,163,184,0.35)",
                  }}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
