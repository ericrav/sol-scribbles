import './globals.css'
import type { Metadata } from 'next'
import { Schibsted_Grotesk } from 'next/font/google'

const font = Schibsted_Grotesk({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sol LeWitt Scribbles',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}
