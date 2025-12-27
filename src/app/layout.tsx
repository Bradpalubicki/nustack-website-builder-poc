import type { Metadata } from "next"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
