import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { fighterJets } from "@/lib/data"
import SR71VideoPlayer from "@/components/SR71VideoPlayer"

export function generateStaticParams() {
  return fighterJets.map((j) => ({ slug: j.slug }))
}

export default async function FighterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const jet = fighterJets.find((j) => j.slug === slug)
  if (!jet) notFound()

  const isSR71 = slug === "sr-71-blackbird"

  return (
    <main className="min-h-screen bg-[#04060a] text-[#f8fafc]">
      {isSR71 && <SR71VideoPlayer detail={jet.detail} name={jet.name} year={jet.year} />}
      <div className="pt-28 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/fighters"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Fighter Jets
        </Link>

        {/* Header */}
        <p className="text-xs tracking-[0.4em] text-red-400 uppercase mb-4 font-medium">
          {jet.detail}
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-3">{jet.name}</h1>
        <p className="text-[#94a3b8] text-sm mb-10">Entered service · {jet.year}</p>

        {/* Image */}
        {jet.image && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border border-[#1e293b]">
            <Image src={jet.image} alt={jet.name} fill className="object-contain p-6" />
          </div>
        )}

        {/* Quick fact */}
        <div className="bg-[#232328] border border-[#1e293b] rounded-2xl p-6 mb-10">
          <p className="text-xs tracking-widest text-red-400 uppercase mb-2">Key Fact</p>
          <p className="text-[#f8fafc] leading-relaxed">{jet.fact}</p>
        </div>

        {/* Specs */}
        {jet.specs && jet.specs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              {jet.specs.map((s) => (
                <div key={s.label} className="bg-[#232328] border border-[#1e293b] rounded-xl p-4">
                  <p className="text-xs text-[#94a3b8] mb-1">{s.label}</p>
                  <p className="font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {jet.description ? (
          <div className="prose prose-invert max-w-none">
            <p className="text-[#94a3b8] leading-relaxed">{jet.description}</p>
          </div>
        ) : (
          <div className="border border-dashed border-[#1e293b] rounded-2xl p-10 text-center text-[#94a3b8]">
            <p className="text-sm">More information coming soon.</p>
            <p className="text-xs mt-2 opacity-60">
              Add <code className="text-red-400">description</code> and <code className="text-red-400">specs</code> fields in <code className="text-red-400">lib/data.ts</code>
            </p>
          </div>
        )}
      </div>
      </div>
    </main>
  )
}
