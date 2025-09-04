import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Автор',
  type: 'document',
  description: 'Авторы новостей/постов',
  fields: [
    defineField({ name: 'name', title: 'Имя', type: 'string', validation: r => r.required() }),
    defineField({ name: 'photo', title: 'Фото', type: 'image', options: { hotspot: true } }),
  ]
})
