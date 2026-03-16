import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const ReportedSymptoms = () => {
  const { t } = useLanguage();
  const ngo = (t as any).ngo || {};
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const { data } = await supabase
      .from('analysis_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data) setReports(data);
  };

  const severityColor = (s: string) => {
    if (s === 'high' || s === 'moderate_high') return 'destructive';
    if (s === 'moderate' || s === 'mild_moderate') return 'default';
    return 'secondary';
  };

  return (
    <Card className="card-glass border-border/50">
      <CardHeader>
        <CardTitle>{ngo.reported_symptoms || 'Reported Symptoms'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{ngo.col_id || 'Report ID'}</TableHead>
              <TableHead>{ngo.col_symptoms || 'Symptoms'}</TableHead>
              <TableHead>{ngo.col_condition || 'Possible Condition'}</TableHead>
              <TableHead>{ngo.col_severity || 'Severity'}</TableHead>
              <TableHead>{ngo.col_language || 'Language'}</TableHead>
              <TableHead>{ngo.col_timestamp || 'Timestamp'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  {ngo.no_reports || 'No symptom reports found'}
                </TableCell>
              </TableRow>
            ) : (
              reports.map((r) => {
                const conditions = Array.isArray(r.conditions) ? r.conditions : [];
                const topCondition = conditions[0]?.name || conditions[0]?.condition || '—';
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {r.detected_symptoms?.slice(0, 3).map((s: string) => (
                          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{topCondition}</TableCell>
                    <TableCell>
                      <Badge variant={severityColor(r.severity_key)}>{r.severity_key}</Badge>
                    </TableCell>
                    <TableCell className="text-sm uppercase">{r.language}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportedSymptoms;
