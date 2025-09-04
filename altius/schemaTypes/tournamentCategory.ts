import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tournamentCategory',
  title: 'Турнир (категория)',
  type: 'document',
  description: 'Категория турнира (например, Altius Open 2024). Внутри фото и видео.',
  fields: [
    defineField({name: 'name', title: 'Название', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: 'photos', title: 'Фотографии', type: 'array', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'videos', title: 'Видео', type: 'array', of: [{type: 'file'}]}),
  ]
})
