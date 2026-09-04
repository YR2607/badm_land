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
import contactPage from './contactPage'
import gym from './gym'
import trainer from './trainer'
import founder from './founder'
import member from './member'
import heroSection from './heroSection'

// Singletons (live — used by frontend)
import servicesHero from './singletons/servicesHero'
import servicesList from './singletons/servicesList'
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
  contactPage,
  gym,
  trainer,
  founder,
  member,
  heroSection,

  // Singletons
  servicesHero,
  servicesList,
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
