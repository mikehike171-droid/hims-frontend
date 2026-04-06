import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Heart, ShieldCheck, Lightbulb, Leaf, Eye, Target, Crosshair } from "lucide-react";

const OurValues = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();

  const values = [
    { icon: Heart, title: "Compassion", desc: "We care deeply about your well-being", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { icon: ShieldCheck, title: "Integrity", desc: "We maintain highest ethical standards", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: Lightbulb, title: "Innovation", desc: "We embrace modern healthcare advances", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: Leaf, title: "Sustainability", desc: "We promote healthy, sustainable living", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  ];

  const highlights = [
    { icon: Eye, title: "Vision", desc: "To create a healthier society." },
    { icon: Target, title: "Mission", desc: "To advance the practice of homeopathy worldwide." },
    { icon: Crosshair, title: "Goal", desc: "A Zero Medication System (ZMS), which focuses on building natural immunity." },
  ];

  return (
    <section className="py-8 relative overflow-hidden bg-white" ref={ref}>
      {/* Background blobs for depth */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-8 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="inline-block px-4 py-1 rounded-full bg-emerald-50 text-emerald-600 text-sm font-bold tracking-wider mb-4">
            OUR PHILOSOPHY
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a2e5a] font-heading mb-6 leading-tight">
            {t('Our Values & Mission')}
          </h2>
          <p className="text-gray-500 text-lg md:text-xl leading-relaxed">
            {t('Committed to Your Wellness')}
          </p>
        </div>

        {/* Primary Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {values.map((v, i) => (
            <div
              key={i}
              className={`group p-8 rounded-3xl bg-white border h-full transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${v.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <v.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#1a2e5a] font-heading mb-4 group-hover:text-emerald-600 transition-colors">
                {t(v.title)}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {t(v.desc)}
              </p>
            </div>
          ))}
        </div>

        {/* Vision/Mission/Goal Section */}
        <div className={`mt-24 p-8 md:p-12 rounded-[3rem] bg-[#1a2e5a] relative overflow-hidden transition-all duration-1000 lg:flex items-center justify-between gap-12 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Subtle patterns for premium feel */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl" />

          {highlights.map((h, i) => (
            <div key={i} className="flex-1 relative z-10 mb-12 lg:mb-0 last:mb-0 group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-500">
                  <h.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white font-heading">
                  {t(h.title)}
                </h4>
              </div>
              <p className="text-blue-100/80 text-lg leading-relaxed max-w-md">
                {t(h.desc)}
              </p>
              {i < highlights.length - 1 && (
                <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-px h-16 bg-white/10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
