import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { engines } from "@/lib/data"

export function generateStaticParams() {
  return engines.map((e) => ({ slug: e.slug }))
}

export default async function EngineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const engine = engines.find((e) => e.slug === slug)
  if (!engine) notFound()

  return (
    <main className="min-h-screen bg-[#04060a] text-[#f8fafc] pt-28 pb-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/engines"
          className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-12"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Engines
        </Link>

        <p className="text-xs tracking-[0.4em] text-amber-400 uppercase mb-4 font-medium">
          {engine.detail}
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-3">{engine.name}</h1>
        <p className="text-[#94a3b8] text-sm mb-10">First run · {engine.year}</p>

        {engine.image && (
          <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border border-[#1e293b]">
            <Image src={engine.image} alt={engine.name} fill className="object-contain p-6" />
          </div>
        )}

        <div className="bg-[#232328] border border-[#1e293b] rounded-2xl p-6 mb-10">
          <p className="text-xs tracking-widest text-amber-400 uppercase mb-2">Key Fact</p>
          <p className="text-[#f8fafc] leading-relaxed">{engine.fact}</p>
        </div>

        {engine.specs && engine.specs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-3">
              {engine.specs.map((s) => (
                <div key={s.label} className="bg-[#232328] border border-[#1e293b] rounded-xl p-4">
                  <p className="text-xs text-[#94a3b8] mb-1">{s.label}</p>
                  <p className="font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {engine.description ? (
          <p className="text-[#94a3b8] leading-relaxed">{engine.description}</p>
        ) : (
          <div className="border border-dashed border-[#1e293b] rounded-2xl p-10 text-center text-[#94a3b8]">
            <p className="text-sm">More information coming soon.</p>
            <p className="text-xs mt-2 opacity-60">
              Add <code className="text-amber-400">description</code> and <code className="text-amber-400">specs</code> in <code className="text-amber-400">lib/data.ts</code>
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
