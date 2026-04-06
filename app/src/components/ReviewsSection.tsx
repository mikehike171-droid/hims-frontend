import { Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const reviews = [
  { name: "Manikumar T", text: "My son frequently experienced fever and coughing fits. We spoke with Dr. Sudhir Sir, who is excellent at treating patients like close friends. Now my son is doing good.", rating: 4 },
  { name: "Manish Mudhiraj", text: "I had breathing problem, so I went to UniCare Homeopathy six months ago and now I am feeling much better. Best clinic.", rating: 5 },
  { name: "Shiva Prasad", text: "UniCare Homeopathy gave me the right care and I feel much improved. Highly recommend their services.", rating: 4 },
  { name: "Varun", text: "UniCare Homeopathy treatment gave me steady and real relief. Great doctors and caring staff.", rating: 5 },
  { name: "Arya Varma", text: "Front office team assisted me with everything. Doctor's treatment was very helpful. Good support from the Manager and team.", rating: 5 },
  { name: "Sudha Paritala", text: "I visited for migraine treatment. I found Dr. Care homeopathy very helpful & effective. I recommend other patients too.", rating: 5 },
];

const ReviewsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-6 bg-muted" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-700 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="section-heading">Best Reviews</h2>
          <h3 className="text-lg text-muted-foreground text-center mt-2 font-heading">
            Hear from our 44 lakh+ happy patients
          </h3>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm font-bold text-foreground">EXCELLENT</span>
            <span className="text-sm text-muted-foreground">Based on <strong>10000+ reviews</strong></span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {reviews.map((r, i) => (
            <div
              key={r.name}
              className={`bg-card rounded-xl p-6 shadow-sm border border-border hover:shadow-lg hover:-translate-y-2 transition-all duration-500 group ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                  {r.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{r.name}</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="#" className="text-primary font-semibold hover:underline hover:tracking-wider transition-all duration-300">
            View All Success Stories →
          </a>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
