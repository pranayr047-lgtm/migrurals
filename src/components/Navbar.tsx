import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useLanguage, languageNames } from '@/context/LanguageContext';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/symptom-analysis', label: t.nav.symptom_analysis },
    { path: '/voice-assistant', label: t.nav.voice_assistant },
    { path: '/health-education', label: t.nav.health_education },
    { path: '/about', label: t.nav.about },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">+</span>
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline">{t.app_name}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Selector + Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span>{languageNames[language]}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-elevated">
                {(Object.entries(languageNames) as [typeof language, string][]).map(([code, name]) => (
                  <button
                    key={code}
                    onClick={() => { setLanguage(code); setLangOpen(false); }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      language === code ? 'bg-primary/10 font-medium text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-foreground hover:bg-muted md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
