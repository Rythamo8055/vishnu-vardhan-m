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

// --- REAL PROJECT DATA ---
const PROJECTS = [
    {
        id: 1,
        title: 'AGENTIC UI',
        category: 'AI / Mobile',
        year: '2025',
        description: 'An AI-powered learning assistant with real-time voice capabilities. Built with Flutter, Firebase AI, and GenUI for dynamic AI-generated interactive UI components.',
        longDescription: `A comprehensive Flutter mobile application that revolutionizes personalized learning through AI. The app features real-time voice conversations using WebSocket connections to Gemini's Live API, enabling users to learn while commuting or exercising.

Key innovations include dynamic AI-generated UI where the AI returns interactive Flutter widgets like quizzes, flashcards, and progress trackers. The system uses Gemini 2.5 Flash with a custom catalog of 20+ interactive widget types.`,
        features: [
            'Real-time voice conversations with AI',
            'Dynamic AI-generated interactive UI',
            '20+ custom widget types for learning',
            'Push-to-talk with visual feedback',
            'Live audio waveform visualization',
            'Premium Forui design system'
        ],
        tags: ['Flutter', 'Firebase AI', 'GenUI', 'Dart', 'Gemini'],
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop',
        github: 'https://github.com/Rythamo8055/agentic_ui',
        color: '#7C3AED'
    },
    {
        id: 2,
        title: 'RYTHAMO CHARITY',
        category: 'Social Impact',
        year: '2024',
        description: 'A Flutter mobile app revolutionizing how donors connect with orphanages. Features real-time updates, geolocation services, and transparent charitable giving.',
        longDescription: `A comprehensive Flutter mobile application that bridges the gap between donors and orphanages, making charitable giving more transparent, accessible, and impactful.

The app implements a dual authentication flow for donors and orphanages, with role-based navigation. Features include geospatial queries using the Haversine formula for accurate distance calculations, real-time Firestore updates, and optimized image handling with Firebase Storage.`,
        features: [
            'Dual role system (Donors & Orphanages)',
            'Real-time donation tracking',
            'Geolocation-based discovery',
            'Google Sign-In authentication',
            'Dark mode support',
            'Lottie animations'
        ],
        tags: ['Flutter', 'Firebase', 'Provider', 'Geolocator', 'Firestore'],
        image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2000&auto=format&fit=crop',
        github: 'https://github.com/Rythamo8055/rythamo-charity',
        color: '#10B981'
    },
    {
        id: 3,
        title: 'RYTHAMO DAY',
        category: 'Wellness',
        year: '2024',
        description: 'A personal wellness journal that understands you. Features mood tracking, journaling, and personalized insights to support mental health and daily reflection.',
        longDescription: `A thoughtfully designed personal wellness journal app built with Flutter. The app focuses on mental health support through intuitive mood tracking, guided journaling prompts, and personalized insights based on user patterns.

The design philosophy centers on creating a calm, distraction-free experience that encourages daily reflection and self-awareness. Features beautiful themes and smooth animations to make the journaling experience feel premium and personal.`,
        features: [
            'Intuitive mood tracking',
            'Guided journaling prompts',
            'Personalized wellness insights',
            'Beautiful custom themes',
            'Daily reflection reminders',
            'Progress visualization'
        ],
        tags: ['Flutter', 'Dart', 'SQLite', 'Provider', 'UX Design'],
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop',
        github: 'https://github.com/Rythamo8055/rythamo-day',
        color: '#F59E0B'
    },
    {
        id: 4,
        title: 'KAHOOT CLONE',
        category: 'EdTech / Gaming',
        year: '2024',
        description: 'A real-time multiplayer quiz game platform built with Next.js and TypeScript. Create, host, and play interactive quizzes with friends or students.',
        longDescription: `A full-featured Kahoot-style quiz game platform built with Next.js and TypeScript. The application enables users to create custom quizzes, host live game sessions, and compete with participants in real-time.

Built using Firebase Studio, the platform leverages modern web technologies for a responsive and engaging experience. The architecture supports real-time synchronization for multiplayer gameplay with minimal latency.`,
        features: [
            'Real-time multiplayer gameplay',
            'Custom quiz creation',
            'Live game hosting',
            'Score leaderboards',
            'Responsive design',
            'Firebase integration'
        ],
        tags: ['Next.js', 'TypeScript', 'Firebase', 'React', 'Tailwind'],
        image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2000&auto=format&fit=crop',
        github: 'https://github.com/Rythamo8055/kahoot-clone',
        color: '#EF4444'
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
    const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

    // Refs
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const wavePathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const detailRef = useRef<HTMLDivElement>(null);

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
        if (!showContent || !pathRef.current || !contentWrapperRef.current || selectedProject) return;

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
                    scrub: true,
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
    }, [showContent, selectedProject]);

    // --- PROJECT DETAIL VIEW ---
    const openProjectDetail = (project: typeof PROJECTS[0]) => {
        setSelectedProject(project);

        // Animate in detail view
        requestAnimationFrame(() => {
            if (detailRef.current) {
                gsap.fromTo(detailRef.current,
                    { opacity: 0, y: 50 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
                );
            }
        });
    };

    const closeProjectDetail = () => {
        if (detailRef.current) {
            gsap.to(detailRef.current, {
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: 'power3.in',
                onComplete: () => setSelectedProject(null)
            });
        }
    };

    // --- CLOSE ANIMATION (Wave Reverse) ---
    const handleClose = useCallback(() => {
        if (isAnimating) return;

        if (selectedProject) {
            closeProjectDetail();
            return;
        }

        setIsAnimating(true);
        setShowContent(false); // Hide content immediately so waves are visible

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            onComplete: () => {
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
    }, [isAnimating, onClose, renderWaves, selectedProject]);

    // Escape key handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isAnimating && isOpen) {
                if (selectedProject) {
                    closeProjectDetail();
                } else {
                    handleClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnimating, handleClose, selectedProject]);

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

            {showContent && !selectedProject && (
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
                            <p className={styles.subtitle}>Selected works 2024 — Present</p>
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
                                        <div
                                            className={styles.imageContainer}
                                            onClick={() => openProjectDetail(project)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src={project.image} alt={project.title} />
                                            <div className={styles.imageOverlay}>
                                                <span>View Details</span>
                                            </div>
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

            {/* PROJECT DETAIL VIEW */}
            {selectedProject && (
                <div ref={detailRef} className={styles.detailView}>
                    {/* Back Button */}
                    <button className={styles.backBtn} onClick={closeProjectDetail} aria-label="Back">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        <span>Back to Projects</span>
                    </button>

                    {/* Close Button */}
                    <button className={styles.closeBtn} onClick={handleClose} aria-label="Close">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>

                    <div className={styles.detailContent}>
                        {/* Hero Image */}
                        <div className={styles.detailHero}>
                            <img src={selectedProject.image} alt={selectedProject.title} />
                            <div className={styles.detailHeroOverlay} style={{ background: `linear-gradient(135deg, ${selectedProject.color}22, transparent)` }} />
                        </div>

                        {/* Project Info */}
                        <div className={styles.detailInfo}>
                            <div className={styles.detailMeta}>
                                <span style={{ color: selectedProject.color }}>{selectedProject.year}</span>
                                <span>—</span>
                                <span>{selectedProject.category}</span>
                            </div>

                            <h1 className={styles.detailTitle}>{selectedProject.title}</h1>

                            <p className={styles.detailDescription}>{selectedProject.longDescription}</p>

                            {/* Features */}
                            <div className={styles.detailFeatures}>
                                <h3>Key Features</h3>
                                <ul>
                                    {selectedProject.features.map((feature, i) => (
                                        <li key={i}>
                                            <span className={styles.featureIcon} style={{ color: selectedProject.color }}>✦</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Tags */}
                            <div className={styles.detailTags}>
                                {selectedProject.tags.map(tag => (
                                    <span key={tag} className={styles.detailTag} style={{ borderColor: selectedProject.color }}>{tag}</span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className={styles.detailActions}>
                                <a
                                    href={selectedProject.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.githubBtn}
                                    style={{ background: selectedProject.color }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    View on GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default ProjectsOverlay;
