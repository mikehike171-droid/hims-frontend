import React from "react";
import PaymentDetailsPage from "@/pages/PaymentDetailsPage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Online Payment | UniCare Homeopathy',
  description: 'Make a secure online payment for your homeopathic treatment, consultation fees, or medicine packages.',
  alternates: {
    canonical: '/pay',
  },
};

export default function PayPage() {
  return <PaymentDetailsPage />;
}
