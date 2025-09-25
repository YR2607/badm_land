import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero секция',
  type: 'object',
  description: 'Главная секция страницы с заголовком и статистикой',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({
      name: 'badge',
      title: 'Бейдж',
      type: 'object',
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'icon', title: 'Иконка', type: 'string' },
        { name: 'text', title: 'Текст (RU)', type: 'string', fieldset: 'ru' },
        { name: 'text_en', title: 'Текст (EN)', type: 'string', fieldset: 'en' },
        { name: 'text_ro', title: 'Текст (RO)', type: 'string', fieldset: 'ro' }
      ]
    }),
    defineField({
      name: 'title',
      title: 'Заголовок (RU)',
      type: 'string',
      fieldset: 'ru',
      validation: r => r.required()
    }),
    defineField({
      name: 'title_en',
      title: 'Заголовок (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'title_ro',
      title: 'Заголовок (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'subtitle',
      title: 'Подзаголовок (RU)',
      type: 'text',
      fieldset: 'ru'
    }),
    defineField({
      name: 'subtitle_en',
      title: 'Подзаголовок (EN)',
      type: 'text',
      fieldset: 'en'
    }),
    defineField({
      name: 'subtitle_ro',
      title: 'Подзаголовок (RO)',
      type: 'text',
      fieldset: 'ro'
    }),
    defineField({
      name: 'statistics',
      title: 'Статистика',
      type: 'array',
      of: [{
        type: 'object',
        name: 'statistic',
        title: 'Статистика',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'number', title: 'Цифра', type: 'string' },
          { name: 'description', title: 'Описание (RU)', type: 'string', fieldset: 'ru' },
          { name: 'description_en', title: 'Описание (EN)', type: 'string', fieldset: 'en' },
          { name: 'description_ro', title: 'Описание (RO)', type: 'string', fieldset: 'ro' }
        ]
      }]
    })
  ]
})
