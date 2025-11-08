import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicesPricing',
  title: 'Услуги — Секция цен',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' }),
    defineField({ name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' }),
    defineField({ name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' }),
    defineField({ name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' }),
    defineField({ name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' }),
    defineField({
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
    })
  ]
})
