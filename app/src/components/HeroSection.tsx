import heroMedicine from "@/assets/4.png";
import { useLanguage } from "@/i18n/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="container mx-auto px-4 py-4 md:py-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 z-10 animate-fade-in-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground leading-tight font-heading">
            {'Complete Homeopathic Care'.toUpperCase()}
          </h1>
          <p className="text-primary-foreground/80 text-lg mt-4 max-w-lg">
            {'Natural Healing for Modern Health'}
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-appointment-popup"))}
            className="inline-block mt-8 bg-accent text-accent-foreground px-8 py-3 rounded-lg font-semibold text-base hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            {'Book Appointment'}
          </button>
        </div>
        <div className="flex-1 flex justify-center md:justify-end animate-fade-in-right">
          <img
            src={heroMedicine.src}
            alt="UNICARE HOMEOPATHY Medicine"
            width={800}
            height={900}
            className="max-h-[500px] w-auto rounded-[2rem] object-cover drop-shadow-2xl animate-float"
          />
        </div>
      </div>
      <div className="absolute top-10 right-20 opacity-20 hidden md:block animate-pulse-soft">
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary-foreground" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
