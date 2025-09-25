import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactInfo',
  title: 'Контакты — Информация',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({ name: 'description', title: 'Описание', type: 'text' }),
    defineField({
      name: 'contacts',
      title: 'Контакты',
      type: 'array',
      of: [{
        type: 'object',
        name: 'contact',
        fields: [
          { name: 'type', title: 'Тип', type: 'string', options: { list: ['phone','email','address','social'] } },
          { name: 'label', title: 'Название', type: 'string' },
          { name: 'value', title: 'Значение', type: 'string' },
          { name: 'icon', title: 'Иконка', type: 'string' }
        ]
      }]
    })
  ]
})
