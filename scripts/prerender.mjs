/**
 * Post-build prerender script.
 *
 * Vite builds a single index.html for the SPA.  Every route serves that
 * same file, which means Googlebot sees the SAME <title>, <meta description>,
 * <link rel="canonical">, and og:url for every page until JavaScript runs.
 *
 * This script reads the built dist/index.html and writes a per-route
 * copy with:
 *   - Correct canonical, title, meta description, OG/Twitter tags
 *   - Correct hreflang alternates
 *   - Visible body content (H1 + intro text) for crawlers that don't
 *     render JavaScript
 *   - Blog post pages fetched from Sanity (dynamic slugs)
 *
 * Vercel's filesystem check serves the prerendered file directly;
 * the React app hydrates on top.
 *
 * Run after `vite build` (added to package.json build script).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { createClient } from '@sanity/client';

// Load .env file (Vite does this automatically, but this is a plain Node script)
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const DIST = join(process.cwd(), 'dist');
const template = readFileSync(join(DIST, 'index.html'), 'utf-8');

const BASE = 'https://altius.md';

// ── Sanity client (for blog posts) ─────────────────────────────────
const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || process.env.SANITY_API_VERSION || '2024-01-01';

const sanityClient = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

// ── Page metadata per language ─────────────────────────────────────
// Titles/descriptions match what the React SEO component sets at runtime.
// If CMS overrides exist they'll still apply after hydration — this is
// just the static fallback for crawlers that don't render JS.
//
// h1: visible H1 heading injected into <body> for crawlers
// body: additional paragraph text for content depth

const META = {
  ro: {
    '': {
      title: 'Altius — Club de Badminton în Chișinău | Antrenamente profesionale',
      desc: 'Club de badminton Altius în Chișinău. Antrenamente pentru copii și adulți, sesiuni individuale și de grup, participare la turnee. Peste 15 ani experiență.',
      h1: 'Club de Badminton Altius Chișinău',
      body: 'Antrenamente profesionale de badminton pentru copii și adulți în Chișinău. Sesțiuni individuale și de grup, pregătire pentru competiții, participare la turnee. Peste 15 ani de experiență și 500+ de elevi.',
    },
    '/about': {
      title: 'Altius — Despre Club',
      desc: 'Antrenament profesional de badminton în Chișinău din 2010. Peste 500 de elevi, antrenori experimentați, rezultate la competiții.',
      h1: 'Despre Clubul Altius',
      body: 'Dezvoltăm badmintonul în Moldova din 2010. Peste 500 de elevi, antrenori experimentați, rezultate la competiții naționale și internaționale.',
    },
    '/services': {
      title: 'Servicii — Antrenamente de Badminton | Altius',
      desc: 'Antrenamente de grup și individuale de badminton în Chișinău. Programe pentru copii și adulți, pregătire pentru competiții.',
      h1: 'Servicii — Antrenamente de Badminton',
      body: 'Antrenamente de grup și individuale de badminton în Chișinău. Programe pentru copii și adulți, pregătire pentru competiții. Alegeți formatul potrivit pentru a vă atinge obiectivele.',
    },
    '/gyms': {
      title: 'Altius — Sălile Noastre',
      desc: '3 săli moderne cu echipament profesional în diferite cartiere ale Chișinăului.',
      h1: 'Sălile Noastre',
      body: '3 săli moderne cu echipament profesional în diferite cartiere ale Chișinăului. Fiecare sală oferă condiții optime pentru antrenamente de badminton la toate nivelurile.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Sala Malaya Malyan 24 | Altius Badminton',
      desc: 'Sala de badminton pe str. Malaya Malyan 24, echipament profesional, accesibil în Chișinău.',
      h1: 'Sala Malaya Malyan 24',
      body: 'Sala de badminton pe str. Malaya Malyan 24, echipament profesional, accesibil în Chișinău. Condiții optime pentru antrenamente individuale și de grup.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Sala 31 August 1989 | Altius Badminton',
      desc: 'Sala de badminton pe str. 31 August 1989, echipament profesional, accesibil în Chișinău.',
      h1: 'Sala 31 August 1989',
      body: 'Sala de badminton pe str. 31 August 1989, echipament profesional, accesibil în Chișinău. Condiții optime pentru antrenamente individuale și de grup.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Sala Ion Creangă 1 | Altius Badminton',
      desc: 'Sala de badminton pe str. Ion Creangă 1/2, echipament profesional, accesibil în Chișinău.',
      h1: 'Sala Ion Creangă 1',
      body: 'Sala de badminton pe str. Ion Creangă 1/2, echipament profesional, accesibil în Chișinău. Condiții optime pentru antrenamente individuale și de grup.',
    },
    '/gallery': {
      title: 'Altius — Galerie',
      desc: 'Fotografii și videoclipuri din sălile de badminton Altius, turnee și evenimente.',
      h1: 'Galerie',
      body: 'Fotografii ale clubului nostru, antrenori, antrenamente și turnee. Videoclipuri din sălile de badminton Altius și evenimentele la care participăm.',
    },
    '/blog': {
      title: 'Altius — Știri',
      desc: 'Ultimele știri de la clubul nostru și evenimentele mondiale de badminton.',
      h1: 'Știri',
      body: 'Urmăriți ultimele știri de la clubul nostru și evenimentele mondiale de badminton. Articole despre turnee, antrenori, elevi și realizările clubului Altius.',
    },
    '/contact': {
      title: 'Altius — Contact',
      desc: 'Sunați, scrieți sau vizitați-ne la oricare dintre sălile noastre din Chișinău.',
      h1: 'Contact',
      body: 'Sunați, scrieți sau vizitați-ne la oricare dintre sălile noastre din Chișinău. Telefon: +373 69 509 892. Adresă: str. Ion Creangă 1/2, Chișinău.',
    },
  },
  ru: {
    '': {
      title: 'Altius — Бадминтонный клуб в Кишиневе | Профессиональные тренировки',
      desc: 'Профессиональный бадминтонный клуб Altius в Кишиневе. Тренировки для детей и взрослых, индивидуальные и групповые занятия, участие в турнирах. 15+ лет опыта, 500+ учеников.',
      h1: 'Бадминтонный клуб Altius Кишинев',
      body: 'Профессиональные тренировки по бадминтону для детей и взрослых в Кишиневе. Индивидуальные и групповые занятия, подготовка к соревнованиям, участие в турнирах. Более 15 лет опыта и 500+ учеников.',
    },
    '/about': {
      title: 'Altius — О клубе',
      desc: 'Мы развиваем бадминтон в Молдове с 2010 года. Более 500 учеников, опытные тренеры, результаты на соревнованиях.',
      h1: 'О клубе Altius',
      body: 'Мы развиваем бадминтон в Молдове с 2010 года. Более 500 учеников, опытные тренеры, результаты на национальных и международных соревнованиях.',
    },
    '/services': {
      title: 'Услуги — Тренировки по бадминтону | Altius',
      desc: 'Групповые и индивидуальные тренировки по бадминтону в Кишиневе. Программы для детей и взрослых, подготовка к соревнованиям.',
      h1: 'Услуги — Тренировки по бадминтону',
      body: 'Групповые и индивидуальные тренировки по бадминтону в Кишиневе. Программы для детей и взрослых, подготовка к соревнованиям. От начинающих до профессионалов — у нас есть программа для каждого.',
    },
    '/gyms': {
      title: 'Altius — Наши залы',
      desc: '3 современных зала с профессиональным оборудованием в разных районах Кишинева.',
      h1: 'Наши залы',
      body: '3 современных зала с профессиональным оборудованием в разных районах Кишинева. Каждый зал предлагает оптимальные условия для тренировок по бадминтону на любом уровне.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Зал Малая Малян 24 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. Малая Малян 24, профессиональное оборудование, Кишинев.',
      h1: 'Зал Малая Малян 24',
      body: 'Зал для бадминтона на ул. Малая Малян 24, профессиональное оборудование, Кишинев. Оптимальные условия для индивидуальных и групповых тренировок.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Зал 31 Августа 1989 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. 31 Августа 1989, профессиональное оборудование, Кишинев.',
      h1: 'Зал 31 Августа 1989',
      body: 'Зал для бадминтона на ул. 31 Августа 1989, профессиональное оборудование, Кишинев. Оптимальные условия для индивидуальных и групповых тренировок.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Зал Ион Крянэ 1 | Altius Badminton',
      desc: 'Зал для бадминтона на ул. Ион Крянэ 1/2, профессиональное оборудование, Кишинев.',
      h1: 'Зал Ион Крянэ 1',
      body: 'Зал для бадминтона на ул. Ион Крянэ 1/2, профессиональное оборудование, Кишинев. Оптимальные условия для индивидуальных и групповых тренировок.',
    },
    '/gallery': {
      title: 'Altius — Галерея',
      desc: 'Фотографии и видео из залов бадминтона Altius, турниров и мероприятий.',
      h1: 'Галерея',
      body: 'Фотографии нашего клуба, тренеров, тренировок и турниров. Видео из залов бадминтона Altius и мероприятий, в которых мы участвуем.',
    },
    '/blog': {
      title: 'Altius — Новости',
      desc: 'Следите за последними новостями нашего клуба и мировыми событиями в бадминтоне.',
      h1: 'Новости',
      body: 'Следите за последними новостями нашего клуба и мировыми событиями в бадминтоне. Статьи о турнирах, тренерах, учениках и достижениях клуба Altius.',
    },
    '/contact': {
      title: 'Altius — Контакты',
      desc: 'Звоните, пишите или посетите нас в любом из наших залов в Кишиневе.',
      h1: 'Контакты',
      body: 'Позвоните, напишите или приходите к нам в любой из наших залов в Кишиневе. Телефон: +373 69 509 892. Адрес: str. Ion Creangă 1/2, Chișinău.',
    },
  },
  en: {
    '': {
      title: 'Altius — Badminton Club in Chisinau | Professional Training',
      desc: 'Professional badminton club Altius in Chisinau. Training for children and adults, individual and group sessions, tournament participation. 15+ years experience, 500+ students.',
      h1: 'Altius Badminton Club Chisinau',
      body: 'Professional badminton training for children and adults in Chisinau. Individual and group sessions, competition preparation, tournament participation. Over 15 years of experience and 500+ students.',
    },
    '/about': {
      title: 'Altius — About the Club',
      desc: 'We have been developing badminton in Moldova since 2010. Over 500 students, experienced coaches, competition results.',
      h1: 'About Club Altius',
      body: 'We have been developing badminton in Moldova since 2010. Over 500 students, experienced coaches, results at national and international competitions.',
    },
    '/services': {
      title: 'Services — Badminton Training | Altius',
      desc: 'Group and individual badminton training in Chisinau. Programs for children and adults, competition preparation.',
      h1: 'Services — Badminton Training',
      body: 'Group and individual badminton training in Chisinau. Programs for children and adults, competition preparation. From beginners to professionals — we have a program for everyone.',
    },
    '/gyms': {
      title: 'Altius — Our Gyms',
      desc: '3 modern facilities with professional equipment in different districts of Chisinau.',
      h1: 'Our Gyms',
      body: '3 modern facilities with professional equipment in different districts of Chisinau. Each gym offers optimal conditions for badminton training at all levels.',
    },
    '/gyms/malaya-malian-24': {
      title: 'Gym Malaya Malyan 24 | Altius Badminton',
      desc: 'Badminton gym at Malaya Malyan 24, professional equipment, Chisinau.',
      h1: 'Gym Malaya Malyan 24',
      body: 'Badminton gym at Malaya Malyan 24, professional equipment, Chisinau. Optimal conditions for individual and group training.',
    },
    '/gyms/31-avgusta-1989': {
      title: 'Gym 31 August 1989 | Altius Badminton',
      desc: 'Badminton gym at 31 August 1989, professional equipment, Chisinau.',
      h1: 'Gym 31 August 1989',
      body: 'Badminton gym at 31 August 1989, professional equipment, Chisinau. Optimal conditions for individual and group training.',
    },
    '/gyms/ion-creanga-1': {
      title: 'Gym Ion Creanga 1 | Altius Badminton',
      desc: 'Badminton gym at Ion Creanga 1/2, professional equipment, Chisinau.',
      h1: 'Gym Ion Creanga 1',
      body: 'Badminton gym at Ion Creanga 1/2, professional equipment, Chisinau. Optimal conditions for individual and group training.',
    },
    '/gallery': {
      title: 'Altius — Gallery',
      desc: 'Photos and videos from Altius badminton gyms, tournaments and events.',
      h1: 'Gallery',
      body: 'Photos of our club, coaches, training and tournaments. Videos from Altius badminton gyms and events we participate in.',
    },
    '/blog': {
      title: 'Altius — News',
      desc: 'Follow the latest news from our club and world badminton events.',
      h1: 'News',
      body: 'Follow the latest news from our club and world badminton events. Articles about tournaments, coaches, students and achievements of Club Altius.',
    },
    '/contact': {
      title: 'Altius — Contact',
      desc: 'Call, write or visit us at any of our gyms in Chisinau.',
      h1: 'Contact',
      body: 'Call, write or visit us at any of our gyms in Chisinau. Phone: +373 69 509 892. Address: str. Ion Creangă 1/2, Chișinău.',
    },
  },
};

const LOCALE_TAG = { ro: 'ro_RO', ru: 'ru_RU', en: 'en_US' };
const LANGS = ['ro', 'ru', 'en'];

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"');
}

function generate(lang, pagePath, overrides = {}) {
  const meta = META[lang][pagePath] || META[lang][''];
  const title = escapeHtml(overrides.title || meta.title);
  const desc = escapeHtml(overrides.desc || meta.desc);
  const h1 = escapeHtml(overrides.h1 || meta.h1 || meta.title);
  const body = escapeHtml(overrides.body || meta.body || meta.desc);
  const canonical = `${BASE}/${lang}${pagePath}`;
  const locale = LOCALE_TAG[lang];

  // Hreflang alternates
  const pathPart = pagePath || '';
  const hreflangs = LANGS.map(l =>
    `    <link rel="alternate" hreflang="${l}" href="${BASE}/${l}${pathPart}" />`
  ).join('\n');
  const xDefault = `    <link rel="alternate" hreflang="x-default" href="${BASE}/ro${pathPart}" />`;

  // OG locale alternates (other languages, not current)
  const ogAlternates = LANGS
    .filter(l => l !== lang)
    .map(l => `    <meta property="og:locale:alternate" content="${LOCALE_TAG[l]}" />`)
    .join('\n');

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

  // Replace stale og:locale:alternate tags with correct ones
  html = html.replace(/<meta property="og:locale:alternate"[^>]*>\s*/g, '');
  html = html.replace(
    /(<meta property="og:locale" content="[^"]*" \/>)/,
    `$1\n${ogAlternates}`
  );

  // Twitter tags
  html = html.replace(/<meta name="twitter:url" content="[^"]*"/, `<meta name="twitter:url" content="${canonical}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${desc}"`);

  // Inject hreflang tags after canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${canonical}" />\n${hreflangs}\n${xDefault}`
  );

  // Inject visible body content into <div id="root"> for crawlers.
  // React will replace this on hydration, so it's safe.
  // Content is hidden visually but visible to crawlers via noscript-style approach.
  // Actually, we inject it INSIDE #root — React hydration replaces it cleanly.
  const bodyContent = `    <h1>${h1}</h1>\n    <p>${body}</p>`;
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root" data-prerendered="true">${bodyContent}</div>`
  );

  return html;
}

