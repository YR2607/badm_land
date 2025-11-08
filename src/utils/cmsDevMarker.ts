const isDev = typeof import.meta !== 'undefined' && Boolean(import.meta.env?.DEV);

const URL_PREFIXES = ['http://', 'https://', '//', 'data:', 'mailto:', 'tel:'];

const shouldSkipString = (value: string): boolean => {
  if (!value) return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (trimmed.includes('[CMS]')) return true;
  // Skip CSS classes (Tailwind patterns)
  if (trimmed.includes('from-') && trimmed.includes('to-')) return true;
  if (trimmed.match(/^(bg|text|border|p|m|w|h|flex|grid|rounded|shadow|opacity|transform|transition|hover|focus|active|group|space|gap|justify|items|align|font|leading|tracking|decoration|cursor|select|pointer|overflow|z|relative|absolute|fixed|sticky|top|bottom|left|right|inset)-/)) return true;
  return URL_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
};

const SKIP_KEYS = ['badgeColor', 'color', 'className', 'style', 'css'];

const markNode = (node: unknown, parentKey?: string): unknown => {
  if (!isDev || node == null) return node;

  if (Array.isArray(node)) {
    return node.map((item) => markNode(item));
  }

  if (typeof node === 'object') {
    return Object.fromEntries(
      Object.entries(node as Record<string, unknown>).map(([key, value]) => [
        key, 
        SKIP_KEYS.includes(key) ? value : markNode(value, key)
      ])
    );
  }

  if (typeof node === 'string' && !shouldSkipString(node)) {
    return `${node} [CMS]`;
  }

  return node;
};

export const addCmsDevMarkers = <T>(data: T): T => markNode(data) as T;
