import React from "react";
import { Leaf, HeartPulse, Zap, Stethoscope } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";

const WhyUsSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();

  const reasons = [
    { 
      icon: Leaf, 
      title: "Holistic Approach", 
      desc: "Our approach is holistic and treats the disease not merely the symptoms. A detailed evaluation is made of the patient's condition.",
      color: "from-emerald-400/20 to-emerald-600/20 text-emerald-600 border-emerald-100"
    },
    { 
      icon: HeartPulse, 
      title: "Patient-Centric", 
      desc: "Expert doctors who guide patients in their wellness journey, caring support staff, and patient-friendly offers.",
      color: "from-rose-400/20 to-rose-600/20 text-rose-600 border-rose-100"
    },
    { 
      icon: Zap, 
      title: "Constitutional Homeopathy", 
      desc: "Our treatments consider the physical, emotional and mental condition of the patient and are customized to individual requirements.",
      color: "from-amber-400/20 to-amber-600/20 text-amber-600 border-amber-100"
    },
    { 
      icon: Stethoscope, 
      title: "Expert Doctors", 
      desc: "Our team of over 30+ qualified doctors counsel, guide and administer treatments throughout the patient's health journey.",
      color: "from-indigo-400/20 to-indigo-600/20 text-indigo-600 border-indigo-100"
    },
  ];

  return (
    <section className="py-8 relative overflow-hidden bg-white" ref={ref}>
      {/* Premium Background Decorations */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-50/40 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-50/40 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-4xl mx-auto mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block px-5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black tracking-widest mb-6 border border-indigo-100 uppercase">
            {t('WHY CHOOSE US?')}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-[#1a2e5a] font-heading mb-8 leading-[1.1] tracking-tight">
            {t('Why Choose UniCare?')}
          </h2>
          <div className="space-y-4">
            <h3 className="text-xl md:text-2xl text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed italic">
              "{t('A patient-first approach applying the best homeopathy remedies for over 110+ treatments')}"
            </h3>
            <p className="text-emerald-600 text-lg md:text-xl font-bold bg-emerald-50/50 inline-block px-6 py-2 rounded-2xl border border-emerald-100 shadow-sm">
              {t('We have the trust of over 44 lakh+ happy patients who have benefited from our treatments.')}
            </p>
          </div>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`relative group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Glassmorphism Background Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${r.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem]`} />
              
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg transition-all duration-500">
                  <r.icon className="w-8 h-8 transition-colors duration-500 text-primary" />
                </div>
                
                <h4 className="text-2xl font-bold text-[#1a2e5a] font-heading mb-4 group-hover:text-slate-900 transition-colors">
                  {t(r.title)}
                </h4>
                
                <p className="text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors duration-500">
                  {t(r.desc)}
                </p>
              </div>

              {/* Decorative corner element */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-slate-50/50 rounded-full blur-xl group-hover:bg-white/50 transition-colors" />
            </div>
          ))}
        </div>

        {/* Bottom CTA or Subtle Indicator */}
        <div className={`mt-20 text-center transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`} style={{ transitionDelay: "1000ms" }}>
          <div className="inline-flex items-center gap-3 text-slate-400 font-medium tracking-widest text-xs uppercase">
            <div className="w-12 h-px bg-slate-200" />
            {t('Empowering Your Health Naturally')}
            <div className="w-12 h-px bg-slate-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
