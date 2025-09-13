import { motion } from 'framer-motion';
import { Calendar, Trophy, Users, Star } from 'lucide-react';

interface HistorySectionProps {
  cmsData?: {
    title?: string;
    subtitle?: string;
    milestones?: Array<{
      year: string;
      title: string;
      description: string;
      icon: string;
      image?: {
        asset: {
          url: string;
        };
        alt?: string;
      };
    }>;
  };
}

const iconMap = {
  Calendar,
  Trophy,
  Users,
  Star
};

const defaultMilestones = [
  {
    year: '2010',
    title: 'Основание клуба',
    description: 'Создание первого профессионального бадминтонного клуба в Кишиневе',
    icon: 'Star',
    image: undefined
  },
  {
    year: '2012',
    title: 'Первые победы',
    description: 'Наши спортсмены завоевали первые медали на национальных чемпионатах',
    icon: 'Trophy',
    image: undefined
  },
  {
    year: '2015',
    title: 'Расширение клуба',
    description: 'Открытие второго зала и увеличение количества тренеров',
    icon: 'Users',
    image: undefined
  },
  {
    year: '2018',
    title: 'Международное признание',
    description: 'Участие в международных турнирах и обмен опытом с зарубежными клубами',
    icon: 'Trophy',
    image: undefined
  },
  {
    year: '2020',
    title: 'Современные технологии',
    description: 'Внедрение современного оборудования и онлайн-тренировок',
    icon: 'Star',
    image: undefined
  },
  {
    year: '2024',
    title: 'Сегодня',
    description: 'Более 500 активных спортсменов и 3 современных зала в Кишиневе',
    icon: 'Users',
    image: undefined
  }
];

const HistorySection = ({ cmsData }: HistorySectionProps) => {
  const milestones = cmsData?.milestones || defaultMilestones;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-blue rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-yellow rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {cmsData?.title || 'История развития клуба'}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {cmsData?.subtitle || 'Путь от небольшого клуба до ведущего центра бадминтона в Молдове'}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-primary-blue via-primary-yellow to-primary-orange h-full hidden md:block"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => {
              const IconComponent = iconMap[milestone.icon as keyof typeof iconMap] || Calendar;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={index}
                  className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-primary-yellow rounded-full flex items-center justify-center mr-4">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-primary-blue">{milestone.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                      
                      {milestone.image && (
                        <div className="mt-4 rounded-lg overflow-hidden">
                          <img 
                            src={milestone.image.asset.url} 
                            alt={milestone.image.alt || milestone.title}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-primary-blue rounded-full z-10"></div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;
