import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'heroSection',
  title: 'Hero секция',
  type: 'object',
  description: 'Главная секция страницы с заголовком и статистикой',
  fields: [
    defineField({
      name: 'badge',
      title: 'Бейдж',
      type: 'object',
      fields: [
        { name: 'icon', title: 'Иконка', type: 'string' },
        { name: 'text', title: 'Текст', type: 'string' }
      ]
    }),
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Подзаголовок',
      type: 'text'
    }),
    defineField({
      name: 'statistics',
      title: 'Статистика',
      type: 'array',
      of: [{
        type: 'object',
        name: 'statistic',
        title: 'Статистика',
        fields: [
          { name: 'number', title: 'Цифра', type: 'string' },
          { name: 'description', title: 'Описание', type: 'string' }
        ]
      }]
    })
  ]
})
