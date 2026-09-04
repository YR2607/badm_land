import author from './author'
import category from './category'
import post from './post'
import gallerySection from './gallerySection'
import tournamentCategory from './tournamentCategory'
import clubEmbed from './clubEmbed'

// Page schemas
import homePage from './homePage'
import aboutPage from './aboutPage'
import servicesPage from './servicesPage'
import gymsPage from './gymsPage'
import gym from './gym'
import trainer from './trainer'
import founder from './founder'
import heroSection from './heroSection'

// Singletons (live — used by frontend)
import servicesHero from './singletons/servicesHero'
import aboutHero from './singletons/aboutHero'
import aboutTabs from './singletons/aboutTabs'
import aboutStrategy from './singletons/aboutStrategy'
import aboutRoadmap from './singletons/aboutRoadmap'
import contactHero from './singletons/contactHero'
import contactInfo from './singletons/contactInfo'
import contactGyms from './singletons/contactGyms'
import gymsHero from './singletons/gymsHero'
import footer from './singletons/footer'

export const schemaTypes = [
  // Content types
  author,
  category,
  post,
  gallerySection,
  tournamentCategory,
  clubEmbed,

  // Page schemas
  homePage,
  aboutPage,
  servicesPage,
  gymsPage,
  gym,
  trainer,
  founder,
  heroSection,

  // Singletons
  servicesHero,
  aboutHero,
  aboutTabs,
  aboutStrategy,
  aboutRoadmap,
  contactHero,
  contactInfo,
  contactGyms,
  gymsHero,
  footer,
]
