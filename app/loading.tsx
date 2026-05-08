"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import AviationLoader, { LoaderCategory } from "@/components/AviationLoader"

function categoryFor(pathname: string | null): LoaderCategory {
  if (!pathname) return "commercial"
  if (pathname.startsWith("/fighters") || pathname.startsWith("/b-2")) return "fighters"
  if (pathname.startsWith("/engines")) return "engines"
  return "commercial"
}

export default function Loading() {
  const pathname = usePathname()
  const [loadPct, setLoadPct] = useState(6)

  useEffect(() => {
    let p = 6
    const id = setInterval(() => {
      p = Math.min(92, p + (92 - p) * 0.08 + 1)
      setLoadPct(Math.round(p))
    }, 180)
    return () => clearInterval(id)
  }, [])

  return <AviationLoader loadPct={loadPct} isLoaded={false} category={categoryFor(pathname)} />
}
