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
            .title('Турниры')
            .schemaType('gallerySection')
            .child(
              S.documentTypeList('gallerySection')
                .title('Турниры')
                .filter('_type == "gallerySection" && key == "tournaments"')
                .apiVersion('2023-05-03')
                .initialValueTemplates([
                  S.initialValueTemplateItem('gallerySection-tournaments')
                ])
            )
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

const postsByCategory = (S: any): any =>
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
          )
        ])
    )

const deskStructure = (S: any) =>
  S.list()
    .title('🏸 ALTIUS - Управление сайтом')
    .items([
      // Быстрые действия
      S.listItem()
        .title('⚡ Быстрые действия')
        .child(
          S.list()
            .title('Быстрые действия')
            .items([
              S.listItem()
                .title('📝 Создать новость')
                .child(
                  S.documentTypeList('post')
                    .title('Новости')
                    .filter('_type == "post"')
                ),
              S.listItem()
                .title('🖼️ Управление галереей')
                .child(
                  S.documentTypeList('galleryAlbum')
                    .title('Альбомы галереи')
                ),
              S.listItem()
                .title('🏸 Услуги (секция)')
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
                .title('🏆 Достижения')
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
                .title('📞 CTA секция')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .views([
                      S.view.form()
                        .title('Редактировать')
                        .icon(() => '✏️')
                    ])
                )
            ])
        ),

      S.divider(),

      // Страницы сайта
      S.listItem()
        .title('📄 Страницы сайта')
        .icon(() => '📄')
        .child(
          S.list()
            .title('Страницы')
            .items([
              S.listItem()
                .title('🏠 Главная страница')
                .icon(() => '🏠')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Главная страница')
                ),
              S.listItem()
                .title('ℹ️ О нас')
                .icon(() => 'ℹ️')
                .child(
                  S.document()
                    .schemaType('aboutPage')
                    .documentId('aboutPage')
                    .title('О нас')
                ),
              S.listItem()
                .title('📞 Контакты')
                .icon(() => '📞')
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                    .title('Контакты')
                ),
              S.listItem()
                .title('📞 Контактная информация')
                .child(
                  S.document()
                    .schemaType('contactPage')
                    .documentId('contactPage')
                    .views([
                      S.view.form().title('Редактировать').icon(() => '✏️')
                    ])
                )
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
              byTypeList(S, 'post', 'Все новости'),
              featuredPosts(S),
              postsByCategory(S),
              clubEmbeds(S),
              eventEmbeds(S)
            ])
        ),
      
      galleryGroup(S),
      
      S.listItem()
        .title('🏋️‍♂️ Тренеры')
        .child(S.documentTypeList('trainer').title('Тренеры')),
      
      S.divider(),
      
      // Настройки
      S.listItem().title('Старые страницы').child(S.documentTypeList('page').title('Страницы')),
      byTypeList(S, 'author', 'Авторы'),
      byTypeList(S, 'category', 'Категории')
    ])

export default deskStructure
