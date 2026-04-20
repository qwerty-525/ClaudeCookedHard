"use client"

import { cn } from "@/lib/utils"
import { ReactNode, useEffect, useRef } from "react"

interface VerticalMarqueeProps {
  children: ReactNode
  pauseOnHover?: boolean
  reverse?: boolean
  className?: string
  speed?: number
}

function VerticalMarquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 30,
}: VerticalMarqueeProps) {
  return (
    <div
      className={cn("group flex flex-col overflow-hidden", className)}
      style={{ "--duration": `${speed}s` } as React.CSSProperties}
    >
      <div
        className={cn(
          "flex shrink-0 flex-col animate-marquee-vertical",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "flex shrink-0 flex-col animate-marquee-vertical",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}

interface FleetMarqueeProps {
  planeNames: string[]
  speed?: number
}

export default function FleetMarquee({ planeNames, speed = 18 }: FleetMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marqueeContainer = marqueeRef.current
    if (!marqueeContainer) return

    const updateOpacity = () => {
      const items = marqueeContainer.querySelectorAll(".marquee-item")
      const containerRect = marqueeContainer.getBoundingClientRect()
      const centerY = containerRect.top + containerRect.height / 2

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenterY = itemRect.top + itemRect.height / 2
        const distance = Math.abs(centerY - itemCenterY)
        const maxDistance = containerRect.height / 2
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        const opacity = 1 - normalizedDistance * 0.8
        ;(item as HTMLElement).style.opacity = opacity.toString()
      })
    }

    const loop = () => {
      updateOpacity()
      requestAnimationFrame(loop)
    }

    const frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="bg-[#0b0b10] text-foreground overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-6 py-24 animate-fade-in-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left — copy */}
          <div className="space-y-8 max-w-xl">
            <p className="text-xs tracking-[0.4em] text-[#3b82f6] uppercase font-medium animate-fade-in-up [animation-delay:100ms]">
              Modern Aviation
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-foreground animate-fade-in-up [animation-delay:200ms]">
              The Fleet.
              <br />
              <span className="text-[#94a3b8]">Redefined.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up [animation-delay:400ms]">
              From the double-deck Airbus A380 to the carbon-fibre Dreamliner —
              each aircraft is a leap in what flight can be.
            </p>
            <div className="animate-fade-in-up [animation-delay:600ms]">
              <a
                href="#fleet"
                className="group relative inline-flex px-7 py-3 bg-foreground text-background rounded-md font-medium overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10"
              >
                <span className="relative z-10 text-sm tracking-wide">EXPLORE THE FLEET</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              </a>
            </div>
          </div>

          {/* Right — vertical marquee of plane names */}
          <div
            ref={marqueeRef}
            className="relative h-[500px] lg:h-[600px] animate-fade-in-up [animation-delay:400ms]"
          >
            <VerticalMarquee speed={speed} pauseOnHover className="h-full">
              {planeNames.map((name, i) => (
                <div
                  key={i}
                  className="marquee-item text-4xl md:text-5xl lg:text-6xl font-light tracking-tight py-6 text-foreground"
                >
                  {name}
                </div>
              ))}
            </VerticalMarquee>

            {/* Vignettes */}
            <div className="pointer-events-none absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#0b0b10] via-[#0b0b10]/60 to-transparent z-10" />
            <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0b0b10] via-[#0b0b10]/60 to-transparent z-10" />
          </div>
        </div>
      </div>
    </div>
  )
}
