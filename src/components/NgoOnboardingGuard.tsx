import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const NgoOnboardingGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    if (!user) { setChecking(false); return; }
    supabase.from('ngo_profiles' as any).select('onboarding_complete').eq('user_id', user.id).single()
      .then(({ data }) => {
        setNeedsOnboarding(!(data as any)?.onboarding_complete);
        setChecking(false);
      });
  }, [user]);

  if (loading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (user && needsOnboarding) return <Navigate to="/ngo/onboarding" replace />;
  return <>{children}</>;
};

export default NgoOnboardingGuard;
