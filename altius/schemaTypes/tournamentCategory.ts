import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tournamentCategory',
  title: 'Турнир (категория)',
  type: 'document',
  description: 'Категория турнира (например, Altius Open 2024). Внутри фото и видео.',
  fields: [
    defineField({name: 'name', title: 'Название', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: 'year', title: 'Год', type: 'number', description: 'Например, 2024'}),
    defineField({name: 'tags', title: 'Теги', type: 'array', of: [{type: 'string'}], description: 'Ключевые слова для фильтра'}),
    defineField({name: 'featured', title: 'Избранное', type: 'boolean'}),
    defineField({name: 'cover', title: 'Обложка', type: 'image', options: {hotspot: true}, description: 'Если не указана — возьмётся первое фото'}),
    defineField({
      name: 'photos', title: 'Фотографии', type: 'array', options: { layout: 'grid', sortable: true },
      of: [{type: 'image', options: {hotspot: true}}]
    }),
    defineField({
      name: 'videos', title: 'Видео', type: 'array', options: { layout: 'grid', sortable: true },
      of: [{type: 'file'}]
    }),
  ]
})
