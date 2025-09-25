import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homeAbout',
  title: 'Главная — О клубе (секция)',
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
    defineField({ name: 'content', title: 'Описание (RU)', type: 'array', of: [{ type: 'block' }], fieldset: 'ru' }),
    defineField({ name: 'content_en', title: 'Описание (EN)', type: 'array', of: [{ type: 'block' }], fieldset: 'en' }),
    defineField({ name: 'content_ro', title: 'Описание (RO)', type: 'array', of: [{ type: 'block' }], fieldset: 'ro' })
  ]
})
