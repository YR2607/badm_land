import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, MapPin, Clock, Target, Heart } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const About: React.FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);

  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('about');
      setPage(data);
    })();
  }, []);

  const stats = [
    { number: '500+', label: 'Участников', icon: <Users className="w-6 h-6" /> },
    { number: '15', label: 'Лет опыта', icon: <Award className="w-6 h-6" /> },
    { number: '8', label: 'Кортов', icon: <MapPin className="w-6 h-6" /> },
    { number: '24/7', label: 'Поддержка', icon: <Clock className="w-6 h-6" /> }
  ];

  const values = [
    { icon: <Target className="w-8 h-8" />, title: 'Профессионализм', description: 'Высокие стандарты обучения и сертифицированные тренеры' },
    { icon: <Heart className="w-8 h-8" />, title: 'Дружелюбие', description: 'Теплая атмосфера и поддержка для игроков всех уровней' },
    { icon: <Award className="w-8 h-8" />, title: 'Результат', description: 'Ориентация на достижение целей каждого участника' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              {page?.heroTitle || 'О клубе Altius'}
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              {page?.heroSubtitle || 'Ведущий бадминтонный клуб Кишинева с 15-летней историей успеха'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary-blue mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl font-bold font-display text-gray-900 mb-6">
                {(page?.sections?.[0]?.heading) || 'Наша история'}
              </h2>
              <div className="space-y-4 text-gray-600">
                {(page?.sections?.[0]?.body && page.sections[0].body.length > 0) ? (
                  page.sections[0].body.map((block: any, i: number) => (
                    <p key={i}>{block.children?.map((c: any) => c.text).join(' ')}</p>
                  ))
                ) : (
                  <>
                    <p>Клуб Altius был основан в 2010 году с целью развития бадминтона в Молдове. Начав с небольшого зала, мы выросли в современный спортивный комплекс с 8 профессиональными кортами.</p>
                    <p>За годы работы через наш клуб прошли сотни спортсменов, многие из которых достигли значительных успехов на национальном и международном уровне. Мы гордимся тем, что смогли создать настоящее сообщество любителей бадминтона.</p>
                    <p>Сегодня Altius - это не просто спортивный клуб, это место, где рождается страсть к спорту, формируются характеры и создаются дружеские связи на всю жизнь.</p>
                  </>
                )}
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="w-full h-96 bg-gradient-to-br from-primary-blue to-primary-orange rounded-2xl flex items-center justify-center text-white text-6xl">
                🏸
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">Наши ценности</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Принципы, которые лежат в основе нашей работы</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} className="text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
