"use client"
import Link from "next/link"
import DropBombSection from "@/components/DropBombSection"
import PlaneCard from "@/components/PlaneCard"
import MachScale from "@/components/MachScale"
import DogfightCarousel from "@/components/DogfightCarousel"
import FightersSnapScroll from "@/components/FightersSnapScroll"
import SpecTable from "@/components/SpecTable"
import ChipLinks from "@/components/ChipLinks"
import { fighterJets } from "@/lib/data"

export default function FightersPage() {
  const featuredJets = fighterJets.slice(0, 3)

  return (
    <main className="bg-[#04060a]">
      {/* 5-frame snap-scroll showcase: Hero (F-35 video) · F-35 · B-2 (video) · F-117 · SR-71 */}
      <FightersSnapScroll />

      <section className="relative border-y border-white/[0.06] bg-[#12090b]">
        <div className="avia-grid absolute inset-0 opacity-15" />
        <div className="relative mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[1.35fr_0.85fr] md:px-12 lg:px-24">
          <div className="avia-panel rounded-[28px] p-7 md:p-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#f87171]">
              Threat Profile
            </p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-white md:text-4xl">
              Speed, stealth, and overmatch should read like three different design religions.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#94a3b8] md:text-base">
              This section works best when it feels severe and deliberate. The important part is not just spectacle, but
              the sense that every aircraft was built around a specific doctrine.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="#squadron"
                className="avia-pill-button inline-flex items-center gap-2 rounded-full border border-red-400/25 bg-red-400/12 px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:border-red-400/45 hover:bg-red-400/18"
              >
                View Squadron
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path d="M6.5 2v9M2 6.5l4.5 4.5L11 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

          <div className="avia-panel rounded-[28px] p-7">
            <p className="text-[10px] font-medium uppercase tracking-[0.45em] text-[#f59e0b]">
              Flight Deck
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {featuredJets.map((jet) => (
                <div key={jet.slug} className="rounded-2xl border border-white/[0.07] bg-black/20 px-3 py-4 text-center">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#fda4af]">{jet.year}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{jet.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Drop bomb scroll sequence → leads into F-35 explore */}
      <DropBombSection exploreHref="/fighters/f35" />

      {/* Mach speed scale */}
      <MachScale jets={fighterJets} />

      {/* Combat performance matrix */}
      <section className="relative border-y border-white/[0.05] bg-[#0d0709] px-6 py-24 md:px-12 lg:px-24">
        <SpecTable
          kicker="Performance Matrix"
          title="Energy, Turn, and Thrust."
          description="Thrust-to-weight above 1.0 means the aircraft can accelerate going straight up — the currency of energy manoeuvring. Wing loading (W/S) buys instantaneous turn rate at the cost of ride quality and range. Compare the F-16's light, low-drag energy-fighter numbers against the F-14's swing-wing compromise, or the F-22's ability to hold both columns at once."
          accent="#f87171"
          columns={["Aircraft", "Max Mach", "T/W*", "W/S (kg/m²)", "Ceiling (ft)", "Thrust w/ AB (lbf)", "Gen"]}
          rows={[
            ["F-22 Raptor", "2.25", "≈1.08", "375", "65,000", "2 × 35,000", "5th"],
            ["F-35A Lightning II", "1.6", "≈0.87", "526", "50,000", "1 × 43,000", "5th"],
            ["Su-57 Felon", "2.0", "≈1.02", "≈450", "66,000", "2 × 32,000", "5th"],
            ["Eurofighter Typhoon", "2.0", "≈1.15", "312", "65,000", "2 × 20,230", "4.5"],
            ["Dassault Rafale", "1.8", "≈0.99", "328", "50,000", "2 × 17,000", "4.5"],
            ["F/A-18E Super Hornet", "1.8", "≈0.93", "459", "50,000", "2 × 22,000", "4.5"],
            ["F-15 Eagle", "2.5", "≈1.07", "358", "65,000", "2 × 23,770", "4th"],
            ["F-16 Fighting Falcon", "2.05", "≈1.10", "431", "50,000", "1 × 29,500", "4th"],
            ["F-14 Tomcat", "2.34", "≈0.88", "466", "53,000", "2 × 27,800", "4th"],
            ["MiG-29 Fulcrum", "2.25", "≈1.09", "403", "59,000", "2 × 18,300", "4th"],
            ["JAS 39 Gripen", "2.0", "≈0.97", "336", "50,000", "1 × 18,100", "4.5"],
          ]}
          footnote="*Thrust-to-weight at ~50% internal fuel, air-to-air loadout — the standard comparison condition. W/S at loaded weight over reference wing area (delta and blended-body types read low because LERX/body lift is excluded). Values are representative open-source figures."
        />
        <div className="mx-auto mt-12 max-w-6xl">
          <ChipLinks
            kicker="The Theory Behind the Columns"
            chips={[
              { href: "/aerodynamics#performance", label: "Turn & Energy", sub: "Ps, corner speed, load factor", accent: "#22d3ee" },
              { href: "/aerodynamics#vortex", label: "Vortex Lift", sub: "LERX & delta high-α lift", accent: "#22d3ee" },
              { href: "/gas-dynamics#inlets", label: "Supersonic Inlets", sub: "recovery, unstart, ramjets", accent: "#fb923c" },
              { href: "/thermodynamics#propulsion", label: "Afterburning", sub: "why AB doubles TSFC", accent: "#34d399" },
            ]}
          />
        </div>
      </section>

      {/* Dogfight rivalry carousel */}
      <section className="relative px-6 pb-24 pt-10 md:px-12 lg:px-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="mx-auto max-w-6xl">
          <DogfightCarousel />
        </div>
      </section>

      {/* Squadron cards */}
      <section id="squadron" className="relative bg-[#0b0b10] px-6 pb-36 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.12),transparent_38%)]" />
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 pt-4">
            <p className="text-xs tracking-[0.4em] text-red-400 uppercase mb-4 font-medium">
              Icons of Air Combat
            </p>
            <h2 className="text-4xl font-bold">The Squadron</h2>
            <p className="text-[#94a3b8] mt-3 max-w-md leading-relaxed">
              From Cold War legends to 5th-generation stealth — the jets that redefined modern air power.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fighterJets.map((jet, i) => (
              <PlaneCard
                key={jet.name}
                href={
                  jet.slug === "f-35-lightning-ii"
                    ? "/fighters/f35"
                    : jet.slug === "f-117-nighthawk"
                    ? "/fighters/f117"
                    : `/fighters/${jet.slug}`
                }
                name={jet.name}
                detail={jet.detail}
                fact={jet.fact}
                year={jet.year}
                index={i}
                accent="#ef4444"
                image={jet.image}
                role={jet.role}
                roleColor={jet.roleColor}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
