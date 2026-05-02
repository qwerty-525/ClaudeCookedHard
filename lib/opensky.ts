import { FAMOUS_AIRPORTS } from "@/lib/famous"

export interface OpenSkyFlight {
  icao24: string
  callsign: string
  flightNumber: string
  airlineIata: string
  airlineName: string
  latitude: number
  longitude: number
  altitudeFt: number
  velocityKts: number
  heading: number
  verticalRate: number
  onGround: boolean
  registration: string | null
  model: string | null
  typecode: string | null
  manufacturer: string | null
  depIcao: string | null
  arrIcao: string | null
  depDisplay: string | null
  arrDisplay: string | null
}

export interface OpenSkySnapshot {
  fetchedAt: string | null
  flights: OpenSkyFlight[]
}

export const EMPTY_OPENSKY_SNAPSHOT: OpenSkySnapshot = { fetchedAt: null, flights: [] }

export const CALLSIGN_PREFIXES: Record<string, { iata: string; name: string }> = {
  BAW: { iata: "BA", name: "British Airways" },
  SIA: { iata: "SQ", name: "Singapore Airlines" },
  AFR: { iata: "AF", name: "Air France" },
}

export const AIRLINE_LIMITS: Record<string, number> = { BA: 30, SQ: 30, AF: 15 }

