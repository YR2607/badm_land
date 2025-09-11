import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'О клубе',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'О клубе'
    }),
    defineField({
      name: 'hero',
      title: 'Hero секция',
      type: 'heroSection'
    }),
    defineField({
      name: 'missionSection',
      title: 'Миссия и ценности',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'mission', title: 'Миссия', type: 'text' },
        {
          name: 'values',
          title: 'Ценности',
          type: 'array',
          of: [{
            type: 'object',
            name: 'value',
            fields: [
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { name: 'icon', title: 'Иконка', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'teamSection',
      title: 'Команда',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'team',
          title: 'Члены команды',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'trainer' }] }]
        }
      ]
    }),
    defineField({
      name: 'statsSection',
      title: 'Секция статистики',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        {
          name: 'stats',
          title: 'Статистика',
          type: 'array',
          of: [{
            type: 'object',
            name: 'stat',
            fields: [
              { name: 'number', title: 'Цифра', type: 'string' },
              { name: 'label', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { name: 'icon', title: 'Иконка', type: 'string' },
              { name: 'color', title: 'Цвет градиента', type: 'string' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'tabsSection',
      title: 'Секция с табами',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'tabs',
          title: 'Табы',
          type: 'array',
          of: [{
            type: 'object',
            name: 'tab',
            fields: [
              { name: 'key', title: 'Ключ', type: 'string' },
              { name: 'label', title: 'Название таба', type: 'string' },
              { name: 'icon', title: 'Иконка', type: 'string' },
              { name: 'title', title: 'Заголовок контента', type: 'string' },
              { name: 'content', title: 'Описание', type: 'text' },
              {
                name: 'values',
                title: 'Ценности (для миссии)',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Название', type: 'string' },
                    { name: 'description', title: 'Описание', type: 'text' },
                    { name: 'icon', title: 'Иконка', type: 'string' }
                  ]
                }]
              },
              {
                name: 'coaches',
                title: 'Тренеры (для таба тренеры)',
                type: 'array',
                of: [{ type: 'reference', to: [{ type: 'trainer' }] }]
              },
              {
                name: 'facilities',
                title: 'Залы (для инфраструктуры)',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Название', type: 'string' },
                    { name: 'description', title: 'Описание', type: 'text' },
                    { name: 'features', title: 'Особенности', type: 'array', of: [{ type: 'string' }] }
                  ]
                }]
              }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'historySection',
      title: 'Секция истории',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        { name: 'showAllByDefault', title: 'Показывать всю историю по умолчанию', type: 'boolean' },
        {
          name: 'timeline',
          title: 'События истории',
          type: 'array',
          of: [{
            type: 'object',
            name: 'timelineItem',
            fields: [
              { name: 'year', title: 'Период', type: 'string' },
              { name: 'title', title: 'Название события', type: 'string' },
              { name: 'text', title: 'Описание', type: 'text' }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'roadmapSection',
      title: 'Дорожная карта',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'roadmapItems',
          title: 'Пункты дорожной карты',
          type: 'array',
          of: [{
            type: 'object',
            name: 'roadmapItem',
            fields: [
              { name: 'tag', title: 'Период', type: 'string' },
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание', type: 'text' },
              { 
                name: 'status', 
                title: 'Статус', 
                type: 'string',
                options: {
                  list: [
                    { title: 'Выполнено', value: 'done' },
                    { title: 'В процессе', value: 'progress' },
                    { title: 'Запланировано', value: 'planned' }
                  ]
                }
              }
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'seo',
      title: 'SEO настройки',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'metaTitle', title: 'Meta Title', type: 'string' },
        { name: 'metaDescription', title: 'Meta Description', type: 'text' },
        { name: 'keywords', title: 'Ключевые слова', type: 'string' }
      ]
    })
  ]
})
