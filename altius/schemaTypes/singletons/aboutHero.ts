import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutHero',
  title: 'О клубе — Hero',
  type: 'document',
  fields: [
    defineField({ name: 'content', title: 'Hero секция', type: 'heroSection' })
  ]
})
