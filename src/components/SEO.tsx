import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const LOCALE_MAP: Record<string, string> = {
  ru: 'ru_RU',
  en: 'en_US',
  ro: 'ro_RO',
};

const SEO = ({
  title = 'Altius - Бадминтонный клуб в Кишиневе',
  description = 'Профессиональный бадминтонный клуб Altius в Кишиневе. Тренировки для детей и взрослых, индивидуальные и групповые занятия, участие в турнирах.',
  image = 'https://altius.md/og-image.jpg',
  url,
  type = 'website',
  keywords = 'бадминтон, Кишинев, спортивный клуб, тренировки, badminton, Chisinau, Moldova',
  author = 'Altius Badminton Club',
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const currentUrl = url || `https://altius.md${location.pathname}`;
  const siteName = 'Altius Badminton Club';
  const currentLocale = LOCALE_MAP[i18n.language] || 'ru_RU';

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update <html lang> to match the active language
    document.documentElement.lang = i18n.language || 'ru';

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', siteName, true);
    updateMetaTag('og:locale', currentLocale, true);
    updateMetaTag('og:locale:alternate', 'en_US', true);
    updateMetaTag('og:locale:alternate', 'ro_RO', true);

    // Remove stale property-based twitter tags (pre-fix duplicates)
    document.querySelectorAll('meta[property^="twitter:"]').forEach(el => el.remove());

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:url', currentUrl);

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      updateMetaTag('article:author', author, true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Note: hreflang removed — site uses same URL for all languages (no /ru/, /en/, /ro/ prefixes).
    // Hreflang pointing to the same URL for every language is ignored by Google and adds noise.
    // To re-enable: implement language-specific URL paths first, then add hreflang here.

  }, [title, description, image, currentUrl, type, keywords, author, publishedTime, modifiedTime, i18n.language, currentLocale, location.pathname]);

  return null;
};

export default SEO;
