import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Heart } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">{t.app_name}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t.footer.description}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t.footer.quick_links}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.home}</Link>
              <Link to="/symptom-analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.symptom_analysis}</Link>
              <Link to="/voice-assistant" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.voice_assistant}</Link>
              <Link to="/health-education" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t.nav.health_education}</Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h4 className="mb-3 font-semibold text-foreground">{t.footer.disclaimer}</h4>
            <p className="text-sm text-muted-foreground">{t.footer.disclaimer_text}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
