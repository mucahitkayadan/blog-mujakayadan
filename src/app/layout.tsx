import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
        {children}
      </body>
    </html>
  )
}
