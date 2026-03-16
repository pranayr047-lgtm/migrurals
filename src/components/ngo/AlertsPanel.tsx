import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Bell, Shield } from 'lucide-react';

const AlertsPanel = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [alerts, setAlerts] = useState<any[]>([]);
  const [autoAlerts, setAutoAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetchAlerts();
    generateAutoAlerts();
  }, []);

  const fetchAlerts = async () => {
    const { data } = await supabase.from('ngo_alerts').select('*').order('created_at', { ascending: false });
    if (data) setAlerts(data);
  };

  const generateAutoAlerts = async () => {
    // Auto-generate alerts from high-severity analysis reports
    const { data } = await supabase
      .from('analysis_history')
      .select('*')
      .in('severity_key', ['high', 'moderate_high'])
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setAutoAlerts(data.map((r: any) => ({
        id: r.id,
        title: `High severity: ${r.detected_symptoms?.join(', ') || 'Unknown symptoms'}`,
        description: `Reported at ${new Date(r.created_at).toLocaleString()} — Severity: ${r.severity_key}`,
        severity: r.severity_key === 'high' ? 'critical' : 'high',
        created_at: r.created_at,
      })));
    }
  };

  const severityIcon = (s: string) => {
    if (s === 'critical') return <AlertTriangle className="h-5 w-5 text-destructive" />;
    if (s === 'high') return <Shield className="h-5 w-5 text-accent" />;
    return <Bell className="h-5 w-5 text-primary" />;
  };

  const severityBadge = (s: string) => {
    if (s === 'critical') return 'destructive' as const;
    if (s === 'high') return 'default' as const;
    return 'secondary' as const;
  };

  const allAlerts = [
    ...autoAlerts.map((a) => ({ ...a, source: 'auto' })),
    ...alerts.map((a) => ({ ...a, source: 'manual' })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{ngo.alerts_title || 'Health Alerts'}</h2>

      {allAlerts.length === 0 ? (
        <Card className="card-glass border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            {ngo.no_alerts || 'No active alerts'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {allAlerts.map((alert) => (
            <Card key={alert.id} className="card-glass border-border/50 transition-colors hover:border-primary/30">
              <CardContent className="flex items-start gap-4 p-4">
                {severityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground">{alert.title}</p>
                    <Badge variant={severityBadge(alert.severity)}>{alert.severity}</Badge>
                    {alert.source === 'auto' && (
                      <Badge variant="outline" className="text-xs">Auto</Badge>
                    )}
                  </div>
                  {alert.description && (
                    <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;
