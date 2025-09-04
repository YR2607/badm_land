const galleryGroup = (S: any) =>
  S.listItem()
    .title('Галерея')
    .child(
      S.list()
        .title('Галерея')
        .items([
          S.listItem().title('Разделы').child(S.documentTypeList('gallerySection').title('Разделы галереи')),
        ])
    )

const byTypeList = (S: any, type: string, title: string) =>
  S.listItem().title(title).child(
    S.documentTypeList(type).title(title)
  )

const draftsList = (type: string, title: string) =>
  S.listItem().title(title).child(
    S.documentList().title(title).filter('_type == $type && !_id in path("drafts.**") == false').params({ type })
  )

const featuredPosts = (S: any) =>
  S.listItem()
    .title('Избранные посты')
    .child(
      S.documentList()
        .title('Избранные посты')
        .filter('_type == "post" && featured == true')
    )

const postsByCategory = (S: any) =>
  S.listItem()
    .title('Новости по категориям')
    .child(
      S.list()
        .title('Категории')
        .items([
          S.listItem().title('Новости клуба').child(
            S.documentList().title('Новости клуба').filter('_type == "post" && (category->slug.current == "news" || category == "news")')
          ),
          S.listItem().title('Мировые новости').child(
            S.documentList().title('Мировые новости').filter('_type == "post" && (category->slug.current == "world" || category == "world")')
          ),
          S.listItem().title('События').child(
            S.documentList().title('События').filter('_type == "post" && (category->slug.current == "event" || category == "event")')
          ),
        ])
    )

const deskStructure = (S: any) =>
  S.list()
    .title('Контент')
    .items([
      S.listItem().title('Страницы').child(S.documentTypeList('page').title('Страницы')),
      S.divider(),
      S.listItem().title('Новости').child(
        S.list().title('Новости').items([
          S.listItem().title('Все посты').child(S.documentTypeList('post').title('Все посты')),
          postsByCategory(S),
          featuredPosts(S),
        ])
      ),
      S.divider(),
      galleryGroup(S),
      byTypeList(S, 'tournamentCategory', 'Турниры'),
      S.divider(),
      byTypeList(S, 'author', 'Авторы'),
      byTypeList(S, 'category', 'Категории'),
    ])

export default deskStructure
