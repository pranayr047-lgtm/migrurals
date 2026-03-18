import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, languageNames } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Globe, ChevronDown, User } from 'lucide-react';
import logo from '@/assets/logo-migrurals.png';

const Navbar = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
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
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img src={logo} alt="MIGRurals" className="h-9 w-9 rounded-lg object-contain transition-transform group-hover:scale-110" />
          <span className="hidden text-lg font-extrabold text-foreground sm:inline tracking-tight">
            MIGR<span className="text-primary">urals</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-primary" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-muted hover:shadow-sm"
            >
              <Globe className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">{languageNames[language]}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth */}
          {user ? (
            <Link to="/profile" className="flex items-center gap-2 group">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="h-8 w-8 rounded-full ring-2 ring-primary/20 transition-all group-hover:ring-primary/40" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-accent text-primary-foreground transition-transform group-hover:scale-110">
                  <User className="h-4 w-4" />
                </div>
              )}
            </Link>
          ) : (
            <Link to="/login" className="rounded-xl bg-gradient-accent px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105">
              Sign In
            </Link>
          )}

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
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-card px-4 py-3 md:hidden overflow-hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
