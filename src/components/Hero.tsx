import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Award } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const Hero: React.FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const finishedRef = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('home');
      setPage(data);
    })();
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    const vid = videoRef.current;
    if (!node || !vid) return;

    const onMeta = () => {
      try { vid.playbackRate = 0.5; } catch {}
    };
    vid.addEventListener('loadedmetadata', onMeta);

    const onEnded = () => {
      finishedRef.current = true;
      vid.pause();
    };
    vid.addEventListener('ended', onEnded);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!vid) return;
        if (finishedRef.current) return;
        if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
          vid.play().then(() => { try { vid.playbackRate = 0.5; } catch {} }).catch(() => undefined);
        } else {
          vid.pause();
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      vid.removeEventListener('ended', onEnded);
      vid.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/jump.MP4"
          autoPlay
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/45" />
        {/* ultra-smooth bottom fade into white via CSS mask */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] md:h-[55vh]">
          <div
            className="w-full h-full bg-white"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 18%, rgba(0,0,0,0.06) 36%, rgba(0,0,0,0.14) 54%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.52) 86%, rgba(0,0,0,1) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 18%, rgba(0,0,0,0.06) 36%, rgba(0,0,0,0.14) 54%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.52) 86%, rgba(0,0,0,1) 100%)'
            }}
          />
        </div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-center text-white">
        {/* increased top padding so video is visible under transparent header */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <motion.div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
            <Award className="w-5 h-5 text-primary-yellow mr-2" />
            <span className="text-sm font-medium text-white">Профессиональный клуб с 2010 года</span>
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-8 leading-tight" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <span className="text-white">{page?.heroTitle || 'ALTIUS'}</span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl font-light text-primary-yellow italic font-display">{page?.heroSubtitle || 'Бадминтонный клуб'}</span>
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
            Профессиональные тренировки, современное оборудование и дружелюбная атмосфера в самом современном бадминтонном клубе Кишинева
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}>
            <button className="px-10 py-5 bg-gradient-to-r from-primary-yellow to-primary-orange text-white font-medium rounded-2xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 tracking-wide">
              Записаться на пробное занятие
              <ArrowRight className="ml-3 w-5 h-5 inline" />
            </button>
            <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white font-medium rounded-2xl border border-white/30 hover:bg-white/20 transition-all duration-500 shadow-xl tracking-wide">
              Посмотреть видео
            </button>
          </motion.div>
        </motion.div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.6 }}>
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
