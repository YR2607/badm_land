import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import LangGate from './components/LangGate';
import LangRedirect from './components/LangRedirect';
import LocalizedLink from './components/LocalizedLink';
import { lazy, Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

// Lazy load all pages for smaller initial bundle
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gyms = lazy(() => import('./pages/Gyms'));
const GymDetail = lazy(() => import('./pages/GymDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const AdminRedirect = lazy(() => import('./pages/AdminRedirect'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-blue"></div>
  </div>
);

// 404 Not Found component
const NotFound = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const meta = document.querySelector('meta[name="robots"]');
    if (meta) { meta.setAttribute('content', 'noindex, nofollow'); }
    else {
      const m = document.createElement('meta');
      m.name = 'robots';
      m.content = 'noindex, nofollow';
      document.head.appendChild(m);
    }
    return () => {
      // restore to index,follow when leaving 404
      const metaEl = document.querySelector('meta[name="robots"]');
      if (metaEl) { metaEl.setAttribute('content', 'index, follow'); }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zenith-white px-4">
      <div className="text-center">
        <h1 className="text-7xl md:text-9xl font-black font-display text-zenith-black uppercase tracking-tighter mb-6">
          404
        </h1>
        <p className="text-xl text-gray-500 font-medium mb-10 max-w-md mx-auto">
          {t('common.notFound', 'Страница не найдена')}
        </p>
        <LocalizedLink
          to="/"
          className="inline-flex items-center px-10 py-5 bg-zenith-black text-white font-black rounded-full hover:bg-zenith-crimson transition-colors uppercase tracking-widest text-sm"
        >
          {t('common.backHome', 'На главную')}
        </LocalizedLink>
      </div>
    </div>
  );
};

function App() {
  const { ready } = useTranslation();

  // Wait for i18n to be ready before rendering
  if (!ready) {
    return <PageLoader />;
  }

  return (
    <Layout>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Language-prefixed routes */}
          <Route path="/:lang" element={<LangGate />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="services" element={<Services />} />
            <Route path="gyms" element={<Gyms />} />
            <Route path="gyms/:slug" element={<GymDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<PostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Admin (no lang prefix) */}
          <Route path="/admin" element={<AdminRedirect />} />
          {/* Redirect bare paths to lang-prefixed */}
          <Route path="*" element={<LangRedirect />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
