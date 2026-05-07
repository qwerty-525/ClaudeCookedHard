"use client"
import Link from "next/link"
import DropBombSection from "@/components/DropBombSection"
import PlaneCard from "@/components/PlaneCard"
import MachScale from "@/components/MachScale"
import DogfightCarousel from "@/components/DogfightCarousel"
import FightersSnapScroll from "@/components/FightersSnapScroll"
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