// ── Fetch blog posts from Sanity ───────────────────────────────────
async function fetchBlogPosts() {
  if (!sanityClient) {
    console.log('[prerender] No Sanity project ID, skipping blog post prerender');
    return [];
  }
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && defined(slug.current)] | order(coalesce(date, _createdAt) desc) {
        "slug": slug.current,
        title,
        excerpt,
        date: coalesce(date, _createdAt)
      }
    `);
    return posts || [];
  } catch (e) {
    console.log('[prerender] Failed to fetch blog posts from Sanity, skipping');
    return [];
  }
}

// ── Generate all routes ─────────────────────────────────────────────
async function main() {
  let count = 0;

  // Static pages
  for (const lang of LANGS) {
    for (const pagePath of Object.keys(META[lang])) {
      const html = generate(lang, pagePath);
      const dir = join(DIST, lang, pagePath);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html);
      count++;
    }
  }

  // Blog posts from Sanity
  const posts = await fetchBlogPosts();
  for (const post of posts) {
    for (const lang of LANGS) {
      const pagePath = `/blog/${post.slug}`;
      const overrides = {
        title: `${post.title} | Altius`,
        desc: post.excerpt || META[lang]['/blog'].desc,
        h1: post.title,
        body: post.excerpt || META[lang]['/blog'].body,
      };
      const html = generate(lang, pagePath, overrides);
      const dir = join(DIST, lang, pagePath);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html);
      count++;
    }
  }

  console.log(`[prerender] Generated ${count} prerendered HTML files in dist/ (${posts.length} blog posts × 3 langs)`);
}

main().catch(e => {
  console.error('[prerender] Error:', e);
  process.exit(1);
});
