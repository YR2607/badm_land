/**
 * Универсальные Skeleton Loaders для различных компонентов
 */

// Базовый Skeleton элемент
export const SkeletonBase = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] rounded ${className}`} 
       style={{ animation: 'shimmer 2s infinite linear' }} />
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
