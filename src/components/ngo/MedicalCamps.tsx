import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Calendar, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const MedicalCamps = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const ngo = (t as any).ngo || {};
  const [camps, setCamps] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', region: '', description: '', camp_date: '', status: 'upcoming' });

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    const { data } = await supabase.from('medical_camps').select('*').order('camp_date', { ascending: true });
    if (data) setCamps(data);
  };

  const handleCreate = async () => {
    if (!form.name || !form.location || !form.camp_date) {
      toast({ title: 'Missing fields', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('medical_camps').insert({
      ...form,
      created_by: user?.id,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: ngo.camp_created || 'Camp created successfully' });
      setOpen(false);
      setForm({ name: '', location: '', region: '', description: '', camp_date: '', status: 'upcoming' });
      fetchCamps();
    }
  };

  const statusColor = (s: string) => {
    if (s === 'completed') return 'secondary';
    if (s === 'ongoing') return 'default';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{ngo.medical_camps || 'Medical Camps'}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />{ngo.create_camp || 'Create Camp'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ngo.new_camp || 'New Medical Camp'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>{ngo.camp_name || 'Camp Name'}</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>{ngo.location || 'Location'}</Label>
                <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <Label>{ngo.region || 'Region'}</Label>
                <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              </div>
              <div>
                <Label>{ngo.date || 'Date'}</Label>
                <Input type="date" value={form.camp_date} onChange={(e) => setForm({ ...form, camp_date: e.target.value })} />
              </div>
              <div>
                <Label>{ngo.description || 'Description'}</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <Label>{ngo.status || 'Status'}</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">{ngo.save || 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {camps.length === 0 ? (
          <Card className="col-span-full card-glass border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              {ngo.no_camps || 'No medical camps scheduled yet'}
            </CardContent>
          </Card>
        ) : (
          camps.map((camp) => (
            <Card key={camp.id} className="card-glass border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{camp.name}</CardTitle>
                  <Badge variant={statusColor(camp.status)}>{camp.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />{camp.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />{new Date(camp.camp_date).toLocaleDateString()}
                </div>
                {camp.description && (
                  <p className="text-sm text-muted-foreground">{camp.description}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MedicalCamps;
