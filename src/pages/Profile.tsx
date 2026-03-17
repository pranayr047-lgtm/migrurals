import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { User, Globe, Clock, Trash2, Activity, AlertTriangle, Heart, Ruler, Weight, Droplets, AlertCircle, MapPin, Pill, Cigarette, Wine, Edit3, Save } from 'lucide-react';

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
  current_medications: string[];
  smoking_status: string | null;
  alcohol_consumption: string | null;
  village_location: string | null;
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
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Editable fields
  const [displayName, setDisplayName] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language as Language);
  const [editAge, setEditAge] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editBloodType, setEditBloodType] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editSmoking, setEditSmoking] = useState('');
  const [editAlcohol, setEditAlcohol] = useState('');
  const [editVillage, setEditVillage] = useState('');
  const [editConditions, setEditConditions] = useState<string[]>([]);
  const [editAllergies, setEditAllergies] = useState<string[]>([]);
  const [editMedications, setEditMedications] = useState<string[]>([]);

  const pf = (t as any).profile_page || {};
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
        setEditAge(p.age?.toString() || '');
        setEditGender(p.gender || '');
        setEditBloodType(p.blood_type || '');
        setEditHeight(p.height_cm?.toString() || '');
        setEditWeight(p.weight_kg?.toString() || '');
        setEditSmoking(p.smoking_status || '');
        setEditAlcohol(p.alcohol_consumption || '');
        setEditVillage(p.village_location || '');
        setEditConditions(p.pre_existing_conditions || []);
        setEditAllergies(p.allergies || []);
        setEditMedications(p.current_medications || []);
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
    await supabase.from('profiles').update({
      display_name: displayName,
      preferred_language: prefLang,
      age: editAge ? parseInt(editAge) : null,
      gender: editGender || null,
      blood_type: editBloodType || null,
      height_cm: editHeight ? parseFloat(editHeight) : null,
      weight_kg: editWeight ? parseFloat(editWeight) : null,
      smoking_status: editSmoking || null,
      alcohol_consumption: editAlcohol || null,
      village_location: editVillage || null,
      pre_existing_conditions: editConditions,
      allergies: editAllergies,
      current_medications: editMedications,
    } as any).eq('user_id', user.id);
    setLanguage(prefLang);
    setProfile(prev => prev ? {
      ...prev, display_name: displayName, preferred_language: prefLang,
      age: editAge ? parseInt(editAge) : null, gender: editGender || null,
      blood_type: editBloodType || null, height_cm: editHeight ? parseFloat(editHeight) : null,
      weight_kg: editWeight ? parseFloat(editWeight) : null, smoking_status: editSmoking || null,
      alcohol_consumption: editAlcohol || null, village_location: editVillage || null,
      pre_existing_conditions: editConditions, allergies: editAllergies, current_medications: editMedications,
    } : null);
    setSaving(false);
    setEditing(false);
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

  const inputClass = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const InfoRow = ({ icon, label, value, editEl }: { icon?: React.ReactNode; label: string; value: string; editEl?: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">{icon} {label}</p>
      {editing && editEl ? editEl : <p className="text-lg font-bold text-foreground">{value || '—'}</p>}
    </div>
  );

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
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{pf.title || 'Profile'}</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <button onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}
                className="flex items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                {editing ? <><Save className="h-4 w-4" /> {saving ? '...' : (pf.save || 'Save')}</> : <><Edit3 className="h-4 w-4" /> {pf.edit || 'Edit'}</>}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">{pf.display_name || 'Display Name'}</label>
                {editing ? (
                  <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className={inputClass} />
                ) : (
                  <p className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">{displayName || '—'}</p>
                )}
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground"><Globe className="h-4 w-4 text-primary" /> {pf.language || 'Preferred Language'}</label>
                {editing ? (
                  <select value={prefLang} onChange={e => setPrefLang(e.target.value as Language)} className={inputClass}>
                    {langOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                ) : (
                  <p className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">{langOptions.find(o => o.value === prefLang)?.label}</p>
                )}
              </div>
              {!editing && (
                <button onClick={handleSignOut} className="rounded-xl border border-destructive/30 px-6 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">{pf.sign_out || 'Sign Out'}</button>
              )}
            </div>
          </motion.div>

          {/* Health Profile Card */}
          {profile && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }} className="card-glass rounded-2xl border border-border p-6">
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                <h2 className="text-xl font-bold text-foreground">{pf.health_profile || 'Health Profile'}</h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <InfoRow label={pf.age || 'Age'} value={profile.age?.toString() || ''}
                  editEl={<input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} className={inputClass} />} />
                <InfoRow label={pf.gender || 'Gender'} value={profile.gender || ''}
                  editEl={<select value={editGender} onChange={e => setEditGender(e.target.value)} className={inputClass}>
                    <option value="">—</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>} />
                <InfoRow icon={<Droplets className="h-3 w-3" />} label={pf.blood_type || 'Blood Type'} value={profile.blood_type || ''}
                  editEl={<select value={editBloodType} onChange={e => setEditBloodType(e.target.value)} className={inputClass}>
                    <option value="">—</option>{['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>} />
                <InfoRow icon={<Ruler className="h-3 w-3" />} label={pf.height || 'Height'} value={profile.height_cm ? `${profile.height_cm} cm` : ''}
                  editEl={<input type="number" value={editHeight} onChange={e => setEditHeight(e.target.value)} className={inputClass} />} />
                <InfoRow icon={<Weight className="h-3 w-3" />} label={pf.weight || 'Weight'} value={profile.weight_kg ? `${profile.weight_kg} kg` : ''}
                  editEl={<input type="number" value={editWeight} onChange={e => setEditWeight(e.target.value)} className={inputClass} />} />
                {bmi && !editing && (
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">BMI</p>
                    <p className="text-lg font-bold text-primary">{bmi}</p>
                  </div>
                )}
                <InfoRow icon={<Cigarette className="h-3 w-3" />} label={pf.smoking || 'Smoking'} value={profile.smoking_status || ''}
                  editEl={<select value={editSmoking} onChange={e => setEditSmoking(e.target.value)} className={inputClass}>
                    <option value="">—</option><option value="Never">Never</option><option value="Former">Former</option><option value="Current">Current</option>
                  </select>} />
                <InfoRow icon={<Wine className="h-3 w-3" />} label={pf.alcohol || 'Alcohol'} value={profile.alcohol_consumption || ''}
                  editEl={<select value={editAlcohol} onChange={e => setEditAlcohol(e.target.value)} className={inputClass}>
                    <option value="">—</option><option value="Never">Never</option><option value="Occasional">Occasional</option><option value="Regular">Regular</option>
                  </select>} />
                <InfoRow icon={<MapPin className="h-3 w-3" />} label={pf.village || 'Village / Location'} value={profile.village_location || ''}
                  editEl={<input type="text" value={editVillage} onChange={e => setEditVillage(e.target.value)} className={inputClass} />} />
              </div>
              {(profile.pre_existing_conditions?.length > 0 || editing) && (
                <div className="mt-4">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"><AlertCircle className="h-3 w-3" /> {pf.conditions || 'Pre-existing Conditions'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(editing ? editConditions : profile.pre_existing_conditions)?.map((c, i) => (
                      <span key={i} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                        {c} {editing && <button onClick={() => setEditConditions(editConditions.filter((_, j) => j !== i))} className="ml-0.5">×</button>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(profile.allergies?.length > 0 || editing) && (
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"><AlertTriangle className="h-3 w-3" /> {pf.allergies || 'Known Allergies'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(editing ? editAllergies : profile.allergies)?.map((a, i) => (
                      <span key={i} className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
                        {a} {editing && <button onClick={() => setEditAllergies(editAllergies.filter((_, j) => j !== i))} className="ml-0.5">×</button>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {((profile.current_medications?.length > 0) || editing) && (
                <div className="mt-3">
                  <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"><Pill className="h-3 w-3" /> {pf.medications || 'Current Medications'}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(editing ? editMedications : profile.current_medications)?.map((m, i) => (
                      <span key={i} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {m} {editing && <button onClick={() => setEditMedications(editMedications.filter((_, j) => j !== i))} className="ml-0.5">×</button>}
                      </span>
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
              <h2 className="text-xl font-bold text-foreground">{pf.history || 'Analysis History'}</h2>
            </div>
            {loadingHistory ? (
              <div className="flex items-center justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
            ) : history.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{pf.no_history || 'No analysis history yet.'}</p>
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
