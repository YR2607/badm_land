import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'trainer',
  title: 'Тренер',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя (RU)',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'name_en',
      title: 'Имя (EN)',
      type: 'string'
    }),
    defineField({
      name: 'name_ro',
      title: 'Имя (RO)',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    }),
    defineField({
      name: 'photo',
      title: 'Фотография',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'role',
      title: 'Должность',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({
      name: 'experience',
      title: 'Опыт работы (RU)',
      type: 'string'
    }),
    defineField({
      name: 'experience_en',
      title: 'Опыт работы (EN)',
      type: 'string'
    }),
    defineField({
      name: 'experience_ro',
      title: 'Опыт работы (RO)',
      type: 'string'
    }),
    defineField({
      name: 'specialization',
      title: 'Специализация (RU)',
      type: 'string'
    }),
    defineField({
      name: 'specialization_en',
      title: 'Специализация (EN)',
      type: 'string'
    }),
    defineField({
      name: 'specialization_ro',
      title: 'Специализация (RO)',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Описание (RU)',
      type: 'text'
    }),
    defineField({
      name: 'description_en',
      title: 'Описание (EN)',
      type: 'text'
    }),
    defineField({
      name: 'description_ro',
      title: 'Описание (RO)',
      type: 'text'
    }),
    defineField({
      name: 'achievements',
      title: 'Достижения (RU)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'achievements_en',
      title: 'Достижения (EN)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'achievements_ro',
      title: 'Достижения (RO)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'phone',
      title: 'Телефон',
      type: 'string'
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string'
    }),
    defineField({
      name: 'socialMedia',
      title: 'Социальные сети',
      type: 'object',
      fields: [
        { name: 'instagram', title: 'Instagram', type: 'url' },
        { name: 'facebook', title: 'Facebook', type: 'url' },
        { name: 'telegram', title: 'Telegram', type: 'string' }
      ]
    })
  ]
})
