import { createClient } from '@sanity/client';
import { cmsCache } from './cache';

const groq = String.raw;

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION as string | undefined;
const useCdn = false; // Отключаем CDN для получения свежих данных

const client = createClient({ projectId, dataset, apiVersion, useCdn });

export { client };
export const isCmsEnabled = Boolean(projectId && dataset && apiVersion);

export type CmsImage = { url: string; alt?: string };
export type CmsMedia = { type: 'image' | 'video'; url: string; alt?: string };

export async function fetchGallerySections(): Promise<Record<string, string[]>> {
  if (!client) return {};
  const query = groq`*[_type == "gallerySection"]{ key, "images": images[].asset->url }`;
  const list = await client.fetch(query);
  const result: Record<string, string[]> = { hall: [], coaches: [], trainings: [] };
  (list || []).forEach((it: any) => {
    if (it?.key && result[it.key] !== undefined) {
      result[it.key] = it.images || [];
    }
  });
  return result;
}

export type CmsContactInfo = {
  title?: string;
  description?: string;
  contacts: Array<{ type: 'phone'|'email'|'address'|'social'; label: string; value: string; icon?: string }>;
};

export async function fetchContactInfo(): Promise<CmsContactInfo | null> {
  const cacheKey = 'contactInfo';
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsContactInfo>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(groq`*[_type == "contactInfo"][0]{ title, description, contacts[]{ type, label, value, icon } }`);
    if (data && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, data);
    return applyCmsDevMarkers(data || null);
  } catch {
    return null;
  }
}

export type CmsContactGymCard = {
  name: string; type?: string; badge?: string; address?: string; description?: string; hours?: string;
};

export async function fetchContactGymsCards(): Promise<CmsContactGymCard[]> {
  const cacheKey = 'contactGymsCards';
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsContactGymCard[]>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(groq`*[_type == "contactGyms"][0]{ gyms[]->{ name, type, badge, address, description, hours } }`);
    const list: CmsContactGymCard[] = data?.gyms || [];
    if (list && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, list);
    return applyCmsDevMarkers(list || []);
  } catch {
    return [];
  }
}

export async function fetchGymsHero(lang: string = 'ru'): Promise<CmsHero | null> {
  const cacheKey = `gymsHero-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsHero>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "gymsHero"][0]{
        content{
          badge{icon, "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)},
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          statistics[]{ number, "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description) }
        }
      }`,
      { lang }
    );
    const hero: CmsHero | null = applyCmsDevMarkers(data?.content || null);
    if (hero && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, hero);
    return hero;
  } catch (e) {
    return null;
  }
}

export async function fetchContactHero(lang: string = 'ru'): Promise<CmsHero | null> {
  const cacheKey = `contactHero-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsHero>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "contactHero"][0]{
        content{
          badge{icon, "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)},
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          statistics[]{ number, "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description) }
        }
      }`,
      { lang }
    );
    const hero: CmsHero | null = data?.content || null;
    if (hero && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, hero);
    return hero;
  } catch (e) {
    return null;
  }
}

export type TournamentCategoryCms = {
  id: string;
  name: string;
  photos: string[];
  videos: string[];
  year?: number;
  tags?: string[];
  cover?: string;
};

export async function fetchTournamentCategories(): Promise<TournamentCategoryCms[]> {
  if (!client) return [];
  const query = groq`*[_type == "tournamentCategory"] | order(coalesce(year, 0) desc, _createdAt desc){
    "id": slug.current,
    name,
    year,
    tags,
    featured,
    "cover": coalesce(cover.asset->url, photos[0].asset->url),
    "photos": photos[].asset->url,
    "videos": videos[].asset->url
  }`;
  const list = await client.fetch(query);
  return (list || []).map((i: any) => ({
    id: i.id,
    name: i.name,
    year: i.year,
    tags: i.tags || [],
    cover: i.cover,
    photos: i.photos || [],
    videos: i.videos || [],
  }));
}

export type CmsPost = {
  id: string;
  title: string;
  excerpt: string;
  image?: string;
  date: string;
  category: 'news' | 'world' | 'event';
  author?: string;
  featured?: boolean;
};

