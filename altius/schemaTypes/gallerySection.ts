import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'gallerySection',
  title: 'Раздел галереи',
  type: 'document',
  description: 'Секция галереи (Наш зал, Наши тренера, Наши тренировки)',
  fields: [
    defineField({
      name: 'title',
      title: 'Название',
      type: 'string',
      description: 'Человекочитаемое название секции',
      validation: (r) => r.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 64},
      description: 'Технический идентификатор секции (например, hall/coaches/trainings)',
      validation: (r) => r.required()
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
