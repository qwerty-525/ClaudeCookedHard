#!/usr/bin/env node
import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")
const SNAPSHOT_PATH = resolve(ROOT, "lib/opensky-snapshot.json")

const CALLSIGN_PREFIXES = {
  BAW: { iata: "BA", name: "British Airways" },
  SIA: { iata: "SQ", name: "Singapore Airlines" },
  AFR: { iata: "AF", name: "Air France" },
}

const AIRLINE_LIMITS = { BA: 30, SQ: 30, AF: 15 }

// ICAO → "City (IATA)" — mirrors lib/opensky.ts EXTRA_AIRPORTS + FAMOUS_AIRPORTS
const ICAO_TO_DISPLAY = {
  // Famous airports
  KJFK: "New York (JFK)", KEWR: "Newark (EWR)", KLAX: "Los Angeles (LAX)",
  KORD: "Chicago (ORD)", KSFO: "San Francisco (SFO)",
  EGLL: "London (LHR)", LFPG: "Paris (CDG)", EDDF: "Frankfurt (FRA)",
  EHAM: "Amsterdam (AMS)", WSSS: "Singapore (SIN)",
  RJTT: "Tokyo Haneda (HND)", RJAA: "Tokyo Narita (NRT)",
  ZSPD: "Shanghai (PVG)", RKSI: "Seoul (ICN)", VHHH: "Hong Kong (HKG)",
  OMDB: "Dubai (DXB)", OTHH: "Doha (DOH)", YMML: "Melbourne (MEL)", YSSY: "Sydney (SYD)",
  // UK
  EGKK: "London Gatwick (LGW)", EGLC: "London City (LCY)",
  EGCC: "Manchester (MAN)", EGBB: "Birmingham (BHX)", EGPH: "Edinburgh (EDI)",
  // France
  LFPO: "Paris Orly (ORY)", LFLL: "Lyon (LYS)", LFMN: "Nice (NCE)",
  // Germany
  EDDM: "Munich (MUC)", EDDB: "Berlin (BER)", EDDL: "Dusseldorf (DUS)",
  // Switzerland
  LSZH: "Zurich (ZRH)", LSGG: "Geneva (GVA)",
  // Austria
  LOWW: "Vienna (VIE)",
  // Belgium
  EBBR: "Brussels (BRU)",
  // Spain
  LEMD: "Madrid (MAD)", LEBL: "Barcelona (BCN)",
  // Portugal
  LPPT: "Lisbon (LIS)",
  // Italy
  LIRF: "Rome (FCO)", LIMC: "Milan (MXP)",
  // Sweden
  ESSA: "Stockholm (ARN)",
  // Denmark
  EKCH: "Copenhagen (CPH)",
  // Norway
  ENGM: "Oslo (OSL)",
  // Finland
  EFHK: "Helsinki (HEL)",
  // Poland
  EPWA: "Warsaw (WAW)",
  // Turkey
  LTFM: "Istanbul (IST)",
  // Israel
  LLBG: "Tel Aviv (TLV)",
  // UAE
  OMAA: "Abu Dhabi (AUH)",
  // Saudi Arabia
  OERK: "Riyadh (RUH)", OEJN: "Jeddah (JED)",
  // India
  VIDP: "Delhi (DEL)", VABB: "Mumbai (BOM)", VOMM: "Chennai (MAA)", VOBL: "Bangalore (BLR)",
  // Pakistan
  OPKC: "Karachi (KHI)", OPLA: "Lahore (LHE)",
  // Bangladesh
  VGHS: "Dhaka (DAC)",
  // Sri Lanka
  VCBI: "Colombo (CMB)",
  // Thailand
  VTBS: "Bangkok (BKK)", VTSP: "Phuket (HKT)",
  // Malaysia
  WMKK: "Kuala Lumpur (KUL)",
  // Indonesia
  WIII: "Jakarta (CGK)", WADD: "Bali (DPS)",
  // Philippines
  RPLL: "Manila (MNL)",
  // Vietnam
  VVTS: "Ho Chi Minh City (SGN)", VVNB: "Hanoi (HAN)",
  // Japan
  RJBB: "Osaka (KIX)",
  // China
  ZBAA: "Beijing (PEK)", ZGGG: "Guangzhou (CAN)", ZSSS: "Shanghai Hongqiao (SHA)",
  // Taiwan
  RCTP: "Taipei (TPE)",
  // Australia
  YPPH: "Perth (PER)", YBBN: "Brisbane (BNE)",
  // New Zealand
  NZAA: "Auckland (AKL)",
  // USA (extended)
  KIAD: "Washington (IAD)", KBOS: "Boston (BOS)", KMIA: "Miami (MIA)",
  KATL: "Atlanta (ATL)", KDEN: "Denver (DEN)", KSEA: "Seattle (SEA)",
  KLAS: "Las Vegas (LAS)", KCLT: "Charlotte (CLT)", KMCO: "Orlando (MCO)",
  KPHL: "Philadelphia (PHL)", KDFW: "Dallas (DFW)", KIAH: "Houston (IAH)",
  KPHX: "Phoenix (PHX)", KSAN: "San Diego (SAN)", KTPA: "Tampa (TPA)",
  KPDX: "Portland (PDX)", KBWI: "Baltimore (BWI)", KSJC: "San Jose (SJC)",
  KMSP: "Minneapolis (MSP)", KDTW: "Detroit (DTW)", KSTL: "St. Louis (STL)", KOAK: "Oakland (OAK)",
  // Canada
  CYYZ: "Toronto (YYZ)", CYVR: "Vancouver (YVR)", CYUL: "Montreal (YUL)",
  CYYC: "Calgary (YYC)",
  // Mexico
  MMMX: "Mexico City (MEX)", MMUN: "Cancun (CUN)",
  // Brazil
  SBGR: "São Paulo (GRU)",
  // Argentina
  SAEZ: "Buenos Aires (EZE)",
  // Chile
  SCEL: "Santiago (SCL)",
  // South Africa
  FAOR: "Johannesburg (JNB)", FACT: "Cape Town (CPT)",
  // Greece
  LGAV: "Athens (ATH)",
  // Germany
  EDDH: "Hamburg (HAM)",
  // Cambodia
  VDPP: "Phnom Penh (PNH)", VDSA: "Siem Reap (SAI)",
  // Philippines
  RPVM: "Cebu (CEB)",
  // Myanmar
  VYYY: "Yangon (RGN)",
  // Caribbean
  TFFF: "Fort-de-France (FDF)", MUHA: "Havana (HAV)",
  // Brazil
  SBGL: "Rio de Janeiro (GIG)",
  // Africa
  DGAA: "Accra (ACC)",
  HKJK: "Nairobi (NBO)", HAAB: "Addis Ababa (ADD)", DNMM: "Lagos (LOS)", GMMN: "Casablanca (CMN)",
  // Mauritius
  FIMP: "Mauritius (MRU)",
}

