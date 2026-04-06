import { useState, useEffect } from "react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLanguage } from "@/i18n/LanguageContext";
import { settingsApi } from "@/lib/settingsApi";
import { slugify } from "../../../lib/utils";

const BlogSection = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching public blogs...");
        const data = await settingsApi.getPublicBlogs();
        console.log("✅ Blogs data received:", data?.length, "entries");
        if (data && data.length > 0) {
          setBlogs(data);
        }
      } catch (error) {
        console.error("❌ Error fetching public blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const getImageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_SETTINGS_API_URL}${url}`;
  };

  // Always show only the first 3 on the home page
  const displayedBlogs = blogs.slice(0, 3);

  // If no blogs and not loading, hide section
  if (!loading && blogs.length === 0) return null;

  return (
    <section className="py-12 bg-white" id="blogs" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`transition-all duration-700 ${isVisible ? "animate-fade-in-up opacity-100" : "opacity-0"}`}>
          <h2 className="section-heading text-center mb-12">{t('Our Blogs')}</h2>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-3xl h-[450px] animate-pulse border border-slate-100" />
            ))
          ) : (
            displayedBlogs.map((b, i) => (
              <div
                key={b.id || b.title}
                className={`treatment-card group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up`}
                style={{ animationDelay: `${(i % 3) * 150}ms` }}
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <img
                    src={getImageUrl(b.image_url)}
                    alt={b.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 bg-slate-100"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B7A43] bg-[#1B7A43]/5 px-2 py-1 rounded">
                      {t('Wellness')}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <Link href={`/blog/${slugify(b.title)}`}>
                    <h3 className="text-lg font-bold text-foreground font-heading line-clamp-2 group-hover:text-[#1B7A43] transition-colors duration-300 min-h-[3.5rem]">
                      {b.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed">
                    {b.short_description}
                  </p>
                  <div className="mt-5 pt-5 border-t border-slate-100">
                    <Link href={`/blog/${slugify(b.title)}`} className="text-[#1B7A43] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group/link">
                      {t('Read Story')}
                      <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && blogs.length > 0 && (
          <div className="flex justify-center mt-12 animate-fade-in-up">
            <Link 
              href="/blogs"
              className="bg-[#1B7A43] text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#155e34] hover:shadow-xl transition-all duration-300 inline-flex items-center shadow-lg"
            >
              {t('View All Blogs')}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
