import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'trainer',
  title: 'Тренер',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя',
      type: 'string',
      validation: r => r.required()
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
      title: 'Опыт работы',
      type: 'string'
    }),
    defineField({
      name: 'specialization',
      title: 'Специализация',
      type: 'string'
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text'
    }),
    defineField({
      name: 'achievements',
      title: 'Достижения',
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
