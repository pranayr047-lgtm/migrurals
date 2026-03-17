import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Building2, UserCircle, Mail, Phone, MapPin, Users, Edit3, Save } from 'lucide-react';

interface NgoProfileData {
  organization_name: string;
  admin_name: string;
  email: string;
  phone: string;
  region_service_area: string;
  address: string;
  number_of_volunteers: number;
}

const NgoProfile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const ngo = (t as any).ngo || {};
  const np = (t as any).ngo_profile || {};
  const [profile, setProfile] = useState<NgoProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<NgoProfileData>({
    organization_name: '', admin_name: '', email: '', phone: '',
    region_service_area: '', address: '', number_of_volunteers: 0,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from('ngo_profiles' as any).select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          const p = data as unknown as NgoProfileData;
          setProfile(p);
          setForm(p);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('ngo_profiles' as any).update(form as any).eq('user_id', user.id);
    setProfile(form);
    setSaving(false);
    setEditing(false);
  };

  const inputClass = "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  const Field = ({ icon, label, field, type = 'text' }: { icon: React.ReactNode; label: string; field: keyof NgoProfileData; type?: string }) => (
    <div>
      <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">{icon} {label}</label>
      {editing ? (
        <input type={type} value={form[field] as string} onChange={e => setForm({ ...form, [field]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value })} className={inputClass} />
      ) : (
        <p className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">{(profile?.[field] || '—').toString()}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{np.title || 'NGO Profile'}</h2>
        <Button variant="outline" size="sm" onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}>
          {editing ? <><Save className="h-4 w-4 mr-1" /> {saving ? '...' : (np.save || 'Save')}</> : <><Edit3 className="h-4 w-4 mr-1" /> {np.edit || 'Edit'}</>}
        </Button>
      </div>

      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {np.org_details || 'Organization Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field icon={<Building2 className="h-4 w-4 text-primary" />} label={np.org_name || 'Organization Name'} field="organization_name" />
          <div className="grid grid-cols-2 gap-4">
            <Field icon={<UserCircle className="h-4 w-4 text-primary" />} label={np.admin_name || 'Admin Name'} field="admin_name" />
            <Field icon={<Mail className="h-4 w-4 text-primary" />} label={np.email || 'Email'} field="email" type="email" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field icon={<Phone className="h-4 w-4 text-primary" />} label={np.phone || 'Phone'} field="phone" type="tel" />
            <Field icon={<Users className="h-4 w-4 text-primary" />} label={np.num_volunteers || 'No. of Volunteers'} field="number_of_volunteers" type="number" />
          </div>
          <Field icon={<MapPin className="h-4 w-4 text-primary" />} label={np.region || 'Region / Service Area'} field="region_service_area" />
          <div>
            <label className="mb-1 text-sm font-medium text-foreground">{np.address || 'Address'}</label>
            {editing ? (
              <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2}
                className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            ) : (
              <p className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground">{profile?.address || '—'}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoProfile;
