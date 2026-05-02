import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import F35Scroll from "@/components/F35Scroll"
import { fighterJets } from "@/lib/data"

export const metadata = {
  title: "F-35 Lightning II — AVIA",
  description: "A scrollytelling experience about the F-35 Lightning II.",
}

export default function F35ScrollPage() {
  const jet = fighterJets.find((j) => j.slug === "f-35-lightning-ii")
  if (!jet) notFound()

  return (
    <main className="bg-[#04060a]">
      <F35Scroll />

      {/* ── F-35 detail content (mirrors /fighters/[slug]) ──────────────────── */}
      <section className="relative px-6 pt-20 pb-24 md:px-12 lg:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.06),transparent_45%)]" />

        <div className="relative mx-auto max-w-4xl">
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

          <p className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-red-400">
            {jet.detail}
          </p>
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
                style={{
                  borderColor: `${jet.roleColor}40`,
                  backgroundColor: `${jet.roleColor}12`,
                  color: jet.roleColor,
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: jet.roleColor, boxShadow: `0 0 5px ${jet.roleColor}bb` }}
                />
                {jet.role}
              </span>
            )}
          </div>

          {jet.image && (
            <div className="relative mb-10 h-64 w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-black/20 md:h-80">
              <Image src={jet.image} alt={jet.name} fill className="object-contain p-6" />
            </div>
          )}

          <div className="mb-10 rounded-[28px] border border-red-400/18 bg-red-400/[0.07] p-6">
            <p className="mb-2 text-xs uppercase tracking-widest text-red-400">Key Fact</p>
            <p className="leading-relaxed text-[#f8fafc]">{jet.fact}</p>
          </div>

          {jet.description && (
            <div className="mb-12">
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
                Overview
              </p>
              <p className="whitespace-pre-line leading-8 text-[#b8c7dc]">{jet.description}</p>
            </div>
          )}

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
                    <div
                      className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-2xl"
                      style={{ background: "linear-gradient(to bottom, #ef4444cc, #ef444400)" }}
                    />
                    <span className="mb-3 inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/60">
                      Feature {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                    <p className="text-sm leading-7 text-[#94a3b8]">{feature.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {jet.specs && jet.specs.length > 0 && (
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-[#94a3b8]">
                Specifications
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {jet.specs.map((s) => (
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
          )}
        </div>
      </section>

      <div className="flex items-center justify-center bg-[#04060a] py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-white/20">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
