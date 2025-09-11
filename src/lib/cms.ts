import { createClient } from '@sanity/client';
import { cmsCache } from './cache';

const groq = String.raw;

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION as string | undefined;
const useCdn = true;

const client = createClient({ projectId, dataset, apiVersion, useCdn });

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
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsPost[]>(cacheKey);
  if (cached) {
    return cached;
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
    
    // Cache the result with shorter TTL for dynamic content
    cmsCache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutes
    
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
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsPost>(cacheKey);
  if (cached) {
    return cached;
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
    
    // Cache the result
    if (post) {
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
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsPage>(cacheKey);
  if (cached) {
    return cached;
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
    
    // Cache the result
    if (page) {
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

export type CmsHomePage = {
  title: string;
  hero: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    statistics?: Array<{ number: string; description: string }>;
  };
  aboutSection?: {
    title: string;
    description: string;
    image?: string;
  };
  servicesSection?: {
    title: string;
    subtitle: string;
    services: Array<{
      title: string;
      description: string;
      icon: string;
      price: string;
    }>;
  };
  achievementsSection?: {
    title: string;
    achievements: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
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

export async function fetchHomePage(): Promise<CmsHomePage | null> {
  const cacheKey = 'homePage';
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsHomePage>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await client.fetch(`
      *[_type == "homePage"][0] {
        hero {
          title,
          subtitle,
          description,
          ctaText,
          ctaLink,
          backgroundImage {
            asset->{
              _id,
              url
            },
            alt
          }
        },
        achievementsSection {
          title,
          subtitle,
          achievements[] {
            number,
            label,
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
            features[]
          }
        }
      }
    `);
    
    // Cache the result
    if (data) {
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

export type CmsAboutPage = {
  title: string;
  hero: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    statistics?: Array<{ number: string; description: string }>;
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

export async function fetchAboutPage(): Promise<CmsAboutPage | null> {
  const cacheKey = 'aboutPage';
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsAboutPage>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await client.fetch(`
      *[_type == "aboutPage"][0] {
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
        introSection {
          title,
          content,
          highlights[]
        }
      }
    `);
    
    // Cache the result
    if (data) {
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

export async function fetchServicesPage(): Promise<CmsServicesPage | null> {
  const cacheKey = 'servicesPage';
  
  // Try to get from cache first
  const cached = cmsCache.get<CmsServicesPage>(cacheKey);
  if (cached) {
    return cached;
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
    
    // Cache the result
    if (data) {
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

export const sanityClient = client;

export async function fetchClubEmbeds(): Promise<any[]> {
  const cacheKey = 'clubEmbeds';
  
  // Try to get from cache first
  const cached = cmsCache.get<any[]>(cacheKey);
  if (cached) {
    return cached;
  }

  if (!client) return [];
  
  try {
    const query = groq`*[_type == "clubEmbed"] | order(_createdAt desc) {
      title, url, description
    }`;
    const embeds = await client.fetch(query);
    const result = embeds || [];
    
    // Cache the result
    cmsCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching club embeds:', error);
    }
    return [];
  }
}
