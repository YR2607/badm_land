import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'О клубе',
  type: 'document',
  groups: [
    { name: 'hero', title: '🎯 Hero секция' },
    { name: 'mission', title: '🎯 Миссия и ценности' },
    { name: 'team', title: '👥 Команда' },
    { name: 'stats', title: '📊 Статистика' },
    { name: 'tabs', title: '📋 Табы' },
    { name: 'history', title: '📅 История клуба' },
    { name: 'roadmap', title: '🗺️ Планы развития' },
    { name: 'seo', title: '🔍 SEO настройки' },
  ],
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
      type: 'heroSection',
      group: 'hero'
    }),
    defineField({
      name: 'missionSection',
      title: 'Миссия и ценности',
      type: 'object',
      group: 'mission',
      options: {
        collapsible: true,
        collapsed: false
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
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
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'title', title: 'Название', type: 'string' },
              { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
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
      group: 'team',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок', type: 'text' },
        {
          name: 'founder',
          title: 'Основатель',
          type: 'reference',
          to: [{ type: 'founder' }]
        },
        {
          name: 'leaders',
          title: 'Руководство (Президент, Управляющий и т.д.)',
          type: 'array',
          of: [{
            type: 'reference',
            to: [{ type: 'founder' }, { type: 'member' }]
          }]
        },
        {
          name: 'coaches',
          title: 'Тренеры',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'trainer' }] }]
        }
      ]
    }),
    defineField({
      name: 'statsSection',
      title: 'Секция статистики',
      type: 'object',
      group: 'stats',
      options: {
        collapsible: true,
        collapsed: false
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'title', title: 'Заголовок', type: 'string' },
        {
          name: 'stats',
          title: 'Статистика',
          type: 'array',
          of: [{
            type: 'object',
            name: 'stat',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'number', title: 'Цифра', type: 'string' },
              { name: 'description', title: 'Описание (RU)', type: 'string', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'string', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'string', fieldset: 'ro' },
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
      group: 'tabs',
      options: {
        collapsible: true,
        collapsed: false
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
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
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'key', title: 'Ключ', type: 'string' },
              { name: 'label', title: 'Название таба', type: 'string' },
              { name: 'icon', title: 'Иконка', type: 'string' },
              { name: 'title', title: 'Заголовок контента', type: 'string' },
              { name: 'content', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'content_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'content_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
              {
                name: 'values',
                title: 'Ценности (для миссии)',
                type: 'array',
                of: [{
                  type: 'object',
                  fields: [
                    { name: 'title', title: 'Название', type: 'string' },
                    { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
                    { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
                    { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
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
                  fieldsets: [
                    { name: 'ru', title: 'Русский' },
                    { name: 'en', title: 'English' },
                    { name: 'ro', title: 'Română' },
                  ],
                  fields: [
                    { name: 'name', title: 'Название', type: 'string' },
                    { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
                    { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
                    { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
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
      group: 'history',
      options: {
        collapsible: true,
        collapsed: false
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
        { name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' },
        { name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' },
        { name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' },
        { name: 'showAllByDefault', title: 'Показывать всю историю по умолчанию', type: 'boolean' },
        {
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
        }
      ]
    }),
    defineField({
      name: 'roadmapSection',
      title: 'Дорожная карта',
      type: 'object',
      group: 'roadmap',
      options: {
        collapsible: true,
        collapsed: false
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
        { name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text', fieldset: 'ru' },
        { name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text', fieldset: 'en' },
        { name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text', fieldset: 'ro' },
        {
          name: 'roadmapItems',
          title: 'Пункты дорожной карты',
          type: 'array',
          of: [{
            type: 'object',
            name: 'roadmapItem',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'tag', title: 'Тег', type: 'string' },
              { name: 'title', title: 'Заголовок (RU)', type: 'string', fieldset: 'ru' },
              { name: 'title_en', title: 'Заголовок (EN)', type: 'string', fieldset: 'en' },
              { name: 'title_ro', title: 'Заголовок (RO)', type: 'string', fieldset: 'ro' },
              { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
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
      group: 'seo',
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
