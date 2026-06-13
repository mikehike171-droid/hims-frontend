import './globals.css'
import Script from 'next/script'
import ClientLayout from './ClientLayout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.unicarehomeopathy.com'),
  title: {
    default: 'UniCare Homeopathy | Holistic Healing & Constitutional Treatment',
    template: '%s | UniCare Homeopathy',
  },
  description: 'UniCare Homeopathy offers personalized, constitutional homeopathic healthcare. Book appointments, read wellness articles, and treat chronic diseases naturally.',
  keywords: [
    'homeopathy',
    'holistic healthcare',
    'constitutional treatment',
    'doctor appointment',
    'chronic diseases',
    'natural medicine',
    'homeopathic clinic',
    'UniCare Homeopathy',
  ],
  authors: [{ name: 'UniCare Homeopathy' }],
  creator: 'UniCare Homeopathy',
  publisher: 'UniCare Homeopathy',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UniCare Homeopathy | Holistic Healing & Constitutional Treatment',
    description: 'Expert constitutional homeopathic treatment for chronic and acute ailments. Natural healing tailored to your health profile.',
    url: 'https://www.unicarehomeopathy.com',
    siteName: 'UniCare Homeopathy',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/og-main.jpg',
        width: 1200,
        height: 630,
        alt: 'UniCare Homeopathy Clinic',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UniCare Homeopathy | Holistic Healing & Constitutional Treatment',
    description: 'Constitutional homeopathic treatment tailored to your health profile. Natural healing for chronic and acute ailments.',
    images: ['/images/og-main.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.location.pathname.startsWith('/admin')) return;
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
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Hide Google Translate Banner, Attribution, and Modern Floating Widgets */
          .goog-te-banner-frame.skiptranslate, 
          .goog-te-gadget-icon, 
          .goog-te-gadget-simple,
          .goog-te-gadget-simple img, 
          .goog-te-menu-value img,
          .goog-te-menu-value span:nth-child(2),
          .goog-te-menu-value span:nth-child(3),
          .skiptranslate > iframe,
          #google_translate_element,
          .goog-te-gadget,
          .goog-te-spinner-pos,
          .VIpgJd-ZVi9od-l4eHX-hSRGPd,
          .VIpgJd-ZVi9od-aZ61S-hSRGPd,
          .VIpgJd-ZVi9od-ORHb-OHege,
          .VIpgJd-ZVi9od-SmH0d {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          /* Hide Hover Tooltips and Highlights */
          #goog-gt-tt, 
          .goog-gt-tt, 
          .goog-te-balloon-frame, 
          .goog-tooltip, 
          .goog-tooltip:hover,
          .VIpgJd-y666Y-OHege {
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
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}