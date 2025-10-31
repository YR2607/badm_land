import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutStrategy',
  title: 'О клубе — Стратегия развития',
  type: 'document',
  fieldsets: [
    { name: 'ru', title: 'Русский' },
    { name: 'en', title: 'English' },
    { name: 'ro', title: 'Română' },
  ],
  fields: [
    // Mission Section
    defineField({
      name: 'missionTitle',
      title: 'Заголовок миссии (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'missionTitle_en',
      title: 'Заголовок миссии (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'missionTitle_ro',
      title: 'Заголовок миссии (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'missionText',
      title: 'Текст миссии (RU)',
      type: 'text',
      fieldset: 'ru'
    }),
    defineField({
      name: 'missionText_en',
      title: 'Текст миссии (EN)',
      type: 'text',
      fieldset: 'en'
    }),
    defineField({
      name: 'missionText_ro',
      title: 'Текст миссии (RO)',
      type: 'text',
      fieldset: 'ro'
    }),
    defineField({
      name: 'currentStateTitle',
      title: 'Заголовок текущего состояния (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'currentStateTitle_en',
      title: 'Заголовок текущего состояния (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'currentStateTitle_ro',
      title: 'Заголовок текущего состояния (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'currentStateText',
      title: 'Текст текущего состояния (RU)',
      type: 'text',
      fieldset: 'ru'
    }),
    defineField({
      name: 'currentStateText_en',
      title: 'Текст текущего состояния (EN)',
      type: 'text',
      fieldset: 'en'
    }),
    defineField({
      name: 'currentStateText_ro',
      title: 'Текст текущего состояния (RO)',
      type: 'text',
      fieldset: 'ro'
    }),
    defineField({
      name: 'currentStatePoints',
      title: 'Пункты текущего состояния (RU)',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'ru'
    }),
    defineField({
      name: 'currentStatePoints_en',
      title: 'Пункты текущего состояния (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'en'
    }),
    defineField({
      name: 'currentStatePoints_ro',
      title: 'Пункты текущего состояния (RO)',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'ro'
    }),

    // Strategic Goals
    defineField({
      name: 'goalsTitle',
      title: 'Заголовок целей (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'goalsTitle_en',
      title: 'Заголовок целей (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'goalsTitle_ro',
      title: 'Заголовок целей (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'goals',
      title: 'Стратегические цели',
      type: 'array',
      of: [{
        type: 'object',
        name: 'goal',
        fieldsets: [
          { name: 'ru', title: 'Русский' },
          { name: 'en', title: 'English' },
          { name: 'ro', title: 'Română' },
        ],
        fields: [
          { name: 'icon', title: 'Эмодзи иконка', type: 'string' },
          { name: 'text', title: 'Текст (RU)', type: 'text', fieldset: 'ru' },
          { name: 'text_en', title: 'Текст (EN)', type: 'text', fieldset: 'en' },
          { name: 'text_ro', title: 'Текст (RO)', type: 'text', fieldset: 'ro' },
        ]
      }]
    }),

    // Marketing Section
    defineField({
      name: 'marketingTitle',
      title: 'Заголовок маркетинга (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'marketingTitle_en',
      title: 'Заголовок маркетинга (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'marketingTitle_ro',
      title: 'Заголовок маркетинга (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'marketingPoints',
      title: 'Пункты маркетинга (RU)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ru'
    }),
    defineField({
      name: 'marketingPoints_en',
      title: 'Пункты маркетинга (EN)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'en'
    }),
    defineField({
      name: 'marketingPoints_ro',
      title: 'Пункты маркетинга (RO)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ro'
    }),

    // Partnerships Section
    defineField({
      name: 'partnershipsTitle',
      title: 'Заголовок партнерств (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'partnershipsTitle_en',
      title: 'Заголовок партнерств (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'partnershipsTitle_ro',
      title: 'Заголовок партнерств (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'partnershipsPoints',
      title: 'Пункты партнерств (RU)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ru'
    }),
    defineField({
      name: 'partnershipsPoints_en',
      title: 'Пункты партнерств (EN)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'en'
    }),
    defineField({
      name: 'partnershipsPoints_ro',
      title: 'Пункты партнерств (RO)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ro'
    }),

    // Results Section
    defineField({
      name: 'resultsTitle',
      title: 'Заголовок результатов (RU)',
      type: 'string',
      fieldset: 'ru'
    }),
    defineField({
      name: 'resultsTitle_en',
      title: 'Заголовок результатов (EN)',
      type: 'string',
      fieldset: 'en'
    }),
    defineField({
      name: 'resultsTitle_ro',
      title: 'Заголовок результатов (RO)',
      type: 'string',
      fieldset: 'ro'
    }),
    defineField({
      name: 'resultsPoints',
      title: 'Ожидаемые результаты (RU)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ru'
    }),
    defineField({
      name: 'resultsPoints_en',
      title: 'Ожидаемые результаты (EN)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'en'
    }),
    defineField({
      name: 'resultsPoints_ro',
      title: 'Ожидаемые результаты (RO)',
      type: 'array',
      of: [{ type: 'text' }],
      fieldset: 'ro'
    }),
    defineField({
      name: 'closingText',
      title: 'Заключительный текст (RU)',
      type: 'text',
      fieldset: 'ru'
    }),
    defineField({
      name: 'closingText_en',
      title: 'Заключительный текст (EN)',
      type: 'text',
      fieldset: 'en'
    }),
    defineField({
      name: 'closingText_ro',
      title: 'Заключительный текст (RO)',
      type: 'text',
      fieldset: 'ro'
    }),
  ]
})
