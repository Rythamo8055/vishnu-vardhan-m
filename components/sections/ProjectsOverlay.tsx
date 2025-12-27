'use client';

import { useRef, useEffect, useState, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './ProjectsOverlay.module.css';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// --- ANIMATION CONSTANTS ---
const NUM_PATHS = 2;
const NUM_POINTS = 10;
const STABLE_DELAYS = [0.02, 0.05, 0.03, 0.06, 0.04, 0.07, 0.03, 0.05, 0.04, 0.02];
const DELAY_PER_PATH = 0.1;

// --- PROJECT DATA ---
const PROJECTS = [
    {
        id: 1,
        title: 'LUMINA',
        category: 'Architecture',
        year: '2024',
        description: 'A minimal architecture portfolio focusing on negative space and light. The site features smooth page transitions and WebGL distortions.',
        tags: ['WebGL', 'Next.js', 'GSAP'],
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'NOCTURNE',
        category: 'E-Commerce',
        year: '2023',
        description: 'An immersive dark-mode e-commerce experience for a luxury fashion label. Features real-time 3D product rendering.',
        tags: ['Three.js', 'Shopify', 'React'],
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'VERIDIAN',
        category: 'Sustainability',
        year: '2023',
        description: 'A sustainability report for a green energy firm, utilizing data visualization and organic SVG animations.',
        tags: ['D3.js', 'SVG', 'Vue'],
        image: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'AURA',
        category: 'Fashion',
        year: '2024',
        description: 'A high-performance portfolio for a modeling agency. Infinite scroll galleries and micro-interactions define the experience.',
        tags: ['Svelte', 'Lenis', 'Vercel'],
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 5,
        title: 'SYLVAN',
        category: 'Hospitality',
        year: '2022',
        description: 'Atmospheric booking site for a forest retreat. Heavy use of parallax scrolling and ambient sound design.',
        tags: ['React', 'Howler.js', 'Framer'],
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 6,
        title: 'KRONOS',
        category: 'Fintech',
        year: '2024',
        description: 'A futuristic dashboard for a high-frequency trading platform. Real-time WebSocket data integration.',
        tags: ['WebSocket', 'React Three Fiber', 'Redis'],
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 7,
        title: 'ECHO',
        category: 'Music',
        year: '2023',
        description: 'Promotional site for high-end audio equipment. Visualizing sound waves through interactive canvas elements.',
        tags: ['Web Audio API', 'Canvas', 'Typescript'],
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2000&auto=format&fit=crop'
    },
    {
        id: 8,
        title: 'NEXUS',
        category: 'AI Tech',
        year: '2025',
        description: 'Landing page for a generative AI startup. Features a conversation-driven UI and fluid shader backgrounds.',
        tags: ['OpenAI', 'GLSL', 'Next.js'],
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop'
    }
];

interface ProjectsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProjectsOverlay = ({ isOpen, onClose }: ProjectsOverlayProps) => {
    const [mounted, setMounted] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Refs
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const wavePathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);

    // Initialize on mount
    useEffect(() => {
        setMounted(true);
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(100);
            }
            allPointsRef.current.push(points);
        }
    }, []);

    // Render wave paths
    const renderWaves = useCallback(() => {
        for (let i = 0; i < NUM_PATHS; i++) {
            const path = wavePathRefs.current[i];
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
    }, []);

    // --- OPEN ANIMATION (Wave Transition) ---
    useEffect(() => {
        if (!isOpen || !mounted) return;

        // Reset points
        for (let i = 0; i < NUM_PATHS; i++) {
            if (allPointsRef.current[i]) {
                for (let j = 0; j < NUM_POINTS; j++) {
                    allPointsRef.current[i][j] = 100;
                }
            }
        }

        setIsAnimating(true);
        document.body.style.overflow = 'hidden';

        if (overlayRef.current) {
            gsap.set(overlayRef.current, { visibility: 'visible', opacity: 1 });
        }

        requestAnimationFrame(() => {
            const tl = gsap.timeline({
                onUpdate: renderWaves,
                onComplete: () => {
                    setShowContent(true);
                    setIsAnimating(false);
                },
            });

            for (let i = 0; i < NUM_PATHS; i++) {
                const points = allPointsRef.current[i];
                const pathDelay = DELAY_PER_PATH * i;

                for (let j = 0; j < NUM_POINTS; j++) {
                    const delay = STABLE_DELAYS[j];
                    tl.to(points, {
                        [j]: 0,
                        duration: 0.8,
                        ease: 'power3.inOut',
                    }, delay + pathDelay);
                }
            }
        });
    }, [isOpen, mounted, renderWaves]);

    // --- SVG STROKE ANIMATION (Draw on Scroll) ---
    useLayoutEffect(() => {
        if (!showContent || !pathRef.current || !contentWrapperRef.current) return;

        const path = pathRef.current;
        const wrapper = contentWrapperRef.current;

        // Calculate total path length
        const pathLength = path.getTotalLength();

        // CSS Prep: Set stroke-dasharray and stroke-dashoffset to hide path initially
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        // Entrance animation for content
        gsap.fromTo(wrapper,
            { opacity: 0 },
            { opacity: 1, duration: 0.5 }
        );

        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            // The Animation: Animate stroke-dashoffset to 0 (draw the path)
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: `.${styles.spotlightWrapper}`,
                    scroller: wrapper,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true, // Perfect lock to scroll position
                    invalidateOnRefresh: true,
                }
            });

            // Project row animations
            const rows = gsap.utils.toArray(`.${styles.projectRow}`);
            rows.forEach((row: any) => {
                gsap.from(row, {
                    y: 80,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        scroller: wrapper,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                });
            });

            ScrollTrigger.refresh();
        }, 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [showContent]);

    // --- CLOSE ANIMATION (Wave Reverse) ---
    const handleClose = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            onComplete: () => {
                setShowContent(false);
                setIsAnimating(false);
                document.body.style.overflow = '';

                if (overlayRef.current) {
                    gsap.set(overlayRef.current, { visibility: 'hidden', opacity: 0 });
                }

                onClose();
            },
        });

        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = STABLE_DELAYS[j];
                tl.to(points, {
                    [j]: 100,
                    duration: 0.8,
                    ease: 'power3.inOut',
                }, delay + pathDelay);
            }
        }
    }, [isAnimating, onClose, renderWaves]);

    // Escape key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isAnimating && isOpen) handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnimating, handleClose]);

    if (!isOpen && !isAnimating) return null;
    if (!mounted) return null;

    const stopPropagation = (e: any) => e.stopPropagation();

    return createPortal(
        <div ref={overlayRef} className={styles.overlay} onWheel={stopPropagation} onTouchMove={stopPropagation}>

            {/* WAVE SVG TRANSITION LAYERS (White & Black) */}
            <svg className={styles.waveSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path ref={(el) => { wavePathRefs.current[0] = el; }} fill="#ffffff" />
                <path ref={(el) => { wavePathRefs.current[1] = el; }} fill="#0e100f" />
            </svg>

            {showContent && (
                <div ref={contentWrapperRef} className={styles.contentWrapper}>
                    {/* Close Button */}
                    <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div ref={containerRef} className={styles.container}>
                        {/* Header */}
                        <header className={styles.header}>
                            <h2 className={styles.title}>Project Archive</h2>
                            <p className={styles.subtitle}>Selected works 2022 — Present</p>
                        </header>

                        {/* Spotlight Section with SVG Curve */}
                        <div className={styles.spotlightWrapper}>
                            {/* THE SVG PATH - Orange S-Curve that draws on scroll */}
                            <svg className={styles.svgContainer} viewBox="0 0 1000 4000" preserveAspectRatio="none">
                                <path
                                    ref={pathRef}
                                    className={styles.linePath}
                                    d="M 500 0
                                       Q 950 400, 500 800
                                       Q 50 1200, 500 1600
                                       Q 950 2000, 500 2400
                                       Q 50 2800, 500 3200
                                       Q 950 3600, 500 4000"
                                />
                            </svg>

                            {/* Project Rows */}
                            {PROJECTS.map((project, i) => (
                                <div key={project.id} className={`${styles.projectRow} ${i % 2 !== 0 ? styles.reverse : ''}`}>
                                    <div className={styles.textCol}>
                                        <div className={styles.meta}>
                                            <span>{project.year}</span>
                                            <span>—</span>
                                            <span>{project.category}</span>
                                        </div>
                                        <h3 className={styles.projectTitle}>{project.title}</h3>
                                        <p className={styles.projectDesc}>{project.description}</p>
                                        <div className={styles.tags}>
                                            {project.tags.map(tag => (
                                                <span key={tag} className={styles.tag}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className={styles.imageCol}>
                                        <div className={styles.imageContainer}>
                                            <img src={project.image} alt={project.title} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer */}
                        <footer className={styles.footer}>
                            <h2>Let's Build Together</h2>
                        </footer>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default ProjectsOverlay;
