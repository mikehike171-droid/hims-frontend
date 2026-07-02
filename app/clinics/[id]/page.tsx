import type { Metadata } from 'next'
import ClinicDetails from "@/pages/ClinicDetails";
import { settingsApi } from "@/lib/settingsApi";
import { notFound } from "next/navigation";

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const branch = await settingsApi.getPublicBranchBySlug(params.id);
  if (!branch) {
    return {
      title: 'Clinic Branch Not Found | UniCare Homeopathy',
    }
  }

  const title = `UniCare Homeopathy Clinic - ${branch.name} | Expert Homeopathic Doctors`
  const description = branch.description
    ? branch.description.replace(/<[^>]*>/g, '').slice(0, 160)
    : `Visit UniCare Homeopathy Clinic at ${branch.name}. ${branch.address}. Phone: ${branch.phone || '+91 95533 87472'}. Professional homeopathic doctors & constitutional remedies.`

  return {
    title,
    description,
    alternates: {
      canonical: `/clinics/${params.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.unicarehomeopathy.com/clinics/${params.id}`,
    }
  }
}

export default async function ClinicPage({ params }: Props) {
  const branch = await settingsApi.getPublicBranchBySlug(params.id);
  
  if (!branch) {
    notFound();
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": `UniCare Homeopathy Clinic - ${branch.name}`,
    "image": branch.image_url || "https://www.unicarehomeopathy.com/images/og-main.jpg",
    "telephone": branch.phone || "+91 95533 87472",
    "email": branch.email || "info@unicarehomeopathy.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": branch.address || branch.name,
      "addressLocality": branch.name,
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
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <ClinicDetails />
    </>
  );
}
