import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { MapPin } from 'lucide-react';

const mockRegions = [
  { name: 'Warangal Rural', state: 'Telangana', reports: 45, risk: 'high', lat: 17.97, lng: 79.59 },
  { name: 'Anantapur', state: 'Andhra Pradesh', reports: 32, risk: 'moderate', lat: 14.68, lng: 77.60 },
  { name: 'Medak', state: 'Telangana', reports: 28, risk: 'moderate', lat: 18.05, lng: 78.26 },
  { name: 'Nalgonda', state: 'Telangana', reports: 52, risk: 'high', lat: 17.05, lng: 79.27 },
  { name: 'Kurnool', state: 'Andhra Pradesh', reports: 18, risk: 'low', lat: 15.83, lng: 78.04 },
  { name: 'Karimnagar', state: 'Telangana', reports: 37, risk: 'moderate', lat: 18.44, lng: 79.13 },
  { name: 'Adilabad', state: 'Telangana', reports: 41, risk: 'high', lat: 19.67, lng: 78.53 },
  { name: 'Prakasam', state: 'Andhra Pradesh', reports: 12, risk: 'low', lat: 15.35, lng: 79.56 },
];

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

  return (
    <div className="space-y-6">
      {/* Map Visualization */}
      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {ngo.rural_health_map || 'Rural Health Map'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-xl bg-muted/50 p-6" style={{ minHeight: 350 }}>
            {/* Simulated map with region dots */}
            <div className="relative h-[300px] w-full">
              {mockRegions.map((region) => {
                const x = ((region.lng - 77) / 3.5) * 100;
                const y = ((20 - region.lat) / 6) * 100;
                return (
                  <div
                    key={region.name}
                    className="group absolute"
                    style={{ left: `${Math.max(5, Math.min(90, x))}%`, top: `${Math.max(5, Math.min(90, y))}%` }}
                  >
                    <div className={`h-4 w-4 rounded-full ${riskDot(region.risk)} animate-pulse cursor-pointer ring-4 ring-background`} />
                    <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-elevated opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
                      <p className="font-semibold text-foreground">{region.name}</p>
                      <p className="text-muted-foreground">{region.reports} reports</p>
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

      {/* Region List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockRegions.map((region) => (
          <Card key={region.name} className="card-glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{region.name}</p>
                  <p className="text-xs text-muted-foreground">{region.state}</p>
                </div>
                <Badge variant={riskColor(region.risk)}>{region.risk}</Badge>
              </div>
              <p className="mt-2 text-lg font-bold text-foreground">{region.reports}</p>
              <p className="text-xs text-muted-foreground">{ngo.reports_label || 'symptom reports'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RuralAreasMonitoring;
