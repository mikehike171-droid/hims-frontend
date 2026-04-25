import { useState, useEffect } from "react";
import { X } from "lucide-react";
import authService from "@/lib/authService";

const AppointmentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", reason: "" });

  useEffect(() => {
    const handleOpenPopup = () => setIsOpen(true);
    window.addEventListener("open-appointment-popup", handleOpenPopup);

    return () => {
      window.removeEventListener("open-appointment-popup", handleOpenPopup);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const SETTINGS_API_URL = authService.getSettingsApiUrl();
      const response = await fetch(`${SETTINGS_API_URL}/enquiry/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (!response.ok) throw new Error('Failed to book appointment');
      
      window.dispatchEvent(new CustomEvent("booking-success"));
      setIsOpen(false);
    } catch (error) {
      console.error('Submission error:', error);
      alert("There was an issue processing your request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Premium Backdrop with deep blur */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-700 animate-in fade-in"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.25)] overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">

        {/* Right-aligned Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-[#1B7A43] hover:text-white transition-all duration-300 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#1B7A43]/10 text-[#1B7A43] mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <h2 className="text-3xl font-black text-[#1B7A43] leading-tight mb-3">
              Book Appointment
            </h2>
            <p className="text-slate-500 font-medium px-4">
              Book your priority consultation today and start your journey to natural recovery.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A43] focus:bg-white transition-all duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A43] focus:bg-white transition-all duration-300"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Medical Concern (e.g. Asthma, Thyroid)"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A43] focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1B7A43] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#1B7A43]/20 hover:bg-[#155e34] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4"
            >
              Confirm Appointment
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-tighter">
              Fast-track your clinical recovery with UniCare today.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPopup;
