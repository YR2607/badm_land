const singleton = (S: any, schemaType: string, documentId: string, title: string, icon?: string) =>
  S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(schemaType)
        .documentId(documentId)
        .views([
          S.view.form()
            .title('Редактировать')
            .icon(() => '✏️')
        ])
    )

const galleryGroup = (S: any) =>
  S.listItem()
    .title('🖼️ Галерея')
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
            ),
          S.divider(),
          S.listItem()
            .title('🏆 Турниры')
            .schemaType('tournamentCategory')
            .child(
              S.documentTypeList('tournamentCategory')
                .title('Турниры')
                .apiVersion('2023-05-03')
            ),
        ])
    )

const deskStructure = (S: any) =>
  S.list()
    .title('Контент сайта')
    .items([
      // ─── Основные страницы ───
      S.listItem()
        .title('🏠 Главная')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
            .views([S.view.form().title('Редактировать').icon(() => '✏️')])
        ),

      S.listItem()
        .title('ℹ️ О клубе')
        .child(
          S.list()
            .title('О клубе')
            .items([
              singleton(S, 'aboutHero', 'aboutHero', '🎯 Hero секция'),
              singleton(S, 'aboutTabs', 'aboutTabs', '📋 Табы (Миссия, Тренеры, Залы)'),
              singleton(S, 'aboutStrategy', 'aboutStrategy', '📊 Стратегия'),
              singleton(S, 'aboutRoadmap', 'aboutRoadmap', '�️ Планы развития'),
              singleton(S, 'aboutPage', 'aboutPage', '🔍 SEO + Доп. настройки'),
            ])
        ),

      S.listItem()
        .title('🏸 Услуги')
        .child(
          S.list()
            .title('Услуги')
            .items([
              singleton(S, 'servicesHero', 'servicesHero', '🎯 Hero секция'),
              singleton(S, 'servicesPage', 'servicesPage', '🔍 SEO + Доп. настройки'),
            ])
        ),

      S.listItem()
        .title('� Спортзалы')
        .child(
          S.list()
            .title('Спортзалы')
            .items([
              singleton(S, 'gymsHero', 'gymsHero', '🎯 Hero секция'),
              S.divider(),
              S.listItem()
                .title('� Управление залами')
                .child(S.documentTypeList('gym').title('Залы')),
              singleton(S, 'gymsPage', 'gymsPage', '🏷️ Лейблы страницы'),
            ])
        ),

      S.listItem()
        .title('☎️ Контакты')
        .child(
          S.list()
            .title('Контакты')
            .items([
              singleton(S, 'contactHero', 'contactHero', '🎯 Hero секция'),
              singleton(S, 'contactInfo', 'contactInfo', 'ℹ️ Информация'),
              singleton(S, 'contactGyms', 'contactGyms', '🏟️ Залы'),
            ])
        ),

      S.divider(),

      // ─── Медиа ───
      S.listItem()
        .title('📰 Новости и блог')
        .child(
          S.list()
            .title('Новости')
            .items([
              S.listItem()
                .title('Все статьи')
                .child(S.documentTypeList('post').title('Все статьи')),
              S.divider(),
              S.listItem()
                .title('Новости клуба (встраиваемые)')
                .child(S.documentTypeList('clubEmbed').title('Новости клуба')),
              S.listItem()
                .title('Избранные посты')
                .child(
                  S.documentList()
                    .title('Избранные посты')
                    .filter('_type == "post" && featured == true')
                    .apiVersion('2023-05-03')
                ),
              S.divider(),
              S.listItem()
                .title('По категориям')
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
                ),
            ])
        ),

      galleryGroup(S),

      S.divider(),

      // ─── Команда ───
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
                .title('👑 Основатели')
                .child(S.documentTypeList('founder').title('Основатели')),
            ])
        ),

      S.divider(),

      // ─── Настройки сайта ───
      S.listItem()
        .title('⚙️ Настройки сайта')
        .child(
          S.list()
            .title('Настройки')
            .items([
              singleton(S, 'footer', 'footer', '🦶 Footer (подвал)'),
            ])
        ),

      S.divider(),

      // ─── Справочники ───
      S.listItem()
        .title('📂 Авторы')
        .child(S.documentTypeList('author').title('Авторы')),
      S.listItem()
        .title('🏷️ Категории')
        .child(S.documentTypeList('category').title('Категории')),
    ])

export default deskStructure
