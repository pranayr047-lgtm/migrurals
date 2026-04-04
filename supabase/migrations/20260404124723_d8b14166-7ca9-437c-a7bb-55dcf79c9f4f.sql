
CREATE TABLE public.ai_evaluation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  input_text text NOT NULL,
  model_used text NOT NULL DEFAULT 'gemini',
  latency_ms integer NOT NULL DEFAULT 0,
  detected_symptoms_count integer NOT NULL DEFAULT 0,
  conditions_count integer NOT NULL DEFAULT 0,
  severity text,
  language text NOT NULL DEFAULT 'en',
  response_valid boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_evaluation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own logs" ON public.ai_evaluation_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own logs" ON public.ai_evaluation_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "NGO admins can view all logs" ON public.ai_evaluation_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'ngo_admin'));

CREATE INDEX idx_ai_eval_logs_created ON public.ai_evaluation_logs (created_at DESC);
CREATE INDEX idx_ai_eval_logs_model ON public.ai_evaluation_logs (model_used);
