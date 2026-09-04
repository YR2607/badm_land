import { FC, useState, useEffect } from 'react';
import { ChevronDown, Phone, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '../components/LocalizedLink';
import InnerHero from '../components/InnerHero';
import SEO from '../components/SEO';
import JsonLd from '../components/JsonLd';
import { fetchServicesPage, CmsServicesPage, fetchServicesHero, type CmsHero, fetchHomePage, type CmsHomePage } from '../lib/cms';
import { addCmsDevMarkers } from '../utils/cmsDevMarker';
import ServicesSection from '../components/ServicesSection';

const Services: FC = () => {
  const { t, i18n } = useTranslation();
  const [cmsData, setCmsData] = useState<CmsServicesPage | null>(null);
  const [heroData, setHeroData] = useState<CmsHero | null>(null);
  const [homeServicesSection, setHomeServicesSection] = useState<CmsHomePage['servicesSection'] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCmsData = async () => {
      try {
        const [data, hero, home] = await Promise.all([
          fetchServicesPage(i18n.language as string),
          fetchServicesHero(i18n.language as string),
          fetchHomePage(i18n.language as string),
        ]);
        if (data) setCmsData(addCmsDevMarkers(data));
        if (hero) setHeroData(addCmsDevMarkers(hero));
        if (home?.servicesSection) {
          setHomeServicesSection(addCmsDevMarkers(home.servicesSection));
        } else {
          setHomeServicesSection(null);
        }
      } catch (error) {
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    loadCmsData();
  }, [i18n.language, t]);

  const faqs: Array<{ q: string; a: string }> = [
    { q: t('services.faq.questions.howToSignUp.q'), a: t('services.faq.questions.howToSignUp.a') },
    { q: t('services.faq.questions.trialSession.q'), a: t('services.faq.questions.trialSession.a') },
    { q: t('services.faq.questions.equipment.q'), a: t('services.faq.questions.equipment.a') },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-blue text-white rounded hover:bg-blue-600"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zenith-white">
      <SEO
        title={cmsData?.seo?.metaTitle || "Услуги - Тренировки по бадминтону | Altius"}
        description={cmsData?.seo?.metaDescription || "Групповые и индивидуальные тренировки по бадминтону в Кишиневе. Программы для детей и взрослых, подготовка к соревнованиям."}
        keywords={cmsData?.seo?.keywords || "тренировки бадминтон, групповые занятия, индивидуальные тренировки, цены бадминтон, Кишинев"}
        image="https://altius.md/og-services.jpg"
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": cmsData?.seo?.metaTitle || "Услуги - Тренировки по бадминтону | Altius",
        "url": "https://altius.md/services",
        "description": cmsData?.seo?.metaDescription || "Групповые и индивидуальные тренировки по бадминтону в Кишиневе.",
        "isPartOf": {
          "@type": "WebSite",
          "name": "Altius Badminton Club",
          "url": "https://altius.md/"
        }
      }} />
      <InnerHero
        title={heroData?.title || t('navigation.services')}
        subtitle={heroData?.subtitle || t('services.hero.subtitle', 'Групповые и индивидуальные тренировки')}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10">
          {(heroData?.statistics || []).map((stat, i) => (
            <div key={i} className={`text-center group ${(heroData?.statistics || []).length % 2 !== 0 && i === (heroData?.statistics || []).length - 1 ? 'col-span-2' : ''}`}>
              <div className="text-3xl md:text-4xl font-black font-display text-zenith-crimson group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-[10px] text-white/50 uppercase tracking-widest font-black leading-tight">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </InnerHero>

      {loading ? (
        <section className="py-32 bg-zenith-white relative overflow-hidden" aria-busy="true" aria-label={t('common.loading', 'Загрузка...')}>
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mb-32 text-center md:text-right">
              <div className="animate-pulse h-16 w-64 bg-gray-100 rounded-2xl mx-auto md:ml-auto md:mr-0" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse h-96 rounded-[2.5rem] bg-gray-100" />
              ))}
            </div>
          </div>
        </section>
      ) : homeServicesSection ? (
        <ServicesSection cmsData={homeServicesSection} />
      ) : null}

      <section
        className="py-24 bg-zenith-white relative overflow-hidden"
      >
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-zenith-crimson/5 blur-3xl rounded-full" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="text-center"
          >
            <h2 className="text-4xl md:text-7xl font-black font-display text-zenith-black mb-6 uppercase tracking-tighter break-words [overflow-wrap:anywhere]">{t('services.gyms.title')}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 font-medium">
              {t('services.gyms.subtitle')}
            </p>

            <div
              className="inline-flex items-center gap-3 px-10 py-5 bg-zenith-black text-white font-black rounded-full hover:bg-zenith-crimson transition-all duration-300 shadow-xl hover:shadow-[0_10px_40px_-10px_rgba(220,38,38,0.5)] uppercase tracking-widest text-sm hover:scale-105 active:scale-95"
            >
              <LocalizedLink to="/gyms" className="inline-flex items-center gap-3">
                <span className="text-2xl">🏸</span>
                {t('services.gyms.viewAll')}
                <ArrowRight className="w-5 h-5" />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        className="py-32 bg-zenith-white relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className="text-center mb-24"
          >
            <h2 className="text-4xl md:text-6xl font-black font-display text-zenith-black mb-6 uppercase tracking-tighter leading-none break-words [overflow-wrap:anywhere]">{t('services.faq.title')}</h2>
            <div className="w-24 h-2 bg-zenith-crimson mx-auto mb-8 rounded-full" />
            <p className="text-xl text-gray-500 font-bold uppercase tracking-widest">{t('services.faq.subtitle')}</p>
          </div>

          <div className="space-y-6">
            {faqs.map((f, idx) => (
              <div
                key={idx}
                className={`rounded-[2rem] overflow-hidden transition-all duration-500 border-2 ${openFaq === idx ? 'bg-white shadow-2xl border-zenith-crimson/20 -translate-y-1' : 'bg-white border-gray-100 hover:border-zenith-crimson/20'}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  className="w-full px-10 py-8 text-left flex justify-between items-center transition-colors"
                >
                  <span className={`font-black text-xl uppercase tracking-tight transition-colors ${openFaq === idx ? 'text-zenith-crimson' : 'text-zenith-black'}`}>{f.q}</span>
                  <div className={`flex-shrink-0 ml-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${openFaq === idx ? 'bg-zenith-crimson text-white rotate-180 shadow-lg shadow-zenith-crimson/20' : 'bg-gray-50 text-zenith-black'}`}>
                    <ChevronDown className={`w-6 h-6`} />
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-10 pb-10 pt-2">
                    <div className="h-px w-20 bg-zenith-crimson/20 mb-8" />
                    <p className="text-lg text-gray-600 leading-relaxed font-medium">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section
        className="py-24 bg-zenith-black text-white relative overflow-hidden"
      >
        {/* Dynamic background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-zenith-crimson/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-zenith-crimson/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-4xl md:text-6xl font-black font-display mb-8 uppercase tracking-tighter break-words [overflow-wrap:anywhere]"
          >
            {t('services.cta.title')}
          </h2>
          <p
            className="text-xl md:text-2xl text-gray-400 font-medium mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('services.cta.subtitle')}
          </p>
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <LocalizedLink
              to="/contact"
              className="inline-flex items-center justify-center px-10 py-5 bg-zenith-crimson text-white font-black rounded-full hover:bg-red-700 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(220,38,38,0.5)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.7)] uppercase tracking-widest text-sm hover:-translate-y-1"
            >
              {t('services.cta.contact')}
            </LocalizedLink>
            <a
              href="tel:+37369509892"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 uppercase tracking-widest text-sm group"
            >
              <Phone className="w-5 h-5 mr-3 group-hover:animate-bounce" />
              {t('services.cta.call')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
