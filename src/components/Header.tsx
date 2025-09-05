import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
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
    { path: '/', label: 'Главная' },
    { path: '/about', label: 'О клубе' },
    { path: '/gallery', label: 'Галерея' },
    { path: '/services', label: 'Услуги' },
    { path: '/blog', label: 'Новости' },
    { path: '/contact', label: 'Контакты' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHome ? (scrolled ? 'glass' : 'bg-transparent') : 'glass'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/altLGOO.jpg" alt="Altius" className="h-9 w-9 rounded-lg object-cover" />
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
            <Link to="/contact" className={`${isHome && !scrolled ? 'bg-white/15 text-white border border-white/30 hover:bg-white/25' : 'btn-secondary' } px-5 py-2 rounded-lg font-medium transition-colors`}>
              Записаться
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden glass">
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} className={`block text-base font-medium transition-colors duration-200 ${isActive(item.path) ? 'text-primary-blue' : 'text-gray-700 hover:text-primary-blue'}`} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/contact" className="block btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
              Записаться
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
