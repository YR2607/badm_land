import author from './author'
import category from './category'
import post from './post'
import page from './page'
import galleryAlbum from './galleryAlbum'
import gallerySection from './gallerySection'
import tournamentCategory from './tournamentCategory'
import eventEmbed from './eventEmbed'
import clubEmbed from './clubEmbed'

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
// Singletons
import homeHero from './singletons/homeHero'
import homeServices from './singletons/homeServices'
import homeAchievements from './singletons/homeAchievements'
import homeCta from './singletons/homeCta'
import homeSeo from './singletons/homeSeo'
import homeAbout from './singletons/homeAbout'
import servicesHero from './singletons/servicesHero'
import servicesList from './singletons/servicesList'
import servicesPricing from './singletons/servicesPricing'
import servicesSeo from './singletons/servicesSeo'
import aboutHero from './singletons/aboutHero'
import aboutMission from './singletons/aboutMission'
import aboutTeam from './singletons/aboutTeam'
import aboutStats from './singletons/aboutStats'
import aboutTabs from './singletons/aboutTabs'
import aboutHistory from './singletons/aboutHistory'
import aboutRoadmap from './singletons/aboutRoadmap'
import contactHero from './singletons/contactHero'
import contactInfo from './singletons/contactInfo'
import contactGyms from './singletons/contactGyms'
import contactForm from './singletons/contactForm'
import contactSeo from './singletons/contactSeo'
import gymsHero from './singletons/gymsHero'
import gymsSeo from './singletons/gymsSeo'

export const schemaTypes = [
  // Basic content types
  author,
  category,
  post,
  page,
  galleryAlbum,
  gallerySection,
  tournamentCategory,
  eventEmbed,
  clubEmbed,

  // New CMS schemas
  heroSection,
  homePage,
  aboutPage,
  servicesPage,
  gymsPage,
  contactPage,
  gym,
  trainer,
  founder,

  // Singletons
  homeHero,
  homeServices,
  homeAchievements,
  homeCta,
  homeSeo,
  homeAbout,
  servicesHero,
  servicesList,
  servicesPricing,
  servicesSeo,
  aboutHero,
  aboutMission,
  aboutTeam,
  aboutStats,
  aboutTabs,
  aboutHistory,
  aboutRoadmap,
  contactHero,
  contactInfo,
  contactGyms,
  contactForm,
  contactSeo,
  gymsHero,
  gymsSeo,
]
