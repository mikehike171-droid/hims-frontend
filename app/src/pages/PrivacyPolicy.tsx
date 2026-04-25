import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";

const PrivacyPolicy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="bg-primary px-8 py-10 text-white">
            <h1 className="text-3xl md:text-4xl font-black font-heading mb-2">
              Privacy Policy
            </h1>
            <p className="text-white/80 font-medium">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                Privacy Policy for UNICARE HOMEOPATHY PRIVATE LIMITED
              </h2>
              <p>
                Your privacy is important to us. UNICARE HOMEOPATHY PRIVATE LIMITED’s policy is to respect your privacy regarding any information we may collect from you across our website,{" "}
                <a href="https://unicarehomeopathy.com/" className="text-primary hover:underline font-bold">https://unicarehomeopathy.com/</a>, and other sites we own and operate.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                OWNERSHIP OF THE WEBSITE
              </h2>
              <p>
                This website is owned and managed by UNICARE HOMEOPATHY PRIVATE LIMITED. All references to UNICARE HOMEOPATHY PRIVATE LIMITED shall be deemed a reference to{" "}
                <a href="https://unicarehomeopathy.com/" className="text-primary hover:underline font-bold">https://unicarehomeopathy.com/</a>. All information and content provided on this website shall be UNICARE HOMEOPATHY PRIVATE LIMITED’s sole property, and all distribution rights are reserved with UNICARE HOMEOPATHY PRIVATE LIMITED.
              </p>
              <p className="mt-4">
                It is clarified that the term “UNICARE HOMEOPATHY PRIVATE LIMITED” shall include its affiliate and associate companies, directors, officers, employees, or cyber doctors. Although UNICARE HOMEOPATHY PRIVATE LIMITED respects the privacy of all those who visit our website and use our online services through computers, mobiles, or otherwise, we do collect certain relevant information from and about our users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                COLLECTION OF INFORMATION
              </h2>
              <p>
                We only ask for personal information when we truly need it to provide a service to you. We gather it fairly and lawfully with your knowledge and cooperation. We also explain why we’re collecting information and how we plan to use it.
              </p>
              <p className="mt-4">
                We only keep gathered information for as long as required to provide you with the requested service. We shall safeguard the information we have in commercially reasonable methods of preventing loss and theft, as well as illegal access, disclosure, duplication, use, or changeover.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                DISCLOSURE OF INFORMATION
              </h2>
              <p>
                Except as obligated by law, we do not reveal any personally-identifying data externally or to any other parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                EXTERNAL LINKS
              </h2>
              <p>
                Our website may link to external sites that we do not operate. Please be aware that we have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 font-heading">
                YOUR RIGHTS
              </h2>
              <p>
                You are free to refuse our request for your personal information, understanding that we may be unable to provide you with some of your desired services.
              </p>
              <p className="mt-4">
                Your continued use of our website will be regarded as an acceptance of our privacy and personal information practices.
              </p>
            </section>

            <div className="pt-8 border-t border-slate-100">
              <p className="font-bold text-slate-900">
                Contact us if you have any issues with handling user information and personal data.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