// Airports not already in FAMOUS_AIRPORTS — ICAO → "City (IATA)"
const EXTRA_AIRPORTS: Record<string, string> = {
  // UK
  EGKK: "London Gatwick (LGW)", EGLC: "London City (LCY)",
  EGCC: "Manchester (MAN)", EGBB: "Birmingham (BHX)", EGPH: "Edinburgh (EDI)",
  // France
  LFPO: "Paris Orly (ORY)", LFLL: "Lyon (LYS)", LFMN: "Nice (NCE)", LFRN: "Rennes (RNS)",
  // Germany
  EDDM: "Munich (MUC)", EDDB: "Berlin (BER)", EDDL: "Dusseldorf (DUS)",
  // Switzerland
  LSZH: "Zurich (ZRH)", LSGG: "Geneva (GVA)",
  // Austria
  LOWW: "Vienna (VIE)",
  // Netherlands — AMS already in FAMOUS
  // Belgium
  EBBR: "Brussels (BRU)",
  // Spain
  LEMD: "Madrid (MAD)", LEBL: "Barcelona (BCN)", LEMG: "Malaga (AGP)",
  // Portugal
  LPPT: "Lisbon (LIS)", LPPR: "Porto (OPO)",
  // Italy
  LIRF: "Rome (FCO)", LIMC: "Milan (MXP)", LIME: "Milan Bergamo (BGY)",
  // Sweden
  ESSA: "Stockholm (ARN)", ESGG: "Gothenburg (GOT)",
  // Denmark
  EKCH: "Copenhagen (CPH)",
  // Norway
  ENGM: "Oslo (OSL)",
  // Finland
  EFHK: "Helsinki (HEL)",
  // Poland
  EPWA: "Warsaw (WAW)",
  // Turkey
  LTFM: "Istanbul (IST)", LTAI: "Antalya (AYT)",
  // Israel
  LLBG: "Tel Aviv (TLV)",
  // UAE — DXB already in FAMOUS
  OMAA: "Abu Dhabi (AUH)", OMSJ: "Sharjah (SHJ)",
  // Saudi Arabia
  OERK: "Riyadh (RUH)", OEJN: "Jeddah (JED)",
  // India
  VIDP: "Delhi (DEL)", VABB: "Mumbai (BOM)", VOMM: "Chennai (MAA)",
  VOBL: "Bangalore (BLR)", VOCI: "Kochi (COK)",
  // Pakistan
  OPKC: "Karachi (KHI)", OPLA: "Lahore (LHE)",
  // Bangladesh
  VGHS: "Dhaka (DAC)",
  // Sri Lanka
  VCBI: "Colombo (CMB)",
  // Thailand
  VTBS: "Bangkok (BKK)", VTSP: "Phuket (HKT)",
  // Malaysia
  WMKK: "Kuala Lumpur (KUL)", WMBT: "Kota Kinabalu (BKI)",
  // Indonesia
  WIII: "Jakarta (CGK)", WADD: "Bali (DPS)",
  // Philippines
  RPLL: "Manila (MNL)",
  // Vietnam
  VVTS: "Ho Chi Minh City (SGN)", VVNB: "Hanoi (HAN)",
  // Japan — HND, NRT already in FAMOUS
  RJBB: "Osaka (KIX)", RJFF: "Fukuoka (FUK)",
  // China — PVG already in FAMOUS
  ZBAA: "Beijing (PEK)", ZGGG: "Guangzhou (CAN)", ZUCK: "Chongqing (CKG)",
  ZUUU: "Chengdu (CTU)", ZSSS: "Shanghai Hongqiao (SHA)",
  // Taiwan
  RCTP: "Taipei (TPE)",
  // Australia — SYD, MEL already in FAMOUS
  YPPH: "Perth (PER)", YBBN: "Brisbane (BNE)", YPAD: "Adelaide (ADL)",
  // New Zealand
  NZAA: "Auckland (AKL)", NZCH: "Christchurch (CHC)",
  // USA — JFK, EWR, LAX, ORD, SFO already in FAMOUS
  KIAD: "Washington (IAD)", KBOS: "Boston (BOS)", KMIA: "Miami (MIA)",
  KATL: "Atlanta (ATL)", KDEN: "Denver (DEN)", KSEA: "Seattle (SEA)",
  KLAS: "Las Vegas (LAS)", KCLT: "Charlotte (CLT)", KMCO: "Orlando (MCO)",
  KPHL: "Philadelphia (PHL)", KDFW: "Dallas (DFW)", KIAH: "Houston (IAH)",
  KPHX: "Phoenix (PHX)", KSAN: "San Diego (SAN)", KTPA: "Tampa (TPA)",
  KPDX: "Portland (PDX)", KBWI: "Baltimore (BWI)", KSJC: "San Jose (SJC)",
  KOAK: "Oakland (OAK)", KSTL: "St. Louis (STL)", KMSP: "Minneapolis (MSP)",
  KDTW: "Detroit (DTW)", KLAX: "Los Angeles (LAX)",
  // Canada
  CYYZ: "Toronto (YYZ)", CYVR: "Vancouver (YVR)", CYUL: "Montreal (YUL)",
  CYYC: "Calgary (YYC)", CYOW: "Ottawa (YOW)",
  // Mexico
  MMMX: "Mexico City (MEX)", MMUN: "Cancun (CUN)",
  // Brazil
  SBGR: "São Paulo (GRU)", SBRJ: "Rio de Janeiro (SDU)", SBKP: "Campinas (VCP)",
  // Argentina
  SAEZ: "Buenos Aires (EZE)",
  // Chile
  SCEL: "Santiago (SCL)",
  // Colombia
  SKBO: "Bogota (BOG)",
  // South Africa
  FAOR: "Johannesburg (JNB)", FACT: "Cape Town (CPT)",
  // Greece
  LGAV: "Athens (ATH)",
  // Germany — FRA already in FAMOUS
  EDDH: "Hamburg (HAM)",
  // Cambodia
  VDPP: "Phnom Penh (PNH)", VDSA: "Siem Reap (SAI)",
  // Philippines
  RPVM: "Cebu (CEB)",
  // Myanmar
  VYYY: "Yangon (RGN)",
  // Caribbean
  TFFF: "Fort-de-France (FDF)", MUHA: "Havana (HAV)",
  // Brazil — GRU already included above
  SBGL: "Rio de Janeiro (GIG)",
  // Africa
  DGAA: "Accra (ACC)",
  HKJK: "Nairobi (NBO)", HAAB: "Addis Ababa (ADD)", DNMM: "Lagos (LOS)",
  GMMN: "Casablanca (CMN)", HECA: "Cairo (CAI)",
  // Mauritius
  FIMP: "Mauritius (MRU)",
  // Maldives
  VRMM: "Malé (MLE)",
}

