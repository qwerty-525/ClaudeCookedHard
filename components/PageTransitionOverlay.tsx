"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

interface TransitionCtx {
  triggerTransition: (href: string, color: string, label: string) => void
}

const TransitionContext = createContext<TransitionCtx>({ triggerTransition: () => {} })

export function usePageTransition() {
  return useContext(TransitionContext)
}

type Phase = "idle" | "covering" | "uncovering"

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>("idle")
  const [color, setColor]   = useState("#3b82f6")
  const [label, setLabel]   = useState("")
  const hrefRef = useRef("")

  const triggerTransition = useCallback((href: string, c: string, l: string) => {
    if (phase !== "idle") return
    hrefRef.current = href
    setColor(c)
    setLabel(l)
    setPhase("covering")
  }, [phase])

  const onCoverComplete = () => {
    router.push(hrefRef.current)
    // tiny delay so the new page mounts before we reveal
    setTimeout(() => setPhase("uncovering"), 80)
  }

  const onUncoverComplete = () => setPhase("idle")

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}

      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="wipe"
            className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
            // covering: slide in from left; uncovering: exit to right
            initial={{ x: "-100%" }}
            animate={phase === "covering" ? { x: 0 } : { x: "100%" }}
            transition={
              phase === "covering"
                ? { duration: 0.18, ease: [0.76, 0, 0.24, 1] }
                : { duration: 0.20, ease: [0.76, 0, 0.24, 1] }
            }
            onAnimationComplete={phase === "covering" ? onCoverComplete : onUncoverComplete}
            style={{ backgroundColor: "#000000" }}
          >
            {/* Content visible during the wipe */}
            <div className="flex flex-col items-center gap-3 select-none">
              <span className="text-[0.6rem] font-mono tracking-[0.5em] uppercase text-white/30">
                AVIA
              </span>
              <span
                className="text-5xl md:text-7xl font-bold tracking-tight leading-none font-mono"
                style={{ color }}
              >
                {label}
              </span>
            </div>

            {/* Subtle accent-tinted diagonal lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute h-px w-full"
                  style={{
                    top: `${(i + 1) * 8}%`,
                    transform: "rotate(-2deg) scaleX(1.2)",
                    backgroundColor: color,
                    opacity: 0.06,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}
