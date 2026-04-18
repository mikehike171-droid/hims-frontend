import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-heading mb-4">UniCare Homeopathy</h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t('Uni Care Group with 4+ branches and 30+ experienced doctors providing holistic healthcare solutions.')}
            </p>
            <div className="flex gap-4 mt-6">
              <Facebook className="w-5 h-5 hover:text-teal-light cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-teal-light cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 hover:text-teal-light cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 hover:text-teal-light cursor-pointer transition-colors" />
              <a href="https://wa.me/919553387472" target="_blank" rel="noopener noreferrer" className="hover:text-teal-light cursor-pointer transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">{t('Quick Links')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Home')}</a></li>
              <li><a href="#about" className="hover:text-teal-light transition-colors">{t('About Us')}</a></li>
              <li><a href="#treatments" className="hover:text-teal-light transition-colors">{t('Treatments')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Clinics')}</a></li>
              <li><a href="#blogs" className="hover:text-teal-light transition-colors">{t('Blogs')}</a></li>
              <li><a href="#appointment" className="hover:text-teal-light transition-colors">{t('Contact Us')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">{t('Popular Treatments')}</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Low Back Pain')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Kidney Stones')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Thyroid Disorders')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('PCOS')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Sinusitis')}</a></li>
              <li><a href="#" className="hover:text-teal-light transition-colors">{t('Spondylitis')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold font-heading mb-4">{t('Contact Info')}</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-light flex-shrink-0" />
                <span>+91 95533 87472</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-light flex-shrink-0" />
                <span>info@unicarehomeopathy.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-teal-light flex-shrink-0 mt-0.5" />
                <span>UniCare, Telangana, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 text-center text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} UniCare Homeopathy. {t('All rights reserved')}.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
