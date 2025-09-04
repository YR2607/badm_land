import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'tournamentCategory',
  title: 'Tournament Category',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name', maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: 'photos', title: 'Photos', type: 'array', of: [{type: 'image', options: {hotspot: true}}]}),
    defineField({name: 'videos', title: 'Videos', type: 'array', of: [{type: 'file'}]}),
  ]
})
