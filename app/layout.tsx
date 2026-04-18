"use client"

import './globals.css'
import { useEffect } from 'react'
import Script from 'next/script'

import { LanguageProvider } from "@/i18n/LanguageContext";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import ChatWidget from "@/components/ChatWidget";

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
      <head>
        <Script id="google-translate-config" strategy="beforeInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,te',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <style dangerouslySetInnerHTML={{ __html: `
          /* Hide Google Translate Banner and Attribution */
          .goog-te-banner-frame.skiptranslate, 
          .goog-te-gadget-icon, 
          .goog-te-gadget-simple img, 
          .goog-te-menu-value img,
          .goog-te-menu-value span:nth-child(2),
          .goog-te-menu-value span:nth-child(3),
          .skiptranslate > iframe,
          #google_translate_element {
            display: none !important;
          }

          /* Hide Hover Tooltips and Highlights */
          #goog-gt-tt, 
          .goog-gt-tt, 
          .goog-te-balloon-frame, 
          .goog-tooltip, 
          .goog-tooltip:hover {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          /* Prevent Google from adding highlight to hovered text */
          .goog-text-highlight {
            background-color: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }

          /* Fix body position after banner is hidden */
          body {
            top: 0px !important;
            position: static !important;
          }

          /* Ensure fonts don't change */
          font {
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
          }
        ` }} />
      </head>
      <body className="font-sans text-slate-900 bg-slate-50">
        <LanguageProvider>
          {children}
          <BookingSuccessModal />
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}