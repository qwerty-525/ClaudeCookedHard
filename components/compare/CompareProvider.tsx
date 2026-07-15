"use client"
import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import CompareBar from "@/components/compare/CompareBar"
import ComparePanel from "@/components/compare/ComparePanel"

export const COMPARE_CAP = 3

interface CompareContextValue {
  selected: string[]
  toggle: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
  isSelected: (slug: string) => boolean
  atCap: boolean
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

const CompareContext = createContext<CompareContextValue | null>(null)

export function useCompare() {
  return useContext(CompareContext)
}

export default function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([])
  const [panelOpen, setPanelOpen] = useState(false)

  const toggle = useCallback((slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug)
      if (prev.length >= COMPARE_CAP) return prev
      return [...prev, slug]
    })
  }, [])

  const remove = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = prev.filter((s) => s !== slug)
      if (next.length < 2) setPanelOpen(false)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setSelected([])
    setPanelOpen(false)
  }, [])

  const value: CompareContextValue = {
    selected,
    toggle,
    remove,
    clear,
    isSelected: (slug) => selected.includes(slug),
    atCap: selected.length >= COMPARE_CAP,
    panelOpen,
    setPanelOpen,
  }

  return (
    <CompareContext.Provider value={value}>
      {children}
      <CompareBar />
      <ComparePanel />
    </CompareContext.Provider>
  )
}
