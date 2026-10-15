// Routes remote images through images.weserv.nl (free CDN proxy).
// BWF news photos are multi-MB originals (up to 5MB, ~5000px) shown in
// ~400-800px cards — the proxy resizes and re-encodes them to WebP.
export const proxied = (url: string | undefined, width?: number): string => {
  if (!url) return '';
  if (url.includes('images.weserv.nl')) return url;

  const needsProxy =
    url.includes('fbcdn.net') ||
    url.includes('facebook.com') ||
    url.includes('bwfbadminton.com');

  if (!needsProxy) return url;

  const cleanUrl = url.startsWith('http') ? url : `https:${url}`;
  const w = width ? `&w=${width}` : '';
  return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=webp&q=80${w}`;
};
