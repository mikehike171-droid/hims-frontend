import React from "react";
import ShippingPolicy from "@/pages/ShippingPolicy";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | UniCare Homeopathy',
  description: 'Understand the shipping, logistics, and delivery timeline of medicines from UniCare Homeopathy clinics.',
  alternates: {
    canonical: '/shipping-policy',
  },
}

export default function ShippingPolicyPage() {
  return <ShippingPolicy />;
}
