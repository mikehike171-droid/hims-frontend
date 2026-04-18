import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface AppointmentFormProps {
  theme?: "light" | "dark";
  source?: string;
}

const AppointmentForm = ({ theme = "light", source = "General" }: AppointmentFormProps) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { ref, isVisible } = useScrollAnimation();

  const isDark = theme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_SETTINGS_API_URL || 'http://127.0.0.1:3002/api';
      const response = await fetch(`${API_URL}/enquiry/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          source: source,
          submittedAt: new Date().toISOString()
        })
      });
      
      if (!response.ok) throw new Error('Failed to book appointment');
      
      setSubmitted(true);
      window.dispatchEvent(new CustomEvent("booking-success"));
      setForm({ name: "", phone: "", email: "", reason: "" });
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      alert("There was an issue processing your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isDark) {
    return (
      <div className="w-full" ref={ref}>
        {submitted ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Request Sent!</h4>
            <p className="text-emerald-100/70 text-sm">Our team will call you back within 15 minutes.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Full Name *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              <div className="relative group">
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all duration-300"
                />
              </div>
              <textarea
                placeholder="Briefly describe your health concern..."
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/10 transition-all duration-300 resize-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transform hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Confirm Booking
                  <CheckCircle2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-white/40 uppercase tracking-widest font-bold pt-2">
              🔒 Privacy Guaranteed. Safe Homeopathy.
            </p>
          </form>
        )}
      </div>
    );
  }

  return (
    <section className="py-8 hero-gradient" id="appointment" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`max-w-4xl mx-auto bg-white rounded-[3rem] p-10 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-5xl font-black text-[#1B7A43] uppercase font-heading leading-tight mb-4">
              Book an Appointment
            </h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              Please fill out the form below to schedule your visit with our expert medical team.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 hover:shadow-md"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 hover:shadow-md"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 hover:shadow-md"
              />
            </div>
            <input
              type="text"
              placeholder="Reason of visit"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-300 hover:shadow-md"
            />
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1B7A43] text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 hover:bg-[#155e34] hover:shadow-2xl active:scale-95 transition-all duration-300 disabled:opacity-70"
              >
                {loading ? "Processing..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
