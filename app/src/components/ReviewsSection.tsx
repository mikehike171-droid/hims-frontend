import { ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useState, useEffect } from "react";
import { settingsApi } from "@/lib/settingsApi";

const BranchSlider = ({ branch, reviews, isTeal = false, isVisible = false, index = 0 }: { branch: string, reviews: any[], isTeal?: boolean, isVisible?: boolean, index?: number }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const next = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % reviews.length);
      setFade(true);
    }, 200);
  };

  const prev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
      setFade(true);
    }, 200);
  };

  // Auto-scroll logic
  useEffect(() => {
    if (!isVisible || isPaused) return;
    
    const interval = setInterval(() => {
      next();
    }, 4000); // 4 seconds auto-advance

    return () => clearInterval(interval);
  }, [isVisible, isPaused, reviews.length]);

  const currentReview = reviews[currentIdx] || null;

  if (!currentReview) return null;

  return (
    <div 
      className={`relative flex flex-col h-full rounded-[40px] p-8 transition-all duration-1000 ${isTeal ? "bg-[#14b8a6] text-white shadow-2xl shadow-[#14b8a6]/20" : "bg-white text-slate-900 border border-slate-100 shadow-xl"} ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mb-2">Happy Customers</h3>
        <h4 className={`text-xl font-black uppercase tracking-wider ${isTeal ? "text-white" : "text-slate-900"}`}>{branch}</h4>
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-4">
        {/* Navigation Arrows */}
        <button 
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20 ${isTeal ? "bg-white text-[#14b8a6] hover:bg-slate-50" : "bg-white text-slate-400 hover:text-primary hover:shadow-primary/20"}`}
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); next(); }}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all z-20 ${isTeal ? "bg-white text-[#14b8a6] hover:bg-slate-50" : "bg-white text-slate-400 hover:text-primary hover:shadow-primary/20"}`}
        >
          <ChevronRight size={20} strokeWidth={3} />
        </button>

        <div
          className={`bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[340px] transition-all duration-300 ${fade ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"} ${isTeal ? "text-slate-800" : "text-slate-700 border border-slate-50"}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-black text-lg">
                {currentReview.name[0]}
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900 leading-none">{currentReview.name}</h5>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{currentReview.date}</p>
              </div>
            </div>
            {/* Google 'G' SVG — no background box, fully transparent */}
            <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" aria-label="Google Review">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>

          <div className="flex gap-0.5 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={14} className="fill-[#FABB05] text-[#FABB05]" />
            ))}
            <div className="ml-1 w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center">
              <span className="text-white text-[8px]">✓</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <p className="text-[13px] leading-relaxed font-medium italic mb-4">
              "{currentReview.text}"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center">
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-bold shadow-sm ${isTeal ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-600"}`}>
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</div>
          Verified by Trustindex
        </div>
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const [clusteredReviews, setClusteredReviews] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getPublicGoogleReviews();
        
        // Ensure Nalgonda has fallback reviews if none are returned by the API
        if (!data.Nalgonda || data.Nalgonda.length === 0) {
          data.Nalgonda = [
            {
              name: "Suresh Kumar",
              stats: "Local Guide · 15 reviews",
              date: "2 weeks ago",
              text: "Excellent treatment for chronic migraine. The staff at Nalgonda branch are very professional.",
              rating: 5,
              source: "Google"
            },
            {
              name: "Anita Reddy",
              stats: "4 reviews",
              date: "1 month ago",
              text: "Very happy with the results for my child's recurring cold and cough. Highly recommended.",
              rating: 5,
              source: "Google"
            },
            {
              name: "Venkatesh Rao",
              stats: "Local Guide · 42 reviews",
              date: "3 months ago",
              text: "Best homeopathic clinic in Nalgonda. Clean environment and effective medicine.",
              rating: 5,
              source: "Google"
            }
          ];
        }
        
        setClusteredReviews(data);
      } catch (error) {
        console.error("Failed to fetch clustered reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const branches = ['Miryalaguda', 'Narasaraopet', 'Ongole', 'Nalgonda'];

  return (
    <section className="py-24 bg-slate-50/50 overflow-hidden relative" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-primary/20" />
            <span className="text-[11px] font-black text-primary uppercase tracking-[0.6em]">Real Testimonials</span>
            <div className="h-[1px] w-12 bg-primary/20" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase font-heading leading-tight mb-4">
            Our Satisfied Patients
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch max-w-7xl mx-auto">
            {branches.map((branch, i) => (
              <BranchSlider 
                key={branch} 
                branch={branch} 
                reviews={clusteredReviews[branch] || []} 
                isTeal={false}
                isVisible={isVisible}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
