import React, { useState, useEffect, useRef } from "react";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronRight, ArrowRight, Activity, Droplets, Wind, Zap, Heart } from "lucide-react";
import Link from "next/link";
import authService from "@/lib/authService";

const AUTO_PLAY_INTERVAL = 6000;

const TreatmentExplorer = () => {
  const { t } = useLanguage();
  const [activeId, setActiveId] = useState<any>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const icons: Record<string, React.ReactNode> = {
    "low-back-pain": <Activity className="w-6 h-6" />,
    "kidney-stones": <Droplets className="w-6 h-6" />,
    "spondylitis": <Activity className="w-6 h-6" />,
    "sinusitis": <Wind className="w-6 h-6" />,
    "thyroid": <Zap className="w-6 h-6" />,
    "pcos": <Heart className="w-6 h-6" />,
  };

  const displayedTreatments = treatments.slice(0, 5);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setIsLoading(true);
        const data = await settingsApi.getPublicTreatments();
        if (data && data.length > 0) {
          setTreatments(data);
          setActiveId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching treatments for explorer:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  useEffect(() => {
    if (!isPaused && displayedTreatments.length > 0) {
      timerRef.current = setInterval(() => {
        setActiveId((prevId: any) => {
          const currentIndex = displayedTreatments.findIndex(t => t.id === prevId);
          if (currentIndex === -1) return displayedTreatments[0]?.id;
          const nextIndex = (currentIndex + 1) % displayedTreatments.length;
          return displayedTreatments[nextIndex].id;
        });
      }, AUTO_PLAY_INTERVAL);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, displayedTreatments]);

  const handleManualSelection = (id: any) => {
    setActiveId(id);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 12000); 
  };

  const getImageUrl = (url: string) => {
    return authService.getFileUrl(url);
  };

  if (isLoading) {
    return (
      <div className="h-[500px] bg-white rounded-[3.5rem] flex items-center justify-center border border-slate-100 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-slate-400">
           <Activity className="w-12 h-12 animate-pulse" />
           <p className="font-bold uppercase tracking-widest text-[10px]">{t('Loading Treatments...')}</p>
        </div>
      </div>
    )
  }

  if (treatments.length === 0) return null;

  const activeTreatment = treatments.find(t => t.id === activeId) || treatments[0];

  return (
    <div 
      className="bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-100 mb-20 animate-fade-in group/explorer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex flex-col lg:flex-row min-h-[550px]">
        {/* Column 1: Navigation Sidebar (LEFT - 20%) */}
        <div className="lg:w-[20%] bg-slate-50/50 p-6 flex flex-col border-r border-slate-100">
          <div className="mb-8 hidden lg:block">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">
              {t('Specialties')}
            </h3>
          </div>
          
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
            {displayedTreatments.map((treatment) => (
              <button
                key={treatment.id}
                onClick={() => handleManualSelection(treatment.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 min-w-[190px] lg:min-w-0 text-left relative overflow-hidden ${
                  activeId === treatment.id
                    ? "bg-white shadow-lg text-primary scale-105"
                    : "text-slate-500 hover:bg-white/50 hover:text-primary"
                }`}
              >
                {activeId === treatment.id && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                )}
                
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                  activeId === treatment.id ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                }`}>
                  {icons[treatment.name.toLowerCase().replace(/\s+/g, '-')] || <Activity size={18} />}
                </div>
                
                <div className="flex-grow">
                  <p className="font-bold text-[10px] lg:text-[12px] leading-tight uppercase tracking-tight">{t(treatment.name)}</p>
                  <div className={`h-1 bg-primary/10 rounded-full mt-1.5 overflow-hidden transition-all duration-300 ${activeId === treatment.id ? "w-full" : "w-0"}`}>
                    {activeId === treatment.id && !isPaused && (
                      <div 
                        className="h-full bg-primary" 
                        style={{ 
                          animation: `progress ${AUTO_PLAY_INTERVAL}ms linear infinite` 
                        }} 
                      />
                    )}
                  </div>
                </div>
              </button>
            ))}

            {treatments.length > 5 && (
              <Link
                href="/specialties"
                className="flex items-center justify-center gap-2 p-4 rounded-2xl transition-all duration-500 min-w-[140px] lg:min-w-0 text-primary bg-primary/5 hover:bg-primary/10 font-bold text-[10px] uppercase tracking-[0.2em] group/more"
              >
                {t('View All Treatments')}
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>


          <div className="mt-auto pt-4 hidden lg:block opacity-20 text-center">
             <p className="text-[8px] text-slate-400 uppercase tracking-[0.4em] font-black">
              {t('Expert Care')}
            </p>
          </div>
        </div>

        {/* Column 2: Aligned Image Center (MIDDLE - 38%) */}
        <div className="lg:w-[38%] h-[350px] lg:h-auto overflow-hidden relative flex items-start justify-end pt-10 lg:pt-14 pr-4 lg:pr-8 bg-slate-50/5">
          <div 
            key={`${activeId}-img`} 
            className="w-full flex justify-end animate-in fade-in zoom-in-95 duration-1000 pl-4"
          >
            <div className="w-full max-w-[380px] h-[260px] lg:h-[300px] rounded-[3rem] overflow-hidden shadow-2xl relative group border-4 border-white">
              <img 
                src={getImageUrl(activeTreatment.image_url)} 
                alt={t(activeTreatment.name)}
                className="w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-30" />
              <div className="absolute bottom-4 left-4 flex items-center">
                 <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                    {t('Verified Approach')}
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Balanced Data Side (RIGHT - 42%) */}
        <div className="lg:w-[42%] p-8 lg:p-12 flex flex-col justify-start pt-10 lg:pt-14 bg-white relative pl-4 lg:pl-10">
          <div 
            key={`${activeId}-text`} 
            className="animate-in fade-in slide-in-from-right-10 duration-700 space-y-5"
          >
            <div>
               <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('Treatment Focus')}</span>
                  <div className="h-[1px] w-8 bg-primary/20" />
               </div>
              <h4 className="text-xl md:text-2xl font-black text-primary leading-tight font-heading uppercase group-hover/explorer:text-primary transition-colors">
                {t(activeTreatment.name)}
              </h4>
              <div className="mt-4">
                  <div 
                    className="text-slate-500 text-[13px] md:text-[14px] leading-relaxed italic border-l-2 border-primary/10 pl-4 py-1 prose prose-sm max-w-none line-clamp-5 overflow-hidden"
                    dangerouslySetInnerHTML={{ __html: t(activeTreatment.long_description) }}
                  />
                  <Link 
                    href={`/treatment/${activeTreatment.slug || activeTreatment.id}`}
                    className="text-primary font-bold text-[10px] uppercase tracking-widest mt-2 hover:underline flex items-center gap-1 group/btn"
                  >
                    {t('Read Full Overview')}
                    <div className="h-[1px] bg-primary w-4 group-hover/btn:w-6 transition-all duration-300" />
                  </Link>
                 <div className="mt-5 flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    <span>44 Lakh+ {t('Success Stories')}</span>
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2.5 pt-2">
              <Link
                href={`/treatment/${activeTreatment.slug || activeTreatment.id}`}
                className="bg-primary text-white px-8 py-3.5 rounded-full font-black text-[10px] text-center flex items-center justify-center gap-2.5 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg active:scale-95 group"
              >
                {t('EXPLORE DETAILS')}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("open-appointment-popup"))}
                className="bg-slate-50 text-slate-500 px-8 py-3.5 rounded-full font-black text-[10px] text-center border border-slate-100 hover:bg-primary/5 hover:text-primary hover:border-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Activity size={14} />
                {t('BOOK VISIT')}
              </button>
            </div>
          </div>

          <div className="absolute top-8 right-12 text-slate-100/30 text-5xl font-black select-none pointer-events-none -z-10">
            0{treatments.findIndex(t => t.id === activeId) + 1}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default TreatmentExplorer;
