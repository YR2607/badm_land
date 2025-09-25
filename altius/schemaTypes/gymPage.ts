import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gymPage',
  title: 'Зал (Gym Page)',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Название (RU)', type: 'string' }),
    defineField({ name: 'title_en', title: 'Название (EN)', type: 'string' }),
    defineField({ name: 'title_ro', title: 'Название (RO)', type: 'string' }),

    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }}),

    defineField({ name: 'badge', title: 'Бейдж (RU)', type: 'string' }),
    defineField({ name: 'badge_en', title: 'Бейдж (EN)', type: 'string' }),
    defineField({ name: 'badge_ro', title: 'Бейдж (RO)', type: 'string' }),

    defineField({ name: 'description', title: 'Описание (RU)', type: 'text' }),
    defineField({ name: 'description_en', title: 'Описание (EN)', type: 'text' }),
    defineField({ name: 'description_ro', title: 'Описание (RO)', type: 'text' }),

    defineField({ name: 'address', title: 'Адрес', type: 'string' }),
    defineField({ name: 'phone', title: 'Телефон', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'mapUrl', title: 'Ссылка на карту', type: 'url' }),

    defineField({
      name: 'features',
      title: 'Особенности (список) (RU)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'features_en', title: 'Особенности (EN)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'features_ro', title: 'Особенности (RO)', type: 'array', of: [{ type: 'string' }] }),

    defineField({
      name: 'schedule',
      title: 'Расписание',
      type: 'object',
      fields: [
        defineField({
          name: 'children',
          title: 'Детские',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Заголовок (RU)', type: 'string' }),
            defineField({ name: 'title_en', title: 'Заголовок (EN)', type: 'string' }),
            defineField({ name: 'title_ro', title: 'Заголовок (RO)', type: 'string' }),
            defineField({ name: 'times', title: 'Время', type: 'string' }),
            defineField({ name: 'details', title: 'Детали (RU)', type: 'string' }),
            defineField({ name: 'details_en', title: 'Детали (EN)', type: 'string' }),
            defineField({ name: 'details_ro', title: 'Детали (RO)', type: 'string' })
          ]
        }),
        defineField({
          name: 'adults',
          title: 'Взрослые',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Заголовок (RU)', type: 'string' }),
            defineField({ name: 'title_en', title: 'Заголовок (EN)', type: 'string' }),
            defineField({ name: 'title_ro', title: 'Заголовок (RO)', type: 'string' }),
            defineField({ name: 'times', title: 'Время', type: 'string' }),
            defineField({ name: 'details', title: 'Детали (RU)', type: 'string' }),
            defineField({ name: 'details_en', title: 'Детали (EN)', type: 'string' }),
            defineField({ name: 'details_ro', title: 'Детали (RO)', type: 'string' })
          ]
        })
      ]
    }),

    defineField({
      name: 'pricing',
      title: 'Цены',
      type: 'object',
      fields: [
        defineField({
          name: 'children', title: 'Детские', type: 'object', fields: [
            defineField({ name: 'monthly', title: 'Абонемент (мес.)', type: 'string' }),
            defineField({ name: 'single', title: 'Разовое', type: 'string' }),
            defineField({ name: 'trial', title: 'Пробное', type: 'string' })
          ]
        }),
        defineField({
          name: 'adults', title: 'Взрослые', type: 'object', fields: [
            defineField({ name: 'monthly', title: 'Абонемент (мес.)', type: 'string' }),
            defineField({ name: 'single', title: 'Разовое', type: 'string' }),
            defineField({ name: 'trial', title: 'Пробное', type: 'string' })
          ]
        })
      ]
    }),

    defineField({
      name: 'trainers',
      title: 'Тренеры',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Имя (RU)', type: 'string' }),
          defineField({ name: 'name_en', title: 'Имя (EN)', type: 'string' }),
          defineField({ name: 'name_ro', title: 'Имя (RO)', type: 'string' }),
          defineField({ name: 'experience', title: 'Опыт (RU)', type: 'string' }),
          defineField({ name: 'experience_en', title: 'Опыт (EN)', type: 'string' }),
          defineField({ name: 'experience_ro', title: 'Опыт (RO)', type: 'string' }),
          defineField({ name: 'specialization', title: 'Специализация (RU)', type: 'string' }),
          defineField({ name: 'specialization_en', title: 'Специализация (EN)', type: 'string' }),
          defineField({ name: 'specialization_ro', title: 'Специализация (RO)', type: 'string' }),
          defineField({ name: 'photo', title: 'Фото (URL)', type: 'url' })
        ]
      }])
    }),

    defineField({ name: 'heroImage', title: 'Hero изображение (URL)', type: 'url' }),
    defineField({ name: 'gallery', title: 'Галерея (URLы)', type: 'array', of: [{ type: 'url' }] })
  ]
})