// Build combined ICAO→display map (FAMOUS_AIRPORTS first, extras supplement)
const ICAO_TO_DISPLAY: Record<string, string> = {}
for (const a of FAMOUS_AIRPORTS) {
  ICAO_TO_DISPLAY[a.icao] = `${a.city} (${a.iata})`
}
Object.assign(ICAO_TO_DISPLAY, EXTRA_AIRPORTS)

// Reverse IATA→display for schedule-based arrival lookup
const IATA_TO_DISPLAY: Record<string, string> = {}
for (const display of Object.values(ICAO_TO_DISPLAY)) {
  const m = display.match(/\(([A-Z]{3})\)$/)
  if (m && !IATA_TO_DISPLAY[m[1]]) IATA_TO_DISPLAY[m[1]] = display
}

function icaoToDisplay(icao: string | null): string | null {
  if (!icao) return null
  return ICAO_TO_DISPLAY[icao] ?? icao
}

// Flight schedule: flight number → [fromIata, toIata]
// Bidirectional: if dep matches [1], destination is [0], and vice versa
const FLIGHT_SCHEDULE: Record<string, [string, string]> = {
  // ── British Airways (LHR base) ──────────────────────────────────────────
  "BA1":  ["LCY", "JFK"],
  "BA3":  ["LHR", "JFK"],
  "BA9":  ["LHR", "SIN"],
  "BA11": ["LHR", "KUL"],
  "BA15": ["LHR", "PVG"],
  "BA17": ["LHR", "PEK"],
  "BA23": ["LHR", "YVR"],
  "BA25": ["LHR", "YYZ"],
  "BA27": ["LHR", "YVR"],
  "BA31": ["LHR", "NRT"],
  "BA33": ["LHR", "NRT"],
  "BA35": ["LHR", "HND"],
  "BA37": ["LHR", "HND"],
  "BA38": ["HND", "LHR"],
  "BA41": ["LHR", "SYD"],
  "BA43": ["LHR", "MEL"],
  "BA51": ["LHR", "BKK"],
  "BA53": ["LHR", "BKK"],
  "BA55": ["LHR", "BOM"],
  "BA57": ["LHR", "BOM"],
  "BA63": ["LHR", "DEL"],
  "BA65": ["LHR", "DEL"],
  "BA71": ["LHR", "ICN"],
  "BA77": ["LHR", "PEK"],
  "BA79": ["LHR", "PEK"],
  "BA83": ["LHR", "HKG"],
  "BA85": ["LHR", "HKG"],
  "BA91": ["LHR", "DXB"],
  "BA93": ["LHR", "DXB"],
  "BA95": ["LHR", "DOH"],
  "BA97": ["LHR", "DOH"],
  "BA99": ["LHR", "AUH"],
  "BA105": ["LHR", "JFK"],
  "BA107": ["LHR", "JFK"],
  "BA109": ["LHR", "JFK"],
  "BA111": ["LHR", "ORD"],
  "BA113": ["LHR", "ORD"],
  "BA117": ["LHR", "EWR"],
  "BA119": ["LHR", "EWR"],
  "BA121": ["LHR", "EWR"],
  "BA129": ["LHR", "BOS"],
  "BA131": ["LHR", "BOS"],
  "BA8":  ["HND", "LHR"],
  "BA12": ["SIN", "LHR"],
  "BA16": ["SYD", "LHR"],
  "BA54": ["JNB", "LHR"],
  "BA78": ["ACC", "LHR"],
  "BA142": ["DEL", "LHR"],
  "BA212": ["BOS", "LHR"],
  "BA220": ["STL", "LHR"],
  "BA242": ["MEX", "LHR"],
  "BA246": ["GRU", "LHR"],
  "BA248": ["EZE", "LHR"],
  "BA399": ["BRU", "LHR"],
  "BA639": ["ATH", "LHR"],
  "BA971": ["HAM", "LHR"],
  "BA163": ["LHR", "ORD"],
  "BA171": ["LHR", "EWR"],
  "BA173": ["LHR", "JFK"],
  "BA175": ["LHR", "JFK"],
  "BA177": ["LHR", "JFK"],
  "BA179": ["LHR", "JFK"],
  "BA180": ["JFK", "LHR"],
  "BA183": ["LHR", "BOS"],
  "BA185": ["LHR", "BOS"],
  "BA187": ["LHR", "BOS"],
  "BA191": ["LHR", "YUL"],
  "BA193": ["LHR", "YUL"],
  "BA195": ["LHR", "YYZ"],
  "BA197": ["LHR", "YYZ"],
  "BA199": ["LHR", "YYZ"],
  "BA213": ["LHR", "IAD"],
  "BA215": ["LHR", "IAD"],
  "BA217": ["LHR", "IAD"],
  "BA219": ["LHR", "IAD"],
  "BA221": ["LHR", "PHL"],
  "BA223": ["LHR", "PHL"],
  "BA225": ["LHR", "CLT"],
  "BA227": ["LHR", "CLT"],
  "BA229": ["LHR", "ATL"],
  "BA231": ["LHR", "ATL"],
  "BA233": ["LHR", "MIA"],
  "BA237": ["LHR", "MIA"],
  "BA239": ["LHR", "MCO"],
  "BA241": ["LHR", "TPA"],
  "BA243": ["LHR", "LAS"],
  "BA245": ["LHR", "LAX"],
  "BA247": ["LHR", "LAX"],
  "BA249": ["LHR", "SFO"],
  "BA251": ["LHR", "SFO"],
  "BA253": ["LHR", "DEN"],
  "BA255": ["LHR", "DEN"],
  "BA257": ["LHR", "SEA"],
  "BA259": ["LHR", "SEA"],
  "BA261": ["LHR", "PHX"],
  "BA263": ["LHR", "SAN"],
  "BA265": ["LHR", "IAH"],
  "BA267": ["LHR", "DFW"],
  // ── Singapore Airlines (SIN base) ───────────────────────────────────────
  "SQ1":  ["SIN", "LHR"],
  "SQ2":  ["LHR", "SIN"],
  "SQ7":  ["SIN", "JFK"],
  "SQ8":  ["JFK", "SIN"],
  "SQ11": ["SIN", "SFO"],
  "SQ12": ["SFO", "SIN"],
  "SQ21": ["SIN", "EWR"],
  "SQ22": ["EWR", "SIN"],
  "SQ25": ["SIN", "LAX"],
  "SQ26": ["LAX", "SIN"],
  "SQ31": ["SIN", "SFO"],
  "SQ32": ["SFO", "SIN"],
  "SQ37": ["SIN", "SFO"],
  "SQ38": ["SFO", "SIN"],
  "SQ51": ["SIN", "ICN"],
  "SQ52": ["ICN", "SIN"],
  "SQ53": ["SIN", "NRT"],
  "SQ54": ["NRT", "SIN"],
  "SQ61": ["SIN", "HND"],
  "SQ62": ["HND", "SIN"],
  "SQ63": ["SIN", "NRT"],
  "SQ64": ["NRT", "SIN"],
  "SQ71": ["SIN", "HND"],
  "SQ72": ["HND", "SIN"],
  "SQ117": ["SIN", "PVG"],
  "SQ118": ["PVG", "SIN"],
  "SQ231": ["SIN", "CDG"],
  "SQ232": ["CDG", "SIN"],
  "SQ301": ["SIN", "SYD"],
  "SQ302": ["SIN", "SYD"],
  "SQ303": ["SYD", "SIN"],
  "SQ305": ["SIN", "MEL"],
  "SQ306": ["MEL", "SIN"],
  "SQ317": ["SIN", "LAX"],
  "SQ318": ["LAX", "SIN"],
  "SQ321": ["SIN", "ORD"],
  "SQ322": ["ORD", "SIN"],
  "SQ27": ["SEA", "SIN"],
  "SQ33": ["SFO", "SIN"],
  "SQ114": ["SIN", "KUL"],
  "SQ156": ["SIN", "PNH"],
  "SQ163": ["SAI", "SIN"],
  "SQ236": ["BNE", "SIN"],
  "SQ286": ["AKL", "SIN"],
  "SQ304": ["SIN", "BRU"],
  "SQ312": ["SIN", "LGW"],
  "SQ319": ["LHR", "SIN"],
  "SQ326": ["SIN", "FRA"],
  "SQ346": ["SIN", "ZRH"],
  "SQ352": ["SIN", "CPH"],
  "SQ401": ["DEL", "SIN"],
  "SQ619": ["KIX", "SIN"],
  "SQ620": ["SIN", "KIX"],
  "SQ710": ["SIN", "BKK"],
  "SQ761": ["RGN", "SIN"],
  "SQ832": ["SIN", "PVG"],
  "SQ875": ["HKG", "SIN"],
  "SQ900": ["SIN", "CEB"],
  "SQ415": ["SIN", "AMS"],
  "SQ416": ["AMS", "SIN"],
  "SQ421": ["SIN", "FRA"],
  "SQ422": ["FRA", "SIN"],
  "SQ425": ["SIN", "ZRH"],
  "SQ426": ["ZRH", "SIN"],
  "SQ469": ["SIN", "LHR"],
  "SQ470": ["LHR", "SIN"],
  "SQ601": ["SIN", "BOM"],
  "SQ607": ["SIN", "BOM"],
  "SQ608": ["BOM", "SIN"],
  "SQ609": ["SIN", "BOM"],
  "SQ671": ["SIN", "ICN"],
  "SQ672": ["ICN", "SIN"],
  "SQ751": ["SIN", "HKG"],
  "SQ752": ["HKG", "SIN"],
  "SQ841": ["SIN", "LAX"],
  "SQ842": ["LAX", "SIN"],
  "SQ871": ["SIN", "MNL"],
  "SQ872": ["MNL", "SIN"],
  "SQ876": ["SIN", "HKG"],
  // ── Air France (CDG base) ────────────────────────────────────────────────
  "AF6":  ["CDG", "JFK"],
  "AF7":  ["JFK", "CDG"],
  "AF9":  ["CDG", "JFK"],
  "AF10": ["JFK", "CDG"],
  "AF11": ["CDG", "EWR"],
  "AF12": ["EWR", "CDG"],
  "AF56": ["CDG", "LAX"],
  "AF57": ["LAX", "CDG"],
  "AF64": ["CDG", "LAX"],
  "AF65": ["LAX", "CDG"],
  "AF66": ["CDG", "SFO"],
  "AF67": ["SFO", "CDG"],
  "AF68": ["CDG", "SEA"],
  "AF69": ["SEA", "CDG"],
  "AF70": ["CDG", "YVR"],
  "AF71": ["YVR", "CDG"],
  "AF72": ["CDG", "YUL"],
  "AF73": ["YUL", "CDG"],
  "AF74": ["CDG", "YYZ"],
  "AF75": ["YYZ", "CDG"],
  "AF76": ["CDG", "NRT"],
  "AF77": ["NRT", "CDG"],
  "AF79": ["CDG", "HND"],
  "AF80": ["HND", "CDG"],
  "AF84": ["CDG", "PEK"],
  "AF85": ["PEK", "CDG"],
  "AF88": ["CDG", "ORD"],
  "AF89": ["ORD", "CDG"],
  "AF90": ["CDG", "IAD"],
  "AF91": ["IAD", "CDG"],
  "AF110": ["CDG", "BOS"],
  "AF111": ["BOS", "CDG"],
  "AF116": ["CDG", "ATL"],
  "AF117": ["ATL", "CDG"],
  "AF160": ["CDG", "DXB"],
  "AF161": ["DXB", "CDG"],
  "AF174": ["CDG", "MIA"],
  "AF175": ["MIA", "CDG"],
  "AF180": ["CDG", "JNB"],
  "AF181": ["JNB", "CDG"],
  "AF202": ["CDG", "SIN"],
  "AF203": ["SIN", "CDG"],
  "AF210": ["CDG", "MRU"],
  "AF292": ["CDG", "SIN"],
  "AF293": ["SIN", "CDG"],
  "AF358": ["CDG", "ICN"],
  "AF359": ["ICN", "CDG"],
  "AF173": ["MEX", "CDG"],
  "AF256": ["CDG", "SIN"],
  "AF809": ["FDF", "CDG"],
  "AF1239": ["VIE", "CDG"],
  "AF1463": ["ARN", "CDG"],
  "AF4199": ["HAV", "CDG"],
  "AF446": ["CDG", "CMN"],
  "AF530": ["CDG", "HKG"],
  "AF531": ["HKG", "CDG"],
  "AF674": ["CDG", "SYD"],
  "AF675": ["SYD", "CDG"],
}

