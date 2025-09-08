import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'clubEmbed',
  title: 'Новости клуба (встраиваемые)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Заголовок',
      type: 'string',
      validation: (r) => r.required().min(3),
    }),
    defineField({
      name: 'url',
      title: 'Ссылка на пост Facebook или iframe HTML',
      type: 'text',
      rows: 3,
      description:
        'Вставьте полную ссылку на пост (например, https://www.facebook.com/permalink.php?story_fbid=...&id=...) или код <iframe ...></iframe>',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    }),
  ],
})
