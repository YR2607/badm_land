import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicesList',
  title: 'Услуги — Список услуг',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' }),
    defineField({ name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' }),
    defineField({ name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' }),
    defineField({ name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' }),
    defineField({ name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' }),
    defineField({
      name: 'services',
      title: 'Услуги',
      type: 'array',
      of: [{
        type: 'object',
        name: 'service',
        fields: [
          { name: 'title', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
          { name: 'title_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
          { name: 'title_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
          { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
          { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
          { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
          { name: 'features', title: 'Особенности', type: 'array', of: [{ type: 'string' }] },
          { name: 'icon', title: 'Иконка', type: 'string' }
        ]
      }]
    })
  ]
})
