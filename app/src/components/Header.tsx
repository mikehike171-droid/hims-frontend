import { useState, useEffect } from "react";
import { Phone, Search, Facebook, Instagram, Youtube, Linkedin, Menu, X, ChevronDown, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { settingsApi } from "@/lib/settingsApi";

const TopBar = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-foreground text-primary-foreground text-sm hidden md:block">
      <div className="container mx-auto flex items-center justify-between py-2 px-4">
        <div className="flex items-center gap-4">
          <span className="hover:text-teal-light cursor-pointer transition-colors">{t('International')}</span>
          <span className="text-muted-foreground">|</span>
          <span className="hover:text-teal-light cursor-pointer transition-colors">{t('Media')}</span>
          <span className="text-muted-foreground">|</span>
          <span className="hover:text-teal-light cursor-pointer transition-colors">{t('Testimonials')}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-primary-foreground/10 rounded-full px-3 py-1">
            <input
              type="text"
              placeholder={t('Type to start searching...')}
              className="bg-transparent text-primary-foreground placeholder:text-primary-foreground/50 text-xs outline-none w-40"
            />
            <Search className="w-3 h-3" />
          </div>
          <div className="flex items-center gap-3">
            <Facebook className="w-4 h-4 hover:text-teal-light cursor-pointer transition-colors" />
            <Instagram className="w-4 h-4 hover:text-teal-light cursor-pointer transition-colors" />
            <Youtube className="w-4 h-4 hover:text-teal-light cursor-pointer transition-colors" />
            <Linkedin className="w-4 h-4 hover:text-teal-light cursor-pointer transition-colors" />
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-1 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
            {t('Pay Now')}
          </button>
          <LanguageSelector white />
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [clinicsData, setClinicsData] = useState<any[]>([]);
  const [treatmentsData, setTreatmentsData] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);

    fetchClinics();
    fetchTreatments();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const fetchTreatments = async () => {
    try {
      const treatments = await settingsApi.getPublicTreatments();
      console.log("Treatments Data Header:", treatments);

      // Group treatments by specific categories as requested
      const categories = [
        { key: "Treatments", display: t("Treatments") },
        { key: "Skin Treatment", display: t("Skin Treatment") },
        { key: "Seasonal Treatment", display: t("Seasonal Treatment") },
        { key: "Women's Treatment", display: t("Women's Treatment") },
        { key: "Hair Treatment", display: t("Hair Treatment") }
      ];

      const grouped = categories.map(cat => ({
        category: cat.display,
        key: cat.key,
        items: treatments.filter((t: any) => {
          const tCat = (t.category || "").toLowerCase();
          const tName = (t.name || "").toLowerCase();
          
          if (cat.key === "Skin Treatment") return tCat.includes("skin") || tName.includes("psoriasis") || tName.includes("hyperpigmentation") || tName.includes("ichthyosis") || tName.includes("lichen planus") || tName.includes("lipoma") || tName.includes("pityriasis") || tName.includes("urticaria") || tName.includes("vitiligo");
          if (cat.key === "Seasonal Treatment") return tCat.includes("season") || tCat.includes("respiratory") || tName.includes("allergic") || tName.includes("allergy") || tName.includes("asthma") || tName.includes("breathlessness") || tName.includes("bronchitis") || tName.includes("nose block") || tName.includes("sinusitis") || tName.includes("tonsillitis");
          if (cat.key === "Women's Treatment") return tCat.includes("women") || tName.includes("fibroids") || tName.includes("infertility") || tName.includes("menses") || tName.includes("leucorrhoea") || tName.includes("pcos") || tName.includes("uterine") || tName.includes("hypothyroidism") || tName.includes("hyperthyroidism");
          if (cat.key === "Hair Treatment") return tCat.includes("hair") || tName.includes("alopecia") || tName.includes("hair loss");
          if (cat.key === "Treatments") {
             // Default column for everything else that doesn't fit in specific categories
             const isOther = !(
               tCat.includes("skin") || tName.includes("psoriasis") || tName.includes("hyperpigmentation") || tName.includes("ichthyosis") || tName.includes("lichen planus") || tName.includes("lipoma") || tName.includes("pityriasis") || tName.includes("urticaria") || tName.includes("vitiligo") ||
               tCat.includes("season") || tCat.includes("respiratory") || tName.includes("allergic") || tName.includes("allergy") || tName.includes("asthma") || tName.includes("breathlessness") || tName.includes("bronchitis") || tName.includes("nose block") || tName.includes("sinusitis") || tName.includes("tonsillitis") ||
               tCat.includes("women") || tName.includes("fibroids") || tName.includes("infertility") || tName.includes("menses") || tName.includes("leucorrhoea") || tName.includes("pcos") || tName.includes("uterine") || tName.includes("hypothyroidism") || tName.includes("hyperthyroidism") ||
               tCat.includes("hair") || tName.includes("alopecia") || tName.includes("hair loss")
             );
             return isOther || tName.includes("acidity") || tName.includes("thyroid") || tName.includes("anxiety") || tName.includes("migraine") || tName.includes("arthritis") || tName.includes("diabetes") || tName.includes("piles") || tName.includes("fissure") || tName.includes("kidney stones") || tName.includes("fatty liver");
          }
          return false;
        }).map((t: any) => ({ name: t.name, path: t.slug || t.id }))
      }));

      setTreatmentsData(grouped);
    } catch (error: any) {
      console.error("Error fetching treatments for header:", error);
      setFetchError(`Treatments: ${error.message}`);
    }
  };

  const fetchClinics = async () => {
    try {
      const branches = await settingsApi.getPublicBranches();
      console.log("Header: Fetched branches:", branches);
      
      if (!Array.isArray(branches)) {
        console.warn("Header: Invalid response for branches", branches);
        setFetchError("Clinics: Invalid API response");
        setClinicsData([]);
        return;
      }

      if (branches.length === 0) {
        console.warn("Header: No branches found");
        setClinicsData([]);
        return;
      }

      // Group branches by state dynamically
      const groupedMap: { [key: string]: any[] } = {};
      
      branches.forEach((b: any) => {
        const stateName = b.state || "Andhra Pradesh";
        const stateUpper = stateName.toUpperCase();
        if (!groupedMap[stateUpper]) {
          groupedMap[stateUpper] = [];
        }
        groupedMap[stateUpper].push({ name: b.name, path: b.slug });
      });

      const grouped = Object.keys(groupedMap).map(state => ({
        state,
        cities: groupedMap[state]
      })).sort((a, b) => a.state.localeCompare(b.state));

      console.log("Header: Grouped clinics data:", grouped);
      setClinicsData(grouped);
      setFetchError(null);
    } catch (error: any) {
      console.error("Error fetching clinics for header:", error);
      setFetchError(`Clinics: ${error.message}`);
      setClinicsData([]);
    }
  };

  const navLinks = [
    { label: t('Home'), href: "/" },
    { label: t('Treatments'), href: "#", hasDropdown: true },
    { label: t('Clinics'), href: "#", hasDropdown: true },
    { label: t('Blogs'), href: "/blogs", hasDropdown: false },
    { label: t('About Us'), href: "/#about", hasDropdown: false },
    { label: t('Contact Us'), href: "/#appointment", hasDropdown: false },
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-background shadow-md'}`}>
      <div className="container mx-auto relative flex items-center justify-between py-3 px-4">
        <Link href="/">
          <img src={logo.src} alt="UniCare Homeopathy" className="h-14 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          {fetchError && (
            <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-[10px] text-center z-[100] py-1">
              Error: {fetchError}
            </div>
          )}
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative group h-full flex items-center"
              onMouseEnter={() => link.hasDropdown && setActiveMenu(link.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {link.href.startsWith('/') ? (
                <Link
                  href={link.href}
                  className={`text-foreground font-medium text-sm hover:text-primary transition-colors flex items-center gap-1 font-heading py-4 ${activeMenu === link.label ? 'text-primary' : ''}`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className={`text-foreground font-medium text-sm hover:text-primary transition-colors flex items-center gap-1 font-heading py-4 ${activeMenu === link.label ? 'text-primary' : ''}`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Megamenu for Clinics */}
        {activeMenu === t('Clinics') && clinicsData.length > 0 && (
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-white shadow-2xl rounded-2xl border border-slate-100 p-8 grid grid-cols-2 gap-8 z-50 animate-in fade-in zoom-in-95 duration-200"
            onMouseEnter={() => setActiveMenu(t('Clinics'))}
            onMouseLeave={() => setActiveMenu(null)}
          >
            {clinicsData.map((stateGrp) => (
              <div key={stateGrp.state}>
                <h4 className="text-[#1a2e5a] font-black tracking-tight text-[15px] mb-4 border-b-2 border-primary/20 pb-2 inline-block">{stateGrp.state}</h4>
                <ul className="space-y-3 mt-2">
                  {stateGrp.cities.map((city: any) => (
                    <li key={city.name} className="group/item">
                      <Link
                        href={`/clinics/${city.path}`}
                        className="text-slate-600 hover:text-primary transition-all duration-300 flex items-center gap-3 text-[14px] font-bold"
                        onClick={() => setActiveMenu(null)}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover/item:bg-primary transition-colors" />
                        {city.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Megamenu for Treatments */}
        {activeMenu === t('Treatments') && (
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 w-[1100px] bg-[#f8fbfe] shadow-2xl rounded-2xl border border-slate-100 p-10 z-50 animate-in fade-in zoom-in-95 duration-200"
            onMouseEnter={() => setActiveMenu(t('Treatments'))}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {treatmentsData.length > 0 ? (
                treatmentsData.map((catGrp) => (
                  <div key={catGrp.category} className="flex flex-col h-full">
                    <h4 className="text-[#004a89] font-black tracking-tight text-[16px] mb-6 font-heading">
                      {catGrp.category}
                    </h4>
                    <ul className="space-y-2 mt-2 flex-grow">
                      {catGrp.items.slice(0, 5).map((item: any) => (
                        <li key={item.name} className="group/item border-b border-slate-100 pb-2 last:border-0">
                          <Link
                            href={`/treatment/${item.path}`}
                            className="text-slate-500 hover:text-primary transition-all duration-300 flex items-center gap-2 text-[13px] font-medium"
                            onClick={() => setActiveMenu(null)}
                          >
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    
                    {catGrp.items.length > 5 && (
                      <Link 
                          href="/specialties" 
                          className="mt-6 text-[13px] font-black text-[#1a2e5a] flex items-center gap-1 hover:gap-2 transition-all group/all"
                          onClick={() => setActiveMenu(null)}
                      >
                          {t('View More')}
                          <ArrowRight className="w-3 h-3 group-hover/all:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-3 lg:col-span-5 text-center py-4 text-slate-400 font-medium">
                  Loading treatments...
                </div>
              )}
            </div>
          </div>
        )}

        <a
          href="tel:+919553387472"
          className="hidden lg:flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Phone className="w-4 h-4" />
          +91 95533 87472
        </a>

        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border px-4 py-4 space-y-3 bg-background">
          {navLinks.map((link) => (
            <div key={link.label}>
              {link.hasDropdown ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 text-foreground font-medium font-heading">
                    {link.label}
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <div className="pl-4 space-y-2 border-l-2 border-slate-100 ml-1">
                    {link.label === t('Clinics') && clinicsData.map((stateGrp: any) => (
                      <div key={stateGrp.state} className="space-y-1">
                        <span className="text-[10px] uppercase font-black text-slate-300 block mt-2">{stateGrp.state}</span>
                        {stateGrp.cities.map((city: any) => (
                          <Link
                            key={city.name}
                            href={`/clinics/${city.path}`}
                            className="block py-1 text-slate-500 text-sm font-bold"
                            onClick={() => setMobileOpen(false)}
                          >
                            {city.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                    {link.label === t('Treatments') && treatmentsData.map((cat: any) => (
                      <div key={cat.category} className="space-y-1">
                        {cat.category !== "Others" && (
                          <span className="text-[10px] uppercase font-black text-slate-300 block mt-2">{cat.category}</span>
                        )}
                        {cat.items.map((item: any) => (
                          <Link
                            key={item.name}
                            href={`/treatment/${item.path}`}
                            className="block py-1 text-slate-500 text-sm font-bold"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block text-foreground font-medium py-2 hover:text-primary transition-colors font-heading"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
          <a
            href="tel:+919553387472"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold justify-center"
          >
            <Phone className="w-4 h-4" />
            +91 95533 87472
          </a>
          <div className="pt-2">
            <LanguageSelector />
          </div>
        </div>
      )}
    </nav>
  );
};

const Header = () => (
  <>
    <TopBar />
    <Navbar />
  </>
);

export default Header;
