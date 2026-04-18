import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const BookAppointmentBanner = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-20 bg-[#1B7A43] overflow-hidden relative" id="appointment-banner" ref={ref}>
      {/* Decorative medical-grade pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-[15deg] translate-x-1/2 pointer-events-none" />
      
      <div className={`container mx-auto px-4 text-center relative z-10 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-[1px] w-12 bg-white/30" />
          <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">Expert Care Guaranteed</span>
          <div className="h-[1px] w-12 bg-white/30" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase font-heading leading-[1.1] mb-8 tracking-tight">
          Book Your Appointment <span className="text-emerald-300 italic">Today</span>
        </h2>
        
        <p className="text-white/80 text-base md:text-lg max-w-4xl mx-auto leading-relaxed font-medium mb-10">
          Experience trusted and personalized care with UniCare Homeopathy — proudly recognized as the{" "}
          <span className="text-white font-black underline decoration-emerald-400 decoration-4 underline-offset-8 uppercase">Best Homeopathy Clinic in UniCare</span> and South India's largest
          homeopathy chain. Book your appointment today and begin your journey toward safe, effective, and holistic
          healing with expert guidance you can trust.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-appointment-popup"))}
            className="group bg-white text-[#1B7A43] px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-500 flex items-center gap-3 cursor-pointer"
          >
            Make an Appointment
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
          <a
            href="#"
            className="text-white font-black text-[10px] uppercase tracking-widest hover:underline decoration-emerald-300 decoration-2 underline-offset-8 transition-all"
          >
             Find Your Nearest Clinic
          </a>
        </div>
      </div>
    </section>
  );
};

export default BookAppointmentBanner;
