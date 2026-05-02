"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import FlightGlobe from "./FlightGlobe"
import type { OpenSkyFlight, OpenSkySnapshot } from "@/lib/opensky"
import { FAMOUS_AIRLINES, FAMOUS_AIRPORTS, FAMOUS_ROUTES } from "@/lib/famous"

const IS_STATIC_BUILD = process.env.NODE_ENV === "production"

type TabKey = "flights" | "airports" | "airlines" | "airplanes"

const TABS: { key: TabKey; label: string }[] = [
  { key: "flights",   label: "FLIGHTS"   },
  { key: "airports",  label: "AIRPORTS"  },
  { key: "airlines",  label: "AIRLINES"  },
  { key: "airplanes", label: "AIRPLANES" },
]

interface Props { initial: OpenSkySnapshot }

export default function CommercialDashboard({ initial }: Props) {
  const [snapshot, setSnapshot] = useState<OpenSkySnapshot>(initial)
  const [active, setActive]     = useState<TabKey>("flights")
  const [refreshing, setRefreshing] = useState(false)
  const [confirm, setConfirm]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [now, setNow]           = useState<Date | null>(null)
  const snapshotRef = useRef(snapshot)
  snapshotRef.current = snapshot

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Auto-refresh positions every 60s in dev (positions only — metadata/routes preserved)
  useEffect(() => {
    if (IS_STATIC_BUILD) return
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/opensky/positions", { method: "POST" })
        if (!res.ok) return
        const body = (await res.json()) as { snapshot: OpenSkySnapshot }
        setSnapshot(body.snapshot)
      } catch { /* silently skip */ }
    }, 60_000)
    return () => clearInterval(id)
  }, [])

  const tableFlights = snapshot.flights

  const counts = useMemo(() => ({
    flights:   tableFlights.length,
    airports:  FAMOUS_AIRPORTS.length,
    airlines:  FAMOUS_AIRLINES.length,
    airplanes: tableFlights.filter((f) => f.registration).length,
  }), [tableFlights])

  async function runRefresh() {
    setConfirm(false)
    setRefreshing(true)
    setError(null)
    try {
      const res = await fetch("/api/aviationstack/refresh", { method: "POST" })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string })?.error ?? `HTTP ${res.status}`)
      }
      const body = (await res.json()) as { snapshot: OpenSkySnapshot }
      setSnapshot(body.snapshot)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setRefreshing(false)
    }
  }

  const fetchedAtLabel = snapshot.fetchedAt
    ? new Date(snapshot.fetchedAt).toUTCString().replace("GMT", "UTC")
    : "NEVER — run npm run snapshot"

  const utcLabel = now
    ? `${now.getUTCFullYear()}-${pad(now.getUTCMonth() + 1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`
    : ""

  return (
    <section className="relative w-full overflow-hidden bg-[#04060a] text-white lg:h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(125,211,252,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_40%,rgba(59,130,246,0.18),transparent_70%)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1600px] flex-col px-6 pt-24 pb-6 md:px-10 lg:px-16">
        <DashboardHeader utcLabel={utcLabel} fetchedAtLabel={fetchedAtLabel} airborneCount={tableFlights.length} />

        <div className="mt-6 grid grid-cols-1 gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-[1.55fr_1fr]">
          <GlobePanel liveFlights={tableFlights} />
          <ControlPanel
            flights={tableFlights}
            counts={counts}
            active={active}
            onActive={setActive}
            refreshing={refreshing}
            error={error}
            onRefresh={() => setConfirm(true)}
          />
        </div>

        <Footer />
      </div>

      {confirm && (
        <ConfirmModal
          onCancel={() => setConfirm(false)}
          onConfirm={runRefresh}
          fetchedAtLabel={fetchedAtLabel}
        />
      )}
    </section>
  )
}

function pad(n: number) { return String(n).padStart(2, "0") }

