import { proxied } from './blockFacebookImages';

// Утилита для проксирования Facebook изображений
export function getProxiedImageUrl(originalUrl: string): string {
  return proxied(originalUrl);
}

// Компонент для безопасной загрузки изображений с fallback
export function createImageWithFallback(src: string, alt: string, className: string, onError?: () => void) {
  const img = document.createElement('img');
  img.src = getProxiedImageUrl(src);
  img.alt = alt;
  img.className = className;
  
  img.onerror = () => {
    if (onError) {
      onError();
    }
  };
  
  return img;
}
