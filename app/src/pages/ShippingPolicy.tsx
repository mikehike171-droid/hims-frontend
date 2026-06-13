"use client";

import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const ShippingPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Full-width header banner with no side/top gaps */}
        <div className="bg-primary px-6 py-6 md:px-16 md:py-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Shipping Policy
          </h1>
        </div>
        
        {/* Centered responsive container for text readability */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10 text-slate-700 leading-relaxed text-base md:text-lg">
          <div className="space-y-4">
            <p className="font-bold text-slate-800 text-lg uppercase tracking-wider">
              Thank you for choosing Unicare Homeopathy.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Shipping Information
            </h2>
            <p>
              Shipping is available only for orders placed directly with Unicare Homeopathy through our clinic, website, or authorized representatives.
            </p>
            <p className="mt-2">
              We use registered and reliable courier services to ensure the safe and timely delivery of medicines and healthcare products. International courier services may be used where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Shipping Charges
            </h2>
            <p>
              Shipping charges, if applicable, will be clearly communicated at the time of order confirmation. For international orders, shipping costs may be included in the final invoice unless otherwise specified.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Delivery Timeline
            </h2>
            <p>
              Delivery times may vary depending on the destination, courier partner, weather conditions, and other logistical factors. While we strive to ensure prompt delivery, exact delivery dates cannot be guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Delays
            </h2>
            <p className="mb-4">
              Unicare Homeopathy shall not be held responsible for delays caused by:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Courier service providers</li>
              <li>Customs clearance procedures</li>
              <li>Natural disasters or adverse weather conditions</li>
              <li>Government regulations or restrictions</li>
              <li>Other unforeseen circumstances beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Shipment Tracking
            </h2>
            <p>
              Once your order has been dispatched, shipment and tracking details may be shared with you via phone, SMS, WhatsApp, or email, wherever applicable.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              Incorrect Shipping Information
            </h2>
            <p>
              Customers are requested to provide accurate delivery details while placing orders. Unicare Homeopathy will not be responsible for delays or failed deliveries resulting from incorrect or incomplete address information.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading">
              Contact Us
            </h2>
            <p className="mb-4">
              For any shipping-related questions or assistance, please contact:
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

export default ShippingPolicy;
