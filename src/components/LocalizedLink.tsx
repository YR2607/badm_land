import { Link, type LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Wraps react-router Link to prepend the current language prefix.
 * Usage: <LocalizedLink to="/about">...</LocalizedLink>
 * Renders: <Link to="/ro/about">...</Link>
 */
const LocalizedLink = ({ to, ...props }: LinkProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const localizedTo = typeof to === 'string'
    ? to === '/'
      ? `/${lang}`
      : `/${lang}${to}`
    : to; // object form — leave as-is (rare in this codebase)

  return <Link to={localizedTo} {...props} />;
};

export default LocalizedLink;
