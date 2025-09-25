import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'contactHero',
  title: 'Контакты — Hero',
  type: 'document',
  fields: [
    defineField({ name: 'content', title: 'Hero секция', type: 'heroSection' })
  ]
})
