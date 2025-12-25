'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import styles from './ProjectsOverlay.module.css';

gsap.registerPlugin(ScrollTrigger);

const projectImages = [
    {
        src: 'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
        title: 'Pattern Design',
        description: 'Geometric patterns and visual design exploration.',
        tags: ['Design', 'Patterns'],
        year: '2024',
        client: 'Studio X',
        role: 'Lead Designer',
        services: ['Brand Identity', 'Pattern Design'],
        duration: '3 months',
        layout: 'middle',
        shape: 'pill'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-12.jpg',
        title: 'Portrait Series',
        description: 'A collection of portrait photography capturing human emotion.',
        tags: ['Photography', 'Portraits'],
        year: '2024',
        client: 'Vogue',
        role: 'Photographer',
        services: ['Photography', 'Post-Production'],
        duration: '2 months',
        layout: 'up',
        shape: 'circle'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-8.jpg',
        title: 'Urban Light',
        description: 'Light and shadow in urban environments.',
        tags: ['Urban', 'Photography'],
        year: '2023',
        client: 'City Magazine',
        role: 'Creative Director',
        services: ['Photography', 'Art Direction'],
        duration: '4 months',
        layout: 'down',
        shape: 'rect'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
        title: 'Abstract Flow',
        description: 'Abstract art and flowing forms.',
        tags: ['Abstract', 'Art'],
        year: '2023',
        client: 'Gallery Modern',
        role: 'Artist',
        services: ['Digital Art', 'Installation'],
        duration: '6 months',
        layout: 'middle',
        shape: 'rect'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-4.jpg',
        title: 'Natural Beauty',
        description: 'Beauty in natural settings.',
        tags: ['Nature', 'Beauty'],
        year: '2023',
        client: 'Nature Weekly',
        role: 'Photographer',
        services: ['Photography', 'Styling'],
        duration: '2 months',
        layout: 'up',
        shape: 'pill'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-3.jpg',
        title: 'Motion Study',
        description: 'Capturing movement and energy.',
        tags: ['Motion', 'Creative'],
        year: '2022',
        client: 'Dance Theatre',
        role: 'Visual Artist',
        services: ['Motion Capture', 'Video Production'],
        duration: '5 months',
        layout: 'down',
        shape: 'circle'
    },
];

const NUM_PATHS = 2;
const NUM_POINTS = 10;
const STABLE_DELAYS = [0.02, 0.05, 0.03, 0.06, 0.04, 0.07, 0.03, 0.05, 0.04, 0.02];
const DELAY_PER_PATH = 0.1;

interface ProjectsOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProjectsOverlay = ({ isOpen, onClose }: ProjectsOverlayProps) => {
    const [showContent, setShowContent] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [showProjectDetail, setShowProjectDetail] = useState(false);
    const [isProjectAnimating, setIsProjectAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);

    const projectDetailRef = useRef<HTMLDivElement>(null);
    const projectPathRefs = useRef<(SVGPathElement | null)[]>([]);
    const projectPointsRef = useRef<number[][]>([]);

    useEffect(() => {
        setMounted(true);
        // Initialize main overlay points
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(100);
            }
            allPointsRef.current.push(points);
        }

        // Initialize project detail points
        projectPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(100);
            }
            projectPointsRef.current.push(points);
        }
    }, []);

    const stripRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ... (keep existing refs) ...

    // Horizontal Scroll Trigger Logic
    useEffect(() => {
        if (!isOpen || !showContent || !stripRef.current || !wrapperRef.current || !contentRef.current) return;

        const ctx = gsap.context(() => {
            const sections = gsap.utils.toArray('.' + styles.horizontalWrapper);

            sections.forEach((sec: any) => {
                const pinWrap = stripRef.current;
                if (!pinWrap) return;

                const pinWrapWidth = pinWrap.scrollWidth;
                const horizontalScrollLength = pinWrapWidth - window.innerWidth;

                gsap.to(pinWrap, {
                    x: -horizontalScrollLength,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sec,
                        scroller: contentRef.current,
                        pin: true,
                        scrub: 1, // Add some smoothing
                        start: "center center",
                        end: () => "+=" + pinWrapWidth,
                        invalidateOnRefresh: true,
                    }
                });
            });
        }, contentRef); // Scope to content

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
