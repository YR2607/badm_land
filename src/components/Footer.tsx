import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-zenith-white pt-24 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Main Brand Block */}
          <div className="md:col-span-12 lg:col-span-5 bg-zenith-black rounded-[2.5rem] p-10 md:p-16 text-white flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-zenith-crimson/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-zenith-crimson/30 transition-colors duration-700" />

            <div className="relative z-10">
              <Link to="/" className="flex items-center space-x-4 mb-10">
                <img
                  src="/altLGOO.jpg"
                  alt="Altius"
                  className="h-14 w-14 rounded-2xl object-cover"
                />
                <span className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">Altius</span>
              </Link>
              <p className="text-xl md:text-2xl text-white/60 font-medium max-w-md leading-relaxed mb-12">
                {t('footer.description')}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap gap-4">
              {[
                { icon: <Facebook size={24} />, label: 'FB', color: 'hover:bg-[#1877F2]' },
                { icon: <Instagram size={24} />, label: 'IG', color: 'hover:bg-[#E4405F]' },
                { icon: <Youtube size={24} />, label: 'YT', color: 'hover:bg-[#FF0000]' },
                { icon: <div className="w-6 h-6"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.9 2h2.4c.2 1.4 1 2.7 2.2 3.6a7 7 0 0 0 2.5 1v2.3a9.2 9.2 0 0 1-4.7-1.5v6.5c0 3-2.4 5.5-5.5 5.5S5.3 17 5.3 14c0-3 2.4-5.4 5.4-5.4c.3 0 .6 0 .9.1v2.5a3 3 0 1 0 2.3 2.9V2z" /></svg></div>, label: 'TK', color: 'hover:bg-black hover:ring-1 hover:ring-white/50' }
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-16 h-16 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Block */}
          <div className="md:col-span-6 lg:col-span-3 bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zenith-black/30 mb-10">Navigation</h3>
              <ul className="space-y-4">
                {[
                  { path: '/', label: t('navigation.home') },
                  { path: '/about', label: t('navigation.about') },
                  { path: '/services', label: t('navigation.services') },
                  { path: '/blog', label: t('navigation.news') },
                  { path: '/contact', label: t('navigation.contacts') }
                ].map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-zenith-black hover:text-zenith-crimson transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Block */}
          <div className="md:col-span-6 lg:col-span-4 bg-white border border-gray-100 rounded-[2.5rem] p-10 md:p-12 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-zenith-black/5 rotate-45 translate-x-12 -translate-y-12" />

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zenith-black/30 mb-10">Contact Info</h3>
              <ul className="space-y-8">
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zenith-black rounded-xl flex items-center justify-center text-white shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zenith-black/30 mb-1">Address</span>
                    <span className="text-lg font-bold text-zenith-black">{t('footer.contact.address', 'Chișinău, str. Example 123')}</span>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zenith-black rounded-xl flex items-center justify-center text-white shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zenith-black/30 mb-1">Phone</span>
                    <span className="text-lg font-bold text-zenith-black">{t('footer.contact.phone', '+373 60 123 456')}</span>
                  </div>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-zenith-black rounded-xl flex items-center justify-center text-white shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-zenith-black/30 mb-1">Working Hours</span>
                    <div className="text-lg font-bold text-zenith-black leading-tight">
                      <div>{t('footer.contact.hours.weekdays', 'Mon-Fri: 06:00-22:00')}</div>
                      <div>{t('footer.contact.hours.weekends', 'Sat-Sun: 08:00-20:00')}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center px-10">
          <p className="text-zenith-black/40 text-xs font-black uppercase tracking-widest mb-4 md:mb-0">
            © {new Date().getFullYear()} Altius Badminton Club. {t('footer.allRightsReserved')}
          </p>
          <div className="flex space-x-8">
            <Link to="/privacy" className="text-zenith-black/40 hover:text-zenith-crimson text-xs font-black uppercase tracking-widest transition-colors">
              {t('footer.legal.privacy', 'Privacy Policy')}
            </Link>
            <Link to="/terms" className="text-zenith-black/40 hover:text-zenith-crimson text-xs font-black uppercase tracking-widest transition-colors">
              {t('footer.legal.terms', 'Terms of Use')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
