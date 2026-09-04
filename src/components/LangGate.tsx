import { useEffect } from 'react';
import { useParams, useLocation, Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGS = ['ro', 'ru', 'en'];
const DEFAULT_LANG = 'ro';

/**
 * Wraps lang-prefixed routes. Reads :lang from URL, syncs i18n language,
 * and redirects invalid lang segments to the default language.
 */
const LangGate = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const { i18n } = useTranslation();

  const isValid = lang && SUPPORTED_LANGS.includes(lang);

  useEffect(() => {
    if (isValid && i18n.language !== lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem('i18nextLng', lang);
    }
  }, [lang, isValid, i18n]);

  if (!isValid) {
    const restPath = location.pathname
      .split('/')
      .slice(2) // drop ['', 'invalidLang']
      .join('/');
    const target = `/${DEFAULT_LANG}${restPath ? '/' + restPath : ''}${location.search}${location.hash}`;
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};

export default LangGate;
