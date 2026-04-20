'use client'
import { ArrowRight } from 'lucide-react'

interface FlowButtonProps {
  text?: string
  accent?: string
}

export function FlowButton({ text = "Read more", accent = "#3b82f6" }: FlowButtonProps) {
  return (
    <button
      className="group relative flex items-center overflow-hidden rounded-[100px] border-[1.5px] bg-transparent px-6 py-2 text-xs font-semibold cursor-pointer transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-transparent hover:rounded-[10px] active:scale-[0.95]"
      style={{ borderColor: `${accent}55` }}
    >
      {/* Expanding circle fill */}
      <span
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:w-[200px] group-hover:h-[200px] group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.19,1,0.22,1)] z-0"
        style={{ backgroundColor: accent }}
      />

      {/* Left arrow — hidden off-screen, slides in on hover */}
      <ArrowRight
        className="absolute w-3.5 h-3.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] text-white"
        style={{ left: "-1rem", translate: "0", ["--tw-translate-x" as string]: "0" }}
      />

      {/* Text — z-10 so it sits above the circle, white on hover overrides accent */}
      <span
        className="relative z-10 translate-x-0 group-hover:translate-x-2 transition-all duration-[800ms] ease-out group-hover:!text-white"
        style={{ color: accent }}
      >
        {text}
      </span>

      {/* Right arrow — slides out on hover */}
      <ArrowRight
        className="relative z-10 w-3.5 h-3.5 ml-1.5 group-hover:translate-x-6 group-hover:opacity-0 group-hover:!text-white transition-all duration-[800ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{ color: accent }}
      />
    </button>
  )
}
