import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gym',
  title: 'Спортзал',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Название зала (RU)', type: 'string', validation: r => r.required() }),
    defineField({ name: 'name_en', title: 'Название зала (EN)', type: 'string' }),
    defineField({ name: 'name_ro', title: 'Название зала (RO)', type: 'string' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({ name: 'description', title: 'Краткое описание (RU)', type: 'text' }),
    defineField({ name: 'description_en', title: 'Краткое описание (EN)', type: 'text' }),
    defineField({ name: 'description_ro', title: 'Краткое описание (RO)', type: 'text' }),
    defineField({
      name: 'detailedDescription',
      title: 'Подробное описание',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'heroImage',
      title: 'Главное изображение',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({ name: 'badge', title: 'Бейдж (RU)', type: 'string' }),
    defineField({ name: 'badge_en', title: 'Бейдж (EN)', type: 'string' }),
    defineField({ name: 'badge_ro', title: 'Бейдж (RO)', type: 'string' }),
    defineField({
      name: 'badgeColor',
      title: 'Цвет бейджа',
      type: 'string',
      options: {
        list: [
          { title: 'Синий', value: 'from-blue-500 to-indigo-600' },
          { title: 'Зеленый', value: 'from-green-500 to-emerald-600' },
          { title: 'Оранжевый', value: 'from-orange-500 to-red-600' },
          { title: 'Фиолетовый', value: 'from-purple-500 to-pink-600' }
        ]
      }
    }),
    defineField({
      name: 'address',
      title: 'Адрес',
      type: 'string'
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),
    defineField({
      name: 'mapUrl',
      title: 'Ссылка на карту',
      type: 'url'
    }),
    defineField({
      name: 'gallery',
      title: 'Галерея фотографий',
      type: 'array',
      of: [{
        type: 'image',
        options: {
          hotspot: true
        }
      }]
    }),
    defineField({ name: 'features', title: 'Особенности зала (RU)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'features_en', title: 'Особенности зала (EN)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'features_ro', title: 'Особенности зала (RO)', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'hasChildren',
      title: 'Детские группы',
      type: 'boolean'
    }),
    defineField({
      name: 'hasAdults',
      title: 'Взрослые группы',
      type: 'boolean'
    }),
    defineField({
      name: 'schedule',
      title: 'Расписание',
      type: 'object',
      fields: [
        {
          name: 'children',
          title: 'Детские группы',
          type: 'object',
          fields: [
            { name: 'title', title: 'Название (RU)', type: 'string' },
            { name: 'title_en', title: 'Название (EN)', type: 'string' },
            { name: 'title_ro', title: 'Название (RO)', type: 'string' },
            { name: 'times', title: 'Время', type: 'string' },
            { name: 'details', title: 'Детали (RU)', type: 'text' },
            { name: 'details_en', title: 'Детали (EN)', type: 'text' },
            { name: 'details_ro', title: 'Детали (RO)', type: 'text' }
          ]
        },
        {
          name: 'adults',
          title: 'Взрослые группы',
          type: 'object',
          fields: [
            { name: 'title', title: 'Название (RU)', type: 'string' },
            { name: 'title_en', title: 'Название (EN)', type: 'string' },
            { name: 'title_ro', title: 'Название (RO)', type: 'string' },
            { name: 'times', title: 'Время', type: 'string' },
            { name: 'details', title: 'Детали (RU)', type: 'text' },
            { name: 'details_en', title: 'Детали (EN)', type: 'text' },
            { name: 'details_ro', title: 'Детали (RO)', type: 'text' }
          ]
        }
      ]
    }),
    defineField({
      name: 'pricing',
      title: 'Прайс-лист',
      type: 'object',
      fields: [
        {
          name: 'children',
          title: 'Детские группы',
          type: 'object',
          fields: [
            { name: 'monthly', title: 'Месячный абонемент (RU)', type: 'string' },
            { name: 'monthly_en', title: 'Месячный абонемент (EN)', type: 'string' },
            { name: 'monthly_ro', title: 'Месячный абонемент (RO)', type: 'string' },
            { name: 'single', title: 'Разовое занятие (RU)', type: 'string' },
            { name: 'single_en', title: 'Разовое занятие (EN)', type: 'string' },
            { name: 'single_ro', title: 'Разовое занятие (RO)', type: 'string' },
            { name: 'trial', title: 'Пробное занятие (RU)', type: 'string' },
            { name: 'trial_en', title: 'Пробное занятие (EN)', type: 'string' },
            { name: 'trial_ro', title: 'Пробное занятие (RO)', type: 'string' }
          ]
        },
        {
          name: 'adults',
          title: 'Взрослые группы',
          type: 'object',
          fields: [
            { name: 'monthly', title: 'Месячный абонемент (RU)', type: 'string' },
            { name: 'monthly_en', title: 'Месячный абонемент (EN)', type: 'string' },
            { name: 'monthly_ro', title: 'Месячный абонемент (RO)', type: 'string' },
            { name: 'single', title: 'Разовое занятие (RU)', type: 'string' },
            { name: 'single_en', title: 'Разовое занятие (EN)', type: 'string' },
            { name: 'single_ro', title: 'Разовое занятие (RO)', type: 'string' },
            { name: 'trial', title: 'Пробное занятие (RU)', type: 'string' },
            { name: 'trial_en', title: 'Пробное занятие (EN)', type: 'string' },
            { name: 'trial_ro', title: 'Пробное занятие (RO)', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'trainers',
      title: 'Тренеры зала',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'trainer' }] }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO настройки',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Ключевые слова', type: 'string' }
      ]
    })
  ]
})
