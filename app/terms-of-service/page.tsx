import React from "react";
import TermsOfService from "@/pages/TermsOfService";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | UniCare Homeopathy',
  description: 'Read the terms of service governing the access and usage of the UniCare Homeopathy website and online consulting systems.',
  alternates: {
    canonical: '/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return <TermsOfService />;
}
