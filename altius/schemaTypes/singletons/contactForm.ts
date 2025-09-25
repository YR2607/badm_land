import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactForm',
  title: 'Контакты — Форма',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок', type: 'text' }),
    defineField({ name: 'submitButtonText', title: 'Текст кнопки', type: 'string' }),
    defineField({ name: 'successMessage', title: 'Сообщение об успехе', type: 'string' })
  ]
})
