import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Importing the 5 local homeopathy images from the assets folder
import image1 from "@/assets/1.png";
import image2 from "@/assets/2.png";
import image3 from "@/assets/3.png";
import image4 from "@/assets/4.png";
import image5 from "@/assets/5.png";

const slides = [
  { id: 1, src: image1.src, alt: "Homeopathic Remedy 1" },
  { id: 2, src: image2.src, alt: "Homeopathic Remedy 2" },
  { id: 3, src: image3.src, alt: "Homeopathic Remedy 3" },
  { id: 4, src: image4.src, alt: "Homeopathic Remedy 4" },
  { id: 5, src: image5.src, alt: "Homeopathic Remedy 5" },
];

const WhatIsHomeopathy = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic Rotation Logic (every 10 seconds, one-by-one, continuous loop)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="py-6 md:py-8 bg-white overflow-hidden" id="about" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Side: Premium Slideshow Gallery */}
          <div className={`lg:col-span-6 space-y-6 transition-all duration-1000 ${isVisible ? "animate-fade-in-left opacity-100" : "opacity-0"}`}>
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white aspect-[4/3] md:aspect-[16/10]">
              {/* Image Transition Layer */}
              <div className="w-full h-full relative">
                {slides.map((slide, index) => (
                  <img
                    key={slide.id}
                    src={slide.src}
                    alt={slide.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${currentIndex === index ? "opacity-100 scale-105" : "opacity-0 scale-100"
                      }`}
                  />
                ))}
              </div>

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Navigation Arrows (visible on hover) */}
              <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={prevSlide}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all transform hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all transform hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Elegant Pagination Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${currentIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                      }`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Content Area */}
          <div className={`lg:col-span-6 space-y-8 transition-all duration-1000 delay-300 ${isVisible ? "animate-fade-in-right opacity-100" : "opacity-0"}`}>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-primary rounded-full" />
                <span className="text-sm font-black uppercase tracking-widest text-primary">The Natural science</span>
              </div>
              <h2 className="text-3xl md:text-[2.8rem] font-black text-primary tracking-tight uppercase font-heading leading-[1.1]">
                {t('WHAT IS HOMEOPATHY?')}
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 text-[1.1rem] leading-relaxed font-medium opacity-90">
              <p className="border-l-4 border-primary/20 pl-8 py-4 italic font-semibold text-gray-700 bg-primary/5 rounded-r-2xl">
                {t('Homeopathy is an alternative healthcare system acknowledged by many global health communities. It originated in Germany and is now widely practiced and respected in India. Homeopathy offers safe, natural treatment for many chronic conditions, with virtually no side effects. It works by strengthening the body\'s immune system and helping to develop resilience to fight long-term health issues.')}
              </p>
              <p className="whitespace-pre-line pl-1 opacity-80">
                {t('Uni Care Group has 4 branches and over 30 qualified doctors. We follow an evidence-based homeopathic practice that considers both mental and physical health. Our treatments are cost-effective, provide rapid relief, and are centered around patient care.')}
              </p>
            </div>

            <div className="pt-4">
              <button className="group bg-primary hover:opacity-90 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4">
                <span>{t('About Uni Care')}</span>
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIsHomeopathy;
