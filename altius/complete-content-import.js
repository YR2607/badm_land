import {createClient} from '@sanity/client'

const client = createClient({
  projectId: 'ctgwxc8c',
  dataset: 'production',
  useCdn: false,
  token: 'sk2GLBxNrCG0qhVsQEXkyQHPpuWehER9fJJIOkXa7BSV8lxVQ09skOJ5tUCTLwRCJAHVRg3sKQknJ55IwQIl96Jjuhw2wtHEiWCx8HLXkdhUvSDcl5IzANRun6F6AJ5xtFeI8fPBndFJ7r8xA3DEFcEL93XeqP0mImqyp9auBS9MyujCY0Ti',
  apiVersion: '2023-05-03'
})

async function completeContentImport() {
  try {
    console.log('🚀 Дополняем недостающие секции в CMS...')

    // Обновляем главную страницу с полным контентом
    const completeHomePage = {
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
        description: 'Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе Кишинева',
        image: null
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
      achievementsSection: {
        title: 'Наши достижения',
        achievements: [
          {
            title: '1+ год опыта',
            description: 'С 2024 года развиваем бадминтон в регионе',
            icon: '📅'
          },
          {
            title: '120+ активных участников',
            description: 'Игроки всех возрастов и уровней подготовки',
            icon: '👥'
          },
          {
            title: '4 профессиональных корта',
            description: 'Современное оборудование и освещение',
            icon: '🏢'
          },
          {
            title: '15+ турниров проведено',
            description: 'Внутренние и выездные соревнования',
            icon: '🏆'
          }
        ]
      },
      ctaSection: {
        title: 'Готовы начать тренировки?',
        description: 'Запишитесь на пробное занятие и почувствуйте атмосферу профессионального бадминтона',
        buttonText: 'Записаться на пробное занятие',
        buttonLink: '/contact'
      },
      seo: {
        metaTitle: 'ALTIUS - Бадминтон клуб в Кишиневе | Тренировки для всех уровней',
        metaDescription: 'Профессиональный бадминтон клуб ALTIUS в Кишиневе. Тренировки для детей и взрослых, опытные тренеры, современные залы.',
        keywords: 'бадминтон, клуб, Кишинев, тренировки, дети, взрослые, ALTIUS'
      }
    }

    await client.createOrReplace(completeHomePage)
    console.log('✓ Главная страница обновлена с полным контентом')

    // Создаем полную страницу "О клубе" с динамическими секциями
    const completeAboutPage = {
      _type: 'aboutPage',
      _id: 'aboutPage',
      title: 'О клубе',
      hero: {
        badge: {
          icon: 'ℹ️',
          text: 'О нас'
        },
        title: 'ALTIUS',
        subtitle: 'Мы создаем будущих чемпионов и популяризируем бадминтон в Молдове. Наш клуб - это место, где каждый может найти свой путь к успеху.',
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
      statsSection: {
        title: 'Наши достижения в цифрах',
        stats: [
          {
            number: '1+',
            label: 'год опыта',
            description: 'С 2024 года развиваем бадминтон в регионе',
            icon: '⏰',
            color: 'from-primary-blue to-blue-600'
          },
          {
            number: '120+',
            label: 'активных участников',
            description: 'Игроки всех возрастов и уровней подготовки',
            icon: '👥',
            color: 'from-primary-yellow to-yellow-600'
          },
          {
            number: '4',
            label: 'профессиональных корта',
            description: 'Современное оборудование и освещение',
            icon: '🏢',
            color: 'from-primary-orange to-red-600'
          },
          {
            number: '15+',
            label: 'турниров проведено',
            description: 'Внутренние и выездные соревнования',
            icon: '🏆',
            color: 'from-primary-blue to-blue-700'
          }
        ]
      },
      tabsSection: {
        title: 'О нашем клубе',
        subtitle: 'Узнайте больше о нашей миссии, тренерах и инфраструктуре',
        tabs: [
          {
            key: 'mission',
            label: 'Миссия',
            icon: '🎯',
            title: 'Наша миссия',
            content: 'Развивать бадминтон в Молдове, создавать дружелюбную атмосферу для игроков всех уровней и воспитывать будущих чемпионов.',
            values: [
              {
                title: 'Профессионализм',
                description: 'Высокие стандарты обучения и сертифицированные тренеры',
                icon: '🎯'
              },
              {
                title: 'Дружелюбие',
                description: 'Теплая атмосфера и поддержка для игроков всех уровней',
                icon: '❤️'
              },
              {
                title: 'Результат',
                description: 'Ориентация на достижение целей каждого участника',
                icon: '🏆'
              }
            ]
          },
          {
            key: 'coaches',
            label: 'Тренеры',
            icon: '👥',
            title: 'Наша команда',
            content: 'Опытные тренеры с международными сертификатами и многолетним стажем работы.',
            coaches: [
              { _type: 'reference', _ref: 'trainer-aleksandr-petrov' },
              { _type: 'reference', _ref: 'trainer-maria-ivanova' },
              { _type: 'reference', _ref: 'trainer-elena-sidorova' }
            ]
          },
          {
            key: 'facility',
            label: 'Инфраструктура',
            icon: '🏢',
            title: 'Наши залы',
            content: 'Современные залы с профессиональным оборудованием в удобных локациях.',
            facilities: [
              {
                name: 'Малая Малиан, 24',
                description: 'Центральный зал с парковкой',
                features: ['2 корта', 'Раздевалки', 'Парковка']
              },
              {
                name: '31 августа 1989',
                description: 'Детский специализированный центр',
                features: ['1 корт', 'Детская зона', 'Кафетерий']
              },
              {
                name: 'Ион Крянге, 1',
                description: 'Премиум зал для профессионалов',
                features: ['1 корт', 'Видеоанализ', 'VIP зона']
              }
            ]
          }
        ]
      },
      historySection: {
        title: 'Наша история',
        subtitle: 'Путь развития клуба с момента основания',
        showAllByDefault: false,
        timeline: [
          {
            year: '2024 Q1',
            title: 'Старт Altius',
            text: 'Открыли двери и провели первые наборы для взрослых и подростков.'
          },
          {
            year: '2024 Q2',
            title: 'Формирование ядра команды',
            text: 'Стабилизировали расписание, собрали первую клубную группу и стартовали базовый рейтинг.'
          },
          {
            year: '2024 Q3',
            title: 'Первые трофеи',
            text: 'Участники клуба взяли призовые места на локальных турнирах.'
          },
          {
            year: '2024 Q4',
            title: 'Итоги сезона',
            text: 'Провели клубный финал года, наградили лучших игроков и тренеров.'
          },
          {
            year: '2025 Q1',
            title: 'Школа юниоров',
            text: 'Запустили детские группы, тест‑сборы, индивидуальные программы.'
          },
          {
            year: '2025 Q2',
            title: 'Клубная лига',
            text: 'Регулярные внутренние матчи и мини‑лиги по уровням.'
          },
          {
            year: '2025 Q3',
            title: 'Расширение участия',
            text: 'Выездные турниры, партнёрства, спарринги с другими клубами региона.'
          },
          {
            year: '2025 Q4',
            title: 'Altius Cup',
            text: 'Открытый турнир клуба с приглашёнными гостями и праздничной церемонией.'
          }
        ]
      },
      roadmapSection: {
        title: 'Планы развития',
        subtitle: 'Наши цели и проекты на ближайшее время',
        roadmapItems: [
          {
            tag: '2025 Q3',
            title: 'Расширение участия',
            description: 'Выезды на турниры, партнёрства и спарринги с клубами региона.',
            status: 'done'
          },
          {
            tag: '2025 Q4',
            title: 'Altius Cup',
            description: 'Открытый турнир клуба с церемонией и приглашёнными гостями.',
            status: 'progress'
          },
          {
            tag: '2026 Q1',
            title: 'Академия U17',
            description: 'Регулярные сборы, тесты, сопровождение и календарь стартов.',
            status: 'planned'
          },
          {
            tag: '2026 Q2',
            title: 'Клубная лига 2.0',
            description: 'Уровневые дивизионы, рейтинги, матч‑дни и трансляции.',
            status: 'planned'
          },
          {
            tag: '2026 Q3',
            title: 'Международные связи',
            description: 'Партнёрство с европейскими клубами и обмен опытом.',
            status: 'planned'
          },
          {
            tag: '2026 Q4',
            title: 'Новый зал',
            description: 'Открытие четвёртого зала с 2 кортами в новом районе.',
            status: 'planned'
          }
        ]
      },
      seo: {
        metaTitle: 'О клубе ALTIUS - История, миссия и команда бадминтон клуба',
        metaDescription: 'Узнайте больше о бадминтон клубе ALTIUS: наша история, миссия, ценности и планы развития.',
        keywords: 'ALTIUS, о клубе, история, миссия, команда, тренеры, бадминтон Кишинев'
      }
    }

    await client.createOrReplace(completeAboutPage)
    console.log('✓ Страница "О клубе" создана с полным контентом и динамическими секциями')

    console.log('🎉 Все недостающие секции добавлены в CMS!')
    console.log('📝 Теперь можно редактировать:')
    console.log('   - Все секции главной страницы')
    console.log('   - Статистику и достижения')
    console.log('   - Историю клуба (добавлять/удалять события)')
    console.log('   - Планы развития (добавлять/удалять/менять статус)')
    console.log('   - Табы с информацией о миссии, тренерах, залах')

  } catch (error) {
    console.error('❌ Ошибка при дополнении контента:', error)
  }
}

completeContentImport()
