import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import JsonLd from './JsonLd';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  isDark?: boolean;
}

const Breadcrumbs = ({ items, className = '', isDark = false }: BreadcrumbsProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  // Автоматическая генерация breadcrumbs из URL если items не переданы
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);

    const breadcrumbs: BreadcrumbItem[] = [
      { label: t('navigation.home'), path: '/' }
    ];

    // Маппинг путей на читаемые названия
    const pathLabels: Record<string, string> = {
      'about': t('navigation.about'),
      'services': t('navigation.services'),
      'gyms': t('navigation.gyms'),
      'gallery': t('navigation.gallery'),
      'blog': t('navigation.news'),
      'contact': t('navigation.contacts'),
    };

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;

      // Последний элемент без ссылки
      if (index === pathnames.length - 1) {
        breadcrumbs.push({
          label: pathLabels[pathname] || decodeURIComponent(pathname),
        });
      } else {
        breadcrumbs.push({
          label: pathLabels[pathname] || decodeURIComponent(pathname),
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  // Не показываем breadcrumbs на главной странице
  if (location.pathname === '/') {
    return null;
  }

  // BreadcrumbList structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      ...(item.path ? { "item": `https://altius.md${item.path}` } : {})
    }))
  };

  return (
    <>
    <JsonLd data={breadcrumbSchema} />
    <nav
      aria-label={t('breadcrumbs.navigation', 'Навигационная цепочка')}
      className={`${isDark ? 'bg-transparent' : 'bg-white border-b border-gray-100'} ${className}`}
    >
      <div className={`${isDark ? '' : 'max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>
        <ol className="flex items-center space-x-2 text-sm flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight
                    className={`w-4 h-4 mx-2 ${isDark ? 'text-white/30' : 'text-gray-400'}`}
                    aria-hidden="true"
                  />
                )}

                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 transition-colors font-medium ${isDark ? 'text-white/60 hover:text-zenith-crimson' : 'text-gray-600 hover:text-primary-blue'}`}
                    aria-label={isFirst ? t('breadcrumbs.home', 'Вернуться на главную') : undefined}
                  >
                    {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                    aria-current="page"
                  >
                    {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
    </>
  );
};

export default Breadcrumbs;
