import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import PageContainer from '@/components/PageContainer';
import { Activity, Globe, Mic, BookOpen, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-healthcare.jpg';
import bgImage from '@/assets/bg-rural-health.jpg';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const Index = () => {
  const { t } = useLanguage();

  const features = [
    { icon: Activity, title: t.features.symptom_checker, desc: t.features.symptom_checker_desc, color: 'text-primary' },
    { icon: Globe, title: t.features.multilingual, desc: t.features.multilingual_desc, color: 'text-secondary' },
    { icon: Mic, title: t.features.voice, desc: t.features.voice_desc, color: 'text-accent' },
    { icon: BookOpen, title: t.features.health_awareness, desc: t.features.health_awareness_desc, color: 'text-primary' },
  ];

  const steps = [
    { num: '01', title: t.how_it_works.step1_title, desc: t.how_it_works.step1_desc },
    { num: '02', title: t.how_it_works.step2_title, desc: t.how_it_works.step2_desc },
    { num: '03', title: t.how_it_works.step3_title, desc: t.how_it_works.step3_desc },
  ];

  return (
    <PageContainer backgroundImage={bgImage}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Rural healthcare" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.h1
              custom={0}
              variants={fadeUp}
              className="mb-6 text-3xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              {t.hero.headline}
            </motion.h1>
            <motion.p
              custom={1}
              variants={fadeUp}
              className="mb-10 text-lg text-primary-foreground/80 md:text-xl"
            >
              {t.hero.subtext}
            </motion.p>
            <motion.div custom={2} variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/symptom-analysis"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105"
              >
                {t.hero.cta_symptom}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/voice-assistant"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-6 py-3.5 font-semibold text-primary-foreground backdrop-blur-sm transition-transform hover:scale-105 hover:bg-primary-foreground/20"
              >
                <Mic className="h-4 w-4" />
                {t.hero.cta_voice}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-3xl font-bold text-foreground"
        >
          {t.features.title}
        </motion.h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card-glass rounded-2xl border border-border p-6 transition-shadow hover:shadow-elevated"
            >
              <f.icon className={`mb-4 h-10 w-10 ${f.color}`} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-foreground"
          >
            {t.how_it_works.title}
          </motion.h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
                  {step.num}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
};

export default Index;
