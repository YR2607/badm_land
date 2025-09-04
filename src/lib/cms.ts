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
};

export async function fetchTournamentCategories(): Promise<TournamentCategoryCms[]> {
  if (!sanityClient) return [];
  const query = groq`*[_type == "tournamentCategory"]{
    "id": slug.current,
    name,
    "photos": photos[].asset->url,
    "videos": videos[].asset->url
  }`;
  const list = await sanityClient.fetch(query);
  return (list || []).map((i: any) => ({
    id: i.id,
    name: i.name,
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
  const query = groq`*[_type == "post"] | order(date desc) {
    "id": slug.current,
    title,
    excerpt,
    "image": image.asset->url,
    "date": coalesce(date, _createdAt),
    category,
    "categorySlug": select(defined(category->slug.current), category->slug.current, category),
    "author": select(defined(author->name), author->name, author),
    featured
  }`;
  const posts = await sanityClient.fetch(query);
  return posts as CmsPost[];
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
