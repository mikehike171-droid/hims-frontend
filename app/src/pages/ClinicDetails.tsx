import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/i18n/LanguageContext";
import { MapPin, Phone, Mail, ChevronRight, Activity, HeartPulse, ShieldCheck, CheckCircle2, ChevronRightCircle, User, Award, Building, Microscope, Globe, LayoutGrid, Heart, Wind, Zap } from "lucide-react";

// Update clinicsInfo to match the branches in user request
const clinicsInfo: Record<string, { name: string, address: string, phone: string, email: string, landmarks: {name: string, dist: string}[] }> = {
  narasaraopet: {
    name: "Narasaraopet",
    address: "UniCare Homeopathy, Main Road, Near Bus Stand, Narasaraopet, Andhra Pradesh 522601",
    phone: "+91 95533 87472",
    email: "narasaraopet@unicarehomeo.com",
    landmarks: [
      { name: "RTC Bus Stand", dist: "1.2 km" },
      { name: "Railway Station", dist: "2.5 km" },
      { name: "Clock Tower", dist: "800 m" }
    ]
  },
  ongole: {
    name: "Ongole",
    address: "UniCare Homeopathy, Trunk Road, Near RTC Bus Stand, Ongole, Andhra Pradesh 523001",
    phone: "+91 95533 87472",
    email: "ongole@unicarehomeo.com",
    landmarks: [
      { name: "RTC Bus Stand", dist: "1.0 km" },
      { name: "Railway Station", dist: "2.8 km" },
      { name: "Gandhi Park", dist: "1.5 km" }
    ]
  },
  nalgonda: {
    name: "Nalgonda",
    address: "UniCare Homeopathy, Hyderabad Road, Near Clock Tower, Nalgonda, Telangana 508001",
    phone: "+91 95533 87472",
    email: "nalgonda@unicarehomeo.com",
    landmarks: [
      { name: "RTC Bus Stand", dist: "1.8 km" },
      { name: "Clock Tower", dist: "500 m" },
      { name: "NG College", dist: "2.1 km" }
    ]
  }
};

const ClinicDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, [id]);
  
  const clinic = id && clinicsInfo[id] ? clinicsInfo[id] : {
    name: id ? id.charAt(0).toUpperCase() + id.slice(1) : "Clinic",
    address: "UniCare Homeopathy Clinic Address",
    phone: "+91 95533 87472",
    email: "info@unicarehomeopathy.com",
    landmarks: [
      { name: "Central Bus Stand", dist: "1.5 km" },
      { name: "Railway Station", dist: "3.0 km" },
    ]
  };

  const expertiseStats = [
    { icon: <Award className="w-12 h-12 text-[#67c1d3]" />, label: "25+ Years", desc: "Of Experience" },
    { icon: <Building className="w-12 h-12 text-[#67c1d3]" />, label: "53+ Clinics", desc: "Across India" },
    { icon: <User className="w-12 h-12 text-[#67c1d3]" />, label: "300+ Doctors", desc: "Team Strength" },
    { icon: <Microscope className="w-12 h-12 text-[#67c1d3]" />, label: "200+ Diseases", desc: "Treated Successfully" }
  ];

  const featureCards = [
    {
      icon: <Activity className="w-10 h-10 text-[#67c1d3]" />,
      title: "BETTER RECOVERY",
      desc: `Homeopathic medicines prescribed by UniCare Homeopathy in ${clinic.name} show an exceptionally high recovery rate when taken under expert guidance.`
    },
    {
      icon: <HeartPulse className="w-10 h-10 text-[#67c1d3]" />,
      title: "COMPLETE HEALING",
      desc: "Our doctors do a thorough case study to understand the root cause of every disorder, ensuring holistic healing that lasts."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#67c1d3]" />,
      title: "NO SIDE EFFECTS",
      desc: "Homeopathic medicines provide complete healing without any side effects. They are safe, gentle, and enhance your immune system."
    },
    {
      icon: <CheckCircle2 className="w-10 h-10 text-[#67c1d3]" />,
      title: "LONG-TERM RELIEF",
      desc: "By treating the root cause rather than just managing symptoms, we ensure you achieve lasting, long-term relief from your health issues."
    }
  ];

  const specialtyCategories = [
    { icon: <LayoutGrid />, title: "Chronic Diseases", items: ["Piles", "Arthritis", "Spondylitis"] },
    { icon: <Wind />, title: "Respiratory Health", items: ["Asthma", "Sinusitis", "Bronchitis"] },
    { icon: <Zap />, title: "Skin & Hair", items: ["Psoriasis", "Acne", "Hair Loss"] },
    { icon: <Heart />, title: "Women's Health", items: ["PCOS", "Thyroid", "Infertility"] }
  ];

  const treatmentLinks = [
    "Schizophrenia", "Anemia", "Acne", "Allergies", "Tonsillitis", "PCOD", "Sinusitis", 
    "Diabetes", "Psoriasis", "Hair Loss", "Spondylitis", "Thyroid Disorders", 
    "Knee Pain", "Migraine", "Piles", "Infertility", "Asthma", "Kidney Stones"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#54595f]">
      <Header />

      {/* TOP HERO BREADCRUMB WITH CUSTOM AP MAP BANNER */}
      <div className="relative h-[250px] md:h-[400px] overflow-hidden flex items-center justify-center bg-slate-100">
        <img 
          src="/ap-map.png" 
          alt="Andhra Pradesh Medical Map" 
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
             // Fallback to a medical themed background if map not run yet
             e.currentTarget.src = 'https://images.unsplash.com/photo-1576086213369-97a306dca665?auto=format&fit=crop&q=80&w=2000';
          }}
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
        <div className="container relative z-10 mx-auto px-4 text-center">
             <div className="inline-flex items-center gap-2 text-[14px] text-[#013b82] font-black uppercase tracking-widest mb-6">
                  <Link to="/" className="hover:text-[#67c1d3] transition-colors">{t('Home')}</Link>
                  <ChevronRight size={14} />
                  <span>{t('Clinics')}</span>
                  <ChevronRight size={14} />
                  <span className="text-[#67c1d3]">{t(clinic.name)}</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black text-[#013b82] font-heading drop-shadow-sm">
               Best Homeopathy Clinic <br/> in {t(clinic.name)}
             </h1>
             <div className="mt-8 flex items-center justify-center gap-3">
                <div className="h-0.5 w-12 bg-[#67c1d3]" />
                <p className="text-lg md:text-xl font-bold text-[#1a2e5a] tracking-wide uppercase">
                   Trusted Worldwide Healthcare Solution
                </p>
                <div className="h-0.5 w-12 bg-[#67c1d3]" />
             </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* 1. OUR EXPERTISE STAT SECTION */}
            <section className="space-y-16">
               <div className="text-center">
                  <h2 className="text-3xl font-black text-[#013b82] uppercase mb-4 tracking-tight">Our Expertise</h2>
                  <div className="w-16 h-1 bg-[#67c1d3] mx-auto rounded-full" />
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {expertiseStats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center group translate-y-0 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-24 h-24 rounded-full border-2 border-slate-100 flex items-center justify-center p-4 bg-white shadow-lg group-hover:border-[#67c1d3] group-hover:shadow-[#67c1d3]/20 transition-all">
                            {stat.icon}
                        </div>
                        <h4 className="mt-6 text-xl font-black text-[#013b82]">{stat.label}</h4>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.desc}</p>
                    </div>
                  ))}
               </div>

               {/* Trust us Grid (Integrated into Expertise flow) */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 {featureCards.map((feat, idx) => (
                   <div key={idx} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] flex flex-col items-center text-center shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-[#67c1d3] relative overflow-hidden group">
                       <div className="mb-8 w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center p-4 group-hover:bg-[#e0f1f4] transition-colors">{feat.icon}</div>
                       <h4 className="text-lg font-black text-[#013b82] mb-4 tracking-wider uppercase">{t(feat.title)}</h4>
                       <p className="text-[15px] leading-relaxed text-[#54595f] leading-[26px]">{t(feat.desc)}</p>
                   </div>
                 ))}
               </div>
            </section>

            {/* Appointment Form: Prominent Blue Card */}
            <div className={`bg-[#5ba6d2] p-10 md:p-14 rounded-3xl shadow-xl text-white text-center transition-all duration-1000 transform ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <h2 className="text-3xl md:text-4xl font-black mb-2 uppercase tracking-wide">Book an Appointment</h2>
                <p className="text-white/90 text-[16px] mb-12 italic border-b border-white/20 pb-4 inline-block">Please fill out the form below to schedule your appointment.</p>
                
                <form className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 text-left">
                  <div className="relative group">
                    <label className="text-[13px] font-black uppercase tracking-widest text-white/70 block mb-1">Full Name *</label>
                    <input type="text" placeholder="Your Name" className="w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 py-3 focus:border-white outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="relative group">
                    <label className="text-[13px] font-black uppercase tracking-widest text-white/70 block mb-1">Phone Number *</label>
                    <input type="tel" placeholder="Your mobile" className="w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 py-3 focus:border-white outline-none transition-all font-bold text-lg" />
                  </div>
                   <div className="relative group">
                    <label className="text-[13px] font-black uppercase tracking-widest text-white/70 block mb-1">Email Address</label>
                    <input type="email" placeholder="Your email" className="w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 py-3 focus:border-white outline-none transition-all font-bold text-lg" />
                  </div>
                   <div className="relative group">
                    <label className="text-[13px] font-black uppercase tracking-widest text-white/70 block mb-1">Reason of visit</label>
                    <input type="text" placeholder="Select Reason" className="w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 py-3 focus:border-white outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="relative group md:col-span-2">
                    <label className="text-[13px] font-black uppercase tracking-widest text-white/70 block mb-1">Brief about you</label>
                    <input type="text" placeholder="How can we help you?" className="w-full bg-transparent border-b-2 border-white/40 text-white placeholder-white/30 py-3 focus:border-white outline-none transition-all font-bold text-lg" />
                  </div>
                  <div className="md:col-span-3 flex justify-center pt-8">
                    <button type="submit" className="px-16 py-4 bg-[#013b82] text-white font-black rounded-full hover:bg-emerald-600 shadow-xl hover:-translate-y-1 transition-all tracking-[0.2em] text-[15px] border-2 border-white/20">
                      SUBMIT REQUEST
                    </button>
                  </div>
                </form>
            </div>

            {/* Welcome Text */}
            <div className="space-y-10">
                <h2 className="text-3xl font-black text-[#013b82] font-heading leading-tight underline decoration-[#67c1d3] decoration-8 underline-offset-8">
                  Homeopathy clinic in {clinic.name}, AP
                </h2>
                <div className="bg-[#f8fafc] border-l-4 border-[#67c1d3] p-8 md:p-10 rounded-r-3xl">
                   <p className="text-[18px] leading-[32px] font-medium text-slate-700">
                      Welcome to UniCare Homeopathy Clinic – the trusted homeopathy clinic in <span className="text-[#013b82] font-black">{clinic.name}</span>. Our team of expert homeopathy doctors is dedicated to helping you find relief from over 200+ health issues. For 25+ years, we’ve been dedicated to providing the finest homeopathy remedies.
                   </p>
                </div>
                
                <div className="space-y-6 pt-10">
                   <h3 className="text-2xl font-black text-[#013b82] font-heading border-b border-slate-100 pb-4">
                     Why Choose UniCare Homeopathy Clinic?
                   </h3>
                   <p className="text-[17px] leading-[30px] italic text-slate-500 pl-4 border-l-2 border-slate-100">
                     UniCare Homeopathy Clinic in {clinic.name} is one of India’s most trusted homeopathic clinics. Homeopathy has touched and healed the lives of many, and at our clinics, we continue to treat people with the same passion. Our team comes with over 25+ years of clinical expertise.
                   </p>
                </div>
            </div>

            {/* 2. OUR SPECIALTIES SECTION */}
            <section className="space-y-16 pt-10">
                <div className="text-center">
                  <h2 className="text-3xl font-black text-[#013b82] uppercase mb-4 tracking-tight">Our Specialties</h2>
                  <div className="w-16 h-1 bg-[#67c1d3] mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {specialtyCategories.map((spec, idx) => (
                     <div key={idx} className="bg-[#f0f9fa] p-10 rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-[#cfe8ec]/30">
                        <div className="flex items-center gap-6 mb-8 border-b border-[#cfe8ec] pb-6">
                           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#67c1d3] shadow-md">
                              {spec.icon}
                           </div>
                           <h4 className="text-xl font-black text-[#013b82] uppercase tracking-wide">{spec.title}</h4>
                        </div>
                        <ul className="space-y-4">
                           {spec.items.map((item, idy) => (
                             <li key={idy} className="flex items-center gap-4 text-[#54595f] font-bold text-md">
                                <div className="w-2.5 h-2.5 bg-[#67c1d3] rounded-full" />
                                <span>{item} Specialist Care</span>
                             </li>
                           ))}
                        </ul>
                     </div>
                   ))}
                </div>
            </section>

            {/* Mass Treatment Grid: Small Blue Buttons */}
            <div className="space-y-12">
                <h3 className="text-2xl font-black text-[#013b82] font-heading text-center underline decoration-[#67c1d3] decoration-4 underline-offset-4 mb-10">
                   Treatments at {clinic.name} Branch
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {treatmentLinks.map((link, idx) => (
                    <Link key={idx} to="#" className="px-6 py-5 bg-[#67c1d3] text-white rounded-2xl flex items-center justify-between group hover:bg-[#013b82] hover:-translate-y-1 transition-all shadow-md active:scale-95">
                        <span className="font-black text-[13px] uppercase tracking-tight leading-tight">Homeopathy for {t(link)}</span>
                        <ChevronRightCircle size={18} className="text-white group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ))}
                </div>
            </div>

          </div>

          {/* SIDEBAR AREA */}
          <div className="lg:col-span-4">
             <div className="sticky top-28 space-y-16">
                  
                  {/* Clinic Contact Detail Box */}
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#013b82] opacity-[0.03] rounded-bl-full group-hover:scale-110 transition-transform" />
                       <h4 className="text-xl font-black text-[#013b82] uppercase mb-10 pb-4 border-b-2 border-[#f0f4f8]">Clinic Contact</h4>
                       <div className="space-y-10">
                           <div className="flex gap-6 items-start group/item">
                               <div className="w-12 h-12 bg-[#f0f9fa] rounded-2xl flex items-center justify-center text-[#67c1d3] group-hover/item:bg-[#67c1d3] group-hover/item:text-white transition-colors">
                                  <Phone size={22} />
                               </div>
                               <div>
                                   <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1.5">Call us</p>
                                   <p className="text-[#1a2e5a] font-black text-xl leading-none">{clinic.phone}</p>
                               </div>
                           </div>
                           <div className="flex gap-6 items-start group/item">
                               <div className="w-12 h-12 bg-[#f0f9fa] rounded-2xl flex items-center justify-center text-[#67c1d3] group-hover/item:bg-[#67c1d3] group-hover/item:text-white transition-colors">
                                  <MapPin size={22} />
                               </div>
                               <div>
                                   <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1.5">Address</p>
                                   <p className="text-[#1a2e5a] font-bold text-[16px] leading-relaxed">{clinic.address}</p>
                               </div>
                           </div>
                            <div className="flex gap-6 items-start group/item">
                               <div className="w-12 h-12 bg-[#f0f9fa] rounded-2xl flex items-center justify-center text-[#67c1d3] group-hover/item:bg-[#67c1d3] group-hover/item:text-white transition-colors">
                                  <Mail size={22} />
                               </div>
                               <div>
                                   <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest mb-1.5">Email</p>
                                   <p className="text-[#1a2e5a] font-bold text-[16px] leading-none">{clinic.email}</p>
                               </div>
                           </div>
                       </div>
                  </div>

                  {/* Nearby Landmarks with RED km highlights */}
                  <div className="space-y-8 pl-4">
                      <h3 className="text-xl font-black text-[#1a2e5a] uppercase flex flex-col">
                        <span className="text-[12px] text-gray-300 mb-1 tracking-widest">FIND YOUR NEARBY</span>
                        UNICARE HOMEOPATHY CLINIC
                      </h3>
                      <div className="space-y-6">
                          {clinic.landmarks.map((lm, idx) => (
                             <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:-translate-x-2 transition-all group overflow-hidden">
                                 <div className="flex items-center gap-4 mb-3">
                                    <div className="h-6 w-1 bg-red-600 rounded-full" />
                                    <p className="text-red-600 font-extrabold text-xl">{lm.dist}</p>
                                 </div>
                                 <p className="text-[#013b82] font-black text-[18px] leading-snug group-hover:text-emerald-500 transition-colors uppercase tracking-tight">
                                   {lm.name} UniCare
                                 </p>
                             </div>
                          ))}
                      </div>
                  </div>
             </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ClinicDetails;
