import { FC, useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { fetchFooter, isCmsEnabled } from '../lib/cms'

type Platform = 'tiktok' | 'youtube' | 'facebook'

// Default social config (used as fallback when CMS has no data)
const DEFAULT_SOCIAL_CONFIG = {
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

// Module-level mutable config — updated by SocialMediaHubLive when CMS data loads
let SOCIAL_CONFIG = DEFAULT_SOCIAL_CONFIG;

// Hook to fetch CMS social config and update module-level variable
const useSocialConfig = () => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!isCmsEnabled) return;
    fetchFooter().then(data => {
      if (!data?.socialMedia) return;
      const s = data.socialMedia;
      SOCIAL_CONFIG = {
        tiktok: {
          ...SOCIAL_CONFIG.tiktok,
          handle: s.tiktokUsername ? `@${s.tiktokUsername}` : SOCIAL_CONFIG.tiktok.handle,
          url: s.tiktok || SOCIAL_CONFIG.tiktok.url,
          username: s.tiktokUsername || SOCIAL_CONFIG.tiktok.username
        },
        youtube: {
          ...SOCIAL_CONFIG.youtube,
          handle: s.youtubeHandle ? `@${s.youtubeHandle.replace(/^@/, '')}` : SOCIAL_CONFIG.youtube.handle,
          url: s.youtube || SOCIAL_CONFIG.youtube.url,
          channelUrl: s.youtube || SOCIAL_CONFIG.youtube.channelUrl
        },
        facebook: {
          ...SOCIAL_CONFIG.facebook,
          url: s.facebook || SOCIAL_CONFIG.facebook.url,
          pageId: s.facebookPageId || SOCIAL_CONFIG.facebook.pageId
        }
      };
      forceUpdate(n => n + 1);
    });
  }, []);
};

// Platform icons
const TikTokIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

const YouTubeIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const FacebookIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

// TikTok Embed Component - uses real TikTok embed
const TikTokEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isActive) return

    const loadTikTokEmbed = () => {
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]')
      if (existingScript) {
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
      <div className="h-full flex flex-col group">
        <div className="bg-zenith-black rounded-t-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 group-hover:bg-black">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <TikTokIcon className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Badminton Moldova</h3>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{SOCIAL_CONFIG.tiktok.handle}</p>
            </div>
          </div>

          <a
            href={SOCIAL_CONFIG.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zenith-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zenith-crimson hover:text-white transition-all shadow-xl hover:shadow-zenith-crimson/20"
          >
            <TikTokIcon className="w-5 h-5" />
            TikTok
            <ArrowRight size={16} />
          </a>
        </div>

        <div ref={containerRef} className="bg-white rounded-b-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] p-8 flex-1 flex flex-col justify-center border-x border-b border-gray-100">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="w-12 h-12 border-4 border-zenith-black/5 border-t-zenith-crimson rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Feed</p>
            </div>
          )}

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

const YouTubeEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!isActive) return

    const fetchVideos = async () => {
      try {
        let response = await fetch('/api/youtube-videos')
        if (!response.ok) {
          response = await fetch('/data/youtube_videos.json')
        }
        if (response.ok) {
          const data = await response.json()
          setVideos(data.videos || [])
        }
      } catch (error) {
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
    return date.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="flex flex-col items-center gap-8 group">
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zenith-black/95 backdrop-blur-xl p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-6xl aspect-video bg-black rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(220,38,38,0.3)] border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-zenith-crimson transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
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

      <div className="w-full">
        <div className="bg-zenith-black rounded-t-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 group-hover:bg-black transition-colors duration-500">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-white text-zenith-black flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
              <YouTubeIcon className="w-10 h-10" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Badminton 4 Life</h3>
              <p className="text-gray-500 text-sm font-black uppercase tracking-widest">{SOCIAL_CONFIG.youtube.handle}</p>
            </div>
          </div>

          <a
            href={SOCIAL_CONFIG.youtube.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 bg-zenith-crimson text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)]"
          >
            <YouTubeIcon className="w-5 h-5" />
            SUBSCRIBE
          </a>
        </div>

        <div className="bg-white rounded-b-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] p-10 border-x border-b border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-16 h-16 border-4 border-gray-100 border-t-zenith-crimson rounded-full animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {videos.slice(0, 3).map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="group/video relative aspect-video rounded-[2rem] overflow-hidden bg-gray-100 hover:scale-[1.05] transition-all duration-500 shadow-xl hover:shadow-2xl text-left"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover/video:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zenith-black/90 via-zenith-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                      <div className="w-20 h-20 rounded-full bg-zenith-crimson text-white flex items-center justify-center shadow-2xl scale-0 group-hover/video:scale-100 transition-transform duration-500">
                        <svg className="w-10 h-10 ml-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="text-white text-lg font-black uppercase tracking-tight line-clamp-2 leading-[1.1] mb-2">{video.title}</div>
                      <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">{formatDate(video.publishedAt)}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-12 text-center">
                <a
                  href={SOCIAL_CONFIG.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-4 px-12 py-6 bg-zenith-black text-white rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:bg-zenith-crimson transition-all hover:scale-105 shadow-2xl"
                >
                  {t('home.worldNews.viewAll')}
                  <ArrowRight size={18} />
                </a>
              </div>
            </>
          ) : (
            <div className="text-center py-20 uppercase tracking-widest font-black text-gray-300">No Content Found</div>
          )}
        </div>
      </div>
    </div>
  )
}

