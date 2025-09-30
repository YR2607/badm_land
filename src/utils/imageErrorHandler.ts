/**
 * Универсальная обработка ошибок загрузки изображений
 * Заменяет сломанное изображение на градиентный фон
 */

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackGradient: string = 'from-blue-500 to-indigo-600'
) => {
  const target = e.currentTarget;
  
  // Скрываем сломанное изображение
  target.style.display = 'none';
  
  // Показываем fallback элемент если он есть
  const fallback = target.parentElement?.querySelector('.fallback-bg') as HTMLElement;
  if (fallback) {
    fallback.style.display = 'block';
  } else {
    // Создаем fallback элемент если его нет
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = `fallback-bg absolute inset-0 bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`;
    fallbackDiv.innerHTML = `
      <svg class="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    `;
    target.parentElement?.appendChild(fallbackDiv);
  }
};
