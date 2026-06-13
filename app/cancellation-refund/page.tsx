import React from "react";
import CancellationRefund from "@/pages/CancellationRefund";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | UniCare Homeopathy',
  description: 'Learn about our cancellation and refund policies for customized homeopathic treatments and consultations at UniCare Homeopathy.',
  alternates: {
    canonical: '/cancellation-refund',
  },
}

export default function CancellationRefundPage() {
  return <CancellationRefund />;
}
