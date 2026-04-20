import ChipScroll from "@/components/ChipScroll"

export const metadata = {
  title: "B-2 Spirit — AVIA",
  description: "A scrollytelling experience about the B-2 Spirit stealth bomber.",
}

export default function ScrollytellingPage() {
  return (
    <main className="bg-[#050505]">
      <ChipScroll />

      {/* Footer */}
      <div className="flex items-center justify-center py-16 bg-[#050505]">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
