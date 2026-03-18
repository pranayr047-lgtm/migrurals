import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Heart, ArrowUpRight } from 'lucide-react';
import logo from '@/assets/logo-migrurals.png';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative border-t border-border bg-card overflow-hidden">
      {/* Subtle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-accent opacity-30" />

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <img src={logo} alt="MIGRurals" className="h-10 w-10 rounded-lg object-contain" />
              <span className="text-lg font-extrabold text-foreground tracking-tight">
                MIGR<span className="text-primary">urals</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">{t.footer.quick_links}</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { to: '/', label: t.nav.home },
                { to: '/symptom-analysis', label: t.nav.symptom_analysis },
                { to: '/voice-assistant', label: t.nav.voice_assistant },
                { to: '/health-education', label: t.nav.health_education },
              ].map(link => (
                <Link key={link.to} to={link.to} className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                  {link.label}
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground uppercase tracking-wider">{t.footer.disclaimer}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.footer.disclaimer_text}</p>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-destructive" /> for rural communities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
