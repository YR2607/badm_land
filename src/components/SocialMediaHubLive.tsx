import { FC, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

type Platform = 'tiktok' | 'youtube' | 'facebook'

// Social channel config
const SOCIAL_CONFIG = {
  tiktok: {
    name: 'TikTok',
    handle: '@badmintonmoldova',
    url: 'https://www.tiktok.com/@badmintonmoldova',
    username: 'badmintonmoldova'
  },
  youtube: {
    name: 'YouTube',
    handle: '@Badminton_4Life',
    url: 'https://www.youtube.com/@Badminton_4Life',
    channelUrl: 'https://www.youtube.com/@Badminton_4Life'
  },
  facebook: {
    name: 'Facebook',
    handle: 'Altius Badminton Club',
    url: 'https://www.facebook.com/profile.php?id=61562124174747',
    pageId: '61562124174747'
  }
}

// Platform icons
const TikTokIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
)

const YouTubeIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const FacebookIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

// TikTok Embed Component - uses real TikTok embed
const TikTokEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isActive) return

    const loadTikTokEmbed = () => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]')
      if (existingScript) {
        // Re-render embeds
        if ((window as any).tiktokEmbed?.lib?.render) {
          (window as any).tiktokEmbed.lib.render()
        }
        setLoading(false)
        return
      }

      const script = document.createElement('script')
      script.src = 'https://www.tiktok.com/embed.js'
      script.async = true
      script.onload = () => {
        setLoading(false)
      }
      document.body.appendChild(script)
    }

    const timer = setTimeout(loadTikTokEmbed, 300)
    return () => clearTimeout(timer)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="h-full">
      {/* TikTok Card with real embed */}
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-t-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-0.5">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <TikTokIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Badminton Moldova</h3>
              <p className="text-gray-400 text-sm">{SOCIAL_CONFIG.tiktok.handle}</p>
            </div>
          </div>
          
          <a
            href={SOCIAL_CONFIG.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-full font-bold hover:scale-105 transition-all shadow-lg"
          >
            <TikTokIcon className="w-5 h-5" />
            Смотреть на TikTok
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>

        {/* TikTok Embed */}
        <div ref={containerRef} className="bg-white rounded-b-3xl shadow-2xl p-6 flex-1 flex flex-col justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Загрузка TikTok...</p>
            </div>
          )}
          
          {/* TikTok Creator Profile Embed - full width */}
          <blockquote
            className="tiktok-embed w-full"
            cite={SOCIAL_CONFIG.tiktok.url}
            data-unique-id={SOCIAL_CONFIG.tiktok.username}
            data-embed-type="creator"
            style={{ maxWidth: '100%', minWidth: '100%', width: '100%' }}
          >
            <section>
              <a target="_blank" rel="noopener noreferrer" href={SOCIAL_CONFIG.tiktok.url}>
                {SOCIAL_CONFIG.tiktok.handle}
              </a>
            </section>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

// YouTube video type
interface YouTubeVideo {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
}

