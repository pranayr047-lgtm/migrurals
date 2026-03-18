import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import bgMedical from '@/assets/bg-medical-outreach.jpg';
import bgCommunity from '@/assets/bg-community-health.jpg';
import { Target, Lightbulb, AlertTriangle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
};

const About = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Target, title: t.about.mission_title, desc: t.about.mission_desc, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Lightbulb, title: t.about.how_title, desc: t.about.how_desc, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: AlertTriangle, title: t.about.disclaimer_title, desc: t.about.disclaimer_desc, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgMedical} alt="Healthcare outreach" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-4xl font-extrabold text-primary-foreground md:text-5xl"
          >
            {t.about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            className="text-lg text-primary-foreground/80 max-w-xl mx-auto"
          >
            {t.about.subtitle}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-10 fill-background">
            <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Cards */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-dots" />
        <div className="relative container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {sections.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="card-glass rounded-2xl border border-border p-8 transition-all duration-300 hover:shadow-elevated hover:border-primary/20"
              >
                <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${s.bg}`}>
                  <s.icon className={`h-7 w-7 ${s.color}`} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image section */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mx-auto max-w-4xl overflow-hidden rounded-3xl shadow-elevated"
        >
          <img src={bgCommunity} alt="Community healthcare" className="w-full h-64 md:h-80 object-cover" />
        </motion.div>
      </section>
    </div>
  );
};

export default About;
