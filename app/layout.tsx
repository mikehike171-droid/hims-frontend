"use client"

import './globals.css'
import { useEffect } from 'react'

import { LanguageProvider } from "@/i18n/LanguageContext";

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
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}