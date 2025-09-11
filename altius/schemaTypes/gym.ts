import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gym',
  title: 'Спортзал',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Название зала',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({
      name: 'description',
      title: 'Краткое описание',
      type: 'text'
    }),
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
    defineField({
      name: 'badge',
      title: 'Бейдж',
      type: 'string'
    }),
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
    defineField({
      name: 'features',
      title: 'Особенности зала',
      type: 'array',
      of: [{ type: 'string' }]
    }),
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
            { name: 'title', title: 'Название', type: 'string' },
            { name: 'times', title: 'Время', type: 'string' },
            { name: 'details', title: 'Детали', type: 'text' }
          ]
        },
        {
          name: 'adults',
          title: 'Взрослые группы',
          type: 'object',
          fields: [
            { name: 'title', title: 'Название', type: 'string' },
            { name: 'times', title: 'Время', type: 'string' },
            { name: 'details', title: 'Детали', type: 'text' }
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
            { name: 'monthly', title: 'Месячный абонемент', type: 'string' },
            { name: 'single', title: 'Разовое занятие', type: 'string' },
            { name: 'trial', title: 'Пробное занятие', type: 'string' }
          ]
        },
        {
          name: 'adults',
          title: 'Взрослые группы',
          type: 'object',
          fields: [
            { name: 'monthly', title: 'Месячный абонемент', type: 'string' },
            { name: 'single', title: 'Разовое занятие', type: 'string' },
            { name: 'trial', title: 'Пробное занятие', type: 'string' }
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
