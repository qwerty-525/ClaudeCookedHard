import type { ReactNode } from "react"

export function renderBold(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((seg, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-white">
        {seg}
      </strong>
    ) : (
      seg
    )
  )
}
