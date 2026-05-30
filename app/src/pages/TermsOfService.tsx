import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const TermsOfService = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="w-full">
        {/* Full-width header banner with no side/top gaps */}
        <div className="bg-primary px-6 py-6 md:px-16 md:py-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-black font-heading">
            Terms of Service
          </h1>
        </div>
        
        {/* Centered responsive container for text readability */}
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10 text-slate-700 leading-relaxed text-base md:text-lg">
          <div className="space-y-4">
            <p className="font-bold text-slate-800 text-lg uppercase tracking-wider">
              PLEASE READ THESE TERMS CAREFULLY BEFORE USING THIS WEBSITE
            </p>
            <p>
              The Unicare Homeopathy website (the "Site") provides online information and resources for patients, visitors, healthcare professionals, and the general public. These Terms of Service govern your access to and use of the Site, including all content, services, and features available through it.
            </p>
            <p>
              Unicare Homeopathy reserves the right to modify, update, suspend, or discontinue any part of the Site or these Terms at any time without prior notice. Continued use of the Site after any changes constitutes acceptance of the revised Terms.
            </p>
            <p>
              If you do not agree with these Terms, please discontinue use of the Site immediately.
            </p>
          </div>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              1. Proprietary Rights
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Copyrights</h3>
                <p>
                  All content available on this Site, including text, graphics, images, logos, videos, software, designs, layouts, documents, and other materials ("Content"), is the exclusive property of Unicare Homeopathy unless otherwise stated.
                </p>
                <p className="mt-2">
                  You may view, download, or print content solely for personal and non-commercial use. You may not copy, modify, distribute, reproduce, publish, transmit, sell, or exploit any content without prior written permission from Unicare Homeopathy.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Trademarks</h3>
                <p>
                  All trademarks, service marks, logos, trade names, and branding displayed on the Site are the property of Unicare Homeopathy or their respective owners. Unauthorized use of any trademark is strictly prohibited.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Software</h3>
                <p>
                  Any software, applications, tools, code, or related technology made available through the Site remain the exclusive property of Unicare Homeopathy or its licensors. Users may not reverse engineer, decompile, modify, distribute, or create derivative works from such software.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              2. User Conduct
            </h2>
            <p className="mb-4">
              By using this Site, you agree that you will not:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Violate any applicable laws or regulations.</li>
              <li>Attempt unauthorized access to the Site, servers, databases, or user accounts.</li>
              <li>Disrupt, damage, overload, or interfere with the operation or security of the Site.</li>
              <li>Upload viruses, malware, harmful code, or malicious content.</li>
              <li>Send spam, unsolicited communications, or promotional messages.</li>
              <li>Collect or harvest user information without authorization.</li>
              <li>Use the Site for fraudulent, illegal, or harmful purposes.</li>
              <li>Seek or obtain personalized medical diagnosis or treatment solely through website content.</li>
            </ul>
            <p className="mt-4">
              You are solely responsible for your use of the Site and any information you submit.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              3. Privacy Policy
            </h2>
            <p>
              Your use of this Site is also governed by the Unicare Homeopathy Privacy Policy. By using the Site, you consent to the collection and use of information as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              4. Medical Information Disclaimer
            </h2>
            <p>
              The information provided on this Site is intended solely for general educational and informational purposes.
            </p>
            <p className="mt-2">
              Content available on this Site does not constitute medical advice, diagnosis, treatment, or healthcare recommendations. Users should always consult a qualified healthcare professional before making healthcare decisions.
            </p>
            <p className="mt-2">
              No doctor-patient relationship is established solely through the use of this Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              5. Products and Services
            </h2>
            <p>
              Information regarding treatments, medicines, healthcare services, consultations, pricing, availability, and other offerings may change without prior notice.
            </p>
            <p className="mt-2">
              While Unicare Homeopathy strives to maintain accurate information, we do not guarantee that all content is complete, accurate, current, or error-free at all times.
            </p>
            <p className="mt-2">
              Availability of products and services is subject to confirmation and may vary by location.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              6. Third-Party Links and Content
            </h2>
            <p>
              The Site may contain links to third-party websites for convenience and informational purposes.
            </p>
            <p className="mt-2">
              Unicare Homeopathy does not endorse, control, or assume responsibility for any third-party websites, products, services, content, privacy practices, or policies.
            </p>
            <p className="mt-2">
              Accessing third-party websites is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              7. Disclaimer of Warranties
            </h2>
            <p className="mb-4">
              The Site and all content are provided on an "as is" and "as available" basis.
            </p>
            <p className="mb-4">
              To the fullest extent permitted by law, Unicare Homeopathy disclaims all warranties, express or implied, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Merchantability</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement</li>
              <li>Accuracy and completeness of information</li>
              <li>Uninterrupted or error-free operation</li>
            </ul>
            <p className="mt-4">
              We do not guarantee that the Site will always be available, secure, free from viruses, or free from technical errors.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              8. Limitation of Liability
            </h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Unicare Homeopathy, its directors, doctors, employees, representatives, affiliates, and service providers shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Use of or inability to use the Site</li>
              <li>Reliance on information provided on the Site</li>
              <li>Technical interruptions or system failures</li>
              <li>Unauthorized access to user information</li>
              <li>Loss of data, profits, goodwill, or business opportunities</li>
            </ul>
            <p className="mt-4">
              Your use of the Site is entirely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              9. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless Unicare Homeopathy and its affiliates, employees, doctors, representatives, and service providers from any claims, liabilities, damages, losses, or expenses arising from your violation of these Terms or misuse of the Site.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading border-b border-slate-100 pb-2">
              10. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the laws of India.
            </p>
            <p className="mt-2">
              Any disputes arising from or related to the use of this Site shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-4 font-heading">
              11. Contact Information
            </h2>
            <p className="mb-4">
              For any questions regarding these Terms of Service, please contact:
            </p>
            <address className="not-italic font-bold text-slate-900 space-y-1">
              <p>Unicare Homeopathy</p>
              <p>Website: <a href="https://www.unicarehomeopathy.com" target="_blank" className="text-primary hover:underline">www.unicarehomeopathy.com</a></p>
              <p>Email: <a href="mailto:info@unicarehomeopathy.com" className="text-primary hover:underline">info@unicarehomeopathy.com</a></p>
              <p>Phone: +91 9553387472</p>
            </address>
          </section>

          <div className="pt-6 text-center italic text-sm text-slate-400 font-medium border-t border-slate-100/50">
            By accessing or using this website, you acknowledge that you have read, understood, and agreed to these Terms of Service.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