// Reverse: IATA → display string (for schedule lookup)
const IATA_TO_DISPLAY = {}
for (const display of Object.values(ICAO_TO_DISPLAY)) {
  const m = display.match(/\(([A-Z]{3})\)$/)
  if (m && !IATA_TO_DISPLAY[m[1]]) IATA_TO_DISPLAY[m[1]] = display
}

// Flight schedule: flight number → [fromIata, toIata]
const FLIGHT_SCHEDULE = {
  // British Airways
  "BA1":  ["LCY", "JFK"], "BA3":  ["LHR", "JFK"],
  "BA8":  ["HND", "LHR"], "BA12": ["SIN", "LHR"], "BA16": ["SYD", "LHR"],
  "BA54": ["JNB", "LHR"], "BA78": ["ACC", "LHR"], "BA142": ["DEL", "LHR"],
  "BA212": ["BOS", "LHR"], "BA220": ["STL", "LHR"], "BA242": ["MEX", "LHR"],
  "BA246": ["GRU", "LHR"], "BA248": ["EZE", "LHR"],
  "BA399": ["BRU", "LHR"], "BA639": ["ATH", "LHR"], "BA971": ["HAM", "LHR"],
  "BA9":  ["LHR", "SIN"], "BA11": ["LHR", "KUL"], "BA15": ["LHR", "PVG"],
  "BA17": ["LHR", "PEK"], "BA23": ["LHR", "YVR"], "BA25": ["LHR", "YYZ"],
  "BA27": ["LHR", "YVR"], "BA31": ["LHR", "NRT"], "BA33": ["LHR", "NRT"],
  "BA35": ["LHR", "HND"], "BA37": ["LHR", "HND"], "BA38": ["HND", "LHR"],
  "BA41": ["LHR", "SYD"], "BA43": ["LHR", "MEL"],
  "BA51": ["LHR", "BKK"], "BA53": ["LHR", "BKK"],
  "BA55": ["LHR", "BOM"], "BA57": ["LHR", "BOM"],
  "BA63": ["LHR", "DEL"], "BA65": ["LHR", "DEL"],
  "BA71": ["LHR", "ICN"], "BA77": ["LHR", "PEK"], "BA79": ["LHR", "PEK"],
  "BA83": ["LHR", "HKG"], "BA85": ["LHR", "HKG"],
  "BA91": ["LHR", "DXB"], "BA93": ["LHR", "DXB"],
  "BA95": ["LHR", "DOH"], "BA97": ["LHR", "DOH"], "BA99": ["LHR", "AUH"],
  "BA105": ["LHR", "JFK"], "BA107": ["LHR", "JFK"], "BA109": ["LHR", "JFK"],
  "BA111": ["LHR", "ORD"], "BA113": ["LHR", "ORD"],
  "BA117": ["LHR", "EWR"], "BA119": ["LHR", "EWR"], "BA121": ["LHR", "EWR"],
  "BA129": ["LHR", "BOS"], "BA131": ["LHR", "BOS"],
  "BA163": ["LHR", "ORD"],
  "BA171": ["LHR", "EWR"],
  "BA173": ["LHR", "JFK"], "BA175": ["LHR", "JFK"],
  "BA177": ["LHR", "JFK"], "BA179": ["LHR", "JFK"], "BA180": ["JFK", "LHR"],
  "BA183": ["LHR", "BOS"], "BA185": ["LHR", "BOS"], "BA187": ["LHR", "BOS"],
  "BA191": ["LHR", "YUL"], "BA193": ["LHR", "YUL"],
  "BA195": ["LHR", "YYZ"], "BA197": ["LHR", "YYZ"], "BA199": ["LHR", "YYZ"],
  "BA213": ["LHR", "IAD"], "BA215": ["LHR", "IAD"],
  "BA217": ["LHR", "IAD"], "BA219": ["LHR", "IAD"],
  "BA221": ["LHR", "PHL"], "BA223": ["LHR", "PHL"],
  "BA225": ["LHR", "CLT"], "BA227": ["LHR", "CLT"],
  "BA229": ["LHR", "ATL"], "BA231": ["LHR", "ATL"],
  "BA233": ["LHR", "MIA"], "BA237": ["LHR", "MIA"],
  "BA239": ["LHR", "MCO"], "BA241": ["LHR", "TPA"],
  "BA243": ["LHR", "LAS"],
  "BA245": ["LHR", "LAX"], "BA247": ["LHR", "LAX"],
  "BA249": ["LHR", "SFO"], "BA251": ["LHR", "SFO"],
  "BA253": ["LHR", "DEN"], "BA255": ["LHR", "DEN"],
  "BA257": ["LHR", "SEA"], "BA259": ["LHR", "SEA"],
  "BA261": ["LHR", "PHX"], "BA263": ["LHR", "SAN"],
  "BA265": ["LHR", "IAH"], "BA267": ["LHR", "DFW"],
  // Singapore Airlines
  "SQ1":  ["SIN", "LHR"], "SQ2":  ["LHR", "SIN"],
  "SQ7":  ["SIN", "JFK"], "SQ8":  ["JFK", "SIN"],
  "SQ11": ["SIN", "SFO"], "SQ12": ["SFO", "SIN"],
  "SQ21": ["SIN", "EWR"], "SQ22": ["EWR", "SIN"],
  "SQ25": ["SIN", "LAX"], "SQ26": ["LAX", "SIN"],
  "SQ31": ["SIN", "SFO"], "SQ32": ["SFO", "SIN"],
  "SQ37": ["SIN", "SFO"], "SQ38": ["SFO", "SIN"],
  "SQ51": ["SIN", "ICN"], "SQ52": ["ICN", "SIN"],
  "SQ53": ["SIN", "NRT"], "SQ54": ["NRT", "SIN"],
  "SQ61": ["SIN", "HND"], "SQ62": ["HND", "SIN"],
  "SQ63": ["SIN", "NRT"], "SQ64": ["NRT", "SIN"],
  "SQ71": ["SIN", "HND"], "SQ72": ["HND", "SIN"],
  "SQ117": ["SIN", "PVG"], "SQ118": ["PVG", "SIN"],
  "SQ231": ["SIN", "CDG"], "SQ232": ["CDG", "SIN"],
  "SQ301": ["SIN", "SYD"], "SQ302": ["SIN", "SYD"], "SQ303": ["SYD", "SIN"],
  "SQ305": ["SIN", "MEL"], "SQ306": ["MEL", "SIN"],
  "SQ317": ["SIN", "LAX"], "SQ318": ["LAX", "SIN"],
  "SQ321": ["SIN", "ORD"], "SQ322": ["ORD", "SIN"],
  "SQ27": ["SEA", "SIN"], "SQ33": ["SFO", "SIN"],
  "SQ114": ["SIN", "KUL"], "SQ156": ["SIN", "PNH"], "SQ163": ["SAI", "SIN"],
  "SQ236": ["BNE", "SIN"], "SQ286": ["AKL", "SIN"],
  "SQ304": ["SIN", "BRU"], "SQ312": ["SIN", "LGW"], "SQ319": ["LHR", "SIN"],
  "SQ326": ["SIN", "FRA"], "SQ346": ["SIN", "ZRH"], "SQ352": ["SIN", "CPH"],
  "SQ401": ["DEL", "SIN"], "SQ619": ["KIX", "SIN"], "SQ620": ["SIN", "KIX"],
  "SQ710": ["SIN", "BKK"], "SQ761": ["RGN", "SIN"],
  "SQ832": ["SIN", "PVG"], "SQ875": ["HKG", "SIN"], "SQ900": ["SIN", "CEB"],
  "SQ415": ["SIN", "AMS"], "SQ416": ["AMS", "SIN"],
  "SQ421": ["SIN", "FRA"], "SQ422": ["FRA", "SIN"],
  "SQ425": ["SIN", "ZRH"], "SQ426": ["ZRH", "SIN"],
  "SQ469": ["SIN", "LHR"], "SQ470": ["LHR", "SIN"],
  "SQ601": ["SIN", "BOM"], "SQ607": ["SIN", "BOM"], "SQ608": ["BOM", "SIN"], "SQ609": ["SIN", "BOM"],
  "SQ671": ["SIN", "ICN"], "SQ672": ["ICN", "SIN"],
  "SQ751": ["SIN", "HKG"], "SQ752": ["HKG", "SIN"],
  "SQ841": ["SIN", "LAX"], "SQ842": ["LAX", "SIN"],
  "SQ871": ["SIN", "MNL"], "SQ872": ["MNL", "SIN"],
  "SQ876": ["SIN", "HKG"],
  // Air France
  "AF6":  ["CDG", "JFK"], "AF7":  ["JFK", "CDG"],
  "AF9":  ["CDG", "JFK"], "AF10": ["JFK", "CDG"],
  "AF11": ["CDG", "EWR"], "AF12": ["EWR", "CDG"],
  "AF56": ["CDG", "LAX"], "AF57": ["LAX", "CDG"],
  "AF64": ["CDG", "LAX"], "AF65": ["LAX", "CDG"],
  "AF66": ["CDG", "SFO"], "AF67": ["SFO", "CDG"],
  "AF68": ["CDG", "SEA"], "AF69": ["SEA", "CDG"],
  "AF70": ["CDG", "YVR"], "AF71": ["YVR", "CDG"],
  "AF72": ["CDG", "YUL"], "AF73": ["YUL", "CDG"],
  "AF74": ["CDG", "YYZ"], "AF75": ["YYZ", "CDG"],
  "AF76": ["CDG", "NRT"], "AF77": ["NRT", "CDG"],
  "AF79": ["CDG", "HND"], "AF80": ["HND", "CDG"],
  "AF84": ["CDG", "PEK"], "AF85": ["PEK", "CDG"],
  "AF88": ["CDG", "ORD"], "AF89": ["ORD", "CDG"],
  "AF90": ["CDG", "IAD"], "AF91": ["IAD", "CDG"],
  "AF110": ["CDG", "BOS"], "AF111": ["BOS", "CDG"],
  "AF116": ["CDG", "ATL"], "AF117": ["ATL", "CDG"],
  "AF160": ["CDG", "DXB"], "AF161": ["DXB", "CDG"],
  "AF174": ["CDG", "MIA"], "AF175": ["MIA", "CDG"],
  "AF180": ["CDG", "JNB"], "AF181": ["JNB", "CDG"],
  "AF202": ["CDG", "SIN"], "AF203": ["SIN", "CDG"],
  "AF210": ["CDG", "MRU"],
  "AF292": ["CDG", "SIN"], "AF293": ["SIN", "CDG"],
  "AF358": ["CDG", "ICN"], "AF359": ["ICN", "CDG"],
  "AF173": ["MEX", "CDG"], "AF256": ["CDG", "SIN"],
  "AF809": ["FDF", "CDG"], "AF1239": ["VIE", "CDG"],
  "AF1463": ["ARN", "CDG"], "AF4199": ["HAV", "CDG"],
  "AF446": ["CDG", "CMN"],
  "AF530": ["CDG", "HKG"], "AF531": ["HKG", "CDG"],
  "AF674": ["CDG", "SYD"], "AF675": ["SYD", "CDG"],
}

