import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const CancellationRefund = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Full-width header banner with no side/top gaps */}
        <div className="bg-primary px-6 py-6 md:px-16 md:py-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Cancellation & Refund Policy
          </h1>
        </div>
        
        {/* Centered responsive container for text readability */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10 text-slate-700 leading-relaxed text-base md:text-lg">
          <p>
            At Unicare Homeopathy, every treatment plan and medicine is customized specifically for each patient based on their individual health condition, medical history, and consultation findings. Due to the personalized nature of homeopathic treatment, we follow the policy outlined below.
          </p>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Treatment & Medicines
            </h2>
            <p>
              All homeopathic medicines are specially prepared and prescribed for individual patients. Therefore, once medicines have been processed, prepared, or dispensed, they cannot be cancelled, returned, exchanged, or refunded.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Consultation Fees
            </h2>
            <p>
              Consultation fees are non-refundable once an appointment has been successfully booked and confirmed.
            </p>
            <p className="mt-2">
              Patients may request to reschedule their appointment once within 30 days of the original appointment date, subject to the availability of the consulting doctor.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Appointment Cancellations
            </h2>
            <p>
              Refunds will be considered only if an appointment is cancelled by Unicare Homeopathy or the consulting doctor due to unforeseen circumstances or exceptional situations.
            </p>
            <p className="mt-2">
              Appointments cancelled by the patient, missed appointments, late arrivals, or no-shows shall not be eligible for any refund.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Refund Processing
            </h2>
            <p>
              Where a refund is approved by Unicare Homeopathy, the amount will be processed through the original payment method within a reasonable period, subject to banking and payment gateway timelines.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Policy Acceptance
            </h2>
            <p>
              By booking an appointment, purchasing medicines, or enrolling in any treatment plan with Unicare Homeopathy, you acknowledge that you have read, understood, and agreed to this Cancellation & Refund Policy.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading">
              Contact Us
            </h2>
            <p className="mb-4">
              For any questions regarding appointments, cancellations, rescheduling, or refunds, please contact:
            </p>
            <address className="not-italic font-bold text-slate-900 space-y-1">
              <p>Unicare Homeopathy</p>
              <p>Website: <a href="https://www.unicarehomeopathy.com" target="_blank" className="text-primary hover:underline">www.unicarehomeopathy.com</a></p>
              <p>Email: <a href="mailto:info@unicarehomeopathy.com" className="text-primary hover:underline">info@unicarehomeopathy.com</a></p>
              <p>Phone: +91 9553387472</p>
            </address>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CancellationRefund;
