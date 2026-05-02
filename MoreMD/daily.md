What was built

  - lib/aviationstack.ts:1 — types + fetcher for all 4 endpoints
  - lib/aviationstack-snapshot.json — committed snapshot, currently empty (placeholder until you run the script)
  - scripts/snapshot-aviationstack.mjs:1 — fills the snapshot from your API key (4 requests)
  - app/api/aviationstack/refresh/route.ts:1 — POST endpoint that calls AviationStack and writes back to the
  snapshot file in dev (returns 500 if no key)
  - components/FlightGlobe.tsx:1 — react-globe.gl with arcs (departures→arrivals), cyan airport nodes, amber
  pulsing live-tracked aircraft, auto-rotate
  - components/CommercialDashboard.tsx:1 — full-viewport hero: globe on the left, control panel on the right with
   v1/flights | v1/airports | v1/airlines | v1/airplanes tabs, monospace tables, live UTC clock, "REFRESH LIVE
  DATA · COST: 4 REQ" button with confirm modal
  - app/page.tsx — HorizonHeroSection swapped for CommercialDashboard; rest of the page (A380 fly-through,
  Concorde, fleet) untouched                                                                                     
  - .env.local.example, npm run snapshot script
                                                                                                                 
  To get data flowing                                                                                            
  
  1. Sign up at aviationstack.com → grab the free key                                                            
  2. cp .env.local.example .env.local and paste your key                                                       
  3. npm run snapshot (uses 4 of 100 monthly requests, writes the JSON)                                          
  4. npm run dev → globe and tables populate                                                                     
                                                                                                                 
  The "REFRESH LIVE DATA" button works the same way at runtime: it spends 4 requests, updates UI, and overwrites 
  the JSON file so the new snapshot is committed-ready. In production (GitHub Pages static export), the button 
  will fail with a network error because there's no API route — it's a dev-only refresh tool. If you want it to  
  be obviously dev-only in the UI, say so and I'll gate it behind process.env.NODE_ENV.                        

  About your 100/month budget                                                                                    
  
  - Plain page refreshes on localhost cost 0 requests — the snapshot is read from disk.                          
  - Each click of the LIVE REFRESH button costs 4 requests, with a confirm modal so you don't accidentally burn
  it.                                                                                                            
  - At 100/month you have ~25 refreshes total. Realistically you'll snapshot once at the start of the month, and
  only refresh when you actually want fresh data before deploying.                                               
                                                                                                               
  Want me to add a NEXT_PUBLIC_* flag to disable the refresh button in prod, or wire it to be                    
  visible-but-disabled with a "dev-only" tooltip?             


                                                                                                                   
