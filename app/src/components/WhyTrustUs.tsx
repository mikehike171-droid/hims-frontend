import React, { useState, useEffect, useRef } from "react";
import { Building2, Stethoscope, Users, HeartPulse, CalendarDays } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";
import doctorImg from "@/assets/hero-doctor-female.png";

interface CounterProps {
  end: number;
  suffix?: string;
  trigger: boolean;
}

const Counter = ({ end, suffix = "", trigger }: CounterProps) => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!trigger) return;

    let start = 1;
    const duration = 2000; // 2 seconds
    const increment = end / (duration / 16); // 16ms per frame (60fps)

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [trigger, end]);

  return (
    <span className="notranslate text-4xl md:text-6xl font-extrabold text-primary mt-1 font-heading tracking-tight drop-shadow-sm">
      {count}{suffix}
    </span>
  );
};

const WhyTrustUs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();

  const stats = [
    { icon: Users, label: "Happy Patients", value: 5000, suffix: "+", desc: "Building trust, one patient at a time" },
    { icon: Stethoscope, label: "Doctors", value: 15, suffix: "+", desc: "Experienced doctors with successful track record" },
    { icon: Building2, label: "Branches", value: 4, suffix: "+", desc: "Accessible quality care, anytime" },
    { icon: CalendarDays, label: "Years", value: 15, suffix: "+", desc: "Compassionate homeopathic care" },
  ];

  return (
    <section
      className="relative py-6 md:py-8 overflow-hidden bg-gradient-to-r from-blue-50/40 via-white to-pink-50/40"
      ref={ref}
    >
      {/* Premium Decorative Background Elements */}
      <div className="absolute right-[5%] top-[15%] opacity-20 pointer-events-none animate-pulse">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="4" x2="12" y2="20" /><line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">

          {/* Swapped Layout: Image Left, Content Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-8 md:mb-10">

            {/* Image on Left Side */}
            <div className={`lg:col-span-5 relative transition-all duration-1000 delay-300 ${isVisible ? "animate-fade-in opacity-100" : "opacity-0"}`}>
              <div className="relative group">
                {/* Image with sophisticated styling */}
                <div className="absolute -inset-4 bg-primary/5 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <img
                  src={doctorImg.src}
                  alt="Trusted Homeopathic Doctor"
                  className="relative w-full h-[450px] object-cover rounded-[2rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                />
                {/* Floating badge for added premium feel - Now on the Right side of the image */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-emerald-50 hidden md:block animate-bounce" style={{ animationDuration: '5s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <HeartPulse className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Trusted Success</p>
                      <p className="text-lg font-black text-primary tracking-tight">Proven Results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content on Right Side */}
            <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
              <div className="space-y-4">
                <h2 className="text-3xl md:text-[2.8rem] font-black text-primary tracking-tight uppercase font-heading leading-[1.1]">
                  {t('Why Trust UNICARE HOMEOPATHY PRIVATE LIMITED?')}
                </h2>
                <div className="w-20 h-1.5 bg-primary rounded-full opacity-60" />
              </div>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed italic opacity-90 font-medium font-body underline-offset-8 decoration-primary/20 decoration-2">
                {t('Experience Excellence in Healthcare')}
              </p>
              <div className="space-y-6 text-gray-500 leading-relaxed text-[1.05rem] font-medium opacity-90 max-w-2xl">
                <p>
                  {t('Our trusted remedies are based on a holistic approach that carefully considers the physical, mental, and emotional aspects of every individual while treating the root cause of the condition.')}
                </p>
                <p>
                  {t('As the')} <strong className="text-primary underline decoration-primary/30 underline-offset-4">{t('Best Homeopathy Clinic in UniCare')}</strong>, {t('we focus on delivering personalized care that goes beyond symptom relief to promote complete well-being.')}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid - High Visual Impact */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center transition-all duration-1000 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} trigger={isVisible} />
                </div>
                <span className="text-sm font-extrabold text-primary/80 uppercase mt-2 tracking-widest notranslate">
                  {t(stat.label)}
                </span>
                <span className="text-[0.9rem] text-gray-400 mt-5 leading-normal font-semibold max-w-[160px] min-h-[4rem] flex items-center notranslate">
                  {t(stat.desc)}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyTrustUs;