export async function fetchPosts(): Promise<CmsPost[]> {
  const cacheKey = 'posts';
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsPost[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const posts = await client.fetch(`
      *[_type == "post"] | order(coalesce(date, _createdAt) desc) {
        "id": slug.current,
        title,
        excerpt,
        "image": image.asset->url,
        "date": coalesce(date, _createdAt),
        // Возвращаем строковый слаг категории или строковое поле category, иначе 'news'
        "category": select(defined(category->slug.current) => category->slug.current, defined(category) => category, "news"),
        // Имя автора из ссылки или строковое поле author, иначе null
        "author": select(defined(author->name) => author->name, defined(author) => author, null),
        featured
      }
    `);
    
    const result = posts || [];
    
    // Кэшируем только в production с коротким TTL для динамического контента
    if (process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes
    }
    
    return result;
  } catch (error) {
    // silence console in dev to keep clean
    return [];
  }
}

export async function fetchPostBySlug(slug: string): Promise<CmsPost | null> {
  const cacheKey = `post-${slug}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsPost>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const post = await client.fetch(`
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        featured,
        mainImage {
          asset->{
            _id,
            url
          },
          alt
        },
        author->{
          name,
          image {
            asset->{
              _id,
              url
            }
          }
        },
        categories[]->{
          title,
          slug
        }
      }
    `, { slug });
    
    // Кэшируем только в production
    if (post && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, post);
    }
    
    return post;
  } catch (error) {
    // silence console in dev
    return null;
  }
}

export type CmsPage = {
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  sections?: Array<{ heading?: string; body?: any[] }>;
};

export async function fetchPageBySlug(slug: string): Promise<CmsPage | null> {
  const cacheKey = `page-${slug}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsPage>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!client) return null;
  
  try {
    const query = groq`*[_type == "page" && slug.current == $slug][0]{
      "slug": slug.current,
      title,
      heroTitle,
      heroSubtitle,
      "heroImage": heroImage.asset->url,
      sections[]{ heading, body }
    }`;
    const page = await client.fetch(query, { slug });
    
    // Кэшируем только в production
    if (page && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, page);
    }
    
    return page || null;
  } catch (error) {
    // silence console in dev
    return null;
  }
}

export type CmsAlbum = { id: string; title: string; sectionSlug: string; cover?: string; images: string[] };

export async function fetchGalleryAlbums(): Promise<CmsAlbum[]> {
  if (!client) return [];
  const query = groq`*[_type == "galleryAlbum"] | order(_createdAt desc) {
    "id": slug.current,
    title,
    "sectionSlug": section->slug.current,
    "cover": cover.asset->url,
    "images": images[].asset->url
  }`;
  const albums = await client.fetch(query);
  return albums as CmsAlbum[];
}

export interface CmsHomePage {
  title?: string;
  hero?: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    description?: string;
    statistics?: Array<{ number: string; description: string }>;
  };
  achievementsSection?: {
    title: string;
    subtitle?: string;
    achievements: Array<{ title: string; count: string; description: string; icon: string; color: string }>;
    timeline?: {
      title: string;
      milestones: Array<{ year: string; title: string; description: string }>;
    };
    callToAction?: {
      text: string;
      icon: string;
    };
  };
  servicesSection?: {
    title: string;
    subtitle?: string;
    buttonText?: string;
    services: Array<{ title: string; description: string; features?: string[]; price: string; icon: string; color: string }>;
  };
  ctaSection?: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
};

// TODO: вернуть dev-маркеры после завершения диагностики
export const applyCmsDevMarkers = <T>(data: T): T => data;

