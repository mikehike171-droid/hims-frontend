import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import { settingsApi } from "@/lib/settingsApi";
import authService from "@/lib/authService";

type Slide = {
  visual: string; // Changed to string (image URL)
  blobColor: string;
  title: string;
  sub: string;
  btn: string;
  btnLink?: string;
};

const HeroScroller = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getHeroSections();
        if (data && data.length > 0) {
          const mappedSlides = data.map((item: any) => ({
            visual: item.image_url.startsWith('http') ? item.image_url : `${authService.getSettingsApiUrl().replace('/api', '')}${item.image_url}`,
            blobColor: "transparent",
            title: item.title,
            sub: item.subtitle,
            btn: item.button_text,
            btnLink: item.button_link,
          }));
          setSlides(mappedSlides);
        }
      } catch (error) {
        console.error("Failed to fetch hero slides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const goTo = useCallback((idx: number) => {
    if (animating || slides.length === 0) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 350);
  }, [animating, slides.length]);

  const prev = () => {
    if (slides.length === 0) return;
    goTo((current - 1 + slides.length) % slides.length);
  };
  
  const next = useCallback(() => {
    if (slides.length === 0) return;
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (loading) {
    return (
      <div className="relative flex items-center justify-center bg-white" style={{ minHeight: 460 }}>
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (slides.length === 0) return null;

  const s = slides[current];

  const handleBtnClick = () => {
    if (s.btnLink) {
      window.location.href = s.btnLink;
    } else {
      window.dispatchEvent(new CustomEvent("open-appointment-popup"));
    }
  };

  return (
    <section className="relative bg-white overflow-hidden" style={{ minHeight: 460 }}>

      {/* Layout */}
      <div className="relative container mx-auto px-4 flex flex-col md:flex-row items-center min-h-[460px]">

        {/* Left arrow */}
        <button onClick={prev} aria-label="Previous"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-500" />
        </button>

        {/* Right arrow */}
        <button onClick={next} aria-label="Next"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-500" />
        </button>

        {/* Text */}
        <div className="flex-1 z-20 px-10 md:px-16 py-4 md:py-0 flex flex-col justify-center">
          <h2
            className="text-3xl md:text-[2.6rem] font-extrabold leading-[1.15] font-heading text-primary"
            style={{ opacity: animating ? 0 : 1, transition: "opacity 0.35s" }}
          >
            {t(s.title).toUpperCase()}
          </h2>
          <p
            className="text-gray-500 text-base md:text-[1.05rem] mt-5 max-w-[420px] leading-relaxed"
            style={{ opacity: animating ? 0 : 1, transition: "opacity 0.35s" }}
          >
            {t(s.sub)}
          </p>
          <button 
            onClick={handleBtnClick}
            className="inline-block mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold text-base shadow-md hover:opacity-90 transition-all duration-300 w-fit cursor-pointer"
          >
            {t(s.btn)}
          </button>
        </div>

        {/* Visual */}
        <div
          className="flex-1 relative flex items-end justify-center z-20 overflow-hidden min-h-[460px]"
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.35s" }}
        >
          <img
            src={s.visual}
            alt={s.title}
            className="relative z-20 w-full max-h-[440px] rounded-[2rem] object-cover drop-shadow-2xl"
          />

          {/* Bottom-right decoration */}
          <>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#22d3ee] opacity-30 blur-3xl rounded-full z-0" />
            <div className="absolute -bottom-5 -right-5 w-48 h-48 bg-[#06b6d4] opacity-40 blur-2xl rounded-full z-0 animate-pulse" />
          </>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-primary w-6" : "bg-gray-300 w-2"}`} />
        ))}
      </div>
    </section>
  );
};

export default HeroScroller;
