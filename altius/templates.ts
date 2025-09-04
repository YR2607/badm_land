import {Template} from 'sanity'

export const initialTemplates: Template[] = [
  {
    id: 'gallerySection-hall',
    title: 'Новый раздел: Наш зал',
    schemaType: 'gallerySection',
    value: { key: 'hall', title: 'Наш зал' }
  },
  {
    id: 'gallerySection-coaches',
    title: 'Новый раздел: Наши тренера',
    schemaType: 'gallerySection',
    value: { key: 'coaches', title: 'Наши тренера' }
  },
  {
    id: 'gallerySection-trainings',
    title: 'Новый раздел: Наши тренировки',
    schemaType: 'gallerySection',
    value: { key: 'trainings', title: 'Наши тренировки' }
  }
]
