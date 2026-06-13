import React from "react";
import AboutUniCare from "@/pages/AboutUniCare";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | UniCare Homeopathy',
  description: 'Learn about UniCare Homeopathy, our mission to provide safe, natural constitutional treatments, and our team of highly qualified homeopathic doctors.',
  alternates: {
    canonical: '/about',
  },
}

export default function AboutPage() {
  return <AboutUniCare />;
}
