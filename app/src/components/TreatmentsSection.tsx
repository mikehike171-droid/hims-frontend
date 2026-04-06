import React from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";
import TreatmentExplorer from "./TreatmentExplorer";
import Link from "next/link";

const TreatmentsSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="treatments" className="py-24 bg-slate-50/50 overflow-hidden relative" ref={ref}>
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="flex items-center justify-center gap-3 mb-4">
               <div className="h-[2px] w-12 bg-primary/20" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('Advanced Homeopathy')}</span>
               <div className="h-[2px] w-12 bg-primary/20" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-primary leading-tight font-heading uppercase">
              {t('Our Treatments')}
            </h2>
            <p className="text-slate-500 text-lg mt-6 mx-auto max-w-2xl leading-relaxed">
              {t('Specialized care for over 110+ diseases using advanced holistic approaches and personalized medicine.')}
            </p>
          </div>
        </div>

        <div className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <TreatmentExplorer />
        </div>

        <div className={`flex flex-col items-center mt-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "400ms" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-primary/20" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">110+ Specialized Conditions</span>
            <div className="h-[1px] w-12 bg-primary/20" />
          </div>
          <Link 
            href="/specialties"
            className="bg-[#1B7A43] text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#155e34] hover:shadow-xl transition-all duration-300 inline-flex items-center shadow-lg"
          >
            {t('More Treatments')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;
