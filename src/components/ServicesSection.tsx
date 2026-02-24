import { motion } from 'framer-motion';
import { Users, Star, UserCheck, Target, Calendar, Trophy, Clock, ArrowRight } from 'lucide-react';
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

  const services = (cmsData?.services || []).map((s) => ({
    title: s.title,
    description: s.description,
    features: s.features || [],
    price: s.price || t('home.services.pricePlaceholder', '—'),
    icon: s.icon
  }));

  return (
    <section className="py-32 bg-zenith-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-24 text-right relative"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-8xl md:text-[12rem] font-black font-display leading-[0.8] tracking-tighter uppercase text-zenith-black opacity-10 absolute -top-10 right-0 pointer-events-none select-none">
            Services
          </h2>
          <h2 className="text-5xl md:text-8xl font-black font-display leading-tight-impact tracking-tighter uppercase text-zenith-black relative z-10">
            {cmsData?.title || t('home.services.title', 'Наши услуги')}
          </h2>
          <div className="w-32 h-4 bg-zenith-crimson mt-8 ml-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bento-card group flex flex-col h-full bg-white border-2 border-transparent hover:border-zenith-crimson transition-all duration-500"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="p-10 flex flex-col h-full">
                <div className="text-4xl md:text-5xl font-black font-display text-zenith-black/20 mb-8 border-b-2 border-zenith-black/5 pb-4">
                  (0{index + 1})
                </div>

                <h3 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tight mb-6 text-zenith-black group-hover:text-zenith-crimson transition-colors">
                  {service.title}
                </h3>

                <p className="text-lg text-zenith-black/70 font-medium mb-8 leading-relaxed flex-grow">
                  {service.description}
                </p>

                <div className="mb-8">
                  <div className="text-sm font-black uppercase tracking-widest text-zenith-crimson mb-4">
                    Features
                  </div>
                  <ul className="space-y-3">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start text-base font-bold text-zenith-black">
                        <span className="w-2 h-2 bg-zenith-crimson mt-2 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto pt-8 border-t-2 border-zenith-black/5 flex items-center justify-between">
                  <div className="text-2xl font-black font-display text-zenith-crimson uppercase">
                    {service.price}
                  </div>
                  <motion.div
                    className="w-12 h-12 bg-zenith-black text-white flex items-center justify-center rounded-xl group-hover:bg-zenith-crimson transition-colors"
                    whileHover={{ scale: 1.1 }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
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
