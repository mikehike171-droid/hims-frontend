import { useState, useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

/**
 * BookingSuccessModal
 * A premium, animated success modal triggered by the 'booking-success' global event.
 */
const BookingSuccessModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleSuccess = () => {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => setIsVisible(false), 5000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("booking-success", handleSuccess);
    return () => window.removeEventListener("booking-success", handleSuccess);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-500"
        onClick={() => setIsVisible(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.3)] p-10 text-center animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Success Animation Container */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-[#1B7A43]/10 rounded-full scale-[1.6] animate-ping" />
          <div className="relative w-20 h-20 bg-[#1B7A43] rounded-full flex items-center justify-center shadow-lg shadow-[#1B7A43]/30 animate-in zoom-in duration-700">
            <CheckCircle2 className="w-10 h-10 text-white animate-in slide-in-from-bottom-2 duration-1000 fill-white/10" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-[#1B7A43] uppercase tracking-tight">
            Thank You!
          </h2>
          <p className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-tighter">
            Your appointment request has been <br />
            <span className="text-[#1B7A43]">Successfully submitted</span>
          </p>
          <div className="h-[1px] w-12 bg-slate-100 mx-auto mt-6" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] pt-2">
            Our medical experts will <br />contact you shortly.
          </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => setIsVisible(false)}
          className="mt-10 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          Close Window
        </button>
      </div>

      <style jsx>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.8; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default BookingSuccessModal;