export const fetchHomePage = async (lang: string = 'ru'): Promise<CmsHomePage | null> => {
  const cacheKey = `homePage-${lang}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsHomePage>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const data = await client.fetch(`
      *[_type == "homePage"][0] {
        title,
        hero {
          badge { icon, "text": select($lang == "en" && defined(text_en) => text_en, $lang == "ro" && defined(text_ro) => text_ro, text) },
          "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
          "subtitle": select($lang == "en" && defined(subtitle_en) => subtitle_en, $lang == "ro" && defined(subtitle_ro) => subtitle_ro, subtitle),
          "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description),
          statistics[] { number, "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description) }
        },
        servicesSection {
          "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
          "subtitle": select($lang == "en" && defined(subtitle_en) => subtitle_en, $lang == "ro" && defined(subtitle_ro) => subtitle_ro, subtitle),
          "buttonText": select($lang == "en" && defined(buttonText_en) => buttonText_en, $lang == "ro" && defined(buttonText_ro) => buttonText_ro, buttonText),
          services[] {
            "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
            "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description),
            icon,
            "price": select($lang == "en" && defined(price_en) => price_en, $lang == "ro" && defined(price_ro) => price_ro, price),
            "features": select($lang == "en" && defined(features_en) => features_en, $lang == "ro" && defined(features_ro) => features_ro, features),
            color
          }
        },
        achievementsSection {
          // Localized fields with RU default
          "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
          "subtitle": select($lang == "en" && defined(subtitle_en) => subtitle_en, $lang == "ro" && defined(subtitle_ro) => subtitle_ro, subtitle),
          achievements[] {
            "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
            count,
            "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description),
            icon,
            color
          },
          timeline {
            "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
            milestones[] {
              year,
              "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
              "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description)
            }
          },
          callToAction {
            "text": select($lang == "en" && defined(text_en) => text_en, $lang == "ro" && defined(text_ro) => text_ro, text),
            icon
          }
        },
        newsSection { 
          "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
          "subtitle": select($lang == "en" && defined(subtitle_en) => subtitle_en, $lang == "ro" && defined(subtitle_ro) => subtitle_ro, subtitle),
          enabled 
        },
        ctaSection { 
          "title": select($lang == "en" && defined(title_en) => title_en, $lang == "ro" && defined(title_ro) => title_ro, title),
          "description": select($lang == "en" && defined(description_en) => description_en, $lang == "ro" && defined(description_ro) => description_ro, description),
          "buttonText": select($lang == "en" && defined(buttonText_en) => buttonText_en, $lang == "ro" && defined(buttonText_ro) => buttonText_ro, buttonText),
          buttonLink 
        }
      }
    `, { lang });
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }
    
    return applyCmsDevMarkers(data);
  } catch (error) {
    // silence console in dev
    return null;
  }
};

export type CmsFounder = {
  name: string;
  role: string;
  experience?: string;
  achievements?: string[];
  description?: any[];
  quote?: string;
  stats?: Array<{ label: string; value: string }>;
  photo?: string;
};

export type CmsTrainer = {
  name: string;
  role: string;
  experience?: string;
  specialization?: string;
  achievements?: string[];
  description?: string;
  photo?: string;
};

export type CmsAboutPage = {
  title: string;
  hero: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    statistics?: Array<{ number: string; description: string }>;
  };
  teamSection?: {
    title: string;
    subtitle: string;
    founder?: CmsFounder;
    coaches?: CmsTrainer[];
  };
  statsSection?: {
    title: string;
    stats: Array<{
      number: string;
      label: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
  tabsSection?: {
    title: string;
    subtitle: string;
    tabs: Array<any>;
  };
  historySection?: {
    title: string;
    subtitle: string;
    showAllByDefault: boolean;
    timeline: Array<{
      year: string;
      title: string;
      text: string;
    }>;
  };
  roadmapSection?: {
    title: string;
    subtitle: string;
    roadmapItems: Array<{
      tag: string;
      title: string;
      description: string;
      status: 'done' | 'progress' | 'planned';
    }>;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
};

export const fetchAboutPage = async (lang: string = 'ru'): Promise<CmsAboutPage | null> => {
  const cacheKey = `aboutPage-${lang}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsAboutPage>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const data = await client.fetch(`
      *[_type == "aboutPage"][0] {
        title,
        hero {
          badge {
            icon,
            "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)
          },
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          statistics[] {
            number,
            "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description)
          }
        },
        teamSection {
          title,
          subtitle,
          founder-> {
            "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
            "role": select($lang=="en" && defined(role_en)=>role_en, $lang=="ro" && defined(role_ro)=>role_ro, role),
            experience,
            "achievements": select($lang=="en" && defined(achievements_en)=>achievements_en, $lang=="ro" && defined(achievements_ro)=>achievements_ro, achievements),
            "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
            "quote": select($lang=="en" && defined(quote_en)=>quote_en, $lang=="ro" && defined(quote_ro)=>quote_ro, quote),
            stats[] {
              "label": select($lang=="en" && defined(label_en)=>label_en, $lang=="ro" && defined(label_ro)=>label_ro, label),
              value
            },
            "photo": photo.asset->url
          },
          coaches[]-> {
            "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
            role,
            "experience": select($lang=="en" && defined(experience_en)=>experience_en, $lang=="ro" && defined(experience_ro)=>experience_ro, experience),
            "specialization": select($lang=="en" && defined(specialization_en)=>specialization_en, $lang=="ro" && defined(specialization_ro)=>specialization_ro, specialization),
            "achievements": select($lang=="en" && defined(achievements_en)=>achievements_en, $lang=="ro" && defined(achievements_ro)=>achievements_ro, achievements),
            "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
            "photo": photo.asset->url
          }
        },
        statsSection {
          "title": title,
          stats[] {
            number,
            label,
            description,
            icon,
            color
          }
        },
        historySection {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          showAllByDefault,
          timeline[] {
            year,
            "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
            "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)
          }
        },
        roadmapSection {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          roadmapItems[] {
            tag,
            "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
            "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
            status
          }
        },
        seo {
          metaTitle,
          metaDescription,
          keywords
        }
      }
    `, { lang });
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }

    return applyCmsDevMarkers(data);
  } catch (error) {
    // silence console in dev
    return null;
  }
};

