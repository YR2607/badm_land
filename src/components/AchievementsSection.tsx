import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Zap } from 'lucide-react';

interface AchievementsSectionProps {
  cmsData?: {
    title: string;
    subtitle?: string;
    achievements: Array<{
      title: string;
      count: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
}

const AchievementsSection = ({ cmsData }: AchievementsSectionProps) => {
  const { t } = useTranslation();

  const iconMap: Record<string, JSX.Element> = {
    trophy: <Trophy className="w-12 h-12" />,
    medal: <Medal className="w-10 h-10" />,
    target: <Target className="w-10 h-10" />,
    zap: <Zap className="w-10 h-10" />,
  };
  const classMap = [
    "md:col-span-2 md:row-span-2 bg-zenith-crimson text-white",
    "md:col-span-2 bg-white text-zenith-black",
    "md:col-span-1 bg-white text-zenith-black",
    "md:col-span-1 bg-zenith-black text-white",
  ];

  const achievements = (cmsData?.achievements ?? []).map((a, index) => ({
    icon: iconMap[a.icon?.toLowerCase()] || <Trophy className="w-12 h-12" />,
    title: a.title,
    count: a.count,
    description: a.description,
    className: classMap[index % classMap.length],
  }));

  if (!cmsData?.achievements || cmsData.achievements.length === 0) {
    return null;
  }

  return (
    <section className="py-32 bg-zenith-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-24 relative"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-8xl md:text-[12rem] font-black font-display leading-[0.8] tracking-tighter uppercase text-zenith-black opacity-10 absolute -top-10 left-0 pointer-events-none select-none">
            {t('home.achievements.decorative', 'IMPACT')}
          </h2>
          <h2 className="text-4xl md:text-8xl font-black font-display leading-tight-impact tracking-tighter uppercase text-zenith-black relative z-10 break-words [overflow-wrap:anywhere]">
            {cmsData?.title || t('home.achievements.title', 'Наши достижения')}
          </h2>
          <div className="w-32 h-4 bg-zenith-crimson mt-8" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[600px]">
          {achievements.map((item, index) => (
            <motion.div
              key={index}
              className={`bento-card p-10 flex flex-col justify-between group cursor-default ${item.className}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className="flex justify-between items-start">
                <div className="p-4 rounded-2xl bg-current/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <div className="text-6xl md:text-8xl font-black font-display tracking-tighter opacity-20">
                  0{index + 1}
                </div>
              </div>

              <div>
                <div className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-4 leading-none break-words [overflow-wrap:anywhere]">
                  {item.count}
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-4">
                  {item.title}
                </h3>
                <p className="text-base md:text-lg opacity-80 font-medium leading-relaxed max-w-md">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Bento CTA */}
        <motion.div
          className="mt-6 bento-card bg-zenith-black text-white p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight leading-none mb-8 break-words [overflow-wrap:anywhere]">
              {t('home.achievements.timeline.title', 'История успеха')}
            </h3>
            <p className="text-xl md:text-2xl opacity-70 font-medium leading-relaxed">
              {t('home.achievements.subtitle', 'Мы прошли длинный путь от маленькой секции до ведущего клуба страны, воспитав сотни чемпионов.')}
            </p>
          </div>
          <Link
            to="/about"
            className="group relative px-12 py-6 bg-zenith-crimson text-white font-black uppercase tracking-widest text-xl overflow-hidden inline-block"
          >
            <span className="relative z-10">{t('common.more', 'Узнать больше')}</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4, ease: "circOut" }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-zenith-black font-black uppercase tracking-widest text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              {t('common.more', 'Узнать больше')}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
