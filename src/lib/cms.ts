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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching posts:', error);
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching post:', error);
    }
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching page:', error);
    }
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

export const fetchHomePage = async (): Promise<CmsHomePage | null> => {
  const cacheKey = 'homePage';
  
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
          badge {
            icon,
            text
          },
          title,
          subtitle,
          description,
          statistics[] {
            number,
            description
          }
        },
        servicesSection {
          title,
          subtitle,
          services[] {
            title,
            description,
            icon,
            price,
            features[],
            color
          }
        },
        achievementsSection {
          title,
          subtitle,
          achievements[] {
            title,
            count,
            description,
            icon,
            color
          },
          timeline {
            title,
            milestones[] {
              year,
              title,
              description
            }
          },
          callToAction {
            text,
            icon
          }
        },
        newsSection {
          title,
          subtitle,
          enabled
        },
        ctaSection {
          title,
          description,
          buttonText,
          buttonLink
        }
      }
    `);
    
    // Добавим логирование в development режиме
    if (process.env.NODE_ENV === 'development') {
      console.log('CMS Data received:', JSON.stringify(data, null, 2));
    }
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching home page:', error);
    }
    return null;
  }
}

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

export const fetchAboutPage = async (): Promise<CmsAboutPage | null> => {
  const cacheKey = 'aboutPage';
  
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
            text
          },
          title,
          subtitle,
          statistics[] {
            number,
            description
          }
        },
        teamSection {
          title,
          subtitle,
          founder-> {
            name,
            role,
            experience,
            achievements[],
            description,
            quote,
            stats[] {
              label,
              value
            },
            "photo": photo.asset->url
          },
          coaches[]-> {
            name,
            role,
            experience,
            specialization,
            achievements[],
            description,
            "photo": photo.asset->url
          }
        },
        statsSection {
          title,
          stats[] {
            number,
            label,
            description,
            icon,
            color
          }
        },
        historySection {
          title,
          subtitle,
          showAllByDefault,
          timeline[] {
            year,
            title,
            text
          }
        },
        roadmapSection {
          title,
          subtitle,
          roadmapItems[] {
            tag,
            title,
            description,
            status
          }
        },
        seo {
          metaTitle,
          metaDescription,
          keywords
        }
      }
    `);
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching about page:', error);
    }
    return null;
  }
}

export type CmsServicesPage = {
  title: string;
  hero: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    statistics?: Array<{ number: string; description: string }>;
  };
  servicesSection?: {
    title: string;
    subtitle: string;
    services: Array<{
      title: string;
      description: string;
      features?: string[];
      price: string;
      icon: string;
      ageGroup?: string;
      duration?: string;
    }>;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
};

export const fetchServicesPage = async (): Promise<CmsServicesPage | null> => {
  const cacheKey = 'servicesPage';
  
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
          title,
          subtitle,
          description,
          backgroundImage {
            asset->{
              _id,
              url
            },
            alt
          }
        },
        servicesSection {
          title,
          subtitle,
          services[] {
            title,
            description,
            icon,
            features[],
            pricing {
              monthly,
              perSession
            }
          }
        }
      }
    `);
    
    // Кэшируем только в production
    if (data && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching services page:', error);
    }
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

export const fetchGyms = async (): Promise<CmsGym[]> => {
  const cacheKey = 'gyms';
  
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
      name,
      "slug": slug.current,
      description,
      detailedDescription,
      "heroImage": heroImage.asset->url,
      badge,
      badgeColor,
      address,
      phone,
      email,
      mapUrl,
      "gallery": gallery[].asset->url,
      features,
      hasChildren,
      hasAdults,
      schedule {
        children {
          title,
          times,
          details
        },
        adults {
          title,
          times,
          details
        }
      },
      pricing {
        children {
          monthly,
          single,
          trial
        },
        adults {
          monthly,
          single,
          trial
        }
      },
      trainers[]-> {
        name,
        experience,
        specialization,
        "photo": photo.asset->url
      }
    }`;
    const gyms = await client.fetch(query);
    const result = gyms || [];
    
    // Кэшируем только в production
    if (process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching gyms:', error);
    }
    return [];
  }
};

export const fetchGymBySlug = async (slug: string): Promise<CmsGym | null> => {
  const cacheKey = `gym-${slug}`;
  
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
      name,
      "slug": slug.current,
      description,
      detailedDescription,
      "heroImage": heroImage.asset->url,
      badge,
      badgeColor,
      address,
      phone,
      email,
      mapUrl,
      "gallery": gallery[].asset->url,
      features,
      hasChildren,
      hasAdults,
      schedule {
        children {
          title,
          times,
          details
        },
        adults {
          title,
          times,
          details
        }
      },
      pricing {
        children {
          monthly,
          single,
          trial
        },
        adults {
          monthly,
          single,
          trial
        }
      },
      trainers[]-> {
        name,
        experience,
        specialization,
        "photo": photo.asset->url
      }
    }`;
    const gym = await client.fetch(query, { slug });
    
    // Кэшируем только в production
    if (gym && process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, gym);
    }
    
    return gym;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching gym:', error);
    }
    return null;
  }
};

export const sanityClient = client;

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
    const result = embeds || [];
    
    // Кэшируем только в production
    if (process.env.NODE_ENV !== 'development') {
      cmsCache.set(cacheKey, result);
    }
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching club embeds:', error);
    }
    return [];
  }
}
