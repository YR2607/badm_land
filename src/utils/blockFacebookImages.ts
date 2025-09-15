// Глобальная блокировка Facebook изображений
export function blockFacebookImages() {
  // Блокируем через CSS
  const style = document.createElement('style');
  style.textContent = `
    img[src*="fbcdn.net"],
    img[src*="facebook.com/"] {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // Блокируем через MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          
          // Проверяем img теги
          const images = element.tagName === 'IMG' 
            ? [element as HTMLImageElement] 
            : Array.from(element.querySelectorAll('img'));
          
          images.forEach((img) => {
            const src = img.src || img.getAttribute('src') || '';
            if (src.includes('fbcdn.net') || src.includes('facebook.com')) {
              img.style.display = 'none';
              console.warn('Blocked Facebook image:', src);
            }
          });
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Блокируем существующие изображения
  const existingImages = document.querySelectorAll('img');
  existingImages.forEach((img) => {
    const src = img.src || img.getAttribute('src') || '';
    if (src.includes('fbcdn.net') || src.includes('facebook.com')) {
      img.style.display = 'none';
      console.warn('Blocked existing Facebook image:', src);
    }
  });
}

// Инициализация при загрузке DOM
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', blockFacebookImages);
  } else {
    blockFacebookImages();
  }
}
