import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "NuStack Builder POC",
  description: "AI-powered website builder proof of concept",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