function DashboardHeader({ utcLabel, fetchedAtLabel, airborneCount }: { utcLabel: string; fetchedAtLabel: string; airborneCount: number }) {
  return (
    <header className="flex flex-col gap-4 border-b border-[#7dd3fc]/15 pb-5 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#22d3ee] shadow-[0_0_12px_#22d3ee]" />
          <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#7dd3fc]">
            AVIA / OPS / COMMERCIAL TRAFFIC
          </p>
        </div>
        <h1 className="font-mono text-3xl font-semibold tracking-tight text-white md:text-4xl">
          GLOBAL FLIGHT INTELLIGENCE
        </h1>
        <p className="max-w-xl font-mono text-[11px] leading-relaxed text-[#94a3b8]">
          Live ADS-B telemetry via{" "}
          <span className="text-[#7dd3fc]">OpenSky Network</span> — BA · SQ · AF · currently airborne.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">
        <Stat label="UTC"      value={utcLabel || "—"} mono />
        <Stat label="Snapshot" value={fetchedAtLabel}  mono />
        <Stat label="Airborne" value={String(airborneCount)} accent="#22d3ee" />
      </div>
    </header>
  )
}

function Stat({ label, value, accent = "#7dd3fc", mono = false }: { label: string; value: string; accent?: string; mono?: boolean }) {
  return (
    <div className="border border-[#7dd3fc]/15 bg-black/30 px-3 py-2">
      <p className="text-[9px] tracking-[0.3em] text-[#64748b]">{label}</p>
      <p className={`mt-1 truncate ${mono ? "font-mono" : ""} text-[11px] tracking-tight`} style={{ color: accent }} title={value}>
        {value}
      </p>
    </div>
  )
}

function GlobePanel({ liveFlights }: { liveFlights: OpenSkyFlight[] }) {
  return (
    <div className="relative flex min-h-0 flex-col overflow-hidden border border-[#7dd3fc]/15 bg-black/40">
      <div className="absolute left-0 top-0 z-20 flex items-center gap-3 border-b border-r border-[#7dd3fc]/15 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#7dd3fc]">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
        GLOBE / LIVE POSITIONS
      </div>
      <div className="absolute right-0 top-0 z-20 border-b border-l border-[#7dd3fc]/15 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#94a3b8]">
        OPENSKY · ADS-B
      </div>
      <CornerTicks />
      <div className="relative h-[60vh] min-h-[420px] w-full flex-1 lg:h-auto lg:min-h-0">
        <FlightGlobe arcFlights={FAMOUS_ROUTES} liveFlights={liveFlights} />
      </div>
      <div className="flex items-center justify-between border-t border-[#7dd3fc]/15 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[#64748b]">
        <span>ROUTES: <span className="text-[#7dd3fc]">{FAMOUS_ROUTES.length}</span></span>
        <span>LIVE: <span className="text-[#22d3ee]">{liveFlights.length}</span></span>
        <span>AUTO-ROTATE · ACTIVE</span>
      </div>
    </div>
  )
}

