import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutHistory',
  title: 'О клубе — История',
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
    defineField({ name: 'showAllByDefault', title: 'Показывать всю историю по умолчанию', type: 'boolean' }),
    defineField({
      name: 'timeline',
      title: 'События истории',
      type: 'array',
      of: [{
        type: 'object',
        name: 'timelineItem',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'year', title: 'Год', type: 'string' },
          { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
          { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
          { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
          { name: 'text', title: 'Текст (RU)', type: 'text', fieldset: 'ru' },
          { name: 'text_en', title: 'Текст (EN)', type: 'text', fieldset: 'en' },
          { name: 'text_ro', title: 'Текст (RO)', type: 'text', fieldset: 'ro' }
        ]
      }]
    })
  ]
})
