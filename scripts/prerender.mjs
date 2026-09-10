/**
 * Post-build prerender script.
 *
 * Vite builds a single index.html for the SPA.  Every route serves that
 * same file, which means Googlebot sees the SAME <title>, <meta description>,
 * <link rel="canonical">, and og:url for every page until JavaScript runs.
 *
 * This script reads the built dist/index.html and writes a per-route
 * copy with the correct canonical, title, description, and OG/Twitter
 * tags injected.  Vercel's filesystem check serves the prerendered file
 * directly; the React app hydrates on top.
 *
 * Run after `vite build` (added to package.json build script).
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

const BASE = 'https://altius.md';

// ── Page metadata per language ──────────────────────────────────────
// Titles/descriptions match what the React SEO component sets at runtime.
// If CMS overrides exist they'll still apply after hydration — this is
// just the static fallback for crawlers that don't render JS.

const META = {
  ro: {
    '': {
      title: 'Altius — Club de Badminton în Chișinău | Antrenamente profesionale',
      desc: 'Club de badminton Altius în Chișinău. Antrenamente pentru copii și adulți, sesiuni individuale și de grup, participare la turnee. Peste 15 ani experiență.',
    },
    '/about': {
      title: 'Altius — Despre Club',
      desc: 'Antrenament profesional de badminton în Chișinău din 2010. Peste 500 de elevi, antrenori experimentați, rezultate la competiții.',
    },
    '/services': {
      title: 'Servicii — Antrenamente de Badminton | Altius',
      desc: 'Antrenamente de grup și individuale de badminton în Chișinău. Programe pentru copii și adulți, pregătire pentru competiții.',
    },
    '/gyms': {
      title: 'Altius — Sălile Noastre',
      desc: '3 săli moderne cu echipament profesional în diferite cartiere ale Chișinăului.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Sala Malaya Malyan 24 | Altius Badminton',
      desc: 'Sala de badminton pe str. Malaya Malyan 24, echipament profesional, accesibil în Chișinău.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Sala 31 August 1989 | Altius Badminton',
      desc: 'Sala de badminton pe str. 31 August 1989, echipament profesional, accesibil în Chișinău.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Sala Ion Creangă 1 | Altius Badminton',
      desc: 'Sala de badminton pe str. Ion Creangă 1/2, echipament profesional, accesibil în Chișinău.',
    },
    '/gallery': {
      title: 'Altius — Galerie',
      desc: 'Fotografii și videoclipuri din sălile de badminton Altius, turnee și evenimente.',
    },
    '/blog': {
      title: 'Altius — Știri',
      desc: 'Ultimele știri de la clubul nostru și evenimentele mondiale de badminton.',
    },
    '/contact': {
      title: 'Altius — Contact',
      desc: 'Sunați, scrieți sau vizitați-ne la oricare dintre sălile noastre din Chișinău.',
    },
  },
  ru: {
    '': {
      title: 'Altius — Бадминтонный клуб в Кишиневе | Профессиональные тренировки',
      desc: 'Профессиональный бадминтонный клуб Altius в Кишиневе. Тренировки для детей и взрослых, индивидуальные и групповые занятия, участие в турнирах. 15+ лет опыта, 500+ учеников.',
    },
    '/about': {
      title: 'Altius — О клубе',
      desc: 'Мы развиваем бадминтон в Молдове с 2010 года. Более 500 учеников, опытные тренеры, результаты на соревнованиях.',
    },
    '/services': {
      title: 'Услуги — Тренировки по бадминтону | Altius',
      desc: 'Групповые и индивидуальные тренировки по бадминтону в Кишиневе. Программы для детей и взрослых, подготовка к соревнованиям.',
    },
    '/gyms': {
      title: 'Altius — Наши залы',
      desc: '3 современных зала с профессиональным оборудованием в разных районах Кишинева.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Зал Малая Малян 24 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. Малая Малян 24, профессиональное оборудование, Кишинев.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Зал 31 Августа 1989 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. 31 Августа 1989, профессиональное оборудование, Кишинев.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Зал Ион Крянэ 1 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. Ион Крянэ 1/2, профессиональное оборудование, Кишинев.',
    },
    '/gallery': {
      title: 'Altius — Галерея',
      desc: 'Фотографии и видео из залов бадминтона Altius, турниров и мероприятий.',
    },
    '/blog': {
      title: 'Altius — Новости',
      desc: 'Следите за последними новостями нашего клуба и мировыми событиями в бадминтоне.',
    },
    '/contact': {
      title: 'Altius — Контакты',
      desc: 'Звоните, пишите или посетите нас в любом из наших залов в Кишиневе.',
    },
  },
  en: {
    '': {
      title: 'Altius — Badminton Club in Chisinau | Professional Training',
      desc: 'Professional badminton club Altius in Chisinau. Training for children and adults, individual and group sessions, tournament participation. 15+ years experience, 500+ students.',
    },
    '/about': {
      title: 'Altius — About the Club',
      desc: 'We have been developing badminton in Moldova since 2010. Over 500 students, experienced coaches, competition results.',
    },
    '/services': {
      title: 'Services — Badminton Training | Altius',
      desc: 'Group and individual badminton training in Chisinau. Programs for children and adults, competition preparation.',
    },
    '/gyms': {
      title: 'Altius — Our Gyms',
      desc: '3 modern facilities with professional equipment in different districts of Chisinau.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Gym Malaya Malyan 24 | Altius Badminton',
      desc: 'Badminton gym at Malaya Malyan 24, professional equipment, Chisinau.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Gym 31 August 1989 | Altius Badminton',
      desc: 'Badminton gym at 31 August 1989, professional equipment, Chisinau.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Gym Ion Creanga 1 | Altius Badminton',
      desc: 'Badminton gym at Ion Creanga 1/2, professional equipment, Chisinau.',
    },
    '/gallery': {
      title: 'Altius — Gallery',
      desc: 'Photos and videos from Altius badminton gyms, tournaments and events.',
    },
    '/blog': {
      title: 'Altius — News',
      desc: 'Follow the latest news from our club and world badminton events.',
    },
    '/contact': {
      title: 'Altius — Contact',
      desc: 'Call, write or visit us at any of our gyms in Chisinau.',
    },
  },
};

const LOCALE_TAG = { ro: 'ro_RO', ru: 'ru_RU', en: 'en_US' };
const LANGS = ['ro', 'ru', 'en'];

function escapeHtml(s) {
  return s.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

function generate(lang, pagePath) {
  const meta = META[lang][pagePath] || META[lang][''];
  const canonical = `${BASE}/${lang}${pagePath}`;
  const title = escapeHtml(meta.title);
  const desc = escapeHtml(meta.desc);
  const locale = LOCALE_TAG[lang];

  // Hreflang alternates
  const pathPart = pagePath || '';
  const hreflangs = LANGS.map(l =>
    `    <link rel="alternate" hreflang="${l}" href="${BASE}/${l}${pathPart}" />`
  ).join('\n');
  const xDefault = `    <link rel="alternate" hreflang="x-default" href="${BASE}/ro${pathPart}" />`;

  let html = template;

  // <html lang>
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${lang}"`);

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);

  // <meta name="title">
  html = html.replace(/<meta name="title" content="[^"]*"/, `<meta name="title" content="${title}"`);

  // <meta name="description">
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${desc}"`);

  // Canonical
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${canonical}"`);

  // OG tags
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${canonical}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${desc}"`);
  html = html.replace(/<meta property="og:locale" content="[^"]*"/, `<meta property="og:locale" content="${locale}"`);

  // Remove stale og:locale:alternate tags (SEO.tsx manages them at runtime)
  html = html.replace(/<meta property="og:locale:alternate"[^>]*>\s*/g, '');

  // Twitter tags
  html = html.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${canonical}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${desc}"`);

  // Inject hreflang tags after canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />\n${hreflangs}\n${xDefault}`
  );

  return html;
}

// ── Generate all routes ─────────────────────────────────────────────
let count = 0;

for (const lang of LANGS) {
  for (const pagePath of Object.keys(META[lang])) {
    const html = generate(lang, pagePath);
    const dir = join(DIST, lang, pagePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    count++;
  }
}

console.log(`[prerender] Generated ${count} prerendered HTML files in dist/`);
