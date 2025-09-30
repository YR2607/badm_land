import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const navItems = [
    { path: '/', label: t('navigation.home') },
    { path: '/about', label: t('navigation.about') },
    { path: '/gallery', label: t('navigation.gallery') },
    { path: '/services', label: t('navigation.services') },
    { path: '/gyms', label: t('navigation.gyms') },
    { path: '/blog', label: t('navigation.news') },
    { path: '/contact', label: t('navigation.contacts') }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHome ? (scrolled ? 'glass' : 'bg-transparent') : 'glass'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/altLGOO.jpg" 
              alt="Altius" 
              className="h-9 w-9 rounded-lg object-cover" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className={`text-3xl font-display font-semibold tracking-tight ${isHome && !scrolled ? 'text-white' : 'text-primary-black'}`}>Altius</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-blue'
                    : isHome && !scrolled ? 'text-white hover:text-primary-yellow' : 'text-gray-700 hover:text-primary-blue'
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-blue to-primary-orange" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
          </div>

          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('navigation.closeMenu', 'Закрыть меню') : t('navigation.openMenu', 'Открыть меню')}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <nav 
          id="mobile-menu" 
          className="md:hidden glass"
          role="navigation"
          aria-label={t('navigation.mobileMenu', 'Мобильное меню')}
        >
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`block text-base font-medium transition-colors duration-200 ${isActive(item.path) ? 'text-primary-blue' : 'text-gray-700 hover:text-primary-blue'}`} 
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200">
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
