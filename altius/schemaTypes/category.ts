import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'category',
  title: 'Категория',
  type: 'document',
  description: 'Категория новостей (news/world/event)',
  fields: [
    defineField({ name: 'title', title: 'Название', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 64 }, validation: r => r.required() }),
    defineField({ name: 'color', title: 'Цвет (опционально)', type: 'string' }),
  ]
})
