import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { ChevronRight, Heart, Award, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AboutHyderabad = () => {
  const { t } = useLanguage();
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAboutContent();
  }, []);

  const fetchAboutContent = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getPublicAbout();
      if (data) setAboutData(data);
    } catch (error) {
      console.error("Error fetching about content:", error);
    } finally {
      setLoading(false);
    }
  };

  const images = aboutData?.image_urls || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-40 pb-20 container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-12 w-3/4 bg-slate-100 rounded" />
            <div className="aspect-video w-full bg-slate-100 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        {/* Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-100 py-4 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={12} />
              <span className="text-primary">About Hyderabad</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 text-center">
              <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                {aboutData?.title?.includes('\n') 
                    ? t(aboutData.title.split('\n')[0].trim()) 
                    : t('The Natural science')}
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight font-heading mt-4">
                {aboutData?.title?.includes('\n') 
                  ? t(aboutData.title.split('\n')[1].trim()) 
                  : t(aboutData?.title || 'About Hyderabad')}
              </h1>
            </div>

            {/* Main Slideshow / Hero Image */}
            {images.length > 0 && (
              <div className="mb-16 relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src={images[currentImageIndex]} 
                  alt="Hyderabad Homeopathy" 
                  className="w-full aspect-[16/9] object-cover transition-all duration-1000"
                />
                
                {images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_: any, idx: number) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${currentImageIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content Area */}
            <div className="prose prose-slate prose-lg max-w-none">
              <div className="space-y-8 text-slate-600 text-lg leading-relaxed font-serif italic">
                {aboutData?.description?.split('\n\n').map((para: string, idx: number) => (
                  <p key={idx} className={idx === 0 ? "text-2xl font-medium text-slate-800 border-l-4 border-primary/30 pl-8 py-2 not-italic font-sans" : "whitespace-pre-line"}>
                    {t(para.trim())}
                  </p>
                ))}
              </div>
            </div>

            {/* Features / Why Choose Us */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center group hover:bg-primary/5 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Certified Experts</h3>
                <p className="text-slate-500 text-sm">Over 30+ highly qualified doctors following evidence-based practice.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center group hover:bg-primary/5 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Care Center</h3>
                <p className="text-slate-500 text-sm">4 widespread branches dedicated to providing rapid relief and patient care.</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 text-center group hover:bg-primary/5 transition-colors">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-primary group-hover:scale-110 transition-transform">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Holistic Approach</h3>
                <p className="text-slate-500 text-sm">Treatments that consider both mental and physical health for long-term health issues.</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="mt-20 p-12 bg-primary rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
               <h2 className="text-3xl font-black mb-6 relative z-10">Experience the Power of Nature</h2>
               <p className="text-white/80 mb-10 max-w-xl mx-auto relative z-10">Start your journey to holistic healing today with Hyderabad Homeopathy clinics.</p>
               <Link 
                  to="/#appointment" 
                  className="bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-transform inline-block relative z-10"
                >
                  Book Free Consultation
               </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default AboutHyderabad;
