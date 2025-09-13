import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'founder',
  title: 'Основатель',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'photo',
      title: 'Фотография',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'role',
      title: 'Должность',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'experience',
      title: 'Опыт работы',
      type: 'string'
    }),
    defineField({
      name: 'achievements',
      title: 'Достижения',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'quote',
      title: 'Цитата',
      type: 'text'
    }),
    defineField({
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Название', type: 'string' },
          { name: 'value', title: 'Значение', type: 'string' }
        ]
      }]
    })
  ]
})
