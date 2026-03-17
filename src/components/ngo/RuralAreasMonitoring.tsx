import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { MapPin } from 'lucide-react';

interface RegionData {
  region: string;
  reports: number;
  highRisk: number;
}

const riskLevel = (highRisk: number, total: number) => {
  const ratio = total > 0 ? highRisk / total : 0;
  if (ratio > 0.3 || highRisk >= 5) return 'high';
  if (ratio > 0.1 || highRisk >= 2) return 'moderate';
  return 'low';
};

const riskColor = (risk: string) => {
  if (risk === 'high') return 'destructive';
  if (risk === 'moderate') return 'default';
  return 'secondary';
};

const riskDot = (risk: string) => {
  if (risk === 'high') return 'bg-destructive';
  if (risk === 'moderate') return 'bg-accent';
  return 'bg-primary';
};

const RuralAreasMonitoring = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegions = async () => {
      const { data } = await supabase.from('analysis_history').select('region, severity_key');
      if (data) {
        const map: Record<string, { reports: number; highRisk: number }> = {};
        data.forEach((row: any) => {
          const r = (row.region || '').trim();
          if (!r) return;
          if (!map[r]) map[r] = { reports: 0, highRisk: 0 };
          map[r].reports++;
          if (row.severity_key === 'high' || row.severity_key === 'moderate_high') map[r].highRisk++;
        });
        setRegions(Object.entries(map).map(([region, d]) => ({ region, ...d })).sort((a, b) => b.reports - a.reports));
      }
      setLoading(false);
    };
    fetchRegions();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (regions.length === 0) {
    return (
      <Card className="card-glass border-border/50">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {ngo.no_data || 'No data available yet'}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {ngo.rural_health_map || 'Rural Health Map'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl bg-muted/50 p-6" style={{ minHeight: 300 }}>
            <div className="relative h-[260px] w-full">
              {regions.slice(0, 12).map((region, idx) => {
                const risk = riskLevel(region.highRisk, region.reports);
                const x = 10 + (idx % 4) * 25;
                const y = 10 + Math.floor(idx / 4) * 30;
                return (
                  <div key={region.region} className="group absolute" style={{ left: `${x}%`, top: `${y}%` }}>
                    <div className={`h-4 w-4 rounded-full ${riskDot(risk)} animate-pulse cursor-pointer ring-4 ring-background`} />
                    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-elevated opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                      <p className="font-semibold text-foreground">{region.region}</p>
                      <p className="text-muted-foreground">{region.reports} {ngo.reports_label || 'symptom reports'}</p>
                    </div>
                  </div>
                );
              })}
              <p className="absolute bottom-2 right-2 text-xs text-muted-foreground/50">
                {ngo.map_note || 'Hover over dots to view region details'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {regions.map((region) => {
          const risk = riskLevel(region.highRisk, region.reports);
          return (
            <Card key={region.region} className="card-glass border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-foreground">{region.region}</p>
                  <Badge variant={riskColor(risk)}>{risk}</Badge>
                </div>
                <p className="mt-2 text-lg font-bold text-foreground">{region.reports}</p>
                <p className="text-xs text-muted-foreground">{ngo.reports_label || 'symptom reports'}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RuralAreasMonitoring;