function icaoToDisplay(icao) {
  if (!icao) return null
  return ICAO_TO_DISPLAY[icao] ?? icao
}

function getDepDisplay(flightNumber, depIcao) {
  if (depIcao) return icaoToDisplay(depIcao)
  const route = FLIGHT_SCHEDULE[flightNumber]
  if (!route) return null
  return IATA_TO_DISPLAY[route[0]] ?? route[0]
}

function getArrDisplay(flightNumber, depIcao, arrIcao) {
  if (arrIcao) return icaoToDisplay(arrIcao)
  const route = FLIGHT_SCHEDULE[flightNumber]
  if (!route) return null
  const depIata = depIcao
    ? ICAO_TO_DISPLAY[depIcao]?.match(/\(([A-Z]{3})\)$/)?.[1] ?? null
    : FLIGHT_SCHEDULE[flightNumber]?.[0] ?? null
  const destIata = depIata === route[0] ? route[1]
    : depIata === route[1] ? route[0]
    : route[1]
  return IATA_TO_DISPLAY[destIata] ?? destIata
}

function callsignToFlightNumber(callsign, prefix, iata) {
  const suffix = callsign.slice(prefix.length)
  const normalized = /^\d+$/.test(suffix) ? String(parseInt(suffix, 10)) : suffix
  return iata + normalized
}

