"use client"

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Mail, 
  Phone, 
  Upload, 
  Stethoscope, 
  UserCircle, 
  Users, 
  Pill, 
  Headphones, 
  Wallet,
  Building,
  ChevronDown
} from "lucide-react";
import { settingsApi } from "@/lib/settingsApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icon mapping for roles
const getRoleIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('doctor') || t.includes('physician') || t.includes('consultant')) return <Stethoscope className="w-10 h-10 text-primary" />;
  if (t.includes('front desk') || t.includes('reception')) return <UserCircle className="w-10 h-10 text-primary" />;
  if (t.includes('client') || t.includes('relation')) return <Users className="w-10 h-10 text-primary" />;
  if (t.includes('pharmacist') || t.includes('medicine')) return <Pill className="w-10 h-10 text-primary" />;
  if (t.includes('call center') || t.includes('executive') || t.includes('tele')) return <Headphones className="w-10 h-10 text-primary" />;
  if (t.includes('accountant') || t.includes('finance') || t.includes('collection')) return <Wallet className="w-10 h-10 text-primary" />;
  return <Briefcase className="w-10 h-10 text-primary" />;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
    job_id: "", // Will store the ID of the selected job
    resume: null as File | null
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getPublicJobs();
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openApplyModal = (jobId: string = "") => {
    setFormData(prev => ({ ...prev, job_id: jobId.toString() }));
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      toast({
        title: "Resume Required",
        description: "Please attach your resume to apply.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('location', formData.location);
      data.append('message', formData.message);
      data.append('resume', formData.resume);
      if (formData.job_id) {
        data.append('job_id', formData.job_id);
      }

      await settingsApi.applyForJob(data);
      
      toast({
        title: "Application Received",
        description: "thank you apply for unicare. Contact reach shortly",
      });
      setFormData({ name: "", email: "", phone: "", location: "", message: "", job_id: "", resume: null });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-[#1a3b8b] py-20 md:py-32">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,192L48,197.3C96,203,192,213,288,192C384,171,480,117,576,112C672,107,768,149,864,165.3C960,181,1056,171,1152,149.3C1248,128,1344,96,1392,80L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full p-8 shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/20">
                  <img 
                    src="/images/jobs-illustration.png" 
                    alt="Career Illustration" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
                    }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#5fb1be] p-4 rounded-2xl shadow-lg animate-bounce hidden md:block">
                  <Briefcase className="text-white w-8 h-8" />
                </div>
              </div>
            </div>
            <div className="md:w-1/2 text-center md:text-left space-y-6">
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase opacity-90">
                JOBS
              </h1>
              <div className="h-2 w-24 bg-[#5fb1be] rounded-full mx-auto md:mx-0"></div>
              <p className="text-xl text-blue-100 font-medium leading-relaxed max-w-xl">
                Ready to take the next step in your professional journey? Join a team of visionaries dedicated to excellence in healthcare.
              </p>
              <Button 
                onClick={() => openApplyModal()}
                className="bg-[#5fb1be] hover:bg-[#4a909c] text-white font-black uppercase tracking-widest rounded-2xl h-14 px-10 shadow-lg shadow-[#5fb1be]/20"
              >
                Quick Apply Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16 -mt-12 md:-mt-20 relative z-20">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl p-8 mb-16 border border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8 text-center md:text-left">
          <p className="text-slate-700 font-bold text-lg">
            Interested to join Unicare International Team?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="mailto:Info@unicarehomeopathy.com" className="flex items-center gap-2 text-primary font-black hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
              Info@unicarehomeopathy.com
            </a>
            <span className="text-slate-300 hidden md:block">|</span>
            <a href="https://wa.me/919335587472" className="flex items-center gap-2 text-[#25D366] font-black hover:scale-105 transition-transform">
              <Phone className="w-5 h-5" />
              +91 9335587472
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-12 justify-center">
            <div className="h-8 w-2 bg-primary rounded-full"></div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Current Openings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 h-64 shadow-sm border border-slate-100 animate-pulse flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full"></div>
                  <div className="w-32 h-4 bg-slate-100 rounded"></div>
                  <div className="w-48 h-3 bg-slate-100 rounded"></div>
                </div>
              ))
            ) : jobs.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active vacancies</p>
              </div>
            ) : (
              jobs.map((job, i) => (
                <div 
                  key={job.id} 
                  className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 group flex flex-col items-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner overflow-hidden">
                    {getRoleIcon(job.title)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Qualification: <span className="text-slate-600">{job.requirements || 'Any Graduation'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.type}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-slate-200 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all group"
                    onClick={() => openApplyModal(job.id.toString())}
                  >
                    Apply Now
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ))
            )}
          </div>
          
          <p className="text-center text-slate-400 text-xs font-medium italic mt-16">
            ***Disclaimer: Results may vary from person to person
          </p>
        </div>
      </main>

      {/* Application Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 rounded-[40px] overflow-hidden border-none shadow-2xl">
          <div className="bg-[#5fb1be] p-8 text-center relative">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Quick Apply</h3>
            <p className="text-blue-50/80 text-sm font-medium mt-1">Submit your details to our HR team</p>
          </div>
          
          <div className="p-8 bg-white overflow-y-auto max-h-[80vh]">
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Position Applied For <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.job_id} 
                  onValueChange={(val) => setFormData({...formData, job_id: val})}
                >
                  <SelectTrigger className="rounded-2xl bg-slate-50 border-none focus:ring-primary/20 h-12">
                    <SelectValue placeholder="Select a position" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id.toString()}>
                        {job.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="general">General Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                <Input 
                  placeholder="e.g. John Doe" 
                  className="rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 h-12"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Email</Label>
                <Input 
                  type="email"
                  placeholder="e.g. john@example.com" 
                  className="rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 h-12"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</Label>
                <Input 
                  type="tel"
                  placeholder="e.g. +91 9876543210" 
                  className="rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 h-12"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Country / City</Label>
                <Input 
                  placeholder="e.g. Hyderabad, India" 
                  className="rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 h-12"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Attach Resume (PDF/DOC)</Label>
                <div className="relative">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="resume-upload" 
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFormData({...formData, resume: e.target.files?.[0] || null})}
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="flex items-center justify-between px-4 h-12 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-sm text-slate-500 truncate">
                      {formData.resume ? formData.resume.name : "Choose file..."}
                    </span>
                    <Upload className="w-4 h-4 text-slate-400" />
                  </label>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message (Optional)</Label>
                <Textarea 
                  placeholder="Tell us about your experience..." 
                  className="rounded-2xl bg-slate-50 border-none focus-visible:ring-primary/20 min-h-[80px] resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              <div className="pt-2">
                <Button 
                  type="submit"
                  disabled={submitting}
                  className="w-full h-14 bg-[#5fb1be] hover:bg-[#4a909c] text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-[#5fb1be]/20 transition-all active:scale-95"
                >
                  {submitting ? "Sending..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
