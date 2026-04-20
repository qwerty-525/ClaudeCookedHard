export interface Aircraft {
  slug: string
  name: string
  detail: string
  year: number
  fact: string
  image?: string
  mach?: number
  active?: boolean
  // detail page fields — fill these in as you go
  description?: string
  specs?: { label: string; value: string }[]
}

export const commercialPlanes: Aircraft[] = [
  {
    slug: "boeing-747",
    name: "Boeing 747",
    detail: "Boeing · USA",
    year: 1968,
    fact: "The 'Queen of the Skies' — the first wide-body jet, its iconic hump reshaping air travel. Over 1,500 delivered across its lifetime.",
    image: "/planes/boeing747.png",
  },
  {
    slug: "airbus-a380",
    name: "Airbus A380",
    detail: "Airbus · Europe",
    year: 2005,
    fact: "The world's largest passenger aircraft with two full passenger decks, capable of carrying over 800 passengers in all-economy configuration.",
    image: "/planes/a380.png",
  },
  {
    slug: "concorde",
    name: "Concorde",
    detail: "Aérospatiale/BAC · UK & France",
    year: 1969,
    fact: "The only supersonic passenger jet in commercial service. Crossed the Atlantic in under 3.5 hours at Mach 2 — twice the speed of sound.",
    image: "/planes/concorde.png",
  },
  {
    slug: "boeing-777",
    name: "Boeing 777",
    detail: "Boeing · USA",
    year: 1994,
    fact: "The world's largest twin-engine airliner. Its GE90-115B engine holds the verified record for the highest thrust ever produced.",
  },
  {
    slug: "boeing-787-dreamliner",
    name: "Boeing 787 Dreamliner",
    detail: "Boeing · USA",
    year: 2009,
    fact: "First commercial aircraft with over 50% composite materials. Cabin humidity is higher and cabin altitude is lower than any previous jet.",
  },
  {
    slug: "airbus-a350",
    name: "Airbus A350",
    detail: "Airbus · Europe",
    year: 2013,
    fact: "Curved titanium wingtips and a carbon fibre fuselage achieve 25% better fuel efficiency versus the aircraft it replaces.",
  },
  {
    slug: "airbus-a320",
    name: "Airbus A320",
    detail: "Airbus · Europe",
    year: 1987,
    fact: "First airliner with fly-by-wire and side-stick controllers. The A320 family remains the world's best-selling narrowbody jet.",
  },
  {
    slug: "embraer-e195-e2",
    name: "Embraer E195-E2",
    detail: "Embraer · Brazil",
    year: 2018,
    fact: "The 'Profit Hunter' — geared turbofan engines and an all-new wing make it the most efficient aircraft in the regional jet category.",
  },
  {
    slug: "boeing-737",
    name: "Boeing 737",
    detail: "Boeing · USA",
    year: 1967,
    fact: "The best-selling commercial jet in history with over 10,000 delivered. More 737s are in the air at any given moment than any other aircraft type.",
  },
  {
    slug: "boeing-757",
    name: "Boeing 757",
    detail: "Boeing · USA",
    year: 1982,
    fact: "The narrowbody that could do a widebody's job. Its high thrust-to-weight ratio made it the only single-aisle jet certified for ETOPS transoceanic routes.",
  },
  {
    slug: "airbus-a330",
    name: "Airbus A330",
    detail: "Airbus · Europe",
    year: 1992,
    fact: "The workhorse of long-haul aviation. Shares 95% commonality with the A340, allowing pilots to fly both types on a single licence — slashing airline training costs.",
  },
  {
    slug: "boeing-707",
    name: "Boeing 707",
    detail: "Boeing · USA",
    year: 1957,
    active: false,
    fact: "The jet that started it all. The 707 made transatlantic air travel viable for ordinary passengers, cutting the New York–London crossing from days to hours.",
  },
  {
    slug: "airbus-a220",
    name: "Airbus A220",
    detail: "Airbus / Bombardier · Canada",
    year: 2016,
    fact: "Originally the Bombardier C Series — acquired by Airbus after a trade dispute. Its advanced wing and geared turbofan make it 20% more efficient than jets it replaces.",
  },
  {
    slug: "douglas-dc-3",
    name: "Douglas DC-3",
    detail: "Douglas Aircraft · USA",
    year: 1935,
    active: false,
    fact: "The aircraft that made airlines profitable. By 1939 the DC-3 carried 90% of the world's airline traffic — and thousands still fly commercially today, nearly 90 years on.",
  },
  {
    slug: "boeing-727",
    name: "Boeing 727",
    detail: "Boeing · USA",
    year: 1963,
    active: false,
    fact: "The first jetliner to carry 100 million passengers. Its three rear-mounted engines and high-lift wing allowed operations from shorter runways that widened access to air travel.",
  },
  {
    slug: "airbus-a340",
    name: "Airbus A340",
    detail: "Airbus · Europe",
    year: 1991,
    fact: "Four engines meant it could fly any route without ETOPS restrictions. Singapore Airlines used it for the world's longest non-stop flights — 18 hours, 45 minutes.",
  },
  {
    slug: "tupolev-tu-144",
    name: "Tupolev Tu-144",
    detail: "Tupolev · Soviet Union",
    year: 1968,
    active: false,
    fact: "The world's first supersonic airliner, beating Concorde to flight by three months. Known as 'Concordski', it flew Mach 2.15 — but was retired after just 55 passenger flights.",
  },
]

