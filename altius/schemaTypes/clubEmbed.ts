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
      name: 'kind',
      title: 'Тип материала',
      type: 'string',
      initialValue: 'news',
      options: {
        list: [
          { title: 'Новость клуба', value: 'news' },
          { title: 'Событие', value: 'event' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'datetime',
      options: { timeStep: 1 },
      description: 'Дата/время публикации материала (используется для сортировки).',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Обложка (загрузить изображение)',
      type: 'image',
      options: { hotspot: true },
      description: 'Загрузите изображение обложки с компьютера. Оно всегда будет показываться на сайте.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverAlt',
      title: 'Alt-текст для обложки',
      type: 'string',
      validation: (r) => r.min(0).max(140),
    }),
    defineField({
      name: 'url',
      title: 'Ссылка на пост (опционально) или iframe HTML',
      type: 'text',
      rows: 3,
      description:
        'Опционально: вставьте ссылку на пост/видео (или <iframe ...></iframe>), чтобы при клике открывался оригинал в Facebook/другом источнике.',
    }),
    defineField({
      name: 'coverUrl',
      title: 'Обложка по ссылке (URL изображения, опционально)',
      type: 'url',
      description: 'Необязательно. Будет использовано только если загруженная обложка отсутствует.',
      validation: (r) => r.uri({ allowRelative: false, scheme: ['http','https'] }),
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    }),
  ],
})

