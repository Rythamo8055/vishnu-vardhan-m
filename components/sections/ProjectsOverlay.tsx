'use client';
// Rebuild trigger

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import gsap from 'gsap';
import styles from './ProjectsOverlay.module.css';

gsap.registerPlugin(ScrollTrigger, Draggable);

// --- CONSTANTS ---
const NUM_POINTS = 5;
const NUM_PATHS = 2; // Black and White
const DELAY_PER_PATH = 0.08;

// Stabilize random delays for wave feel
const STABLE_DELAYS = [0.0, 0.12, 0.05, 0.18, 0.02];

// --- MOCK DATA FOR PROJECTS ---
const projectImages = [
    {
        src: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop', // Minimal Arch
        title: 'LUMINA',
        year: '2024',
        client: 'Lumina Arch',
        role: 'Creative Dev',
        duration: '4 Weeks',
        description: 'A minimal architecture portfolio focusing on negative space and light. The site features smooth page transitions and WebGL distortions.',
        tags: ['WebGL', 'Next.js', 'GSAP'],
        layout: 'up',
        shape: 'rect'
    },
    {
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop', // Abstract Dark
        title: 'NOCTURNE',
        year: '2023',
        client: 'Nocturne Label',
        role: 'Full Stack',
        duration: '2 Months',
        description: 'An immersive dark-mode e-commerce experience for a luxury fashion label. Features real-time 3D product rendering.',
        tags: ['Three.js', 'Shopify', 'React'],
        layout: 'down',
        shape: 'pill'
    },
    {
        src: 'https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=2000&auto=format&fit=crop', // Nature/Green
        title: 'VERIDIAN',
        year: '2023',
        client: 'EcoSpace',
        role: 'Frontend',
        duration: '3 Weeks',
        description: 'A sustainability report for a green energy firm, utilizing data visualization and organic SVG animations.',
        tags: ['D3.js', 'SVG', 'Vue'],
        layout: 'middle',
        shape: 'circle'
    },
    {
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop', // Portrait/Model
        title: 'AURA',
        year: '2024',
        client: 'Aura Models',
        role: 'Lead Dev',
        duration: '6 Weeks',
        description: 'A high-performance portfolio for a modeling agency. Infinite scroll galleries and micro-interactions define the experience.',
        tags: ['Svelte', 'Lenis', 'Vercel'],
        layout: 'up',
        shape: 'rect'
    },
    {
        src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop', // Forest/Mystic
        title: 'SYLVAN',
        year: '2022',
        client: 'Sylvan Lodge',
        role: 'Creative Dev',
        duration: '1 Month',
        description: 'Atmospheric booking site for a forest retreat. heavy use of parallax and sound design.',
        tags: ['React', 'Howler.js', 'Framer'],
        layout: 'down',
        shape: 'pill'
    },
];

interface ProjectsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProjectsOverlay = ({ isOpen, onClose }: ProjectsOverlayProps) => {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [showProjectDetail, setShowProjectDetail] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isProjectAnimating, setIsProjectAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [showContent, setShowContent] = useState(false); // Restore missing state

    useEffect(() => {
        setMounted(true);
    }, []);

    const stripRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const projectDetailRef = useRef<HTMLDivElement>(null);

