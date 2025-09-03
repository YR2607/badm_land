import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Award, Users, MapPin } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image/Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-black via-primary-blue to-primary-gray-800">
        {/* Large background pattern/image */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-white opacity-20">
          <div className="text-[20rem] leading-none">🏸</div>
        </div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-64 h-64 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-16 w-32 h-32 border border-primary-yellow/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 border border-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 border border-primary-orange/40 rounded-full animate-bounce-slow"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Award className="w-5 h-5 text-primary-yellow mr-2" />
            <span className="text-sm font-medium text-white">Профессиональный клуб с 2010 года</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="text-white">ALTIUS</span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-light text-primary-yellow italic font-display">
              Бадминтонный клуб
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Профессиональные тренировки, современное оборудование и дружелюбная атмосфера 
            в самом современном бадминтонном клубе Кишинева
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <button className="px-10 py-5 bg-gradient-to-r from-primary-yellow to-primary-orange text-white font-medium rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 tracking-wide">
              Записаться на пробное занятие
              <ArrowRight className="ml-3 w-5 h-5 inline" />
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-medium rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-500 shadow-xl tracking-wide">
              <Play className="mr-3 w-5 h-5 inline" />
              Посмотреть видео
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-white/70">Участников</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-yellow mb-1">8</div>
              <div className="text-white/70">Кортов</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">15</div>
              <div className="text-white/70">Лет опыта</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-sm">Прокрутите вниз</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </motion.div>


    </section>
  );
};

export default Hero;
