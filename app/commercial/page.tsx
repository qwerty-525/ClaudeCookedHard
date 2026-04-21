import CockpitScroll from "@/components/CockpitScroll"

export const metadata = {
  title: "Flight Deck — AVIA",
  description: "A scrollytelling experience inside the commercial aviation flight deck.",
}

export default function CockpitScrollPage() {
  return (
    <main className="bg-[#0b0b10]">
      <CockpitScroll />

      <div className="flex items-center justify-center py-16 bg-[#0b0b10]">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
