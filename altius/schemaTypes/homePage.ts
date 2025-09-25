import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Главная страница',
  type: 'document',
  groups: [
    { name: 'hero', title: '🎯 Hero секция' },
    { name: 'services', title: '🏸 Услуги (секция)' },
    { name: 'achievements', title: '🏆 Достижения' },
    { name: 'news', title: '📰 Новости (BWF)' },
    { name: 'cta', title: '📞 CTA секция' },
    { name: 'seo', title: '🔍 SEO настройки' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Название страницы',
      type: 'string',
      initialValue: 'Главная страница'
    }),
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      group: 'hero',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fieldsets: [
        { name: 'ru', title: 'Русский' },
        { name: 'en', title: 'English' },
        { name: 'ro', title: 'Română' },
      ],
      fields: [
        {
          name: 'badge',
          title: 'Badge',
          type: 'object',
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name (e.g., Award, Trophy, Star)'
            },
            {
              name: 'text',
              title: 'Text (RU)',
              type: 'string',
              fieldset: 'ru'
            },
            {
              name: 'text_en',
              title: 'Text (EN)',
              type: 'string',
              fieldset: 'en'
            },
            {
              name: 'text_ro',
              title: 'Text (RO)',
              type: 'string',
              fieldset: 'ro'
            }
          ]
        },
        {
          name: 'title',
          title: 'Main Title (RU)',
          type: 'string',
          fieldset: 'ru'
        },
        {
          name: 'title_en',
          title: 'Main Title (EN)',
          type: 'string',
          fieldset: 'en'
        },
        {
          name: 'title_ro',
          title: 'Main Title (RO)',
          type: 'string',
          fieldset: 'ro'
        },
        {
          name: 'subtitle',
          title: 'Subtitle (RU)',
          type: 'string',
          fieldset: 'ru'
        },
        {
          name: 'subtitle_en',
          title: 'Subtitle (EN)',
          type: 'string',
          fieldset: 'en'
        },
        {
          name: 'subtitle_ro',
          title: 'Subtitle (RO)',
          type: 'string',
          fieldset: 'ro'
        },
        {
          name: 'description',
          title: 'Description (RU)',
          type: 'text',
          description: 'Main description text below the title'
        },
        {
          name: 'description_en',
          title: 'Description (EN)',
          type: 'text',
          fieldset: 'en'
        },
        {
          name: 'description_ro',
          title: 'Description (RO)',
          type: 'text',
          fieldset: 'ro'
        },
        {
          name: 'statistics',
          title: 'Statistics',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'number',
                  title: 'Number',
                  type: 'string'
                },
                {
                  name: 'description',
                  title: 'Description (RU)',
                  type: 'string',
                  fieldset: 'ru'
                },
                {
                  name: 'description_en',
                  title: 'Description (EN)',
                  type: 'string',
                  fieldset: 'en'
                },
                {
                  name: 'description_ro',
                  title: 'Description (RO)',
                  type: 'string',
                  fieldset: 'ro'
                }
              ]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'servicesSection',
      title: 'Услуги секция',
      type: 'object',
      group: 'services',
      options: {
        collapsible: true,
        collapsed: false,
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
          name: 'services',
          title: 'Услуги',
          type: 'array',
          of: [{
            type: 'object',
            name: 'service',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'title', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
              { name: 'title_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
              { name: 'title_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
              { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
              { name: 'icon', title: 'Иконка (Users, User, Trophy, Clock)', type: 'string' },
              { name: 'color', title: 'Цвет градиента', type: 'string' },
              { 
                name: 'features', 
                title: 'Особенности (RU)', 
                type: 'array', 
                of: [{ type: 'string' }],
                fieldset: 'ru'
              },
              { 
                name: 'features_en', 
                title: 'Особенности (EN)', 
                type: 'array', 
                of: [{ type: 'string' }],
                fieldset: 'en'
              },
              { 
                name: 'features_ro', 
                title: 'Особенности (RO)', 
                type: 'array', 
                of: [{ type: 'string' }],
                fieldset: 'ro'
              },
              { name: 'price', title: 'Цена (RU)', type: 'string' },
              { name: 'price_en', title: 'Цена (EN)', type: 'string' },
              { name: 'price_ro', title: 'Цена (RO)', type: 'string' },
            ]
          }]
        }
      ]
    }),
    defineField({
      name: 'achievementsSection',
      title: 'Достижения секция',
      type: 'object',
      group: 'achievements',
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
          name: 'achievements',
          title: 'Достижения',
          type: 'array',
          of: [{
            type: 'object',
            name: 'achievement',
            fieldsets: [
              { name: 'ru', title: 'Русский' },
              { name: 'en', title: 'English' },
              { name: 'ro', title: 'Română' },
            ],
            fields: [
              { name: 'title', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
              { name: 'title_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
              { name: 'title_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
              { name: 'count', title: 'Цифра', type: 'string' },
              { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
              { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
              { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' },
              { name: 'icon', title: 'Иконка (Trophy, Medal, Users, Calendar)', type: 'string' },
              { name: 'color', title: 'Цвет градиента', type: 'string' }
            ]
          }]
        },
        {
          name: 'timeline',
          title: 'История развития',
          type: 'object',
          fields: [
            { name: 'title', title: 'Заголовок таймлайна (RU)', type: 'string' },
            { name: 'title_en', title: 'Заголовок таймлайна (EN)', type: 'string' },
            { name: 'title_ro', title: 'Заголовок таймлайна (RO)', type: 'string' },
            {
              name: 'milestones',
              title: 'Этапы развития',
              type: 'array',
              of: [{
                type: 'object',
                name: 'milestone',
                fieldsets: [
                  { name: 'ru', title: 'Русский' },
                  { name: 'en', title: 'English' },
                  { name: 'ro', title: 'Română' },
                ],
                fields: [
                  { name: 'year', title: 'Год', type: 'string' },
                  { name: 'title', title: 'Название (RU)', type: 'string', fieldset: 'ru' },
                  { name: 'title_en', title: 'Название (EN)', type: 'string', fieldset: 'en' },
                  { name: 'title_ro', title: 'Название (RO)', type: 'string', fieldset: 'ro' },
                  { name: 'description', title: 'Описание (RU)', type: 'text', fieldset: 'ru' },
                  { name: 'description_en', title: 'Описание (EN)', type: 'text', fieldset: 'en' },
                  { name: 'description_ro', title: 'Описание (RO)', type: 'text', fieldset: 'ro' }
                ]
              }]
            }
          ]
        },
        {
          name: 'callToAction',
          title: 'Призыв к действию',
          type: 'object',
          group: 'cta',
          fields: [
            { name: 'text', title: 'Текст (RU)', type: 'string' },
            { name: 'text_en', title: 'Текст (EN)', type: 'string' },
            { name: 'text_ro', title: 'Текст (RO)', type: 'string' },
            { name: 'icon', title: 'Иконка (Star, Trophy, Award)', type: 'string' }
          ]
        }
      ]
    }),
    defineField({
      name: 'newsSection',
      title: 'Секция новостей BWF',
      type: 'object',
      group: 'news',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string' },
        { name: 'subtitle', title: 'Подзаголовок (RU)', type: 'text' },
        { name: 'subtitle_en', title: 'Подзаголовок (EN)', type: 'text' },
        { name: 'subtitle_ro', title: 'Подзаголовок (RO)', type: 'text' },
        { name: 'enabled', title: 'Показывать секцию', type: 'boolean' }
      ]
    }),
    defineField({
      name: 'ctaSection',
      title: 'CTA секция',
      type: 'object',
      group: 'cta',
      options: {
        collapsible: true,
        collapsed: false
      },
      fields: [
        { name: 'title', title: 'Заголовок (RU)', type: 'string' },
        { name: 'title_en', title: 'Заголовок (EN)', type: 'string' },
        { name: 'title_ro', title: 'Заголовок (RO)', type: 'string' },
        { name: 'description', title: 'Описание (RU)', type: 'text' },
        { name: 'description_en', title: 'Описание (EN)', type: 'text' },
        { name: 'description_ro', title: 'Описание (RO)', type: 'text' },
        { name: 'buttonText', title: 'Текст кнопки (RU)', type: 'string' },
        { name: 'buttonText_en', title: 'Текст кнопки (EN)', type: 'string' },
        { name: 'buttonText_ro', title: 'Текст кнопки (RO)', type: 'string' },
        { name: 'buttonLink', title: 'Ссылка кнопки', type: 'string' }
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
