'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './SectionReveal.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface SectionRevealProps {
    children: ReactNode;
    gradientStart?: string;
    gradientEnd?: string;
    bgColor?: string;
    id?: string;
}

const SectionReveal = ({
    children,
    gradientStart = '#ff8709',
    gradientEnd = '#f7bdf8',
    bgColor = '#fff',
    id,
}: SectionRevealProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);

    // Curve paths - steep inverted U from bottom
    // Initial: flat at bottom (section hidden below)
    const initial = 'M 0 100 Q 50 100 100 100 L 100 100 L 0 100 Z';
    // Curved: steep dome/arch coming up
    const curved = 'M 0 100 Q 50 -20 100 100 L 100 100 L 0 100 Z';
    // Final: covers full screen
    const full = 'M 0 0 Q 50 0 100 0 L 100 100 L 0 100 Z';

    useEffect(() => {
        if (!sectionRef.current || !pathRef.current) return;

        // Set initial state
        gsap.set(pathRef.current, { attr: { d: initial } });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top bottom',
                end: 'top top',
                scrub: 1,
            },
        });

        // Phase 1: Curve rises steeply from bottom
        tl.to(pathRef.current, {
            attr: { d: curved },
            duration: 0.4,
            ease: 'power2.in',
        });

        // Phase 2: Curve flattens to cover full section
        tl.to(pathRef.current, {
            attr: { d: full },
            duration: 0.6,
            ease: 'power2.out',
        });

        return () => {
            tl.kill();
        };
    }, []);

    const gradientId = `sectionGradient-${id || Math.random().toString(36).slice(2)}`;

    return (
        <section ref={sectionRef} className={styles.section} id={id}>
            {/* Content behind the curve */}
            <div className={styles.content} style={{ background: bgColor }}>
                {children}
            </div>

            {/* SVG curve overlay at top of section */}
            <svg
                className={styles.curveOverlay}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0.2" stopColor={gradientStart} />
                        <stop offset="0.7" stopColor={gradientEnd} />
                    </linearGradient>
                </defs>
                <path
                    ref={pathRef}
                    fill={`url(#${gradientId})`}
                    d={initial}
                />
            </svg>
        </section>
    );
};

export default SectionReveal;
