import { FC, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, ArrowLeft, Clock, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { fetchGymBySlug, type CmsGym } from '../lib/cms'

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
        setGym(g)
        setError(null)
      } catch (e) {
        setError(t('common.error'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

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
          <Link to="/gyms" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('gyms.backToSelection')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <section className="relative overflow-hidden">
        <div className="relative h-72 md:h-96">
          <img
            src={gym.heroImage || gym.gallery?.[0] || '/images/gym-placeholder.jpg'}
            alt={gym.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                {gym.badge && (
                  <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${gym.badgeColor || 'from-blue-500 to-indigo-600'} text-xs font-semibold mb-2`}>
                    {gym.badge}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{gym.name}</h1>
                {gym.description && <p className="opacity-90 max-w-2xl">{gym.description}</p>}
              </div>
              <Link to="/gyms" className="hidden md:inline-flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                {t('gyms.backToSelection')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Main info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Features */}
            {gym.features && gym.features.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('services.comparison.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {gym.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-gray-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-primary-blue to-primary-orange rounded-full" />
                      <span className="font-medium">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule */}
            {(gym.schedule?.children || gym.schedule?.adults) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-500" />
                  {t('gyms.schedule.title')}
                </h2>
                <div className="space-y-4">
                  {gym.schedule?.children && (
                    <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
                      <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">👨‍👩‍👧‍👦</span>
                        {gym.schedule.children.title}
                      </h3>
                      <p className="text-green-700 font-medium mb-1">{gym.schedule.children.times}</p>
                      <p className="text-green-600 text-sm">{gym.schedule.children.details}</p>
                    </div>
                  )}
                  {gym.schedule?.adults && (
                    <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
                      <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <span className="text-xl">🏸</span>
                        {gym.schedule.adults.title}
                      </h3>
                      <p className="text-blue-700 font-medium mb-1">{gym.schedule.adults.times}</p>
                      <p className="text-blue-600 text-sm">{gym.schedule.adults.details}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing */}
            {(gym.pricing?.children || gym.pricing?.adults) && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {t('gyms.pricing.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gym.pricing?.children && (
                    <div className="border border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <span>👨‍👩‍👧‍👦</span>
                        {t('gyms.pricing.childrenGroups')}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>{t('gyms.pricing.monthly')}:</span><span className="font-semibold">{gym.pricing.children.monthly}</span></div>
                        <div className="flex justify-between"><span>{t('gyms.pricing.single')}:</span><span className="font-semibold">{gym.pricing.children.single}</span></div>
                        <div className="flex justify-between text-green-600"><span>{t('gyms.pricing.trial')}:</span><span className="font-semibold">{gym.pricing.children.trial}</span></div>
                      </div>
                    </div>
                  )}
                  {gym.pricing?.adults && (
                    <div className="border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <span>🏸</span>
                        {t('gyms.pricing.adultGroups')}
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>{t('gyms.pricing.monthly')}:</span><span className="font-semibold">{gym.pricing.adults.monthly}</span></div>
                        <div className="flex justify-between"><span>{t('gyms.pricing.single')}:</span><span className="font-semibold">{gym.pricing.adults.single}</span></div>
                        <div className="flex justify-between text-blue-600"><span>{t('gyms.pricing.trial')}:</span><span className="font-semibold">{gym.pricing.adults.trial}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gallery */}
            {gym.gallery && gym.gallery.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('gallery.title')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gym.gallery.map((src, idx) => (
                    <div key={idx} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img src={src} alt={`${gym.name} ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact & Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
              <ul className="space-y-3">
                {gym.address && (
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary-orange mt-0.5" />
                    <span className="text-gray-700">{gym.address}</span>
                  </li>
                )}
                {gym.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary-blue" />
                    <span className="text-gray-700">{gym.phone}</span>
                  </li>
                )}
                {gym.email && (
                  <li className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary-yellow" />
                    <span className="text-gray-700">{gym.email}</span>
                  </li>
                )}
              </ul>

              {gym.mapUrl && (
                <a
                  href={gym.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-colors font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  {t('gyms.openMap', 'Open on Map')}
                </a>
              )}
            </div>

            {/* Trainers */}
            {gym.trainers && gym.trainers.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('gyms.tags.adults')}</h2>
                <div className="space-y-4">
                  {gym.trainers.map((tr, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-primary-blue">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{tr.name}</div>
                        {tr.specialization && (
                          <div className="text-sm text-gray-600">{tr.specialization}</div>
                        )}
                        {tr.experience && (
                          <div className="text-xs text-gray-500">{tr.experience}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default GymDetail
