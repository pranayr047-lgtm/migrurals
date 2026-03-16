import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Volunteers = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', region: '', status: 'active' });

  useEffect(() => { fetchVolunteers(); }, []);

  const fetchVolunteers = async () => {
    const { data } = await supabase.from('volunteers').select('*').order('created_at', { ascending: false });
    if (data) setVolunteers(data);
  };

  const handleCreate = async () => {
    if (!form.name || !form.region) {
      toast({ title: 'Missing fields', variant: 'destructive' });
      return;
    }
    const { error } = await supabase.from('volunteers').insert(form);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: ngo.volunteer_added || 'Volunteer added' });
      setOpen(false);
      setForm({ name: '', email: '', phone: '', region: '', status: 'active' });
      fetchVolunteers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">{ngo.volunteers || 'Volunteers'}</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" />{ngo.add_volunteer || 'Add Volunteer'}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ngo.new_volunteer || 'New Volunteer'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>{ngo.name || 'Name'}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>{ngo.email || 'Email'}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>{ngo.phone || 'Phone'}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div><Label>{ngo.region || 'Region'}</Label><Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} /></div>
              <div>
                <Label>{ngo.status || 'Status'}</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} className="w-full">{ngo.save || 'Save'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="card-glass border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{ngo.name || 'Name'}</TableHead>
                <TableHead>{ngo.email || 'Email'}</TableHead>
                <TableHead>{ngo.phone || 'Phone'}</TableHead>
                <TableHead>{ngo.region || 'Region'}</TableHead>
                <TableHead>{ngo.status || 'Status'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {volunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {ngo.no_volunteers || 'No volunteers registered yet'}
                  </TableCell>
                </TableRow>
              ) : (
                volunteers.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.email || '—'}</TableCell>
                    <TableCell>{v.phone || '—'}</TableCell>
                    <TableCell>{v.region}</TableCell>
                    <TableCell>
                      <Badge variant={v.status === 'active' ? 'default' : 'secondary'}>{v.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Volunteers;
