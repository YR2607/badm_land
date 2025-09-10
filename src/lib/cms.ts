import { createClient } from '@sanity/client';
import groq from 'groq';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION as string | undefined;
const useCdn = true;

export const isCmsEnabled = Boolean(projectId && dataset && apiVersion);

export const sanityClient = isCmsEnabled
  ? createClient({ projectId, dataset, apiVersion, useCdn })
  : null;

export type CmsImage = { url: string; alt?: string };
export type CmsMedia = { type: 'image' | 'video'; url: string; alt?: string };

export async function fetchGallerySections(): Promise<Record<string, string[]>> {
  if (!sanityClient) return {};
  const query = groq`*[_type == "gallerySection"]{ key, "images": images[].asset->url }`;
  const list = await sanityClient.fetch(query);
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
  if (!sanityClient) return [];
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
  const list = await sanityClient.fetch(query);
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
  if (!sanityClient) return [];
  const query = groq`*[_type == "post"] | order(coalesce(date, _createdAt) desc) {
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
  }`;
  const posts = await sanityClient.fetch(query);
  // Приводим к допустимым категориям
  const allowed = new Set(['news', 'world', 'event']);
  return (posts as any[]).map((p) => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt,
    image: p.image,
    date: p.date,
    category: allowed.has(p.category) ? p.category : 'news',
    author: p.author || undefined,
    featured: Boolean(p.featured),
  }));
}

export type CmsPage = {
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  sections?: Array<{ heading?: string; body?: any[] }>;
};

export async function fetchPage(slug: string): Promise<CmsPage | null> {
  if (!sanityClient) return null;
  const query = groq`*[_type == "page" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    heroTitle,
    heroSubtitle,
    "heroImage": heroImage.asset->url,
    sections[]{ heading, body }
  }`;
  const page = await sanityClient.fetch(query, { slug });
  return page || null;
}

export type CmsAlbum = { id: string; title: string; sectionSlug: string; cover?: string; images: string[] };

export async function fetchGalleryAlbums(): Promise<CmsAlbum[]> {
  if (!sanityClient) return [];
  const query = groq`*[_type == "galleryAlbum"] | order(_createdAt desc) {
    "id": slug.current,
    title,
    "sectionSlug": section->slug.current,
    "cover": cover.asset->url,
    "images": images[].asset->url
  }`;
  const albums = await sanityClient.fetch(query);
  return albums as CmsAlbum[];
}

export async function fetchClubEmbeds(): Promise<any[]> {
  if (!sanityClient) return [];
  const query = groq`*[_type == "clubEmbed"] | order(coalesce(publishedAt, _createdAt) desc){ title, url, description, kind, publishedAt, "cover": cover.asset->url, coverUrl }`;
  
  // Отключаем CDN для получения свежих данных
  const freshClient = createClient({ 
    projectId: sanityClient.config().projectId!, 
    dataset: sanityClient.config().dataset!, 
    apiVersion: sanityClient.config().apiVersion!, 
    useCdn: false 
  });
  
  const list = await freshClient.fetch(query);
  return (list || []).map((i: any) => ({
    title: i?.title || '',
    url: i?.url || '',
    description: i?.description || '',
    kind: i?.kind || 'news',
    publishedAt: i?.publishedAt || null,
    cover: i?.cover || i?.coverUrl || undefined,
    coverUrl: i?.coverUrl || undefined,
  }));
}