function parseStateVector(raw) {
  if (!Array.isArray(raw) || raw.length < 17) return null
  return {
    icao24: String(raw[0] ?? ""),
    callsign: raw[1] ? String(raw[1]).trim() || null : null,
    longitude: typeof raw[5] === "number" ? raw[5] : null,
    latitude: typeof raw[6] === "number" ? raw[6] : null,
    baroAltitude: typeof raw[7] === "number" ? raw[7] : null,
    onGround: Boolean(raw[8]),
    velocity: typeof raw[9] === "number" ? raw[9] : null,
    trueTrack: typeof raw[10] === "number" ? raw[10] : null,
    verticalRate: typeof raw[11] === "number" ? raw[11] : null,
  }
}

async function fetchMetadata(icao24) {
  try {
    const res = await fetch(`https://opensky-network.org/api/metadata/aircraft/icao/${icao24}`)
    if (!res.ok) return { registration: null, model: null, typecode: null, manufacturer: null }
    const j = await res.json()
    return {
      registration: j.registration || null,
      model: j.model || null,
      typecode: j.typecode || null,
      manufacturer: j.manufacturerName || j.manufacturerIcao || null,
    }
  } catch {
    return { registration: null, model: null, typecode: null, manufacturer: null }
  }
}

async function fetchRoute(icao24) {
  try {
    const now = Math.floor(Date.now() / 1000)
    const begin = now - 86400
    const res = await fetch(
      `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${begin}&end=${now}`
    )
    if (!res.ok) return { depIcao: null, arrIcao: null }
    const flights = await res.json()
    if (!flights?.length) return { depIcao: null, arrIcao: null }
    const latest = [...flights].sort((a, b) => b.firstSeen - a.firstSeen)[0]
    return {
      depIcao: latest.estDepartureAirport || null,
      arrIcao: latest.estArrivalAirport || null,
    }
  } catch {
    return { depIcao: null, arrIcao: null }
  }
}

