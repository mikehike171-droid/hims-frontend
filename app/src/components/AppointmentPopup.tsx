import { useState, useEffect } from "react";
import { X } from "lucide-react";
import authService from "@/lib/authService";

const AppointmentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", reason: "", location: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOpenPopup = () => setIsOpen(true);
    window.addEventListener("open-appointment-popup", handleOpenPopup);

    // Show popup after 3 seconds on initial load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000);

    return () => {
      window.removeEventListener("open-appointment-popup", handleOpenPopup);
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      setForm({ name: "", phone: "", reason: "", location: "" });
    } catch (error) {
      console.error('Submission error:', error);
      alert("There was an issue processing your request. Please try again.");
    } finally {
      setLoading(false);
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
        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
               <img src="/appointment-illustration.png" className="w-24 h-24 object-contain mx-auto animate-float" alt="Appointment" />
            </div>
            <h2 className="text-2xl font-black text-[#1B7A43] leading-tight mb-2">
              Book Appointment
            </h2>
            <p className="text-slate-500 text-sm font-medium px-4">
              Join thousands of patients who found natural recovery with UniCare Homeopathy.
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
                  placeholder="Your Location / City"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
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
              disabled={loading}
              className="w-full bg-[#1B7A43] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[#1B7A43]/20 hover:bg-[#155e34] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 mt-4 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Confirm Appointment"}
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