export interface CmsServicesPage {
  title: string;
  hero: {
    badge?: { icon?: string; text?: string };
    title: string;
    subtitle: string;
    description?: string;
    backgroundImage?: { asset?: { _id: string; url: string }; alt?: string };
    statistics?: Array<{ number: string; description: string }>;
  };
  servicesSection?: {
    title: string;
    subtitle: string;
    services: Array<{
      title: string;
      description: string;
      icon?: string;
      features?: string[];
      pricing?: {
        monthly?: string;
        perSession?: string;
      };
    }>;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

export const fetchServicesPage = async (lang: string = 'ru'): Promise<CmsServicesPage | null> => {
  const cacheKey = `servicesPage-${lang}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsServicesPage>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const data = await client.fetch(`
      *[_type == "servicesPage"][0] {
        hero {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
          backgroundImage { asset->{ _id, url }, alt }
        },
        servicesSection {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          services[] {
            "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
            "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
            icon,
            "features": select($lang=="en" && defined(features_en)=>features_en, $lang=="ro" && defined(features_ro)=>features_ro, features),
            pricing { 
              "monthly": select($lang=="en" && defined(monthly_en)=>monthly_en, $lang=="ro" && defined(monthly_ro)=>monthly_ro, monthly),
              "perSession": select($lang=="en" && defined(perSession_en)=>perSession_en, $lang=="ro" && defined(perSession_ro)=>perSession_ro, perSession)
            }
          }
        }
      }
    `, { lang });
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    // silence console in dev
    return null;
  }
}

export type CmsGym = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  detailedDescription?: any[];
  heroImage?: string;
  badge?: string;
  badgeColor?: string;
  address?: string;
  phone?: string;
  email?: string;
  mapUrl?: string;
  gallery?: string[];
  features?: string[];
  hasChildren?: boolean;
  hasAdults?: boolean;
  schedule?: {
    children?: {
      title: string;
      times: string;
      details: string;
    };
    adults?: {
      title: string;
      times: string;
      details: string;
    };
  };
  pricing?: {
    children?: {
      monthly: string;
      single: string;
      trial: string;
    };
    adults?: {
      monthly: string;
      single: string;
      trial: string;
    };
  };
  trainers?: Array<{
    name: string;
    experience: string;
    specialization: string;
    photo?: string;
  }>;
};

export const fetchGyms = async (lang: string = 'ru'): Promise<CmsGym[]> => {
  const cacheKey = `gyms-${lang}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsGym[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!client) return [];
  
  try {
    const query = groq`*[_type == "gym"] | order(_createdAt asc) {
      "id": _id,
      "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
      "slug": slug.current,
      "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
      detailedDescription,
      "heroImage": heroImage.asset->url,
      "badge": select($lang=="en" && defined(badge_en)=>badge_en, $lang=="ro" && defined(badge_ro)=>badge_ro, badge),
      badgeColor,
      address,
      phone,
      email,
      mapUrl,
      "gallery": gallery[].asset->url,
      "features": select($lang=="en" && defined(features_en)=>features_en, $lang=="ro" && defined(features_ro)=>features_ro, features),
      hasChildren,
      hasAdults,
      schedule {
        children {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          times,
          "details": select($lang=="en" && defined(details_en)=>details_en, $lang=="ro" && defined(details_ro)=>details_ro, details)
        },
        adults {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          times,
          "details": select($lang=="en" && defined(details_en)=>details_en, $lang=="ro" && defined(details_ro)=>details_ro, details)
        }
      },
      pricing {
        children {
          "monthly": select($lang=="en" && defined(monthly_en)=>monthly_en, $lang=="ro" && defined(monthly_ro)=>monthly_ro, monthly),
          "single": select($lang=="en" && defined(single_en)=>single_en, $lang=="ro" && defined(single_ro)=>single_ro, single),
          "trial": select($lang=="en" && defined(trial_en)=>trial_en, $lang=="ro" && defined(trial_ro)=>trial_ro, trial)
        },
        adults {
          "monthly": select($lang=="en" && defined(monthly_en)=>monthly_en, $lang=="ro" && defined(monthly_ro)=>monthly_ro, monthly),
          "single": select($lang=="en" && defined(single_en)=>single_en, $lang=="ro" && defined(single_ro)=>single_ro, single),
          "trial": select($lang=="en" && defined(trial_en)=>trial_en, $lang=="ro" && defined(trial_ro)=>trial_ro, trial)
        }
      },
      trainers[]-> {
        "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
        "experience": select($lang=="en" && defined(experience_en)=>experience_en, $lang=="ro" && defined(experience_ro)=>experience_ro, experience),
        "specialization": select($lang=="en" && defined(specialization_en)=>specialization_en, $lang=="ro" && defined(specialization_ro)=>specialization_ro, specialization),
        "photo": photo.asset->url
      }
    }`;
    const gyms = await client.fetch(query, { lang });
    const result = applyCmsDevMarkers(gyms || []);
    
    // Кэшируем только в production
    if (process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    // silence console in dev
    return [];
  }
};

export const fetchGymBySlug = async (slug: string, lang: string = 'ru'): Promise<CmsGym | null> => {
  const cacheKey = `gym-${slug}-${lang}`;
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsGym>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!client) return null;
  
  try {
    const query = groq`*[_type == "gym" && slug.current == $slug][0] {
      "id": _id,
      "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
      "slug": slug.current,
      "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
      detailedDescription,
      "heroImage": heroImage.asset->url,
      "badge": select($lang=="en" && defined(badge_en)=>badge_en, $lang=="ro" && defined(badge_ro)=>badge_ro, badge),
      badgeColor,
      address,
      phone,
      email,
      mapUrl,
      "gallery": gallery[].asset->url,
      "features": select($lang=="en" && defined(features_en)=>features_en, $lang=="ro" && defined(features_ro)=>features_ro, features),
      hasChildren,
      hasAdults,
      schedule {
        children {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          times,
          "details": select($lang=="en" && defined(details_en)=>details_en, $lang=="ro" && defined(details_ro)=>details_ro, details)
        },
        adults {
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          times,
          "details": select($lang=="en" && defined(details_en)=>details_en, $lang=="ro" && defined(details_ro)=>details_ro, details)
        }
      },
      pricing {
        children {
          "monthly": select($lang=="en" && defined(monthly_en)=>monthly_en, $lang=="ro" && defined(monthly_ro)=>monthly_ro, monthly),
          "single": select($lang=="en" && defined(single_en)=>single_en, $lang=="ro" && defined(single_ro)=>single_ro, single),
          "trial": select($lang=="en" && defined(trial_en)=>trial_en, $lang=="ro" && defined(trial_ro)=>trial_ro, trial)
        },
        adults {
          "monthly": select($lang=="en" && defined(monthly_en)=>monthly_en, $lang=="ro" && defined(monthly_ro)=>monthly_ro, monthly),
          "single": select($lang=="en" && defined(single_en)=>single_en, $lang=="ro" && defined(single_ro)=>single_ro, single),
          "trial": select($lang=="en" && defined(trial_en)=>trial_en, $lang=="ro" && defined(trial_ro)=>trial_ro, trial)
        }
      },
      trainers[]-> {
        "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
        "experience": select($lang=="en" && defined(experience_en)=>experience_en, $lang=="ro" && defined(experience_ro)=>experience_ro, experience),
        "specialization": select($lang=="en" && defined(specialization_en)=>specialization_en, $lang=="ro" && defined(specialization_ro)=>specialization_ro, specialization),
        "photo": photo.asset->url
      }
    }`;
    const gym = await client.fetch(query, { slug, lang });
    
    // Кэшируем только в production
    if (gym && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, gym);
    }
    
    return gym;
  } catch (error) {
    // silence console in dev
    return null;
  }
};

export const sanityClient = client;

// --- Standalone fetchers for fallback usage ---
export async function fetchTrainers(lang: string = 'ru'): Promise<CmsTrainer[]> {
  try {
    const list = await client.fetch(
      groq`*[_type == "trainer"] | order(_createdAt asc) {
        "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
        role,
        "experience": select($lang=="en" && defined(experience_en)=>experience_en, $lang=="ro" && defined(experience_ro)=>experience_ro, experience),
        "specialization": select($lang=="en" && defined(specialization_en)=>specialization_en, $lang=="ro" && defined(specialization_ro)=>specialization_ro, specialization),
        "achievements": select($lang=="en" && defined(achievements_en)=>achievements_en, $lang=="ro" && defined(achievements_ro)=>achievements_ro, achievements),
        "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
        "photo": photo.asset->url
      }`,
      { lang }
    );
    return list || [];
  } catch {
    return [];
  }
}

export async function fetchFounder(lang: string = 'ru'): Promise<CmsFounder | null> {
  try {
    const data = await client.fetch(
      groq`*[_type == "founder"][0]{
        "name": select($lang=="en" && defined(name_en)=>name_en, $lang=="ro" && defined(name_ro)=>name_ro, name),
        "role": select($lang=="en" && defined(role_en)=>role_en, $lang=="ro" && defined(role_ro)=>role_ro, role),
        experience,
        "achievements": select($lang=="en" && defined(achievements_en)=>achievements_en, $lang=="ro" && defined(achievements_ro)=>achievements_ro, achievements),
        "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
        "quote": select($lang=="en" && defined(quote_en)=>quote_en, $lang=="ro" && defined(quote_ro)=>quote_ro, quote),
        stats[]{
          "label": select($lang=="en" && defined(label_en)=>label_en, $lang=="ro" && defined(label_ro)=>label_ro, label),
          value
        },
        "photo": photo.asset->url
      }`,
      { lang }
    );
    return data || null;
  } catch {
    return null;
  }
}

export async function fetchClubEmbeds(): Promise<any[]> {
  const cacheKey = 'clubEmbeds';
  
  // В development режиме пропускаем кэш для получения свежих данных
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<any[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  if (!client) return [];
  
  try {
    const query = groq`*[_type == "clubEmbed"] | order(publishedAt desc) {
      title, 
      url, 
      description,
      kind,
      publishedAt,
      "cover": cover.asset->url,
      coverUrl
    }`;
    const embeds = await client.fetch(query);
    const result = applyCmsDevMarkers(embeds || []);
    
    // Кэшируем только в production
    if (process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    // silence console in dev
    return [];
  }
}

// --- Singletons: ABOUT & SERVICES HERO ---
export type CmsHero = {
  badge?: { icon?: string; text?: string };
  title: string;
  subtitle: string;
  statistics?: Array<{ number: string; description: string }>;
};

export async function fetchAboutHero(lang: string = 'ru'): Promise<CmsHero | null> {
  const cacheKey = `aboutHero-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsHero>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "aboutHero"][0]{
        content{
          badge{icon, "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)},
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          statistics[]{ number, "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description) }
        }
      }`,
      { lang }
    );
    const hero: CmsHero | null = data?.content || null;
    if (hero && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, hero);
    return hero;
  } catch (e) {
    return null;
  }
}

export async function fetchAboutTabs(lang: string = 'ru'): Promise<any> {
  const cacheKey = `aboutTabs-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<any>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "aboutTabs"][0]{
        "title": title,
        "subtitle": subtitle,
        tabs[]{
          key,
          label,
          icon,
          title,
          "content": select($lang=="en" && defined(content_en)=>content_en, $lang=="ro" && defined(content_ro)=>content_ro, content)
        }
      }`,
      { lang }
    );
    if (data && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, data);
    return data || null;
  } catch {
    return null;
  }
}

