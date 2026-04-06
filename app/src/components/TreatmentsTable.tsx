import React, { useState, useEffect } from "react";
import { settingsApi } from "@/lib/settingsApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Activity, Stethoscope, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import authService from "@/lib/authService";

const TreatmentsTable = () => {
  const { t } = useLanguage();
  const [treatments, setTreatments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const data = await settingsApi.getPublicTreatments();
        setTreatments(data || []);
      } catch (error) {
        console.error("Error fetching public treatments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const filteredTreatments = treatments.filter((treatment) =>
    treatment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (treatment.category && treatment.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="relative group max-w-md mx-auto lg:mx-0">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder={t("Search treatments...")}
          className="pl-12 py-6 bg-white shadow-sm border-slate-100 rounded-2xl focus-visible:ring-primary/20 transition-all text-base"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="py-6 px-8 font-black uppercase tracking-wider text-slate-500 text-[10px]">
                  {t("Treatment Name")}
                </TableHead>
                <TableHead className="py-6 px-8 font-black uppercase tracking-wider text-slate-500 text-[10px]">
                  {t("Category")}
                </TableHead>
                <TableHead className="py-6 px-8 font-black uppercase tracking-wider text-slate-500 text-[10px]">
                  {t("Description")}
                </TableHead>
                <TableHead className="py-6 px-8 text-right font-black uppercase tracking-wider text-slate-500 text-[10px]">
                  {t("Action")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell colSpan={4} className="py-8 px-8">
                      <div className="h-4 bg-slate-100 rounded-full w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTreatments.length > 0 ? (
                filteredTreatments.map((treatment) => (
                  <TableRow key={treatment.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                    <TableCell className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Activity size={20} />
                        </div>
                        <span className="font-bold text-slate-900 text-lg uppercase tracking-tight">
                          {treatment.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-6 px-8">
                      <Badge variant="outline" className="bg-blue-50/50 text-blue-600 border-blue-100 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
                        {treatment.category || t("General")}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-6 px-8 max-w-md">
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                        {treatment.short_description || t("Specialized homeopathic care for optimal recovery.")}
                      </p>
                    </TableCell>
                    <TableCell className="py-6 px-8 text-right">
                      <button className="inline-flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:gap-3 transition-all group/btn">
                        {t("View Details")}
                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-400">
                      <Stethoscope size={48} className="opacity-20" />
                      <p className="font-bold text-lg">{t("No treatments found")}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TreatmentsTable;
