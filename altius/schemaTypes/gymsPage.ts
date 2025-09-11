import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gymsPage',
  title: 'Страница спортзалов',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'Спортзалы'
    }),
    defineField({
      name: 'hero',
      title: 'Hero секция',
      type: 'heroSection'
    }),
    defineField({
      name: 'introSection',
      title: 'Вводная секция',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'description', title: 'Описание', type: 'text' }
      ]
    }),
    defineField({
      name: 'gyms',
      title: 'Список залов',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'gym' }] }]
    }),
    defineField({
      name: 'seo',
      title: 'SEO настройки',
      type: 'object',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Ключевые слова', type: 'string' }
      ]
    })
  ]
})
