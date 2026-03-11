"use client"

import './globals.css'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize global 401 interceptor
    import('@/lib/apiClient')
  }, [])

  return (
    <html lang="en">
      <body className="font-sans">
        {children}
      </body>
    </html>
  )
}