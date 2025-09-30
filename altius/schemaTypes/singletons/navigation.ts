import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navigation',
  title: 'Навигация',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Пункты меню',
      type: 'array',
      of: [{
        type: 'object',
        name: 'menuItem',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'key', title: 'Ключ (для роутинга)', type: 'string' },
          { name: 'label', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
          { name: 'label_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
          { name: 'label_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
          { name: 'path', title: 'Путь (URL)', type: 'string' },
          { name: 'order', title: 'Порядок', type: 'number' }
        ]
      }]
    })
  ]
})
