"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import type { AviationStackFlight } from "@/lib/aviationstack"
import type { OpenSkyFlight } from "@/lib/opensky"
import { FAMOUS_AIRPORTS } from "@/lib/famous"

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false })

interface FlightGlobeProps {
  arcFlights: AviationStackFlight[]
  liveFlights: OpenSkyFlight[]
}

interface Arc {
  startLat: number; startLng: number
  endLat: number;   endLng: number
  flightCode: string; airline: string
  depIata: string;  arrIata: string
  color: [string, string]
}

interface PointDatum {
  lat: number; lng: number
  label: string
  kind: "airport" | "live"
}

interface LabelDatum {
  lat: number; lng: number
  text: string
  kind: "country" | "flight"
}

const COUNTRY_LABELS: Omit<LabelDatum, "kind">[] = [
  { text: "United States",   lat: 38.0,  lng: -97.0  },
  { text: "Canada",          lat: 56.1,  lng: -106.3 },
  { text: "Brazil",          lat: -10.0, lng: -53.0  },
  { text: "Argentina",       lat: -35.0, lng: -65.0  },
  { text: "Chile",           lat: -30.0, lng: -71.0  },
  { text: "Colombia",        lat: 4.6,   lng: -74.1  },
  { text: "Mexico",          lat: 23.6,  lng: -102.5 },
  { text: "Peru",            lat: -9.2,  lng: -75.0  },
  { text: "United Kingdom",  lat: 54.0,  lng: -2.0   },
  { text: "France",          lat: 46.2,  lng: 2.2    },
  { text: "Germany",         lat: 51.2,  lng: 10.4   },
  { text: "Spain",           lat: 40.5,  lng: -3.7   },
  { text: "Italy",           lat: 42.5,  lng: 12.5   },
  { text: "Portugal",        lat: 39.4,  lng: -8.2   },
  { text: "Netherlands",     lat: 52.3,  lng: 5.3    },
  { text: "Sweden",          lat: 62.2,  lng: 17.7   },
  { text: "Norway",          lat: 64.5,  lng: 17.9   },
  { text: "Denmark",         lat: 56.3,  lng: 9.5    },
  { text: "Finland",         lat: 64.0,  lng: 26.0   },
  { text: "Poland",          lat: 52.0,  lng: 19.1   },
  { text: "Ukraine",         lat: 48.4,  lng: 31.2   },
  { text: "Russia",          lat: 61.5,  lng: 105.3  },
  { text: "Turkey",          lat: 39.0,  lng: 35.2   },
  { text: "Greece",          lat: 39.1,  lng: 21.8   },
  { text: "Saudi Arabia",    lat: 24.7,  lng: 45.9   },
  { text: "UAE",             lat: 24.0,  lng: 54.4   },
  { text: "Qatar",           lat: 25.4,  lng: 51.2   },
  { text: "Iran",            lat: 32.4,  lng: 53.7   },
  { text: "Iraq",            lat: 33.2,  lng: 43.7   },
  { text: "Israel",          lat: 31.5,  lng: 34.8   },
  { text: "Egypt",           lat: 26.8,  lng: 30.8   },
  { text: "Nigeria",         lat: 9.1,   lng: 8.7    },
  { text: "South Africa",    lat: -29.0, lng: 25.0   },
  { text: "Ethiopia",        lat: 9.1,   lng: 40.5   },
  { text: "Kenya",           lat: 0.0,   lng: 37.9   },
  { text: "Morocco",         lat: 32.0,  lng: -5.0   },
  { text: "India",           lat: 20.6,  lng: 79.0   },
  { text: "Pakistan",        lat: 30.4,  lng: 69.3   },
  { text: "Bangladesh",      lat: 23.7,  lng: 90.4   },
  { text: "China",           lat: 35.0,  lng: 105.0  },
  { text: "Japan",           lat: 36.2,  lng: 138.3  },
  { text: "South Korea",     lat: 36.0,  lng: 128.0  },
  { text: "Vietnam",         lat: 16.0,  lng: 108.0  },
  { text: "Thailand",        lat: 15.9,  lng: 100.9  },
  { text: "Malaysia",        lat: 3.5,   lng: 109.6  },
  { text: "Singapore",       lat: 1.35,  lng: 103.82 },
  { text: "Indonesia",       lat: -2.0,  lng: 118.0  },
  { text: "Philippines",     lat: 13.0,  lng: 122.0  },
  { text: "Kazakhstan",      lat: 48.0,  lng: 68.0   },
  { text: "Australia",       lat: -25.3, lng: 133.8  },
  { text: "New Zealand",     lat: -40.9, lng: 174.9  },
  { text: "Algeria",         lat: 28.0,  lng: 2.6    },
  { text: "Sudan",           lat: 12.9,  lng: 30.2   },
]

