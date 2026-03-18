import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import bgCommunity from '@/assets/bg-community-health.jpg';
import { Thermometer, Droplets, Apple, Heart, Baby, Waves } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
};

const HealthEducation = () => {
  const { t } = useLanguage();

  const topics = [
    { icon: Thermometer, title: t.education.topics.fever, desc: t.education.topics.fever_desc, color: 'text-destructive', bg: 'bg-destructive/10' },
    { icon: Droplets, title: t.education.topics.hygiene, desc: t.education.topics.hygiene_desc, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Apple, title: t.education.topics.nutrition, desc: t.education.topics.nutrition_desc, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Heart, title: t.education.topics.first_aid, desc: t.education.topics.first_aid_desc, color: 'text-destructive', bg: 'bg-destructive/10' },
    { icon: Baby, title: t.education.topics.maternal, desc: t.education.topics.maternal_desc, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: Waves, title: t.education.topics.waterborne, desc: t.education.topics.waterborne_desc, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header with subtle bg */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgCommunity} alt="" className="h-full w-full object-cover opacity-[0.06]" />
        </div>
        <div className="absolute inset-0 bg-dots" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">Education</span>
            <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">{t.education.title}</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">{t.education.subtitle}</p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group card-glass rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-elevated hover:border-primary/20 cursor-pointer"
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${topic.bg} transition-transform group-hover:scale-110`}>
                <topic.icon className={`h-7 w-7 ${topic.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{topic.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HealthEducation;
