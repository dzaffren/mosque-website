import React from 'react'
import './globals.css'

export const metadata = {
  description: 'A community mosque website',
  title: 'Masjid Al-Iman',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
