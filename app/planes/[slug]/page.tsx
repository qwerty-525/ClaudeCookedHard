import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { commercialPlanes, engines } from "@/lib/data"
import ConcordeVideoPlayer from "@/components/ConcordeVideoPlayer"
import ChipLinks from "@/components/ChipLinks"
import { renderBold } from "@/lib/text"

export function generateStaticParams() {
  return commercialPlanes.map((p) => ({ slug: p.slug }))
}

export default async function PlaneDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const plane = commercialPlanes.find((p) => p.slug === slug)
  if (!plane) notFound()

  const isConcorde = slug === "concorde"
  const relatedEngines = engines.filter((e) => plane.relatedEngines?.includes(e.slug))
  const isSupersonic = slug === "concorde" || slug === "tupolev-tu-144"

  return (
    <main className="min-h-screen bg-[#0b0b10] text-[#f8fafc]">
      {/* Full-screen video hero for Concorde */}
      {isConcorde && (
        <ConcordeVideoPlayer
          detail={plane.detail}
          name={plane.name}
          year={plane.year}
        />
      )}

      <div className="px-6 pb-24 pt-28 md:px-12 lg:px-24">
        <div className="avia-detail-shell mx-auto max-w-4xl rounded-[32px] p-7 md:p-10">
          {/* Back */}
          <Link
            href="/"
            className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Commercial Airliners
          </Link>

          {/* Header — hidden for Concorde since it's overlaid on the video */}
          {!isConcorde && (
            <>
              <p className="text-xs tracking-[0.4em] text-[#3b82f6] uppercase mb-4 font-medium">
                {plane.detail}
              </p>
              <h1 className="mb-3 text-5xl font-bold md:text-6xl">{plane.name}</h1>
              <p className="mb-10 text-sm uppercase tracking-[0.24em] text-[#94a3b8]">First flight · {plane.year}</p>
            </>
          )}

          {/* Concorde: just show name/year below the video for scroll context */}
          {isConcorde && (
            <div className="mb-10">
              <p className="text-xs tracking-[0.4em] text-[#3b82f6] uppercase mb-4 font-medium">
                {plane.detail}
              </p>
              <h1 className="mb-3 text-5xl font-bold md:text-6xl">{plane.name}</h1>
              <p className="text-sm uppercase tracking-[0.24em] text-[#94a3b8]">First flight · {plane.year}</p>
            </div>
          )}

          {/* Image */}
          {plane.image && (
            <div className="relative mb-10 h-64 w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/20 md:h-80">
              <Image src={plane.image} alt={plane.name} fill className="object-contain p-6" />
            </div>
          )}

          {/* Quick fact */}
          <div className="mb-10 rounded-[28px] border border-[#3b82f6]/20 bg-[#3b82f6]/10 p-6">
            <p className="text-xs tracking-widest text-[#3b82f6] uppercase mb-2">Key Fact</p>
            <p className="text-[#f8fafc] leading-relaxed">{plane.fact}</p>
          </div>

          {/* At a glance */}
          {plane.highlights && plane.highlights.length > 0 && (
            <div className="mb-10 rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-6 md:p-7">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">At a Glance</p>
              <ul className="grid gap-3 md:grid-cols-2">
                {plane.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#3b82f6]" />
                    <span className="text-sm leading-7 text-[#b8c7dc]">{renderBold(h)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Overview */}
          {plane.description && (
            <div className="mb-12">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">Overview</p>
              {plane.description.split("\n\n").map((para, i) => (
                <p key={i} className="mb-5 leading-8 text-[#b8c7dc] last:mb-0">
                  {renderBold(para)}
                </p>
              ))}
            </div>
          )}

          {/* Engineering Features */}
          {plane.engineeringFeatures && plane.engineeringFeatures.length > 0 && (
            <div className="mb-12">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">Engineering</p>
              <div className="flex flex-col gap-4">
                {plane.engineeringFeatures.map((feature, i) => (
                  <div key={feature.title} className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e0e16] p-6">
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                      style={{ background: "linear-gradient(to bottom, #3b82f6cc, #3b82f600)" }}
                    />
                    <span className="mb-3 inline-block font-mono text-[10px] tracking-[0.3em] text-[#3b82f6]/60 uppercase">
                      Feature {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-7 text-[#94a3b8]">{feature.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications */}
          {plane.specs && plane.specs.length > 0 && (
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">Specifications</p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {plane.specs.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#94a3b8]">{s.label}</p>
                    <p className="font-medium">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!plane.description && !plane.engineeringFeatures && (
            <div className="rounded-[28px] border border-dashed border-[#1e293b] p-10 text-center text-[#94a3b8]">
              <p className="text-sm">More information coming soon.</p>
            </div>
          )}

          {/* Cross-links */}
          <div className="mt-12 flex flex-col gap-8 border-t border-white/[0.06] pt-10">
            {relatedEngines.length > 0 && (
              <ChipLinks
                kicker="Powerplants in the Catalog"
                chips={relatedEngines.map((e) => ({
                  href: `/engines/${e.slug}`,
                  label: e.name,
                  sub: e.detail.split(" · ")[1] ?? e.detail,
                  accent: "#f59e0b",
                }))}
              />
            )}
            <ChipLinks
              kicker="Theory Behind This Aircraft"
              chips={[
                { href: "/aerodynamics#wing", label: "Wing Geometry", sub: "AR, sweep, wing loading", accent: "#22d3ee" },
                { href: "/aerodynamics#high-lift", label: "High-Lift Systems", sub: "flaps, slats, approach speed", accent: "#22d3ee" },
                ...(isSupersonic
                  ? [
                      { href: "/gas-dynamics#inlets", label: "Supersonic Inlets", sub: "shock trains & ram recovery", accent: "#fb923c" },
                      { href: "/aerodynamics#vortex", label: "Vortex Lift", sub: "the delta wing's second lift", accent: "#22d3ee" },
                    ]
                  : [{ href: "/thermodynamics#propulsion", label: "Propulsion", sub: "TSFC & the range equation", accent: "#34d399" }]),
              ]}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
