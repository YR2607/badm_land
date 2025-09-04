import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'title', maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text'}),
    defineField({name: 'content', title: 'Content', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'date', title: 'Date', type: 'datetime', validation: (r) => r.required()}),
    defineField({name: 'category', title: 'Category', type: 'string', options: {list: [
      {title: 'Клубные новости', value: 'news'},
      {title: 'Мировые новости', value: 'world'},
      {title: 'Событие', value: 'event'},
    ]}, validation: (r) => r.required()}),
    defineField({name: 'author', title: 'Author', type: 'string'}),
    defineField({name: 'featured', title: 'Featured', type: 'boolean'}),
  ]
})
