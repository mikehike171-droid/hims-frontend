"use client"

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import authService from "@/lib/authService";

const AllSpecialties = () => {
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getPublicTreatments();
        if (data && data.length > 0) {
          setTreatments(data);
        }
      } catch (error) {
        console.error("Error fetching all specialties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
    window.scrollTo(0, 0);
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=800&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    return `${authService.getSettingsApiUrl().replace('/api', '')}${url}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-primary mb-6 font-heading uppercase tracking-tighter">
              Explore Our <span className="text-[#1B7A43]">Specialized Treatments</span>
            </h1>
            <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-8" />
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              We offer advanced homeopathic care for over 110+ specialized conditions. Browse our expertise below.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-50 rounded-3xl h-[300px] animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {treatments.map((item, i) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
                  style={{ animationDelay: `${(i % 4) * 100}ms` }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <Link 
                          href={`/treatment/${item.id}`}
                          className="w-full bg-[#1B7A43] text-white py-2.1 rounded-full text-[10px] font-bold text-center block uppercase tracking-widest"
                       >
                          View Details
                       </Link>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h4 className="font-black text-primary text-xs md:text-sm uppercase tracking-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center">
                      {t(item.name)}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

// Simple internal Link shim since I'm using AllSpecialties inside a Next page
import Link from "next/link";

export default AllSpecialties;
