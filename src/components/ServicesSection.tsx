import { Users, Star, UserCheck, Target, Calendar, Trophy, Clock, ArrowRight, Zap, MapPin, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ServicesSectionProps {
  cmsData?: {
    title: string;
    subtitle?: string;
    services?: Array<{
      title: string;
      description: string;
      features?: string[];
      price?: string;
      icon?: string;
      color?: string;
    }>;
    buttonText?: string;
  };
}

const ServicesSection = ({ cmsData }: ServicesSectionProps) => {
  const { t } = useTranslation();

  const iconMap: Record<string, LucideIcon> = {
    'children': Users,
    'kids': Users,
    'individual': UserCheck,
    'personal': UserCheck,
    'group': Users,
    'competition': Trophy,
    'tournament': Trophy,
    'court': MapPin,
    'rental': MapPin,
    'training': Target,
    'zap': Zap,
    'star': Star,
    'calendar': Calendar,
    'clock': Clock,
  };

  const services = (cmsData?.services || []).map((s) => ({
    title: s.title,
    description: s.description,
    features: s.features || [],
    price: s.price || t('home.services.pricePlaceholder', '—'),
    icon: s.icon
  }));

  return (
    <section className="py-32 bg-zenith-white relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zenith-crimson/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zenith-black/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-32 text-center md:text-right relative">
          <h2 className="text-[6rem] md:text-[14rem] font-black font-display leading-[0.75] tracking-tighter uppercase text-zenith-black opacity-[0.03] absolute -top-12 md:-top-24 right-0 pointer-events-none select-none w-full text-center md:text-right overflow-hidden">
            {t('home.services.decorative', 'OUR SERVICES')}
          </h2>
          <h2 className="text-5xl md:text-8xl font-black font-display leading-[0.9] tracking-tighter uppercase text-zenith-black relative z-10 break-words">
            {cmsData?.title || t('home.services.title', 'Наши услуги')}
          </h2>
          <div className="w-24 md:w-48 h-2 md:h-4 bg-zenith-crimson mt-8 mx-auto md:ml-auto md:mr-0 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group flex flex-col h-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-10px_rgba(220,38,38,0.15)] border-2 border-transparent hover:border-zenith-crimson/20 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-zenith-crimson/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-zenith-crimson/10 transition-colors duration-500 pointer-events-none" />

              <div className="flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <div className="text-6xl md:text-7xl font-black font-display text-zenith-black/10 group-hover:text-zenith-crimson/20 transition-colors duration-500 leading-none tracking-tighter">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  {service.icon && (() => {
                    const Icon = iconMap[service.icon?.toLowerCase() || ''] || Target;
                    return (
                      <div className="w-16 h-16 rounded-2xl bg-zenith-black text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-zenith-crimson transition-all duration-500">
                        <Icon className="w-8 h-8" />
                      </div>
                    );
                  })()}
                </div>

                <h3 className="text-2xl md:text-3xl font-black font-display uppercase tracking-tight mb-6 text-zenith-black group-hover:text-zenith-crimson transition-colors duration-300 break-words [overflow-wrap:anywhere]">
                  {service.title}
                </h3>

                <p className="text-lg text-gray-600 font-medium mb-10 leading-relaxed flex-grow">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <div className="mb-10">
                    <div className="text-sm font-black uppercase tracking-widest text-zenith-black/40 mb-5 pl-4 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-zenith-crimson/50" />
                      {t('home.services.features', 'Особенности')}
                    </div>
                    <ul className="space-y-4">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-start text-base font-bold text-gray-800">
                          <span className="text-zenith-crimson mr-3 mt-0.5 text-lg leading-none">+</span>
                          <span className="leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto pt-8 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                  <div className="text-3xl md:text-4xl font-black font-display text-zenith-crimson uppercase tracking-tighter">
                    {service.price}
                  </div>
                  <div
                    className="w-14 h-14 bg-zenith-black text-white flex items-center justify-center rounded-full group-hover:bg-zenith-crimson group-hover:scale-110 group-hover:-rotate-45 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] group-hover:shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)] transition-all duration-300"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
