import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Страница',
  type: 'document',
  description: 'Управляемые страницы сайта (home, about, services, contact)',
  fields: [
    defineField({ name: 'title', title: 'Название', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ name: 'heroTitle', title: 'Заголовок Hero', type: 'string' }),
    defineField({ name: 'heroSubtitle', title: 'Подзаголовок Hero', type: 'text' }),
    defineField({ name: 'heroImage', title: 'Изображение Hero', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'sections',
      title: 'Секции контента',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'textSection',
          title: 'Текстовая секция',
          fields: [
            { name: 'heading', title: 'Заголовок', type: 'string' },
            { name: 'body', title: 'Текст', type: 'array', of: [{ type: 'block' }] }
          ]
        }
      ]
    })
  ]
})