export async function fetchNavigation(lang: string = 'ru'): Promise<any> {
  const cacheKey = `navigation-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<any>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "navigation"][0]{
        menuItems[]{
          key,
          "label": select($lang=="en" && defined(label_en)=>label_en, $lang=="ro" && defined(label_ro)=>label_ro, label),
          path,
          order
        }
      }`,
      { lang }
    );
    if (data && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, data);
    return data || null;
  } catch {
    return null;
  }
}

export async function fetchFooter(lang: string = 'ru'): Promise<any> {
  const cacheKey = `footer-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<any>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "footer"][0]{
        "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description),
        quickLinks[]{
          "label": select($lang=="en" && defined(label_en)=>label_en, $lang=="ro" && defined(label_ro)=>label_ro, label),
          path
        },
        socialMedia,
        contact{
          address,
          phone,
          email,
          "workingHours": select($lang=="en" && defined(workingHours_en)=>workingHours_en, $lang=="ro" && defined(workingHours_ro)=>workingHours_ro, workingHours)
        }
      }`,
      { lang }
    );
    if (data && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, data);
    return data || null;
  } catch {
    return null;
  }
}

export async function fetchServicesHero(lang: string = 'ru'): Promise<CmsHero | null> {
  const cacheKey = `servicesHero-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsHero>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "servicesHero"][0]{
        content{
          badge{icon, "text": select($lang=="en" && defined(text_en)=>text_en, $lang=="ro" && defined(text_ro)=>text_ro, text)},
          "title": select($lang=="en" && defined(title_en)=>title_en, $lang=="ro" && defined(title_ro)=>title_ro, title),
          "subtitle": select($lang=="en" && defined(subtitle_en)=>subtitle_en, $lang=="ro" && defined(subtitle_ro)=>subtitle_ro, subtitle),
          statistics[]{ number, "description": select($lang=="en" && defined(description_en)=>description_en, $lang=="ro" && defined(description_ro)=>description_ro, description) }
        }
      }`,
      { lang }
    );
    const hero: CmsHero | null = data?.content || null;
    if (hero && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, hero);
    return hero;
  } catch (e) {
    return null;
  }
}

