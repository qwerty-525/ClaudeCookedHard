import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { fighterJets, engines } from "@/lib/data"
import SR71VideoPlayer from "@/components/SR71VideoPlayer"
import ChipLinks from "@/components/ChipLinks"

const REDIRECTED_SLUGS: Record<string, string> = {
  "f-35-lightning-ii": "/fighters/f35",
  "f-117-nighthawk": "/fighters/f117",
}

export function generateStaticParams() {
  return fighterJets
    .filter((j) => !(j.slug in REDIRECTED_SLUGS))
    .map((j) => ({ slug: j.slug }))
}

export default async function FighterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (REDIRECTED_SLUGS[slug]) redirect(REDIRECTED_SLUGS[slug])
  const jet = fighterJets.find((j) => j.slug === slug)
  if (!jet) notFound()

  const isSR71 = slug === "sr-71-blackbird"
  const relatedEngines = engines.filter((e) => jet.relatedEngines?.includes(e.slug))

  return (
    <main className="min-h-screen bg-[#04060a] text-[#f8fafc]">
      {isSR71 && <SR71VideoPlayer detail={jet.detail} name={jet.name} year={jet.year} />}
      <div className="px-6 pb-24 pt-28 md:px-12 lg:px-24">
        <div className="avia-detail-shell mx-auto max-w-4xl rounded-[32px] p-7 md:p-10">

          {/* Back */}
          <Link
            href="/fighters"
            className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Fighter Jets
          </Link>

          {/* Header */}
          <p className="text-xs tracking-[0.4em] text-red-400 uppercase mb-4 font-medium">{jet.detail}</p>
          <h1 className="mb-3 text-5xl font-bold md:text-6xl">{jet.name}</h1>
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <span className="text-sm uppercase tracking-[0.24em] text-[#94a3b8]">
              Entered service · {jet.year}
            </span>
            {jet.mach && (
              <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-mono text-[#94a3b8]">
                Mach {jet.mach}
              </span>
            )}
            {jet.role && jet.roleColor && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em]"
                style={{ borderColor: `${jet.roleColor}40`, backgroundColor: `${jet.roleColor}12`, color: jet.roleColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: jet.roleColor, boxShadow: `0 0 5px ${jet.roleColor}bb` }} />
                {jet.role}
              </span>
            )}
          </div>

          {/* Image */}
          {jet.image && (
            <div className="relative mb-10 h-64 w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/20 md:h-80">
              <Image src={jet.image} alt={jet.name} fill className="object-contain p-6" />
            </div>
          )}

          {/* Key fact */}
          <div className="mb-10 rounded-[28px] border border-red-400/18 bg-red-400/[0.07] p-6">
            <p className="text-xs tracking-widest text-red-400 uppercase mb-2">Key Fact</p>
            <p className="text-[#f8fafc] leading-relaxed">{jet.fact}</p>
          </div>

          {/* Summary / Overview */}
          {jet.description && (
            <div className="mb-12">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">Overview</p>
              <p className="whitespace-pre-line leading-8 text-[#b8c7dc]">{jet.description}</p>
            </div>
          )}

          {/* Engineering Features */}
          {jet.engineeringFeatures && jet.engineeringFeatures.length > 0 && (
            <div className="mb-12">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
                Engineering
              </p>
              <div className="flex flex-col gap-4">
                {jet.engineeringFeatures.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e0e16] p-6"
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
                      style={{ background: `linear-gradient(to bottom, #ef4444cc, #ef444400)` }}
                    />
                    {/* Feature number */}
                    <span className="mb-3 inline-block font-mono text-[10px] tracking-[0.3em] text-red-400/60 uppercase">
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
          {jet.specs && jet.specs.length > 0 && (
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
                Specifications
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {jet.specs.map((s) => (
                  <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                    <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#94a3b8]">{s.label}</p>
                    <p className="font-medium">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback */}
          {!jet.description && !jet.engineeringFeatures && (
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
                { href: "/aerodynamics#performance", label: "Turn & Energy", sub: "Ps, corner speed, load factor", accent: "#22d3ee" },
                { href: "/aerodynamics#stability", label: "Stability & FBW", sub: "static margin, relaxed stability", accent: "#22d3ee" },
                { href: "/gas-dynamics#inlets", label: "Supersonic Inlets", sub: "recovery, unstart, ramjets", accent: "#fb923c" },
              ]}
            />
          </div>

        </div>
      </div>
    </main>
  )
}
