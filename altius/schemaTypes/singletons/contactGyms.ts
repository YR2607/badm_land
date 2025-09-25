import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactGyms',
  title: 'Контакты — Залы',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({
      name: 'gyms',
      title: 'Залы',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gym' }] }]
    })
  ]
})
