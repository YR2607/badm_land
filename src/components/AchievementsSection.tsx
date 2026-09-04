import { useTranslation } from 'react-i18next';
import LocalizedLink from './LocalizedLink';
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
        <div className="mb-24 relative">
          <h2 className="text-8xl md:text-[12rem] font-black font-display leading-[0.8] tracking-tighter uppercase text-zenith-black opacity-10 absolute -top-10 left-0 pointer-events-none select-none">
            {t('home.achievements.decorative', 'IMPACT')}
          </h2>
          <h2 className="text-4xl md:text-8xl font-black font-display leading-tight-impact tracking-tighter uppercase text-zenith-black relative z-10 break-words [overflow-wrap:anywhere]">
            {cmsData?.title || t('home.achievements.title', 'Наши достижения')}
          </h2>
          <div className="w-32 h-4 bg-zenith-crimson mt-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-h-[600px]">
          {achievements.map((item, index) => (
            <div
              key={index}
              className={`bento-card p-10 flex flex-col justify-between group cursor-default transition-transform duration-300 hover:-translate-y-2.5 ${item.className}`}
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
            </div>
          ))}
        </div>

        {/* Timeline Bento CTA */}
        <div
          className="mt-6 bento-card bg-zenith-black text-white p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="max-w-2xl">
            <h3 className="text-3xl md:text-5xl font-black font-display uppercase tracking-tight leading-none mb-8 break-words [overflow-wrap:anywhere]">
              {t('home.achievements.timeline.title', 'История успеха')}
            </h3>
            <p className="text-xl md:text-2xl opacity-70 font-medium leading-relaxed">
              {t('home.achievements.subtitle', 'Мы прошли длинный путь от маленькой секции до ведущего клуба страны, воспитав сотни чемпионов.')}
            </p>
          </div>
          <LocalizedLink
            to="/about"
            className="px-12 py-6 bg-zenith-crimson text-white font-black uppercase tracking-widest text-xl inline-block transition-colors duration-300 hover:bg-zenith-black"
          >
            {t('common.more', 'Узнать больше')}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
