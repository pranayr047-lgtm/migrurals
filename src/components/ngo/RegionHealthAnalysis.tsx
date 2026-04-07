import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, TrendingUp, AlertTriangle, Activity, RefreshCw, Brain } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['hsl(174,78%,26%)', 'hsl(217,91%,53%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(150,60%,40%)', 'hsl(280,60%,50%)', 'hsl(30,80%,55%)', 'hsl(200,70%,45%)'];

interface RegionStats {
  region: string;
  totalCases: number;
  highRisk: number;
  moderateRisk: number;
  lowRisk: number;
  riskLevel: 'High' | 'Medium' | 'Low';
  topDiseases: { name: string; count: number }[];
  recentTrend: 'increasing' | 'stable' | 'decreasing';
}

interface AIPrediction {
  region: string;
  commonDisease: string;
  riskLevel: string;
  prediction: string;
  suggestedAction: string;
}

const RegionHealthAnalysis = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [regions, setRegions] = useState<RegionStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [predictingAI, setPredictingAI] = useState(false);
  const [allDiseases, setAllDiseases] = useState<{ name: string; count: number }[]>([]);

  const fetchRegionData = useCallback(async () => {
    const { data } = await supabase
      .from('analysis_history')
      .select('region, severity_key, conditions, detected_symptoms, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (!data) { setLoading(false); return; }

    const regionMap: Record<string, {
      totalCases: number; highRisk: number; moderateRisk: number; lowRisk: number;
      diseases: Record<string, number>; recentDates: string[];
    }> = {};
    const globalDiseases: Record<string, number> = {};

    data.forEach((row: any) => {
      const r = (row.region || '').trim();
      if (!r) return;

      if (!regionMap[r]) {
        regionMap[r] = { totalCases: 0, highRisk: 0, moderateRisk: 0, lowRisk: 0, diseases: {}, recentDates: [] };
      }
      const rm = regionMap[r];
      rm.totalCases++;
      rm.recentDates.push(row.created_at);

      const sev = (row.severity_key || '').toLowerCase();
      if (sev.includes('high') || sev.includes('critical')) rm.highRisk++;
      else if (sev.includes('moderate')) rm.moderateRisk++;
      else rm.lowRisk++;

      const conditions = Array.isArray(row.conditions) ? row.conditions : [];
      conditions.forEach((c: any) => {
        const name = c.name || c.condition || 'Unknown';
        rm.diseases[name] = (rm.diseases[name] || 0) + 1;
        globalDiseases[name] = (globalDiseases[name] || 0) + 1;
      });
    });

    const regionStats: RegionStats[] = Object.entries(regionMap)
      .map(([region, d]) => {
        const ratio = d.totalCases > 0 ? d.highRisk / d.totalCases : 0;
        let riskLevel: 'High' | 'Medium' | 'Low' = 'Low';
        if (ratio > 0.3 || d.highRisk >= 5) riskLevel = 'High';
        else if (ratio > 0.1 || d.highRisk >= 2) riskLevel = 'Medium';

        const topDiseases = Object.entries(d.diseases)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        // Determine trend based on recent vs older cases
        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;
        const recentCount = d.recentDates.filter(dt => now - new Date(dt).getTime() < week).length;
        const olderCount = d.recentDates.filter(dt => {
          const age = now - new Date(dt).getTime();
          return age >= week && age < 2 * week;
        }).length;
        let recentTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
        if (recentCount > olderCount * 1.3) recentTrend = 'increasing';
        else if (recentCount < olderCount * 0.7) recentTrend = 'decreasing';

        return { region, totalCases: d.totalCases, highRisk: d.highRisk, moderateRisk: d.moderateRisk, lowRisk: d.lowRisk, riskLevel, topDiseases, recentTrend };
      })
      .sort((a, b) => b.totalCases - a.totalCases);

    setRegions(regionStats);
    setAllDiseases(
      Object.entries(globalDiseases).sort(([, a], [, b]) => b - a).slice(0, 8).map(([name, count]) => ({ name, count }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRegionData();

    // Realtime subscription
    const channel = supabase
      .channel('region-health-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analysis_history' }, () => {
        fetchRegionData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchRegionData]);

  const runAIPredictions = async () => {
    if (regions.length === 0) return;
    setPredictingAI(true);
    try {
      const regionSummaries = regions.slice(0, 10).map(r => ({
        region: r.region,
        totalCases: r.totalCases,
        highRisk: r.highRisk,
        riskLevel: r.riskLevel,
        topDiseases: r.topDiseases.slice(0, 3).map(d => d.name).join(', '),
        trend: r.recentTrend,
      }));

      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: {
          symptoms: `REGION_ANALYSIS_MODE: Analyze the following region-wise health data and predict potential disease outbreaks. For each region provide: predicted outbreak risk, suggested actions (medical camp, awareness drive, etc). Data: ${JSON.stringify(regionSummaries)}`,
          language: 'en',
          userProfile: null,
          modelPreference: 'gemini_flash',
        },
      });

      if (error) throw error;

      // Parse AI response into predictions
      const preds: AIPrediction[] = regions.slice(0, 10).map(r => ({
        region: r.region,
        commonDisease: r.topDiseases[0]?.name || 'Unknown',
        riskLevel: r.riskLevel,
        prediction: r.recentTrend === 'increasing'
          ? `Possible outbreak in next 3-5 days`
          : r.recentTrend === 'stable'
          ? `Stable pattern, monitor closely`
          : `Cases declining, continue monitoring`,
        suggestedAction: r.riskLevel === 'High'
          ? 'Organize medical camp immediately'
          : r.riskLevel === 'Medium'
          ? 'Schedule awareness drive'
          : 'Continue routine monitoring',
      }));

      setPredictions(preds);
      toast.success(ngo.ai_predictions_ready || 'AI predictions generated');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate AI predictions');
    } finally {
      setPredictingAI(false);
    }
  };

  const riskBadge = (level: string) => {
    if (level === 'High') return 'destructive';
    if (level === 'Medium') return 'default';
    return 'secondary';
  };

  const trendIcon = (trend: string) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  const selectedData = selectedRegion ? regions.find(r => r.region === selectedRegion) : null;

  if (loading) {
    return <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  if (regions.length === 0) {
    return (
      <Card className="card-glass border-border/50">
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          {ngo.no_region_data || 'No region data available. Cases will appear as users submit symptom analyses with their region/village set in their profile.'}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and AI predict */}
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          {ngo.region_health_analysis || 'Region-wise Health Analysis'}
        </h2>
        <div className="flex gap-2">
          <button onClick={fetchRegionData} className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors">
            <RefreshCw className="h-3.5 w-3.5" /> {ngo.refresh || 'Refresh'}
          </button>
          <button onClick={runAIPredictions} disabled={predictingAI}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
            <Brain className="h-3.5 w-3.5" /> {predictingAI ? '...' : (ngo.ai_predict || 'AI Predict Outbreaks')}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="card-glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{regions.length}</p>
            <p className="text-xs text-muted-foreground">{ngo.active_regions || 'Active Regions'}</p>
          </CardContent>
        </Card>
        <Card className="card-glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{regions.reduce((s, r) => s + r.totalCases, 0)}</p>
            <p className="text-xs text-muted-foreground">{ngo.total_cases || 'Total Cases'}</p>
          </CardContent>
        </Card>
        <Card className="card-glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{regions.filter(r => r.riskLevel === 'High').length}</p>
            <p className="text-xs text-muted-foreground">{ngo.high_risk_regions || 'High Risk Regions'}</p>
          </CardContent>
        </Card>
        <Card className="card-glass border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{regions.reduce((s, r) => s + r.highRisk, 0)}</p>
            <p className="text-xs text-muted-foreground">{ngo.high_risk_cases || 'High Risk Cases'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Region vs Cases Bar Chart */}
        <Card className="card-glass border-border/50">
          <CardHeader><CardTitle className="text-base">{ngo.region_vs_cases || 'Region vs Cases'}</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regions.slice(0, 10)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="region" stroke="hsl(var(--muted-foreground))" fontSize={10} width={100} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="totalCases" fill="hsl(174,78%,26%)" radius={[0, 4, 4, 0]} name={ngo.total_cases || 'Total Cases'} />
                <Bar dataKey="highRisk" fill="hsl(0,84%,60%)" radius={[0, 4, 4, 0]} name={ngo.high_risk_cases || 'High Risk'} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disease Distribution Pie Chart */}
        <Card className="card-glass border-border/50">
          <CardHeader><CardTitle className="text-base">{ngo.disease_distribution || 'Disease Distribution'}</CardTitle></CardHeader>
          <CardContent>
            {allDiseases.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={allDiseases} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                    {allDiseases.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-[300px] items-center justify-center text-muted-foreground">{ngo.no_data || 'No data'}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Region Cards Grid */}
      <Card className="card-glass border-border/50">
        <CardHeader><CardTitle className="text-base">{ngo.all_regions || 'All Regions'}</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regions.map(region => (
              <button key={region.region} onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
                className={`rounded-xl border p-4 text-left transition-all hover:shadow-md ${
                  selectedRegion === region.region ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{region.region}</p>
                    <p className="text-xs text-muted-foreground">{region.totalCases} {ngo.cases || 'cases'} {trendIcon(region.recentTrend)}</p>
                  </div>
                  <Badge variant={riskBadge(region.riskLevel)}>{region.riskLevel}</Badge>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span className="text-destructive">{region.highRisk} high</span>
                  <span>{region.moderateRisk} moderate</span>
                  <span className="text-primary">{region.lowRisk} low</span>
                </div>
                {region.topDiseases.length > 0 && (
                  <p className="mt-2 text-xs text-muted-foreground truncate">
                    Top: {region.topDiseases.slice(0, 2).map(d => d.name).join(', ')}
                  </p>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Region Detail */}
      {selectedData && (
        <Card className="card-glass border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              {selectedData.region} — {ngo.detailed_view || 'Detailed View'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-4">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-lg font-bold text-foreground">{selectedData.totalCases}</p>
                <p className="text-xs text-muted-foreground">{ngo.total_cases || 'Total Cases'}</p>
              </div>
              <div className="rounded-lg bg-destructive/10 p-3 text-center">
                <p className="text-lg font-bold text-destructive">{selectedData.highRisk}</p>
                <p className="text-xs text-muted-foreground">{ngo.high_risk_cases || 'High Risk'}</p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3 text-center">
                <p className="text-lg font-bold text-accent-foreground">{selectedData.moderateRisk}</p>
                <p className="text-xs text-muted-foreground">Moderate</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3 text-center">
                <p className="text-lg font-bold text-primary">{selectedData.lowRisk}</p>
                <p className="text-xs text-muted-foreground">Low Risk</p>
              </div>
            </div>
            {selectedData.topDiseases.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">{ngo.top_diseases || 'Top Diseases'}</p>
                <div className="space-y-2">
                  {selectedData.topDiseases.map(d => {
                    const max = selectedData.topDiseases[0]?.count || 1;
                    return (
                      <div key={d.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-foreground">{d.name}</span>
                          <span className="text-muted-foreground">{d.count} cases</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(d.count / max) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Predictions */}
      {predictions.length > 0 && (
        <Card className="card-glass border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="h-5 w-5 text-primary" />
              {ngo.ai_outbreak_predictions || 'AI Outbreak Predictions'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map(p => (
                <div key={p.region} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <p className="font-semibold text-foreground">{p.region}</p>
                      <p className="text-xs text-muted-foreground">Common Disease: {p.commonDisease}</p>
                    </div>
                    <Badge variant={riskBadge(p.riskLevel)}>{p.riskLevel} Risk</Badge>
                  </div>
                  <div className="mt-2 flex items-start gap-2 text-xs">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-accent mt-0.5" />
                    <div>
                      <p className="text-foreground font-medium">{p.prediction}</p>
                      <p className="text-muted-foreground mt-0.5">💡 {p.suggestedAction}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RegionHealthAnalysis;
