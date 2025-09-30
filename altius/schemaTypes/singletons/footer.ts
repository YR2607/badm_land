import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footer',
  title: 'Футер',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({
      name: 'description',
      title: 'Описание (RU)',
      type: 'text',
      fieldset: 'ru'
    }),
    defineField({
      name: 'description_en',
      title: 'Описание (EN)',
      type: 'text',
      fieldset: 'en'
    }),
    defineField({
      name: 'description_ro',
      title: 'Описание (RO)',
      type: 'text',
      fieldset: 'ro'
    }),
    defineField({
      name: 'quickLinks',
      title: 'Быстрые ссылки',
      type: 'array',
      of: [{
        type: 'object',
        name: 'link',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'label', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
          { name: 'label_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
          { name: 'label_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
          { name: 'path', title: 'Путь (URL)', type: 'string' }
        ]
      }]
    }),
    defineField({
      name: 'socialMedia',
      title: 'Социальные сети',
      type: 'object',
      fields: [
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'telegram', title: 'Telegram', type: 'string' },
        { name: 'youtube', title: 'YouTube', type: 'url' }
      ]
    }),
    defineField({
      name: 'contact',
      title: 'Контактная информация',
      type: 'object',
      fields: [
        { name: 'address', title: 'Адрес', type: 'text' },
        { name: 'phone', title: 'Телефон', type: 'string' },
        { name: 'email', title: 'Email', type: 'string' },
        { name: 'workingHours', title: 'Часы работы (RU)', type: 'text' },
        { name: 'workingHours_en', title: 'Часы работы (EN)', type: 'text' },
        { name: 'workingHours_ro', title: 'Часы работы (RO)', type: 'text' }
      ]
    })
  ]
})
