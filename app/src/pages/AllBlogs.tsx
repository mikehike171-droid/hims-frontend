"use client"

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import Link from "next/link";
import { slugify } from "../../../lib/utils";
import authService from "@/lib/authService";

const AllBlogs = () => {
  const { t } = useLanguage();
  const { ref, isVisible } = useScrollAnimation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  useEffect(() => {
    fetchInitialBlogs();
    window.scrollTo(0, 0);
  }, []);

  const fetchInitialBlogs = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getPublicBlogs(LIMIT, 0);
      setBlogs(data || []);
      if (!data || data.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching initial blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const newOffset = offset + LIMIT;
      const data = await settingsApi.getPublicBlogs(LIMIT, newOffset);
      
      if (data && data.length > 0) {
        setBlogs(prev => [...prev, ...data]);
        setOffset(newOffset);
        if (data.length < LIMIT) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const getImageUrl = (url: string) => {
    return authService.getFileUrl(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-heading">
              Our <span className="text-[#1B7A43]">Wellness Blogs</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Explore our comprehensive guides and articles on homeopathic treatments, health tips, and natural wellness.
            </p>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 rounded-3xl h-[400px] animate-pulse" />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <p className="text-gray-500 font-medium">No blog posts found at the moment.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((b, i) => (
                  <div
                    key={b.id || b.title}
                    className="treatment-card group hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                    style={{ animationDelay: `${(i % 3) * 150}ms` }}
                  >
                    <Link href={`/blog/${b.slug || slugify(b.title)}`} className="overflow-hidden aspect-[4/3] block">
                      <img
                        src={getImageUrl(b.image_url)}
                        alt={b.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#1B7A43] bg-[#1B7A43]/5 px-2 py-1 rounded">
                          {t('Wellness')}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Link href={`/blog/${b.slug || slugify(b.title)}`}>
                        <h3 className="text-lg font-bold text-foreground font-heading line-clamp-2 group-hover:text-[#1B7A43] transition-colors duration-300 min-h-[3.5rem]">
                          {b.title}
                        </h3>
                      </Link>
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2 leading-relaxed">
                        {b.short_description}
                      </p>
                      <div className="mt-5 pt-5 border-t border-slate-100">
                        <Link href={`/blog/${b.slug || slugify(b.title)}`} className="text-[#1B7A43] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group/link">
                          {t('Read Story')}
                          <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-16">
                  <button 
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="bg-[#1B7A43] text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:scale-105 hover:bg-[#155e34] hover:shadow-xl transition-all duration-300 inline-flex items-center shadow-lg disabled:opacity-50"
                  >
                    {loadingMore ? 'Loading More...' : 'Load More Stories'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default AllBlogs;
