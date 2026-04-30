import React, { useState, useEffect } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { settingsApi } from "@/lib/settingsApi";

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

const stripHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const WhatIsHomeopathy = () => {
   const { ref, isVisible } = useScrollAnimation();
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fallback slides using local assets
  const defaultSlides = slides;

  // Compute dynamic slides from API data
  const dynamicSlides = aboutData?.image_urls && aboutData.image_urls.length > 0
    ? aboutData.image_urls.map((url: string, index: number) => ({
      id: `dynamic-${index}`,
      src: url.startsWith('http') ? url : url,
      alt: `Homeopathic Remedy ${index + 1}`
    }))
    : defaultSlides;

  const currentSlides = dynamicSlides;

  // Automatic Rotation Logic (every 10 seconds, one-by-one, continuous loop)
   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % currentSlides.length);
    }, 10000);

    const fetchAbout = async () => {
      try {
        const data = await settingsApi.getPublicAbout();
        if (data) setAboutData(data);
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % currentSlides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);

  return (
    <section className="py-6 md:py-8 bg-white overflow-hidden" id="about" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Side: Premium Slideshow Gallery */}
          <div className={`lg:col-span-6 space-y-6 transition-all duration-1000 ${isVisible ? "animate-fade-in-left opacity-100" : "opacity-0"}`}>
            <div className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl border-4 border-white aspect-[4/3] md:aspect-[16/10]">
              {/* Image Transition Layer */}
              <div className="w-full h-full relative">
                {currentSlides.map((slide, index) => (
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
                {currentSlides.map((_, index) => (
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
                <span className="text-sm font-black uppercase tracking-widest text-orange-500">
                  {aboutData?.title?.includes('\n') 
                    ? t(aboutData.title.split('\n')[0].trim()) 
                    : t('The Natural science')}
                </span>
              </div>
              <h2 className="text-3xl md:text-[2.8rem] font-black text-primary tracking-tight uppercase font-heading leading-[1.1]">
                {aboutData?.title?.includes('\n') 
                  ? t(aboutData.title.split('\n')[1].trim()) 
                  : t(aboutData?.title || 'WHAT IS HOMEOPATHY?')}
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 text-[1.1rem] leading-relaxed font-medium opacity-90">
              {aboutData?.description ? (
                <>
                  <p className="border-l-4 border-primary/20 pl-8 py-4 italic font-semibold text-gray-700 bg-primary/5 rounded-r-2xl">
                    {t(stripHtml(aboutData.description).split('\n\n')[0] || '')}
                  </p>
                  {stripHtml(aboutData.description).split('\n\n')[1] && (
                    <p className="whitespace-pre-line pl-1 opacity-80 line-clamp-2">
                      {t(stripHtml(aboutData.description).split('\n\n')[1])}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="border-l-4 border-primary/20 pl-8 py-4 italic font-semibold text-gray-700 bg-primary/5 rounded-r-2xl text-gray-400 animate-pulse bg-slate-100 h-24 rounded-lg" />
                  <p className="pl-1 opacity-80 bg-slate-50 h-20 rounded-lg animate-pulse" />
                </>
              )}
            </div>

            <div className="pt-4">
              <Link href="/about" className="group bg-primary hover:opacity-90 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-wider shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 w-fit">
                <span>{t('About UniCare')}</span>
                <div className="bg-white/20 p-1.5 rounded-full group-hover:bg-white/30 transition-colors">
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIsHomeopathy;
