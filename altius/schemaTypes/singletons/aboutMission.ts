import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutMission',
  title: 'О клубе — Миссия и ценности',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({ name: 'mission', title: 'Миссия', type: 'text' }),
    defineField({
      name: 'values',
      title: 'Ценности',
      type: 'array',
      of: [{
        type: 'object',
        name: 'value',
        fields: [
          { name: 'title', title: 'Название', type: 'string' },
          { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
          { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
          { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
          { name: 'icon', title: 'Иконка', type: 'string' }
        ]
      }]
    })
  ]
})
