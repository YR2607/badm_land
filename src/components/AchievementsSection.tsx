import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Users, Calendar, Star, Target } from 'lucide-react';

const AchievementsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const shuttleRef = useRef<SVGGElement | null>(null);

  const achievements = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Чемпионы Молдовы',
      count: '15',
      description: 'Наших воспитанников стали чемпионами страны',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Medal className="w-8 h-8" />,
      title: 'Медали на турнирах',
      count: '47',
      description: 'Завоеванных медалей на национальных соревнованиях',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Активных спортсменов',
      count: '500+',
      description: 'Регулярно тренируются в нашем клубе',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Лет успешной работы',
      count: '15',
      description: 'Развиваем бадминтон в Молдове с 2010 года',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const milestones = [
    {
      year: '2010',
      title: 'Основание клуба',
      description: 'Открытие первого зала с 4 кортами'
    },
    {
      year: '2015',
      title: 'Расширение',
      description: 'Открытие второго зала, рост до 200 участников'
    },
    {
      year: '2018',
      title: 'Международное признание',
      description: 'Первые медали на международных турнирах'
    },
    {
      year: '2020',
      title: 'Центр подготовки',
      description: 'Официальный статус регионального центра подготовки'
    },
    {
      year: '2024',
      title: 'Модернизация',
      description: 'Полное обновление оборудования и инфраструктуры'
    }
  ];

  useEffect(() => {
    const updatePosition = () => {
      if (!containerRef.current || !pathRef.current || !shuttleRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      // Прогресс анимации от 0 до 1, пока секция прокручивается через вьюпорт
      let progress = (viewportH - rect.top) / (rect.height + viewportH);
      progress = Math.max(0, Math.min(1, progress));

      const path = pathRef.current;
      const total = path.getTotalLength();
      const len = total * progress;
      const pt = path.getPointAtLength(len);
      const next = path.getPointAtLength(Math.min(total, len + 1));
      const angle = Math.atan2(next.y - pt.y, next.x - pt.x) * (180 / Math.PI);

      // Центруем 40x40 воланчик относительно точки
      shuttleRef.current.setAttribute(
        'transform',
        `translate(${pt.x}, ${pt.y}) rotate(${angle}) translate(-20, -20)`
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
          <h2 className="section-title">
            Наши Достижения
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            За годы работы мы достигли впечатляющих результатов и воспитали множество талантливых спортсменов
          </p>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {achievements.map((achievement, index) => (
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
            История развития клуба
          </h3>
          
          <div className="relative min-h-[620px]" ref={containerRef}>
            {/* Wavy timeline path */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 620" preserveAspectRatio="none">
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

              {/* Воланчик (большего размера), двигается по пути при скролле */}
              <g ref={shuttleRef}>
                {/* размер ~40x40, центрируется translate(-20,-20) в JS */}
                <g>
                  {/* Корк */}
                  <circle cx="20" cy="28" r="6" fill="#111827" />
                  {/* Оперение */}
                  <path d="M5 10 L12 24 L28 24 L35 10" fill="white" stroke="url(#shuttleGrad)" strokeWidth="2" />
                  <path d="M9 12 L14 24" stroke="#93c5fd" strokeWidth="1.5" />
                  <path d="M16 12 L18 24" stroke="#93c5fd" strokeWidth="1.5" />
                  <path d="M23 12 L22 24" stroke="#93c5fd" strokeWidth="1.5" />
                  <path d="M30 12 L26 24" stroke="#93c5fd" strokeWidth="1.5" />
                </g>
              </g>
            </svg>

            <div className="space-y-8 relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  style={{ marginTop: index === 0 ? '20px' : undefined }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-primary-blue mb-1">{milestone.year}</div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{milestone.title}</h4>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Соединительная точка заменена на пустое пространство (путь проходит позади) */}
                  <div className="w-4" />
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-blue to-primary-yellow text-white rounded-full">
            <Star className="w-5 h-5 mr-2" />
            <span className="font-medium">Станьте частью нашей истории успеха!</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
