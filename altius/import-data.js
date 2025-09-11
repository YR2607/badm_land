import {createClient} from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: 'your-project-id', // Замените на ваш project ID
  dataset: 'production',
  useCdn: false,
  token: 'your-token', // Замените на ваш токен с правами записи
  apiVersion: '2023-05-03'
})

async function importData() {
  try {
    // Импорт тренеров
    console.log('Импорт тренеров...')
    const trainers = JSON.parse(fs.readFileSync('./initialData/trainers.json', 'utf8'))
    for (const trainer of trainers) {
      await client.createOrReplace(trainer)
      console.log(`✓ Тренер ${trainer.name} импортирован`)
    }

    // Импорт залов
    console.log('Импорт залов...')
    const gyms = JSON.parse(fs.readFileSync('./initialData/gyms.json', 'utf8'))
    for (const gym of gyms) {
      await client.createOrReplace(gym)
      console.log(`✓ Зал ${gym.name} импортирован`)
    }

    // Импорт страниц
    console.log('Импорт страниц...')
    const pages = [
      'homePage.json',
      'aboutPage.json', 
      'servicesPage.json',
      'gymsPage.json',
      'contactPage.json'
    ]

    for (const pageFile of pages) {
      const pageData = JSON.parse(fs.readFileSync(`./initialData/${pageFile}`, 'utf8'))
      await client.createOrReplace(pageData)
      console.log(`✓ Страница ${pageData.title} импортирована`)
    }

    console.log('🎉 Все данные успешно импортированы!')
  } catch (error) {
    console.error('Ошибка при импорте:', error)
  }
}

importData()
