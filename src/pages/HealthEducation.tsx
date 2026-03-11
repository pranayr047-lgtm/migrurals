import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import PageContainer from '@/components/PageContainer';
import bgImage from '@/assets/bg-rural-health.jpg';
import { Thermometer, Droplets, Apple, Heart, Baby, Waves } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const HealthEducation = () => {
  const { t } = useLanguage();

  const topics = [
    { icon: Thermometer, title: t.education.topics.fever, desc: t.education.topics.fever_desc, color: 'text-destructive' },
    { icon: Droplets, title: t.education.topics.hygiene, desc: t.education.topics.hygiene_desc, color: 'text-secondary' },
    { icon: Apple, title: t.education.topics.nutrition, desc: t.education.topics.nutrition_desc, color: 'text-primary' },
    { icon: Heart, title: t.education.topics.first_aid, desc: t.education.topics.first_aid_desc, color: 'text-destructive' },
    { icon: Baby, title: t.education.topics.maternal, desc: t.education.topics.maternal_desc, color: 'text-accent' },
    { icon: Waves, title: t.education.topics.waterborne, desc: t.education.topics.waterborne_desc, color: 'text-secondary' },
  ];

  return (
    <PageContainer backgroundImage={bgImage}>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t.education.title}</h1>
          <p className="text-muted-foreground">{t.education.subtitle}</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card-glass rounded-2xl border border-border p-6 transition-shadow hover:shadow-elevated cursor-pointer"
            >
              <topic.icon className={`mb-4 h-10 w-10 ${topic.color}`} />
              <h3 className="mb-2 text-lg font-semibold text-foreground">{topic.title}</h3>
              <p className="text-sm text-muted-foreground">{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default HealthEducation;
