import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { analyzeSymptoms } from '@/services/symptomAnalyzer';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Mic, MicOff, Activity, AlertTriangle, Shield, Stethoscope } from 'lucide-react';

const VoiceAssistant = () => {
  const { t } = useLanguage();
  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition();
  const [lastTranscript, setLastTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeSymptoms>> | null>(null);

  useEffect(() => {
    if (!isListening && transcript && transcript !== lastTranscript) {
      setLastTranscript(transcript);
      handleAnalyze(transcript);
    }
  }, [isListening, transcript]);

  const handleAnalyze = async (text: string) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const res = await analyzeSymptoms(text);
      setResult(res);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t.voice_page.title}</h1>
          <p className="mb-10 text-muted-foreground">{t.voice_page.subtitle}</p>

          {/* Mic Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            disabled={!isSupported}
            className={`mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full transition-all ${
              isListening
                ? 'animate-pulse-glow bg-destructive text-destructive-foreground shadow-xl'
                : 'bg-primary text-primary-foreground shadow-elevated hover:scale-105'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
          </motion.button>

          <p className="mb-2 text-sm font-medium text-foreground">
            {isListening ? t.voice_page.stop : t.voice_page.tap_to_speak}
          </p>
          <p className="mb-8 text-xs text-muted-foreground">{t.voice_page.instruction}</p>

          {!isSupported && (
            <p className="mb-6 text-sm text-destructive">Speech recognition is not supported in this browser.</p>
          )}

          {/* Transcript */}
          {(transcript || lastTranscript) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 rounded-xl border border-border bg-card p-4 text-left"
            >
              <p className="text-xs font-medium text-muted-foreground mb-1">You said:</p>
              <p className="text-foreground">{transcript || lastTranscript}</p>
            </motion.div>
          )}

          {/* Analyzing */}
          {isAnalyzing && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              {t.symptom.analyzing}
            </div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 text-left"
            >
              <div>
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Activity className="h-5 w-5 text-primary" />
                  {t.symptom.detected_symptoms}
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.detected_symptoms.map((s, i) => (
                    <span key={i} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <AlertTriangle className="h-5 w-5" />
                  {t.symptom.severity}
                </div>
                <span className={`font-bold ${result.severity_level.includes('High') ? 'text-destructive' : result.severity_level.includes('Moderate') ? 'text-accent' : 'text-primary'}`}>
                  {result.severity_level}
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Stethoscope className="h-5 w-5 text-secondary" />
                  {t.symptom.possible_conditions}
                </div>
                <ul className="space-y-1">
                  {result.possible_conditions.map((c, i) => (
                    <li key={i} className="flex justify-between text-sm">
                      <span className="text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">{c.probability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <Shield className="h-5 w-5 text-primary" />
                  {t.symptom.precautions}
                </div>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {result.precautions.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>

              <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                <p className="font-medium text-accent-foreground">🏥 {t.symptom.when_to_visit}</p>
                <p className="text-sm text-muted-foreground">{result.when_to_visit}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default VoiceAssistant;
