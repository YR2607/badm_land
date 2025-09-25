import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homeCta',
  title: 'Главная — CTA секция',
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
    defineField({ name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' }),
    defineField({ name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' }),
    defineField({ name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' }),
    defineField({ name: 'buttonText', title: 'Текст кнопки (RU)', type: 'string', fieldset: 'ru' }),
    defineField({ name: 'buttonText_en', title: 'Текст кнопки (EN)', type: 'string', fieldset: 'en' }),
    defineField({ name: 'buttonText_ro', title: 'Текст кнопки (RO)', type: 'string', fieldset: 'ro' }),
    defineField({ name: 'buttonLink', title: 'Ссылка кнопки', type: 'string' })
  ]
})
