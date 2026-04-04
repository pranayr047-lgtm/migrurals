import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Brain, Zap, Activity, Clock, BarChart3, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EvalStats {
  total: number;
  avg_latency: number;
  by_model: Record<string, { count: number; avg_latency: number }>;
}

const AIModelSettings = () => {
  const { t } = useLanguage();
  const ai = (t as any).ai_settings || {};
  const [selectedModel, setSelectedModel] = useState('gemini_flash');
  const [evalStats, setEvalStats] = useState<EvalStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('migrurals_ai_model');
    if (saved) setSelectedModel(saved);
    loadEvalStats();
  }, []);

  const loadEvalStats = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('ai_evaluation_logs')
        .select('model_used, latency_ms, response_valid, created_at')
        .order('created_at', { ascending: false })
        .limit(500);

      if (data && data.length > 0) {
        const byModel: Record<string, { count: number; total_latency: number }> = {};
        let totalLatency = 0;

        data.forEach((log: any) => {
          totalLatency += log.latency_ms;
          if (!byModel[log.model_used]) byModel[log.model_used] = { count: 0, total_latency: 0 };
          byModel[log.model_used].count++;
          byModel[log.model_used].total_latency += log.latency_ms;
        });

        const byModelStats: Record<string, { count: number; avg_latency: number }> = {};
        Object.entries(byModel).forEach(([model, stats]) => {
          byModelStats[model] = { count: stats.count, avg_latency: Math.round(stats.total_latency / stats.count) };
        });

        setEvalStats({
          total: data.length,
          avg_latency: Math.round(totalLatency / data.length),
          by_model: byModelStats,
        });
      }
    } catch (e) {
      console.error('Failed to load eval stats:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem('migrurals_ai_model', model);
    toast.success(ai.model_changed || `AI model switched to ${model}`);
  };

  const models = [
    {
      id: 'gemini_flash',
      name: 'Gemini Flash',
      description: ai.gemini_flash_desc || 'Fast and balanced AI model. Good accuracy with low latency.',
      icon: Zap,
      badge: ai.recommended || 'Recommended',
      color: 'text-primary',
    },
    {
      id: 'gemini_pro',
      name: 'Gemini Pro',
      description: ai.gemini_pro_desc || 'Highest accuracy model. Best for complex symptom analysis. Slower response.',
      icon: Brain,
      badge: ai.high_accuracy || 'High Accuracy',
      color: 'text-accent',
    },
    {
      id: 'gpt5',
      name: 'GPT-5 Mini',
      description: ai.gpt5_desc || 'Powerful reasoning model. Excellent for nuanced medical analysis.',
      icon: Activity,
      badge: ai.powerful || 'Powerful',
      color: 'text-secondary',
    },
    {
      id: 'fine_tuned',
      name: ai.fine_tuned_name || 'Fine-Tuned Medical Model',
      description: ai.fine_tuned_desc || 'Custom fine-tuned model for rural healthcare. Requires external endpoint configuration.',
      icon: CheckCircle2,
      badge: ai.custom || 'Custom',
      color: 'text-muted-foreground',
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        {ai.title || 'AI Model Settings'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {ai.description || 'Choose which AI model to use for symptom analysis. Different models offer trade-offs between speed and accuracy.'}
      </p>

      {/* Model Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        {models.map((model, i) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedModel === model.id
                  ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                  : 'border-border/50 card-glass'
              }`}
              onClick={() => handleModelChange(model.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-muted p-2 ${model.color}`}>
                      <model.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{model.name}</h3>
                      <span className="text-xs rounded-full bg-muted px-2 py-0.5">{model.badge}</span>
                    </div>
                  </div>
                  <Switch
                    checked={selectedModel === model.id}
                    onCheckedChange={() => handleModelChange(model.id)}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{model.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Evaluation Metrics */}
      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            {ai.eval_title || 'AI Performance Metrics'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">{ai.loading || 'Loading metrics...'}</p>
          ) : evalStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{evalStats.total}</p>
                  <p className="text-xs text-muted-foreground">{ai.total_analyses || 'Total Analyses'}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold text-foreground">{evalStats.avg_latency}ms</p>
                  <p className="text-xs text-muted-foreground">{ai.avg_latency || 'Avg Latency'}</p>
                </div>
              </div>

              {Object.keys(evalStats.by_model).length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">{ai.by_model || 'By Model'}</h4>
                  <div className="space-y-2">
                    {Object.entries(evalStats.by_model).map(([model, stats]) => (
                      <div key={model} className="flex items-center justify-between rounded-lg bg-background/50 border border-border/50 px-3 py-2">
                        <span className="text-sm font-medium text-foreground">{model}</span>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{stats.count} {ai.uses || 'uses'}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{stats.avg_latency}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{ai.no_data || 'No evaluation data yet. Metrics will appear after symptom analyses are performed.'}</p>
          )}
          <Button variant="outline" size="sm" className="mt-4" onClick={loadEvalStats}>
            {ai.refresh || 'Refresh Metrics'}
          </Button>
        </CardContent>
      </Card>

      {/* Fine-Tuned Model Setup Info */}
      <Card className="card-glass border-border/50">
        <CardHeader>
          <CardTitle className="text-base">{ai.fine_tune_setup || 'Fine-Tuned Model Setup'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {ai.fine_tune_info || 'To use a custom fine-tuned model (e.g., Mistral 7B with LoRA), deploy it externally and configure the endpoint:'}
          </p>
          <div className="rounded-lg bg-muted p-3 text-xs font-mono text-muted-foreground">
            <p>1. Fine-tune using HuggingFace + LoRA/PEFT</p>
            <p>2. Deploy model via FastAPI or vLLM</p>
            <p>3. Set <span className="text-primary">FINE_TUNED_MODEL_URL</span> secret</p>
            <p>4. Select "Fine-Tuned Medical Model" above</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {ai.fine_tune_note || 'The endpoint must accept OpenAI-compatible chat completion requests.'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModelSettings;
