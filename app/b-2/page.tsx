import Link from "next/link"
import ChipScroll from "@/components/ChipScroll"

export const metadata = {
  title: "B-2 Spirit — AVIA",
  description: "A scrollytelling experience about the B-2 Spirit stealth bomber.",
}

const overviewParagraphs = [
  "The B-2 Spirit is the most expensive aircraft ever built — a Cold War bomber designed to penetrate Soviet air defences carrying nuclear weapons that no one would see coming. Its flying-wing planform, perfected by Northrop after decades of cancelled prototypes, eliminated every vertical surface that could reflect radar back to a hostile emitter. The result is an aircraft that can be detected only at extreme close range, by very specific radar bands, and only briefly.",
  "Twenty-one airframes were built between 1988 and 2000. Each cost roughly $2.1 billion in 1997 dollars, factoring in development. Only one has ever been lost — Spirit of Kansas, in 2008, when moisture in the pitot tubes corrupted air-data readings on takeoff from Andersen AFB. The remaining fleet operates from Whiteman AFB, Missouri, and has flown from there to targets in Iraq, Yugoslavia, Afghanistan, and Libya — round-trip missions exceeding 30 hours, sustained only by aerial refuelling.",
]

const engineeringFeatures = [
  {
    title: "Flying-Wing Planform",
    body: "No tail. No fuselage. The entire aircraft is one continuous wing — a shape Jack Northrop pursued for forty years before computers could finally make it stable. Quadruple-redundant fly-by-wire flight controls, with the GLAS (Gust Load Alleviation System), correct hundreds of times per second to keep an aerodynamically marginal shape flying straight. Without computers, the B-2 simply could not stay airborne.",
  },
  {
    title: "Radar-Absorbent Material (RAM)",
    body: "The B-2's skin is a sandwich of carbon-fibre composites and ferrite-doped polymer absorbers, with edges treated using saw-tooth conductive tape to control diffraction. Maintenance requires a climate-controlled hangar — water trapped in the RAM coatings can degrade stealth performance, and re-application is a labour-intensive process that absorbs much of the aircraft's downtime.",
  },
  {
    title: "Buried Engines & Curved Inlets",
    body: "Four General Electric F118-GE-100 turbofans — derivatives of the F110 in the F-16, themselves descended from the B-1's F101 — sit deep within the wing, their compressor faces hidden from line-of-sight radar by S-shaped inlets. Exhaust passes through cooled, slot-shaped nozzles that suppress both the IR signature and the engine's thermal contrail.",
  },
  {
    title: "Conventional + Nuclear Payload",
    body: "Twin internal weapons bays carry up to 40,000 lb of ordnance — most famously the GBU-57 Massive Ordnance Penetrator (the 30,000 lb bunker-buster) and B61/B83 nuclear gravity bombs. Stealth is preserved by keeping every weapon internal until release; nothing hangs off the wings.",
  },
]

const specs = [
  { label: "Wingspan", value: "172 ft (52.4 m)" },
  { label: "Length", value: "69 ft (21.0 m)" },
  { label: "Engines", value: "4× General Electric F118-GE-100 turbofans" },
  { label: "Thrust", value: "4× 17,300 lbf (77 kN)" },
  { label: "Crew", value: "2 (pilot + mission commander)" },
  { label: "Range", value: "6,900 mi (11,100 km) unrefuelled" },
  { label: "Max takeoff weight", value: "336,500 lb (152,634 kg)" },
  { label: "Service ceiling", value: "50,000 ft (15,200 m)" },
  { label: "Built", value: "21 airframes (1988–2000)" },
  { label: "Unit cost", value: "~$2.1 billion (FY 1997)" },
]

export default function B2Page() {
  return (
    <main className="bg-[#050505]">
      <ChipScroll />

      {/* ── Detail sections (mirror of /fighters/[slug] layout) ───────────── */}
      <section className="relative bg-[#04060a] px-6 pt-20 pb-24 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.06),transparent_45%)]" />

        <div className="relative mx-auto max-w-4xl">
          {/* Header */}
          <Link
            href="/fighters"
            className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path
                d="M10 3L5 8l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Fighter Jets
          </Link>

          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-white/55">
            Northrop Grumman · USA
          </p>
          <h1 className="mb-3 text-5xl font-bold md:text-6xl">B-2 Spirit</h1>
          <div className="mb-12 flex flex-wrap items-center gap-3">
            <span className="text-sm uppercase tracking-[0.24em] text-[#94a3b8]">
              Entered service · 1997
            </span>
            <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-mono text-[#94a3b8]">
              Mach 0.95
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{ borderColor: "#94a3b840", backgroundColor: "#94a3b812", color: "#94a3b8" }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "#94a3b8", boxShadow: "0 0 5px #94a3b8bb" }}
              />
              Stealth Bomber
            </span>
          </div>

          {/* Key fact */}
          <div className="mb-12 rounded-[28px] border border-white/15 bg-white/[0.04] p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-white/55">Key Fact</p>
            <p className="leading-relaxed text-[#f8fafc]">
              At certain frequencies, the B-2's radar cross-section is roughly equivalent to a small bird — despite a 172 ft wingspan and 158-ton maximum takeoff weight.
            </p>
          </div>

          {/* Overview */}
          <div className="mb-14">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
              Overview
            </p>
            {overviewParagraphs.map((p, i) => (
              <p key={i} className="mb-5 leading-8 text-[#b8c7dc] last:mb-0">
                {p}
              </p>
            ))}
          </div>

          {/* Engineering */}
          <div className="mb-14">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
              Engineering
            </p>
            <div className="flex flex-col gap-4">
              {engineeringFeatures.map((feature, i) => (
                <div
                  key={feature.title}
                  className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e0e16] p-6"
                >
                  <div
                    className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-2xl"
                    style={{ background: "linear-gradient(to bottom, #cbd5e1cc, #cbd5e100)" }}
                  />
                  <span className="mb-3 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Feature {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm leading-7 text-[#94a3b8]">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
              Specifications
            </p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
                >
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#94a3b8]">{s.label}</p>
                  <p className="font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center bg-[#050505] py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/20">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
