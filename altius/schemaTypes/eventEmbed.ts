import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eventEmbed',
  title: 'События (встраиваемые)',
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
      title: 'Ссылка на пост/видео Facebook или iframe HTML',
      type: 'text',
      rows: 3,
      description:
        'Вставьте ссылку на пост/видео Facebook (или код <iframe ...></iframe>) — мы корректно отобразим блок на сайте',
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
