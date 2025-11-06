import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { NotificationCenter } from "@/components/notification-center"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <header className="border-b bg-card p-4">
          <div className="max-w-6xl mx-auto flex justify-end">
            <NotificationCenter />
          </div>
        </header>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