// YouTube Embed Component - shows real videos from API
const YouTubeEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)

  useEffect(() => {
    if (!isActive) return

    const fetchVideos = async () => {
      try {
        // Try API first (production)
        let response = await fetch('/api/youtube-videos')
        
        // Fallback to static JSON (development)
        if (!response.ok) {
          response = await fetch('/data/youtube_videos.json')
        }
        
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
        }
      } catch (error) {
        // Final fallback - try static JSON
        try {
          const fallbackResponse = await fetch('/data/youtube_videos.json')
          if (fallbackResponse.ok) {
            const data = await fallbackResponse.json()
            setVideos(data.videos || [])
          }
        } catch {
          console.error('Failed to fetch YouTube videos:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [isActive])

  if (!isActive) return null

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* YouTube Channel Card */}
      <div className="w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-t-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-xl">
              <div className="w-full h-full rounded-full bg-red-600 flex items-center justify-center">
                <YouTubeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Badminton 4 Life</h3>
              <p className="text-red-200 text-sm">{SOCIAL_CONFIG.youtube.handle}</p>
            </div>
          </div>
          
          <a
            href={SOCIAL_CONFIG.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
          >
            <YouTubeIcon className="w-5 h-5" />
            Подписаться
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>

        {/* Videos Grid */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100 hover:scale-[1.02] transition-all shadow-md hover:shadow-xl text-left"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white text-sm font-medium line-clamp-2">{video.title}</div>
                      <div className="text-white/60 text-xs mt-1">{formatDate(video.publishedAt)}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* View all videos button */}
              <div className="mt-8 text-center">
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-full font-bold text-lg hover:bg-red-700 transition-all hover:scale-105 shadow-lg"
                >
                  <YouTubeIcon className="w-6 h-6" />
                  Смотреть все видео на канале
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Не удалось загрузить видео</p>
              <a
                href={SOCIAL_CONFIG.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
              >
                Смотреть на YouTube
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Facebook Embed Component - wide beautiful card with embed
const FacebookEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    if (!isActive) return

    // Load Facebook SDK
    const loadFacebookSDK = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse(containerRef.current)
        setSdkLoaded(true)
        return
      }

      if (document.getElementById('facebook-jssdk')) {
        return
      }

      const script = document.createElement('script')
      script.id = 'facebook-jssdk'
      script.src = 'https://connect.facebook.net/ru_RU/sdk.js#xfbml=1&version=v18.0'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        if ((window as any).FB) {
          (window as any).FB.XFBML.parse(containerRef.current)
        }
        setSdkLoaded(true)
      }
      document.body.appendChild(script)
    }

    const timer = setTimeout(loadFacebookSDK, 300)
    return () => clearTimeout(timer)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="h-full">
      {/* Facebook Page Card */}
      <div className="h-full flex flex-col">
        {/* Header with page info */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-t-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white p-1.5 shadow-xl">
              <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                <FacebookIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white">Altius Badminton Club</h3>
              <p className="text-blue-200 text-sm">Новости, турниры и жизнь клуба</p>
            </div>
          </div>
          
          <a
            href={SOCIAL_CONFIG.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:scale-105 transition-all shadow-lg"
          >
            <FacebookIcon className="w-5 h-5" />
            Подписаться
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
        
        {/* Facebook embed */}
        <div ref={containerRef} className="bg-white rounded-b-3xl shadow-2xl overflow-hidden flex-1 flex flex-col justify-center">
          {!sdkLoaded && (
            <div className="flex flex-col items-center justify-center gap-4 p-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500">Загрузка постов...</p>
            </div>
          )}
          
          {/* Facebook Page Plugin - full width */}
          <div className="w-full p-4">
            <div
              className="fb-page"
              data-href={SOCIAL_CONFIG.facebook.url}
              data-tabs="timeline"
              data-width="500"
              data-height="700"
              data-small-header="false"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="true"
              style={{ width: '100%' }}
            >
              <blockquote cite={SOCIAL_CONFIG.facebook.url} className="fb-xfbml-parse-ignore">
                <a href={SOCIAL_CONFIG.facebook.url}>{SOCIAL_CONFIG.facebook.handle}</a>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main SocialMediaHub Component - TikTok + Facebook side by side, YouTube below
const SocialMediaHubLive: FC = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-blue/10 rounded-full mb-4"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-sm font-semibold text-primary-blue">
              {t('socialHub.badge', 'Мы в соцсетях')}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
          >
            {t('socialHub.title', 'Live: Altius в соцсетях')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto"
          >
            {t('socialHub.subtitle', 'Следите за нашими тренировками, турнирами и новостями клуба')}
          </motion.p>
        </div>

        {isVisible && (
          <>
            {/* Facebook + TikTok side by side */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col lg:flex-row gap-6 mb-10"
            >
              {/* Facebook - fixed width */}
              <div className="w-full lg:w-[540px] flex-shrink-0">
                <FacebookEmbed isActive={true} />
              </div>
              
              {/* TikTok - takes remaining space */}
              <div className="flex-1">
                <TikTokEmbed isActive={true} />
              </div>
            </motion.div>

            {/* YouTube below - full width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <YouTubeEmbed isActive={true} />
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}

export default SocialMediaHubLive
