"use client"

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { LanguageProvider } from "@/i18n/LanguageContext";

const BookingSuccessModal = dynamic(() => import("@/components/BookingSuccessModal"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });
const AppointmentPopup = dynamic(() => import("@/components/AppointmentPopup"), { ssr: false });
const WhatsAppFloat = dynamic(() => import("@/components/WhatsAppFloat"), { ssr: false });
const SpecialOffer = dynamic(() => import("@/components/SpecialOffer"), { ssr: false });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminPage = pathname?.startsWith('/admin')

  useEffect(() => {
    // Initialize global 401 interceptor
    import('@/lib/apiClient')
  }, [])

  return (
    <body className={`font-sans text-slate-900 bg-slate-50 ${isAdminPage ? 'notranslate' : ''}`}>
      <LanguageProvider>
        {children}
        {!isAdminPage && (
          <>
            <BookingSuccessModal />
            <ChatWidget />
            <AppointmentPopup />
            <WhatsAppFloat />
            <SpecialOffer />
          </>
        )}
      </LanguageProvider>
    </body>
  )
}
