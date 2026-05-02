export const AVIATIONSTACK_BASE = "http://api.aviationstack.com/v1"

export const AVIATIONSTACK_ENDPOINTS = ["flights", "airports", "airlines", "airplanes"] as const
export type AviationEndpoint = (typeof AVIATIONSTACK_ENDPOINTS)[number]

export const FLIGHT_QUERIES: Array<{ params: Record<string, string>; limit: number }> = [
  { params: { airline_iata: "BA" }, limit: 25 },
  { params: { airline_iata: "SQ" }, limit: 25 },
  { params: { airline_iata: "AF" }, limit: 12 },
  { params: { airline_iata: "EK" }, limit: 12 },
]

export interface AviationStackFlight {
  flight_date: string | null
  flight_status: string | null
  departure: {
    airport: string | null
    iata: string | null
    icao: string | null
    timezone: string | null
    scheduled: string | null
  } | null
  arrival: {
    airport: string | null
    iata: string | null
    icao: string | null
    timezone: string | null
    scheduled: string | null
  } | null
  airline: { name: string | null; iata: string | null; icao: string | null } | null
  flight: { number: string | null; iata: string | null; icao: string | null } | null
  aircraft: { registration: string | null; iata: string | null; icao: string | null } | null
  live: {
    updated: string | null
    latitude: number | null
    longitude: number | null
    altitude: number | null
    direction: number | null
    speed_horizontal: number | null
    is_ground: boolean | null
  } | null
}

export interface AviationStackAirport {
  airport_name: string | null
  iata_code: string | null
  icao_code: string | null
  latitude: number | string | null
  longitude: number | string | null
  timezone: string | null
  country_name: string | null
  country_iso2: string | null
  city_iata_code: string | null
}

export interface AviationStackAirline {
  airline_name: string | null
  iata_code: string | null
  icao_code: string | null
  callsign: string | null
  fleet_size: number | string | null
  fleet_average_age: number | string | null
  country_name: string | null
  date_founded: number | string | null
  status: string | null
}

export interface AviationStackAirplane {
  iata_type: string | null
  airline_iata_code: string | null
  construction_number: string | null
  delivery_date: string | null
  engines_count: number | string | null
  engines_type: string | null
  first_flight_date: string | null
  model_name: string | null
  plane_age: number | string | null
  plane_status: string | null
  registration_number: string | null
  production_line: string | null
}

export interface AviationStackPagination {
  limit: number
  offset: number
  count: number
  total: number
}

export interface AviationStackResponse<T> {
  pagination: AviationStackPagination
  data: T[]
}

export interface AviationStackSnapshot {
  fetchedAt: string | null
  flights: AviationStackFlight[]
  airports: AviationStackAirport[]
  airlines: AviationStackAirline[]
  airplanes: AviationStackAirplane[]
}

export const EMPTY_SNAPSHOT: AviationStackSnapshot = {
  fetchedAt: null,
  flights: [],
  airports: [],
  airlines: [],
  airplanes: [],
}

export async function fetchAviationStackEndpoint<T>(
  endpoint: AviationEndpoint,
  apiKey: string,
  limit = 100,
): Promise<AviationStackResponse<T>> {
  const url = new URL(`${AVIATIONSTACK_BASE}/${endpoint}`)
  url.searchParams.set("access_key", apiKey)
  url.searchParams.set("limit", String(limit))

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    throw new Error(`AviationStack ${endpoint} failed: ${res.status} ${res.statusText}`)
  }
  const json = (await res.json()) as AviationStackResponse<T> & { error?: { message?: string } }
  if ("error" in json && json.error) {
    throw new Error(`AviationStack ${endpoint} error: ${json.error.message ?? "unknown"}`)
  }
  return json
}

export async function fetchActiveFlights(
  apiKey: string,
  filter: Record<string, string>,
  limit: number,
): Promise<AviationStackFlight[]> {
  const url = new URL(`${AVIATIONSTACK_BASE}/flights`)
  url.searchParams.set("access_key", apiKey)
  url.searchParams.set("limit", String(limit))
  for (const [k, v] of Object.entries(filter)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error(`AviationStack flights failed: ${res.status} ${res.statusText}`)
  const json = (await res.json()) as AviationStackResponse<AviationStackFlight> & { error?: { message?: string } }
  if ("error" in json && json.error) throw new Error(json.error.message ?? "unknown")
  return json.data ?? []
}

export async function fetchSnapshotFromApi(apiKey: string): Promise<AviationStackSnapshot> {
  const batches = await Promise.all(FLIGHT_QUERIES.map(({ params, limit }) => fetchActiveFlights(apiKey, params, limit)))
  const seen = new Set<string>()
  const flights: AviationStackFlight[] = []
  for (const batch of batches) {
    for (const f of batch) {
      const key = f.flight?.iata ?? `${f.airline?.iata}-${f.departure?.iata}-${f.arrival?.iata}`
      if (!key || seen.has(key)) continue
      seen.add(key)
      flights.push(f)
    }
  }
  return { fetchedAt: new Date().toISOString(), flights, airports: [], airlines: [], airplanes: [] }
}
