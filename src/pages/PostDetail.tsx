import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from '../components/Breadcrumbs';
import SEO from '../components/SEO';
import { proxied } from '../utils/blockFacebookImages';
import { isCmsEnabled, sanityClient } from '../lib/cms';
import groq from 'groq';

const PostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!isCmsEnabled || !sanityClient || !slug) { setLoading(false); return; }
      const query = groq`*[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        body,
        "image": mainImage.asset->url,
        "date": coalesce(publishedAt, _createdAt),
        category,
        "author": author->name
      }`;
      const data = await sanityClient.fetch(query, { slug });
      setPost(data || null);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <div className="min-h-screen bg-zenith-white flex items-center justify-center font-black uppercase tracking-widest text-zenith-black/20">{t('common.loading')}</div>;
  if (!post) return <div className="min-h-screen bg-zenith-white flex items-center justify-center font-black uppercase tracking-widest text-zenith-crimson">{t('news.postNotFound', 'Материал не найден')}</div>;

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={post.title}
        description={post.excerpt || ''}
        image={post.image || 'https://altius.md/og-post.jpg'}
        type="article"
        author={post.author || 'Altius Badminton Club'}
        publishedTime={post.date}
        modifiedTime={post.date}
      />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-20">
        <Breadcrumbs
          items={[
            { label: t('navigation.home'), path: '/' },
            { label: t('navigation.news'), path: '/blog' },
            { label: post.title }
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 group text-zenith-black font-black uppercase tracking-widest text-xs mb-12 hover:text-zenith-crimson transition-colors"
        >
          <span className="w-8 h-8 rounded-full bg-zenith-black text-white flex items-center justify-center group-hover:bg-zenith-crimson transition-colors">
            ←
          </span>
          {t('news.backToList', 'Назад к новостям')}
        </Link>

        <motion.h1
          className="text-5xl md:text-8xl font-black font-display text-zenith-black mb-12 uppercase tracking-tighter leading-[0.9]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {post.title}
        </motion.h1>

        {post.image && (
          <motion.div
            className="w-full aspect-[21/9] rounded-[3rem] overflow-hidden bg-gray-100 mb-16 relative shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <img
              src={proxied(post.image)}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.parentElement?.querySelector('.fallback-bg') as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="fallback-bg w-full h-full bg-zenith-black flex items-center justify-center" style={{ display: 'none' }}>
              <Globe className="w-16 h-16 text-white/20" />
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12 pb-12 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zenith-black text-white flex items-center justify-center font-black text-xl">
                {post.author?.[0] || 'A'}
              </div>
              <div>
                <div className="text-[10px] font-black text-zenith-black/40 uppercase tracking-widest mb-1">Автор</div>
                <div className="font-black text-zenith-black uppercase tracking-tight">{post.author || 'Altius Team'}</div>
              </div>
            </div>
            <div className="w-px h-12 bg-gray-100" />
            <div>
              <div className="text-[10px] font-black text-zenith-black/40 uppercase tracking-widest mb-1">Дата публикации</div>
              <div className="font-black text-zenith-black uppercase tracking-tight">
                {new Date(post.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="prose prose-2xl prose-p:font-medium prose-p:text-gray-700 prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter max-w-none">
            {post.excerpt && <p className="text-3xl text-zenith-black leading-tight font-black mb-12 uppercase tracking-tight">{post.excerpt}</p>}
            {/* If body is portable text, you can render via @portabletext/react later */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
