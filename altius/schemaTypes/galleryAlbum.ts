import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'galleryAlbum',
  title: 'Альбом галереи',
  type: 'document',
  description: 'Подраздел внутри галереи (альбом фотографий) для конкретного раздела',
  fields: [
    defineField({ name: 'title', title: 'Название альбома', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: r => r.required() }),
    defineField({ 
      name: 'section', 
      title: 'Раздел', 
      type: 'reference', 
      to: [{ type: 'gallerySection' }],
      description: 'К какому разделу относится альбом (Наш зал, Наши тренера, Наши тренировки)',
      validation: r => r.required()
    }),
    defineField({ name: 'cover', title: 'Обложка (опционально)', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'images', title: 'Фотографии', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] })
  ]
})
