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
    <main className="min-h-screen bg-[#04060a] px-6 pb-24 pt-28 text-[#f8fafc] md:px-12 lg:px-24">
      <div className="avia-detail-shell mx-auto max-w-4xl rounded-[32px] p-7 md:p-10">
        <Link
          href="/engines"
          className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#94a3b8] transition-colors hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Engines
        </Link>

        <p className="text-xs tracking-[0.4em] text-amber-400 uppercase mb-4 font-medium">
          {engine.detail}
        </p>
        <h1 className="mb-3 text-5xl font-bold md:text-6xl">{engine.name}</h1>
        <p className="mb-10 text-sm uppercase tracking-[0.24em] text-[#94a3b8]">First run · {engine.year}</p>

        {engine.image && (
          <div className="relative mb-10 h-64 w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/20 md:h-80">
            <Image src={engine.image} alt={engine.name} fill className="object-contain p-6" />
          </div>
        )}

        <div className="mb-10 rounded-[28px] border border-amber-400/18 bg-amber-400/10 p-6">
          <p className="text-xs tracking-widest text-amber-400 uppercase mb-2">Key Fact</p>
          <p className="text-[#f8fafc] leading-relaxed">{engine.fact}</p>
        </div>

        {engine.specs && engine.specs.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {engine.specs.map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.18em] text-[#94a3b8]">{s.label}</p>
                  <p className="font-medium">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {engine.description ? (
          <p className="whitespace-pre-line leading-8 text-[#b8c7dc]">{engine.description}</p>
        ) : (
          <div className="rounded-[28px] border border-dashed border-[#1e293b] p-10 text-center text-[#94a3b8]">
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
