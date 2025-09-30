import { motion } from 'framer-motion';
import { Users, Star, UserCheck, Target, Calendar, Trophy, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
      color: string;
    }>;
  };
}

const ServicesSection = ({ cmsData }: ServicesSectionProps) => {
  const { t } = useTranslation();

  function getServiceIcon(name?: string) {
    switch (name) {
      case 'Users': return <Users className="w-8 h-8" />;
      case 'User': return <UserCheck className="w-8 h-8" />;
      case 'UserCheck': return <UserCheck className="w-8 h-8" />;
      case 'Target': return <Target className="w-8 h-8" />;
      case 'Calendar': return <Calendar className="w-8 h-8" />;
      case 'Clock': return <Clock className="w-8 h-8" />;
      case 'Trophy': return <Trophy className="w-8 h-8" />;
      default: return <Users className="w-8 h-8" />;
    }
  }

  const services = (cmsData?.services || []).map((s) => ({
    icon: getServiceIcon(s.icon),
    title: s.title,
    description: s.description,
    features: s.features || [],
    price: s.price,
    color: s.color || 'from-blue-500 to-indigo-600'
  }));

  // Debug logging removed for production

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
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300 relative">
              {/* Badminton Racket SVG */}
              <svg className="w-10 h-10 text-white drop-shadow-sm" viewBox="0 0 100 100" fill="none">
                {/* Racket Head (Oval) */}
                <ellipse cx="50" cy="25" rx="18" ry="22" stroke="currentColor" strokeWidth="3" fill="none"/>
                
                {/* Racket Strings - Vertical */}
                <line x1="38" y1="10" x2="38" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="44" y1="8" x2="44" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="50" y1="3" x2="50" y2="47" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="56" y1="8" x2="56" y2="42" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="62" y1="10" x2="62" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                
                {/* Racket Strings - Horizontal */}
                <line x1="35" y1="15" x2="65" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="33" y1="20" x2="67" y2="20" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="32" y1="25" x2="68" y2="25" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="33" y1="30" x2="67" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                <line x1="35" y1="35" x2="65" y2="35" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                
                {/* Racket Handle */}
                <rect x="47" y="47" width="6" height="35" rx="3" fill="currentColor"/>
                
                {/* Handle Grip Lines */}
                <line x1="46" y1="52" x2="54" y2="52" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="46" y1="58" x2="54" y2="58" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="46" y1="64" x2="54" y2="64" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="46" y1="70" x2="54" y2="70" stroke="white" strokeWidth="1" opacity="0.5"/>
                <line x1="46" y1="76" x2="54" y2="76" stroke="white" strokeWidth="1" opacity="0.5"/>
                
                {/* Shuttlecock */}
                <circle cx="75" cy="20" r="3" fill="white" opacity="0.9"/>
                <path d="M75 17 L77 12 L75 8 L73 12 Z" fill="white" opacity="0.8"/>
              </svg>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              {cmsData?.title || t('home.services.title', 'Наши услуги')}
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {cmsData?.subtitle || t('home.services.subtitle', 'Профессиональные тренировки для всех уровней подготовки')}
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(services.length > 0 ? services.slice(0, 3) : []).map((service: any, index: number) => (
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
                    {t('home.services.more', 'Узнать больше')}
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
