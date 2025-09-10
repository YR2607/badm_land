import { type FC, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, User, Trophy, Star, CheckCircle, ArrowRight, Phone } from 'lucide-react';
import { fetchPage, isCmsEnabled, CmsPage } from '../lib/cms';

const Services: FC = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  useEffect(() => {
    (async () => {
      if (!isCmsEnabled) return;
      const data = await fetchPage('services');
      setPage(data);
    })();
  }, []);

  const services = [
    {
      id: 'group',
      icon: <Users className="w-12 h-12" />,
      title: 'Групповые тренировки',
      description: 'Тренировки в небольших группах до 8 человек с профессиональными тренерами',
      priceMonthly: 'от 200 лей',
      pricePerSession: 'от 60 лей',
      features: ['Все уровни подготовки', 'Современное оборудование', 'Гибкое расписание', 'Дружелюбная атмосфера', 'Прогресс отслеживание'],
      color: 'from-primary-blue to-blue-600',
      popular: false
    },
    {
      id: 'individual',
      icon: <User className="w-12 h-12" />,
      title: 'Индивидуальные занятия',
      description: 'Персональные тренировки с личным тренером для быстрого прогресса',
      priceMonthly: 'от 1400 лей',
      pricePerSession: 'от 400 лей',
      features: ['Индивидуальная программа', 'Гибкий график', 'Максимальное внимание', 'Быстрый прогресс', 'Видеоанализ техники'],
      color: 'from-primary-orange to-orange-600',
      popular: true
    },
    {
      id: 'competition',
      icon: <Trophy className="w-12 h-12" />,
      title: 'Подготовка к соревнованиям',
      description: 'Специализированная подготовка для участия в турнирах и соревнованиях',
      priceMonthly: 'от 500 лей',
      pricePerSession: '—',
      features: ['Техническая подготовка', 'Тактическое планирование', 'Психологическая поддержка', 'Спарринг партнеры', 'Анализ соперников'],
      color: 'from-primary-yellow to-yellow-600',
      popular: false
    }
  ];

  const additionalServices = [
    { title: 'Детские группы', description: 'Специальные программы для детей 6-16 лет', icon: '👨‍👩‍👧‍👦' },
    { title: 'Корпоративные занятия', description: 'Тимбилдинг и корпоративные тренировки', icon: '🏢' },
    { title: 'Мастер-классы', description: 'Специальные семинары с приглашенными тренерами', icon: '🎓' },
    { title: 'Фитнес программы', description: 'Общая физическая подготовка для бадминтона', icon: '💪' }
  ];

  const [billing, setBilling] = useState<'monthly' | 'per_session'>('monthly');
  const priceFor = (s: any) => (billing === 'monthly' ? s.priceMonthly : s.pricePerSession);

  const faqs: Array<{ q: string; a: string }> = [
    { q: 'Как записаться на тренировку?', a: 'Оставьте заявку через контактную форму на странице Контакты или позвоните нам — подберём удобное время и группу.' },
    { q: 'Можно ли прийти на пробное занятие?', a: 'Да, у нас есть пробная тренировка. Свяжитесь с администратором, чтобы согласовать дату и время.' },
    { q: 'Нужен ли свой инвентарь?', a: 'Ракетки и воланы предоставим на первых занятиях. Позже поможем выбрать подходящее оборудование.' },
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-blue/90 to-primary-orange" />
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-4">{page?.heroTitle || 'Наши услуги'}</h1>
              <p className="text-lg md:text-2xl max-w-3xl mx-auto opacity-90">{page?.heroSubtitle || 'Полный спектр для вашего прогресса в бадминтоне'}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MAIN CARDS */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center rounded-full border border-gray-200 p-1 bg-white shadow-sm">
              <button className={`px-4 py-1.5 text-sm rounded-full ${billing === 'monthly' ? 'bg-primary-blue text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setBilling('monthly')}>/мес</button>
              <button className={`px-4 py-1.5 text-sm rounded-full ${billing === 'per_session' ? 'bg-primary-blue text-white' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setBilling('per_session')}>/занятие</button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.article
                key={service.id}
                className={`bg-white rounded-2xl border border-gray-200 p-6 relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${service.popular ? 'ring-2 ring-primary-orange/60' : 'hover:border-primary-blue/30'}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
                style={{ willChange: 'transform' }}
              >
                {/* Top gradient bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color}`} />
                {service.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-orange text-white px-4 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 shadow">
                      <Star className="w-3.5 h-3.5" /> Популярно
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4 mb-5">
                  <div className={`p-4 bg-gradient-to-r ${service.color} rounded-xl text-white flex-shrink-0 shadow-sm`}>{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>

                {/* Feature pills */}
                <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {service.features.map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-2xl font-bold text-primary-blue">{priceFor(service)} <span className="text-sm text-gray-500">{billing === 'monthly' ? '/мес' : '/занятие'}</span></div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors">
                    Записаться
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Сравнение форматов</h3>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-4 gap-0 border-b border-gray-200">
                <div className="px-4 py-3 text-sm text-gray-500">Параметр</div>
                {services.map((s) => (
                  <div key={s.id} className="px-4 py-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span className={`inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-r ${s.color}`} />
                    {s.title}
                  </div>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-200">
                {[
                  { k: 'Размер группы', v: ['до 8', '1 на 1', '2–4'] },
                  { k: 'Индивидуальный план', v: ['Опционально', 'Да', 'Да'] },
                  { k: 'Видеоанализ', v: ['Опционально', 'Да', 'Да'] },
                  { k: 'Соревновательная практика', v: ['Клубные игры', 'По запросу', 'Регулярно'] },
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-4">
                    <div className="px-4 py-3 text-sm text-gray-700 bg-gray-50">{row.k}</div>
                    {row.v.map((val, j) => (
                      <div key={j} className="px-4 py-3 text-sm">
                        {val === 'Да' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs border border-emerald-200">✓ Да</span>
                        ) : val === 'Опционально' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 text-amber-700 text-xs border border-amber-200">~ Опционально</span>
                        ) : val === '—' ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 text-gray-600 text-xs border border-gray-200">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200">{val}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.32 }}>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-2">Дополнительные услуги</h2>
            <p className="text-lg text-gray-600">Еще больше возможностей для вашего развития</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalServices.map((srv, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:border-primary-blue/30 hover:shadow-md transition-all duration-200"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.32, delay: index * 0.06 }}
                style={{ willChange: 'transform' }}
              >
                <div className="text-4xl mb-3">{srv.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{srv.title}</h3>
                <p className="text-gray-600 text-sm">{srv.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Частые вопросы</h3>
          <div className="space-y-3">
            {faqs.map((f, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button className="w-full text-left px-4 py-3 flex items-center justify-between" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
                  <span className="font-medium text-gray-900">{f.q}</span>
                  <span className="text-primary-blue">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <div className="px-4 pb-4 text-gray-600 text-sm">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 inset-x-0 px-4 md:hidden z-40">
        <div className="bg-primary-blue text-white rounded-full shadow-lg flex items-center justify-between px-4 py-3">
          <div className="text-sm">
            <div className="font-semibold">Записаться на тренировку</div>
            <div className="text-white/80">Мы перезвоним и подберём формат</div>
          </div>
          <a href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-blue px-3 py-2 rounded-full text-sm font-medium">
            <Phone className="w-4 h-4" /> Связаться
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;
