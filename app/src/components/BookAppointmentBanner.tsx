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
        
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-heading leading-[1.1] mb-4 tracking-tight">
          Experience Trusted & Personalized Care at <span className="text-orange-500">UNICARE HOMEOPATHY</span>
        </h2>
        <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-300 uppercase tracking-wider mb-8 font-heading">
          Book Your Appointment Today!
        </h3>

        <div className="max-w-4xl mx-auto space-y-6 text-white/90 text-base md:text-lg leading-relaxed font-medium mb-8">
          <p>
            Proudly recognized as one of South India’s leading and largest homeopathy healthcare chains,{" "}
            <strong className="text-white font-black">UNICARE HOMEOPATHY</strong> is dedicated to providing safe, effective, and holistic treatment tailored to every individual.
          </p>
          <p>
            Our experienced doctors focus on identifying the root cause of health concerns and offering personalized homeopathic care designed to promote long-term wellness and improve overall quality of life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto mb-10 text-left">
          {[
            "Expert Medical Consultation",
            "Personalized Treatment Plans",
            "Safe & Holistic Healing",
            "Compassionate Patient Care",
            "Trusted by Thousands of Families"
          ].map((item, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-center gap-3 hover:bg-white/20 transition-all duration-300">
              <span className="text-xl shrink-0">✨</span>
              <span className="text-white font-bold text-sm tracking-tight">{item}</span>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
          <p className="text-emerald-200 text-lg md:text-xl font-bold italic">
            Take the first step towards a healthier and happier future.
          </p>
          <p className="text-white font-extrabold text-base md:text-lg bg-black/20 inline-block px-6 py-3 rounded-full border border-white/10">
            📞 Book your appointment today and experience healthcare you can truly trust.
          </p>
        </div>

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