⏺ All three changes verified working:                                                                            
                                                                                                                 
  Change: GitHub Pages = snapshot-only                                                                           
  Verification: npm run build succeeded; out/index.html contains STATIC SNAPSHOT instead of REFRESH LIVE DATA.   
  The                                                                                                            
    /api/aviationstack/refresh route is excluded from the static export by renaming it to route.dev.ts + a       
    pageExtensions config that only includes dev.ts in dev mode.                                                 
  ────────────────────────────────────────                                                                       
  Change: Control panel scrollable, fits one viewport                                                            
  Verification: <section> is lg:h-screen, inner flex is h-full, grid is lg:overflow-hidden, table area is min-h-0
                                                                                                                 
    overflow-y-auto — textbook flex+overflow scroll pattern. Mobile (<lg) falls back to natural page scroll so   
    nothing is cut off on small screens.                                                                      
  ────────────────────────────────────────                                                                       
  Change: Famous-only filter                                                                                   
  Verification: lib/famous.ts hardcodes 17 airports (JFK, LAX, ORD, LHR, CDG, FRA, AMS, SIN, HND, NRT, PVG, ICN, 
    HKG, DXB, DOH, MEL, SYD) + 15 airlines (SQ, BA, AF, LH, KL, QF, QR, EK, CX, NH, JL, KE, TG, AA, TK). Verified
                                                                                                                 
    end-to-end with a live API refresh: 100 raw flights → 16 famous-route flights, 100 random airplanes → 0    
  famous
     (this batch).

  About the 100/month limit:                                                                                     
  - Yes, max 100 records per endpoint per request on the free tier — you can't get more than 100 flights in one
  shot.                                                                                                          
  - I burned 4 of your requests during verification; the snapshot file now has real fresh data committed-ready.
  - Filtering happens client-side from those 100, so if AviationStack's random sample doesn't include enough     
  famous routes, you'd see fewer rows. Each refresh re-rolls the dice.                                           
  - The hardcoded FAMOUS_AIRPORTS always show in the airports tab and on the globe (with correct lat/lon)        
  regardless of what the API returned, because the data is baked into the code.                                  
                                                                                                                 
  Files changed:                                                
  - lib/famous.ts (new) — curated airports + airlines with lat/lon                                               
  - components/CommercialDashboard.tsx — filter logic, prod-mode pill, viewport-clamped layout, replaced         
  About the 100/month limit:
  - Yes, max 100 records per endpoint per request on the free tier — you can't get more than 100 flights in one
  shot.
  - I burned 4 of your requests during verification; the snapshot file now has real fresh data committed-ready.
  - Filtering happens client-side from those 100, so if AviationStack's random sample doesn't include enough
  famous routes, you'd see fewer rows. Each refresh re-rolls the dice.
  - The hardcoded FAMOUS_AIRPORTS always show in the airports tab and on the globe (with correct lat/lon)
  regardless of what the API returned, because the data is baked into the code.

  Files changed:
  - lib/famous.ts (new) — curated airports + airlines with lat/lon
  - components/CommercialDashboard.tsx — filter logic, prod-mode pill, viewport-clamped layout, replaced
  AirportsTable/AirlinesTable with FamousAirportsTable/FamousAirlinesTable
  - components/FlightGlobe.tsx — uses FAMOUS_AIRPORTS as authoritative coord lookup; seeds globe nodes with all
  17 famous airports
  - app/api/aviationstack/refresh/route.ts → renamed to route.dev.ts
  - next.config.ts — added pageExtensions switch
  - lib/aviationstack-snapshot.json — now contains real live data from your refresh

  The deployed GitHub Pages site will display whatever's in lib/aviationstack-snapshot.json at commit time. So
  your workflow is: locally npm run dev, click REFRESH LIVE DATA when you want fresh data, commit the JSON, push
  → Pages rebuilds with the new snapshot.                                                 
                                                                    
 Final verification — all green:                                                                                
                                                                                                                 
  ┌───────────────────────────────┬──────────────────────────────────────────────────────────────────────────┐   
  │             Check             │                                  Result                                  │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Type-check (new files)        │ Clean — 0 errors                                                         │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤ 
  │ Snapshot file                 │ 100/100/100/100 rows, fetched 2026-05-01T07:13:15Z                       │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Famous-filter hit rate        │ 16/100 flights match (UA7674, NH5494, AI8262, QR5157, DL9388 …)          │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Static export out/index.html  │ Contains live flight rows (UA7674, NH5494, etc.), counts = 16/17/15/0    │ 
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Refresh button in prod HTML   │ 0 occurrences ✓                                                          │ 
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ STATIC SNAPSHOT · READ-ONLY   │ 1 occurrence ✓                                                           │ 
  │ pill in prod                  │                                                                          │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤
  │ out/api/ directory            │ Does not exist — API route correctly stripped from static export         │   
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤ 
  │ Layout CSS in HTML            │ lg:h-screen, min-h-0, overflow-y-auto all present — control panel will   │   
  │                               │ scroll within one viewport on desktop                                    │
  ├───────────────────────────────┼──────────────────────────────────────────────────────────────────────────┤   
  │ Dev mode route.dev.ts         │ API route still mounts in dev (verified by live response with real data) │ 
  └───────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘   
                                                                                                               
  Final state of the system:                                                                                     
                                                                                                               
  - Local dev (npm run dev): full dashboard with REFRESH LIVE DATA button + confirm modal. Refresh button calls  
  /api/aviationstack/refresh → AviationStack → writes new snapshot to lib/aviationstack-snapshot.json. Each click
   costs 4 of your 100 monthly requests.                                                                         
  - GitHub Pages prod (npm run build → out/): same UI, but the refresh button is replaced by a STATIC SNAPSHOT · 
  READ-ONLY pill. The page reads only from the JSON committed to the repo. Zero API requests at runtime.         
  - Famous filter: 17 hardcoded airports, 15 hardcoded airlines (lib/famous.ts:1) — these always render with
  correct lat/lon. Flights and airplanes from the API are filtered to those involving a famous airport or        
  airline.                                                                                                     
  - Layout: lg:h-screen on the section + min-h-0 overflow-y-auto on the table area = control panel scrolls       
  internally; the hero never extends past the first viewport on desktop. Mobile falls back to natural page       
  scroll.
                                                                                                                 
  Quota burn this session: 4 requests (the live refresh I triggered during verification). You have ~96 left for  
  the month, and the snapshot now sitting in lib/aviationstack-snapshot.json is real data ready to commit and
  deploy.                                                                       