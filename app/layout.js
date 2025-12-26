export const metadata = {
  title: 'NuStack Builder POC',
  description: 'AI-powered website builder proof of concept',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
