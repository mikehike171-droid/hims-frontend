import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n/LanguageContext";
import herosection1 from "@/assets/herosection1.png";
import herosection2 from "@/assets/herosection2.png";
import herosection3 from "@/assets/herosection3.png";

type Slide = {
  visual: React.ReactNode;
  blobColor: string;
  title: string;
  sub: string;
  btn: string;
  bgElement?: React.ReactNode;
  bgDecor?: React.ReactNode;
};

// Hero images are now high-quality transparent PNGs for a premium look

const HeroScroller = () => {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const slides: Slide[] = [
    {
      visual: (
        <img
          src={herosection1.src}
          alt="UniCare Homeopathy Medicine"
          className="relative z-20 w-full max-h-[440px] rounded-[2rem] object-cover drop-shadow-2xl"
        />
      ),
      blobColor: "transparent",
      title: 'HEALING YOU AS A WHOLE, NOT JUST THE DISEASE',
      sub: '30-minute expert case-taking and personalised treatments for you and your family.',
      btn: 'Book an Appointment',
    },
    {
      visual: (
        <img
          src={herosection2.src}
          alt="Homeopathy Care"
          className="max-h-[500px] w-auto rounded-[2rem] object-cover drop-shadow-2xl animate-float"
        />
      ),
      blobColor: "transparent",
      title: 'HOMEOPATHY FOR YOU AND YOUR ENTIRE FAMILY',
      sub: 'We listen, we understand, and we offer precise, holistic care for every health need.',
      btn: 'Book an Appointment',
    },
    {
      visual: (
        <img
          src={herosection3.src}
          alt="Natural Remedies"
          className="relative z-20 w-full max-h-[440px] rounded-[2rem] object-cover drop-shadow-xl"
        />
      ),
      blobColor: "transparent",
      title: 'HOMEOPATHY THAT TRULY UNDERSTANDS YOU',
      sub: 'Compassionate care, detailed case analysis, and holistic healing with no side effects.',
      btn: 'Book an Appointment',
    },
  ];

  const goTo = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setCurrent(idx); setAnimating(false); }, 350);
  }, [animating]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const s = slides[current];

  return (
    <section className="relative bg-white overflow-hidden" style={{ minHeight: 460 }}>

      {/* Right Slide-Specific Decor (Removed) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-full z-0">
        {s.bgDecor}
      </div>

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
          <Link href="/appointment"
            className="inline-block mt-8 bg-primary text-white px-8 py-3 rounded-xl font-bold text-base shadow-md hover:opacity-90 transition-all duration-300 w-fit">
            {t(s.btn)}
          </Link>
        </div>

        {/* Visual */}
        <div
          className="flex-1 relative flex items-end justify-center z-20 overflow-hidden min-h-[460px]"
          style={{ opacity: animating ? 0 : 1, transition: "opacity 0.35s" }}
        >
          {/* Versioning added to src to bypass cache */}
          {s.visual}

          {/* Bottom-right decoration (fallback if slide has no specific wave) */}
          {!s.bgDecor && (
            <>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#22d3ee] opacity-30 blur-3xl rounded-full z-0" />
              <div className="absolute -bottom-5 -right-5 w-48 h-48 bg-[#06b6d4] opacity-40 blur-2xl rounded-full z-0 animate-pulse" />
            </>
          )}
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
