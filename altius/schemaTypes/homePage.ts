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
      title: 'Hero Section',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        {
          name: 'badge',
          title: 'Badge',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (e.g., Award, Trophy, Star)'
            },
            {
              name: 'text',
              title: 'Text',
              type: 'string'
            }
          ]
        },
        {
          name: 'title',
          title: 'Main Title',
          type: 'string'
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          description: 'Main description text below the title'
        },
        {
          name: 'statistics',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'string'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'servicesSection',
      title: 'Услуги секция',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
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
              { name: 'icon', title: 'Иконка (Users, User, Trophy, Clock)', type: 'string' },
              { name: 'color', title: 'Цвет градиента', type: 'string' },
              { 
                name: 'features', 
                title: 'Особенности', 
                type: 'array', 
                of: [{ type: 'string' }] 
              },
              { name: 'price', title: 'Цена', type: 'string' },
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
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'achievements',
          title: 'Достижения',
          type: 'array',
          of: [{
            type: 'object',
            name: 'achievement',
            fields: [
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'count', title: 'Цифра', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { name: 'icon', title: 'Иконка (Trophy, Medal, Users, Calendar)', type: 'string' },
              { name: 'color', title: 'Цвет градиента', type: 'string' }
            ]
          }]
        },
        {
          name: 'timeline',
          title: 'История развития',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок таймлайна', type: 'string' },
            {
              name: 'milestones',
              title: 'Этапы развития',
              type: 'array',
              of: [{
                type: 'object',
                name: 'milestone',
                fields: [
                  { name: 'year', title: 'Год', type: 'string' },
                  { name: 'title', title: 'Название', type: 'string' },
                  { name: 'description', title: 'Описание', type: 'text' }
                ]
              }]
            }
          ]
        },
        {
          name: 'callToAction',
          title: 'Призыв к действию',
          type: 'object',
          fields: [
            { name: 'text', title: 'Текст', type: 'string' },
            { name: 'icon', title: 'Иконка (Star, Trophy, Award)', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'newsSection',
      title: 'Секция новостей BWF',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        { name: 'enabled', title: 'Показывать секцию', type: 'boolean' }
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
