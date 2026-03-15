import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { User, Globe, Clock, Trash2, Activity, AlertTriangle, Heart, Ruler, Weight, Droplets, AlertCircle } from 'lucide-react';

interface ProfileData {
  display_name: string | null;
  preferred_language: string | null;
  age: number | null;
  gender: string | null;
  blood_type: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  allergies: string[];
  pre_existing_conditions: string[];
}

interface AnalysisRecord {
  id: string;
  input_text: string;
  detected_symptoms: string[];
  conditions: { name_key: string; probability_key: string }[];
  severity_key: string;
  language: string;
  created_at: string;
}

const Profile = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  type Language = 'en' | 'te' | 'hi' | 'ta';
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language as Language);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const sr = t.symptom_results;
  const getCondition = (key: string) => sr.conditions[key as keyof typeof sr.conditions] || key;
  const getSeverity = (key: string) => sr.severity_levels[key as keyof typeof sr.severity_levels] || key;
  const getSymptomName = (key: string) => (sr as Record<string, unknown>)[key] as string || key;

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        const p = data as unknown as ProfileData;
        setProfile(p);
        setDisplayName(p.display_name || user.user_metadata?.full_name || '');
        setPrefLang((p.preferred_language || 'en') as Language);
      }
    });
    supabase.from('analysis_history').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20).then(({ data }) => {
      setHistory((data as unknown as AnalysisRecord[]) || []);
      setLoadingHistory(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({ display_name: displayName, preferred_language: prefLang }).eq('user_id', user.id);
    setLanguage(prefLang);
    setSaving(false);
  };

  const handleDeleteHistory = async (id: string) => {
    await supabase.from('analysis_history').delete().eq('id', id);
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const bmi = profile?.height_cm && profile?.weight_kg
    ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1) : null;

  const langOptions = [
    { value: 'en', label: 'English' }, { value: 'te', label: 'తెలుగు' },
    { value: 'hi', label: 'हिंदी' }, { value: 'ta', label: 'தமிழ்' },
  ];

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-2xl border border-border p-6">
            <div className="mb-6 flex items-center gap-4">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="" className="h-16 w-16 rounded-full" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"><User className="h-8 w-8" /></div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-foreground">Profile</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Display Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground"><Globe className="h-4 w-4 text-primary" /> Preferred Language</label>
                <select value={prefLang} onChange={e => setPrefLang(e.target.value as Language)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                  {langOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={handleSave} disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">{saving ? '...' : 'Save'}</button>
                <button onClick={handleSignOut} className="rounded-xl border border-destructive/30 px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">Sign Out</button>
              </div>
            </div>
          </motion.div>

          {/* Health Profile Card */}
          {profile && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }} className="card-glass rounded-2xl border border-border p-6">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-foreground">Health Profile</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="text-lg font-bold text-foreground">{profile.age || '—'}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-lg font-bold text-foreground">{profile.gender || '—'}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Droplets className="h-3 w-3" /> Blood Type</p>
                  <p className="text-lg font-bold text-destructive">{profile.blood_type || '—'}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Ruler className="h-3 w-3" /> Height</p>
                  <p className="text-lg font-bold text-foreground">{profile.height_cm ? `${profile.height_cm} cm` : '—'}</p>
                </div>
                <div className="rounded-xl border border-border bg-background p-3">
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><Weight className="h-3 w-3" /> Weight</p>
                  <p className="text-lg font-bold text-foreground">{profile.weight_kg ? `${profile.weight_kg} kg` : '—'}</p>
                </div>
                {bmi && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">BMI</p>
                    <p className="text-lg font-bold text-primary">{bmi}</p>
                  </div>
                )}
              </div>
              {profile.pre_existing_conditions?.length > 0 && (
                <div className="mt-4">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"><AlertCircle className="h-3 w-3" /> Pre-existing Conditions</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.pre_existing_conditions.map((c, i) => (
                      <span key={i} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">{c}</span>
                    ))}
                  </div>
                </div>
              )}
              {profile.allergies?.length > 0 && (
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"><AlertTriangle className="h-3 w-3" /> Known Allergies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.allergies.map((a, i) => (
                      <span key={i} className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">{a}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Analysis History */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }} className="card-glass rounded-2xl border border-border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground">Analysis History</h2>
            </div>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
            ) : history.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No analysis history yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map(record => (
                  <div key={record.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">"{record.input_text}"</p>
                        <p className="text-xs text-muted-foreground">{new Date(record.created_at).toLocaleDateString()} · {record.language.toUpperCase()}</p>
                      </div>
                      <button onClick={() => handleDeleteHistory(record.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {record.detected_symptoms.map((s, i) => (
                        <span key={i} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">{getSymptomName(s)}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{getSeverity(record.severity_key)}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Activity className="h-3 w-3" />{record.conditions.map(c => getCondition(c.name_key)).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Profile;
