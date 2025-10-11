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
      name: 'labels',
      title: 'Текстовые метки',
      type: 'object',
      fields: [
        { name: 'signUpButton', title: 'Кнопка "Записаться" (RU)', type: 'string', initialValue: 'Записаться' },
        { name: 'signUpButton_en', title: 'Кнопка "Записаться" (EN)', type: 'string', initialValue: 'Sign Up' },
        { name: 'signUpButton_ro', title: 'Кнопка "Записаться" (RO)', type: 'string', initialValue: 'Înscrie-te' },
        { name: 'openMapButton', title: 'Кнопка "Открыть карту" (RU)', type: 'string', initialValue: 'Открыть на карте' },
        { name: 'openMapButton_en', title: 'Кнопка "Открыть карту" (EN)', type: 'string', initialValue: 'Open Map' },
        { name: 'openMapButton_ro', title: 'Кнопка "Открыть карту" (RO)', type: 'string', initialValue: 'Deschide harta' },
        { name: 'trainersTitle', title: 'Заголовок "Тренеры" (RU)', type: 'string', initialValue: 'Наши тренеры' },
        { name: 'trainersTitle_en', title: 'Заголовок "Тренеры" (EN)', type: 'string', initialValue: 'Our Trainers' },
        { name: 'trainersTitle_ro', title: 'Заголовок "Тренеры" (RO)', type: 'string', initialValue: 'Antrenorii noștri' },
        { name: 'galleryTitle', title: 'Заголовок "Галерея" (RU)', type: 'string', initialValue: 'Галерея' },
        { name: 'galleryTitle_en', title: 'Заголовок "Галерея" (EN)', type: 'string', initialValue: 'Gallery' },
        { name: 'galleryTitle_ro', title: 'Заголовок "Галерея" (RO)', type: 'string', initialValue: 'Galerie' },
        { name: 'contactTitle', title: 'Заголовок "Контакты" (RU)', type: 'string', initialValue: 'Контакты' },
        { name: 'contactTitle_en', title: 'Заголовок "Контакты" (EN)', type: 'string', initialValue: 'Contact' },
        { name: 'contactTitle_ro', title: 'Заголовок "Контакты" (RO)', type: 'string', initialValue: 'Contact' }
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
