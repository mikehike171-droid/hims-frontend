import Header from "@/components/Header";
import HeroScroller from "@/components/HeroScroller";
import BookAppointmentBanner from "@/components/BookAppointmentBanner";
import WhyTrustUs from "@/components/WhyTrustUs";
import WhatIsHomeopathy from "@/components/WhatIsHomeopathy";
import OurValues from "@/components/OurValues";
import TreatmentsSection from "@/components/TreatmentsSection";
import WhyUsSection from "@/components/WhyUsSection";
import AppointmentForm from "@/components/AppointmentForm";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => (
  <div className="min-h-screen">
    <Header />
    <HeroScroller />
    <BookAppointmentBanner />
    <WhyTrustUs />
    <WhatIsHomeopathy />
    <OurValues />
    <TreatmentsSection />
    <WhyUsSection />
    <AppointmentForm />
    <ReviewsSection />
    <FAQSection />
    <BlogSection />
    <Footer />
    <WhatsAppFloat />
  </div>
);

export default Index;
