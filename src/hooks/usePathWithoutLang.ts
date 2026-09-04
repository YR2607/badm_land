import { useLocation } from 'react-router-dom';

const LANG_PREFIX_RE = /^\/(ro|ru|en)(?=\/|$)/;

/**
 * Returns the current pathname with the language prefix stripped.
 * e.g. /ro/about → /about, /en → /
 */
export function usePathWithoutLang(): string {
  const location = useLocation();
  return location.pathname.replace(LANG_PREFIX_RE, '') || '/';
}

export default usePathWithoutLang;
