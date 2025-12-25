'use client';

import SurrealBackground from './SurrealBackground';

// Reusable content component for Clone Layer strategy
const CuriousContent = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Surrealist Animated Background */}
            <SurrealBackground />

            {/* Bold Typography Layer */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <h1
                    className="text-[12vw] leading-[0.9] font-black tracking-tighter text-white/90 select-none text-center"
                    style={{
                        textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    EXPLORE<br />THE UNSEEN
                </h1>
            </div>

            {/* Bottom Caption */}
            <div className="absolute bottom-16 left-10 z-10 max-w-md">
                <p className="text-white/60 text-sm font-light uppercase tracking-[0.3em] mb-2">Journey Within</p>
                <p className="text-white/40 text-xs leading-relaxed">
                    Move through the dreamscape. The scanner reveals what lies beneath the surface.
                </p>
            </div>
        </div>
    );
};

export default CuriousContent;
