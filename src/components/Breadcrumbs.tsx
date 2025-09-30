import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs = ({ items, className = '' }: BreadcrumbsProps) => {
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

  return (
    <nav 
      aria-label={t('breadcrumbs.navigation', 'Навигационная цепочка')} 
      className={`bg-white border-b border-gray-100 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-sm flex-wrap">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isFirst = index === 0;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    className="w-4 h-4 text-gray-400 mx-2" 
                    aria-hidden="true" 
                  />
                )}
                
                {item.path && !isLast ? (
                  <Link
                    to={item.path}
                    className="flex items-center gap-1.5 text-gray-600 hover:text-primary-blue transition-colors font-medium"
                    aria-label={isFirst ? t('breadcrumbs.home', 'Вернуться на главную') : undefined}
                  >
                    {isFirst && <Home className="w-4 h-4" aria-hidden="true" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span 
                    className="flex items-center gap-1.5 text-gray-900 font-semibold"
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
  );
};

export default Breadcrumbs;