function greatCircleMidpoint(lat1: number, lng1: number, lat2: number, lng2: number) {
  const φ1 = (lat1 * Math.PI) / 180, φ2 = (lat2 * Math.PI) / 180
  const λ1 = (lng1 * Math.PI) / 180, Δλ = ((lng2 - lng1) * Math.PI) / 180
  const Bx = Math.cos(φ2) * Math.cos(Δλ), By = Math.cos(φ2) * Math.sin(Δλ)
  const φm = Math.atan2(Math.sin(φ1) + Math.sin(φ2), Math.sqrt((Math.cos(φ1) + Bx) ** 2 + By ** 2))
  const λm = λ1 + Math.atan2(By, Math.cos(φ1) + Bx)
  return { lat: (φm * 180) / Math.PI, lng: (((λm * 180) / Math.PI + 540) % 360) - 180 }
}

export default function FlightGlobe({ arcFlights, liveFlights }: FlightGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const globeRef     = useRef<unknown>(null)
  const [size, setSize]       = useState({ w: 0, h: 0 })
  const [mounted, setMounted] = useState(false)
  const [activeArcIdx, setActiveArcIdx]   = useState(0)
  const [activeLiveIdx, setActiveLiveIdx] = useState(0)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onGlobeReady = () => {
    const g = globeRef.current as { controls?: () => { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean }; pointOfView?: (p: { lat: number; lng: number; altitude: number }, ms: number) => void } | null
    if (!g?.controls || !g?.pointOfView) return
    const c = g.controls()
    c.autoRotate = true
    c.autoRotateSpeed = 0.4
    c.enableZoom = false
    g.pointOfView({ lat: 25, lng: 10, altitude: 2.4 }, 0)
  }

  const airportLookup = useMemo(() => {
    const m = new Map<string, { lat: number; lng: number; name: string }>()
    for (const a of FAMOUS_AIRPORTS) m.set(a.iata, { lat: a.lat, lng: a.lon, name: a.name })
    return m
  }, [])

  const arcs = useMemo<Arc[]>(() => {
    const out: Arc[] = []
    for (const f of arcFlights) {
      const dep = f.departure?.iata?.toUpperCase()
      const arr = f.arrival?.iata?.toUpperCase()
      if (!dep || !arr) continue
      const a = airportLookup.get(dep), b = airportLookup.get(arr)
      if (!a || !b) continue
      out.push({
        startLat: a.lat, startLng: a.lng, endLat: b.lat, endLng: b.lng,
        flightCode: f.flight?.iata ?? f.flight?.icao ?? "",
        airline: f.airline?.name ?? f.airline?.iata ?? "",
        depIata: dep, arrIata: arr,
        color: ["rgba(125,211,252,0.05)", "rgba(125,211,252,0.85)"],
      })
    }
    return out
  }, [arcFlights, airportLookup])

  // Cycle arc labels every 5s
  useEffect(() => {
    if (arcs.length === 0) return
    const id = setInterval(() => setActiveArcIdx((i) => (i + 1) % arcs.length), 5000)
    return () => clearInterval(id)
  }, [arcs.length])

  // Cycle live flight labels every 4s
  useEffect(() => {
    if (liveFlights.length === 0) return
    const id = setInterval(() => setActiveLiveIdx((i) => (i + 1) % liveFlights.length), 4000)
    return () => clearInterval(id)
  }, [liveFlights.length])

  const labelsData = useMemo<LabelDatum[]>(() => {
    const labels: LabelDatum[] = COUNTRY_LABELS.map((c) => ({ ...c, kind: "country" as const }))
    // Active arc label
    if (arcs.length > 0) {
      const arc = arcs[activeArcIdx % arcs.length]
      if (arc) {
        const mid = greatCircleMidpoint(arc.startLat, arc.startLng, arc.endLat, arc.endLng)
        labels.push({ lat: mid.lat, lng: mid.lng, text: arc.flightCode, kind: "flight" as const })
      }
    }
    // Active live flight label (callsign + altitude)
    if (liveFlights.length > 0) {
      const f = liveFlights[activeLiveIdx % liveFlights.length]
      if (f) {
        labels.push({
          lat: f.latitude, lng: f.longitude,
          text: `${f.flightNumber} · ${f.altitudeFt.toLocaleString()}ft`,
          kind: "flight" as const,
        })
      }
    }
    return labels
  }, [arcs, activeArcIdx, liveFlights, activeLiveIdx])

  const points = useMemo<PointDatum[]>(() => {
    const out: PointDatum[] = []
    for (const a of FAMOUS_AIRPORTS) {
      out.push({ lat: a.lat, lng: a.lon, label: `${a.iata} · ${a.city}`, kind: "airport" })
    }
    for (const f of liveFlights) {
      out.push({
        lat: f.latitude, lng: f.longitude,
        label: `${f.flightNumber} · ${f.model ?? f.typecode ?? f.airlineIata} · ${f.altitudeFt.toLocaleString()}ft · ${f.velocityKts}kts`,
        kind: "live",
      })
    }
    return out
  }, [liveFlights])

  if (!mounted) return <div ref={containerRef} className="absolute inset-0" />

  return (
    <div ref={containerRef} className="absolute inset-0">
      {size.w > 0 && size.h > 0 && (
        <Globe
          ref={globeRef as never}
          width={size.w}
          height={size.h}
          onGlobeReady={onGlobeReady}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          showAtmosphere
          atmosphereColor="#3b82f6"
          atmosphereAltitude={0.18}
          arcsData={arcs}
          arcStartLat={(d) => (d as Arc).startLat}
          arcStartLng={(d) => (d as Arc).startLng}
          arcEndLat={(d) => (d as Arc).endLat}
          arcEndLng={(d) => (d as Arc).endLng}
          arcColor={(d: object) => (d as Arc).color as unknown as string}
          arcLabel={(d: object) => {
            const a = d as Arc
            return `<div style="font-family:ui-monospace,monospace;font-size:11px;background:#04060a;border:1px solid #7dd3fc;color:#fff;padding:6px 10px">${a.flightCode}<br/><span style="color:#7dd3fc">${a.depIata} → ${a.arrIata}</span><br/><span style="color:#94a3b8;font-size:10px">${a.airline}</span></div>`
          }}
          arcAltitude={0.22}
          arcStroke={0.35}
          arcDashLength={0.4}
          arcDashGap={0.6}
          arcDashAnimateTime={4500}
          arcsTransitionDuration={1200}
          labelsData={labelsData}
          labelLat={(d) => (d as LabelDatum).lat}
          labelLng={(d) => (d as LabelDatum).lng}
          labelText={(d) => (d as LabelDatum).text}
          labelSize={(d) => (d as LabelDatum).kind === "country" ? 0.65 : 1.3}
          labelDotRadius={(d) => (d as LabelDatum).kind === "country" ? 0 : 0.35}
          labelColor={(d) => (d as LabelDatum).kind === "country" ? "rgba(148,163,184,0.50)" : "#f59e0b"}
          labelAltitude={(d) => (d as LabelDatum).kind === "country" ? 0.001 : 0.12}
          labelResolution={2}
          labelsTransitionDuration={600}
          pointsData={points}
          pointLat={(d) => (d as PointDatum).lat}
          pointLng={(d) => (d as PointDatum).lng}
          pointLabel={(d) => (d as PointDatum).label}
          pointColor={(d) => (d as PointDatum).kind === "live" ? "#22d3ee" : "#7dd3fc"}
          pointAltitude={(d) => (d as PointDatum).kind === "live" ? 0.04 : 0.005}
          pointRadius={(d) => (d as PointDatum).kind === "live" ? 0.3 : 0.18}
          pointResolution={6}
        />
      )}
    </div>
  )
}
