import author from './author'
import category from './category'
import post from './post'
import page from './page'
import galleryAlbum from './galleryAlbum'
import gallerySection from './gallerySection'
import clubEmbed from './clubEmbed'
import eventEmbed from './eventEmbed'

// New CMS schemas
import heroSection from './heroSection'
import homePage from './homePage'
import aboutPage from './aboutPage'
import servicesPage from './servicesPage'
import gymsPage from './gymsPage'
import contactPage from './contactPage'
import gym from './gym'
import trainer from './trainer'
import founder from './founder'

export const schemaTypes = [
  // Original schemas
  post, author, category, page, galleryAlbum, gallerySection, clubEmbed, eventEmbed,
  // New page schemas
  heroSection, homePage, aboutPage, servicesPage, gymsPage, contactPage,
  // Content schemas
  gym, trainer, founder
]
