import { useState, useCallback, useRef } from 'react';
import { useLanguage, speechLangCodes } from '@/context/LanguageContext';

interface UseSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
}

export function useSpeechRecognition(): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition || null;
  const isSupported = !!SpeechRecognitionAPI;

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = speechLangCodes[language];
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onresult = (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => {
      const result = Array.from(event.results)
        .map((r) => r[0].transcript)
        .join('');
      setTranscript(result);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript('');
  }, [language, SpeechRecognitionAPI]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, transcript, startListening, stopListening, isSupported };
}
