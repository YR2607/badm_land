import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gymsSeo',
  title: 'Залы — SEO настройки',
  type: 'document',
  fields: [
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text' }),
    defineField({ name: 'keywords', title: 'Ключевые слова', type: 'string' })
  ]
})
