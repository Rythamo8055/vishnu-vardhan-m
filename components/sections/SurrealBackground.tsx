'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Surrealist animated background with floating organic shapes
const SurrealBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const shapesRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Animate each floating shape with random movement
            shapesRef.current.forEach((shape, i) => {
                if (!shape) return;

                // Random starting position
                gsap.set(shape, {
                    x: gsap.utils.random(-100, 100),
                    y: gsap.utils.random(-50, 50),
                    scale: gsap.utils.random(0.8, 1.2),
                    rotation: gsap.utils.random(-15, 15),
                });

                // Infinite floating animation with unique timing
                gsap.to(shape, {
                    x: `+=${gsap.utils.random(-80, 80)}`,
                    y: `+=${gsap.utils.random(-60, 60)}`,
                    rotation: `+=${gsap.utils.random(-20, 20)}`,
                    duration: gsap.utils.random(8, 15),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.3,
                });

                // Subtle scale breathing
                gsap.to(shape, {
                    scale: gsap.utils.random(0.9, 1.15),
                    duration: gsap.utils.random(4, 8),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.2,
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Surrealist color palette - dreamy pastels and deep tones
    const shapes = [
        { type: 'blob1', color: 'rgba(255, 183, 77, 0.6)', size: '35vw', top: '10%', left: '5%' },
        { type: 'blob2', color: 'rgba(129, 199, 132, 0.5)', size: '40vw', top: '50%', left: '60%' },
        { type: 'circle', color: 'rgba(100, 181, 246, 0.4)', size: '25vw', top: '70%', left: '20%' },
        { type: 'blob3', color: 'rgba(186, 104, 200, 0.5)', size: '30vw', top: '20%', left: '70%' },
        { type: 'circle', color: 'rgba(255, 138, 128, 0.5)', size: '20vw', top: '60%', left: '80%' },
        { type: 'blob1', color: 'rgba(255, 241, 118, 0.4)', size: '28vw', top: '80%', left: '40%' },
    ];

    const getBlobStyle = (type: string): React.CSSProperties => {
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            filter: 'blur(60px)',
            opacity: 0.8,
        };

        switch (type) {
            case 'blob1':
                return { ...baseStyle, borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' };
            case 'blob2':
                return { ...baseStyle, borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' };
            case 'blob3':
                return { ...baseStyle, borderRadius: '50% 50% 30% 70% / 50% 70% 30% 50%' };
            case 'circle':
                return { ...baseStyle, borderRadius: '50%' };
            default:
                return baseStyle;
        }
    };

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
            {/* Floating Shapes */}
            {shapes.map((shape, i) => (
                <div
                    key={i}
                    ref={(el) => { if (el) shapesRef.current[i] = el; }}
                    style={{
                        ...getBlobStyle(shape.type),
                        backgroundColor: shape.color,
                        width: shape.size,
                        height: shape.size,
                        top: shape.top,
                        left: shape.left,
                    }}
                />
            ))}

            {/* Grain Overlay for texture */}
            <div
                className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Surrealist Typography */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1
                    className="text-[20vw] font-black tracking-tighter leading-none select-none"
                    style={{
                        color: 'rgba(255,255,255,0.03)',
                        textShadow: '0 0 80px rgba(255,255,255,0.1)',
                        fontFamily: 'serif',
                    }}
                >
                    DREAM
                </h1>
            </div>

            {/* Floating accent lines */}
            <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
    );
};

export default SurrealBackground;
