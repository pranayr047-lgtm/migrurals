import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { analyzeSymptoms } from '@/services/symptomAnalyzer';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Send, Mic, MicOff, AlertTriangle, Activity, Shield, Stethoscope } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: {
    detected_symptoms: string[];
    possible_conditions: { name: string; probability: string }[];
    precautions: string[];
    severity_level: string;
    when_to_visit: string;
  };
}

const SymptomAnalysis = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: t.symptom.welcome_message,
      }]);
    }
  }, [t.symptom.welcome_message]);

  // Update input from speech
  useEffect(() => {
    if (transcript) setInput(transcript);
  }, [transcript]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isAnalyzing) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeSymptoms(text);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        analysis: result,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const severityColor = (level: string) => {
    if (level.includes('High')) return 'text-destructive';
    if (level.includes('Moderate')) return 'text-accent';
    return 'text-primary';
  };

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="container mx-auto flex min-h-[calc(100vh-80px)] flex-col px-4 py-6">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t.symptom.title}</h1>
          <p className="text-sm text-muted-foreground">{t.symptom.subtitle}</p>
        </div>

        {/* Chat Area */}
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}>
                  {msg.content && <p className="text-sm">{msg.content}</p>}

                  {/* Analysis Results */}
                  {msg.analysis && (
                    <div className="space-y-3 text-sm">
                      {/* Detected Symptoms */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold">
                          <Activity className="h-4 w-4 text-primary" />
                          {t.symptom.detected_symptoms}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.analysis.detected_symptoms.map((s, i) => (
                            <span key={i} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Severity */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold">
                          <AlertTriangle className="h-4 w-4" />
                          {t.symptom.severity}
                        </div>
                        <span className={`font-bold ${severityColor(msg.analysis.severity_level)}`}>
                          {msg.analysis.severity_level}
                        </span>
                      </div>

                      {/* Conditions */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold">
                          <Stethoscope className="h-4 w-4 text-secondary" />
                          {t.symptom.possible_conditions}
                        </div>
                        <ul className="space-y-1">
                          {msg.analysis.possible_conditions.map((c, i) => (
                            <li key={i} className="flex justify-between">
                              <span>{c.name}</span>
                              <span className="text-xs text-muted-foreground">{c.probability}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Precautions */}
                      <div>
                        <div className="mb-1 flex items-center gap-1.5 font-semibold">
                          <Shield className="h-4 w-4 text-primary" />
                          {t.symptom.precautions}
                        </div>
                        <ul className="list-inside list-disc space-y-0.5 text-muted-foreground">
                          {msg.analysis.precautions.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>

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

          {/* Disclaimer */}
          <div className="border-t border-border bg-muted/50 px-4 py-2">
            <p className="text-center text-xs text-muted-foreground">{t.symptom.disclaimer}</p>
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              {isSupported && (
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isListening
                      ? 'animate-pulse-glow bg-destructive text-destructive-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.symptom.input_placeholder}
                className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isAnalyzing}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {isListening && (
              <p className="mt-2 text-center text-xs text-destructive animate-pulse">{t.symptom.listening}</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default SymptomAnalysis;
