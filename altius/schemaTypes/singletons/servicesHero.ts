import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'servicesHero',
  title: 'Услуги — Hero',
  type: 'document',
  fields: [
    defineField({ name: 'content', title: 'Hero секция', type: 'heroSection' })
  ]
})
