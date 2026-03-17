import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';

type AppRole = 'user' | 'ngo_admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: AppRole | null;
  signInWithGoogle: (role: AppRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const PENDING_ROLE_KEY = 'pending_login_role';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<AppRole | null>(null);

  const fetchRole = async (userId: string): Promise<AppRole | null> => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .limit(1)
      .single();
    return (data?.role as AppRole) ?? null;
  };

  const assignRole = async (userId: string, newRole: AppRole) => {
    await supabase.from('user_roles').upsert(
      { user_id: userId, role: newRole },
      { onConflict: 'user_id,role' }
    );
  };

  const handleUser = async (currentUser: User | null) => {
    if (!currentUser) {
      setRole(null);
      setLoading(false);
      return;
    }

    // Check if there's a pending role from login
    const pendingRole = localStorage.getItem(PENDING_ROLE_KEY) as AppRole | null;

    let existingRole = await fetchRole(currentUser.id);

    if (!existingRole && pendingRole) {
      // First-time login — assign the chosen role
      await assignRole(currentUser.id, pendingRole);
      existingRole = pendingRole;
    } else if (!existingRole) {
      // Fallback: no pending role stored, assign 'user'
      await assignRole(currentUser.id, 'user');
      existingRole = 'user';
    }

    localStorage.removeItem(PENDING_ROLE_KEY);
    setRole(existingRole);
    setLoading(false);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Defer role fetch to avoid Supabase deadlock
      if (session?.user) {
        setTimeout(() => handleUser(session.user), 0);
      } else {
        handleUser(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      handleUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async (loginRole: AppRole) => {
    localStorage.setItem(PENDING_ROLE_KEY, loginRole);
    await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, role, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
