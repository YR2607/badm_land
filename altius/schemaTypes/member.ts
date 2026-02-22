import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'member',
  title: 'Участник команды',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Имя (RU)',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({ name: 'name_en', title: 'Имя (EN)', type: 'string' }),
    defineField({ name: 'name_ro', title: 'Имя (RO)', type: 'string' }),
    defineField({
      name: 'photo',
      title: 'Фотография',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'role',
      title: 'Должность (RU)',
      type: 'string',
      validation: r => r.required()
    }),
    defineField({ name: 'role_en', title: 'Должность (EN)', type: 'string' }),
    defineField({ name: 'role_ro', title: 'Должность (RO)', type: 'string' }),
    defineField({
      name: 'experience',
      title: 'Опыт работы (RU)',
      type: 'string'
    }),
    defineField({ name: 'experience_en', title: 'Опыт работы (EN)', type: 'string' }),
    defineField({ name: 'experience_ro', title: 'Опыт работы (RO)', type: 'string' }),
    defineField({
      name: 'achievements',
      title: 'Достижения (RU)',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({ name: 'achievements_en', title: 'Достижения (EN)', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'achievements_ro', title: 'Достижения (RO)', type: 'array', of: [{ type: 'string' }] }),
    defineField({
      name: 'description',
      title: 'Описание (RU)',
      type: 'array',
      of: [{ type: 'block' }]
    }),
    defineField({ name: 'description_en', title: 'Описание (EN)', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'description_ro', title: 'Описание (RO)', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'quote',
      title: 'Цитата (RU)',
      type: 'text'
    }),
    defineField({ name: 'quote_en', title: 'Цитата (EN)', type: 'text' }),
    defineField({ name: 'quote_ro', title: 'Цитата (RO)', type: 'text' }),
    defineField({
      name: 'stats',
      title: 'Статистика',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Название (RU)', type: 'string' },
          { name: 'label_en', title: 'Название (EN)', type: 'string' },
          { name: 'label_ro', title: 'Название (RO)', type: 'string' },
          { name: 'value', title: 'Значение', type: 'string' }
        ]
      }]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'photo'
    }
  }
})
