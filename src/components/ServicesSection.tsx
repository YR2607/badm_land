import { motion } from 'framer-motion';
import { Users, User, Trophy, Clock, Star } from 'lucide-react';

interface ServicesSectionProps {
  cmsData?: {
    title: string;
    subtitle?: string;
    services: Array<{
      title: string;
      description: string;
      features?: string[];
      price: string;
      icon: string;
    }>;
  };
}

const ServicesSection = ({ cmsData }: ServicesSectionProps) => {
  const services = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Групповые тренировки',
      description: 'Тренировки в группах до 8 человек с профессиональными тренерами',
      features: ['Все уровни подготовки', 'Современное оборудование', 'Гибкое расписание'],
      price: 'от 200 лей',
      color: 'from-primary-blue to-blue-600'
    },
    {
      icon: <User className="w-8 h-8" />,
      title: 'Индивидуальные занятия',
      description: 'Персональные тренировки с личным тренером для быстрого прогресса',
      features: ['Индивидуальная программа', 'Гибкий график', 'Максимальное внимание'],
      price: 'от 400 лей',
      color: 'from-primary-orange to-orange-600'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Подготовка к соревнованиям',
      description: 'Специализированная подготовка для участия в турнирах и соревнованиях',
      features: ['Техническая подготовка', 'Тактическое планирование', 'Психологическая поддержка'],
      price: 'от 500 лей',
      color: 'from-primary-yellow to-yellow-600'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Аренда корта',
      description: 'Почасовая аренда кортов для игры с друзьями или тренировок',
      features: ['8 современных кортов', 'Профессиональное покрытие', 'Удобное бронирование'],
      price: 'от 100 лей/час',
      color: 'from-gray-600 to-gray-800'
    }
  ];

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
          <h2 className="text-4xl font-bold font-display text-gray-900 mb-4">
            {cmsData?.title || 'Наши Услуги'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {cmsData?.subtitle || 'Широкий спектр услуг для игроков любого уровня - от начинающих до профессионалов'}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(cmsData?.services || services).slice(0, 3).map((service: any, index: number) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-3xl p-8 h-full flex flex-col">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-4">
                  {(service.features || []).map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <Star className="w-4 h-4 text-primary-yellow mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mt-auto">
                  <div className="text-2xl font-bold text-primary-blue mb-4">{service.price}</div>
                  <button className="w-full btn-secondary group-hover:bg-primary-blue group-hover:text-white transition-all duration-300">
                    Узнать больше
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
