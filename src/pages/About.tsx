import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import heroImage from '@/assets/hero-healthcare.jpg';
import { Target, Lightbulb, AlertTriangle } from 'lucide-react';

const About = () => {
  const { t } = useLanguage();

  const sections = [
    { icon: Target, title: t.about.mission_title, desc: t.about.mission_desc, color: 'text-primary' },
    { icon: Lightbulb, title: t.about.how_title, desc: t.about.how_desc, color: 'text-secondary' },
    { icon: AlertTriangle, title: t.about.disclaimer_title, desc: t.about.disclaimer_desc, color: 'text-accent' },
  ];

  return (
    <PageContainer backgroundImage={bgImage}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Healthcare outreach" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-hero-overlay" />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-3xl font-bold text-primary-foreground md:text-5xl"
          >
            {t.about.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
            className="text-lg text-primary-foreground/80"
          >
            {t.about.subtitle}
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { delay: i * 0.12 } }}
              viewport={{ once: true }}
              className="card-glass rounded-2xl border border-border p-6"
            >
              <s.icon className={`mb-4 h-10 w-10 ${s.color}`} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default About;
