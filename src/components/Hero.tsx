import { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchFooter, isCmsEnabled } from '../lib/cms';

interface HeroProps {
  cmsData?: {
    badge?: { icon: string; text: string };
    title: string;
    subtitle: string;
    description?: string;
    statistics?: Array<{ number: string; description: string }>;
  };
}

const Hero = ({ cmsData }: HeroProps) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const finishedRef = useRef<boolean>(false);
  const [heroVideo, setHeroVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!isCmsEnabled) return;
    fetchFooter().then(data => {
      if (data?.heroVideo) setHeroVideo(data.heroVideo);
    });
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    const vid = videoRef.current;
    if (!node || !vid) return;

    const onMeta = () => {
      try { vid.playbackRate = 0.5; } catch { }
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
          vid.play().then(() => { try { vid.playbackRate = 0.5; } catch { } }).catch(() => undefined);
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
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-zenith-white">
      <div className="absolute inset-0 scanlines">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover video-shift-mobile"
          src={heroVideo || "/jump.MP4"}
          autoPlay
          muted
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-zenith-black/40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70vh] md:h-[75vh]">
          <div
            className="w-full h-full bg-zenith-white"
            style={{
              WebkitMaskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.80) 97%, rgba(0,0,0,1) 100%)',
              maskImage:
                'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.01) 10%, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.15) 60%, rgba(0,0,0,0.30) 75%, rgba(0,0,0,0.55) 90%, rgba(0,0,0,0.80) 97%, rgba(0,0,0,1) 100%)'
            }}
          />
        </div>
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 text-center">
        <div>
          {cmsData?.badge?.text && (
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-12">
              <Award className="w-5 h-5 text-zenith-crimson mr-2" />
              <span className="text-sm font-bold text-white tracking-widest uppercase">{cmsData.badge.text}</span>
            </div>
          )}
          <h1
            className="text-7xl md:text-[8rem] lg:text-[12rem] font-extrabold font-display leading-[0.85] mb-8 tracking-tighter uppercase text-white drop-shadow-2xl"
          >
            {cmsData?.title || t('hero.title', 'ALTIUS')}
          </h1>
          {cmsData?.subtitle && (
            <div className="mb-8">
              <div className="inline-block px-8 py-4 bg-zenith-crimson text-white text-2xl md:text-3xl lg:text-5xl font-extrabold font-display uppercase tracking-tight transform -skew-x-12">
                {cmsData.subtitle}
              </div>
            </div>
          )}
          {cmsData?.description && (
            <p
              className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              {cmsData.description}
            </p>
          )}
          {cmsData?.statistics && cmsData.statistics.length > 0 && (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 max-w-5xl mx-auto"
            >
              {cmsData.statistics.map((stat, i) => (
                <div key={i} className="text-center group">
                  <div className="text-3xl md:text-4xl font-black font-display text-zenith-crimson group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-[10px] text-white/50 uppercase tracking-widest font-black leading-tight">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          )}


        </div>
      </div>
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-zenith-black">
        <div className="flex flex-col items-center space-y-4">
          <span className="text-sm font-bold uppercase tracking-[0.4em]">{t('hero.scrollDown', 'Scroll')}</span>
          <div className="w-[2px] h-24 bg-gradient-to-b from-zenith-black to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
