import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Heart, Users, Building2, Shield, Globe } from 'lucide-react';
import bgMigrant from '@/assets/bg-migrant-workers.jpg';
import logo from '@/assets/logo-migrurals.png';

const Login = () => {
  const { t } = useLanguage();
  const { user, loading, role, signInWithGoogle } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user && role === 'ngo_admin') return <Navigate to="/ngo" replace />;
  if (user) return <Navigate to="/symptom-analysis" replace />;

  return (
    <div className="relative min-h-[calc(100vh-70px)] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={bgMigrant} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/80 to-background/95" />
        <div className="absolute inset-0 bg-dots" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="card-glass rounded-3xl border border-border p-8 shadow-elevated"
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
              <img src={logo} alt="MIGRurals" className="h-16 w-16 mb-3 rounded-2xl object-contain" />
            </motion.div>
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              MIGR<span className="text-primary">urals</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.login.subtitle}</p>
          </div>

          {/* Features strip */}
          <div className="mb-6 flex justify-center gap-4">
            {[
              { icon: Shield, label: 'Secure' },
              { icon: Globe, label: '4 Languages' },
              { icon: Heart, label: 'Free' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-1 text-xs text-muted-foreground">
                <f.icon className="h-3 w-3 text-primary" />
                <span>{f.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Two login buttons */}
          <div className="space-y-3">
            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signInWithGoogle('user')}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md"
            >
              <Users className="h-5 w-5 text-primary" />
              <span>{t.login.user_login ?? 'User Login (Google)'}</span>
              <GoogleIcon />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => signInWithGoogle('ngo_admin')}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-4 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-primary/10 hover:shadow-md"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <span>{t.login.ngo_login ?? 'NGO Login (Google)'}</span>
              <GoogleIcon />
            </motion.button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
            {t.login.disclaimer}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg className="h-4 w-4 ml-auto" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default Login;
