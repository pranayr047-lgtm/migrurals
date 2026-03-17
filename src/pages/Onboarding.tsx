import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { User, Heart, Ruler, Weight, Droplets, AlertCircle, ChevronRight, ChevronLeft, MapPin, Pill, Cigarette, Wine } from 'lucide-react';

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
const SMOKING_OPTIONS = ['Never', 'Former', 'Current'];
const ALCOHOL_OPTIONS = ['Never', 'Occasional', 'Regular'];

const Onboarding = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const ob = (t as any).onboarding || {};

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
  const [medications, setMedications] = useState<string[]>([]);
  const [customMedication, setCustomMedication] = useState('');
  const [smokingStatus, setSmokingStatus] = useState('');
  const [alcoholConsumption, setAlcoholConsumption] = useState('');
  const [villageLocation, setVillageLocation] = useState('');

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
      current_medications: medications,
      smoking_status: smokingStatus || null,
      alcohol_consumption: alcoholConsumption || null,
      village_location: villageLocation || null,
      onboarding_complete: true,
    } as any).eq('user_id', user.id);
    setSaving(false);
    navigate('/symptom-analysis');
  };

  const inputClass = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
  const chipActive = "border-primary bg-primary/10 text-primary";
  const chipInactive = "border-input bg-background text-muted-foreground hover:bg-muted";

  const steps = [
    {
      title: ob.step1_title || 'Personal Information',
      icon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-foreground">{ob.full_name || 'Full Name'} *</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputClass} placeholder={ob.full_name_ph || 'Enter your full name'} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{ob.age || 'Age'} *</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min="1" max="120" className={inputClass} placeholder={ob.age || 'Age'} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">{ob.gender || 'Gender'} *</label>
              <div className="flex gap-2">
                {GENDERS.map(g => (
                  <button key={g} onClick={() => setGender(g)}
                    className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${gender === g ? chipActive : chipInactive}`}>
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <MapPin className="h-4 w-4 text-primary" /> {ob.village_location || 'Village / Location'}
            </label>
            <input type="text" value={villageLocation} onChange={e => setVillageLocation(e.target.value)} className={inputClass} placeholder={ob.village_location_ph || 'Enter your village or location'} />
          </div>
        </div>
      ),
      valid: fullName.trim() && age && gender,
    },
    {
      title: ob.step2_title || 'Physical Details',
      icon: <Ruler className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Droplets className="h-4 w-4 text-destructive" /> {ob.blood_type || 'Blood Type'}
            </label>
            <div className="flex flex-wrap gap-2">
              {BLOOD_TYPES.map(bt => (
                <button key={bt} onClick={() => setBloodType(bt)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${bloodType === bt ? chipActive : chipInactive}`}>
                  {bt}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Ruler className="h-4 w-4 text-primary" /> {ob.height || 'Height (cm)'}
              </label>
              <input type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} min="50" max="250" className={inputClass} placeholder="e.g. 165" />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Weight className="h-4 w-4 text-primary" /> {ob.weight || 'Weight (kg)'}
              </label>
              <input type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} min="10" max="300" className={inputClass} placeholder="e.g. 60" />
            </div>
          </div>
          {bmi && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
              <span className="text-sm text-muted-foreground">BMI: </span>
              <span className="text-lg font-bold text-primary">{bmi}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                {parseFloat(bmi) < 18.5 ? '(Underweight)' : parseFloat(bmi) < 25 ? '(Normal)' : parseFloat(bmi) < 30 ? '(Overweight)' : '(Obese)'}
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Cigarette className="h-4 w-4 text-muted-foreground" /> {ob.smoking || 'Smoking Status'}
              </label>
              <div className="flex gap-2">
                {SMOKING_OPTIONS.map(s => (
                  <button key={s} onClick={() => setSmokingStatus(s)}
                    className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${smokingStatus === s ? chipActive : chipInactive}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Wine className="h-4 w-4 text-muted-foreground" /> {ob.alcohol || 'Alcohol'}
              </label>
              <div className="flex gap-2">
                {ALCOHOL_OPTIONS.map(a => (
                  <button key={a} onClick={() => setAlcoholConsumption(a)}
                    className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition-colors ${alcoholConsumption === a ? chipActive : chipInactive}`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      valid: true,
    },
    {
      title: ob.step3_title || 'Health History',
      icon: <Heart className="h-5 w-5" />,
      content: (
        <div className="space-y-5">
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-accent" /> {ob.conditions || 'Pre-existing Conditions'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_CONDITIONS.map(c => (
                <button key={c} onClick={() => toggleItem(c, selectedConditions, setSelectedConditions)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedConditions.includes(c) ? 'border-primary bg-primary/10 text-primary' : chipInactive}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customCondition} onChange={e => setCustomCondition(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom(customCondition, selectedConditions, setSelectedConditions, () => setCustomCondition(''))}
                placeholder={ob.add_condition_ph || 'Add other condition...'} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addCustom(customCondition, selectedConditions, setSelectedConditions, () => setCustomCondition(''))}
                className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">{ob.add || 'Add'}</button>
            </div>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <AlertCircle className="h-4 w-4 text-destructive" /> {ob.allergies || 'Known Allergies'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {COMMON_ALLERGIES.map(a => (
                <button key={a} onClick={() => toggleItem(a, selectedAllergies, setSelectedAllergies)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${selectedAllergies.includes(a) ? 'border-destructive bg-destructive/10 text-destructive' : chipInactive}`}>
                  {a}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customAllergy} onChange={e => setCustomAllergy(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom(customAllergy, selectedAllergies, setSelectedAllergies, () => setCustomAllergy(''))}
                placeholder={ob.add_allergy_ph || 'Add other allergy...'} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addCustom(customAllergy, selectedAllergies, setSelectedAllergies, () => setCustomAllergy(''))}
                className="rounded-xl bg-destructive px-4 py-2 text-sm text-destructive-foreground">{ob.add || 'Add'}</button>
            </div>
          </div>
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Pill className="h-4 w-4 text-primary" /> {ob.medications || 'Current Medications'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {medications.map((m, i) => (
                <span key={i} className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {m}
                  <button onClick={() => setMedications(medications.filter((_, j) => j !== i))} className="ml-0.5 text-primary/60 hover:text-primary">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" value={customMedication} onChange={e => setCustomMedication(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCustom(customMedication, medications, setMedications, () => setCustomMedication(''))}
                placeholder={ob.add_medication_ph || 'Add medication...'} className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={() => addCustom(customMedication, medications, setMedications, () => setCustomMedication(''))}
                className="rounded-xl bg-primary px-4 py-2 text-sm text-primary-foreground">{ob.add || 'Add'}</button>
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
          <p className="mb-5 text-sm text-muted-foreground">{ob.step_of || 'Step'} {step + 1} / {steps.length}</p>

          <div className="min-h-[320px] overflow-y-auto max-h-[50vh]">{steps[step].content}</div>

          <div className="mt-6 flex justify-between">
            <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
              className="flex items-center gap-1 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-opacity disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" /> {ob.back || 'Back'}
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!steps[step].valid}
                className="flex items-center gap-1 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">
                {ob.next || 'Next'} <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving || !steps[0].valid}
                className="flex items-center gap-1 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">
                {saving ? '...' : (ob.complete || 'Complete Setup')}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default Onboarding;
