import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { FileText, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(174,78%,26%)', 'hsl(217,91%,53%)', 'hsl(38,92%,50%)', 'hsl(0,84%,60%)', 'hsl(150,60%,40%)'];

const DashboardOverview = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [stats, setStats] = useState({ totalReports: 0, highRisk: 0, regions: 0, commonSymptoms: [] as { name: string; count: number }[] });
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: reports } = await supabase
      .from('analysis_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (!reports) return;

    const symptomCounts: Record<string, number> = {};
    const regionSet = new Set<string>();
    let highRisk = 0;

    reports.forEach((r: any) => {
      r.detected_symptoms?.forEach((s: string) => {
        symptomCounts[s] = (symptomCounts[s] || 0) + 1;
      });
      if (r.region) regionSet.add(r.region);
      if (r.severity_key === 'high' || r.severity_key === 'moderate_high') highRisk++;
    });

    const commonSymptoms = Object.entries(symptomCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    setStats({
      totalReports: reports.length,
      highRisk,
      regions: regionSet.size || 4,
      commonSymptoms,
    });
    setRecentReports(reports.slice(0, 5));
  };

  const overviewCards = [
    { title: ngo.total_reports || 'Total Reports', value: stats.totalReports, icon: FileText, color: 'text-primary' },
    { title: ngo.high_risk || 'High Risk Cases', value: stats.highRisk, icon: AlertTriangle, color: 'text-destructive' },
    { title: ngo.active_regions || 'Active Regions', value: stats.regions, icon: MapPin, color: 'text-secondary' },
    { title: ngo.common_symptoms || 'Top Symptoms', value: stats.commonSymptoms.length, icon: Activity, color: 'text-accent' },
  ];

  // Weekly mock data for chart
  const weeklyData = [
    { day: 'Mon', reports: 12 }, { day: 'Tue', reports: 19 },
    { day: 'Wed', reports: 8 }, { day: 'Thu', reports: 22 },
    { day: 'Fri', reports: 15 }, { day: 'Sat', reports: 28 },
    { day: 'Sun', reports: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className="card-glass border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-xl bg-muted p-3 ${card.color}`}>
                <card.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Reports Chart */}
        <Card className="card-glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{ngo.weekly_reports || 'Weekly Symptom Reports'}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="reports" fill="hsl(174,78%,26%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Symptoms Pie Chart */}
        <Card className="card-glass border-border/50">
          <CardHeader>
            <CardTitle className="text-base">{ngo.top_symptoms || 'Top Reported Symptoms'}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.commonSymptoms.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stats.commonSymptoms} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name }) => name}>
                    {stats.commonSymptoms.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-[250px] items-center justify-center text-muted-foreground">
                {ngo.no_data || 'No data available yet'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
