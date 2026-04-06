import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const BookAppointmentBanner = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-8 bg-muted" id="appointment-banner" ref={ref}>
      <div className={`container mx-auto px-4 text-center transition-all duration-700 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
        <h2 className="section-heading">BOOK AN APPOINTMENT</h2>
        <p className="section-subheading">
          Experience trusted and personalized care with UniCare Homeopathy — proudly recognized as the{" "}
          <strong className="text-foreground">Best Homeopathy Clinic in Hyderabad</strong> and South India's largest
          homeopathy chain. Book your appointment today and begin your journey toward safe, effective, and holistic
          healing with expert guidance you can trust.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <a
            href="#appointment"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Make an Appointment
          </a>
          <a
            href="#"
            className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-all duration-300"
          >
            Find Your Nearest Clinic
          </a>
        </div>
      </div>
    </section>
  );
};

export default BookAppointmentBanner;
