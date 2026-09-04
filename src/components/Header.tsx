import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocalizedLink from './LocalizedLink';
import LanguageSwitcher from './LanguageSwitcher';
import { fetchFooter, isCmsEnabled } from '../lib/cms';
import { usePathWithoutLang } from '../hooks/usePathWithoutLang';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathWithoutLang = usePathWithoutLang();
  const isHome = pathWithoutLang === '/';
  const [scrolled, setScrolled] = useState(false);
  const [brand, setBrand] = useState<{ name: string; logo: string } | null>(null);

  useEffect(() => {
    if (!isCmsEnabled) return;
    fetchFooter(i18n.language).then(data => {
      if (data) setBrand({ name: data.brandName || 'Altius', logo: data.logo || '/altLGOO.jpg' });
    });
  }, [i18n.language]);

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const brandName = brand?.name || 'Altius';
  const logoUrl = brand?.logo || '/altLGOO.jpg';

  const navItems = [
    { path: '/', label: t('navigation.home') },
    { path: '/about', label: t('navigation.about') },
    { path: '/gallery', label: t('navigation.gallery') },
    { path: '/services', label: t('navigation.services') },
    { path: '/gyms', label: t('navigation.gyms') },
    { path: '/blog', label: t('navigation.news') },
    { path: '/contact', label: t('navigation.contacts') }
  ];

  const isActive = (path: string) => pathWithoutLang === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isHome ? (scrolled ? 'bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm' : 'bg-transparent') : 'bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm'}`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <LocalizedLink to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src={logoUrl}
                alt={brandName}
                className="h-10 w-10 rounded-xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 rounded-xl ring-1 ring-black/5" />
            </div>
            <span className={`text-3xl font-display font-black uppercase tracking-tighter transition-colors duration-300 ${isHome && !scrolled ? 'text-white' : 'text-zenith-black'}`}>{brandName}</span>
          </LocalizedLink>

          <nav className="hidden xl:flex items-center space-x-10">
            {navItems.map((item) => (
              <LocalizedLink
                key={item.path}
                to={item.path}
                className={`relative text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-zenith-crimson ${isActive(item.path)
                  ? 'text-zenith-crimson'
                  : isHome && !scrolled ? 'text-white/80 hover:text-white' : 'text-zenith-black/60 hover:text-zenith-black'
                  }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-zenith-crimson rounded-full transition-all duration-300" />
                )}
              </LocalizedLink>
            ))}
          </nav>

          <div className="hidden xl:flex items-center space-x-6">
            <div className={`h-8 w-[1px] transition-colors ${isHome && !scrolled ? 'bg-white/20' : 'bg-gray-200'}`} />
            <LanguageSwitcher />
          </div>

          <button
            className={`xl:hidden p-3 rounded-2xl transition-colors ${isHome && !scrolled ? 'text-white bg-white/10' : 'text-zenith-black bg-gray-100'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? t('navigation.closeMenu') : t('navigation.openMenu')}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <nav
        aria-hidden={!isMenuOpen}
        className={`xl:hidden bg-white border-b border-gray-100 shadow-2xl overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-5 invisible pointer-events-none'
        }`}
      >
        <div className="px-6 py-10 space-y-6">
          {navItems.map((item) => (
            <LocalizedLink
              key={item.path}
              to={item.path}
              className={`block text-2xl font-black uppercase tracking-tighter transition-colors ${isActive(item.path) ? 'text-zenith-crimson' : 'text-zenith-black hover:text-zenith-crimson'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </LocalizedLink>
          ))}
          <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t('navigation.languageSelect')}</span>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
