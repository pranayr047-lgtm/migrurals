import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Heart, Users, Building2 } from 'lucide-react';

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
    <PageContainer backgroundImage={bgImage}>
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md card-glass rounded-2xl border border-border p-8 shadow-elevated"
        >
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Heart className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{t.app_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.login.subtitle}</p>
          </div>

          {/* Two login buttons */}
          <div className="space-y-3">
            <button
              onClick={() => signInWithGoogle('user')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md"
            >
              <Users className="h-5 w-5 text-primary" />
              <span>{t.login.user_login ?? 'User Login (Google)'}</span>
              <GoogleIcon />
            </button>

            <button
              onClick={() => signInWithGoogle('ngo_admin')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3.5 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-primary/10 hover:shadow-md"
            >
              <Building2 className="h-5 w-5 text-primary" />
              <span>{t.login.ngo_login ?? 'NGO Login (Google)'}</span>
              <GoogleIcon />
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t.login.disclaimer}
          </p>
        </motion.div>
      </div>
    </PageContainer>
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
