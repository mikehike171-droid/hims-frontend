import { useState, useEffect } from "react";
import { Phone, Search, Facebook, Instagram, Youtube, Linkedin, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";

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
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t('Home'), href: "/" },
    { label: t('Treatments'), href: "/#treatments", hasDropdown: false },
    { label: t('Clinics'), href: "#", hasDropdown: true },
    { label: t('Blogs'), href: "/blogs", hasDropdown: false },
    { label: t('About Us'), href: "/#about", hasDropdown: false },
    { label: t('Contact Us'), href: "/#appointment", hasDropdown: false },
  ];

  const clinicsData = [
    {
      state: "ANDHRA PRADESH",
      cities: [
        { name: "Narasaraopet", path: "narasaraopet" },
        { name: "Ongole", path: "ongole" },
      ]
    },
    {
      state: "TELANGANA",
      cities: [
        { name: "Nalgonda", path: "nalgonda" },
      ]
    }
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-background shadow-md'}`}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        <Link href="/">
          <img src={logo.src} alt="UniCare Homeopathy" className="h-14 w-auto" />
        </Link>
        
        <div className="hidden lg:flex items-center gap-8 h-full">
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

              {/* Megamenu for Clinics */}
              {link.label === t('Clinics') && activeMenu === link.label && (
                <div className="absolute top-[90%] left-1/2 -translate-x-1/2 w-[500px] bg-white shadow-2xl rounded-2xl border border-slate-100 p-8 grid grid-cols-2 gap-8 z-50 animate-in fade-in zoom-in-95 duration-200">
                  {clinicsData.map((stateGrp) => (
                    <div key={stateGrp.state}>
                      <h4 className="text-[#1a2e5a] font-black tracking-tight text-[15px] mb-4 border-b-2 border-primary/20 pb-2 inline-block">{stateGrp.state}</h4>
                      <ul className="space-y-3 mt-2">
                        {stateGrp.cities.map(city => (
                          <li key={city.name} className="group/item">
                            <Link 
                              href={`/clinics/${city.path}`} 
                              className="text-slate-600 hover:text-primary transition-all duration-300 flex items-center gap-3 text-[14px] font-bold"
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
            </div>
          ))}
        </div>

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
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-foreground font-medium py-2 hover:text-primary transition-colors font-heading"
                  onClick={() => setMobileOpen(false)}
                >
                 {link.label}
               </Link>
             ) : (
               <a
                 key={link.label}
                 href={link.href}
                 className="block text-foreground font-medium py-2 hover:text-primary transition-colors font-heading"
                 onClick={() => setMobileOpen(false)}
               >
                 {link.label}
               </a>
             )
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