export type CmsGymsPageLabels = {
  signUpButton: string;
  openMapButton: string;
  trainersTitle: string;
  galleryTitle: string;
  contactTitle: string;
};

export async function fetchGymsPageLabels(lang: string = 'ru'): Promise<CmsGymsPageLabels | null> {
  const cacheKey = `gymsPageLabels-${lang}`;
  if (process.env.NODE_ENV !== 'development') {
    const cached = cmsCache.get<CmsGymsPageLabels>(cacheKey);
    if (cached) return cached;
  }
  try {
    const data = await client.fetch(
      groq`*[_type == "gymsPage"][0]{
        labels{
          "signUpButton": select($lang=="en" && defined(signUpButton_en)=>signUpButton_en, $lang=="ro" && defined(signUpButton_ro)=>signUpButton_ro, signUpButton),
          "openMapButton": select($lang=="en" && defined(openMapButton_en)=>openMapButton_en, $lang=="ro" && defined(openMapButton_ro)=>openMapButton_ro, openMapButton),
          "trainersTitle": select($lang=="en" && defined(trainersTitle_en)=>trainersTitle_en, $lang=="ro" && defined(trainersTitle_ro)=>trainersTitle_ro, trainersTitle),
          "galleryTitle": select($lang=="en" && defined(galleryTitle_en)=>galleryTitle_en, $lang=="ro" && defined(galleryTitle_ro)=>galleryTitle_ro, galleryTitle),
          "contactTitle": select($lang=="en" && defined(contactTitle_en)=>contactTitle_en, $lang=="ro" && defined(contactTitle_ro)=>contactTitle_ro, contactTitle)
        }
      }`,
      { lang }
    );
    const labels: CmsGymsPageLabels | null = data?.labels || null;
    if (labels && process.env.NODE_ENV !== 'development') cmsCache.set(cacheKey, labels);
    return labels;
  } catch (e) {
    return null;
  }
}