function getDepDisplay(flightNumber: string, depIcao: string | null): string | null {
  // Prefer actual depIcao from routes API
  if (depIcao) return icaoToDisplay(depIcao)
  // Fall back to schedule: each flight number maps to one fixed departure airport
  const route = FLIGHT_SCHEDULE[flightNumber]
  if (!route) return null
  return IATA_TO_DISPLAY[route[0]] ?? route[0]
}

function getArrDisplay(flightNumber: string, depIcao: string | null, arrIcao: string | null): string | null {
  // 1. Direct from routes API call
  if (arrIcao) return icaoToDisplay(arrIcao)

  // 2. Schedule lookup
  const route = FLIGHT_SCHEDULE[flightNumber]
  if (!route) return null

  const depIata = depIcao
    ? (ICAO_TO_DISPLAY[depIcao]?.match(/\(([A-Z]{3})\)$/)?.[1] ?? null)
    : (FLIGHT_SCHEDULE[flightNumber]?.[0] ?? null)

  const destIata = depIata === route[0] ? route[1]
    : depIata === route[1] ? route[0]
    : route[1]

  return IATA_TO_DISPLAY[destIata] ?? destIata
}

interface StateVector {
  icao24: string
  callsign: string | null
  longitude: number | null
  latitude: number | null
  baroAltitude: number | null
  onGround: boolean
  velocity: number | null
  trueTrack: number | null
  verticalRate: number | null
}

