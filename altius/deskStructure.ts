const galleryGroup = (S: any) =>
  S.listItem()
    .title('Галерея')
    .child(
      S.list()
        .title('Галерея')
        .items([
          S.listItem()
            .title('Наш зал')
            .schemaType('gallerySection')
            .child(
              S.documentTypeList('gallerySection')
                .title('Наш зал')
                .filter('_type == "gallerySection" && key == "hall"')
                .apiVersion('2023-05-03')
                .initialValueTemplates([
                  S.initialValueTemplateItem('gallerySection-hall')
                ])
            ),
          S.listItem()
            .title('Наши тренера')
            .schemaType('gallerySection')
            .child(
              S.documentTypeList('gallerySection')
                .title('Наши тренера')
                .filter('_type == "gallerySection" && key == "coaches"')
                .apiVersion('2023-05-03')
                .initialValueTemplates([
                  S.initialValueTemplateItem('gallerySection-coaches')
                ])
            ),
          S.listItem()
            .title('Наши тренировки')
            .schemaType('gallerySection')
            .child(
              S.documentTypeList('gallerySection')
                .title('Наши тренировки')
                .filter('_type == "gallerySection" && key == "trainings"')
                .apiVersion('2023-05-03')
                .initialValueTemplates([
                  S.initialValueTemplateItem('gallerySection-trainings')
                ])
            ),
        ])
    )

const byTypeList = (S: any, type: string, title: string) =>
  S.listItem().title(title).child(
    S.documentTypeList(type).title(title)
  )

const draftsList = (S: any, type: string, title: string) =>
  S.listItem().title(title).child(
    S.documentList().title(title).filter('_type == $type && !_id in path("drafts.**") == false').params({ type }).apiVersion('2023-05-03')
  )

const featuredPosts = (S: any) =>
  S.listItem()
    .title('Избранные посты')
    .child(
      S.documentList()
        .title('Избранные посты')
        .filter('_type == "post" && featured == true')
        .apiVersion('2023-05-03')
    )

const clubEmbeds = (S: any) =>
  S.listItem()
    .title('Новости клуба (встраиваемые)')
    .child(
      S.documentTypeList('clubEmbed').title('Новости клуба (встраиваемые)')
    )

const eventEmbeds = (S: any) =>
  S.listItem()
    .title('События (встраиваемые)')
    .child(
      S.documentTypeList('eventEmbed').title('События (встраиваемые)')
    )

const postsByCategory = (S: any) =>
  S.listItem()
    .title('Новости по категориям')
    .child(
      S.list()
        .title('Категории')
        .items([
          S.listItem().title('Новости клуба').child(
            S.documentList().title('Новости клуба').filter('_type == "post" && (category->slug.current == "news" || category == "news")').apiVersion('2023-05-03')
          ),
          S.listItem().title('Мировые новости').child(
            S.documentList().title('Мировые новости').filter('_type == "post" && (category->slug.current == "world" || category == "world")').apiVersion('2023-05-03')
          ),
          S.listItem().title('События').child(
            S.documentList().title('События').filter('_type == "post" && (category->slug.current == "event" || category == "event")').apiVersion('2023-05-03')
          ),
        ])
    )

