import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'ctgwxc8c',
  dataset: 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03'
})

async function createDocuments() {
  try {
    // Создаем документ главной страницы
    const homePage = {
      _type: 'homePage',
      _id: 'homePage',
      title: 'Главная страница',
      hero: {
        badge: {
          icon: '🏸',
          text: 'Бадминтон клуб'
        },
        title: 'ALTIUS',
        subtitle: 'Профессиональный бадминтон клуб в Кишиневе. Тренировки для всех уровней подготовки - от начинающих до профессионалов.',
        statistics: [
          {
            number: '500+',
            description: 'Учеников'
          },
          {
            number: '15+',
            description: 'Лет опыта'
          },
          {
            number: '3',
            description: 'Формата обучения'
          }
        ]
      },
      aboutSection: {
        title: 'О нашем клубе',
        description: 'ALTIUS - это современный бадминтон клуб, который предоставляет качественные тренировки для всех возрастных групп.'
      },
      servicesSection: {
        title: 'Наши услуги',
        subtitle: 'Выберите подходящий формат тренировок',
        services: [
          {
            title: 'Детские группы',
            description: 'Обучение основам бадминтона для детей от 6 лет',
            icon: '👶',
            price: '300 лей/месяц'
          },
          {
            title: 'Любители',
            description: 'Тренировки для взрослых любого уровня подготовки',
            icon: '🏸',
            price: '400 лей/месяц'
          },
          {
            title: 'Профессионалы',
            description: 'Индивидуальные тренировки с опытными тренерами',
            icon: '🏆',
            price: 'По договоренности'
          }
        ]
      }
    }

    await client.createOrReplace(homePage)
    console.log('✓ Главная страница создана')

    // Создаем документ страницы "О клубе"
    const aboutPage = {
      _type: 'aboutPage',
      _id: 'aboutPage',
      title: 'О клубе',
      hero: {
        badge: {
          icon: 'ℹ️',
          text: 'О нас'
        },
        title: 'ALTIUS',
        subtitle: 'Мы создаем будущих чемпионов и популяризируем бадминтон в Молдове.',
        statistics: [
          {
            number: '120+',
            description: 'Участников'
          },
          {
            number: '1+',
            description: 'Год опыта'
          },
          {
            number: '15+',
            description: 'Турниров'
          }
        ]
      },
      historySection: {
        title: 'История клуба',
        content: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Клуб ALTIUS был основан с целью развития бадминтона в Молдове.'
              }
            ]
          }
        ]
      },
      missionSection: {
        title: 'Миссия и ценности',
        mission: 'Наша миссия - популяризация бадминтона в Молдове, воспитание здорового поколения.',
        values: [
          {
            title: 'Профессионализм',
            description: 'Высокий уровень подготовки тренеров',
            icon: '🎯'
          },
          {
            title: 'Индивидуальный подход',
            description: 'Персональная программа для каждого ученика',
            icon: '👤'
          }
        ]
      }
    }

    await client.createOrReplace(aboutPage)
    console.log('✓ Страница "О клубе" создана')

    // Создаем документ страницы услуг
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
        subtitle: 'От начинающих до профессионалов - у нас есть программа для каждого уровня',
        statistics: [
          {
            number: '500+',
            description: 'Учеников'
          },
          {
            number: '15+',
            description: 'Лет опыта'
          },
          {
            number: '3',
            description: 'Формата обучения'
          }
        ]
      },
      servicesSection: {
        title: 'Выберите свой формат',
        subtitle: 'Различные программы тренировок для ваших целей',
        services: [
          {
            title: 'Детские группы',
            description: 'Обучение основам бадминтона для детей от 6 до 17 лет',
            features: ['Игровая форма обучения', 'Развитие координации', 'Основы техники'],
            icon: '👶',
            price: '300 лей',
            duration: '8 занятий/месяц',
            ageGroup: '6-17 лет'
          }
        ]
      }
    }

    await client.createOrReplace(servicesPage)
    console.log('✓ Страница услуг создана')

    // Создаем документ страницы спортзалов
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
          {
            number: '3',
            description: 'Зала'
          },
          {
            number: '6',
            description: 'Кортов'
          },
          {
            number: '2',
            description: 'Локации'
          }
        ]
      },
      introSection: {
        title: 'Выберите удобный зал',
        description: 'Каждый зал имеет свою специализацию и особенности.'
      }
    }

    await client.createOrReplace(gymsPage)
    console.log('✓ Страница спортзалов создана')

    // Создаем документ страницы контактов
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
        subtitle: 'Готовы ответить на все ваши вопросы',
        statistics: [
          {
            number: '24/7',
            description: 'Поддержка'
          },
          {
            number: '3',
            description: 'Локации'
          },
          {
            number: '100%',
            description: 'Ответов'
          }
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
          }
        ]
      }
    }

    await client.createOrReplace(contactPage)
    console.log('✓ Страница контактов создана')

    console.log('🎉 Все документы успешно созданы!')
  } catch (error) {
    console.error('Ошибка при создании документов:', error)
  }
}

createDocuments()
