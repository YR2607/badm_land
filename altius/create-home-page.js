const { createClient } = require('@sanity/client');

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'your-project-id';
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_STUDIO_API_VERSION || process.env.VITE_SANITY_API_VERSION || '2023-05-03';
const token = process.env.SANITY_API_TOKEN; // must be server-side secret

if (!token) {
  console.error('Missing SANITY_API_TOKEN. Please set an API token with write access.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, useCdn: false, token, apiVersion });

async function createHomePage() {
  try {
    const homePageDoc = {
      _type: 'homePage',
      _id: 'homePage',
      title: 'Главная страница',
      hero: {
        badge: {
          icon: 'Award',
          text: 'Профессиональный клуб с 2010 года',
          text_en: 'Professional club since 2010',
          text_ro: 'Club profesional din 2010'
        },
        title: 'ALTIUS',
        title_en: 'ALTIUS',
        title_ro: 'ALTIUS',
        subtitle: 'Бадминтонный клуб',
        subtitle_en: 'Badminton Club',
        subtitle_ro: 'Club de Badminton',
        description: 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе Кишинева и не только',
        description_en: 'Professional training, modern equipment and a friendly atmosphere at the most modern badminton club in Chisinau and beyond',
        description_ro: 'Antrenament profesionist, echipamente moderne și o atmosferă prietenoasă la cel mai modern club de badminton din Chișinău și nu numai',
        statistics: [
          { number: '500+', description: 'Учеников', description_en: 'Students', description_ro: 'Elevi' },
          { number: '15+', description: 'Лет опыта', description_en: 'Years of experience', description_ro: 'Ani de experiență' },
          { number: '3', description: 'Формата обучения', description_en: 'Training formats', description_ro: 'Formate de antrenament' }
        ]
      },
      servicesSection: {
        title: 'Наши Услуги',
        title_en: 'Our Services',
        title_ro: 'Serviciile Noastre',
        subtitle: 'Профессиональные тренировки для всех уровней подготовки',
        subtitle_en: 'Professional training for all levels',
        subtitle_ro: 'Antrenament profesional pentru toate nivelurile',
        services: [
          {
            title: 'Групповые тренировки',
            title_en: 'Group Training',
            title_ro: 'Antrenament în Grup',
            description: 'Занятия в группах до 8 человек с профессиональным тренером',
            description_en: 'Classes in groups of up to 8 people with a professional coach',
            description_ro: 'Lecții în grupuri de până la 8 persoane cu un antrenor profesionist',
            icon: 'Users',
            price: 'от 200 лей',
            price_en: 'from 200 MDL',
            price_ro: 'de la 200 MDL',
            color: 'from-primary-blue to-blue-600',
            features: ['Профессиональный тренер', 'Группы до 8 человек', 'Все уровни подготовки'],
            features_en: ['Professional coach', 'Groups up to 8 people', 'All levels'],
            features_ro: ['Antrenor profesionist', 'Grupuri până la 8 persoane', 'Toate nivelurile']
          },
          {
            title: 'Индивидуальные занятия',
            title_en: 'Individual Training',
            title_ro: 'Antrenament Individual',
            description: 'Персональные тренировки с индивидуальным подходом',
            description_en: 'Personal training with an individual approach',
            description_ro: 'Antrenament personal cu abordare individuală',
            icon: 'User',
            price: 'от 400 лей',
            price_en: 'from 400 MDL',
            price_ro: 'de la 400 MDL',
            color: 'from-primary-orange to-orange-600',
            features: ['Индивидуальный подход', 'Гибкий график', 'Быстрый прогресс'],
            features_en: ['Individual approach', 'Flexible schedule', 'Rapid progress'],
            features_ro: ['Abordare individuală', 'Program flexibil', 'Progres rapid']
          },
          {
            title: 'Подготовка к соревнованиям',
            title_en: 'Competition Training',
            title_ro: 'Pregătire pentru Competiții',
            description: 'Специализированная подготовка для участия в турнирах',
            description_en: 'Specialized training to participate in tournaments',
            description_ro: 'Antrenament specializat pentru participarea la turnee',
            icon: 'Trophy',
            price: 'от 500 лей',
            price_en: 'from 500 MDL',
            price_ro: 'de la 500 MDL',
            color: 'from-primary-yellow to-yellow-600',
            features: ['Соревновательная подготовка', 'Тактическая подготовка', 'Психологическая поддержка'],
            features_en: ['Competitive preparation', 'Tactical training', 'Psychological support'],
            features_ro: ['Pregătire competitivă', 'Antrenament tactic', 'Suport psihologic']
          },
          {
            title: 'Аренда корта',
            title_en: 'Court Rental',
            title_ro: 'Închiriere teren',
            description: 'Почасовая аренда корта для самостоятельных тренировок',
            description_en: 'Hourly court rental for independent training',
            description_ro: 'Închiriere pe oră a terenului pentru antrenamente independente',
            icon: 'Clock',
            price: 'от 100 лей/час',
            price_en: 'from 100 MDL/hour',
            price_ro: 'de la 100 MDL/oră',
            color: 'from-gray-600 to-gray-800',
            features: ['Современные корты', 'Почасовая аренда', 'Удобное бронирование'],
            features_en: ['Modern courts', 'Hourly rental', 'Easy booking'],
            features_ro: ['Terenuri moderne', 'Închiriere pe oră', 'Rezervare ușoară']
          }
        ]
      },
      achievementsSection: {
        title: 'Наши Достижения',
        title_en: 'Our Achievements',
        title_ro: 'Realizările noastre',
        subtitle: 'Результаты нашей работы говорят сами за себя',
        subtitle_en: 'The results of our work speak for themselves',
        subtitle_ro: 'Rezultatele muncii noastre vorbesc de la sine',
        achievements: [
          {
            title: 'Чемпионы Молдовы',
            title_en: 'Moldova Champions',
            title_ro: 'Campioni ai Moldovei',
            count: '15',
            description: 'Золотых медалей на национальных чемпионатах',
            description_en: 'Gold medals at national championships',
            description_ro: 'Medalii de aur la campionatele naționale',
            icon: 'Trophy',
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            title: 'Медали на турнирах',
            title_en: 'Tournament Medals',
            title_ro: 'Medalii la turnee',
            count: '47',
            description: 'Призовых мест на международных турнирах',
            description_en: 'Podium finishes at international tournaments',
            description_ro: 'Locuri pe podium la turnee internaționale',
            icon: 'Medal',
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Активных спортсменов',
            title_en: 'Active Athletes',
            title_ro: 'Sportivi activi',
            count: '500+',
            description: 'Учеников тренируются в нашем клубе',
            description_en: 'Students train at our club',
            description_ro: 'Elevi se antrenează în clubul nostru',
            icon: 'Users',
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Лет успешной работы',
            title_en: 'Years of Successful Work',
            title_ro: 'Ani de activitate de succes',
            count: '15',
            description: 'Опыта в подготовке чемпионов',
            description_en: 'Experience in training champions',
            description_ro: 'Experiență în pregătirea campionilor',
            icon: 'Calendar',
            color: 'from-purple-500 to-purple-600'
          }
        ],
        timeline: {
          title: 'История развития',
          title_en: 'Club Development History',
          title_ro: 'Istoria dezvoltării clubului',
          milestones: [
            { year: '2010', title: 'Основание клуба', title_en: 'Club founded', title_ro: 'Fondarea clubului', description: 'Открытие первого зала с 4 кортами', description_en: 'Opened the first hall with 4 courts', description_ro: 'Deschiderea primei săli cu 4 terenuri' },
            { year: '2015', title: 'Расширение', title_en: 'Expansion', title_ro: 'Extindere', description: 'Открытие второго зала, рост до 200 участников', description_en: 'Opened the second hall, grew to 200 members', description_ro: 'Deschiderea celei de-a doua săli, creștere la 200 de membri' },
            { year: '2018', title: 'Первые чемпионы', title_en: 'First champions', title_ro: 'Primii campioni', description: 'Наши воспитанники завоевали первые титулы', description_en: 'Our students won their first titles', description_ro: 'Elevii noștri au câștigat primele titluri' },
            { year: '2023', title: 'Третий зал', title_en: 'Third hall', title_ro: 'A treia sală', description: 'Открытие современного зала на 8 кортов', description_en: 'Opening of a modern hall with 8 courts', description_ro: 'Deschiderea unei săli moderne cu 8 terenuri' }
          ]
        },
        callToAction: {
          text: 'Присоединяйтесь к нашим чемпионам!',
          text_en: 'Join our champions!',
          text_ro: 'Alătură-te campionilor noștri!',
          icon: 'Trophy'
        }
      },
      newsSection: {
        title: 'Новости мирового бадминтона',
        title_en: 'World Badminton News',
        title_ro: 'Știri din badmintonul mondial',
        subtitle: 'Следите за последними событиями в мире бадминтона',
        subtitle_en: 'Follow the latest events in the world of badminton',
        subtitle_ro: 'Urmăriți cele mai recente evenimente din lumea badmintonului',
        enabled: true
      },
      ctaSection: {
        title: 'Готовы начать тренировки?',
        title_en: 'Ready to start?',
        title_ro: 'Gata să începeți?',
        description: 'Запишитесь на пробное занятие и оцените качество наших тренировок',
        description_en: 'Sign up for a trial session and experience our training quality',
        description_ro: 'Înscrieți-vă la o sesiune de probă și experimentați calitatea antrenamentelor noastre',
        buttonText: 'Записаться на пробное занятие',
        buttonText_en: 'Book a trial session',
        buttonText_ro: 'Programați o sesiune de probă',
        buttonLink: '/contact'
      }
    };

    const result = await client.createOrReplace(homePageDoc);
    console.log('✓ Главная страница создана:', result._id);
    return result;
  } catch (error) {
    console.error('Ошибка создания главной страницы:', error);
    throw error;
  }
}

createHomePage()
  .then(() => {
    console.log('✅ Документ главной страницы успешно создан!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  });
