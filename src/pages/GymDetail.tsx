import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LocalizedLink from '../components/LocalizedLink'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, ArrowLeft, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchGymBySlug, type CmsGym } from '../lib/cms'
import { addCmsDevMarkers } from '../utils/cmsDevMarker'
import Breadcrumbs from '../components/Breadcrumbs'
import SEO from '../components/SEO'
import JsonLd from '../components/JsonLd'

// SEO/OG images must be absolute URLs — social crawlers don't resolve relative paths
const toAbsoluteUrl = (url?: string): string | undefined =>
  url ? (url.startsWith('http') ? url : `https://altius.md${url.startsWith('/') ? '' : '/'}${url}`) : undefined;

const GymDetail: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const [gym, setGym] = useState<CmsGym | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        if (!slug) { setError(t('common.error')); setLoading(false); return }
        const g = await fetchGymBySlug(slug)
        setGym(g ? addCmsDevMarkers(g) : null)
        setError(null)
      } catch (e) {
        setError(t('common.error'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, t])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('gyms.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || t('news.postNotFound', 'Материал не найден')}</p>
          <LocalizedLink to="/gyms" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('gyms.backToSelection')}
          </LocalizedLink>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={`${gym.name} | Altius`}
        description={gym.description || gym.badge || t('gyms.heroSubtitle', 'Современные залы с профессиональным оборудованием')}
        image={toAbsoluteUrl(gym.heroImage || (gym.gallery && gym.gallery[0])) || 'https://altius.md/og-gym.jpg'}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SportsActivityLocation",
          "name": gym.name,
          "url": `https://altius.md/gyms/${slug}`,
          ...(gym.phone && { "telephone": gym.phone }),
          "address": gym.address ? {
            "@type": "PostalAddress",
            "streetAddress": gym.address,
            "addressLocality": "Chișinău",
            "addressCountry": "MD"
          } : undefined,
          "image": [toAbsoluteUrl(gym.heroImage || (gym.gallery && gym.gallery[0]))].filter(Boolean)
        }}
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Breadcrumbs
          items={[
            { label: t('navigation.home'), path: '/' },
            { label: t('navigation.gyms'), path: '/gyms' },
            { label: gym.name }
          ]}
        />
      </div>

      <section className="py-12 md:py-20 px-4">
        <div className="max-w-[1600px] mx-auto">
          {/* Gym Header Section */}
          <div className="relative h-[450px] md:h-[600px] rounded-[3.5rem] overflow-hidden shadow-2xl border-2 border-white mb-16">
            <img
              src={gym.heroImage || gym.gallery?.[0] || '/images/gym-placeholder.jpg'}
              alt={gym.name}
              className="w-full h-full object-cover transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zenith-black via-zenith-black/30 to-transparent" />

            <div className="absolute top-10 left-10 md:top-16 md:left-16 z-20">
              <LocalizedLink
                to="/gyms"
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all text-white font-black uppercase tracking-widest text-[10px]"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('gyms.backToSelection')}
              </LocalizedLink>
            </div>

            <div className="absolute bottom-12 left-10 right-10 md:bottom-20 md:left-16 md:right-16 text-white z-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {gym.badge && (
                  <div className="inline-block px-6 py-2 rounded-full bg-zenith-crimson text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                    {gym.badge}
                  </div>
                )}
                <h1 className="text-5xl md:text-8xl font-black font-display uppercase tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
                  {gym.name}
                </h1>
                {gym.description && (
                  <p className="text-xl md:text-2xl text-white/80 font-medium max-w-4xl leading-relaxed drop-shadow-lg">
                    {gym.description}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-zenith-white relative overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Features & Schedule */}
            <div className="lg:col-span-2 space-y-16">
              {/* Features */}
              {gym.features && gym.features.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
                  <h2 className="text-4xl font-black font-display text-zenith-black uppercase tracking-tight mb-10">
                    {t('gyms.features.title')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {gym.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50 border border-transparent hover:border-zenith-crimson/20 transition-all group">
                        <div className="w-3 h-3 rounded-full bg-zenith-crimson shadow-[0_0_10px_rgba(220,38,38,0.4)]" />
                        <span className="font-bold text-zenith-black uppercase tracking-widest text-xs">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Schedule */}
              {(gym.schedule?.children || gym.schedule?.adults) && (
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-zenith-black text-white flex items-center justify-center rounded-2xl shadow-lg">
                      <Clock className="w-7 h-7" />
                    </div>
                    <h2 className="text-4xl font-black font-display text-zenith-black uppercase tracking-tight">
                      {t('gyms.schedule.title')}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {gym.schedule?.children && (
                      <div className="p-8 rounded-[2rem] bg-gray-50 border-t-4 border-zenith-crimson/30 hover:bg-white transition-colors hover:shadow-xl group">
                        <h3 className="text-xl font-black font-display text-zenith-black mb-4 uppercase tracking-tight flex items-center gap-3">
                          <span className="text-2xl">👨‍👩‍👧‍👦</span>
                          {gym.schedule.children.title}
                        </h3>
                        <div className="text-4xl font-black font-display text-zenith-crimson mb-4 leading-none">
                          {gym.schedule.children.times}
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{gym.schedule.children.details}</p>
                      </div>
                    )}

                    {gym.schedule?.adults && (
                      <div className="p-8 rounded-[2rem] bg-gray-50 border-t-4 border-zenith-black hover:bg-white transition-colors hover:shadow-xl group">
                        <h3 className="text-xl font-black font-display text-zenith-black mb-4 uppercase tracking-tight flex items-center gap-3">
                          <span className="text-2xl">🏸</span>
                          {gym.schedule.adults.title}
                        </h3>
                        <div className="text-4xl font-black font-display text-zenith-black mb-4 leading-none">
                          {gym.schedule.adults.times}
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">{gym.schedule.adults.details}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {gym.gallery && gym.gallery.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12_rgba(0,0,0,0.05)] border border-gray-100">
                  <h2 className="text-4xl font-black font-display text-zenith-black uppercase tracking-tight mb-10">
                    {t('gyms.gallery.title')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gym.gallery.map((src, idx) => (
                      <motion.div
                        key={idx}
                        className="aspect-[4/5] bg-gray-100 rounded-[2rem] overflow-hidden shadow-lg border-2 border-transparent hover:border-zenith-crimson transition-all"
                        whileHover={{ scale: 1.03 }}
                      >
                        <img src={src} alt={`${gym.name} ${idx + 1}`} className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Trainers */}
            <div className="space-y-12">
              <div className="bg-zenith-black rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-zenith-crimson/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="w-12 h-12 bg-zenith-crimson text-white flex items-center justify-center rounded-xl shadow-lg shadow-zenith-crimson/20">
                    <Phone className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-black font-display uppercase tracking-tight">
                    {t('gyms.contact.title')}
                  </h2>
                </div>

                <div className="space-y-8 relative z-10">
                  {gym.address && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-4 h-4 text-zenith-crimson" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.address')}</p>
                        <p className="font-bold leading-tight">{gym.address}</p>
                      </div>
                    </div>
                  )}
                  {gym.phone && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Phone className="w-4 h-4 text-zenith-crimson" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.phone')}</p>
                        <a href={`tel:${gym.phone}`} className="text-lg font-black font-display text-white hover:text-zenith-crimson transition-colors">
                          {gym.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {gym.email && (
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Mail className="w-4 h-4 text-zenith-crimson" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">{t('gyms.contact.email')}</p>
                        <a href={`mailto:${gym.email}`} className="font-bold hover:text-zenith-crimson transition-colors">
                          {gym.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {gym.mapUrl && (
                  <a
                    href={gym.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-12 w-full bg-white text-zenith-black py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-zenith-crimson hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl relative z-10"
                  >
                    <MapPin className="w-4 h-4" />
                    {t('gyms.contact.openMap')}
                  </a>
                )}
              </div>

              {/* Trainers */}
              {gym.trainers && gym.trainers.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-gray-100 text-zenith-black flex items-center justify-center rounded-xl">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black font-display text-zenith-black uppercase tracking-tight">
                      {t('gyms.trainers.title')}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {gym.trainers.map((tr, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                        {tr.photo ? (
                          <img
                            src={tr.photo}
                            alt={tr.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <CheckCircle className="w-8 h-8 text-white" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-black text-zenith-black text-lg uppercase tracking-tight">{tr.name}</h3>
                          {tr.experience && <p className="text-[10px] font-black text-zenith-crimson uppercase tracking-widest leading-none mt-1">{tr.experience}</p>}
                          {tr.specialization && <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">{tr.specialization}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default GymDetail
