import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Страница контактов',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'Контакты'
    }),
    defineField({
      name: 'hero',
      title: 'Hero секция',
      type: 'heroSection'
    }),
    defineField({
      name: 'contactInfo',
      title: 'Контактная информация',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'description', title: 'Описание', type: 'text' },
        {
          name: 'contacts',
          title: 'Контакты',
          type: 'array',
          of: [{
            type: 'object',
            name: 'contact',
            fields: [
              { name: 'type', title: 'Тип', type: 'string', options: {
                list: ['phone', 'email', 'address', 'social']
              }},
              { name: 'label', title: 'Название', type: 'string' },
              { name: 'value', title: 'Значение', type: 'string' },
              { name: 'icon', title: 'Иконка', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'gymsContacts',
      title: 'Контакты залов',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        {
          name: 'gyms',
          title: 'Залы',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'gym' }] }]
        }
      ]
    }),
    defineField({
      name: 'contactForm',
      title: 'Форма обратной связи',
      type: 'object',
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        { name: 'submitButtonText', title: 'Текст кнопки отправки', type: 'string' },
        { name: 'successMessage', title: 'Сообщение об успехе', type: 'string' }
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
