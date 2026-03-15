import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { User, Heart, Ruler, Weight, Droplets, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', 'Other'];
const COMMON_CONDITIONS = [
  'Diabetes', 'Hypertension', 'Asthma', 'Heart Disease',
  'Thyroid', 'Arthritis', 'Anemia', 'Kidney Disease',
];
const COMMON_ALLERGIES = [
  'Penicillin', 'Sulfa drugs', 'Aspirin', 'Peanuts',
  'Dust', 'Pollen', 'Latex', 'Shellfish',
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [customAllergy, setCustomAllergy] = useState('');

  const toggleItem = (item: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const addCustom = (value: string, list: string[], setList: (v: string[]) => void, clear: () => void) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      clear();
    }
  };

  const bmi = heightCm && weightKg
    ? (parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)).toFixed(1)
    : null;

  const handleSubmit = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('profiles').update({
      display_name: fullName,
      age: age ? parseInt(age) : null,
      gender: gender || null,
      blood_type: bloodType || null,
      height_cm: heightCm ? parseFloat(heightCm) : null,
      weight_kg: weightKg ? parseFloat(weightKg) : null,
      pre_existing_conditions: selectedConditions,
      allergies: selectedAllergies,
      onboarding_complete: true,
    }).eq('user_id', user.id);
    setSaving(false);
    navigate('/');
  };

  const steps = [
    {
      title: 'Personal Information',
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">Full Name *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter your full name" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Age *</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min="1" max="120"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Age" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Gender *</label>
              <div className="flex gap-2">
                {GENDERS.map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${gender === g ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      valid: fullName.trim() && age && gender,
    },
    {
      title: 'Physical Details',
      icon: <Ruler className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Droplets className="h-4 w-4 text-destructive" /> Blood Type
            </label>
            <div className="flex flex-wrap gap-2">
              {BLOOD_TYPES.map(bt => (
                <button key={bt} onClick={() => setBloodType(bt)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${bloodType === bt ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                  {bt}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Ruler className="h-4 w-4 text-primary" /> Height (cm)
              </label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} min="50" max="250"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 165" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Weight className="h-4 w-4 text-primary" /> Weight (kg)
              </label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} min="10" max="300"
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. 60" />
            </div>
          </div>
          {bmi && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
              <span className="text-sm text-muted-foreground">Your BMI: </span>
              <span className="text-lg font-bold text-primary">{bmi}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                {parseFloat(bmi) < 18.5 ? '(Underweight)' : parseFloat(bmi) < 25 ? '(Normal)' : parseFloat(bmi) < 30 ? '(Overweight)' : '(Obese)'}
              </span>
            </div>
          )}
        </div>
      ),
      valid: true,
    },
    {
      title: 'Health History',
      icon: <Heart className="h-5 w-5" />,
      content: (
        <div className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-accent" /> Pre-existing Conditions
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_CONDITIONS.map(c => (
                <button key={c} onClick={() => toggleItem(c, selectedConditions, setSelectedConditions)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedConditions.includes(c) ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customCondition} onChange={e => setCustomCondition(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom(customCondition, selectedConditions, setSelectedConditions, () => setCustomCondition(''))}
                placeholder="Add other condition..." className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addCustom(customCondition, selectedConditions, setSelectedConditions, () => setCustomCondition(''))}
                className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">Add</button>
            </div>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-destructive" /> Known Allergies
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_ALLERGIES.map(a => (
                <button key={a} onClick={() => toggleItem(a, selectedAllergies, setSelectedAllergies)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedAllergies.includes(a) ? 'border-destructive bg-destructive/10 text-destructive' : 'border-input bg-background text-muted-foreground hover:bg-muted'}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customAllergy} onChange={e => setCustomAllergy(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom(customAllergy, selectedAllergies, setSelectedAllergies, () => setCustomAllergy(''))}
                placeholder="Add other allergy..." className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addCustom(customAllergy, selectedAllergies, setSelectedAllergies, () => setCustomAllergy(''))}
                className="rounded-xl bg-destructive px-4 py-2 text-sm text-destructive-foreground">Add</button>
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
  ];

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg card-glass rounded-2xl border border-border p-6 shadow-elevated">
          
          {/* Progress */}
          <div className="mb-6 flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-1 items-center gap-2">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>

          <div className="mb-1 flex items-center gap-2 text-lg font-bold text-foreground">
            {steps[step].icon}
            {steps[step].title}
          </div>
          <p className="mb-5 text-sm text-muted-foreground">Step {step + 1} of {steps.length}</p>

          <div className="min-h-[280px]">{steps[step].content}</div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-1 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-opacity disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!steps[step].valid}
                className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving || !steps[0].valid}
                className="flex items-center gap-1 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">
                {saving ? 'Saving...' : 'Complete Setup'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Onboarding;
