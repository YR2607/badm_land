import { type FC, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGallerySections, fetchTournamentCategories, isCmsEnabled } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import { Image as ImageIcon, Video as VideoIcon, ChevronDown, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../components/Breadcrumbs';
import InnerHero from '../components/InnerHero';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';

const getSections = (t: any) => [
  { id: 'hall', title: t('gallery.sections.hall'), gradient: 'from-blue-500 to-blue-600' },
  { id: 'tournaments', title: t('gallery.sections.tournaments'), gradient: 'from-purple-500 to-indigo-500' },
];

type TournamentCategory = { id: string; name: string; gradient: string; photos: string[]; videos: string[]; year?: number; tags?: string[]; cover?: string };

const Gallery: FC = () => {
  const { t } = useTranslation();
  const sections = getSections(t);
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
      const gradients = ['from-blue-500 to-blue-600', 'from-yellow-500 to-orange-500', 'from-purple-500 to-indigo-500', 'from-green-500 to-teal-500', 'from-orange-500 to-red-500'];
      setCategories((markedCats || []).map((c, idx) => ({ ...c, gradient: gradients[idx % gradients.length] })));
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
    // Capture current scroll container and position before opening
    if (overlayCatId && overlayScrollRef.current) {
      lightboxScrollRestoreRef.current = { el: overlayScrollRef.current, top: overlayScrollRef.current.scrollTop };
    } else {
      lightboxScrollRestoreRef.current = { el: window, top: window.scrollY || document.documentElement.scrollTop || 0 };
    }
    setLightbox({ items, index });
  }
  const closeLightbox = () => {
    setLightbox(null);
    // Restore previous scroll position
    const saved = lightboxScrollRestoreRef.current;
    if (saved) {
      if (saved.el === window) {
        window.scrollTo({ top: saved.top, behavior: 'auto' });
      } else {
        try {
          (saved.el as HTMLElement).scrollTop = saved.top;
        } catch { }
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
    // restore page scroll to position before opening overlay
    const top = overlayWindowScrollRef.current || 0;
    window.requestAnimationFrame(() => window.scrollTo({ top, behavior: 'auto' }));
  };

  // Close overlay with ESC (only when lightbox is NOT open)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && overlayCatId && !lightbox) {
        e.preventDefault();
        closeOverlay();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overlayCatId, lightbox]);

  // Lock body scroll when overlay is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (overlayCatId || lightbox) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = original;
    }
    return () => { document.body.style.overflow = original };
  }, [overlayCatId, lightbox]);

  // Keyboard controls for lightbox
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

  const pillClasses = (id: string) => `px-8 py-3 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] transition-all border-2 ${activeSection === id ? 'bg-zenith-black text-white border-zenith-black shadow-xl shadow-zenith-black/20' : 'bg-white text-gray-400 border-gray-100 hover:border-zenith-crimson hover:text-zenith-crimson'}`;
  const Empty = ({ text }: { text: string }) => (<div className="text-center font-bold uppercase tracking-widest text-gray-400 py-20">{text}</div>);

  const SkeletonCard = () => (
    <div className="relative rounded-[2rem] overflow-hidden bg-white border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-50" />
      <div className="p-6">
        <div className="h-5 w-2/3 bg-gray-100 rounded-lg mb-3" />
        <div className="h-4 w-1/2 bg-gray-50 rounded-lg" />
      </div>
    </div>
  )

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
        "isPartOf": {
          "@type": "WebSite",
          "name": "Altius Badminton Club",
          "url": "https://altius.md/"
        }
      }} />

      <InnerHero
        title={t('navigation.gallery')}
        subtitle={t('gallery.subtitle')}
      />

      <div className="sticky top-10 z-30 mb-20">
        <div className="inline-flex flex-wrap gap-3 justify-center bg-white/50 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-white/20 shadow-2xl mx-auto block w-fit">
          {sections.map((s) => (<a key={s.id} href={`#${s.id}`} className={pillClasses(s.id)}>{s.title}</a>))}
        </div>
      </div>

      {sections.map((s) => (
        <section key={s.id} id={s.id} className="mb-32" ref={(el) => (sectionRefs.current[s.id] = el)}>
          <div className="flex items-center gap-6 mb-12">
            <div className={`w-20 h-20 rounded-[2rem] text-white bg-zenith-black flex items-center justify-center text-3xl shadow-xl`}>
              {s.id === 'hall' ? '🏢' : '🏆'}
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-display text-zenith-black uppercase tracking-tight">{s.title}</h2>
          </div>

          {s.id !== 'tournaments' && (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 animate-pulse">
                    <div className="h-64 bg-gray-50" />
                  </div>
                ))}
              </div>
            ) : (sectionImages[s.id] || []).length === 0 ? (
              <Empty text={isCmsEnabled ? t('gallery.noMaterials') : t('gallery.cmsNotConfigured')} />
            ) : (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 space-y-8">
                {(sectionImages[s.id] || []).map((src, i) => (
                  <motion.figure
                    key={i}
                    className="relative group rounded-[2rem] overflow-hidden break-inside-avoid border-2 border-transparent hover:border-zenith-crimson transition-all cursor-pointer shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <img
                      src={src}
                      alt={`${s.title} — ${t('gallery.title')}`}
                      loading="lazy"
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      onClick={() => openLightbox([{ type: 'image', src, alt: s.title }], 0)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.figure>
                ))}
              </div>
            )
          )}

          {s.id === 'tournaments' && (
            loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array.from({ length: 6 }).map((_, i) => (<SkeletonCard key={i} />))}
              </div>
            ) : categories.length === 0 ? (
              <Empty text={isCmsEnabled ? t('gallery.noMaterials') : t('gallery.cmsNotConfigured')} />
            ) : (
              <>
                <div className="sticky top-24 z-30 mb-12 bg-white/70 backdrop-blur-2xl rounded-[2rem] p-4 flex flex-wrap items-center gap-4 border border-white/20 shadow-xl">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      value={filters.q}
                      onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
                      placeholder={t('gallery.searchTournament')}
                      className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-zenith-crimson transition-all"
                    />
                  </div>
                  <select
                    value={String(filters.year)}
                    onChange={e => setFilters(f => ({ ...f, year: e.target.value === 'all' ? 'all' : Number(e.target.value) }))}
                    className="px-6 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-zenith-crimson transition-all outline-none"
                  >
                    <option value="all">{t('gallery.allYears')}</option>
                    {years.map(y => (<option key={y} value={y}>{y}</option>))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map(tag => (
                      <button
                        key={tag}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${filters.tags.includes(tag) ? 'bg-zenith-crimson text-white border-zenith-crimson shadow-lg shadow-zenith-crimson/20' : 'bg-white text-gray-400 border-gray-100 hover:border-zenith-crimson/40'}`}
                        onClick={() => setFilters(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  {(filters.q || filters.year !== 'all' || filters.tags.length) ? (
                    <button
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zenith-crimson hover:text-zenith-black transition-colors"
                      onClick={() => setFilters({ q: '', year: 'all', tags: [] })}
                    >
                      {t('gallery.reset')}
                    </button>
                  ) : null}
                </div>

                {Object.entries(groupedByYear).sort((a, b) => (b[0] > a[0] ? 1 : -1)).map(([year, cats]) => (
                  <div key={year} className="mb-20">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="h-px bg-gray-200 flex-1" />
                      <h3 className="text-sm font-black text-zenith-crimson uppercase tracking-[0.3em] bg-zenith-white px-6">{year}</h3>
                      <div className="h-px bg-gray-200 flex-1" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                      {cats.map((cat: any) => {
                        const preview = (cat.photos || []).slice(0, 3);
                        return (
                          <motion.button
                            key={cat.id}
                            className="group relative rounded-[2.5rem] text-left overflow-hidden bg-white border-2 border-transparent hover:border-zenith-crimson/20 transition-all shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-10px_rgba(220,38,38,0.15)] duration-500"
                            onClick={() => openOverlay(cat.id)}
                            whileHover={{ y: -8 }}
                          >
                            <div className="p-4 pt-6">
                              <div className="h-56 rounded-[2rem] overflow-hidden bg-gray-50 relative">
                                {cat.cover ? (
                                  <img src={cat.cover} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : preview.length > 0 ? (
                                  <div className="grid grid-cols-3 gap-1 h-full">
                                    {preview.map((src: string, i: number) => (<img key={i} src={src} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />))}
                                  </div>
                                ) : (
                                  <div className={`w-full h-full bg-zenith-black`} />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                <div className="absolute top-6 left-6">
                                  <div className="px-4 py-1.5 rounded-full bg-zenith-crimson text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl">
                                    {cat.year}
                                  </div>
                                </div>

                                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                  <span className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest text-white inline-flex items-center gap-2"><ImageIcon className="w-3 h-3" />{cat.photos?.length || 0}</span>
                                  {cat.videos?.length > 0 && (
                                    <span className="px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-widest text-white inline-flex items-center gap-2"><VideoIcon className="w-3 h-3" />{cat.videos?.length || 0}</span>
                                  )}
                                </div>
                              </div>
                              <div className="p-8">
                                <h3 className="text-2xl font-black font-display text-zenith-black group-hover:text-zenith-crimson transition-colors uppercase tracking-tight mb-3 leading-tight">{cat.name}</h3>
                                <div className="flex flex-wrap gap-2">
                                  {cat.tags && cat.tags.slice(0, 3).map((t: string) => (
                                    <span key={t} className="px-3 py-1 bg-gray-50 text-gray-400 text-[9px] font-black uppercase tracking-widest rounded-lg">{t}</span>
                                  ))}
                                </div>
                              </div>
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
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="absolute inset-0 bg-zenith-black/80 backdrop-blur-xl" onClick={closeOverlay} />
                        <motion.div
                          className="relative z-10 w-full h-full max-w-[1600px] bg-zenith-white rounded-[3rem] shadow-2xl border-2 border-white overflow-hidden flex flex-col"
                          initial={{ scale: 0.9, y: 50 }}
                          animate={{ scale: 1, y: 0 }}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between p-8 border-b border-gray-100 bg-white">
                            <div className="flex items-center gap-6">
                              <button
                                className="w-12 h-12 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-zenith-black hover:bg-zenith-crimson hover:border-zenith-crimson hover:text-white transition-all group"
                                onClick={closeOverlay}
                              >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                              </button>
                              <div>
                                <h2 className="text-2xl font-black font-display text-zenith-black uppercase tracking-tight">{cat.name}</h2>
                                <p className="text-[10px] font-black text-zenith-crimson uppercase tracking-widest">{cat.year ? `${cat.year}` : ''}</p>
                              </div>
                            </div>

                            <div className="flex bg-gray-50 p-2 rounded-2xl gap-2">
                              {(['photo', 'video'] as const).map((tabType) => (
                                <button
                                  key={tabType}
                                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tabType ? 'bg-zenith-black text-white shadow-xl' : 'text-gray-400 hover:text-zenith-black'}`}
                                  onClick={() => setTabByCat((prev) => ({ ...prev, [cat.id]: tabType }))}
                                >
                                  {tabType === 'photo' ? t('gallery.photo') : t('gallery.video')}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 overflow-auto p-10 md:p-16 custom-scrollbar" ref={overlayScrollRef}>
                            {activeTab === 'photo' ? (
                              photos.length === 0 ? (
                                <Empty text={t('gallery.photosComingSoon')} />
                              ) : (
                                <>
                                  <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
                                    {photos.map((src: string, i: number) => (
                                      <motion.figure
                                        key={i}
                                        className="relative group rounded-[2rem] overflow-hidden break-inside-avoid border-2 border-transparent hover:border-zenith-crimson transition-all cursor-pointer shadow-lg"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                      >
                                        <img
                                          src={src}
                                          alt={cat.name}
                                          loading="lazy"
                                          className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                          onClick={() => openLightbox(cat.photos.map((p: string) => ({ type: 'image' as const, src: p, alt: cat.name })), i)}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                      </motion.figure>
                                    ))}
                                  </div>
                                  {canMore && (
                                    <div className="mt-16 text-center">
                                      <button
                                        className="px-12 py-5 bg-zenith-black text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-zenith-crimson transition-all shadow-xl"
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
                                <Empty text={t('gallery.videosComingSoon')} />
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                  {cat.videos.map((src: string, i: number) => (
                                    <div key={i} className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border-4 border-white">
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
      ))}

      {
        lightbox && (
          <div
            className="fixed inset-0 z-[100] bg-zenith-black/95 backdrop-blur-md flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={closeLightbox}
          >
            <button
              className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[110]"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </button>

            <button
              className="absolute left-4 md:left-12 w-16 h-16 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[110]"
              onClick={(e) => { e.stopPropagation(); prevItem(); }}
            >
              <ArrowLeft className="w-8 h-8" />
            </button>

            <button
              className="absolute right-4 md:right-12 w-16 h-16 bg-white/10 hover:bg-zenith-crimson text-white rounded-full flex items-center justify-center transition-all shadow-2xl z-[110]"
              onClick={(e) => { e.stopPropagation(); nextItem(); }}
            >
              <ArrowRight className="w-8 h-8" />
            </button>

            <div className="max-w-7xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={lightbox.index}
                className="relative w-full h-full flex items-center justify-center"
              >
                {lightbox.items[lightbox.index].type === 'image' ? (
                  <img
                    src={lightbox.items[lightbox.index].src}
                    alt={lightbox.items[lightbox.index].alt || ''}
                    className="max-w-full max-h-full object-contain rounded-[2rem] shadow-2xl border-4 border-white/10"
                  />
                ) : (
                  <div className="w-full max-w-4xl rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl">
                    <video src={lightbox.items[lightbox.index].src} className="w-full" controls autoPlay />
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Gallery;
