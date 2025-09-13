const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your-project-id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03'
});

async function createHomePage() {
  try {
    const homePageDoc = {
      _type: 'homePage',
      _id: 'homePage',
      title: 'Главная страница',
      hero: {
        badge: {
          icon: 'Award',
          text: 'Профессиональный клуб с 2010 года'
        },
        title: 'ALTIUS',
        subtitle: 'Бадминтонный клуб',
        description: 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе Кишинева и не только',
        statistics: [
          { number: '500+', description: 'Учеников' },
          { number: '15+', description: 'Лет опыта' },
          { number: '3', description: 'Формата обучения' }
        ]
      },
      servicesSection: {
        title: 'Наши Услуги',
        subtitle: 'Профессиональные тренировки для всех уровней подготовки',
        services: [
          {
            title: 'Групповые тренировки',
            description: 'Занятия в группах до 8 человек с профессиональным тренером',
            icon: 'Users',
            price: 'от 200 лей',
            color: 'from-primary-blue to-blue-600',
            features: ['Профессиональный тренер', 'Группы до 8 человек', 'Все уровни подготовки']
          },
          {
            title: 'Индивидуальные занятия',
            description: 'Персональные тренировки с индивидуальным подходом',
            icon: 'User',
            price: 'от 400 лей',
            color: 'from-primary-orange to-orange-600',
            features: ['Индивидуальный подход', 'Гибкий график', 'Быстрый прогресс']
          },
          {
            title: 'Подготовка к соревнованиям',
            description: 'Специализированная подготовка для участия в турнирах',
            icon: 'Trophy',
            price: 'от 500 лей',
            color: 'from-primary-yellow to-yellow-600',
            features: ['Соревновательная подготовка', 'Тактическая подготовка', 'Психологическая поддержка']
          },
          {
            title: 'Аренда корта',
            description: 'Почасовая аренда корта для самостоятельных тренировок',
            icon: 'Clock',
            price: 'от 100 лей/час',
            color: 'from-gray-600 to-gray-800',
            features: ['Современные корты', 'Почасовая аренда', 'Удобное бронирование']
          }
        ]
      },
      achievementsSection: {
        title: 'Наши Достижения',
        achievements: [
          {
            title: 'Чемпионы Молдовы',
            count: '15',
            description: 'Золотых медалей на национальных чемпионатах',
            icon: 'Trophy',
            color: 'from-yellow-500 to-yellow-600'
          },
          {
            title: 'Медали на турнирах',
            count: '47',
            description: 'Призовых мест на международных турнирах',
            icon: 'Medal',
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Активных спортсменов',
            count: '500+',
            description: 'Учеников тренируются в нашем клубе',
            icon: 'Users',
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Лет успешной работы',
            count: '15',
            description: 'Опыта в подготовке чемпионов',
            icon: 'Calendar',
            color: 'from-purple-500 to-purple-600'
          }
        ]
      },
      newsSection: {
        title: 'Новости мирового бадминтона',
        subtitle: 'Следите за последними событиями в мире бадминтона',
        enabled: true
      },
      historySection: {
        title: 'История развития клуба',
        subtitle: 'Путь от небольшого клуба до ведущего центра бадминтона в Молдове',
        milestones: [
          {
            year: '2010',
            title: 'Основание клуба',
            description: 'Создание первого профессионального бадминтонного клуба в Кишиневе',
            icon: 'Star'
          },
          {
            year: '2012',
            title: 'Первые победы',
            description: 'Наши спортсмены завоевали первые медали на национальных чемпионатах',
            icon: 'Trophy'
          },
          {
            year: '2015',
            title: 'Расширение клуба',
            description: 'Открытие второго зала и увеличение количества тренеров',
            icon: 'Users'
          },
          {
            year: '2018',
            title: 'Международное признание',
            description: 'Участие в международных турнирах и обмен опытом с зарубежными клубами',
            icon: 'Trophy'
          },
          {
            year: '2020',
            title: 'Современные технологии',
            description: 'Внедрение современного оборудования и онлайн-тренировок',
            icon: 'Star'
          },
          {
            year: '2024',
            title: 'Сегодня',
            description: 'Более 500 активных спортсменов и 3 современных зала в Кишиневе',
            icon: 'Users'
          }
        ]
      },
      ctaSection: {
        title: 'Готовы начать тренировки?',
        description: 'Запишитесь на пробное занятие и оцените качество наших тренировок',
        buttonText: 'Записаться на пробное занятие',
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
