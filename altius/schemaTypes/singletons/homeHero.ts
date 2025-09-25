import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'homeHero',
  title: 'Главная — Hero',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Hero секция',
      type: 'heroSection'
    })
  ]
})
