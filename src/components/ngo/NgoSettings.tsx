import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

const NgoSettings = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-foreground">{ngo.settings || 'Settings'}</h2>

      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{ngo.org_settings || 'Organization Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>{ngo.org_name_label || 'Organization Name'}</Label>
            <Input defaultValue="Rural Health Initiative" />
          </div>
          <div>
            <Label>{ngo.contact_email || 'Contact Email'}</Label>
            <Input type="email" defaultValue="contact@ruralhealthngo.org" />
          </div>
          <div>
            <Label>{ngo.focus_regions || 'Focus Regions'}</Label>
            <Input defaultValue="Telangana, Andhra Pradesh" />
          </div>
          <Button>{ngo.save || 'Save Changes'}</Button>
        </CardContent>
      </Card>

      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{ngo.notification_settings || 'Notification Settings'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {ngo.notification_desc || 'Configure alert thresholds and notification preferences for health monitoring.'}
          </p>
          <div>
            <Label>{ngo.alert_threshold || 'High Risk Alert Threshold'}</Label>
            <Input type="number" defaultValue="10" />
          </div>
          <Button>{ngo.save || 'Save Changes'}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NgoSettings;