export const fighterJets: Aircraft[] = [
  {
    slug: "f-22-raptor",
    name: "F-22 Raptor",
    detail: "USA · Lockheed Martin",
    year: 2005,
    mach: 2.25,
    fact: "The world's pre-eminent air superiority fighter. Supercruise allows Mach 1.5+ flight without afterburner — and enemy radar sees nothing.",
  },
  {
    slug: "f-35-lightning-ii",
    name: "F-35 Lightning II",
    detail: "USA · Lockheed Martin",
    year: 2015,
    mach: 1.6,
    fact: "The most expensive defence programme in history. Its helmet projects a 360° camera feed — the pilot can effectively see through the aircraft floor.",
    image: "/planes/f35.png",
  },
  {
    slug: "sukhoi-su-57",
    name: "Sukhoi Su-57 Felon",
    detail: "Russia · Sukhoi",
    year: 2020,
    mach: 2.0,
    fact: "Russia's first 5th-gen stealth fighter with 3D thrust-vectoring nozzles — enabling manoeuvres physically impossible for any other jet.",
  },
  {
    slug: "eurofighter-typhoon",
    name: "Eurofighter Typhoon",
    detail: "UK / Germany / Italy / Spain",
    year: 2003,
    mach: 2.0,
    fact: "A four-nation collaboration. Its unstable canard-delta design generates extreme lift, making it one of the most agile fighters ever built.",
  },
  {
    slug: "dassault-rafale",
    name: "Dassault Rafale",
    detail: "France · Dassault Aviation",
    year: 2001,
    mach: 1.8,
    fact: "France's omnirole 4.5-gen fighter. The SPECTRA EW suite can jam incoming missiles and generate false radar signatures autonomously.",
  },
  {
    slug: "fa-18-super-hornet",
    name: "F/A-18E Super Hornet",
    detail: "USA · Boeing",
    year: 1999,
    mach: 1.8,
    fact: "The US Navy's primary strike fighter — it can refuel allied jets mid-air, then arrest onto a carrier deck at 150mph using a tailhook.",
  },
  {
    slug: "sr-71-blackbird",
    name: "SR-71 Blackbird",
    detail: "USA · Lockheed Skunk Works",
    year: 1966,
    mach: 3.3,
    fact: "The fastest air-breathing manned aircraft ever built. At Mach 3.3 it outran every missile ever fired at it — the standard evasive manoeuvre was simply to accelerate.",
  },
  {
    slug: "f-14-tomcat",
    name: "F-14 Tomcat",
    detail: "USA · Grumman",
    year: 1974,
    mach: 2.34,
    fact: "The variable-sweep wing icon of Top Gun. Its AWG-9 radar could track 24 targets simultaneously and engage 6 at once — unmatched in 1974.",
  },
  {
    slug: "f-15-eagle",
    name: "F-15 Eagle",
    detail: "USA · McDonnell Douglas",
    year: 1976,
    mach: 2.5,
    fact: "Undefeated in air-to-air combat with over 100 kills and zero losses. Its thrust-to-weight ratio exceeds 1 — it can accelerate straight up.",
  },
  {
    slug: "f-16-fighting-falcon",
    name: "F-16 Fighting Falcon",
    detail: "USA · General Dynamics",
    year: 1978,
    mach: 2.05,
    fact: "The first production fly-by-wire fighter. Intentionally aerodynamically unstable — a computer fires the control surfaces 40 times per second to keep it airborne.",
  },
  {
    slug: "f-117-nighthawk",
    name: "F-117 Nighthawk",
    detail: "USA · Lockheed Skunk Works",
    year: 1983,
    mach: 0.92,
    fact: "The world's first operational stealth aircraft. Its faceted angular skin was designed by a computer to scatter radar — making an aircraft the size of a fighter invisible.",
  },
  {
    slug: "mig-29-fulcrum",
    name: "MiG-29 Fulcrum",
    mach: 2.25,
    detail: "Russia · Mikoyan",
    year: 1983,
    fact: "Its helmet-mounted sight lets pilots fire missiles simply by looking at a target — a revelation that shocked Western intelligence when uncovered.",
  },
]

