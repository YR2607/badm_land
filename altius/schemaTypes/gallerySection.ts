import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gallerySection',
  title: 'Раздел галереи',
  type: 'document',
  description: 'Секция галереи (Наш зал, Наши тренера, Наши тренировки)',
  fields: [
    defineField({
      name: 'key',
      title: 'Раздел',
      type: 'string',
      options: {
        list: [
          { title: 'Наш зал', value: 'hall' },
          { title: 'Наши тренера', value: 'coaches' },
          { title: 'Наши тренировки', value: 'trainings' },
        ]
      },
      description: 'Выберите раздел — остальное настроится автоматически',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'title',
      title: 'Название (опционально)',
      type: 'string',
      description: 'Можно оставить пустым — на сайте используется выбранный раздел'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 64},
      hidden: true,
    }),
    defineField({
      name: 'images',
      title: 'Изображения',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      description: 'Фотографии для этой секции галереи'
    })
  ]
})
