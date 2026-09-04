import { Navigate, useLocation } from 'react-router-dom';

const SUPPORTED_LANGS = ['ro', 'ru', 'en'];
const DEFAULT_LANG = 'ro';

/**
 * Redirects bare paths (e.g. /about) to lang-prefixed paths (e.g. /ro/about).
 * Uses saved language preference from localStorage, falls back to default.
 */
const LangRedirect = () => {
  const location = useLocation();
  const saved = localStorage.getItem('i18nextLng');
  const lang = saved && SUPPORTED_LANGS.includes(saved) ? saved : DEFAULT_LANG;
  const target = `/${lang}${location.pathname}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
};

export default LangRedirect;
