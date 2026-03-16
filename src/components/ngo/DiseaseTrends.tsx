import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const DiseaseTrends = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [trendData, setTrendData] = useState<any[]>([]);
  const [conditionData, setConditionData] = useState<any[]>([]);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    const { data } = await supabase
      .from('analysis_history')
      .select('created_at, severity_key, conditions, detected_symptoms')
      .order('created_at', { ascending: true })
      .limit(500);

    if (!data) return;

    // Group by date
    const byDate: Record<string, { date: string; count: number; high: number }> = {};
    const condCounts: Record<string, number> = {};

    data.forEach((r: any) => {
      const date = new Date(r.created_at).toLocaleDateString();
      if (!byDate[date]) byDate[date] = { date, count: 0, high: 0 };
      byDate[date].count++;
      if (r.severity_key === 'high' || r.severity_key === 'moderate_high') byDate[date].high++;

      const conditions = Array.isArray(r.conditions) ? r.conditions : [];
      conditions.forEach((c: any) => {
        const name = c.name || c.condition || 'Unknown';
        condCounts[name] = (condCounts[name] || 0) + 1;
      });
    });

    setTrendData(Object.values(byDate).slice(-14));
    setConditionData(
      Object.entries(condCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8)
        .map(([name, count]) => ({ name, count }))
    );
  };

  return (
    <div className="space-y-6">
      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle>{ngo.symptom_frequency || 'Symptom Frequency Trends'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="count" stroke="hsl(174,78%,26%)" fill="hsl(174,78%,26%)" fillOpacity={0.2} name={ngo.total_cases || 'Total Cases'} />
              <Area type="monotone" dataKey="high" stroke="hsl(0,84%,60%)" fill="hsl(0,84%,60%)" fillOpacity={0.2} name={ngo.high_risk_cases || 'High Risk'} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle>{ngo.condition_distribution || 'Condition Distribution'}</CardTitle>
        </CardHeader>
        <CardContent>
          {conditionData.length > 0 ? (
            <div className="space-y-3">
              {conditionData.map((c) => {
                const max = conditionData[0]?.count || 1;
                return (
                  <div key={c.name} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">{c.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${(c.count / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-muted-foreground">{ngo.no_data || 'No data available'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DiseaseTrends;
