import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'post',
  title: 'Пост/Новость',
  type: 'document',
  description: 'Новости клуба, мировые новости и события',
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: (r) => r.required() }),
    defineField({ name: 'excerpt', title: 'Короткое описание', type: 'text' }),
    defineField({ name: 'content', title: 'Контент', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'image', title: 'Изображение', type: 'image', options: { hotspot: true }, validation: r => r.required() }),
    defineField({ name: 'date', title: 'Дата', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: 'category', title: 'Категория', type: 'reference', to: [{ type: 'category' }], validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Автор', type: 'reference', to: [{ type: 'author' }] }),
    defineField({ name: 'featured', title: 'Избранное', type: 'boolean' }),
    defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' }),
    defineField({ name: 'seoDescription', title: 'SEO Description', type: 'text' }),
  ]
})
