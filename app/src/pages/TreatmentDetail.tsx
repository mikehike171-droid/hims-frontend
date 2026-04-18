"use client"

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AppointmentForm from "@/components/AppointmentForm";
import { treatmentsData } from "@/data/treatmentsData";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronRight, Phone, MessageSquare, Clock, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TreatmentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const treatment = id ? treatmentsData[id] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!treatment) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#1a2e5a] mb-4">Treatment Not Found</h1>
            <Link href="/" className="text-emerald-600 font-bold hover:underline">Return to Home</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#1a2e5a] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e5a] via-[#1a2e5a]/90 to-transparent z-10" />
          <img 
            src={treatment.heroImage} 
            alt={treatment.title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <nav className="flex items-center gap-2 text-blue-200 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-medium">{treatment.title}</span>
          </nav>
          
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white font-heading mb-6 leading-tight animate-fade-in">
              {t(`Homeopathy Treatment for ${treatment.title}`)}
            </h1>
            <p className="text-xl text-blue-50 leading-relaxed opacity-90 animate-fade-in delay-100">
              {t(treatment.shortDesc)}
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in delay-200">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent("open-appointment-popup"))}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                {t('Book Free Consultation')}
                <ArrowRight size={20} />
              </button>
              <a 
                href="tel:+917337557851" 
                className="bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 px-8 py-4 rounded-xl font-bold transition-all duration-300 inline-flex items-center gap-2"
              >
                <Phone size={20} />
                +91 7337557851
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Container */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <div className="lg:w-2/3 space-y-12">
            {treatment.sections.map((section, idx) => (
              <div key={idx} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a2e5a] font-heading mb-6 relative">
                  {t(section.title)}
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-emerald-500 rounded-full" />
                </h2>
                
                {section.type === 'text' && (
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t(section.content as string)}
                  </p>
                )}
                
                {section.type === 'list' && (
                  <ul className="space-y-4">
                    {(section.content as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600 text-lg">
                        <div className="mt-1.5 min-w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ChevronRight size={14} strokeWidth={3} />
                        </div>
                        {t(item)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* FAQs Section */}
            {treatment.faqs.length > 0 && (
              <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100">
                <h2 className="text-2xl md:text-3xl font-bold text-[#1a2e5a] font-heading mb-8">
                  {t('Frequently Asked Questions')}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {treatment.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-slate-100 italic">
                      <AccordionTrigger className="text-left text-[#1a2e5a] font-bold text-lg py-4 hover:no-underline hover:text-emerald-600 transition-colors">
                        {t(faq.question)}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 text-base leading-relaxed pb-6 italic">
                        {t(faq.answer)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            {/* Quick Links / Other Treatments */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-xl font-bold text-[#1a2e5a] font-heading mb-6 border-b pb-4">
                {t('Other Treatments')}
              </h3>
              <div className="space-y-3">
                {Object.values(treatmentsData).filter(t_item => t_item.id !== id).map((t_item) => (
                  <Link 
                    key={t_item.id}
                    href={`/treatment/${t_item.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-[#1a2e5a] font-medium transition-all group"
                  >
                    <span>{t(t_item.title)}</span>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-emerald-500 transform group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              {/* Sidebar CTA */}
              <div className="mt-10 bg-emerald-600 rounded-2xl p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={30} />
                </div>
                <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                <p className="text-emerald-50 text-sm mb-6">Call us to consult with our specialized homeopathic doctors.</p>
                <a 
                  href="tel:+917337557851" 
                  className="block w-full bg-white text-emerald-600 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors"
                >
                  Call Now
                </a>
              </div>

              {/* Fast Facts */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl text-[#1a2e5a]">
                  <MessageSquare className="text-blue-500" size={24} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-400">Whatsapp Support</p>
                    <p className="font-bold text-sm">+91 90598 03758</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-2xl text-[#1a2e5a]">
                  <Clock className="text-orange-500" size={24} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-orange-400">Available Time</p>
                    <p className="font-bold text-sm">Mon - Sat: 9am - 8pm</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Appointment Form Integration */}
      <div className="bg-slate-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a2e5a] font-heading">
              {t('Start Your Journey to Recovery')}
            </h2>
            <p className="text-gray-500 mt-4 text-lg">
              {t('Fill out the form below to book your appointment for')} {t(treatment.title)}
            </p>
          </div>
          <AppointmentForm />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TreatmentDetail;
