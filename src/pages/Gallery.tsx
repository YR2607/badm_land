import { type FC, useEffect, useRef, useState } from 'react';
import { fetchGallerySections, fetchTournamentCategories, isCmsEnabled } from '../lib/cms';
import { Image as ImageIcon, Video as VideoIcon, ChevronDown, X } from 'lucide-react';

const sections = [
  { id: 'hall', title: 'Наш зал', gradient: 'from-blue-500 to-blue-600' },
  { id: 'coaches', title: 'Наши тренера', gradient: 'from-yellow-500 to-orange-500' },
  { id: 'trainings', title: 'Наши тренировки', gradient: 'from-green-500 to-teal-500' },
  { id: 'tournaments', title: 'Наши турниры', gradient: 'from-purple-500 to-indigo-500' },
];

type TournamentCategory = { id: string; name: string; gradient: string; photos: string[]; videos: string[]; year?: number; tags?: string[]; cover?: string };

const Gallery: FC = () => {
  const [overlayCatId, setOverlayCatId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('hall');
  const [lightbox, setLightbox] = useState<{ items: { type: 'image'|'video'; src: string; alt?: string }[]; index: number } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [tabByCat, setTabByCat] = useState<Record<string, 'photo'|'video'>>({});
  const [filters, setFilters] = useState<{ q: string; year: number | 'all'; tags: string[] }>({ q: '', year: 'all', tags: [] });
  const [visibleByCat, setVisibleByCat] = useState<Record<string, number>>({});

  const [sectionImages, setSectionImages] = useState<Record<string, string[]>>({ hall: [], coaches: [], trainings: [] });
  const overlayScrollRef = useRef<HTMLDivElement | null>(null);
  const lightboxScrollRestoreRef = useRef<{ el: HTMLElement | Window; top: number } | null>(null);
  const overlayWindowScrollRef = useRef<number>(0);
  const [categories, setCategories] = useState<TournamentCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      if (!isCmsEnabled) { setSectionImages({ hall: [], coaches: [], trainings: [] }); setCategories([]); setLoading(false); return; }
      const [sec, cats] = await Promise.all([
        fetchGallerySections(),
        fetchTournamentCategories(),
      ]);
      setSectionImages({ hall: sec.hall || [], coaches: sec.coaches || [], trainings: sec.trainings || [] });
      const gradients = ['from-blue-500 to-blue-600','from-yellow-500 to-orange-500','from-purple-500 to-indigo-500','from-green-500 to-teal-500','from-orange-500 to-red-500'];
      setCategories((cats || []).map((c, idx) => ({ ...c, gradient: gradients[idx % gradients.length] })));
      setLoading(false);
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
      entries.forEach((entry) => { if (entry.isIntersecting) { const id = (entry.target as HTMLElement).id; if (id) setActiveSection(id); } });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });
    sections.forEach((s) => { const el = sectionRefs.current[s.id]; if (el) observerRef.current?.observe(el); });
    return () => observerRef.current?.disconnect();
  }, []);

  const openLightbox = (items: { type: 'image'|'video'; src: string; alt?: string }[], index: number) => {
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
        } catch {}
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

  const pillClasses = (id: string) => `px-4 py-2 rounded-full text-sm font-medium transition-all ${activeSection === id ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 hover:bg-primary-blue/10'}`;
  const Empty = ({ text }: { text: string }) => (<div className="text-center text-gray-500 py-8">{text}</div>);

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
    const y = c.year ? String(c.year) : 'Другое';
    acc[y] = acc[y] || [];
    acc[y].push(c);
    return acc;
  }, {});

  const loadMore = (catId: string) => {
    setVisibleByCat(v => ({ ...v, [catId]: Math.min((v[catId] ?? 30) + 30, (categories.find(c => c.id === catId)?.photos.length || 0)) }));
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="section-title">Галерея</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Фотографии нашего клуба, тренеров, тренировок и турниров</p>
        </div>

        <div className="sticky top-16 z-20 -mt-6 mb-12 bg-white/80 backdrop-blur px-2 py-3 rounded-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((s) => (<a key={s.id} href={`#${s.id}`} className={pillClasses(s.id)}>{s.title}</a>))}
          </div>
        </div>

        {sections.map((s) => (
          <section key={s.id} id={s.id} className="mb-20" ref={(el) => (sectionRefs.current[s.id] = el)}>
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl text-white bg-gradient-to-r ${s.gradient} mb-4`}>📸</div>
              <h2 className="text-3xl font-bold text-gray-900">{s.title}</h2>
            </div>

            {s.id !== 'tournaments' && (
              loading ? (
                <Empty text="Загрузка..." />
              ) : (sectionImages[s.id] || []).length === 0 ? (
                <Empty text={isCmsEnabled ? 'Нет материалов' : 'CMS не настроена'} />
              ) : (
                <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                  {(sectionImages[s.id] || []).map((src, i) => (
                    <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                      <img src={src} alt={s.title} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]" onClick={() => openLightbox([{ type: 'image', src, alt: s.title }], 0)} />
                      <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </figure>
                  ))}
                </div>
              )
            )}

            {s.id === 'tournaments' && (
              loading ? (
                <Empty text="Загрузка..." />
              ) : categories.length === 0 ? (
                <Empty text={isCmsEnabled ? 'Нет материалов' : 'CMS не настроена'} />
              ) : (
                <>
                  <div className="sticky top-16 z-10 mb-6 bg-white/80 backdrop-blur rounded-xl p-3 flex flex-wrap items-center gap-3">
                    <input value={filters.q} onChange={e => setFilters(f => ({ ...f, q: e.target.value }))} placeholder="Поиск турнира..." className="px-3 py-2 border rounded-lg text-sm" />
                    <select value={String(filters.year)} onChange={e => setFilters(f => ({ ...f, year: e.target.value === 'all' ? 'all' : Number(e.target.value) }))} className="px-3 py-2 border rounded-lg text-sm">
                      <option value="all">Все годы</option>
                      {years.map(y => (<option key={y} value={y}>{y}</option>))}
                    </select>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button key={tag} className={`px-3 py-1 rounded-full text-xs border ${filters.tags.includes(tag) ? 'bg-primary-blue text-white border-primary-blue' : 'bg-white text-gray-700'}`} onClick={() => setFilters(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))}>{tag}</button>
                      ))}
                    </div>
                    {(filters.q || filters.year !== 'all' || filters.tags.length) ? (
                      <button className="ml-auto text-sm text-gray-600 inline-flex items-center" onClick={() => setFilters({ q: '', year: 'all', tags: [] })}><X className="w-4 h-4 mr-1" />Сбросить</button>
                    ) : null}
                  </div>

                  {Object.entries(groupedByYear).sort((a, b) => (b[0] > a[0] ? 1 : -1)).map(([year, cats]) => (
                    <div key={year} className="mb-10">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{year}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cats.map((cat: any) => {
                          const preview = (cat.photos || []).slice(0, 3);
                          return (
                            <button key={cat.id} className={`group relative rounded-2xl text-left overflow-hidden bg-white transition-all hover:ring-2 hover:ring-primary-blue/30`} onClick={() => openOverlay(cat.id)}>
                              <div className={`absolute -top-3 left-6 w-20 h-6 rounded-t-md bg-gradient-to-r ${cat.gradient}`} />
                              <div className="p-4 pt-6">
                                <div className="h-28 rounded-xl overflow-hidden bg-gray-50">
                                  {cat.cover ? (
                                    <img src={cat.cover} alt={cat.name} className="w-full h-full object-cover" />
                                  ) : preview.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-1 h-full">
                                      {preview.map((src: string, i: number) => (<img key={i} src={src} alt={cat.name} className="w-full h-full object-cover" />))}
                                    </div>
                                  ) : (
                                    <div className={`w-full h-full bg-gradient-to-r ${cat.gradient}`} />
                                  )}
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                  <div>
                                    <div className="text-base font-semibold text-gray-900">{cat.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center gap-3 mt-1">
                                      {cat.year && <span>{cat.year}</span>}
                                      {cat.tags && cat.tags.slice(0, 2).map((t: string) => (<span key={t} className="px-2 py-0.5 rounded-full bg-gray-100">{t}</span>))}
                                      <span className="inline-flex items-center gap-1"><ImageIcon className="w-4 h-4" />{cat.photos?.length || 0}</span>
                                      <span className="inline-flex items-center gap-1"><VideoIcon className="w-4 h-4" />{cat.videos?.length || 0}</span>
                                    </div>
                                  </div>
                                  <ChevronDown className={`w-5 h-5 text-primary-blue transition-transform`} />
                                </div>
                              </div>
                            </button>
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
                      <div className="fixed inset-0 z-50">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeOverlay} />
                        {/* Panel */}
                        <div className="relative z-10 h-full md:h-[90vh] md:my-6 md:px-4">
                          <div className="bg-white h-full max-w-7xl mx-auto flex flex-col md:rounded-2xl md:border md:shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-3 p-4 border-b sticky top-0 bg-white z-10">
                              <button className="px-3 py-1 rounded-lg border text-sm" onClick={closeOverlay}>Закрыть</button>
                              <div className="font-semibold text-gray-900">{cat.name}{cat.year ? ` • ${cat.year}` : ''}</div>
                              <div className="ml-auto flex items-center gap-2">
                                {(['photo','video'] as const).map((t) => (
                                  <button key={t} className={`px-4 py-2 rounded-full text-sm font-medium ${ activeTab === t ? 'bg-primary-blue text-white' : 'bg-white text-gray-700 border hover:bg-primary-blue/10'}`} onClick={() => setTabByCat((prev) => ({ ...prev, [cat.id]: t }))}>
                                    {t === 'photo' ? 'Фото' : 'Видео'}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-auto px-4 py-6" ref={overlayScrollRef}>
                              {activeTab === 'photo' ? (
                                photos.length === 0 ? (
                                  <Empty text="Фото скоро появятся" />
                                ) : (
                                  <>
                                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                                      {photos.map((src: string, i: number) => (
                                        <figure key={i} className="relative group rounded-2xl overflow-hidden break-inside-avoid">
                                          <img src={src} alt={cat.name} loading="lazy" className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]" onClick={() => openLightbox(cat.photos.map((p: string) => ({ type: 'image' as const, src: p, alt: cat.name })), i)} />
                                          <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </figure>
                                      ))}
                                    </div>
                                    {canMore && (
                                      <div className="mt-6 text-center">
                                        <button className="px-5 py-2 rounded-lg border text-sm" onClick={() => loadMore(cat.id)}>Показать ещё</button>
                                      </div>
                                    )}
                                  </>
                                )
                              ) : (
                                cat.videos.length === 0 ? (
                                  <Empty text="Видео скоро появятся" />
                                ) : (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {cat.videos.map((src: string, i: number) => (
                                      <div key={i} className="rounded-2xl overflow-hidden">
                                        <video src={src} className="w-full" controls />
                                      </div>
                                    ))}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </>
              )
            )}
          </section>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" role="dialog" aria-modal="true" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 text-white text-xl" onClick={closeLightbox} aria-label="Закрыть">✕</button>
          <button className="absolute left-4 md:left-8 text-white text-3xl" onClick={(e) => { e.stopPropagation(); prevItem(); }} aria-label="Предыдущее">‹</button>
          <button className="absolute right-4 md:right-8 text-white text-3xl" onClick={(e) => { e.stopPropagation(); nextItem(); }} aria-label="Следующее">›</button>
          <div className="max-w-5xl w-full px-4" onClick={(e) => e.stopPropagation()}>
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
