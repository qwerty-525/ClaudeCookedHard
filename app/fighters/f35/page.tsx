import F35Scroll from "@/components/F35Scroll"

export const metadata = {
  title: "F-35 Lightning II — AVIA",
  description: "A scrollytelling experience about the F-35 Lightning II.",
}

export default function F35ScrollPage() {
  return (
    <main className="bg-[#04060a]">
      <F35Scroll />

      <div className="flex items-center justify-center py-16 bg-[#04060a]">
        <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
          AVIA · Aviation Encyclopedia
        </p>
      </div>
    </main>
  )
}
