"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { slugify } from "../../../lib/utils";
import { Calendar, User, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import authService from "@/lib/authService";

interface Blog {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  image_url: string;
  author: string;
  createdAt: string;
  status: string;
}

const BlogDetails = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlogDetails();
      fetchRecentBlogs();
    }
    window.scrollTo(0, 0);
  }, [slug]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getPublicBlogByTitle(slug as string);
      if (data) {
        setBlog(data);
      } else {
        router.push("/blogs");
      }
    } catch (error) {
      console.error("Error fetching blog details:", error);
      router.push("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBlogs = async () => {
    try {
      const data = await settingsApi.getPublicBlogs(5, 0);
      setRecentBlogs(data || []);
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
    }
  };

  const getImageUrl = (url: string) => {
    return authService.getFileUrl(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-40 pb-20 container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-12 w-3/4 bg-slate-100 rounded" />
            <div className="aspect-video w-full bg-slate-100 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-2/3 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white selection:bg-primary/10">
      <Header />

      <main className="pt-32 pb-20">
        {/* Breadcrumbs */}
        <div className="bg-slate-50 border-b border-slate-100 py-4 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
              <ChevronRight size={12} />
              <span className="text-primary truncate max-w-[200px] md:max-w-none">{blog.title}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <article className="lg:w-[70%]">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    Wellness Guide
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <Calendar size={14} className="text-primary" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight font-heading mb-8">
                  {blog.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {blog.author ? blog.author[0] : 'D'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-widest">By {blog.author || 'UniCare Team'}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Specialist in Homeopathic Care</p>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="rounded-[3rem] overflow-hidden shadow-2xl mb-12 border-8 border-white bg-slate-50">
                <img
                  src={getImageUrl(blog.image_url)}
                  alt={blog.title}
                  className="w-full h-auto object-cover max-h-[600px] hover:scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Short Description / Lead */}
              {blog.short_description && (
                <div className="mb-10 p-8 bg-slate-50 rounded-[2rem] border-l-4 border-primary italic text-lg text-slate-600 leading-relaxed font-medium">
                  {blog.short_description.replace(/Dr\. Care/gi, "UniCare")}
                </div>
              )}

              {/* Content area */}
              <div
                className="prose prose-slate prose-lg max-w-none font-serif prose-headings:font-black prose-headings:text-slate-900 prose-headings:mt-12 prose-headings:mb-4 prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-6 prose-strong:text-slate-900 prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{
                  __html: (blog.long_description?.includes('<p>') || blog.long_description?.includes('</h2>')
                    ? blog.long_description
                    : blog.long_description?.split('\n').filter(p => p.trim()).map(p => `<p>${p.trim()}</p>`).join('') || '')
                    .replace(/Dr\. Care/gi, "UniCare")
                }}
              />

              {/* Bottom Navigation */}
              <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center">
                <Link href="/blogs" className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-[0.2em] group">
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to All Stories
                </Link>
                <div className="flex gap-4">
                  {/* Social share icons can go here */}
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="lg:w-[30%] space-y-12">
              {/* Recent Stories Sidebar */}
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 sticky top-32">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <div className="h-4 w-1 bg-primary rounded-full" />
                  Recent Stories
                </h4>

                <div className="space-y-6">
                  {recentBlogs.filter(b => b.id !== blog.id).slice(0, 4).map((rBlog) => (
                    <Link
                      key={rBlog.id}
                      href={`/blog/${rBlog.slug || slugify(rBlog.title)}`}
                      className="group flex gap-4 items-start"
                    >
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                        <img
                          src={getImageUrl(rBlog.image_url)}
                          alt={rBlog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h5 className="text-[13px] font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {rBlog.title}
                        </h5>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">
                          {new Date(rBlog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-200">
                  <div className="bg-primary/95 text-white p-8 rounded-[2rem] relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-all duration-700" />
                    <h5 className="text-xl font-black mb-3">Free Consultation</h5>
                    <p className="text-white/80 text-xs mb-6 font-medium leading-relaxed">Let our experts help you find the root cause of your health concerns.</p>
                    <Link
                      href="/#appointment"
                      className="bg-white text-primary px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg inline-block hover:scale-105 transition-transform"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default BlogDetails;
