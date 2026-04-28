"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  Star, 
  Shield, 
  Award,
  Video,
  Camera,
  Map as MapIcon,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
  Users,
  Info,
  Loader2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AppointmentForm from "@/components/AppointmentForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settingsApi } from "@/lib/settingsApi";

const ClinicDetails = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        setLoading(true);
        // id is the slug from the URL
        const data = await settingsApi.getPublicBranchBySlug(id as string);
        console.log("Branch Data Received:", data);
        setBranch(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching branch:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBranchData();
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Loading clinic details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-40 px-4">
          <div className="bg-white p-12 rounded-3xl shadow-xl shadow-slate-200 text-center max-w-md border border-slate-100">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin size={40} />
            </div>
            <h1 className="text-3xl font-bold font-serif text-[#1a2e5a] mb-4">Clinic Not Found</h1>
            <p className="text-slate-600 mb-8">The clinic branch you're looking for might have been moved or doesn't exist.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/90 rounded-xl px-8 h-12 font-bold transform transition-transform active:scale-95">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getFullImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith('http')) return url;
    return `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${url}`;
  };

  // Placeholder specialists
  const branchDoctors = [
    { name: "Dr. A. Sudhakar", role: "Chief Homeopathic Physician", exp: "15+ Years", degree: "BHMS, MD (Homeo)", image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400" },
    { name: "Dr. P. Rajani", role: "Senior Consultant", exp: "10+ Years", degree: "BHMS", image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=400" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      <Header />
      
      {/* Cinematic Hero */}
      <section className="relative h-[65vh] min-h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={branch.image_url ? getFullImageUrl(branch.image_url) : "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000"} 
            alt={branch.name}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e5a] via-[#1a2e5a]/80 to-transparent z-10" />
        </div>

        <div className="container mx-auto px-4 relative z-20 text-white">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-blue-200 mb-6 bg-white/10 backdrop-blur-md w-fit px-4 py-1.5 rounded-full border border-white/10">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={14} />
              <span className="text-white font-medium">Clinics</span>
              <ChevronRight size={14} />
              <span className="text-white font-medium">{branch.name}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              UniCare Homeopathy <br/>
              <span className="text-emerald-400 italic">{branch.name}</span>
            </h1>
            
            <div className="flex flex-wrap gap-6 items-center mb-8">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">Service Hours</p>
                  <p className="text-sm font-medium">{branch.timings || "Open Mon - Sat"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10 group cursor-default">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">Google Rating</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">4.9/5.0</span>
                    <div className="flex text-yellow-400">
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-14 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-900/20 transform hover:-translate-y-1 transition-all active:scale-95">
                Book Consultation
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white px-8 h-14 rounded-2xl text-lg font-bold backdrop-blur-sm transform transition-all active:scale-95">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-50 text-[#1a2e5a] rounded-full flex items-center justify-center group-hover:bg-[#1a2e5a] group-hover:text-white transition-all transform group-hover:rotate-12">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Call Branch</p>
                  <p className="text-sm font-bold text-[#1a2e5a]">{branch.phone}</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3 group">
                <div className="w-10 h-10 bg-blue-50 text-[#1a2e5a] rounded-full flex items-center justify-center group-hover:bg-[#1a2e5a] group-hover:text-white transition-all transform group-hover:-rotate-12">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Email Support</p>
                  <p className="text-sm font-bold text-[#1a2e5a]">{branch.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
              <Shield size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">NABH Accredited Center</span>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* About Section */}
            <section id="about" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                <h2 className="text-3xl font-serif font-bold text-[#1a2e5a]">About UniCare Homeopathy</h2>
              </div>
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
                {branch.description ? (
                  <div dangerouslySetInnerHTML={{ __html: branch.description }} className="clinical-description" />
                ) : (
                  <div className="space-y-4">
                    <p>Welcome to <strong>UniCare Homeopathy</strong> at our {branch.name} center. We are committed to providing world-class homeopathic care through a combination of traditional wisdom and modern diagnostic integration.</p>
                    <p>At this facility, we specialize in treating chronic conditions such as respiratory issues, skin disorders, and lifestyle-related ailments using specialized constitutional homeopathy. Our goal is to provide lasting relief and improve the overall quality of life for our patients.</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Shield size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a2e5a] mb-1 text-lg">Advanced Diagnostics</h4>
                    <p className="text-sm text-slate-500">Equipped with state-of-the-art testing & analysis facilities.</p>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-start gap-4 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                    <Award size={28} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a2e5a] mb-1 text-lg">Expert Specialists</h4>
                    <p className="text-sm text-slate-500">Highly qualified & internationally trained consultants.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Gallery Section */}
            {branch.gallery && branch.gallery.length > 0 && (
              <section id="gallery" className="scroll-mt-32">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                    <h2 className="text-3xl font-serif font-bold text-[#1a2e5a]">Clinic Tour</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {branch.gallery.map((img: string, i: number) => (
                    <div 
                      key={i} 
                      className={`group relative overflow-hidden rounded-[32px] shadow-md transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border-4 border-white ${
                        i === 0 ? 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' : 'aspect-square'
                      }`}
                    >
                      <img 
                        src={getFullImageUrl(img)} 
                        alt="Clinic Interior"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
                      />
                      <div className="absolute inset-0 bg-[#1a2e5a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <Camera className="text-white" size={40} strokeWidth={1.5} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Specialists Grid */}
            <section id="specialists" className="scroll-mt-32">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                <h2 className="text-3xl font-serif font-bold text-[#1a2e5a]">Branch Specialists</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {branchDoctors.map((doc, i) => (
                  <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-8 group hover:border-primary/20 hover:shadow-2xl transition-all h-full">
                    <div className="w-28 h-28 rounded-3xl overflow-hidden ring-4 ring-slate-50 group-hover:ring-primary/10 transition-all shrink-0">
                      <img src={doc.image} alt={doc.name} className="w-full h-full object-cover transform transition-transform group-hover:scale-105" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold font-serif text-[#1a2e5a] mb-1">{doc.name}</h4>
                      <p className="text-primary font-bold text-sm mb-4 uppercase tracking-wider">{doc.role}</p>
                      <div className="flex items-center gap-2 font-bold text-emerald-600 text-[10px] uppercase tracking-widest bg-emerald-50 w-fit px-3 py-1 rounded-full">
                        <Award size={14} />
                        <span>{doc.exp} EXP</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Integration */}
            {branch.map_url && (
              <section id="location" className="scroll-mt-32">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                  <h2 className="text-3xl font-serif font-bold text-[#1a2e5a]">Location & Directions</h2>
                </div>
                <div className="rounded-[48px] overflow-hidden shadow-2xl shadow-slate-200 border-[10px] border-white h-[480px] relative group hover:shadow-indigo-200/50 transition-all duration-700">
                  <iframe 
                    src={branch.map_url}
                    className="w-full h-full grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
                    loading="lazy"
                    title={`Location map for ${branch.name}`}
                  ></iframe>
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-[36px] shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <div className="w-14 h-14 bg-[#1a2e5a] text-white rounded-[20px] flex items-center justify-center shrink-0 shadow-lg shadow-[#1a2e5a]/20">
                          <MapPin size={28} />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1a2e5a] text-lg mb-1">Visit Our Branch</h4>
                          <p className="text-sm text-slate-600 line-clamp-2 max-w-sm">{branch.address}</p>
                        </div>
                      </div>
                      <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" className="w-full sm:w-auto">
                        <Button className="bg-[#1a2e5a] hover:bg-black rounded-xl px-10 h-12 w-full font-bold shadow-lg transition-all active:scale-95">
                          Open in Maps
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <Card className="rounded-[40px] overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/20 bg-gradient-to-br from-[#1a2e5a] to-[#0a1e3a] text-white">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-[20px] flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20 shadow-inner group">
                      <Calendar size={32} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-3 italic tracking-tight">Book Priority Visit</h3>
                    <p className="text-blue-200/70 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">Schedule your expert consultation at our {branch.name} center today.</p>
                  </div>
                  <AppointmentForm theme="dark" source={`Clinic: ${branch.name}`} />
                </CardContent>
              </Card>

              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50">
                <h4 className="text-xl font-bold text-[#1a2e5a] mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Info size={20} className="text-primary" />
                  </div>
                  Branch Amenities
                </h4>
                <ul className="space-y-5">
                  {[
                    "Free On-site Parking",
                    "Premium Patient Lounge",
                    "Fully Digitized Reports",
                    "In-house Medical Lab",
                    "Waiting Area < 10 Mins"
                  ].map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-700 font-medium">
                      <div className="w-6 h-6 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                      <span className="text-sm">{feat}</span>
                    </li>
                  ))}
                </ul>

                {branch.landmarks && branch.landmarks.length > 0 && (
                  <div className="mt-10 pt-10 border-t border-dashed border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                       <MapIcon size={14} /> Nearby Landmarks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {branch.landmarks.map((mark: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-black border border-slate-200 hover:border-primary/30 transition-colors uppercase tracking-widest">
                          {mark}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default ClinicDetails;
