import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      
      {/* Синяя левая часть с градиентом */}
      <path 
        d="M20 20 L35 10 L50 30 L50 70 L35 90 L20 80 Z" 
        fill="url(#blueGradient)"
        className="drop-shadow-sm"
      />
      
      {/* Желтая средняя часть */}
      <path 
        d="M35 10 L50 5 L65 25 L50 30 Z" 
        fill="url(#yellowGradient)"
        className="drop-shadow-sm"
      />
      
      {/* Оранжевая правая часть */}
      <path 
        d="M50 5 L65 10 L80 20 L65 30 L50 30 Z" 
        fill="url(#orangeGradient)"
        className="drop-shadow-sm"
      />
      
      {/* Черная U-образная часть снизу */}
      <path 
        d="M25 70 L25 85 C25 90 30 95 35 95 L65 95 C70 95 75 90 75 85 L75 70 L65 70 L65 85 C65 87 63 89 61 89 L39 89 C37 89 35 87 35 85 L35 70 Z" 
        fill="url(#blackGradient)"
        className="drop-shadow-sm"
      />
      
      {/* Утончённые белые линии */}
      <path 
        d="M30 25 L30 75" 
        stroke="white" 
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path 
        d="M42 15 L42 32" 
        stroke="white" 
        strokeWidth="1"
        opacity="0.7"
      />
      <path 
        d="M58 15 L58 32" 
        stroke="white" 
        strokeWidth="1"
        opacity="0.7"
      />
      <path 
        d="M70 25 L70 75" 
        stroke="white" 
        strokeWidth="1.5"
        opacity="0.8"
      />
      <path 
        d="M45 77 C45 82 50 85 50 85 C50 85 55 82 55 77" 
        stroke="white" 
        strokeWidth="1.5"
        fill="none"
        opacity="0.8"
      />
    </svg>
  );
};

export default Logo;