const FacebookEmbed: FC<{ isActive: boolean }> = ({ isActive }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [sdkLoaded, setSdkLoaded] = useState(false)

  useEffect(() => {
    if (!isActive) return

    const loadFacebookSDK = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse(containerRef.current)
        setSdkLoaded(true)
        return
      }

      if (document.getElementById('facebook-jssdk')) return

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
      <div className="h-full flex flex-col group">
        <div className="bg-zenith-black rounded-t-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-500 group-hover:bg-black">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <FacebookIcon className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Altius Badminton Club</h3>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">News & Community</p>
            </div>
          </div>

          <a
            href={SOCIAL_CONFIG.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-zenith-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zenith-crimson hover:text-white transition-all shadow-xl hover:shadow-zenith-crimson/20"
          >
            <FacebookIcon className="w-5 h-5" />
            Facebook
            <ArrowRight size={16} />
          </a>
        </div>

        <div ref={containerRef} className="bg-white rounded-b-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] overflow-hidden flex-1 flex flex-col justify-center border-x border-b border-gray-100">
          {!sdkLoaded && (
            <div className="flex flex-col items-center justify-center gap-4 p-12">
              <div className="w-12 h-12 border-4 border-zenith-black/5 border-t-zenith-crimson rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Posts</p>
            </div>
          )}

          <div className="w-full p-4 flex justify-center">
            <div
              className="fb-page w-full max-w-full"
              data-href={SOCIAL_CONFIG.facebook.url}
              data-tabs="timeline"
              data-width="700"
              data-height="650"
              data-small-header="true"
              data-adapt-container-width="true"
              data-hide-cover="false"
              data-show-facepile="false"
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

const SocialMediaHubLive: FC = () => {
  const { t } = useTranslation()
  useSocialConfig()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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
    <section ref={sectionRef} className="py-24 md:py-32 bg-zenith-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-24 relative text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-zenith-black text-white rounded-full mb-8 font-black uppercase tracking-[0.3em] text-[10px] border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zenith-crimson opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zenith-crimson"></span>
            </span>
            <span>{t('socialHub.badge', 'Мы в соцсетях')}</span>
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-[8rem] font-black font-display text-zenith-black mb-8 uppercase tracking-tighter leading-[0.9]">
            {t('socialHub.title', 'Live: Altius в соцсетях')}
          </h2>

          <div className="w-32 h-2 bg-zenith-crimson mx-auto mb-8 rounded-full" />

          <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto font-bold uppercase tracking-tight">
            {t('socialHub.subtitle', 'Следите за нашими тренировками, турнирами и новостями клуба')}
          </p>
        </motion.div>

        {isVisible && (
          <div className="space-y-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col lg:flex-row gap-10"
            >
              <div className="w-full lg:w-[700px] xl:w-[750px] lg:flex-shrink-0">
                <FacebookEmbed isActive={true} />
              </div>
              <div className="w-full lg:flex-1">
                <TikTokEmbed isActive={true} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <YouTubeEmbed isActive={true} />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SocialMediaHubLive;
