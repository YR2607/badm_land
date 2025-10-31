import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config({ path: path.join(__dirname, '../.env') });

// Создаем клиент Sanity
const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  token: process.env.SANITY_STUDIO_TOKEN, // Нужен токен с правами на запись
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Проверяем наличие необходимых переменных
if (!process.env.SANITY_STUDIO_PROJECT_ID) {
  console.error('❌ Ошибка: SANITY_STUDIO_PROJECT_ID не найден в .env файле');
  process.exit(1);
}

if (!process.env.SANITY_STUDIO_TOKEN) {
  console.error('❌ Ошибка: SANITY_STUDIO_TOKEN не найден в .env файле');
  console.log('\n💡 Создайте токен в Sanity:');
  console.log('   1. Откройте https://www.sanity.io/manage');
  console.log('   2. Выберите ваш проект');
  console.log('   3. API → Tokens → Add API token');
  console.log('   4. Права: Editor');
  console.log('   5. Скопируйте токен в .env файл');
  process.exit(1);
}

async function importData() {
  console.log('🚀 Начинаем импорт данных в Sanity...\n');

  try {
    // Загружаем данные из JSON файлов
    const strategyPath = path.join(__dirname, '../initial-data/aboutStrategy.json');
    const roadmapPath = path.join(__dirname, '../initial-data/aboutRoadmap.json');

    const strategyData = JSON.parse(fs.readFileSync(strategyPath, 'utf-8'));
    const roadmapData = JSON.parse(fs.readFileSync(roadmapPath, 'utf-8'));

    console.log('📄 Файлы загружены успешно');

    // Импортируем стратегию
    console.log('\n📝 Импортируем стратегию...');
    const strategyDoc = {
      _id: 'aboutStrategy',
      _type: 'aboutStrategy',
      ...strategyData,
    };

    await client.createOrReplace(strategyDoc);
    console.log('✅ Стратегия импортирована');

    // Импортируем роадмап
    console.log('\n📝 Импортируем план развития...');
    const roadmapDoc = {
      _id: 'aboutRoadmap',
      _type: 'aboutRoadmap',
      ...roadmapData,
    };

    await client.createOrReplace(roadmapDoc);
    console.log('✅ План развития импортирован');

    console.log('\n🎉 Импорт завершен успешно!');
    console.log('\n📋 Что импортировано:');
    console.log('   - Стратегия (миссия, текущее состояние, цели, результаты)');
    console.log('   - План развития (5 карточек по годам)');
    console.log('   - Все данные на 3 языках (RU, EN, RO)');
    console.log('\n💡 Откройте Sanity Studio и проверьте документы:');
    console.log('   - "О клубе — Стратегия"');
    console.log('   - "О клубе — Планы развития"');

  } catch (error) {
    console.error('❌ Ошибка при импорте:', error.message);
    process.exit(1);
  }
}

// Запускаем импорт
importData();
