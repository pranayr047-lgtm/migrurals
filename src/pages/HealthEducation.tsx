import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import bgCommunity from '@/assets/bg-community-health.jpg';
import { Thermometer, Droplets, Apple, Heart, Baby, Waves, ChevronDown, Phone, AlertTriangle, Shield, Stethoscope, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
};

const topicKeys = ['fever', 'hygiene', 'nutrition', 'first_aid', 'maternal', 'waterborne'] as const;
type TopicKey = typeof topicKeys[number];

const topicIcons: Record<TopicKey, React.ElementType> = {
  fever: Thermometer, hygiene: Droplets, nutrition: Apple,
  first_aid: Heart, maternal: Baby, waterborne: Waves,
};
const topicColors: Record<TopicKey, { text: string; bg: string }> = {
  fever: { text: 'text-destructive', bg: 'bg-destructive/10' },
  hygiene: { text: 'text-secondary', bg: 'bg-secondary/10' },
  nutrition: { text: 'text-primary', bg: 'bg-primary/10' },
  first_aid: { text: 'text-destructive', bg: 'bg-destructive/10' },
  maternal: { text: 'text-accent', bg: 'bg-accent/10' },
  waterborne: { text: 'text-secondary', bg: 'bg-secondary/10' },
};

const HealthEducation = () => {
  const { t } = useLanguage();
  const [expandedTopic, setExpandedTopic] = useState<TopicKey | null>(null);
  const edu = t.education as any;
  const emergency = (t as any).emergency;

  const getArr = (key: string): string[] => {
    const val = edu?.topics?.[key];
    return Array.isArray(val) ? val : [];
  };
  const getStr = (key: string): string => {
    const val = edu?.topics?.[key];
    return typeof val === 'string' ? val : '';
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgCommunity} alt="" className="h-full w-full object-cover opacity-[0.06]" />
        </div>
        <div className="absolute inset-0 bg-dots" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">WHO</span>
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">{edu.title}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">{edu.subtitle}</p>
          </motion.div>
        </div>
      </section>

      {/* Topics */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mx-auto max-w-4xl space-y-4">
          {topicKeys.map((key, i) => {
            const Icon = topicIcons[key];
            const color = topicColors[key];
            const isOpen = expandedTopic === key;

            return (
              <motion.div
                key={key}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card-glass rounded-2xl border border-border overflow-hidden transition-all hover:border-primary/20"
              >
                {/* Header - always visible */}
                <button
                  onClick={() => setExpandedTopic(isOpen ? null : key)}
                  className="w-full flex items-center gap-4 p-5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color.bg}`}>
                    <Icon className={`h-6 w-6 ${color.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-foreground">{getStr(key)}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{getStr(`${key}_desc`)}</p>
                  </div>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-5 pb-6 pt-4 space-y-5">
                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed">{getStr(`${key}_desc`)}</p>

                        {/* Key Facts */}
                        {getArr(`${key}_facts`).length > 0 && (
                          <div>
                            <div className="mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-accent" />
                              <h4 className="text-sm font-semibold text-foreground">{edu.key_facts}</h4>
                            </div>
                            <ul className="space-y-1.5 pl-6">
                              {getArr(`${key}_facts`).map((fact: string, fi: number) => (
                                <li key={fi} className="text-sm text-muted-foreground list-disc leading-relaxed">{fact}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Prevention */}
                        {getArr(`${key}_prevention`).length > 0 && (
                          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4 text-primary" />
                              <h4 className="text-sm font-semibold text-foreground">{edu.prevention}</h4>
                            </div>
                            <ul className="space-y-1.5 pl-6">
                              {getArr(`${key}_prevention`).map((item: string, pi: number) => (
                                <li key={pi} className="text-sm text-muted-foreground list-disc leading-relaxed">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Treatment */}
                        {getArr(`${key}_treatment`).length > 0 && (
                          <div className="rounded-xl bg-secondary/5 border border-secondary/10 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-secondary" />
                              <h4 className="text-sm font-semibold text-foreground">{edu.treatment}</h4>
                            </div>
                            <ul className="space-y-1.5 pl-6">
                              {getArr(`${key}_treatment`).map((item: string, ti: number) => (
                                <li key={ti} className="text-sm text-muted-foreground list-disc leading-relaxed">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* When to see doctor */}
                        {getStr(`${key}_doctor`) && (
                          <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-destructive" />
                              <h4 className="text-sm font-semibold text-foreground">{edu.when_to_see_doctor}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{getStr(`${key}_doctor`)}</p>
                          </div>
                        )}

                        <p className="text-xs text-muted-foreground/60 italic">{edu.source_who}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Emergency Numbers */}
      {emergency && (
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <span className="mb-3 inline-block rounded-full bg-destructive/10 px-4 py-1 text-sm font-semibold text-destructive">
                <Phone className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                {emergency.title}
              </span>
              <h2 className="mt-3 text-2xl font-bold text-foreground md:text-3xl">{emergency.title}</h2>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">{emergency.subtitle}</p>
            </motion.div>

            <div className="mx-auto max-w-4xl grid gap-3 sm:grid-cols-2">
              {(emergency.numbers || []).map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-elevated hover:border-primary/20"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                    <Phone className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{item.desc}</p>
                  </div>
                  <a
                    href={`tel:${item.number}`}
                    className="shrink-0 rounded-xl bg-destructive px-3 py-2 text-sm font-bold text-destructive-foreground hover:opacity-90 transition-opacity"
                  >
                    {item.number}
                  </a>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">{emergency.note}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HealthEducation;
