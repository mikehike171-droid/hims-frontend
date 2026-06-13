import React from "react";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | UniCare Homeopathy',
  description: 'Read the privacy policy of UniCare Homeopathy. Learn how we protect, handle, and secure your personal and medical information.',
  alternates: {
    canonical: '/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return <PrivacyPolicy />;
}
