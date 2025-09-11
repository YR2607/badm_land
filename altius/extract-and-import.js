import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'ctgwxc8c',
  dataset: 'production',
  useCdn: false,
  token: 'sk2GLBxNrCG0qhVsQEXkyQHPpuWehER9fJJIOkXa7BSV8lxVQ09skOJ5tUCTLwRCJAHVRg3sKQknJ55IwQIl96Jjuhw2wtHEiWCx8HLXkdhUvSDcl5IzANRun6F6AJ5xtFeI8fPBndFJ7r8xA3DEFcEL93XeqP0mImqyp9auBS9MyujCY0Ti',
  apiVersion: '2023-05-03'
})

async function extractAndImport() {
  try {
    console.log('🚀 Извлекаем контент из существующих компонентов...')

    // Главная страница - данные из Hero и ServicesSection
    const homePage = {
      _type: 'homePage',
      _id: 'homePage',
      title: 'Главная страница',
      hero: {
        badge: {
          icon: '🏆',
          text: 'Профессиональный клуб с 2010 года'
        },
        title: 'ALTIUS',
        subtitle: 'Бадминтонный клуб',
        statistics: [
          {
            number: '500+',
            description: 'Довольных клиентов'
          },
          {
            number: '15+',
            description: 'Лет опыта'
          },
          {
            number: '8',
            description: 'Современных кортов'
          }
        ]
      },
      aboutSection: {
        title: 'О нашем клубе',
        description: 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе Кишинева'
      },
      servicesSection: {
        title: 'Наши Услуги',
        subtitle: 'Широкий спектр услуг для игроков любого уровня - от начинающих до профессионалов',
        services: [
          {
            title: 'Групповые тренировки',
            description: 'Тренировки в группах до 8 человек с профессиональными тренерами',
            icon: '👥',
            price: 'от 200 лей'
          },
          {
            title: 'Индивидуальные занятия',
            description: 'Персональные тренировки с личным тренером для быстрого прогресса',
            icon: '👤',
            price: 'от 400 лей'
          },
          {
            title: 'Подготовка к соревнованиям',
            description: 'Специализированная подготовка для участия в турнирах и соревнованиях',
            icon: '🏆',
            price: 'от 500 лей'
          }
        ]
      },
      ctaSection: {
        title: 'Готовы начать тренировки?',
        description: 'Запишитесь на пробное занятие',
        buttonText: 'Записаться на пробное занятие',
        buttonLink: '/contact'
      }
    }

    await client.createOrReplace(homePage)
    console.log('✓ Главная страница создана')

    // Тренеры из Gyms.tsx
    const trainers = [
      {
        _type: 'trainer',
        _id: 'trainer-aleksandr-petrov',
        name: 'Александр Петров',
        slug: { current: 'aleksandr-petrov' },
        experience: '8 лет опыта',
        specialization: 'Детские группы',
        description: 'Опытный тренер по работе с детьми. Специализируется на обучении основам бадминтона.',
        phone: '+373 69 123-456',
        email: 'aleksandr@altius.md'
      },
      {
        _type: 'trainer',
        _id: 'trainer-maria-ivanova',
        name: 'Мария Иванова',
        slug: { current: 'maria-ivanova' },
        experience: '5 лет опыта',
        specialization: 'Взрослые группы',
        description: 'Тренер по работе со взрослыми спортсменами. Фокусируется на технике игры.',
        phone: '+373 69 234-567',
        email: 'maria@altius.md'
      },
      {
        _type: 'trainer',
        _id: 'trainer-elena-sidorova',
        name: 'Елена Сидорова',
        slug: { current: 'elena-sidorova' },
        experience: '10 лет опыта',
        specialization: 'Детский тренер',
        description: 'Специалист по работе с детьми младшего возраста.',
        phone: '+373 69 345-678',
        email: 'elena@altius.md'
      }
    ]

    for (const trainer of trainers) {
      await client.createOrReplace(trainer)
      console.log(`✓ Тренер ${trainer.name} создан`)
    }

    // Залы из Gyms.tsx
    const gyms = [
      {
        _type: 'gym',
        _id: 'gym-malia-malian-24',
        name: 'Малая Малиан, 24',
        slug: { current: 'malia-malian-24' },
        description: 'Центральная локация в сердце города',
        badge: 'Зал №1',
        badgeColor: 'from-blue-500 to-indigo-600',
        address: 'ул. Малая Малиан, 24, Кишинев',
        phone: '+373 22 123-456',
        email: 'maliamilian@altius.md',
        mapUrl: 'https://maps.google.com/?q=Малая+Малиан+24+Кишинев',
        features: ['Гибкое расписание', 'Центральное расположение', 'Парковка', 'Раздевалки'],
        hasChildren: true,
        hasAdults: true,
        schedule: {
          children: {
            title: 'Детские группы',
            times: 'По договоренности',
            details: 'Индивидуальный подход к расписанию для каждой группы'
          },
          adults: {
            title: 'Любители',
            times: 'По договоренности',
            details: 'Гибкое расписание под ваши потребности'
          }
        },
        pricing: {
          children: {
            monthly: '300 лей/месяц',
            single: '80 лей/занятие',
            trial: '50 лей - пробное занятие'
          },
          adults: {
            monthly: '400 лей/месяц',
            single: '100 лей/занятие',
            trial: '70 лей - пробное занятие'
          }
        },
        trainers: [
          { _type: 'reference', _ref: 'trainer-aleksandr-petrov' },
          { _type: 'reference', _ref: 'trainer-maria-ivanova' }
        ]
      },
      {
        _type: 'gym',
        _id: 'gym-august-31',
        name: 'Улица 31 августа 1989',
        slug: { current: 'august-31' },
        description: 'Специализированный детский центр',
        badge: 'Зал №2',
        badgeColor: 'from-orange-500 to-red-500',
        address: 'ул. 31 августа 1989, Кишинев',
        phone: '+373 22 234-567',
        email: 'august31@altius.md',
        mapUrl: 'https://maps.google.com/?q=31+августа+1989+Кишинев',
        features: ['Только детские группы', 'Удобный район', 'Детская площадка', 'Кафетерий'],
        hasChildren: true,
        hasAdults: false,
        schedule: {
          children: {
            title: 'Детские группы',
            times: 'Пн-Пт 16:00-18:00',
            details: 'Ежедневные тренировки в будние дни'
          }
        },
        pricing: {
          children: {
            monthly: '250 лей/месяц',
            single: '70 лей/занятие',
            trial: '40 лей - пробное занятие'
          }
        },
        trainers: [
          { _type: 'reference', _ref: 'trainer-elena-sidorova' }
        ]
      },
      {
        _type: 'gym',
        _id: 'gym-ion-creanga',
        name: 'Ион Крянге, 1',
        slug: { current: 'ion-creanga' },
        description: 'Профессиональный тренировочный центр',
        badge: 'Зал №3 - Премиум',
        badgeColor: 'from-yellow-500 to-amber-500',
        address: 'ул. Ион Крянге, 1, Кишинев',
        phone: '+373 22 345-678',
        email: 'ioncreanga@altius.md',
        features: ['Профессиональное оборудование', 'Индивидуальные тренировки', 'Видеоанализ'],
        hasChildren: true,
        hasAdults: true,
        schedule: {
          children: {
            title: 'Детские группы',
            times: 'Сб-Вс 10:00-12:00',
            details: 'Выходные тренировки для детей'
          },
          adults: {
            title: 'Профессионалы',
            times: 'Пн-Пт 18:00-21:00',
            details: 'Вечерние тренировки для взрослых'
          }
        },
        pricing: {
          children: {
            monthly: '350 лей/месяц',
            single: '90 лей/занятие',
            trial: '60 лей - пробное занятие'
          },
          adults: {
            monthly: '500 лей/месяц',
            single: '120 лей/занятие',
            trial: '80 лей - пробное занятие'
          }
        },
        trainers: [
          { _type: 'reference', _ref: 'trainer-maria-ivanova' }
        ]
      }
    ]

    for (const gym of gyms) {
      await client.createOrReplace(gym)
      console.log(`✓ Зал ${gym.name} создан`)
    }

    // Страница спортзалов
    const gymsPage = {
      _type: 'gymsPage',
      _id: 'gymsPage',
      title: 'Спортзалы',
      hero: {
        badge: {
          icon: '🏢',
          text: 'Наши залы'
        },
        title: 'Современные залы',
        subtitle: 'Три профессиональных зала в разных районах Кишинева',
        statistics: [
          { number: '3', description: 'Зала' },
          { number: '8', description: 'Кортов' },
          { number: '3', description: 'Локации' }
        ]
      },
      introSection: {
        title: 'Выберите удобный зал',
        description: 'Каждый зал имеет свою специализацию и особенности'
      },
      gyms: [
        { _type: 'reference', _ref: 'gym-malia-malian-24' },
        { _type: 'reference', _ref: 'gym-august-31' },
        { _type: 'reference', _ref: 'gym-ion-creanga' }
      ]
    }

    await client.createOrReplace(gymsPage)
    console.log('✓ Страница спортзалов создана')

    // Страница услуг
    const servicesPage = {
      _type: 'servicesPage',
      _id: 'servicesPage',
      title: 'Услуги',
      hero: {
        badge: {
          icon: '🏸',
          text: 'Наши услуги'
        },
        title: 'Тренировки для всех',
        subtitle: 'От начинающих до профессионалов - у нас есть программа для каждого',
        statistics: [
          { number: '4', description: 'Вида услуг' },
          { number: '200+', description: 'Клиентов' },
          { number: '100%', description: 'Результат' }
        ]
      },
      servicesSection: {
        title: 'Выберите свой формат',
        subtitle: 'Различные программы тренировок для ваших целей',
        services: [
          {
            title: 'Групповые тренировки',
            description: 'Тренировки в группах до 8 человек с профессиональными тренерами',
            features: ['Все уровни подготовки', 'Современное оборудование', 'Гибкое расписание'],
            icon: '👥',
            price: 'от 200 лей',
            duration: '1.5 часа',
            ageGroup: 'Любой возраст'
          },
          {
            title: 'Индивидуальные занятия',
            description: 'Персональные тренировки с личным тренером для быстрого прогресса',
            features: ['Индивидуальная программа', 'Гибкий график', 'Максимальное внимание'],
            icon: '👤',
            price: 'от 400 лей',
            duration: '1 час',
            ageGroup: 'Любой возраст'
          },
          {
            title: 'Подготовка к соревнованиям',
            description: 'Специализированная подготовка для участия в турнирах и соревнованиях',
            features: ['Техническая подготовка', 'Тактическое планирование', 'Психологическая поддержка'],
            icon: '🏆',
            price: 'от 500 лей',
            duration: '2 часа',
            ageGroup: '12+ лет'
          }
        ]
      }
    }

    await client.createOrReplace(servicesPage)
    console.log('✓ Страница услуг создана')

    // Страница контактов
    const contactPage = {
      _type: 'contactPage',
      _id: 'contactPage',
      title: 'Контакты',
      hero: {
        badge: {
          icon: '📞',
          text: 'Свяжитесь с нами'
        },
        title: 'Контакты',
        subtitle: 'Готовы ответить на все ваши вопросы и помочь выбрать программу',
        statistics: [
          { number: '24/7', description: 'Поддержка' },
          { number: '3', description: 'Локации' },
          { number: '100%', description: 'Ответов' }
        ]
      },
      contactInfo: {
        title: 'Основные контакты',
        description: 'Свяжитесь с нами любым удобным способом',
        contacts: [
          {
            type: 'phone',
            label: 'Основной телефон',
            value: '+373 22 123-456',
            icon: '📱'
          },
          {
            type: 'email',
            label: 'Email',
            value: 'info@altius.md',
            icon: '📧'
          },
          {
            type: 'social',
            label: 'Instagram',
            value: '@altius_badminton',
            icon: '📷'
          }
        ]
      },
      contactForm: {
        title: 'Напишите нам',
        subtitle: 'Оставьте заявку и мы свяжемся с вами',
        submitButtonText: 'Отправить сообщение',
        successMessage: 'Спасибо! Ваше сообщение отправлено.'
      }
    }

    await client.createOrReplace(contactPage)
    console.log('✓ Страница контактов создана')

    console.log('🎉 Весь контент успешно извлечен и загружен в CMS!')
    console.log('📝 Теперь вы можете редактировать контент через админку')

  } catch (error) {
    console.error('❌ Ошибка при извлечении и импорте:', error)
  }
}

// Запуск без токена - создаем документы через Studio API
extractAndImport()
