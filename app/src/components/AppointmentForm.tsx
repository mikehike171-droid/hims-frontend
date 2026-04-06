import { useState } from "react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const AppointmentForm = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "" });
  const { ref, isVisible } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Appointment request submitted! We will contact you shortly.");
    setForm({ name: "", phone: "", email: "", reason: "" });
  };

  return (
    <section className="py-8 hero-gradient" id="appointment" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`max-w-2xl mx-auto bg-secondary/90 backdrop-blur rounded-2xl p-8 md:p-12 shadow-2xl transition-all duration-700 ${isVisible ? "animate-scale-in opacity-100" : "opacity-0"}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-primary text-center font-heading">
            Book an Appointment
          </h2>
          <p className="text-muted-foreground text-center mt-2">
            Please fill out the form below to schedule your appointment.
          </p>

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
                className="bg-primary text-primary-foreground px-10 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300 text-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;
