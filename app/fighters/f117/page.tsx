import F117Scroll from "@/components/F117Scroll"

export const metadata = {
  title: "F-117 Nighthawk — AVIA",
  description: "A scrollytelling experience about the F-117 Nighthawk stealth aircraft.",
}

export default function F117ScrollPage() {
  return (
    <main className="bg-[#04060a]">
      <F117Scroll />

      <div className="flex items-center justify-center py-16 bg-[#04060a]">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
