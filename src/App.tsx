import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { lazy, Suspense } from 'react';
import Home from './pages/Home';
import Blog from './pages/Blog';

// Lazy load heavy components
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Gyms = lazy(() => import('./pages/Gyms'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const PostDetail = lazy(() => import('./pages/PostDetail'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-blue"></div>
  </div>
);

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Suspense fallback={<PageLoader />}><About /></Suspense>} />
        <Route path="/gallery" element={<Suspense fallback={<PageLoader />}><Gallery /></Suspense>} />
        <Route path="/services" element={<Suspense fallback={<PageLoader />}><Services /></Suspense>} />
        <Route path="/gyms" element={<Suspense fallback={<PageLoader />}><Gyms /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Suspense fallback={<PageLoader />}><PostDetail /></Suspense>} />
      </Routes>
    </Layout>
  );
}

export default App;
