'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Hero.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const NUM_POINTS = 10;
const NUM_PATHS = 2;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

interface HeroProps {
    onTransitionComplete?: () => void;
}

const Hero = ({ onTransitionComplete }: HeroProps) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const pointsDelayRef = useRef<number[]>([]);
    const [hasTriggered, setHasTriggered] = useState(false);

    useEffect(() => {
        // Initialize points
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(100);
            }
            allPointsRef.current.push(points);
        }

        pointsDelayRef.current = [];
        for (let i = 0; i < NUM_POINTS; i++) {
            pointsDelayRef.current[i] = Math.random() * DELAY_POINTS_MAX;
        }

        renderWaves();
    }, []);

    const renderWaves = () => {
        for (let i = 0; i < NUM_PATHS; i++) {
            const path = pathRefs.current[i];
            const points = allPointsRef.current[i];
            if (!path || !points) continue;

            let d = `M 0 ${points[0]} C`;

            for (let j = 0; j < NUM_POINTS - 1; j++) {
                const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
                const cp = p - (1 / (NUM_POINTS - 1) * 100) / 2;
                d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
            }

            d += ` V 100 H 0`;
            path.setAttribute('d', d);
        }
    };

    const playTransition = () => {
        if (hasTriggered) return;
        setHasTriggered(true);

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            onComplete: () => {
                if (onTransitionComplete) {
                    onTransitionComplete();
                }
            },
        });

        // Phase 1: Waves cover screen
        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * i;

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = pointsDelayRef.current[j];
                tl.to(points, {
                    [j]: 0,
                    duration: 0.5,
                    ease: 'power2.inOut',
                }, delay + pathDelay);
            }
        }

        // Phase 2: Waves reveal
        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = pointsDelayRef.current[j];
                tl.to(points, {
                    [j]: 100,
                    duration: 0.5,
                    ease: 'power2.inOut',
                }, 0.9 + delay + pathDelay);
            }
        }
    };

    // Scroll trigger
    useEffect(() => {
        if (!sectionRef.current) return;

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'bottom 80%',
            onEnter: () => {
                playTransition();
            },
        });

        return () => trigger.kill();
    }, [hasTriggered]);

    return (
        <section ref={sectionRef} id="hero-section" className={styles.hero}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Portfolio</h1>
                <p className={styles.heroSubtitle}>Creative Developer</p>

                <button className={styles.exploreBtn} onClick={playTransition}>
                    <span>Explore Projects</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Wave overlay */}
            <svg
                ref={svgRef}
                className={styles.waveOverlay}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#0e100f" />
                    </linearGradient>
                    <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#e0e0e0" />
                    </linearGradient>
                </defs>
                <path
                    ref={(el) => { pathRefs.current[0] = el; }}
                    fill="url(#heroGradient2)"
                />
                <path
                    ref={(el) => { pathRefs.current[1] = el; }}
                    fill="url(#heroGradient1)"
                />
            </svg>
        </section>
    );
};

export default Hero;
