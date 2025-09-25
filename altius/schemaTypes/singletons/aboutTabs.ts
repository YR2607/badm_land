import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutTabs',
  title: 'О клубе — Табы',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок', type: 'text' }),
    defineField({
      name: 'tabs',
      title: 'Табы',
      type: 'array',
      of: [{
        type: 'object',
        name: 'tab',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'key', title: 'Ключ', type: 'string' },
          { name: 'label', title: 'Название таба', type: 'string' },
          { name: 'icon', title: 'Иконка', type: 'string' },
          { name: 'title', title: 'Заголовок контента', type: 'string' },
          { name: 'content', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
          { name: 'content_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
          { name: 'content_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
        ]
      }]
    })
  ]
})
