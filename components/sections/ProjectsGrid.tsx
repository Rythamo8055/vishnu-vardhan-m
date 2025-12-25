'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';
import styles from './ProjectsGrid.module.css';

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
        duration: '3 months'
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
        duration: '2 months'
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
        duration: '4 months'
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
        duration: '6 months'
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
        duration: '2 months'
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
        duration: '5 months'
    },
];

const NUM_POINTS = 10;
const NUM_PATHS = 2;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

const ProjectsGrid = () => {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const pointsDelayRef = useRef<number[]>([]);

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

        pointsDelayRef.current = [];
        for (let i = 0; i < NUM_POINTS; i++) {
            pointsDelayRef.current[i] = Math.random() * DELAY_POINTS_MAX;
        }
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

    const openProject = useCallback((index: number) => {
        if (isAnimating) return;

        // Reset points for safety
        for (let i = 0; i < NUM_PATHS; i++) {
            if (allPointsRef.current[i]) {
                for (let j = 0; j < NUM_POINTS; j++) {
                    allPointsRef.current[i][j] = 100;
                }
            }
        }

        setIsAnimating(true);
        setSelectedProject(index);
        setShowOverlay(true);
        document.body.style.overflow = 'hidden';

        // Need a slight delay to ensure the portal is rendered and refs are attached
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
                    const delay = pointsDelayRef.current[j];
                    tl.to(points, {
                        [j]: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                    }, delay + pathDelay);
                }
            }
        });

    }, [isAnimating, renderWaves]);

    const closeProject = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setShowContent(false);

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            onComplete: () => {
                setShowOverlay(false);
                setSelectedProject(null);
                setIsAnimating(false);
                document.body.style.overflow = '';
            },
        });

        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = pointsDelayRef.current[j];
                tl.to(points, {
                    [j]: 100,
                    duration: 0.5,
                    ease: 'power2.inOut',
                }, delay + pathDelay);
            }
        }
    }, [isAnimating, renderWaves]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && selectedProject !== null && !isAnimating) {
                closeProject();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedProject, isAnimating, closeProject]);

    const currentProject = selectedProject !== null ? projectImages[selectedProject] : null;

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Projects</h2>
            <p className={styles.subtitle}>Click any project to view details</p>

            <div className={styles.bentoGrid}>
                {projectImages.map((project, index) => (
                    <div
                        key={index}
                        className={styles.gridItem}
                        onClick={() => openProject(index)}
                    >
                        <img src={project.src} alt={project.title} draggable={false} />
                        <div className={styles.overlay}>
                            <span className={styles.year}>{project.year}</span>
                            <span className={styles.itemTitle}>{project.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showOverlay && mounted && createPortal(
                <div className={styles.transitionOverlay}>
                    <svg className={styles.waveSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="projectWaveGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ff8709" />
                                <stop offset="100%" stopColor="#f7bdf8" />
                            </linearGradient>
                            <linearGradient id="projectWaveGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffd9b0" />
                                <stop offset="100%" stopColor="#ff8709" />
                            </linearGradient>
                        </defs>
                        <path ref={(el) => { pathRefs.current[0] = el; }} fill="url(#projectWaveGradient2)" />
                        <path ref={(el) => { pathRefs.current[1] = el; }} fill="url(#projectWaveGradient1)" />
                    </svg>

                    {showContent && currentProject && (
                        <div className={styles.projectContent}>
                            <button className={styles.closeBtn} onClick={closeProject}>
                                <span>Close</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
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
                                        <button className={styles.secondaryBtn} onClick={closeProject}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};

export default ProjectsGrid;
