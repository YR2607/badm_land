import { FC, ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface InnerHeroProps {
    title: string;
    subtitle?: string;
    children?: ReactNode;
}

const InnerHero: FC<InnerHeroProps> = ({ title, subtitle, children }) => {
    return (
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 bg-zenith-black overflow-hidden">
            {/* Decorative SVG Badminton Court Background */}
            <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 1200 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <radialGradient id="innerCourtGradient" cx="50%" cy="50%" r="70%">
                            <stop offset="0%" stopColor="rgba(220,38,38,0.2)" />
                            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                        </radialGradient>
                    </defs>
                    <rect width="1200" height="600" fill="url(#innerCourtGradient)" />
                    <g stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none">
                        <rect x="100" y="50" width="1000" height="500" />
                        <line x1="600" y1="50" x2="600" y2="550" />
                        <line x1="100" y1="300" x2="1100" y2="300" />
                    </g>
                </svg>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Integrated Breadcrumbs */}
                <div className="mb-12 md:mb-20">
                    <Breadcrumbs className="!bg-transparent !border-none !p-0" isDark />
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <div
                        className="max-w-4xl"
                    >
                        {subtitle && (
                            <span className="block text-xs md:text-sm font-black uppercase tracking-[0.4em] text-zenith-crimson mb-6">
                                {subtitle}
                            </span>
                        )}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display leading-[0.85] tracking-tighter uppercase text-white mb-4 break-words [overflow-wrap:anywhere]">
                            {title}
                        </h1>
                    </div>

                    {children && (
                        <div
                            className="flex-shrink-0"
                        >
                            {children}
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Accent Decor */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </section>
    );
};

export default InnerHero;
