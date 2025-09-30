import React, { useEffect, useState } from 'react';
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

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-16">{t('common.loading')}</div>;
  if (!post) return <div className="max-w-3xl mx-auto px-4 py-16">{t('news.postNotFound', 'Материал не найден')}</div>;

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={post.title}
        description={post.excerpt || ''}
        image={post.image || 'https://altius.md/og-post.jpg'}
        type="article"
        author={post.author || 'Altius Badminton Club'}
        publishedTime={post.date}
        modifiedTime={post.date}
      />
      <Breadcrumbs
        items={[
          { label: t('navigation.home'), path: '/' },
          { label: t('navigation.news'), path: '/blog' },
          { label: post.title }
        ]}
      />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link to="/blog" className="text-primary-blue">← {t('news.backToList', 'Назад к новостям')}</Link>
        <h1 className="text-4xl font-display font-bold mt-4 mb-4">{post.title}</h1>
        {post.image && (
          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 mb-6">
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
            <div className="fallback-bg w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" style={{ display: 'none' }} />
          </div>
        )}
        <div className="prose max-w-none">
          {post.excerpt && <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>}
          {/* If body is portable text, you can render via @portabletext/react later */}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
