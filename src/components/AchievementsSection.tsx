import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, Award, Crown, Target, Heart, Zap } from 'lucide-react';

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
    timeline?: {
      title: string;
      milestones: Array<{
        year: string;
        title: string;
        description: string;
      }>;
    };
    callToAction?: {
      text: string;
      icon: string;
    };
  };
}

const AchievementsSection = ({ cmsData }: AchievementsSectionProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const shuttleRef = useRef<SVGGElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);


  function getCallToActionIcon(iconName: string) {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-5 h-5 mr-2" />;
      case 'Award': return <Award className="w-5 h-5 mr-2" />;
      default: return <Star className="w-5 h-5 mr-2" />;
    }
  }

  function getAchievementIcon(iconName?: string) {
    switch (iconName) {
      case 'Crown': return <Crown className="w-8 h-8" />;
      case 'Target': return <Target className="w-8 h-8" />;
      case 'Heart': return <Heart className="w-8 h-8" />;
      case 'Zap': return <Zap className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      case 'Award': return <Award className="w-8 h-8" />;
      case 'Medal': return <Medal className="w-8 h-8" />;
      case 'Star': return <Star className="w-8 h-8" />;
      default: return null;
    }
  }

  const defaultAchievements = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: t('home.achievements.items.champions.title'),
      count: '15',
      description: t('home.achievements.items.champions.description'),
      color: 'from-yellow-500 to-amber-600'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('home.achievements.items.medals.title'),
      count: '47',
      description: t('home.achievements.items.medals.description'),
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('home.achievements.items.athletes.title'),
      count: '500+',
      description: t('home.achievements.items.athletes.description'),
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('home.achievements.items.years.title'),
      count: '15',
      description: t('home.achievements.items.years.description'),
      color: 'from-violet-500 to-purple-600'
    }
  ];

  // Prefer CMS items when provided; fallback to translated defaults
  const achievements = (cmsData?.achievements && cmsData.achievements.length > 0
    ? cmsData.achievements.map((cmsItem, index) => {
        const fallback = defaultAchievements[index % defaultAchievements.length];
        return {
          icon: getAchievementIcon(cmsItem.icon) || fallback.icon,
          title: cmsItem.title || fallback.title,
          count: cmsItem.count || fallback.count,
          description: cmsItem.description || fallback.description,
          color: cmsItem.color || fallback.color
        };
      })
    : defaultAchievements
  );

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('AchievementsSection - CMS Data:', cmsData);
    console.log('AchievementsSection - Using achievements:', achievements);
    console.log('AchievementsSection - Default achievements:', defaultAchievements);
  }

  const defaultMilestones = [
    {
      year: '2010',
      title: t('home.achievements.timeline.defaults.2010.title'),
      description: t('home.achievements.timeline.defaults.2010.description')
    },
    {
      year: '2015',
      title: t('home.achievements.timeline.defaults.2015.title'),
      description: t('home.achievements.timeline.defaults.2015.description')
    },
    {
      year: '2018',
      title: t('home.achievements.timeline.defaults.2018.title'),
      description: t('home.achievements.timeline.defaults.2018.description')
    },
    {
      year: '2020',
      title: t('home.achievements.timeline.defaults.2020.title'),
      description: t('home.achievements.timeline.defaults.2020.description')
    },
    {
      year: '2024',
      title: t('home.achievements.timeline.defaults.2024.title'),
      description: t('home.achievements.timeline.defaults.2024.description')
    }
  ];

  const milestones = cmsData?.timeline?.milestones || defaultMilestones;
  const milestoneProgressPoints = milestones.map((_, i) => (i + 1) / (milestones.length + 1));

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current || !pathRef.current || !shuttleRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      // Прогресс анимации от 0 до 1, пока секция прокручивается через вьюпорт
      let progress = (viewportH - rect.top) / (rect.height + viewportH);
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);

      const path = pathRef.current;
      const total = path.getTotalLength();
      const len = total * progress;
      const pt = path.getPointAtLength(len);
      const next = path.getPointAtLength(Math.min(total, len + 1));
      const angle = Math.atan2(next.y - pt.y, next.x - pt.x) * (180 / Math.PI);

      // Центруем 28x28 воланчик относительно точки
      shuttleRef.current.setAttribute(
        'transform',
        `translate(${pt.x}, ${pt.y}) rotate(${angle}) translate(-14, -14)`
      );
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition as any);
      window.removeEventListener('resize', updatePosition as any);
    };
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Medal className="w-8 h-8 text-white drop-shadow-sm" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {cmsData?.title || t('home.achievements.title')}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {cmsData?.subtitle || t('home.achievements.subtitle')}
          </p>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement: any, index: number) => (
            <motion.div
              key={index}
              className="bg-white rounded-3xl p-8 text-center group transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                {achievement.icon}
              </div>
              <div className="text-3xl font-bold text-primary-black mb-2">{achievement.count}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.title}</h3>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          className="bg-white rounded-2xl p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            {cmsData?.timeline?.title || t('home.achievements.timeline.title')}
          </h3>
          
          <div className="relative min-h-[400px] md:min-h-[620px]" ref={containerRef}>
            {/* Wavy timeline path - скрыт на мобильных */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1000 620" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tlGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="shuttleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Извилистый путь, проходящий через всю высоту */}
              <path ref={pathRef} id="timelinePath" d="M 50 40 C 250 80, 200 160, 420 200 S 620 320, 820 300 S 700 440, 500 480 S 300 560, 150 600" fill="none" stroke="url(#tlGrad)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10 14" />

              {/* Воланчик-изображение, двигается по пути при скролле - уменьшенный размер */}
              <g ref={shuttleRef}>
                <image href="/shuttle.png" width="28" height="28" x="0" y="0" preserveAspectRatio="xMidYMid meet" />
              </g>
            </svg>

            <div className="space-y-6 md:space-y-8 relative">
              {milestones.map((milestone, index) => {
                const mp = milestoneProgressPoints[index];
                const isActive = scrollProgress >= mp - 0.02;
                const isLeft = index % 2 === 0;
                return (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:flex-row`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ marginTop: index === 0 ? '20px' : undefined }}
                >
                  <div className={`w-full md:w-1/2 ${isLeft ? 'md:pl-8 md:text-left' : 'md:pr-8 md:text-right'} text-center md:text-left px-4 md:px-0 relative`}>
                    {isActive && (
                      <>
                        {/* Тонкая вертикальная полоса у края (не рамка) - скрыта на мобильных */}
                        <div className={`hidden md:block absolute top-3 bottom-3 ${isLeft ? 'left-0' : 'right-0'} w-[2px] bg-gradient-to-b from-primary-yellow/60 to-primary-blue/60`}></div>
                        {/* Деликатное свечение позади карточки */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary-yellow/10 to-primary-blue/10 blur-xl rounded-2xl"></div>
                      </>
                    )}
                    <div className={`relative bg-white rounded-lg p-4 md:p-6 transition-transform duration-300 shadow-sm ${isActive ? 'scale-[1.02]' : ''}`}>
                      <div className={`text-xl md:text-2xl font-bold mb-2 ${isActive ? 'text-primary-yellow' : 'text-primary-blue'}`}>{milestone.year}</div>
                      <h4 className={`text-base md:text-lg font-semibold mb-2 ${isActive ? 'text-primary-blue' : 'text-gray-900'}`}>{milestone.title}</h4>
                      <p className="text-sm md:text-base text-gray-600 leading-relaxed">{milestone.description}</p>
                      {/* Аккуратная линия-подчеркивание снизу */}
                      <div className={`absolute left-0 bottom-0 h-[2px] bg-gradient-to-r from-primary-yellow to-primary-blue transition-all duration-500 ${isActive ? 'w-full' : 'w-0'}`}></div>
                    </div>
                  </div>
                  
                  {/* Соединительная точка заменена на пустое пространство (путь проходит позади) - скрыта на мобильных */}
                  <div className="hidden md:block w-4" />
                  
                  <div className="hidden md:block md:w-1/2"></div>
                </motion.div>
              );})}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16 px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.div 
            className="inline-flex items-center px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-blue to-primary-yellow text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer max-w-full"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="flex-shrink-0"
            >
              {getCallToActionIcon(cmsData?.callToAction?.icon || 'Star')}
            </motion.div>
            <span className="font-semibold text-sm sm:text-base md:text-lg text-center leading-tight">
              {cmsData?.callToAction?.text || t('home.achievements.cta')}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
