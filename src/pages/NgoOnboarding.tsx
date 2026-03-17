import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Building2, UserCircle, Phone, MapPin, Users } from 'lucide-react';

const NgoOnboarding = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const nob = (t as any).ngo_onboarding || {};

  const [orgName, setOrgName] = useState('');
  const [adminName, setAdminName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [address, setAddress] = useState('');
  const [numVolunteers, setNumVolunteers] = useState('');

  const inputClass = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const handleSubmit = async () => {
    if (!user || !orgName.trim()) return;
    setSaving(true);
    await supabase.from('ngo_profiles' as any).insert({
      user_id: user.id,
      organization_name: orgName,
      admin_name: adminName,
      email,
      phone,
      region_service_area: region,
      address,
      number_of_volunteers: numVolunteers ? parseInt(numVolunteers) : 0,
      onboarding_complete: true,
    } as any);
    setSaving(false);
    navigate('/ngo');
  };

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg card-glass rounded-2xl border border-border p-6 shadow-elevated">
          
          <div className="mb-6 flex flex-col items-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{nob.title || 'NGO Profile Setup'}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{nob.subtitle || 'Set up your organization profile to get started'}</p>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Building2 className="h-4 w-4 text-primary" /> {nob.org_name || 'Organization Name'} *
              </label>
              <input type="text" value={orgName} onChange={e => setOrgName(e.target.value)} className={inputClass} placeholder={nob.org_name_ph || 'Enter organization name'} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <UserCircle className="h-4 w-4 text-primary" /> {nob.admin_name || 'Admin Name'}
                </label>
                <input type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 text-sm font-medium text-foreground">{nob.email || 'Email'}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Phone className="h-4 w-4 text-primary" /> {nob.phone || 'Phone Number'}
                </label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Users className="h-4 w-4 text-primary" /> {nob.num_volunteers || 'No. of Volunteers'}
                </label>
                <input type="number" value={numVolunteers} onChange={e => setNumVolunteers(e.target.value)} min="0" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
                <MapPin className="h-4 w-4 text-primary" /> {nob.region || 'Region / Service Area'}
              </label>
              <input type="text" value={region} onChange={e => setRegion(e.target.value)} className={inputClass} placeholder={nob.region_ph || 'e.g. Telangana, Andhra Pradesh'} />
            </div>
            <div>
              <label className="mb-1 text-sm font-medium text-foreground">{nob.address || 'Address'}</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>
          </div>

          <button onClick={handleSubmit} disabled={saving || !orgName.trim()}
            className="mt-6 w-full rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-50">
            {saving ? '...' : (nob.complete || 'Complete Setup')}
          </button>
        </motion.div>
      </div>
    </PageContainer>
  );
};

export default NgoOnboarding;
