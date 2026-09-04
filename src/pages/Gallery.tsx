import { type FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallerySections, fetchTournamentCategories, isCmsEnabled } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { Image as ImageIcon, Video as VideoIcon, X, ArrowLeft, ArrowRight, Trophy, Search, RotateCcw, Maximize2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InnerHero from '../components/InnerHero';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';

type TournamentCategory = { id: string; name: string; gradient: string; photos: string[]; videos: string[]; year?: number; tags?: string[]; cover?: string };

const Gallery: FC = () => {
  const { t } = useTranslation();
  const [overlayCatId, setOverlayCatId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hall');
  const [lightbox, setLightbox] = useState<{ items: { type: 'image' | 'video'; src: string; alt?: string }[]; index: number } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [tabByCat, setTabByCat] = useState<Record<string, 'photo' | 'video'>>({});
  const [filters, setFilters] = useState<{ q: string; year: number | 'all'; tags: string[] }>({ q: '', year: 'all', tags: [] });
  const [visibleByCat, setVisibleByCat] = useState<Record<string, number>>({});

  const [sectionImages, setSectionImages] = useState<Record<string, string[]>>({ hall: [] });
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const lightboxScrollRestoreRef = useRef<{ el: HTMLElement | Window; top: number } | null>(null);
  const overlayWindowScrollRef = useRef<number>(0);
  const [categories, setCategories] = useState<TournamentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const sections = [
    { id: 'hall', title: t('gallery.sections.hall'), icon: ImageIcon },
    { id: 'tournaments', title: t('gallery.sections.tournaments'), icon: Trophy },
  ];

  useEffect(() => {
    const load = async () => {
      if (!isCmsEnabled) { setSectionImages({ hall: [] }); setCategories([]); setLoading(false); return; }
      const [sec, cats] = await Promise.all([
        fetchGallerySections(),
        fetchTournamentCategories(),
      ]);
      const markedSections = addCmsDevMarkers(sec || {});
      const markedCats = addCmsDevMarkers(cats || []);
      setSectionImages({ hall: markedSections.hall || [] });
      setCategories((markedCats || []).map((c: any, idx: number) => ({ ...c, gradient: '' })));
      setLoading(false);
    };
    load();
  }, []);

  useEffect(() => {
    const init: Record<string, 'photo' | 'video'> = {};
    categories.forEach(c => { init[c.id] = 'photo'; });
    setTabByCat(init);
  }, [categories]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { const id = (entry.target as HTMLElement).id; if (id) setActiveSection(id); } });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach((s) => { const el = sectionRefs.current[s.id]; if (el) observerRef.current?.observe(el); });
    return () => observerRef.current?.disconnect();
  }, []);

  const openLightbox = (items: { type: 'image' | 'video'; src: string; alt?: string }[], index: number) => {
    if (overlayCatId && overlayScrollRef.current) {
      lightboxScrollRestoreRef.current = { el: overlayScrollRef.current, top: overlayScrollRef.current.scrollTop };
    } else {
      lightboxScrollRestoreRef.current = { el: window, top: window.scrollY || document.documentElement.scrollTop || 0 };
    }
    setLightbox({ items, index });
  }
  const closeLightbox = () => {
    setLightbox(null);
    const saved = lightboxScrollRestoreRef.current;
    if (saved) {
      if (saved.el === window) {
        window.scrollTo({ top: saved.top, behavior: 'auto' });
      } else {
        try { (saved.el as HTMLElement).scrollTop = saved.top; } catch { }
      }
    }
  };
  const nextItem = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index + 1) % lb.items.length } : lb);
  const prevItem = () => setLightbox((lb) => lb ? { ...lb, index: (lb.index - 1 + lb.items.length) % lb.items.length } : lb);

  const openOverlay = (catId: string) => {
    overlayWindowScrollRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    setOverlayCatId(catId);
  };

  const closeOverlay = () => {
    setOverlayCatId(null);
    const top = overlayWindowScrollRef.current || 0;
    window.requestAnimationFrame(() => window.scrollTo({ top, behavior: 'auto' }));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && overlayCatId && !lightbox) { e.preventDefault(); closeOverlay(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlayCatId, lightbox]);

  useEffect(() => {
    const original = document.body.style.overflow;
    if (overlayCatId || lightbox) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = original; }
    return () => { document.body.style.overflow = original };
  }, [overlayCatId, lightbox]);

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

  const applyFilters = (list: TournamentCategory[]) => {
    return list.filter(cat => {
      const qok = filters.q.trim() === '' || cat.name.toLowerCase().includes(filters.q.toLowerCase());
      const yok = filters.year === 'all' || (cat as any).year === filters.year;
      const tok = filters.tags.length === 0 || filters.tags.every(t => ((cat as any).tags || []).includes(t));
      return qok && yok && tok;
    });
  };

  const years = Array.from(new Set(categories.map((c: any) => c.year).filter(Boolean))).sort((a, b) => b - a);
  const allTags = Array.from(new Set(categories.flatMap((c: any) => c.tags || [])));

  const filteredCats = applyFilters(categories);
  const groupedByYear = filteredCats.reduce<Record<string, TournamentCategory[]>>((acc, c: any) => {
    const y = c.year ? String(c.year) : t('gallery.other');
    acc[y] = acc[y] || [];
    acc[y].push(c);
    return acc;
  }, {});

  const loadMore = (catId: string) => {
    setVisibleByCat(v => ({ ...v, [catId]: Math.min((v[catId] ?? 30) + 30, (categories.find(c => c.id === catId)?.photos.length || 0)) }));
  };

  const hasActiveFilters = filters.q || filters.year !== 'all' || filters.tags.length > 0;

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={`Altius — ${t('navigation.gallery')}`}
        description={t('gallery.subtitle')}
        image="https://altius.md/og-gallery.jpg"
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `Altius — ${t('navigation.gallery')}`,
        "url": "https://altius.md/gallery",
        "description": t('gallery.subtitle'),
        "isPartOf": { "@type": "WebSite", "name": "Altius Badminton Club", "url": "https://altius.md/" }
      }} />

      <InnerHero
        title={t('navigation.gallery')}
        subtitle={t('gallery.subtitle')}
      />

      {/* Section tabs — sticky below fixed header */}
      <div className="sticky top-20 z-30 py-4 bg-zenith-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {sections.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeSection === s.id
                    ? 'bg-zenith-black text-white shadow-lg shadow-zenith-black/20'
                    : 'text-gray-600 hover:text-zenith-crimson hover:bg-gray-50'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {s.title}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <section
              key={s.id}
              id={s.id}
              className="py-20"
              ref={(el) => { sectionRefs.current[s.id] = el; }}
            >
              {/* Section header */}
              <div className="flex items-center gap-5 mb-12">
                <div className="w-16 h-16 rounded-2xl bg-zenith-black flex items-center justify-center shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-5xl font-black font-display text-zenith-black uppercase tracking-tight leading-none">
                    {s.title}
                  </h2>
                  <div className="w-16 h-1 bg-zenith-crimson mt-3 rounded-full" />
                </div>
              </div>

              {/* Photos section — masonry gallery */}
              {s.id !== 'tournaments' && (
                loading ? (
                  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="break-inside-avoid rounded-2xl bg-gray-100 animate-pulse" style={{ height: `${200 + (i % 4) * 80}px` }} />
                    ))}
                  </div>
                ) : (sectionImages[s.id] || []).length === 0 ? (
                  <div className="text-center py-24">
                    <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      {isCmsEnabled ? t('gallery.noMaterials') : t('gallery.cmsNotConfigured')}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Photo count */}
                    <div className="mb-6 text-xs font-black uppercase tracking-widest text-gray-400">
                      {(sectionImages[s.id] || []).length} {t('gallery.photo')}
                    </div>
                    {/* Masonry — natural photo proportions, no cropping */}
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
                      {(sectionImages[s.id] || []).map((src, i) => (
                        <div
                          key={i}
                          className="relative group rounded-2xl overflow-hidden cursor-pointer mb-4 break-inside-avoid shadow-sm hover:shadow-2xl transition-shadow duration-500"
                          onClick={() => openLightbox(
                            (sectionImages[s.id] || []).map(p => ({ type: 'image' as const, src: p, alt: s.title })),
                            i
                          )}
                        >
                          <img
                            src={src}
                            alt={`${s.title} — ${t('gallery.title')} ${i + 1}`}
                            loading="lazy"
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Hover overlay with zoom icon */}
                          <div className="absolute inset-0 bg-zenith-black/0 group-hover:bg-zenith-black/30 transition-colors duration-300 flex items-end justify-end p-4">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                                <Maximize2 className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              )}

              {/* Tournaments section */}
              {s.id === 'tournaments' && (
                loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="rounded-3xl overflow-hidden bg-white border border-gray-100 animate-pulse">
                        <div className="h-56 bg-gray-100" />
                        <div className="p-6">
                          <div className="h-5 w-2/3 bg-gray-100 rounded-lg mb-3" />
                          <div className="h-4 w-1/2 bg-gray-50 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-24">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
                      {isCmsEnabled ? t('gallery.noMaterials') : t('gallery.cmsNotConfigured')}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Filter bar */}
                    <div className="flex flex-wrap items-center gap-3 mb-12 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          value={filters.q}
                          onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
                          placeholder={t('gallery.searchTournament')}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-zenith-crimson transition-all"
                        />
                      </div>
                      {years.length > 0 && (
                        <select
                          value={String(filters.year)}
                          onChange={e => setFilters(f => ({ ...f, year: e.target.value === 'all' ? 'all' : Number(e.target.value) }))}
                          className="px-4 py-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-zenith-crimson transition-all outline-none cursor-pointer"
                        >
                          <option value="all">{t('gallery.allYears')}</option>
                          {years.map(y => (<option key={y} value={y}>{y}</option>))}
                        </select>
                      )}
                      {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {allTags.map(tag => (
                            <button
                              key={tag}
                              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filters.tags.includes(tag)
                                ? 'bg-zenith-crimson text-white shadow-md shadow-zenith-crimson/20'
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                }`}
                              onClick={() => setFilters(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(x => x !== tag) : [...f.tags, tag] }))}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                      {hasActiveFilters && (
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-zenith-crimson hover:text-zenith-black transition-colors"
                          onClick={() => setFilters({ q: '', year: 'all', tags: [] })}
                        >
                          <RotateCcw className="w-3 h-3" />
                          {t('gallery.reset')}
                        </button>
                      )}
                    </div>

                    {/* Tournament cards grouped by year */}
                    {Object.entries(groupedByYear).sort((a, b) => (b[0] > a[0] ? 1 : -1)).map(([year, cats]) => (
                      <div key={year} className="mb-16">
                        <div className="flex items-center gap-4 mb-8">
                          <h3 className="text-sm font-black text-zenith-crimson uppercase tracking-[0.3em]">{year}</h3>
                          <div className="h-px bg-gray-200 flex-1" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {cats.map((cat: any) => {
                            const preview = (cat.photos || []).slice(0, 3);
                            return (
                              <motion.button
                                key={cat.id}
                                className="group relative rounded-3xl text-left overflow-hidden bg-white border border-gray-100 hover:border-zenith-crimson/20 transition-all shadow-sm hover:shadow-2xl hover:shadow-zenith-crimson/10 duration-500"
                                onClick={() => openOverlay(cat.id)}
                                whileHover={{ y: -6 }}
                              >
                                {/* Cover image */}
                                <div className="aspect-[4/3] overflow-hidden bg-gray-50 relative">
                                  {cat.cover ? (
                                    <img src={cat.cover} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                  ) : preview.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-0.5 h-full">
                                      {preview.map((src: string, i: number) => (
                                        <img key={i} src={src} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="w-full h-full bg-zenith-black flex items-center justify-center">
                                      <Trophy className="w-12 h-12 text-white/20" />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/70 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                                  {/* Year badge */}
                                  {cat.year && (
                                    <div className="absolute top-4 left-4">
                                      <span className="px-3 py-1.5 rounded-full bg-zenith-crimson text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                                        {cat.year}
                                      </span>
                                    </div>
                                  )}

                                  {/* Count badges */}
                                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest text-white">
                                      <ImageIcon className="w-3 h-3" />
                                      {cat.photos?.length || 0}
                                    </span>
                                    {cat.videos?.length > 0 && (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest text-white">
                                        <VideoIcon className="w-3 h-3" />
                                        {cat.videos?.length || 0}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Card content */}
                                <div className="p-6">
                                  <h3 className="text-xl font-black font-display text-zenith-black group-hover:text-zenith-crimson transition-colors uppercase tracking-tight mb-3 leading-tight break-words [overflow-wrap:anywhere]">
                                    {cat.name}
                                  </h3>
                                  {cat.tags && cat.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {cat.tags.slice(0, 3).map((tag: string) => (
                                        <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Fullscreen overlay viewer */}
                    {overlayCatId && (() => {
                      const cat: any = categories.find(c => c.id === overlayCatId);
                      if (!cat) return null;
                      const visible = visibleByCat[cat.id] ?? 60;
                      const photos = cat.photos.slice(0, visible);
                      const canMore = visible < cat.photos.length;
                      const activeTab = (tabByCat[cat.id] ?? 'photo');
                      return (
                        <AnimatePresence>
                          <motion.div
                            className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <div className="absolute inset-0 bg-zenith-black/80 backdrop-blur-xl" onClick={closeOverlay} />
                            <motion.div
                              className="relative z-10 w-full h-full max-w-[1600px] bg-zenith-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
                              initial={{ scale: 0.95, y: 30 }}
                              animate={{ scale: 1, y: 0 }}
                            >
                              {/* Header */}
                              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                                <div className="flex items-center gap-4">
                                  <button
                                    className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-zenith-black hover:bg-zenith-crimson hover:border-zenith-crimson hover:text-white transition-all"
                                    onClick={closeOverlay}
                                  >
                                    <ArrowLeft className="w-5 h-5" />
                                  </button>
                                  <div>
                                    <h2 className="text-xl font-black font-display text-zenith-black uppercase tracking-tight leading-none">{cat.name}</h2>
                                    {cat.year && <p className="text-[10px] font-black text-zenith-crimson uppercase tracking-widest mt-1">{cat.year}</p>}
                                  </div>
                                </div>

                                <div className="flex bg-gray-50 p-1.5 rounded-xl gap-1.5">
                                  {(['photo', 'video'] as const).map((tabType) => (
                                    <button
                                      key={tabType}
                                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tabType ? 'bg-zenith-black text-white shadow-md' : 'text-gray-400 hover:text-zenith-black'}`}
                                      onClick={() => setTabByCat((prev) => ({ ...prev, [cat.id]: tabType }))}
                                    >
                                      {tabType === 'photo' ? <ImageIcon className="w-3 h-3" /> : <VideoIcon className="w-3 h-3" />}
                                      {tabType === 'photo' ? t('gallery.photo') : t('gallery.video')}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="flex-1 overflow-auto p-6 md:p-10" ref={overlayScrollRef}>
                                {activeTab === 'photo' ? (
                                  photos.length === 0 ? (
                                    <div className="text-center py-24">
                                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                      <p className="text-sm font-bold uppercase tracking-widest text-gray-400">{t('gallery.photosComingSoon')}</p>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {photos.map((src: string, i: number) => (
                                          <motion.div
                                            key={i}
                                            className={`relative group rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 ${i % 9 === 0 ? 'col-span-2 row-span-2' : ''}`}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: Math.min(i * 0.03, 0.5) }}
                                            onClick={() => openLightbox(cat.photos.map((p: string) => ({ type: 'image' as const, src: p, alt: cat.name })), i)}
                                          >
                                            <img
                                              src={src}
                                              alt={cat.name}
                                              loading="lazy"
                                              className={`w-full ${i % 9 === 0 ? 'aspect-square lg:aspect-auto lg:h-full' : 'aspect-square'} object-cover transition-transform duration-500 group-hover:scale-110`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                          </motion.div>
                                        ))}
                                      </div>
                                      {canMore && (
                                        <div className="mt-10 text-center">
                                          <button
                                            className="px-10 py-4 bg-zenith-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-zenith-crimson transition-all shadow-lg"
                                            onClick={() => loadMore(cat.id)}
                                          >
                                            {t('gallery.showMore')}
                                          </button>
                                        </div>
                                      )}
                                    </>
                                  )
                                ) : (
                                  cat.videos.length === 0 ? (
                                    <div className="text-center py-24">
                                      <VideoIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                      <p className="text-sm font-bold uppercase tracking-widest text-gray-400">{t('gallery.videosComingSoon')}</p>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                      {cat.videos.map((src: string, i: number) => (
                                        <div key={i} className="rounded-2xl overflow-hidden shadow-lg bg-black">
                                          <video src={src} className="w-full" controls />
                                        </div>
                                      ))}
                                    </div>
                                  )
                                )}
                              </div>
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      );
                    })()}
                  </>
                )
              )}
            </section>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[130] bg-zenith-black/95 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[140]"
            onClick={closeLightbox}
            aria-label={t('gallery.close')}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white z-[140]">
            {lightbox.index + 1} / {lightbox.items.length}
          </div>
          <button
            className="absolute left-4 md:left-12 w-14 h-14 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[140]"
            onClick={(e) => { e.stopPropagation(); prevItem(); }}
            aria-label={t('gallery.prev')}
          >
            <ArrowLeft className="w-7 h-7" />
          </button>
          <button
            className="absolute right-4 md:right-12 w-14 h-14 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[140]"
            onClick={(e) => { e.stopPropagation(); nextItem(); }}
            aria-label={t('gallery.next')}
          >
            <ArrowRight className="w-7 h-7" />
          </button>
          <div className="max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={lightbox.index}
              className="relative w-full h-full flex items-center justify-center"
            >
              {lightbox.items[lightbox.index].type === 'image' ? (
                <img
                  src={lightbox.items[lightbox.index].src}
                  alt={lightbox.items[lightbox.index].alt || ''}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              ) : (
                <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl">
                  <video src={lightbox.items[lightbox.index].src} className="w-full" controls autoPlay />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
