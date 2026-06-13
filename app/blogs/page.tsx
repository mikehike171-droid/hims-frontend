import AllBlogs from "@/pages/AllBlogs";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Homeopathy Blog & Health Articles | UniCare Homeopathy',
  description: 'Read the latest research, lifestyle articles, and expert guides on homeopathy, natural remedies, and wellness from UniCare Homeopathy.',
  alternates: {
    canonical: '/blogs',
  },
}

export default function BlogsPage() {
  return <AllBlogs />;
}