    // Refs for animation
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);

    // Refs for Project Detail Wave
    const projectPathRefs = useRef<(SVGPathElement | null)[]>([]);
    const projectPointsRef = useRef<number[][]>([]);

    // Initialize points if empty
    if (allPointsRef.current.length === 0) {
        for (let i = 0; i < NUM_PATHS; i++) {
            allPointsRef.current[i] = new Array(NUM_POINTS).fill(100);
        }
    }

    if (projectPointsRef.current.length === 0) {
        for (let i = 0; i < NUM_PATHS; i++) {
            projectPointsRef.current[i] = new Array(NUM_POINTS).fill(100);
        }
    }

    // ... (keep useEffects)

    // Horizontal Scroll / Drag Logic
    useEffect(() => {
        if (!isOpen || !showContent || !stripRef.current || !wrapperRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.' + styles.horizontalWrapper);

            // GSAP MatchMedia for Responsive Logic
            const mm = gsap.matchMedia();

            mm.add({
                // Desktop: Horizontal Scroll via ScrollTrigger
                isDesktop: "(min-width: 768px)",
                // Mobile: Draggable Carousel
                isMobile: "(max-width: 767px)"
            }, (context) => {
                const { isDesktop, isMobile } = context.conditions as any;
                const pinWrap = stripRef.current;

                if (!pinWrap) return;

                if (isDesktop) {
                    // DESKTOP LOGIC
                    const pinWrapWidth = pinWrap.scrollWidth;
                    const horizontalScrollLength = pinWrapWidth - window.innerWidth;

                    gsap.to(pinWrap, {
                        x: -horizontalScrollLength,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sections[0] as Element,
                            scroller: contentRef.current,
                            pin: true,
                            scrub: 1,
                            start: "center center",
                            end: () => "+=" + pinWrapWidth,
                            invalidateOnRefresh: true,
                        }
                    });
                } else if (isMobile) {
                    // MOBILE LOGIC: Draggable
                    Draggable.create(pinWrap, {
                        type: "x",
                        bounds: wrapperRef.current,
                        inertia: true,
                        edgeResistance: 0.65,
                        throwProps: true, // Requires InertiaPlugin, but basic Draggable works without
                        dragClickables: true,
                    });
                }
            });

        }, contentRef);

        return () => ctx.revert();
    }, [isOpen, showContent]);


    // Magnetic Effect for Project Cards
    const handleMagnetMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(target, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.5,
            ease: 'power2.out'
        });
    }, []);

    const handleMagnetLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        gsap.to(e.currentTarget, {
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'elastic.out(1, 0.3)'
        });
    }, []);


    const renderWaves = useCallback(() => {
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
    }, []);

    const renderProjectWaves = useCallback(() => {
        for (let i = 0; i < NUM_PATHS; i++) {
            const path = projectPathRefs.current[i];
            const points = projectPointsRef.current[i];
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

    // Open overlay animation
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

        requestAnimationFrame(() => {
            const tl = gsap.timeline({
                onUpdate: renderWaves,
                onComplete: () => {
                    setShowContent(true);
                    setIsAnimating(false);

                    gsap.fromTo(
                        contentRef.current,
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
                    );
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

    const handleClose = useCallback(() => {
        if (isAnimating || isProjectAnimating) return;
        setIsAnimating(true);
        setShowContent(false);
        setSelectedProject(null);
        setShowProjectDetail(false);

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            onComplete: () => {
                setIsAnimating(false);
                document.body.style.overflow = '';
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
    }, [isAnimating, isProjectAnimating, renderWaves, onClose]);

    // Open project with wave animation
    const openProject = useCallback((index: number) => {
        if (isProjectAnimating) return;

        // Reset project wave points
        for (let i = 0; i < NUM_PATHS; i++) {
            if (projectPointsRef.current[i]) {
                for (let j = 0; j < NUM_POINTS; j++) {
                    projectPointsRef.current[i][j] = 100;
                }
            }
        }

        setIsProjectAnimating(true);
        setSelectedProject(index);
        setShowProjectDetail(true);

        requestAnimationFrame(() => {
            const tl = gsap.timeline({
                onUpdate: renderProjectWaves,
                onComplete: () => {
                    setIsProjectAnimating(false);
                },
            });

            for (let i = 0; i < NUM_PATHS; i++) {
                const points = projectPointsRef.current[i];
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
    }, [isProjectAnimating, renderProjectWaves]);

    // Close project with wave animation - goes back to projects grid
    const closeProject = useCallback(() => {
        if (isProjectAnimating) return;
        setIsProjectAnimating(true);

        const tl = gsap.timeline({
            onUpdate: renderProjectWaves,
            onComplete: () => {
                setShowProjectDetail(false);
                setSelectedProject(null);
                setIsProjectAnimating(false);
            },
        });

        for (let i = 0; i < NUM_PATHS; i++) {
            const points = projectPointsRef.current[i];
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
    }, [isProjectAnimating, renderProjectWaves]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isAnimating && !isProjectAnimating) {
                if (showProjectDetail) {
                    closeProject();
                } else if (isOpen) {
                    handleClose();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnimating, isProjectAnimating, showProjectDetail, handleClose, closeProject]);

    const currentProject = selectedProject !== null ? projectImages[selectedProject] : null;

    if (!isOpen && !isAnimating) return null;
    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay}>
            {/* Main Overlay Wave SVG - Black AND White layered */}
            <svg className={styles.waveSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path ref={(el) => { pathRefs.current[0] = el; }} fill="#ffffff" />
                <path ref={(el) => { pathRefs.current[1] = el; }} fill="#0e100f" />
            </svg>

            {showContent && (
                <div ref={contentRef} className={styles.content}>
                    {/* Minimal X close button - only show when not viewing a project */}
                    {!showProjectDetail && (
                        <button className={styles.closeBtn} onClick={handleClose} aria-label="Close projects">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}

                    <div className={styles.container}>
                        <h2 className={styles.title}>Projects</h2>
                        <p className={styles.subtitle}>Scroll to explore the gallery</p>

                        <div ref={wrapperRef} className={styles.horizontalWrapper}>
                            <div ref={stripRef} className={styles.horizontalStrip}>
                                {projectImages.map((project, index) => (
                                    <div
                                        key={index}
                                        className={`${styles.projectCard} ${styles[`layout-${project.layout}`]} ${styles[`shape-${project.shape}`]}`}
                                        onClick={() => openProject(index)}
                                        onMouseMove={handleMagnetMove}
                                        onMouseLeave={handleMagnetLeave}
                                    >
                                        <div className={styles.cardInner}>
                                            <img src={project.src} alt={project.title} draggable={false} />
                                            <div className={styles.cardOverlay}>
                                                <span className={styles.year}>{project.year}</span>
                                                <span className={styles.itemTitle}>{project.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Project Detail with Wave Animation */}
                    {showProjectDetail && (
                        <div className={styles.projectDetailOverlay}>
                            {/* Project Detail Wave SVG - Black AND White layered */}
                            <svg className={styles.projectWaveSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path ref={(el) => { projectPathRefs.current[0] = el; }} fill="#0e100f" />
                                <path ref={(el) => { projectPathRefs.current[1] = el; }} fill="#ffffff" />
                            </svg>

                            {currentProject && !isProjectAnimating && (
                                <div ref={projectDetailRef} className={styles.projectDetail}>
                                    {/* Project Back Button - Arrow Left */}
                                    <button className={styles.projectBackBtn} onClick={closeProject} aria-label="Back to projects">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M19 12H5M12 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    <div className={styles.projectGrid}>
                                        <div className={styles.projectImageSection}>
                                            <div className={styles.projectImageWrap}>
                                                <img src={currentProject.src} alt={currentProject.title} />
                                            </div>
                                        </div>

                                        <div className={styles.projectInfoSection}>
                                            <div className={styles.projectHeader}>
                                                <span className={styles.projectNumber}>0{(selectedProject ?? 0) + 1}</span>
                                                <span className={styles.projectYear}>{currentProject.year}</span>
                                            </div>

                                            <h1 className={styles.projectTitle}>{currentProject.title}</h1>
                                            <p className={styles.projectDescription}>{currentProject.description}</p>

                                            <div className={styles.projectDetails}>
                                                <div className={styles.detailBlock}>
                                                    <span className={styles.detailLabel}>Client</span>
                                                    <span className={styles.detailValue}>{currentProject.client}</span>
                                                </div>
                                                <div className={styles.detailBlock}>
                                                    <span className={styles.detailLabel}>Role</span>
                                                    <span className={styles.detailValue}>{currentProject.role}</span>
                                                </div>
                                                <div className={styles.detailBlock}>
                                                    <span className={styles.detailLabel}>Duration</span>
                                                    <span className={styles.detailValue}>{currentProject.duration}</span>
                                                </div>
                                            </div>

                                            <div className={styles.tagsSection}>
                                                {currentProject.tags.map((tag, i) => (
                                                    <span key={i} className={styles.tag}>{tag}</span>
                                                ))}
                                            </div>

                                            <div className={styles.projectActions}>
                                                <button className={styles.primaryBtn}>View Case Study</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>,
        document.body
    );
};

export default ProjectsOverlay;
