import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'Главная страница'
    }),
    defineField({
      name: 'hero',
      title: 'Hero секция',
      type: 'heroSection'
    }),
    defineField({
      name: 'aboutSection',
      title: 'Секция "О клубе"',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'description', title: 'Описание', type: 'text' },
        { name: 'image', title: 'Изображение', type: 'image' }
      ]
    }),
    defineField({
      name: 'servicesSection',
      title: 'Услуги секция',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'services',
          title: 'Услуги',
          type: 'array',
          of: [{
            type: 'object',
            name: 'service',
            fields: [
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { name: 'icon', title: 'Иконка', type: 'string' },
              { name: 'price', title: 'Цена', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'achievementsSection',
      title: 'Достижения секция',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        {
          name: 'achievements',
          title: 'Достижения',
          type: 'array',
          of: [{
            type: 'object',
            name: 'achievement',
            fields: [
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { name: 'icon', title: 'Иконка', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'ctaSection',
      title: 'CTA секция',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'description', title: 'Описание', type: 'text' },
        { name: 'buttonText', title: 'Текст кнопки', type: 'string' },
        { name: 'buttonLink', title: 'Ссылка кнопки', type: 'string' }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO настройки',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Ключевые слова', type: 'string' }
      ]
    })
  ]
})
