#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const SNAPSHOT_PATH = resolve(ROOT, "lib/aviationstack-snapshot.json")
const ENV_PATH = resolve(ROOT, ".env.local")

const BASE = "http://api.aviationstack.com/v1"

const FLIGHT_QUERIES = [
  { params: { airline_iata: "BA" }, limit: 25 },
  { params: { airline_iata: "SQ" }, limit: 25 },
  { params: { airline_iata: "AF" }, limit: 12 },
  { params: { airline_iata: "EK" }, limit: 12 },
]

function loadEnvLocal() {
  if (!existsSync(ENV_PATH)) return
  const raw = readFileSync(ENV_PATH, "utf8")
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/)
    if (!m) continue
    if (process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "")
    }
  }
}

async function fetchActiveFlights(key, filter, limit) {
  const url = new URL(`${BASE}/flights`)
  url.searchParams.set("access_key", key)
  url.searchParams.set("limit", String(limit))
  for (const [k, v] of Object.entries(filter)) url.searchParams.set(k, v)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  const json = await res.json()
  if (json.error) throw new Error(json.error.message ?? "unknown error")
  return json.data ?? []
}

async function main() {
  loadEnvLocal()
  const key = process.env.AVIATIONSTACK_API_KEY
  if (!key) {
    console.error("Missing AVIATIONSTACK_API_KEY (set it in .env.local or shell)")
    process.exit(1)
  }

  console.log(`Fetching ${FLIGHT_QUERIES.length} filtered flight queries from AviationStack…`)
  const allFlights = []
  for (const { params, limit } of FLIGHT_QUERIES) {
    const label = Object.entries(params).map(([k, v]) => `${k}=${v}`).join("&")
    process.stdout.write(`  flights?${label}&limit=${limit} … `)
    try {
      const data = await fetchActiveFlights(key, params, limit)
      console.log(`${data.length} rows`)
      allFlights.push(...data)
    } catch (err) {
      console.log(`failed (${err.message})`)
      throw err
    }
  }

  const seen = new Set()
  const flights = []
  for (const f of allFlights) {
    const k = f.flight?.iata ?? `${f.airline?.iata}-${f.departure?.iata}-${f.arrival?.iata}`
    if (!k || seen.has(k)) continue
    seen.add(k)
    flights.push(f)
  }

  const snapshot = {
    fetchedAt: new Date().toISOString(),
    flights,
    airports: [],
    airlines: [],
    airplanes: [],
  }
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + "\n", "utf8")
  console.log(`\nWrote ${SNAPSHOT_PATH} (${flights.length} unique active flights)`)
  console.log(`Used ${FLIGHT_QUERIES.length} of your monthly AviationStack requests.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