export const engines: Aircraft[] = [
  {
    slug: "ge90-115b",
    name: "GE90-115B",
    detail: "GE Aviation · High-bypass turbofan",
    year: 1995,
    fact: "The world's most powerful commercial jet engine at 115,000 lbf of thrust — it could lift a fully loaded 747 on its own.",
  },
  {
    slug: "rolls-royce-trent-xwb",
    name: "Trent XWB-97",
    detail: "Rolls-Royce · High-bypass turbofan",
    year: 2014,
    fact: "The world's most efficient large aero engine. Powers the A350-1000 and burns 25% less fuel per seat than the jets it replaces.",
  },
  {
    slug: "cfm-leap-1a",
    name: "CFM LEAP-1A",
    detail: "CFM International · High-bypass turbofan",
    year: 2016,
    fact: "The most ordered jet engine in history. Its 3D-woven carbon fibre fan blades and ceramic matrix combustor deliver a 15% fuel saving over the CFM56.",
  },
  {
    slug: "ge9x",
    name: "GE9X-105B1A",
    detail: "GE Aviation · High-bypass turbofan",
    year: 2018,
    fact: "Powers the Boeing 777X with the largest fan diameter of any commercial engine at 134 inches — wider than the fuselage of a 737.",
  },
  {
    slug: "pw-f135",
    name: "Pratt & Whitney F135",
    detail: "Pratt & Whitney · Low-bypass afterburning turbofan",
    year: 2006,
    fact: "The most powerful fighter engine ever built at 43,000 lbf with afterburner. Its lift-fan variant enables the F-35B to hover and land vertically.",
  },
  {
    slug: "olympus-593",
    name: "Olympus 593",
    detail: "Rolls-Royce / Snecma · Turbojet",
    year: 1966,
    fact: "Concorde's engine. At Mach 2 the intake air reached 127°C before combustion even began — the engine itself became a heat exchanger.",
  },
  {
    slug: "ge-f110",
    name: "GE F110-GE-129",
    detail: "GE Aviation · Low-bypass afterburning turbofan",
    year: 1984,
    fact: "Produces 29,500 lbf with afterburner in the F-16 Block 50 — giving a thrust-to-weight ratio greater than 1, enabling a vertical climb from a standing start.",
  },
]
