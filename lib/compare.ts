import type { CompareSpec } from "@/lib/data"

export type CompareGroup = "Performance" | "Dimensions" | "Capacity" | "Features"

export interface CompareRow {
  key: string
  label: string
  group: CompareGroup
  format: (s: CompareSpec) => string
  numeric?: (s: CompareSpec) => number | undefined
  direction: "higher" | "lower" | "none"
}

const totalThrust = (s: CompareSpec) =>
  s.thrustEachLbf !== undefined ? s.engineCount * s.thrustEachLbf : undefined

export const COMPARE_ROWS: CompareRow[] = [
  {
    key: "rangeNmi",
    label: "Range",
    group: "Performance",
    format: (s) => `${s.rangeNmi.toLocaleString()} nmi`,
    numeric: (s) => s.rangeNmi,
    direction: "higher",
  },
  {
    key: "cruiseMach",
    label: "Cruise Speed",
    group: "Performance",
    format: (s) => `Mach ${s.cruiseMach.toFixed(2)}`,
    numeric: (s) => s.cruiseMach,
    direction: "higher",
  },
  {
    key: "ceilingFt",
    label: "Service Ceiling",
    group: "Performance",
    format: (s) => (s.ceilingFt !== undefined ? `${s.ceilingFt.toLocaleString()} ft` : "—"),
    numeric: (s) => s.ceilingFt,
    direction: "higher",
  },
  {
    key: "totalThrust",
    label: "Total Thrust",
    group: "Performance",
    format: (s) => {
      const t = totalThrust(s)
      return t !== undefined ? `${t.toLocaleString()} lbf` : "—"
    },
    direction: "none",
  },
  {
    key: "wingspanM",
    label: "Wingspan",
    group: "Dimensions",
    format: (s) => `${s.wingspanM.toFixed(2)} m`,
    direction: "none",
  },
  {
    key: "lengthM",
    label: "Length",
    group: "Dimensions",
    format: (s) => `${s.lengthM.toFixed(2)} m`,
    direction: "none",
  },
  {
    key: "mtowT",
    label: "MTOW",
    group: "Dimensions",
    format: (s) => `${s.mtowT.toLocaleString()} t`,
    direction: "none",
  },
  {
    key: "paxTypical",
    label: "Passengers (typical)",
    group: "Capacity",
    format: (s) => s.paxTypical.toLocaleString(),
    numeric: (s) => s.paxTypical,
    direction: "higher",
  },
  {
    key: "paxMax",
    label: "Passengers (max)",
    group: "Capacity",
    format: (s) => s.paxMax.toLocaleString(),
    numeric: (s) => s.paxMax,
    direction: "higher",
  },
  {
    key: "engines",
    label: "Engines",
    group: "Features",
    format: (s) => s.engines,
    direction: "none",
  },
]

export const COMPARE_GROUPS: CompareGroup[] = ["Performance", "Dimensions", "Capacity", "Features"]

export function winnersFor(
  row: CompareRow,
  entries: { slug: string; spec: CompareSpec }[]
): Set<string> {
  if (row.direction === "none" || !row.numeric) return new Set()
  const values = entries
    .map((e) => ({ slug: e.slug, value: row.numeric!(e.spec) }))
    .filter((v): v is { slug: string; value: number } => v.value !== undefined)
  if (values.length < 2) return new Set()
  const best =
    row.direction === "higher"
      ? Math.max(...values.map((v) => v.value))
      : Math.min(...values.map((v) => v.value))
  return new Set(values.filter((v) => v.value === best).map((v) => v.slug))
}
