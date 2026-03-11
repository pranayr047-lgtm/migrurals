/// <reference types="vite/client" />

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition: new () => SpeechRecognitionInstance;
}
