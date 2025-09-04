import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchGallerySections, fetchTournamentCategories, isCmsEnabled } from '../lib/cms';

const sections = [
  { id: 'hall', title: 'Наш зал', gradient: 'from-blue-500 to-blue-600' },
  { id: 'coaches', title: 'Наши тренера', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'trainings', title: 'Наши тренировки', gradient: 'from-green-500 to-teal-500' },
  { id: 'tournaments', title: 'Наши турниры', gradient: 'from-purple-500 to-indigo-500' },
];

type TournamentCategory = { id: string; name: string; gradient: string; photos: string[]; videos: string[] };

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

const Gallery: React.FC = () => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hall');
  const [lightbox, setLightbox] = useState<{ items: { type: 'image'|'video'; src: string; alt?: string }[]; index: number } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [tabByCat, setTabByCat] = useState<Record<string, 'photo'|'video'>>({});

  const [sectionImages, setSectionImages] = useState<Record<string, string[]>>({ hall: [], coaches: [], trainings: [] });
  const [categories, setCategories] = useState<TournamentCategory[]>([]);

  // If CMS is enabled, fetch from CMS. Else import from filesystem via glob
  useEffect(() => {
    const load = async () => {
      if (isCmsEnabled) {
        const [sec, cats] = await Promise.all([
          fetchGallerySections(),
          fetchTournamentCategories(),
        ]);
        setSectionImages({ hall: sec.hall || [], coaches: sec.coaches || [], trainings: sec.trainings || [] });
        const gradients = ['from-blue-500 to-blue-600','from-yellow-500 to-orange-500','from-purple-500 to-indigo-500','from-green-500 to-teal-500','from-orange-500 to-red-500'];
        setCategories(cats.map((c, idx) => ({ ...c, gradient: gradients[idx % gradients.length] })));
      } else {
        const hall = Object.values(import.meta.glob('/src/assets/gallery/hall/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' })) as string[];
        const coaches = Object.values(import.meta.glob('/src/assets/gallery/coaches/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' })) as string[];
        const trainings = Object.values(import.meta.glob('/src/assets/gallery/trainings/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' })) as string[];
        setSectionImages({ hall, coaches, trainings });
        const photoGlobs = import.meta.glob('/src/assets/gallery/tournaments/*/photos/*.{jpg,jpeg,png,webp,avif}', { eager: true, as: 'url' }) as Record<string, string>;
        const videoGlobs = import.meta.glob('/src/assets/gallery/tournaments/*/videos/*.{mp4,webm}', { eager: true, as: 'url' }) as Record<string, string>;
        const catIdToPhotos: Record<string, string[]> = {};
        const catIdToVideos: Record<string, string[]> = {};
        Object.entries(photoGlobs).forEach(([path, url]) => {
          const match = path.match(/tournaments\/(.*?)\/photos\//);
          if (!match) return; const id = match[1];
          if (!catIdToPhotos[id]) catIdToPhotos[id] = []; catIdToPhotos[id].push(url);
        });
        Object.entries(videoGlobs).forEach(([path, url]) => {
          const match = path.match(/tournaments\/(.*?)\/videos\//);
          if (!match) return; const id = match[1];
          if (!catIdToVideos[id]) catIdToVideos[id] = []; catIdToVideos[id].push(url);
        });
        const ids = Array.from(new Set([...Object.keys(catIdToPhotos), ...Object.keys(catIdToVideos)])).sort();
        const gradients = ['from-blue-500 to-blue-600','from-yellow-500 to-orange-500','from-purple-500 to-indigo-500','from-green-500 to-teal-500','from-orange-500 to-red-500'];
        setCategories(ids.map((id, idx) => ({ id, name: slugToName(id), photos: (catIdToPhotos[id]||[]).sort(), videos: (catIdToVideos[id]||[]).sort(), gradient: gradients[idx % gradients.length] })));
      }
    };
    load();
  }, []);

  useEffect(() => {
    const init: Record<string, 'photo'|'video'> = {};
    categories.forEach(c => { init[c.id] = 'photo'; });
    setTabByCat(init);
  }, [categories]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).id;
          if (id) setActiveSection(id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const openLightbox = (items: { type: 'image'|'video'; src: string; alt?: string }[], index: number) => {
    setLightbox({ items, index });
  };
  const closeLightbox = () => setLightbox(null);
  const nextItem = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : lb);
  const prevItem = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : lb);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextItem();
      if (e.key === 'ArrowLeft') prevItem();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const pillClasses = (id: string) => `px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSection === id ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 hover:bg-primary-blue/10'}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="section-title">Галерея</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Фотографии нашего клуба, тренеров, тренировок и турниров</p>
        </div>

        {/* Sticky filter pills */}
        <div className="sticky top-16 z-20 -mt-6 mb-12 bg-white/80 backdrop-blur px-2 py-3 rounded-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className={pillClasses(s.id)}>{s.title}</a>
            ))}
          </div>
        </div>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mb-20" ref={(el) => (sectionRefs.current[s.id] = el)}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl text-white bg-gradient-to-r ${s.gradient} mb-4`}>📸</div>
              <h2 className="text-3xl font-bold text-gray-900">{s.title}</h2>
            </div>

            {s.id === 'hall' && (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                {(sectionImages.hall || []).map((src, i) => (
                  <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                    <img 
                      src={src} 
                      alt={s.title}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      onClick={() => openLightbox([{ type: 'image', src, alt: s.title }], 0)}
                    />
                    <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </figure>
                ))}
              </div>
            )}

            {s.id === 'coaches' && (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                {(sectionImages.coaches || []).map((src, i) => (
                  <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                    <img src={src} alt={s.title} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]" onClick={() => openLightbox([{ type: 'image', src, alt: s.title }], 0)} />
                    <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </figure>
                ))}
              </div>
            )}

            {s.id === 'trainings' && (
              <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                {(sectionImages.trainings || []).map((src, i) => (
                  <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                    <img src={src} alt={s.title} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]" onClick={() => openLightbox([{ type: 'image', src, alt: s.title }], 0)} />
                    <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </figure>
                ))}
              </div>
            )}

            {s.id === 'tournaments' && (
              <div className="space-y-8">
                {categories.map((cat) => (
                  <div key={cat.id} className="bg-white rounded-2xl">
                    <button
                      className="w-full flex items-center justify-between px-6 py-4"
                      onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${cat.gradient}`}></div>
                        <span className="text-xl font-semibold text-gray-900">{cat.name}</span>
                      </div>
                      <span className="text-primary-blue font-medium">{openCategory === cat.id ? 'Скрыть' : 'Показать'}</span>
                    </button>
                    {openCategory === cat.id && (
                      <div className="px-6 pb-6">
                        {/* Tabs */}
                        <div className="flex items-center gap-2 mb-4">
                          {(['photo','video'] as const).map((t) => (
                            <button
                              key={t}
                              className={`px-4 py-2 rounded-full text-sm font-medium ${ (tabByCat[cat.id] ?? 'photo') === (t === 'photo' ? 'photo' : 'video') ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 hover:bg-primary-blue/10'}`}
                              onClick={() => setTabByCat((prev) => ({ ...prev, [cat.id]: t === 'photo' ? 'photo' : 'video' }))}
                            >
                              {t === 'photo' ? 'Фото' : 'Видео'}
                            </button>
                          ))}
                        </div>
                        {/* Content */}
                        { (tabByCat[cat.id] ?? 'photo') === 'photo' ? (
                          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                            {cat.photos.length === 0 && (
                              <div className="col-span-full text-gray-500">Фото скоро появятся</div>
                            )}
                            {cat.photos.map((src, i) => (
                              <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                                <img
                                  src={src}
                                  alt={cat.name}
                                  loading="lazy"
                                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                  onClick={() => openLightbox(cat.photos.map(p => ({ type: 'image' as const, src: p, alt: cat.name })), i)}
                                />
                                <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              </figure>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {cat.videos.length === 0 && (
                              <div className="col-span-full text-gray-500">Видео скоро появятся</div>
                            )}
                            {cat.videos.map((src, i) => (
                              <div key={i} className="rounded-2xl overflow-hidden">
                                <video src={src} className="w-full" controls />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" role="dialog" aria-modal="true">
          <button className="absolute top-6 right-6 text-white text-xl" onClick={closeLightbox} aria-label="Закрыть">✕</button>
          <button className="absolute left-4 md:left-8 text-white text-3xl" onClick={prevItem} aria-label="Предыдущее">‹</button>
          <button className="absolute right-4 md:right-8 text-white text-3xl" onClick={nextItem} aria-label="Следующее">›</button>
          <div className="max-w-5xl w-full px-4">
            {lightbox.items[lightbox.index].type === 'image' ? (
              <img src={lightbox.items[lightbox.index].src} alt={lightbox.items[lightbox.index].alt || ''} className="w-full h-auto object-contain rounded-2xl" />
            ) : (
              <video src={lightbox.items[lightbox.index].src} className="w-full" controls autoPlay />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
