import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutTeam',
  title: 'О клубе — Команда',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Заголовок', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Подзаголовок', type: 'text' }),
    defineField({ name: 'founder', title: 'Основатель', type: 'reference', to: [{ type: 'founder' }] }),
    defineField({ name: 'coaches', title: 'Тренеры', type: 'array', of: [{ type: 'reference', to: [{ type: 'trainer' }] }] })
  ]
})
