"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import authService from "@/lib/authService";

const SpecialtiesSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getPublicTreatments();
        if (data && data.length > 0) {
          // Double the treatments to create a seamless loop for the marquee
          setTreatments([...data, ...data]);
        }
      } catch (error) {
        console.error("Error fetching treatments for specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=300&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return `${authService.getSettingsApiUrl().replace('/api', '')}${url}`;
  };

  if (loading || treatments.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4 mb-16 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
           <h2 className="text-4xl md:text-5xl font-black text-primary font-heading uppercase mb-4">
            {t('Our Specialties')}
          </h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mb-6" />
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Discover our expertise across a wide range of specialized conditions, treated with care and precision.
          </p>
        </div>
      </div>

      {/* Rotating Marquee Container */}
      <div className="relative w-full overflow-hidden select-none group">
        <div className="flex animate-marquee whitespace-nowrap gap-6 py-4">
          {treatments.map((item, index) => (
            <div 
              key={`${item.id}-${index}`}
              className="flex-shrink-0 w-[280px] bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100 hover:-translate-y-2 transition-all duration-500 group/card"
            >
              <div className="w-full h-[200px] rounded-[2rem] overflow-hidden mb-5">
                <img 
                  src={getImageUrl(item.image_url)} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" 
                />
              </div>
              <h4 className="text-center font-black text-primary text-sm uppercase tracking-wider group-hover/card:text-[#1B7A43] transition-colors">
                {t(item.name)}
              </h4>
            </div>
          ))}
        </div>

        {/* Gradient overlays for the faded edges */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 to-transparent z-10" />
      </div>

      <div className={`flex justify-center mt-16 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`} style={{ animationDelay: "600ms" }}>
        <Link 
          href="/specialties"
          className="bg-[#1B7A43] text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#155e34] hover:shadow-xl transition-all duration-300 inline-flex items-center shadow-lg"
        >
          {t('More Treatments')}
        </Link>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default SpecialtiesSection;
