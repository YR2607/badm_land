import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, User, MessageSquare } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    service: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      service: ''
    });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Адрес',
      content: 'ул. Примерная 123, Кишинев, Молдова',
      color: 'from-primary-blue to-blue-600'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Телефон',
      content: '+373 60 123 456',
      color: 'from-primary-orange to-orange-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      content: 'info@altius.md',
      color: 'from-primary-yellow to-yellow-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Часы работы',
      content: 'Пн-Пт: 06:00-22:00\nСб-Вс: 08:00-20:00',
      color: 'from-gray-600 to-gray-800'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-blue to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
              Свяжитесь с нами
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Готовы начать свой путь в бадминтоне? Мы ждем вас!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="card text-center group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600 whitespace-pre-line">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="card">
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                  Отправьте нам сообщение
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Имя *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          placeholder="Ваше имя"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        placeholder="+373 60 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Интересующая услуга
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    >
                      <option value="">Выберите услугу</option>
                      <option value="group">Групповые тренировки</option>
                      <option value="individual">Индивидуальные занятия</option>
                      <option value="competition">Подготовка к соревнованиям</option>
                      <option value="court">Аренда корта</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Сообщение *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent resize-none"
                        placeholder="Расскажите нам о ваших целях и вопросах..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center"
                  >
                    <Send className="mr-2 w-5 h-5" />
                    Отправить сообщение
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="card h-full">
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-6">
                  Как нас найти
                </h2>
                
                {/* Map Placeholder */}
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary-blue mx-auto mb-4" />
                    <p className="text-gray-600">Интерактивная карта</p>
                    <p className="text-sm text-gray-500">ул. Примерная 123, Кишинев</p>
                  </div>
                </div>

                {/* Directions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Как добраться:</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      На общественном транспорте: автобусы №5, 12, 27 до остановки "Центр"
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-orange rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      На автомобиле: парковка рядом с входом (бесплатная для участников)
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-primary-yellow rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Пешком: 5 минут от центральной площади
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
