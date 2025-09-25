import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'servicesPage',
  title: 'Страница услуг',
  type: 'document',
  groups: [
    { name: 'hero', title: '🎯 Hero секция' },
    { name: 'services', title: '🏸 Секция услуг' },
    { name: 'pricing', title: '💰 Секция цен' },
    { name: 'seo', title: '🔍 SEO настройки' },
  ],
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
      type: 'heroSection',
      group: 'hero'
    }),
    defineField({
      name: 'servicesSection',
      title: 'Секция услуг',
      type: 'object',
      group: 'services',
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
        { name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' },
        { name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' },
        { name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' },
        {
          name: 'services',
          title: 'Услуги',
          type: 'array',
          of: [{
            type: 'object',
            name: 'service',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'title', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
              { name: 'title_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
              { name: 'title_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
              { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
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
      group: 'pricing',
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
        { name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' },
        { name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' },
        { name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' },
        {
          name: 'pricingPlans',
          title: 'Тарифные планы',
          type: 'array',
          of: [{
            type: 'object',
            name: 'pricingPlan',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'name', title: 'Название плана (RU)', type: 'string', fieldset: 'ru' },
              { name: 'name_en', title: 'Название плана (EN)', type: 'string', fieldset: 'en' },
              { name: 'name_ro', title: 'Название плана (RO)', type: 'string', fieldset: 'ro' },
              { name: 'price', title: 'Цена', type: 'string' },
              { name: 'period', title: 'Период', type: 'string' },
              { name: 'features', title: 'Включено (RU)', type: 'array', of: [{ type: 'string' }], fieldset: 'ru' },
              { name: 'features_en', title: 'Включено (EN)', type: 'array', of: [{ type: 'string' }], fieldset: 'en' },
              { name: 'features_ro', title: 'Включено (RO)', type: 'array', of: [{ type: 'string' }], fieldset: 'ro' },
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
      group: 'seo',
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Ключевые слова', type: 'string' }
      ]
    })
  ]
})
