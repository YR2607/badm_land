import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Страница услуг',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'Услуги'
    }),
    defineField({
      name: 'hero',
      title: 'Hero секция',
      type: 'heroSection'
    }),
    defineField({
      name: 'servicesSection',
      title: 'Секция услуг',
      type: 'object',
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
              { name: 'features', title: 'Особенности', type: 'array', of: [{ type: 'string' }] },
              { name: 'icon', title: 'Иконка', type: 'string' },
              { name: 'price', title: 'Цена', type: 'string' },
              { name: 'duration', title: 'Длительность', type: 'string' },
              { name: 'ageGroup', title: 'Возрастная группа', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'pricingSection',
      title: 'Секция цен',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'pricingPlans',
          title: 'Тарифные планы',
          type: 'array',
          of: [{
            type: 'object',
            name: 'pricingPlan',
            fields: [
              { name: 'name', title: 'Название плана', type: 'string' },
              { name: 'price', title: 'Цена', type: 'string' },
              { name: 'period', title: 'Период', type: 'string' },
              { name: 'features', title: 'Включено', type: 'array', of: [{ type: 'string' }] },
              { name: 'popular', title: 'Популярный план', type: 'boolean' }
            ]
          }]
        }
      ]
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
