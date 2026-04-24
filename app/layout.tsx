import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Nav from "@/components/Nav"
import { PageTransitionProvider } from "@/components/PageTransitionOverlay"
import GeminiChat from "@/components/GeminiChat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AVIA — Aviation Encyclopedia",
  description: "Explore the icons of aviation history",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0b0b10] text-[#f8fafc] antialiased`}>
        <PageTransitionProvider>
          <Nav />
          {children}
          <GeminiChat />
        </PageTransitionProvider>
      </body>
    </html>
  )
}
