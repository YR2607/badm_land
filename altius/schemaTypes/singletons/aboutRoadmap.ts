import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutRoadmap',
  title: 'О клубе — Планы развития',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' }),
    defineField({ name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' }),
    defineField({ name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' }),
    defineField({ name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' }),
    defineField({ name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' }),
    defineField({
      name: 'roadmapItems',
      title: 'Пункты дорожной карты',
      type: 'array',
      of: [{
        type: 'object',
        name: 'roadmapItem',
        fields: [
          { name: 'tag', title: 'Тег', type: 'string' },
          { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
          { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
          { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
          { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
          { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
          { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
          { name: 'status', title: 'Статус', type: 'string', options: { list: [
            { title: 'Выполнено', value: 'done' },
            { title: 'В процессе', value: 'progress' },
            { title: 'Запланировано', value: 'planned' },
          ]}}
        ]
      }]
    })
  ]
})
