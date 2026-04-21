import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { commercialPlanes } from "@/lib/data"
import ConcordeVideoPlayer from "@/components/ConcordeVideoPlayer"

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

      <div className="pt-28 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors mb-12"
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
              <h1 className="text-5xl md:text-6xl font-bold mb-3">{plane.name}</h1>
              <p className="text-[#94a3b8] text-sm mb-10">First flight · {plane.year}</p>
            </>
          )}

          {/* Concorde: just show name/year below the video for scroll context */}
          {isConcorde && (
            <div className="mb-10">
              <p className="text-xs tracking-[0.4em] text-[#3b82f6] uppercase mb-4 font-medium">
                {plane.detail}
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-3">{plane.name}</h1>
              <p className="text-[#94a3b8] text-sm">First flight · {plane.year}</p>
            </div>
          )}

          {/* Image */}
          {plane.image && (
            <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-10 border border-[#1e293b]">
              <Image src={plane.image} alt={plane.name} fill className="object-contain p-6" />
            </div>
          )}

          {/* Quick fact */}
          <div className="bg-[#232328] border border-[#1e293b] rounded-2xl p-6 mb-10">
            <p className="text-xs tracking-widest text-[#3b82f6] uppercase mb-2">Key Fact</p>
            <p className="text-[#f8fafc] leading-relaxed">{plane.fact}</p>
          </div>

          {/* Specs */}
          {plane.specs && plane.specs.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-3">
                {plane.specs.map((s) => (
                  <div key={s.label} className="bg-[#232328] border border-[#1e293b] rounded-xl p-4">
                    <p className="text-xs text-[#94a3b8] mb-1">{s.label}</p>
                    <p className="font-medium">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {plane.description ? (
            <div className="prose prose-invert max-w-none">
              <p className="text-[#94a3b8] leading-relaxed">{plane.description}</p>
            </div>
          ) : (
            <div className="border border-dashed border-[#1e293b] rounded-2xl p-10 text-center text-[#94a3b8]">
              <p className="text-sm">More information coming soon.</p>
              <p className="text-xs mt-2 opacity-60">
                Add <code className="text-[#3b82f6]">description</code> and <code className="text-[#3b82f6]">specs</code> fields in <code className="text-[#3b82f6]">lib/data.ts</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
