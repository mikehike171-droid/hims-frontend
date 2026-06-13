import AllSpecialties from "@/pages/AllSpecialties";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Specialties & Treatments | UniCare Homeopathy',
  description: 'Explore our full list of homeopathic treatments and clinical specialties. From PCOS and thyroid to joint pain and chronic skin diseases.',
  alternates: {
    canonical: '/specialties',
  },
}

export default function SpecialtiesPage() {
  return <AllSpecialties />;
}
