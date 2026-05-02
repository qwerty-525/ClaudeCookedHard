export interface FamousAirport {
  iata: string
  icao: string
  name: string
  city: string
  country: string
  countryIso: string
  lat: number
  lon: number
  timezone: string
}

export interface FamousAirline {
  iata: string
  icao: string
  name: string
  callsign: string
  country: string
}

export const FAMOUS_AIRPORTS: FamousAirport[] = [
  { iata: "JFK", icao: "KJFK", name: "John F. Kennedy International", city: "New York", country: "United States", countryIso: "US", lat: 40.6413, lon: -73.7781, timezone: "America/New_York" },
  { iata: "EWR", icao: "KEWR", name: "Newark Liberty International", city: "Newark", country: "United States", countryIso: "US", lat: 40.6925, lon: -74.1687, timezone: "America/New_York" },
  { iata: "LAX", icao: "KLAX", name: "Los Angeles International", city: "Los Angeles", country: "United States", countryIso: "US", lat: 33.9416, lon: -118.4085, timezone: "America/Los_Angeles" },
  { iata: "ORD", icao: "KORD", name: "O'Hare International", city: "Chicago", country: "United States", countryIso: "US", lat: 41.9742, lon: -87.9073, timezone: "America/Chicago" },
  { iata: "SFO", icao: "KSFO", name: "San Francisco International", city: "San Francisco", country: "United States", countryIso: "US", lat: 37.6213, lon: -122.3790, timezone: "America/Los_Angeles" },
  { iata: "LHR", icao: "EGLL", name: "Heathrow", city: "London", country: "United Kingdom", countryIso: "GB", lat: 51.4700, lon: -0.4543, timezone: "Europe/London" },
  { iata: "CDG", icao: "LFPG", name: "Charles de Gaulle", city: "Paris", country: "France", countryIso: "FR", lat: 49.0097, lon: 2.5479, timezone: "Europe/Paris" },
  { iata: "FRA", icao: "EDDF", name: "Frankfurt am Main", city: "Frankfurt", country: "Germany", countryIso: "DE", lat: 50.0379, lon: 8.5622, timezone: "Europe/Berlin" },
  { iata: "AMS", icao: "EHAM", name: "Schiphol", city: "Amsterdam", country: "Netherlands", countryIso: "NL", lat: 52.3105, lon: 4.7683, timezone: "Europe/Amsterdam" },
  { iata: "SIN", icao: "WSSS", name: "Changi", city: "Singapore", country: "Singapore", countryIso: "SG", lat: 1.3644, lon: 103.9915, timezone: "Asia/Singapore" },
  { iata: "HND", icao: "RJTT", name: "Haneda", city: "Tokyo", country: "Japan", countryIso: "JP", lat: 35.5494, lon: 139.7798, timezone: "Asia/Tokyo" },
  { iata: "NRT", icao: "RJAA", name: "Narita International", city: "Tokyo", country: "Japan", countryIso: "JP", lat: 35.7720, lon: 140.3929, timezone: "Asia/Tokyo" },
  { iata: "PVG", icao: "ZSPD", name: "Pudong International", city: "Shanghai", country: "China", countryIso: "CN", lat: 31.1443, lon: 121.8083, timezone: "Asia/Shanghai" },
  { iata: "ICN", icao: "RKSI", name: "Incheon International", city: "Seoul", country: "South Korea", countryIso: "KR", lat: 37.4602, lon: 126.4407, timezone: "Asia/Seoul" },
  { iata: "HKG", icao: "VHHH", name: "Hong Kong International", city: "Hong Kong", country: "Hong Kong", countryIso: "HK", lat: 22.3080, lon: 113.9185, timezone: "Asia/Hong_Kong" },
  { iata: "DXB", icao: "OMDB", name: "Dubai International", city: "Dubai", country: "United Arab Emirates", countryIso: "AE", lat: 25.2532, lon: 55.3657, timezone: "Asia/Dubai" },
  { iata: "DOH", icao: "OTHH", name: "Hamad International", city: "Doha", country: "Qatar", countryIso: "QA", lat: 25.2731, lon: 51.6080, timezone: "Asia/Qatar" },
  { iata: "MEL", icao: "YMML", name: "Melbourne Tullamarine", city: "Melbourne", country: "Australia", countryIso: "AU", lat: -37.6690, lon: 144.8410, timezone: "Australia/Melbourne" },
  { iata: "SYD", icao: "YSSY", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", countryIso: "AU", lat: -33.9399, lon: 151.1753, timezone: "Australia/Sydney" },
]

export const FAMOUS_AIRLINES: FamousAirline[] = [
  { iata: "SQ", icao: "SIA", name: "Singapore Airlines", callsign: "SINGAPORE", country: "Singapore" },
  { iata: "BA", icao: "BAW", name: "British Airways", callsign: "SPEEDBIRD", country: "United Kingdom" },
  { iata: "AF", icao: "AFR", name: "Air France", callsign: "AIRFRANS", country: "France" },
  { iata: "LH", icao: "DLH", name: "Lufthansa", callsign: "LUFTHANSA", country: "Germany" },
  { iata: "KL", icao: "KLM", name: "KLM Royal Dutch Airlines", callsign: "KLM", country: "Netherlands" },
  { iata: "QF", icao: "QFA", name: "Qantas", callsign: "QANTAS", country: "Australia" },
  { iata: "QR", icao: "QTR", name: "Qatar Airways", callsign: "QATARI", country: "Qatar" },
  { iata: "EK", icao: "UAE", name: "Emirates", callsign: "EMIRATES", country: "United Arab Emirates" },
  { iata: "CX", icao: "CPA", name: "Cathay Pacific", callsign: "CATHAY", country: "Hong Kong" },
  { iata: "NH", icao: "ANA", name: "All Nippon Airways", callsign: "ALL NIPPON", country: "Japan" },
  { iata: "JL", icao: "JAL", name: "Japan Airlines", callsign: "JAPAN AIR", country: "Japan" },
  { iata: "KE", icao: "KAL", name: "Korean Air", callsign: "KOREAN AIR", country: "South Korea" },
  { iata: "TG", icao: "THA", name: "Thai Airways", callsign: "THAI", country: "Thailand" },
  { iata: "AA", icao: "AAL", name: "American Airlines", callsign: "AMERICAN", country: "United States" },
  { iata: "TK", icao: "THY", name: "Turkish Airlines", callsign: "TURKISH", country: "Turkey" },
]

export const FAMOUS_AIRPORT_IATAS = new Set(FAMOUS_AIRPORTS.map((a) => a.iata))
export const FAMOUS_AIRLINE_IATAS = new Set(FAMOUS_AIRLINES.map((a) => a.iata))

import type { AviationStackFlight } from "@/lib/aviationstack"

const AIRPORT_BY_IATA = new Map(FAMOUS_AIRPORTS.map((a) => [a.iata, a]))
const AIRLINE_BY_IATA = new Map(FAMOUS_AIRLINES.map((a) => [a.iata, a]))

export interface FamousAircraft {
  registration: string
  model: string
  airlineIata: string
  ageYears: number
  enginesCount: number
  enginesType: string
}

export const FAMOUS_AIRCRAFT_BY_REG: Record<string, FamousAircraft> = {
  "G-STBA": { registration: "G-STBA", model: "Boeing 777-336ER", airlineIata: "BA", ageYears: 13, enginesCount: 2, enginesType: "JET" },
  "G-STBE": { registration: "G-STBE", model: "Boeing 777-336ER", airlineIata: "BA", ageYears: 12, enginesCount: 2, enginesType: "JET" },
  "9V-SGD": { registration: "9V-SGD", model: "Airbus A350-941ULR", airlineIata: "SQ", ageYears: 8, enginesCount: 2, enginesType: "JET" },
  "9V-SGE": { registration: "9V-SGE", model: "Airbus A350-941ULR", airlineIata: "SQ", ageYears: 7, enginesCount: 2, enginesType: "JET" },
  "F-GSQU": { registration: "F-GSQU", model: "Boeing 777-328ER", airlineIata: "AF", ageYears: 18, enginesCount: 2, enginesType: "JET" },
  "JA784A": { registration: "JA784A", model: "Boeing 777-381ER", airlineIata: "NH", ageYears: 14, enginesCount: 2, enginesType: "JET" },
  "D-ABYK": { registration: "D-ABYK", model: "Boeing 747-830", airlineIata: "LH", ageYears: 13, enginesCount: 4, enginesType: "JET" },
  "PH-BVA": { registration: "PH-BVA", model: "Boeing 777-306ER", airlineIata: "KL", ageYears: 16, enginesCount: 2, enginesType: "JET" },
  "G-ZBKA": { registration: "G-ZBKA", model: "Boeing 787-9 Dreamliner", airlineIata: "BA", ageYears: 9, enginesCount: 2, enginesType: "JET" },
  "B-KQA": { registration: "B-KQA", model: "Boeing 777-367ER", airlineIata: "CX", ageYears: 13, enginesCount: 2, enginesType: "JET" },
  "JA871J": { registration: "JA871J", model: "Boeing 787-9 Dreamliner", airlineIata: "JL", ageYears: 8, enginesCount: 2, enginesType: "JET" },
  "A6-EUS": { registration: "A6-EUS", model: "Airbus A380-861", airlineIata: "EK", ageYears: 7, enginesCount: 4, enginesType: "JET" },
  "A6-EUW": { registration: "A6-EUW", model: "Airbus A380-861", airlineIata: "EK", ageYears: 6, enginesCount: 4, enginesType: "JET" },
  "A7-BAA": { registration: "A7-BAA", model: "Boeing 777-3DZER", airlineIata: "QR", ageYears: 17, enginesCount: 2, enginesType: "JET" },
  "VH-ZNA": { registration: "VH-ZNA", model: "Boeing 787-9 Dreamliner", airlineIata: "QF", ageYears: 9, enginesCount: 2, enginesType: "JET" },
  "B-LXA": { registration: "B-LXA", model: "Airbus A350-1041", airlineIata: "CX", ageYears: 6, enginesCount: 2, enginesType: "JET" },
  "HL7621": { registration: "HL7621", model: "Airbus A380-861", airlineIata: "KE", ageYears: 13, enginesCount: 4, enginesType: "JET" },
  "D-AIHF": { registration: "D-AIHF", model: "Airbus A340-642", airlineIata: "LH", ageYears: 18, enginesCount: 4, enginesType: "JET" },
  "9V-SMB": { registration: "9V-SMB", model: "Airbus A350-941", airlineIata: "SQ", ageYears: 9, enginesCount: 2, enginesType: "JET" },
  "9V-SCA": { registration: "9V-SCA", model: "Boeing 787-10 Dreamliner", airlineIata: "SQ", ageYears: 6, enginesCount: 2, enginesType: "JET" },
  "VH-OQA": { registration: "VH-OQA", model: "Airbus A380-842 (Nancy-Bird Walton)", airlineIata: "QF", ageYears: 16, enginesCount: 4, enginesType: "JET" },
  "N717AN": { registration: "N717AN", model: "Boeing 777-323ER", airlineIata: "AA", ageYears: 12, enginesCount: 2, enginesType: "JET" },
}

function makeFamousFlight(
  flightNumber: string,
  airlineIata: string,
  depIata: string,
  arrIata: string,
  registration: string,
): AviationStackFlight {
  const airline = AIRLINE_BY_IATA.get(airlineIata)
  const dep = AIRPORT_BY_IATA.get(depIata)
  const arr = AIRPORT_BY_IATA.get(arrIata)
  const ac = FAMOUS_AIRCRAFT_BY_REG[registration]
  if (!airline || !dep || !arr) {
    throw new Error(`makeFamousFlight: unknown ${airlineIata}/${depIata}/${arrIata}`)
  }
  if (!ac) {
    throw new Error(`makeFamousFlight: unknown registration ${registration}`)
  }
  const code = `${airlineIata}${flightNumber}`
  return {
    flight_date: null,
    flight_status: "scheduled",
    departure: { airport: dep.name, iata: dep.iata, icao: dep.icao, timezone: dep.timezone, scheduled: null },
    arrival: { airport: arr.name, iata: arr.iata, icao: arr.icao, timezone: arr.timezone, scheduled: null },
    airline: { name: airline.name, iata: airline.iata, icao: airline.icao },
    flight: { number: flightNumber, iata: code, icao: `${airline.icao}${flightNumber}` },
    aircraft: { registration, iata: null, icao: null },
    live: null,
  }
}

export const FAMOUS_ROUTES: AviationStackFlight[] = [
  makeFamousFlight("175", "BA", "LHR", "JFK", "G-STBA"),
  makeFamousFlight("178", "BA", "JFK", "LHR", "G-STBE"),
  makeFamousFlight("21", "SQ", "SIN", "EWR", "9V-SGD"),
  makeFamousFlight("22", "SQ", "EWR", "SIN", "9V-SGE"),
  makeFamousFlight("8", "AF", "CDG", "JFK", "F-GSQU"),
  makeFamousFlight("12", "NH", "NRT", "ORD", "JA784A"),
  makeFamousFlight("400", "LH", "FRA", "JFK", "D-ABYK"),
  makeFamousFlight("643", "KL", "AMS", "JFK", "PH-BVA"),
  makeFamousFlight("15", "BA", "LHR", "SIN", "G-ZBKA"),
  makeFamousFlight("830", "CX", "HKG", "JFK", "B-KQA"),
  makeFamousFlight("62", "JL", "NRT", "LAX", "JA871J"),
  makeFamousFlight("1", "EK", "DXB", "LHR", "A6-EUS"),
  makeFamousFlight("412", "EK", "DXB", "SYD", "A6-EUW"),
  makeFamousFlight("701", "QR", "DOH", "JFK", "A7-BAA"),
  makeFamousFlight("93", "QF", "MEL", "LAX", "VH-ZNA"),
  makeFamousFlight("870", "CX", "HKG", "SFO", "B-LXA"),
  makeFamousFlight("85", "KE", "ICN", "JFK", "HL7621"),
  makeFamousFlight("728", "LH", "FRA", "PVG", "D-AIHF"),
  makeFamousFlight("12", "SQ", "SFO", "SIN", "9V-SMB"),
  makeFamousFlight("856", "SQ", "SIN", "HKG", "9V-SCA"),
  makeFamousFlight("11", "QF", "SYD", "LAX", "VH-OQA"),
  makeFamousFlight("100", "AA", "JFK", "LHR", "N717AN"),
]

