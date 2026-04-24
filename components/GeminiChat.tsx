"use client"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"

const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY

type Message = { role: "user" | "model"; text: string }

function getContext(pathname: string): string {
  if (pathname.startsWith("/planes/")) {
    return pathname.replace("/planes/", "").replace(/-/g, " ")
  }
  if (pathname.startsWith("/fighters/")) {
    return pathname.replace("/fighters/", "").replace(/-/g, " ")
  }
  if (pathname.startsWith("/engines/")) {
    return pathname.replace("/engines/", "").replace(/-/g, " ")
  }
  if (pathname === "/fighters") return "fighter jets"
  if (pathname === "/engines") return "jet engines"
  return "commercial airliners"
}

export default function GeminiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  const context = getContext(pathname)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading || !GEMINI_KEY) return
    setInput("")
    const next: Message[] = [...messages, { role: "user", text }]
    setMessages(next)
    setLoading(true)
    try {
      const systemInstruction = `You are an aviation encyclopedia assistant embedded in AVIA. The user is currently reading about ${context}. Answer aviation questions concisely and accurately. Keep responses under 200 words unless more detail is needed.`
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: next.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
          }),
        }
      )
      const data = await res.json()
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, no response."
      setMessages([...next, { role: "model", text: reply }])
    } catch {
      setMessages([...next, { role: "model", text: "Something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d0d15] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          style={{ width: 320, height: 440 }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-white/[0.07] bg-[#090912] px-4 py-3">
            <GeminiIcon size={18} />
            <span className="text-sm font-semibold text-white">Gemini</span>
            <span className="ml-1 truncate text-[10px] text-[#94a3b8]">· {context}</span>
            <button
              onClick={() => setOpen(false)}
              className="ml-auto shrink-0 text-[#94a3b8] transition-colors hover:text-white"
              aria-label="Close"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M1 1l11 11M12 1L1 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-3">
            {messages.length === 0 && (
              <p className="mt-6 text-center text-xs text-[#94a3b8]">
                Ask anything about {context}.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "border border-[#3b82f6]/25 bg-[#3b82f6]/15 text-white"
                      : "border border-white/[0.07] bg-white/[0.04] text-[#b8c7dc]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="h-1 w-1 animate-bounce rounded-full bg-[#94a3b8]"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.07] p-3">
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="flex gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about aviation…"
                className="flex-1 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder-[#94a3b8] focus:border-white/20 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading || !GEMINI_KEY}
                className="rounded-lg border border-[#3b82f6]/25 bg-[#3b82f6]/15 px-3 py-2 text-[#7dd3fc] transition-colors hover:bg-[#3b82f6]/25 disabled:opacity-40"
                aria-label="Send"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            {!GEMINI_KEY && (
              <p className="mt-1.5 text-[10px] text-red-400/70">
                NEXT_PUBLIC_GEMINI_KEY not set.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center rounded-full border border-white/[0.12] bg-[#0d0d15] shadow-lg transition-all duration-200 hover:border-white/[0.22] hover:scale-105"
        style={{ width: 52, height: 52 }}
        aria-label="Open Gemini assistant"
      >
        <GeminiIcon size={26} />
      </button>
    </div>
  )
}

function GeminiIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="gem-g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9b72f8" />
          <stop offset="100%" stopColor="#EA4335" />
        </linearGradient>
      </defs>
      <path
        d="M12 2C12 7.523 7.523 12 2 12C7.523 12 12 16.477 12 22C12 16.477 16.477 12 22 12C16.477 12 12 7.523 12 2Z"
        fill="url(#gem-g)"
      />
    </svg>
  )
}
