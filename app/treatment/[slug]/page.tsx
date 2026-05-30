"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import authService from "@/lib/authService";
import {
  ChevronRight,
  ArrowRight,
  Activity,
  CheckCircle2,
  HelpCircle,
  Phone,
  Calendar,
  Layers,
  MessageSquare,
  Clock,
  MapPin
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";

const TreatmentDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [treatment, setTreatment] = useState<any>(null);
  const [relatedTreatments, setRelatedTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  const [sidebarForm, setSidebarForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    setShowOverlay(false);
  }, [slug]);

  useEffect(() => {
    if (!loading && treatment) {
      const timer = setTimeout(() => {
        setShowOverlay(true);
      }, 1500); // 1.5 seconds of full show
      return () => clearTimeout(timer);
    }
  }, [loading, treatment]);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const navItems = treatment ? [
    { id: "overview", label: "Overview" },
    ...(treatment.sections || []).map((s: any) => ({
      id: slugify(s.title),
      label: s.title
    })),
    ...(treatment.faqs && treatment.faqs.length > 0 ? [{ id: "faqs", label: "Support FAQ" }] : [])
  ] : [];

  const handleSidebarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const SETTINGS_API_URL = authService.getSettingsApiUrl();
      const response = await fetch(`${SETTINGS_API_URL}/enquiry/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...sidebarForm,
          medical_problems: sidebarForm.reason || `Inquiry from treatment page: ${treatment?.name}`
        })
      });

      if (!response.ok) throw new Error('Failed to book appointment');

      window.dispatchEvent(new CustomEvent("booking-success"));
      setSidebarForm({ name: "", phone: "", email: "", reason: "" });
    } catch (error) {
      console.error('Submission error:', error);
      alert("There was an issue processing your request. Please try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentData = await settingsApi.getPublicTreatmentBySlug(slug as string);
        setTreatment(currentData);

        // Redirect if visited via ID but treatment has a slug
        if (currentData && currentData.slug && currentData.slug !== slug && /^\d+$/.test(slug as string)) {
          console.log(`Redirecting from ID ${slug} to slug ${currentData.slug}`);
          router.replace(`/treatment/${currentData.slug}`);
        }

        const allTreatments = await settingsApi.getPublicTreatments();
        if (Array.isArray(allTreatments)) {
          const filtered = allTreatments
            .filter((t: any) => t.slug !== slug && t.status === 'active')
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
          setRelatedTreatments(filtered);
        }
      } catch (error) {
        console.error("Error fetching treatment data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navItems.length) return;

      const ids = navItems.map(item => item.id);
      let currentSection = "overview";

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) {
            currentSection = id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navItems]);

  const getImageUrl = (url: string | null) => {
    if (!url) return "https://images.unsplash.com/photo-1576091160550-217359f42f8c?q=80&w=2670&auto=format&fit=crop";
    if (url.startsWith('http')) return url;
    const settingsUrl = authService.getSettingsApiUrl();
    const baseUrl = settingsUrl.replace('/api', '');
    return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Details...</p>
        </div>
      </div>
    );
  }

  if (!treatment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-800 mb-4 font-heading">404</h1>
          <p className="text-gray-500 mb-8">Treatment not found.</p>
          <Link href="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen text-gray-700">
      <Header />

      {/* Hero Section - Blurred Underlay + Crisp Contained Foreground Image */}
      <section className="relative h-[280px] md:h-[350px] overflow-hidden bg-slate-950">
        {/* Blurred background filling left-to-right */}
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={getImageUrl(treatment.image_url)}
            alt=""
            className="w-full h-full object-cover blur-2xl scale-110"
          />
        </div>
        
        {/* Clean contained image aligned to the right */}
        <div className="absolute inset-0 z-0">
          <img
            src={getImageUrl(treatment.image_url)}
            alt={treatment.name}
            className="w-full h-full object-contain object-right"
          />
          {/* Animated dark gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent transition-opacity duration-1000 ${showOverlay ? 'opacity-100' : 'opacity-0'}`} />
        </div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          {/* Top Breadcrumbs - Animated */}
          <nav className={`absolute top-8 flex items-center gap-2 text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] transition-opacity duration-1000 ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={10} />
            <span className="text-white">{treatment.name}</span>
          </nav>

          <div className={`max-w-2xl mt-4 transition-all duration-1000 ${showOverlay ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-3xl md:text-[2.8rem] font-extrabold text-white leading-[1.1] uppercase mb-4 drop-shadow-md tracking-tight font-heading">
              {treatment.name}
            </h1>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                <div className="bg-[#4ade80]/20 rounded-full p-1"><CheckCircle2 size={12} className="text-[#4ade80]" /></div>
                Expert Care
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                <div className="bg-[#4ade80]/20 rounded-full p-1"><Activity size={12} className="text-[#4ade80]" /></div>
                Verified
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Ultra Tight (py-4, space-y-6) */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left Column: Content (70%) */}
          <div className="lg:w-[70%]">

            {/* Overview Section */}
            <section id="overview" className="mb-8 scroll-mt-24">
              <div className="flex flex-col gap-2 mb-3">
                <div className="h-1 w-8 bg-primary rounded-full" />
                <h2 className="text-xl md:text-[2rem] font-extrabold text-primary uppercase tracking-tight leading-[1] font-heading">
                  {treatment.name} Overview
                </h2>
              </div>
              <div
                className="text-gray-600 text-[1.05rem] leading-relaxed font-medium border-l-4 border-primary/20 pl-6 py-4 bg-slate-50/50 rounded-r-xl prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: treatment.long_description }}
              />
            </section>

            {/* Dynamic Content Sections */}
            <div className="space-y-6">
              {treatment.sections?.map((section: any, idx: number) => (
                <section
                  key={idx}
                  id={slugify(section.title)}
                  className="scroll-mt-24"
                >
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="h-1 w-8 bg-primary rounded-full" />
                    <h3 className="text-lg md:text-[1.6rem] font-extrabold text-primary uppercase tracking-tight leading-[1] font-heading">
                      {section.title}
                    </h3>
                  </div>

                  {section.type === 'list' ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {section.content.split(',').map((item: string, i: number) => (
                        <div key={i} className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-primary/20 transition-all duration-300">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Activity size={20} />
                          </div>
                          <p className="text-gray-700 font-bold text-[0.9rem] leading-tight pt-2.5 uppercase tracking-tight">{item.trim()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                      <div
                        className="relative z-10 text-gray-600 text-[1.05rem] leading-relaxed font-medium prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  )}
                </section>
              ))}

              {/* FAQs Section */}
              {treatment.faqs && treatment.faqs.length > 0 && (
                <section id="faqs" className="scroll-mt-24">
                  <div className="flex flex-col gap-2 mb-3">
                    <div className="h-1 w-8 bg-primary rounded-full" />
                    <h4 className="text-lg md:text-[1.6rem] font-extrabold text-primary uppercase tracking-tight font-heading leading-[1]">
                      Quick Support
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {treatment.faqs.map((faq: any, idx: number) => (
                      <details
                        key={idx}
                        className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:border-primary/20 transition-all duration-300"
                      >
                        <summary className="flex items-center justify-between p-4 cursor-pointer list-none font-bold text-gray-800 uppercase tracking-tight text-[0.85rem] select-none hover:bg-slate-50 transition-colors">
                          <div className="flex gap-4 items-center">
                            <HelpCircle size={16} className="text-primary shrink-0" />
                            {faq.question}
                          </div>
                          <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center group-open:rotate-180 transition-transform">
                            <ChevronRight size={12} className="text-gray-300" />
                          </div>
                        </summary>
                        <div className="px-10 pb-4 text-gray-600 leading-relaxed text-[0.95rem] border-t border-gray-50 pt-4 font-medium">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:w-[35%]">
            <div className="sticky top-24 space-y-8">

              {/* Related Treatments - Matching Blog Model */}
              {relatedTreatments.length > 0 && (
                <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                    <div className="h-4 w-1 bg-primary rounded-full" />
                    {t('Our Specialties')}
                  </h4>

                  <div className="space-y-6">
                    {relatedTreatments.map((rT) => (
                      <Link
                        key={rT.id}
                        href={`/treatment/${rT.slug || rT.id}`}
                        className="group flex gap-4 items-center"
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md bg-white">
                          <img
                            src={getImageUrl(rT.image_url)}
                            alt={rT.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div>
                          <h5 className="text-[13px] font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors uppercase tracking-tight">
                            {t(rT.name)}
                          </h5>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 block">
                            {t('Learn More')} →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* APPOINTMENT FORM - ULTRA DENSE */}
              <div className="bg-primary p-6 rounded-2xl shadow-xl text-center">
                <h4 className="text-white font-extrabold text-lg mb-1 uppercase tracking-tight font-heading">Consultation</h4>
                <p className="text-white/50 text-[8px] font-bold uppercase tracking-widest mb-4">Expert Doctors Advice</p>

                <form onSubmit={handleSidebarSubmit} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Name *"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/40 focus:bg-white focus:text-primary transition-all outline-none text-[12px] font-bold uppercase"
                    value={sidebarForm.name}
                    onChange={(e) => setSidebarForm({ ...sidebarForm, name: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone *"
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/40 focus:bg-white focus:text-primary transition-all outline-none text-[12px] font-bold uppercase"
                    value={sidebarForm.phone}
                    onChange={(e) => setSidebarForm({ ...sidebarForm, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Medical Concern"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder:text-white/40 focus:bg-white focus:text-primary transition-all outline-none text-[12px] font-bold uppercase"
                    value={sidebarForm.reason}
                    onChange={(e) => setSidebarForm({ ...sidebarForm, reason: e.target.value })}
                  />
                  <button className="w-full bg-white text-primary py-3.5 rounded-lg font-extrabold text-[10px] uppercase tracking-widest hover:bg-[#22d3ee] hover:text-white transition-all shadow-md mt-1 active:scale-95">
                    Confirm Booking
                  </button>
                </form>
              </div>

              {/* Navigation */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h4 className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">Navigation</h4>
                <nav className="flex flex-col gap-1.5">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`flex items-center justify-between p-3 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-all ${activeSection === item.id
                          ? "bg-primary text-white shadow-md"
                          : "text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                      {item.label}
                      <ChevronRight size={10} />
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <section className="bg-primary py-10 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-white uppercase tracking-tighter mb-4 leading-none font-heading">
            Expert Care for Permanent Healing
          </h2>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-appointment-popup"))}
            className="bg-[#C53030] text-white px-6 py-3 rounded-full font-bold text-[10px] tracking-widest inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl uppercase font-heading cursor-pointer"
          >
            Book Visit <ArrowRight size={14} />
          </button>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />

    </div>
  );
};

export default TreatmentDetailPage;
