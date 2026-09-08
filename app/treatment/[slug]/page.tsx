import type { Metadata } from 'next'
import TreatmentDetailPageClient from "./TreatmentDetailPageClient";
import { settingsApi } from "@/lib/settingsApi";
import authService from "@/lib/authService";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const treatment = await settingsApi.getPublicTreatmentBySlug(params.slug);
  if (!treatment) {
    return {
      title: 'Treatment Details Not Found | UniCare Homeopathy',
    }
  }

  const title = `${treatment.name} Treatment | UniCare Homeopathy`
  const description = treatment.short_description || `Effective, constitutional homeopathic treatment for ${treatment.name}. Learn about causes, symptoms, and dynamic recovery.`
  const imageUrl = treatment.image_url ? authService.getFileUrl(treatment.image_url) : 'https://www.unicarehomeopathy.com/images/og-main.jpg'

  return {
    title,
    description,
    alternates: {
      canonical: `/treatment/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.unicarehomeopathy.com/treatment/${params.slug}`,
      images: [
        {
          url: imageUrl,
          alt: treatment.name,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    }
  }
}

export default async function TreatmentPage({ params }: Props) {
  const treatment = await settingsApi.getPublicTreatmentBySlug(params.slug);
  
  if (!treatment) {
    return <TreatmentDetailPageClient />;
  }

  const imageUrl = treatment.image_url ? authService.getFileUrl(treatment.image_url) : 'https://www.unicarehomeopathy.com/images/og-main.jpg'

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": `${treatment.name} Homeopathic Treatment`,
    "description": treatment.short_description || `Constitutional homeopathic care and permanent healing solutions for ${treatment.name}.`,
    "image": imageUrl,
    "url": `https://www.unicarehomeopathy.com/treatment/${params.slug}`,
    "about": {
      "@type": "MedicalCondition",
      "name": treatment.name,
      "description": treatment.short_description
    },
    "provider": {
      "@type": "MedicalOrganization",
      "name": "UniCare Homeopathy",
      "logo": "https://www.unicarehomeopathy.com/images/logo-dark.png"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <TreatmentDetailPageClient />
    </>
  );
}
