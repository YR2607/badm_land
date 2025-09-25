/*
  Seed singleton CMS documents with initial content so editors can see and edit existing texts.
  Usage:
    SANITY_WRITE_TOKEN="<token>" node scripts/seedSingletons.js
*/

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'ctgwxc8c',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
})

function heroSection({ badgeTextRu, badgeTextEn, badgeTextRo, titleRu, titleEn, titleRo, subtitleRu, subtitleEn, subtitleRo, stats }) {
  return {
    badge: {
      icon: '🏸',
      text: badgeTextRu,
      text_en: badgeTextEn,
      text_ro: badgeTextRo,
    },
    title: titleRu,
    title_en: titleEn,
    title_ro: titleRo,
    subtitle: subtitleRu,
    subtitle_en: subtitleEn,
    subtitle_ro: subtitleRo,
    statistics: (stats || []).map(s => ({ number: s.number, description: s.descriptionRu, description_en: s.descriptionEn, description_ro: s.descriptionRo })),
  }
}

async function seed() {
  if (!client.config().token) {
    console.error('Missing SANITY_WRITE_TOKEN env variable. Aborting.')
    process.exit(1)
  }

  const ops = []

  // Home — Hero
  ops.push({
    _id: 'homeHero',
    _type: 'homeHero',
    content: heroSection({
      badgeTextRu: 'Профессиональный клуб с 2010 года',
      badgeTextEn: 'Professional club since 2010',
      badgeTextRo: 'Club profesional din 2010',
      titleRu: 'ALTIUS',
      titleEn: 'ALTIUS',
      titleRo: 'ALTIUS',
      subtitleRu: 'Мы создаем будущих чемпионов и популяризируем бадминтон в Молдове. Наш клуб — это место, где каждый может найти свой путь к успеху.',
      subtitleEn: 'We create future champions and popularize badminton in Moldova. Our club is a place where everyone can find their path to success.',
      subtitleRo: 'Creăm campionii de mâine și popularizăm badmintonul în Moldova. Clubul nostru este locul unde fiecare își poate găsi drumul către succes.',
      stats: [
        { number: '500+', descriptionRu: 'Довольных учеников', descriptionEn: 'Happy Students', descriptionRo: 'Elevi mulțumiți' },
        { number: '15+', descriptionRu: 'Лет опыта', descriptionEn: 'Years of Experience', descriptionRo: 'Ani de experiență' },
        { number: '3', descriptionRu: 'Современных зала', descriptionEn: 'Modern courts', descriptionRo: 'Săli moderne' },
      ],
    }),
  })

  // Home — About
  ops.push({
    _id: 'homeAbout',
    _type: 'homeAbout',
    title: 'О нашем клубе',
    title_en: 'About our club',
    title_ro: 'Despre club',
    subtitle: 'Профессиональные тренировки и дружелюбная атмосфера',
    subtitle_en: 'Professional training and friendly atmosphere',
    subtitle_ro: 'Antrenamente profesionale și atmosferă prietenoasă',
    content: [ { _type: 'block', children: [{ _type: 'span', text: 'ALTIUS — бадминтон клуб в Кишиневе.' }] } ],
    content_en: [ { _type: 'block', children: [{ _type: 'span', text: 'ALTIUS is a badminton club in Chisinau.' }] } ],
    content_ro: [ { _type: 'block', children: [{ _type: 'span', text: 'ALTIUS este un club de badminton din Chișinău.' }] } ],
  })

  // Home — Services (section)
  ops.push({
    _id: 'homeServices',
    _type: 'homeServices',
    title: 'Наши услуги',
    title_en: 'Our Services',
    title_ro: 'Serviciile noastre',
    subtitle: 'Профессиональные тренировки для всех уровней',
    subtitle_en: 'Professional training for all levels',
    subtitle_ro: 'Antrenament profesional pentru toate nivelurile',
    services: [
      { title: 'Групповые тренировки', title_en: 'Group Training', title_ro: 'Antrenament în Grup', description: 'Занятия в группах до 8 человек', description_en: 'Up to 8 people groups', description_ro: 'Până la 8 persoane', icon: '👥', color: 'from-blue-500 via-blue-600 to-indigo-600' },
      { title: 'Индивидуальные тренировки', title_en: 'Individual Training', title_ro: 'Antrenament Individual', description: 'Персональные занятия с тренером', description_en: 'One-on-one with a coach', description_ro: 'Unu la unu cu antrenorul', icon: '👤', color: 'from-orange-500 via-red-500 to-pink-500' },
      { title: 'Соревновательная подготовка', title_en: 'Competition Training', title_ro: 'Pregătire pentru Competiții', description: 'Подготовка к турнирам и соревнованиям', description_en: 'Tournament preparation', description_ro: 'Pregătire pentru turnee', icon: '🏆', color: 'from-yellow-500 via-amber-500 to-orange-500' },
    ],
  })

  // Home — Achievements
  ops.push({
    _id: 'homeAchievements',
    _type: 'homeAchievements',
    title: 'Наши достижения',
    title_en: 'Our Achievements',
    title_ro: 'Realizările noastre',
    subtitle: 'История успехов и роста',
    subtitle_en: 'History of success and growth',
    subtitle_ro: 'Istoria succesului și creșterii',
    achievements: [
      { title: 'Чемпионы Молдовы', title_en: 'Moldova Champions', title_ro: 'Campioni ai Moldovei', count: '—', description: 'Наших воспитанников стали чемпионами страны', description_en: 'Our students became national champions', description_ro: 'Elevii noștri au devenit campioni naționali', icon: '🏆', color: 'from-primary-blue to-blue-700' },
      { title: 'Активных спортсменов', title_en: 'Active Athletes', title_ro: 'Sportivi activi', count: '120+', description: 'Регулярно тренируются в нашем клубе', description_en: 'Training regularly in our club', description_ro: 'Se antrenează regulat în club', icon: '👥', color: 'from-primary-yellow to-yellow-600' },
    ],
  })

  // Home — CTA & SEO
  ops.push({ _id: 'homeCta', _type: 'homeCta', title: 'Готовы начать?', title_en: 'Ready to start?', title_ro: 'Gata să începeți?', description: 'Запишитесь на пробное занятие', description_en: 'Book a trial session', description_ro: 'Înscrie-te la o sesiune de probă', buttonText: 'Записаться', buttonText_en: 'Start Training', buttonText_ro: 'Începe antrenamentul', buttonLink: '/contact' })
  ops.push({ _id: 'homeSeo', _type: 'homeSeo', metaTitle: 'ALTIUS — Бадминтон клуб', metaDescription: 'Профессиональный бадминтон клуб в Кишинёве', keywords: 'ALTIUS, бадминтон, Кишинев' })

  // Services — Hero
  ops.push({
    _id: 'servicesHero',
    _type: 'servicesHero',
    content: heroSection({
      badgeTextRu: 'Профессиональное обучение',
      badgeTextEn: 'Professional Training',
      badgeTextRo: 'Antrenament Profesional',
      titleRu: 'Тренировки для всех',
      titleEn: 'Training for Everyone',
      titleRo: 'Antrenamente pentru toți',
      subtitleRu: 'От начинающих до профессионалов — у нас есть программа для каждого',
      subtitleEn: 'From beginners to pros — we have a program for everyone',
      subtitleRo: 'De la începători la profesioniști — avem un program pentru fiecare',
      stats: [
        { number: '500+', descriptionRu: 'Учеников', descriptionEn: 'Students', descriptionRo: 'Elevi' },
        { number: '15+', descriptionRu: 'Лет опыта', descriptionEn: 'Years of experience', descriptionRo: 'Ani de experiență' },
        { number: '3', descriptionRu: 'Формата обучения', descriptionEn: 'Training formats', descriptionRo: 'Formate de antrenament' },
      ],
    }),
  })

  // Services — List & Pricing & SEO
  ops.push({
    _id: 'servicesList',
    _type: 'servicesList',
    title: 'Наши услуги', title_en: 'Our Services', title_ro: 'Serviciile noastre',
    subtitle: 'Профессиональные тренировки для всех уровней', subtitle_en: 'Professional training for all levels', subtitle_ro: 'Antrenament profesional pentru toate nivelurile',
    services: [
      { title: 'Групповые тренировки', title_en: 'Group Training', title_ro: 'Antrenament în Grup', description: 'До 8 человек, техника, тактика, физика', description_en: 'Up to 8 people, technique, tactics, fitness', description_ro: 'Până la 8 persoane, tehnică, tactică, pregătire' },
      { title: 'Индивидуальные тренировки', title_en: 'Individual Training', title_ro: 'Antrenament Individual', description: 'Персональный подход, гибкое расписание', description_en: 'Personal approach, flexible schedule', description_ro: 'Abordare personală, program flexibil' },
      { title: 'Соревновательная подготовка', title_en: 'Competition Training', title_ro: 'Pregătire pentru Competiții', description: 'Интенсив и спарринги', description_en: 'Intensive and sparring', description_ro: 'Antrenament intensiv și sparring' },
    ],
  })

  ops.push({
    _id: 'servicesPricing',
    _type: 'servicesPricing',
    title: 'Секция цен', title_en: 'Pricing', title_ro: 'Prețuri',
    subtitle: 'Выберите подходящий план', subtitle_en: 'Choose your plan', subtitle_ro: 'Alege planul potrivit',
    pricingPlans: [
      { name: 'Группа', name_en: 'Group', name_ro: 'Grup', price: '200', period: 'lei', features: ['до 8 человек', '2 занятия/нед'], features_en: ['up to 8 people', '2 sessions/week'], features_ro: ['până la 8 persoane', '2 ședințe/săpt'], popular: true },
      { name: 'Индивидуально', name_en: 'Individual', name_ro: 'Individual', price: '400', period: 'lei', features: ['1-на-1', 'гибкий график'], features_en: ['1-on-1', 'flexible schedule'], features_ro: ['unu-la-unu', 'program flexibil'], popular: false },
    ],
  })
  ops.push({ _id: 'servicesSeo', _type: 'servicesSeo', metaTitle: 'ALTIUS — Услуги', metaDescription: 'Групповые и индивидуальные тренировки, подготовка к соревнованиям', keywords: 'услуги, тренировки, бадминтон' })

  // About — Hero/Stats/Tabs/History/Roadmap
  ops.push({ _id: 'aboutHero', _type: 'aboutHero', content: heroSection({
    badgeTextRu: 'О клубе', badgeTextEn: 'About', badgeTextRo: 'Despre',
    titleRu: 'ALTIUS', titleEn: 'ALTIUS', titleRo: 'ALTIUS',
    subtitleRu: 'Мы создаем будущих чемпионов и популяризируем бадминтон в Молдове. Наш клуб — это место, где каждый может найти свой путь к успеху.',
    subtitleEn: 'We create future champions and popularize badminton in Moldova. Our club is a place where everyone can find their path to success.',
    subtitleRo: 'Creăm campionii de mâine și popularizăm badmintonul în Moldova. Clubul nostru este locul unde fiecare își poate găsi drumul către succes.',
    stats: [
      { number: '120+', descriptionRu: 'Участников', descriptionEn: 'Participants', descriptionRo: 'Participanți' },
      { number: '1+', descriptionRu: 'Год опыта', descriptionEn: 'Year of experience', descriptionRo: 'Un an de experiență' },
      { number: '15+', descriptionRu: 'Турниров', descriptionEn: 'Tournaments', descriptionRo: 'Turnee' },
    ],
  })})

  ops.push({ _id: 'aboutStats', _type: 'aboutStats', title: 'Наши достижения в цифрах', stats: [
    { number: '1+', description: 'Лет опыта', description_en: 'Years of experience', description_ro: 'Ani de experiență', icon: '⏰', color: 'from-primary-blue to-blue-600' },
    { number: '120+', description: 'Участников', description_en: 'Participants', description_ro: 'Participanți', icon: '👥', color: 'from-primary-yellow to-yellow-600' },
    { number: '4', description: 'Современные залы', description_en: 'Modern halls', description_ro: 'Săli moderne', icon: '🏢', color: 'from-primary-orange to-red-600' },
  ]})

  ops.push({ _id: 'aboutTabs', _type: 'aboutTabs', title: 'О клубе', subtitle: 'Миссия, тренеры, инфраструктура', tabs: [
    { key: 'mission', label: 'Миссия', icon: '🎯', title: 'Наша миссия', content: 'Развивать бадминтон в Молдове и воспитывать чемпионов.' },
    { key: 'coaches', label: 'Тренеры', icon: '👥', title: 'Наша команда', content: 'Опытные тренеры с международными сертификатами.' },
    { key: 'facility', label: 'Инфраструктура', icon: '🏢', title: 'Наши залы', content: 'Современные залы с профессиональным оборудованием.' },
  ]})

  ops.push({ _id: 'aboutHistory', _type: 'aboutHistory', title: 'Наша история', subtitle: 'Путь развития клуба', showAllByDefault: false, timeline: [
    { year: '2024 Q1', title: 'Старт Altius', text: 'Первые наборы для взрослых и подростков.' },
    { year: '2024 Q2', title: 'Формирование ядра команды', text: 'Стабилизировали расписание и запустили рейтинг.' },
    { year: '2024 Q3', title: 'Первые трофеи', text: 'Призы на локальных турнирах.' },
  ]})

  ops.push({ _id: 'aboutRoadmap', _type: 'aboutRoadmap', title: 'Планы развития', subtitle: 'Наши цели на ближайшие годы', roadmapItems: [
    { tag: '2025 Q3', title: 'Расширение участия', description: 'Партнёрства и выездные турниры.', status: 'done' },
    { tag: '2025 Q4', title: 'Altius Cup', description: 'Открытый турнир клуба.', status: 'progress' },
  ]})

  // Gyms — Hero & SEO
  ops.push({ _id: 'gymsHero', _type: 'gymsHero', content: heroSection({
    badgeTextRu: 'Профессиональные залы', badgeTextEn: 'Professional Facilities', badgeTextRo: 'Facilități profesionale',
    titleRu: 'Наши залы', titleEn: 'Our Gyms', titleRo: 'Sălile noastre',
    subtitleRu: 'Современные залы с профессиональным оборудованием в разных районах Кишинева',
    subtitleEn: 'Modern facilities with professional equipment in different districts of Chisinau',
    subtitleRo: 'Facilități moderne cu echipament profesional în diferite sectoare din Chișinău',
    stats: [
      { number: '3', descriptionRu: 'Зала', descriptionEn: 'Facilities', descriptionRo: 'Săli' },
      { number: '6', descriptionRu: 'Кортов', descriptionEn: 'Courts', descriptionRo: 'Terenuri' },
      { number: '3', descriptionRu: 'Района', descriptionEn: 'Districts', descriptionRo: 'Sectoare' },
    ],
  })})
  ops.push({ _id: 'gymsSeo', _type: 'gymsSeo', metaTitle: 'ALTIUS — Залы', metaDescription: 'Современные залы для бадминтона в Кишинёве', keywords: 'залы, бадминтон, Кишинев' })

  // Contacts — Hero/Info/Gyms/Form/SEO
  ops.push({ _id: 'contactHero', _type: 'contactHero', content: heroSection({
    badgeTextRu: 'Связь с нами', badgeTextEn: 'Contact Us', badgeTextRo: 'Contactați-ne',
    titleRu: 'Свяжитесь с нами', titleEn: 'Contact Us', titleRo: 'Contactați-ne',
    subtitleRu: 'Мы всегда готовы ответить на ваши вопросы и помочь вам начать тренировки',
    subtitleEn: 'We are always ready to answer your questions and help you start training',
    subtitleRo: 'Suntem întotdeauna gata să răspundem la întrebările dvs. și să vă ajutăm să începeți antrenamentele',
    stats: [
      { number: '24/7', descriptionRu: 'Поддержка', descriptionEn: 'Support', descriptionRo: 'Suport' },
      { number: '3', descriptionRu: 'Локации', descriptionEn: 'Locations', descriptionRo: 'Locații' },
      { number: '100%', descriptionRu: 'Ответ', descriptionEn: 'Response', descriptionRo: 'Răspuns' },
    ],
  })})

  ops.push({ _id: 'contactInfo', _type: 'contactInfo', title: 'Полезная информация', description: 'Как с нами связаться', contacts: [
    { type: 'address', label: 'Адрес', value: 'г. Кишинев, ул. Малая Малиан 24', icon: '📍' },
    { type: 'phone', label: 'Телефон', value: '+373 60 123 456', icon: '📞' },
    { type: 'email', label: 'Email', value: 'info@altius.md', icon: '✉️' },
  ]})
  ops.push({ _id: 'contactGyms', _type: 'contactGyms', title: 'Залы', gyms: [] })
  ops.push({ _id: 'contactForm', _type: 'contactForm', title: 'Свяжитесь с нами', subtitle: 'Оставьте сообщение', submitButtonText: 'Отправить', successMessage: 'Спасибо! Мы свяжемся с вами.' })
  ops.push({ _id: 'contactSeo', _type: 'contactSeo', metaTitle: 'Контакты ALTIUS', metaDescription: 'Свяжитесь с бадминтон клубом ALTIUS', keywords: 'контакты, altius' })

  for (const doc of ops) {
    await client.createOrReplace(doc)
  }

  console.log(`Seeded ${ops.length} singleton documents.`)
}

seed().catch((e) => { console.error(e); process.exit(1) })