function roundRobin(groups) {
  const result = []
  const maxLen = Math.max(0, ...groups.map((g) => g.length))
  for (let i = 0; i < maxLen; i++) {
    for (const group of groups) {
      if (i < group.length) result.push(group[i])
    }
  }
  return result
}

async function main() {
  console.log("Fetching live aircraft states from OpenSky Network…")
  const res = await fetch("https://opensky-network.org/api/states/all")
  if (!res.ok) throw new Error(`OpenSky failed: ${res.status} ${res.statusText}`)
  const json = await res.json()

  const vectors = (json.states ?? []).map(parseStateVector).filter(Boolean)
  console.log(`Parsed ${vectors.length} state vectors. Filtering for target airlines…`)

  const groups = {}
  for (const state of vectors) {
    if (!state.callsign || state.latitude === null || state.longitude === null || state.onGround) continue
    for (const [prefix, airline] of Object.entries(CALLSIGN_PREFIXES)) {
      if (state.callsign.startsWith(prefix)) {
        const iata = airline.iata
        if (!groups[iata]) groups[iata] = []
        if (groups[iata].length < (AIRLINE_LIMITS[iata] ?? 10)) {
          groups[iata].push({ state, airlineIata: iata, airlineName: airline.name, icaoPrefix: prefix })
        }
        break
      }
    }
  }

  for (const [iata, flights] of Object.entries(groups)) {
    console.log(`  ${iata}: ${flights.length} flights`)
  }

  const groupArrays = Object.values(groups)
  const flat = groupArrays.flat()
  const uniqueIcao24s = [...new Set(flat.map((s) => s.state.icao24))]
  console.log(`\nFetching metadata + routes for ${uniqueIcao24s.length} aircraft (batches of 8)…`)

  const metaMap = {}
  const routeMap = {}
  const BATCH = 8
  for (let i = 0; i < uniqueIcao24s.length; i += BATCH) {
    const batch = uniqueIcao24s.slice(i, i + BATCH)
    process.stdout.write(`  ${i + 1}–${Math.min(i + BATCH, uniqueIcao24s.length)} of ${uniqueIcao24s.length}… `)
    const results = await Promise.all(
      batch.map((icao24) =>
        Promise.all([
          fetchMetadata(icao24).then((meta) => ({ icao24, meta })),
          fetchRoute(icao24).then((route) => ({ icao24, route })),
        ])
      )
    )
    for (const [{ icao24, meta }, { route }] of results) {
      metaMap[icao24] = meta
      routeMap[icao24] = route
    }
    console.log("ok")
  }

  const flightGroups = groupArrays.map((group) =>
    group.map(({ state, airlineIata, airlineName, icaoPrefix }) => {
      const meta = metaMap[state.icao24] ?? { registration: null, model: null, typecode: null, manufacturer: null }
      const route = routeMap[state.icao24] ?? { depIcao: null, arrIcao: null }
      const flightNumber = callsignToFlightNumber(state.callsign, icaoPrefix, airlineIata)
      return {
        icao24: state.icao24,
        callsign: state.callsign,
        flightNumber,
        airlineIata,
        airlineName,
        latitude: state.latitude,
        longitude: state.longitude,
        altitudeFt: Math.round((state.baroAltitude ?? 0) * 3.28084),
        velocityKts: Math.round((state.velocity ?? 0) * 1.94384),
        heading: state.trueTrack ?? 0,
        verticalRate: state.verticalRate ?? 0,
        onGround: state.onGround,
        registration: meta.registration,
        model: meta.model,
        typecode: meta.typecode,
        manufacturer: meta.manufacturer,
        depIcao: route.depIcao,
        arrIcao: route.arrIcao,
        depDisplay: getDepDisplay(flightNumber, route.depIcao),
        arrDisplay: getArrDisplay(flightNumber, route.depIcao, route.arrIcao),
      }
    })
  )

  const flights = roundRobin(flightGroups)

  // Print sample to verify dep/arr display
  console.log("\nSample FROM/TO:")
  flights.slice(0, 8).forEach((f) =>
    console.log(`  ${f.flightNumber.padEnd(8)} ${(f.depDisplay ?? "—").padEnd(24)} → ${f.arrDisplay ?? "—"}`)
  )

  const snapshot = { fetchedAt: new Date().toISOString(), flights }
  writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + "\n", "utf8")
  console.log(`\nWrote ${SNAPSHOT_PATH} (${flights.length} live flights, interleaved BA/SQ/AF)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
