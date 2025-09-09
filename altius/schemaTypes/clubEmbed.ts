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
      title: 'Дата публикации (как на Facebook)',
      type: 'datetime',
      options: { timeStep: 1 },
      description: 'Укажите дату/время публикации поста на Facebook для правильной сортировки и отображения.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Ссылка на пост Facebook или iframe HTML',
      type: 'text',
      rows: 3,
      description:
        'Вставьте полную ссылку на пост/видео Facebook (или код <iframe ...></iframe>) — мы корректно отобразим блок на сайте',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'cover',
      title: 'Обложка (кастомное изображение)',
      type: 'image',
      options: { hotspot: true },
      description: 'Опционально: загрузите обложку, если картинка не подтягивается автоматически из Facebook',
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    }),
  ],
})

