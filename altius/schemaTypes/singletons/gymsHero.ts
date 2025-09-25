import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gymsHero',
  title: 'Залы — Hero',
  type: 'document',
  fields: [
    defineField({ name: 'content', title: 'Hero секция', type: 'heroSection' })
  ]
})
