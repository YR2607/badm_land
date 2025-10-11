const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);

const URL_PREFIXES = ['http://', 'https://', '//', 'data:', 'mailto:', 'tel:'];

const shouldSkipString = (value: string): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.includes('[CMS]')) return true;
  return URL_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
};

const markNode = (node: unknown): unknown => {
  if (!isDev || node == null) return node;

  if (Array.isArray(node)) {
    return node.map((item) => markNode(item));
  }

  if (typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>).map(([key, value]) => [key, markNode(value)])
    );
  }

  if (typeof node === 'string' && !shouldSkipString(node)) {
    return `${node} [CMS]`;
  }

  return node;
};

export const addCmsDevMarkers = <T>(data: T): T => markNode(data) as T;
