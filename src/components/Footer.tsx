import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Logo size="lg" className="brightness-0 invert" />
              <span className="text-3xl font-display font-bold">Altius</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Профессиональный бадминтонный клуб в Кишиневе. Мы предлагаем тренировки для всех уровней, 
              от начинающих до профессиональных спортсменов.
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-yellow">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Главная</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">О клубе</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Услуги</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Новости</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Контакты</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary-yellow">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="text-primary-orange mt-1" size={18} />
                <span className="text-gray-300">Кишинев, ул. Примерная 123</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="text-primary-blue" size={18} />
                <span className="text-gray-300">+373 60 123 456</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="text-primary-yellow" size={18} />
                <span className="text-gray-300">info@altius.md</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="text-primary-orange mt-1" size={18} />
                <div className="text-gray-300">
                  <div>Пн-Пт: 06:00-22:00</div>
                  <div>Сб-Вс: 08:00-20:00</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Altius Badminton Club. Все права защищены.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
