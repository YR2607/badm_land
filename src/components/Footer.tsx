import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/altLGOO.jpg" alt="Altius" className="h-10 w-auto object-contain" />
              <span className="text-3xl font-display font-bold">Altius</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-blue rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-primary-yellow rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-white text-primary-black rounded-full flex items-center justify-center hover:bg-opacity-80 transition-colors" aria-label="TikTok">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M12.9 2h2.4c.2 1.4 1 2.7 2.2 3.6a7 7 0 0 0 2.5 1v2.3a9.2 9.2 0 0 1-4.7-1.5v6.5c0 3-2.4 5.5-5.5 5.5S5.3 17 5.3 14c0-3 2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v2.5a3 3 0 1 0 2.3 2.9V2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-yellow">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">{t('navigation.home')}</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">{t('navigation.about')}</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">{t('navigation.services')}</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">{t('navigation.news')}</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">{t('navigation.contacts')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-yellow">{t('contact.title')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary-orange mt-1" size={18} />
                <span className="text-gray-300">{t('footer.contact.address', 'Chișinău, str. Example 123')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary-blue" size={18} />
                <span className="text-gray-300">{t('footer.contact.phone', '+373 60 123 456')}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary-yellow" size={18} />
                <span className="text-gray-300">{t('footer.contact.email', 'info@altius.md')}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="text-primary-orange mt-1" size={18} />
                <div className="text-gray-300">
                  <div>{t('footer.contact.hours.weekdays', 'Mon-Fri: 06:00-22:00')}</div>
                  <div>{t('footer.contact.hours.weekends', 'Sat-Sun: 08:00-20:00')}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Altius Badminton Club. {t('footer.allRightsReserved')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.legal.privacy', 'Политика конфиденциальности')}
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.legal.terms', 'Условия использования')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
