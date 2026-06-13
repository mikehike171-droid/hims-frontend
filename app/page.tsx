import Index from "@/pages/Index";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UniCare Homeopathy | Best Homeopathy Clinic & Doctors',
  description: 'UniCare Homeopathy is India\'s leading homeopathic clinic specializing in chronic diseases like PCOS, thyroid, kidney stones, skin allergies, and joint pains.',
  alternates: {
    canonical: '/',
  },
}

export default function LandingPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "UniCare Homeopathy",
    "alternateName": "UniCare Homeopathic Clinic",
    "image": "https://www.unicarehomeopathy.com/images/logo-dark.png",
    "url": "https://www.unicarehomeopathy.com",
    "telephone": "+91 95533 87472",
    "email": "info@unicarehomeopathy.com",
    "priceRange": "$$",
    "description": "UniCare Homeopathy provides world-class constitutional homeopathic treatment for chronic and acute illnesses. We integrate traditional healing wisdom with modern diagnostics.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.facebook.com/share/1ChxmRK7P5/?mibextid=wwXIfr",
      "https://www.instagram.com/unicarehomeopathy?igsh=MXZyajZzZndvcjdzeg%3D%3D&utm_source=qr",
      "https://youtube.com/@unicarehomeopathy?si=9ePS9apr7_DE455H"
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <Index />
    </>
  );
}