function parseStateVector(raw: unknown[]): StateVector | null {
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

async function fetchMetadata(icao24: string): Promise<Pick<OpenSkyFlight, "registration" | "model" | "typecode" | "manufacturer">> {
  try {
    const res = await fetch(`https://opensky-network.org/api/metadata/aircraft/icao/${icao24}`, { cache: "no-store" })
    if (!res.ok) return { registration: null, model: null, typecode: null, manufacturer: null }
    const j = (await res.json()) as Record<string, string | null>
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

interface FlightRecord {
  estDepartureAirport: string | null
  estArrivalAirport: string | null
  firstSeen: number
}

async function fetchRoute(icao24: string): Promise<{ depIcao: string | null; arrIcao: string | null }> {
  try {
    const now = Math.floor(Date.now() / 1000)
    const begin = now - 86400
    const res = await fetch(
      `https://opensky-network.org/api/flights/aircraft?icao24=${icao24}&begin=${begin}&end=${now}`,
      { cache: "no-store" },
    )
    if (!res.ok) return { depIcao: null, arrIcao: null }
    const flights = (await res.json()) as FlightRecord[]
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

function callsignToFlightNumber(callsign: string, icaoPrefix: string, iataCode: string): string {
  const suffix = callsign.slice(icaoPrefix.length)
  // Strip leading zeros from purely numeric suffixes: "091" → "91", "007" → "7"
  // Keep alphanumeric as-is: "28F" → "28F"
  const normalized = /^\d+$/.test(suffix) ? String(parseInt(suffix, 10)) : suffix
  return iataCode + normalized
}

function roundRobin<T>(groups: T[][]): T[] {
  const result: T[] = []
  const maxLen = Math.max(0, ...groups.map((g) => g.length))
  for (let i = 0; i < maxLen; i++) {
    for (const group of groups) {
      if (i < group.length) result.push(group[i])
    }
  }
  return result
}

export async function buildOpenSkySnapshot(): Promise<OpenSkySnapshot> {
  const res = await fetch("https://opensky-network.org/api/states/all", { cache: "no-store" })
  if (!res.ok) throw new Error(`OpenSky states/all failed: ${res.status} ${res.statusText}`)
  const json = (await res.json()) as { states: unknown[][] | null }

  const vectors = (json.states ?? [])
    .map(parseStateVector)
    .filter((s): s is StateVector => s !== null)

  const groups: Record<string, { state: StateVector; airlineIata: string; airlineName: string; icaoPrefix: string }[]> = {}
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

  const groupArrays = Object.values(groups)
  const flat = groupArrays.flat()
  const uniqueIcao24s = [...new Set(flat.map((s) => s.state.icao24))]

  const metaMap = new Map<string, Awaited<ReturnType<typeof fetchMetadata>>>()
  const routeMap = new Map<string, { depIcao: string | null; arrIcao: string | null }>()

  await Promise.all(
    uniqueIcao24s.map(async (icao24) => {
      const [meta, route] = await Promise.all([fetchMetadata(icao24), fetchRoute(icao24)])
      metaMap.set(icao24, meta)
      routeMap.set(icao24, route)
    }),
  )

  const flightGroups: OpenSkyFlight[][] = groupArrays.map((group) =>
    group.map(({ state, airlineIata, airlineName, icaoPrefix }) => {
      const meta = metaMap.get(state.icao24) ?? { registration: null, model: null, typecode: null, manufacturer: null }
      const route = routeMap.get(state.icao24) ?? { depIcao: null, arrIcao: null }
      const flightNumber = callsignToFlightNumber(state.callsign!, icaoPrefix, airlineIata)
      return {
        icao24: state.icao24,
        callsign: state.callsign!,
        flightNumber,
        airlineIata,
        airlineName,
        latitude: state.latitude!,
        longitude: state.longitude!,
        altitudeFt: Math.round((state.baroAltitude ?? 0) * 3.28084),
        velocityKts: Math.round((state.velocity ?? 0) * 1.94384),
        heading: state.trueTrack ?? 0,
        verticalRate: state.verticalRate ?? 0,
        onGround: state.onGround,
        ...meta,
        depIcao: route.depIcao,
        arrIcao: route.arrIcao,
        depDisplay: getDepDisplay(flightNumber, route.depIcao),
        arrDisplay: getArrDisplay(flightNumber, route.depIcao, route.arrIcao),
      }
    }),
  )

  return { fetchedAt: new Date().toISOString(), flights: roundRobin(flightGroups) }
}

export async function refreshPositions(existing: OpenSkySnapshot): Promise<OpenSkySnapshot> {
  const res = await fetch("https://opensky-network.org/api/states/all", { cache: "no-store" })
  if (!res.ok) throw new Error(`OpenSky states/all failed: ${res.status}`)
  const json = (await res.json()) as { states: unknown[][] | null }

  const posMap = new Map<string, StateVector>()
  for (const raw of json.states ?? []) {
    const v = parseStateVector(raw as unknown[])
    if (v && v.latitude !== null && v.longitude !== null) posMap.set(v.icao24, v)
  }

  const flights = existing.flights.reduce<OpenSkyFlight[]>((acc, f) => {
    const v = posMap.get(f.icao24)
    if (!v || v.latitude === null || v.longitude === null || v.onGround) return acc
    acc.push({
      ...f,
      latitude: v.latitude,
      longitude: v.longitude,
      altitudeFt: Math.round((v.baroAltitude ?? 0) * 3.28084),
      velocityKts: Math.round((v.velocity ?? 0) * 1.94384),
      heading: v.trueTrack ?? f.heading,
      verticalRate: v.verticalRate ?? f.verticalRate,
      onGround: false,
    })
    return acc
  }, [])

  return { ...existing, flights, fetchedAt: new Date().toISOString() }
}
