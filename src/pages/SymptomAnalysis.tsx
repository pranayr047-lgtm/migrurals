import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Send, Mic, MicOff, AlertTriangle, Activity, Shield, Stethoscope, Heart, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface AIAnalysis {
  detected_symptoms: string[];
  possible_conditions: { name: string; probability: string; explanation: string }[];
  severity: string;
  precautions: string[];
  when_to_visit: string;
  medication_warnings?: string[];
  lifestyle_advice?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: AIAnalysis;
  error?: boolean;
}

const SymptomAnalysis = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ id: 'welcome', role: 'assistant', content: t.symptom.welcome_message }]);
    }
  }, [t.symptom.welcome_message]);

  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user health profile for AI context
  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('age, gender, blood_type, height_cm, weight_kg, allergies, pre_existing_conditions')
      .eq('user_id', user.id).single().then(({ data }) => {
        if (data) setUserProfile(data as unknown as Record<string, unknown>);
      });
  }, [user]);

  const severityColor = (sev: string) => {
    const lower = sev.toLowerCase();
    if (lower.includes('high') || lower.includes('critical')) return 'text-destructive';
    if (lower.includes('moderate')) return 'text-accent';
    return 'text-primary';
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isAnalyzing) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: text }]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-symptoms', {
        body: { symptoms: text, language, userProfile },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: data.error, error: true }]);
      } else {
        const analysis = data as AIAnalysis;
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: '', analysis }]);

        // Save to history
        if (user) {
          await supabase.from('analysis_history').insert([{
            user_id: user.id,
            input_text: text,
            detected_symptoms: analysis.detected_symptoms,
            conditions: JSON.parse(JSON.stringify(analysis.possible_conditions)),
            severity_key: analysis.severity,
            precaution_keys: analysis.precautions,
            when_to_visit_key: analysis.when_to_visit,
            language,
          }]);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'An error occurred during analysis. Please try again.', error: true }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col px-4 py-6">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.symptom.title}</h1>
          <p className="text-sm text-muted-foreground">{t.symptom.subtitle}</p>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-br-md'
                    : msg.error ? 'bg-destructive/10 text-destructive rounded-bl-md'
                    : 'bg-muted text-foreground rounded-bl-md'}`}>
                  
                  {msg.content && <p className="text-sm">{msg.content}</p>}

                  {msg.analysis && (
                    <div className="space-y-3 text-sm">
                      {/* Detected Symptoms */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold"><Activity className="h-4 w-4 text-primary" />{t.symptom.detected_symptoms}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.analysis.detected_symptoms.map((s, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Severity */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold"><AlertTriangle className="h-4 w-4" />{t.symptom.severity}</div>
                        <span className={`font-bold ${severityColor(msg.analysis.severity)}`}>{msg.analysis.severity}</span>
                      </div>

                      {/* Conditions */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold"><Stethoscope className="h-4 w-4 text-secondary" />{t.symptom.possible_conditions}</div>
                        <ul className="space-y-2">
                          {msg.analysis.possible_conditions.map((c, i) => (
                            <li key={i} className="rounded-lg border border-border bg-background/50 p-2">
                              <div className="flex justify-between"><span className="font-medium">{c.name}</span><span className="text-xs text-muted-foreground">{c.probability}</span></div>
                              {c.explanation && <p className="mt-0.5 text-xs text-muted-foreground">{c.explanation}</p>}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Precautions */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold"><Shield className="h-4 w-4 text-primary" />{t.symptom.precautions}</div>
                        <ul className="list-inside list-disc space-y-0.5 text-muted-foreground">
                          {msg.analysis.precautions.map((p, i) => <li key={i}>{p}</li>)}
                        </ul>
                      </div>

                      {/* Medication Warnings */}
                      {msg.analysis.medication_warnings && msg.analysis.medication_warnings.length > 0 && (
                        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2.5">
                          <div className="mb-1 flex items-center gap-1.5 font-semibold text-destructive"><AlertCircle className="h-4 w-4" /> Medication Warnings</div>
                          <ul className="list-inside list-disc space-y-0.5 text-xs text-destructive">
                            {msg.analysis.medication_warnings.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      )}

                      {/* Lifestyle Advice */}
                      {msg.analysis.lifestyle_advice && (
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                          <div className="mb-1 flex items-center gap-1.5 font-semibold text-primary"><Heart className="h-4 w-4" /> Personalized Advice</div>
                          <p className="text-xs text-muted-foreground">{msg.analysis.lifestyle_advice}</p>
                        </div>
                      )}

                      {/* When to visit */}
                      <div className="rounded-lg border border-accent/30 bg-accent/10 p-2.5">
                        <p className="font-medium text-accent-foreground">🏥 {t.symptom.when_to_visit}</p>
                        <p className="text-xs text-muted-foreground">{msg.analysis.when_to_visit}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                    {t.symptom.analyzing}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-border bg-muted/50 px-4 py-2">
            <p className="text-center text-xs text-muted-foreground">{t.symptom.disclaimer}</p>
          </div>

          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              {isSupported && (
                <button onClick={isListening ? stopListening : startListening}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isListening ? 'animate-pulse-glow bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'}`}>
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder={t.symptom.input_placeholder}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <button onClick={handleSend} disabled={!input.trim() || isAnalyzing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-50">
                <Send className="h-4 w-4" />
              </button>
            </div>
            {isListening && <p className="mt-2 text-center text-xs text-destructive animate-pulse">{t.symptom.listening}</p>}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SymptomAnalysis;
