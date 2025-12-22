/**
 * Универсальные Skeleton Loaders для различных компонентов
 */

// Базовый Skeleton элемент
export const SkeletonBase = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{ animation: 'shimmer 2s infinite linear' }} />
);

// Skeleton для карточки услуги
export const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 h-full">
    <div className="animate-pulse space-y-4">
      {/* Icon */}
      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
      
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Features */}
      <div className="space-y-2 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded flex-1" />
          </div>
        ))}
      </div>
      
      {/* Price */}
      <div className="pt-4">
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-12 bg-gray-200 rounded w-full" />
      </div>
    </div>
  </div>
);

// Skeleton для карточки достижения
export const AchievementCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-8 text-center">
    <div className="animate-pulse space-y-4">
      {/* Icon */}
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto" />
      
      {/* Count */}
      <div className="h-8 bg-gray-200 rounded w-20 mx-auto" />
      
      {/* Title */}
      <div className="h-5 bg-gray-200 rounded w-32 mx-auto" />
      
      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5 mx-auto" />
      </div>
    </div>
  </div>
);

// Skeleton для карточки зала
export const GymCardSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
    <div className="animate-pulse">
      {/* Image */}
      <div className="h-56 bg-gray-200" />
      
      {/* Content */}
      <div className="p-8 space-y-4">
        {/* Badge */}
        <div className="h-8 bg-gray-200 rounded-2xl w-24" />
        
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        
        {/* Tags */}
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded-2xl w-32" />
          <div className="h-10 bg-gray-200 rounded-2xl w-28" />
        </div>
        
        {/* Features */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-200 rounded-full" />
              <div className="h-4 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
        
        {/* Button */}
        <div className="h-14 bg-gray-200 rounded-2xl w-full" />
      </div>
    </div>
  </div>
);

// Skeleton для карточки новости
export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-3xl overflow-hidden">
    <div className="animate-pulse">
      {/* Image */}
      <div className="h-48 bg-gray-200" />
      
      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category & Date */}
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded-full w-20" />
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-5 bg-gray-200 rounded w-4/5" />
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        
        {/* Read more */}
        <div className="h-4 bg-gray-200 rounded w-32" />
      </div>
    </div>
  </div>
);

// Skeleton для изображения галереи
export const GalleryImageSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-gray-200 animate-pulse" style={{ aspectRatio: '4/3' }}>
    <div className="w-full h-full flex items-center justify-center">
      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  </div>
);

// Skeleton для Hero секции
export const HeroSkeleton = () => (
  <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
    <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="animate-pulse space-y-8">
        {/* Badge */}
        <div className="h-12 bg-gray-700 rounded-full w-64 mx-auto" />
        
        {/* Title */}
        <div className="space-y-4">
          <div className="h-16 bg-gray-700 rounded w-3/4 mx-auto" />
          <div className="h-12 bg-gray-700 rounded w-1/2 mx-auto" />
        </div>
        
        {/* Description */}
        <div className="space-y-3 max-w-4xl mx-auto">
          <div className="h-6 bg-gray-700 rounded w-full" />
          <div className="h-6 bg-gray-700 rounded w-5/6 mx-auto" />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-6 justify-center">
          <div className="h-16 bg-gray-700 rounded-2xl w-48" />
          <div className="h-16 bg-gray-700 rounded-2xl w-48" />
        </div>
      </div>
    </div>
  </section>
);

// Skeleton для списка (универсальный)
export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-lg">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// Skeleton для таблицы
export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="bg-white rounded-2xl overflow-hidden">
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-gray-100 p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// CSS для shimmer эффекта (добавить в index.css)
export const shimmerStyles = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;
