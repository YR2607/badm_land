export const proxied = (url: string | undefined): string => {
  if (!url) return '';

  const isFacebook = url.includes('fbcdn.net') || url.includes('facebook.com');
  const isProxied = url.includes('images.weserv.nl');

  if (isFacebook && !isProxied) {
    const cleanUrl = url.startsWith('http') ? url : `https:${url}`;
    return `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&output=jpg&q=85`;
  }

  return url;
};
