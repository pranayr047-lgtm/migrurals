import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Activity, Globe, Mic, BookOpen, ArrowRight, Heart, Shield, Users } from 'lucide-react';
import heroImage from '@/assets/hero-healthcare.jpg';
import bgCommunity from '@/assets/bg-community-health.jpg';
import bgMigrant from '@/assets/bg-migrant-workers.jpg';
import bgMedical from '@/assets/bg-medical-outreach.jpg';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Index = () => {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] as any });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const features = [
    { icon: Activity, title: t.features.symptom_checker, desc: t.features.symptom_checker_desc, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Globe, title: t.features.multilingual, desc: t.features.multilingual_desc, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Mic, title: t.features.voice, desc: t.features.voice_desc, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: BookOpen, title: t.features.health_awareness, desc: t.features.health_awareness_desc, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  const steps = [
    { num: '01', title: t.how_it_works.step1_title, desc: t.how_it_works.step1_desc, icon: Mic },
    { num: '02', title: t.how_it_works.step2_title, desc: t.how_it_works.step2_desc, icon: Shield },
    { num: '03', title: t.how_it_works.step3_title, desc: t.how_it_works.step3_desc, icon: Heart },
  ];

  const stats = [
    { value: '10K+', label: 'Users Helped' },
    { value: '4', label: 'Languages' },
    { value: '50+', label: 'Rural Areas' },
    { value: '24/7', label: 'AI Available' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 z-0">
          <img src={heroImage} alt="Rural healthcare" className="h-full w-full object-cover scale-110" />
          <div className="absolute inset-0 bg-hero-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary-foreground/20"
              style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 container mx-auto px-4 py-24 md:py-36">
          <motion.div initial="hidden" animate="visible" className="mx-auto max-w-4xl text-center">
            <motion.div custom={0} variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm font-medium text-primary-foreground/90">AI-Powered Healthcare for Rural Communities</span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="mb-6 text-4xl font-extrabold leading-[1.1] text-primary-foreground md:text-6xl lg:text-7xl"
            >
              {t.hero.headline}
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              className="mb-10 text-lg text-primary-foreground/80 md:text-xl max-w-2xl mx-auto"
            >
              {t.hero.subtext}
            </motion.p>
            <motion.div custom={3} variants={fadeUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/symptom-analysis"
                className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {t.hero.cta_symptom}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/voice-assistant"
                className="group inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-8 py-4 font-semibold text-primary-foreground backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary-foreground/20"
              >
                <Mic className="h-4 w-4" />
                {t.hero.cta_voice}
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 100" className="w-full h-16 md:h-24 fill-background">
            <path d="M0,60 C360,100 720,20 1080,60 C1260,80 1360,70 1440,60 L1440,100 L0,100 Z" />
          </svg>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-10 -mt-4 mb-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-elevated"
          >
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} className="text-center">
                  <p className="text-2xl font-extrabold text-gradient md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features with background image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgCommunity} alt="" className="h-full w-full object-cover opacity-[0.04]" />
        </div>
        <div className="absolute inset-0 bg-dots" />

        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">Features</span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{t.features.title}</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group card-glass rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-elevated hover:border-primary/20"
              >
                <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${f.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <f.icon className={`h-7 w-7 ${f.color}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section with background image */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={bgMigrant} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95" />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl grid gap-10 md:grid-cols-2 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <span className="mb-3 inline-block rounded-full bg-accent/10 px-4 py-1 text-sm font-semibold text-accent">Our Impact</span>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">Bridging Healthcare Gaps for Migrant & Rural Communities</h2>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                MIGRurals uses AI technology to provide accessible, multilingual healthcare guidance to underserved populations. 
                Our platform breaks down language barriers and connects communities with vital health information.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Community Focused</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2">
                  <Globe className="h-4 w-4 text-secondary" />
                  <span className="text-sm font-medium text-foreground">Multilingual</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2">
                  <Shield className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium text-foreground">AI Powered</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-elevated"
            >
              <img src={bgCommunity} alt="Community healthcare" className="w-full h-72 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-semibold text-primary-foreground">Healthcare Outreach Program</p>
                <p className="text-xs text-primary-foreground/70">Serving rural communities across India</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative bg-muted/30 py-20">
        <div className="absolute inset-0 bg-dots opacity-50" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-secondary/10 px-4 py-1 text-sm font-semibold text-secondary">Process</span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">{t.how_it_works.title}</h2>
          </motion.div>

          <div className="mx-auto max-w-4xl">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-1/2 top-48 bottom-20 w-px bg-gradient-to-b from-primary/20 via-primary/10 to-transparent" />
            
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="group relative text-center"
                >
                  <motion.div
                    whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                    className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-accent text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110"
                  >
                    <step.icon className="h-8 w-8" />
                  </motion.div>
                  <span className="mb-2 block text-xs font-bold text-primary/60 uppercase tracking-widest">Step {step.num}</span>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with medical outreach background */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgMedical} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Ready to Get Started?</h2>
            <p className="mb-8 text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Start analyzing your symptoms now with our AI-powered assistant. Available in 4 languages, 24/7.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link to="/symptom-analysis" className="group inline-flex items-center gap-2 rounded-2xl bg-accent px-8 py-4 font-semibold text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Get Health Advice
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-foreground/30 bg-primary-foreground/10 px-8 py-4 font-semibold text-primary-foreground backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-primary-foreground/20">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
