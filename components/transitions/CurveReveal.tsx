'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CurveReveal.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface CurveRevealProps {
    children: ReactNode;
    nextSection: ReactNode;
    gradientStart?: string;
    gradientEnd?: string;
}

const CurveReveal = ({
    children,
    nextSection,
    gradientStart = '#ff8709',
    gradientEnd = '#f7bdf8',
}: CurveRevealProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    // Path states
    const initial = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
    const start = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
    const end = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

    useEffect(() => {
        if (!containerRef.current || !pathRef.current) return;

        const path = pathRef.current;

        // Set initial path
        gsap.set(path, { attr: { d: initial } });

        // Create scroll-triggered animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=150%',
                scrub: 1,
                pin: true,
                onUpdate: (self) => {
                    if (self.progress > 0.9 && !isRevealed) {
                        setIsRevealed(true);
                    }
                },
            },
        });

        // Phase 1: Curve comes up (0 to 50% scroll)
        tl.to(path, {
            attr: { d: start },
            duration: 0.5,
            ease: 'power2.in',
        });

        // Phase 2: Curve flattens to reveal (50% to 100% scroll)
        tl.to(path, {
            attr: { d: end },
            duration: 0.5,
            ease: 'power2.out',
        });

        return () => {
            tl.kill();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, [isRevealed]);

    return (
        <>
            <div ref={containerRef} className={styles.container}>
                {/* Current section content */}
                <div className={styles.currentSection}>{children}</div>

                {/* Next section content (revealed) */}
                <div className={styles.nextSection}>{nextSection}</div>

                {/* SVG Curve overlay */}
                <svg
                    className={styles.curveOverlay}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="curveGradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0.2" stopColor={gradientStart} />
                            <stop offset="0.7" stopColor={gradientEnd} />
                        </linearGradient>
                    </defs>
                    <path
                        ref={pathRef}
                        className={styles.path}
                        fill="url(#curveGradient)"
                        stroke="url(#curveGradient)"
                        strokeWidth="0"
                        d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
                    />
                </svg>
            </div>
        </>
    );
};

export default CurveReveal;
