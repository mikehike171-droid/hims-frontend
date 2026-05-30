import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Full-width header banner with no side/top gaps */}
        <div className="bg-primary px-6 py-6 md:px-16 md:py-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Privacy Policy
          </h1>
        </div>
        
        {/* Centered responsive container for text readability */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-8 text-slate-700 leading-relaxed text-base md:text-lg">
            <p>
              At Unicare Homeopathy, we value and respect your privacy. This Privacy Policy explains how we collect, use, protect, and handle your personal information when you visit our website, use our services, or interact with us online.
            </p>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Ownership of the Website
              </h2>
              <p>
                This website is owned and managed by Unicare Homeopathy. All references to "Unicare Homeopathy" refer to the website, its branches, affiliated entities, directors, doctors, employees, representatives, and authorized service providers.
              </p>
              <p className="mt-4">
                All content, information, text, images, logos, and materials available on this website are the exclusive property of Unicare Homeopathy, and all rights are reserved.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Information We Collect
              </h2>
              <p className="mb-4">
                We may collect personal information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Location details</li>
                <li>Health-related information voluntarily provided by you</li>
                <li>Appointment and consultation details</li>
              </ul>
              <p className="mt-4">
                We collect this information only when it is necessary to provide our healthcare services, respond to inquiries, schedule appointments, or improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                How We Use Your Information
              </h2>
              <p className="mb-4">
                The information collected may be used to:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>Schedule and manage appointments</li>
                <li>Provide medical consultations and healthcare services</li>
                <li>Respond to inquiries and support requests</li>
                <li>Send service-related notifications and updates</li>
                <li>Improve website functionality and user experience</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Data Protection
              </h2>
              <p>
                We implement commercially reasonable security measures to protect your personal information from unauthorized access, disclosure, alteration, misuse, or loss.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. Your information may only be disclosed:
              </p>
              <ul className="list-disc pl-6 space-y-2 font-medium">
                <li>When required by law</li>
                <li>To comply with legal obligations</li>
                <li>To protect the rights, safety, or property of Unicare Homeopathy or its patients</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Cookies and Website Usage
              </h2>
              <p>
                Our website may use cookies and similar technologies to improve user experience, analyze website traffic, and enhance our services. You may choose to disable cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Third-Party Links
              </h2>
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices, content, or policies of external websites. Users are encouraged to review the privacy policies of those sites separately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Your Rights
              </h2>
              <p>
                You may choose not to provide certain personal information; however, doing so may limit access to some of our services.
              </p>
              <p className="mt-4">
                By continuing to use our website and services, you agree to the terms outlined in this Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Changes to This Policy
              </h2>
              <p>
                Unicare Homeopathy reserves the right to update or modify this Privacy Policy at any time. Any changes will be posted on this page.
              </p>
            </section>

            <section className="pt-8 border-t border-slate-100">
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Contact Us
              </h2>
              <p className="mb-4">
                If you have any questions regarding this Privacy Policy or the handling of your personal information, please contact us:
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

export default PrivacyPolicy;