const deskStructure = (S: any) =>
  S.list()
    .title('Контент сайта')
    .items([
      // Основные страницы сайта
      S.listItem()
        .title('🏠 Главная страница')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .views([
              S.view.form()
                .title('Редактировать')
                .icon(() => '✏️')
            ])
        ),
      S.listItem()
        .title('ℹ️ О клубе')
        .child(
          S.list()
            .title('О клубе')
            .items([
              S.listItem()
                .title('🎯 Hero секция')
                .child(
                  S.document()
                    .schemaType('aboutHero')
                    .documentId('aboutHero')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('📊 Статистика')
                .child(
                  S.document()
                    .schemaType('aboutStats')
                    .documentId('aboutStats')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('📋 Табы (Миссия, Тренеры, Залы)')
                .child(
                  S.document()
                    .schemaType('aboutTabs')
                    .documentId('aboutTabs')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('📅 История клуба')
                .child(
                  S.document()
                    .schemaType('aboutHistory')
                    .documentId('aboutHistory')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('🗺️ Планы развития')
                .child(
                  S.document()
                    .schemaType('aboutRoadmap')
                    .documentId('aboutRoadmap')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('🔍 SEO настройки')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                ),
            ])
        ),
      S.listItem()
        .title('🏸 Услуги')
        .child(
          S.list()
            .title('Услуги')
            .items([
              S.listItem()
                .title('🎯 Hero секция')
                .child(
                  S.document()
                    .schemaType('servicesHero')
                    .documentId('servicesHero')
                    .views([
                      S.view.form().title('Редактировать').icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('🏸 Список услуг')
                .child(
                  S.document()
                    .schemaType('servicesList')
                    .documentId('servicesList')
                    .views([
                      S.view.form().title('Редактировать').icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('💰 Тарифы')
                .child(
                  S.document()
                    .schemaType('servicesPricing')
                    .documentId('servicesPricing')
                    .views([
                      S.view.form().title('Редактировать').icon(() => '✏️')
                    ])
                ),
              S.listItem()
                .title('🔍 SEO настройки')
                .child(
                  S.document()
                    .schemaType('servicesSeo')
                    .documentId('servicesSeo')
                    .views([
                      S.view.form().title('Редактировать').icon(() => '✏️')
                    ])
                ),
            ])
        ),
      S.listItem()
        .title('🏢 Спортзалы')
        .child(
          S.list()
            .title('Спортзалы')
            .items([
              S.listItem()
                .title('🎯 Hero секция')
                .child(
                  S.document()
                    .schemaType('gymsHero')
                    .documentId('gymsHero')
                ),
              S.divider(),
              S.listItem()
                .title('🏢 Управление залами')
                .child(S.documentTypeList('gym').title('Залы')),
              S.listItem()
                .title('🔍 SEO настройки')
                .child(
                  S.document()
                    .schemaType('gymsSeo')
                    .documentId('gymsSeo')
                ),
            ])
        ),
      S.listItem()
        .title('☎️ Контакты')
        .child(
          S.list()
            .title('Контакты')
            .items([
              S.listItem()
                .title('🎯 Hero секция')
                .child(
                  S.document()
                    .schemaType('contactHero')
                    .documentId('contactHero')
                ),
              S.listItem()
                .title('ℹ️ Информация')
                .child(
                  S.document()
                    .schemaType('contactInfo')
                    .documentId('contactInfo')
                ),
              S.listItem()
                .title('🏟️ Залы')
                .child(
                  S.document()
                    .schemaType('contactGyms')
                    .documentId('contactGyms')
                ),
              S.listItem()
                .title('🔍 SEO настройки')
                .child(
                  S.document()
                    .schemaType('contactSeo')
                    .documentId('contactSeo')
                ),
            ])
        ),
      S.divider(),
      
      // Медиа контент
      S.listItem()
        .title('📰 Новости и блог')
        .child(
          S.list()
            .title('Новости')
            .items([
              byTypeList(S, 'post', 'Все статьи'),
              S.divider(),
              clubEmbeds(S),
              eventEmbeds(S),
              featuredPosts(S),
              postsByCategory(S),
            ])
        ),
      galleryGroup(S),
      
      S.divider(),
      
      // Справочники
      S.listItem()
        .title('👥 Команда')
        .child(
          S.list()
            .title('Команда')
            .items([
              S.listItem()
                .title('👨‍🏫 Тренеры')
                .child(S.documentTypeList('trainer').title('Тренеры')),
              S.listItem()
                .title('👑 Основатель')
                .child(S.documentTypeList('founder').title('Основатель')),
            ])
        ),
      
      S.divider(),
      
      // Настройки
      S.listItem().title('Старые страницы').child(S.documentTypeList('page').title('Страницы')),
      byTypeList(S, 'author', 'Авторы'),
      byTypeList(S, 'category', 'Категории'),
    ])

export default deskStructure