function CornerTicks() {
  return (
    <>
      <div className="pointer-events-none absolute left-3 top-3 z-10 h-3 w-3 border-l border-t border-[#7dd3fc]/60" />
      <div className="pointer-events-none absolute right-3 top-3 z-10 h-3 w-3 border-r border-t border-[#7dd3fc]/60" />
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 h-3 w-3 border-b border-l border-[#7dd3fc]/60" />
      <div className="pointer-events-none absolute bottom-3 right-3 z-10 h-3 w-3 border-b border-r border-[#7dd3fc]/60" />
    </>
  )
}

function ControlPanel({ flights, counts, active, onActive, refreshing, error, onRefresh }: {
  flights: OpenSkyFlight[]
  counts: Record<TabKey, number>
  active: TabKey
  onActive: (k: TabKey) => void
  refreshing: boolean
  error: string | null
  onRefresh: () => void
}) {
  return (
    <div className="relative flex min-h-0 flex-col border border-[#7dd3fc]/15 bg-black/40">
      <div className="flex items-center justify-between border-b border-[#7dd3fc]/15 bg-black/60 px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#7dd3fc]">CONTROL PANEL</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#64748b]">BA · SQ · AF</p>
      </div>
      <CornerTicks />

      <div className="grid shrink-0 grid-cols-4 border-b border-[#7dd3fc]/15">
        {TABS.map((t) => {
          const isActive = t.key === active
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onActive(t.key)}
              className={`relative border-r border-[#7dd3fc]/15 px-3 py-3 text-left font-mono uppercase transition-colors last:border-r-0 ${isActive ? "bg-[#7dd3fc]/[0.08]" : "hover:bg-white/[0.03]"}`}
            >
              <p className={`text-[9px] tracking-[0.25em] ${isActive ? "text-[#7dd3fc]" : "text-[#64748b]"}`}>{t.key}</p>
              <p className={`mt-1 text-[18px] font-semibold leading-none tracking-tight ${isActive ? "text-white" : "text-white/70"}`}>{counts[t.key]}</p>
              <p className="mt-1 text-[9px] tracking-[0.25em] text-[#64748b]">{t.label}</p>
              {isActive && <span className="absolute bottom-0 left-0 h-px w-full bg-[#7dd3fc]" />}
            </button>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {active === "flights"   && <FlightsTable   rows={flights} />}
        {active === "airports"  && <FamousAirportsTable />}
        {active === "airlines"  && <FamousAirlinesTable />}
        {active === "airplanes" && <AircraftTable   rows={flights} />}
      </div>

      <div className="shrink-0 border-t border-[#7dd3fc]/15 bg-black/60 px-4 py-3">
        {error && <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ef4444]">ERR · {error}</p>}
        {IS_STATIC_BUILD ? (
          <div className="flex w-full items-center justify-between border border-[#7dd3fc]/30 bg-[#7dd3fc]/[0.04] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#7dd3fc]">
            <span className="flex items-center gap-3"><span className="inline-block h-2 w-2 rounded-full bg-[#7dd3fc]" />STATIC SNAPSHOT</span>
            <span className="text-[#7dd3fc]/60">READ-ONLY</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={refreshing}
              onClick={onRefresh}
              className="group relative flex w-full items-center justify-between border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[#f59e0b] transition-colors hover:border-[#f59e0b] hover:bg-[#f59e0b]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-3">
                <span className={`inline-block h-2 w-2 rounded-full ${refreshing ? "animate-pulse" : ""} bg-[#f59e0b]`} />
                {refreshing ? "FETCHING LIVE DATA…" : "REFRESH LIVE DATA"}
              </span>
              <span className="text-[#f59e0b]/60">OPENSKY · FREE</span>
            </button>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[#64748b]">
              ADS-B · BA · SQ · AF · DEV-ONLY · auto-refresh every 60s
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function ConfirmModal({ onCancel, onConfirm, fetchedAtLabel }: { onCancel: () => void; onConfirm: () => void; fetchedAtLabel: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="relative w-full max-w-md border border-[#f59e0b]/40 bg-[#04060a] p-6">
        <CornerTicks />
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#f59e0b]">CONFIRM REFRESH</p>
        <h3 className="mt-3 font-mono text-lg text-white">FETCH LIVE DATA FROM OPENSKY?</h3>
        <p className="mt-3 font-mono text-[11px] leading-relaxed text-[#94a3b8]">
          Downloads all live ADS-B state vectors, filters for{" "}
          <span className="text-white">BA · SQ · AF</span>, then fetches aircraft metadata and routes per registration.
          Overwrites <span className="text-white">lib/opensky-snapshot.json</span>.
        </p>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-[#64748b]">Last snapshot: {fetchedAtLabel}</p>
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onCancel} className="flex-1 border border-[#7dd3fc]/30 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#7dd3fc] transition-colors hover:bg-[#7dd3fc]/10">CANCEL</button>
          <button type="button" onClick={onConfirm} className="flex-1 border border-[#f59e0b] bg-[#f59e0b]/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.3em] text-[#f59e0b] transition-colors hover:bg-[#f59e0b]/25">EXECUTE</button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#7dd3fc]/10 pt-3 font-mono text-[9px] uppercase tracking-[0.3em] text-[#64748b]">
      <span>SYSTEM · NOMINAL</span>
      <span>SOURCE · OPENSKY NETWORK · ADS-B</span>
      <span>RENDER · WEBGL · THREE.JS</span>
    </div>
  )
}

function EmptyRow({ label }: { label: string }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-10 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[#64748b]">
        NO {label} IN SNAPSHOT · run <span className="text-white">npm run snapshot</span>
      </td>
    </tr>
  )
}

function TableShell({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse font-mono text-[11px]">
        <thead className="sticky top-0 z-10 bg-black/80 backdrop-blur">
          <tr>
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap border-b border-[#7dd3fc]/15 px-3 py-2 text-left text-[9px] uppercase tracking-[0.25em] text-[#64748b]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

function FlightsTable({ rows }: { rows: OpenSkyFlight[] }) {
  return (
    <TableShell headers={["FLIGHT", "AIRLINE", "FROM", "TO", "ALT (FT)", "SPD (KTS)"]}>
      {rows.length === 0 && <EmptyRow label="FLIGHTS" />}
      {rows.map((f, i) => (
        <tr key={`${f.icao24}-${i}`} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
          <td className="whitespace-nowrap px-3 py-2 font-semibold text-white">{f.flightNumber}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{f.airlineName}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{f.depDisplay ?? "—"}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{f.arrDisplay ?? "—"}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{f.altitudeFt.toLocaleString()}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{f.velocityKts}</td>
        </tr>
      ))}
    </TableShell>
  )
}

function FamousAirportsTable() {
  return (
    <TableShell headers={["IATA", "ICAO", "NAME", "CITY", "COUNTRY", "COORDS"]}>
      {FAMOUS_AIRPORTS.map((a) => (
        <tr key={a.iata} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{a.iata}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.icao}</td>
          <td className="whitespace-nowrap px-3 py-2 text-white">{a.name}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.city}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.country}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.lat.toFixed(2)}, {a.lon.toFixed(2)}</td>
        </tr>
      ))}
    </TableShell>
  )
}

function FamousAirlinesTable() {
  return (
    <TableShell headers={["IATA", "ICAO", "NAME", "CALLSIGN", "COUNTRY"]}>
      {FAMOUS_AIRLINES.map((a) => (
        <tr key={a.iata} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{a.iata}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.icao}</td>
          <td className="whitespace-nowrap px-3 py-2 text-white">{a.name}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.callsign}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{a.country}</td>
        </tr>
      ))}
    </TableShell>
  )
}

function AircraftTable({ rows }: { rows: OpenSkyFlight[] }) {
  return (
    <TableShell headers={["FLIGHT", "REG", "MODEL", "MANUFACTURER", "ALT (FT)"]}>
      {rows.length === 0 && <EmptyRow label="AIRCRAFT" />}
      {rows.map((f, i) => (
        <tr key={`${f.icao24}-${i}`} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
          <td className="whitespace-nowrap px-3 py-2 font-semibold text-white">{f.flightNumber}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{f.registration ?? "—"}</td>
          <td className="whitespace-nowrap px-3 py-2 text-white">{f.model ?? f.typecode ?? "—"}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#94a3b8]">{f.manufacturer ?? "—"}</td>
          <td className="whitespace-nowrap px-3 py-2 text-[#7dd3fc]">{f.altitudeFt.toLocaleString()}</td>
        </tr>
      ))}
    </TableShell>
  )
}
