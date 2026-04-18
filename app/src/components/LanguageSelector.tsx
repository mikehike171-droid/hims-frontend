import { useState, useEffect } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { Globe, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const LanguageSelector = ({ white = false }: { white?: boolean }) => {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  // While not mounted, render a placeholder with the same dimensions to avoid layout shift
  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          white ? "bg-white/10" : "bg-primary/10"
        )}>
          <Globe className={cn("w-4 h-4", white ? "text-white" : "text-primary")} />
        </div>
        <div className={cn(
          "h-9 px-3 gap-2 flex items-center",
          white ? "text-white" : "text-slate-900"
        )}>
          <div className="w-4 h-4 bg-slate-200 rounded animate-pulse" />
          <div className="w-12 h-3 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 group">
      <div className={cn(
        "flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300",
        white ? "bg-white/10 group-hover:bg-white/20" : "bg-primary/10 group-hover:bg-primary/20"
      )}>
        <Globe className={cn("w-4 h-4", white ? "text-white" : "text-primary")} />
      </div>
      <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
        <SelectTrigger className={cn(
          "h-9 px-3 gap-2 border-none bg-transparent hover:bg-white/5 transition-all duration-200 focus:ring-0 focus:ring-offset-0",
          white ? "text-white" : "text-slate-900"
        )}>
          <div className="flex items-center gap-2">
            <span className="text-sm">{currentLang.flag}</span>
            <span className="text-[12px] font-bold uppercase tracking-wider">{currentLang.label}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-100 shadow-2xl rounded-xl p-1">
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code}
              className="rounded-lg py-2 cursor-pointer focus:bg-primary/10 focus:text-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="text-sm font-semibold">{lang.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
