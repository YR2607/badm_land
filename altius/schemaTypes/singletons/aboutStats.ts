import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutStats',
  title: 'О клубе — Статистика',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      of: [{
        type: 'object',
        name: 'stat',
        fields: [
          { name: 'number', title: 'Цифра', type: 'string' },
          { name: 'description', title: 'Описание (RU)', type: 'string', fieldset: 'ru' },
          { name: 'description_en', title: 'Описание (EN)', type: 'string', fieldset: 'en' },
          { name: 'description_ro', title: 'Описание (RO)', type: 'string', fieldset: 'ro' },
          { name: 'icon', title: 'Иконка', type: 'string' },
          { name: 'color', title: 'Цвет градиента', type: 'string' }
        ]
      }]
    })
  ]
})
