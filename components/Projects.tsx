'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import styles from './Projects.module.css';

const projectImages = [
    {
        src: 'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
        title: 'Pattern Design',
        description: 'Geometric patterns and visual design exploration. This project explores the intersection of mathematics and art through carefully crafted geometric compositions that challenge perception and create visual harmony.',
        tags: ['Design', 'Patterns', 'Visual Art'],
        year: '2024',
        client: 'Studio X',
        role: 'Lead Designer',
        services: ['Brand Identity', 'Pattern Design', 'Art Direction'],
        duration: '3 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-12.jpg',
        title: 'Portrait Series',
        description: 'A collection of portrait photography capturing human emotion and expression in their most authentic form. Each image tells a story of vulnerability and strength.',
        tags: ['Photography', 'Portraits', 'Editorial'],
        year: '2024',
        client: 'Vogue',
        role: 'Photographer',
        services: ['Photography', 'Post-Production', 'Creative Direction'],
        duration: '2 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-8.jpg',
        title: 'Urban Light',
        description: 'Light and shadow in urban environments. Exploring how natural and artificial light shapes our perception of city spaces and the stories they contain.',
        tags: ['Urban', 'Photography', 'Light'],
        year: '2023',
        client: 'City Magazine',
        role: 'Creative Director',
        services: ['Photography', 'Art Direction', 'Editorial'],
        duration: '4 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
        title: 'Abstract Flow',
        description: 'Abstract art and flowing forms that capture the essence of movement and fluidity in static imagery. A meditation on the nature of form and space.',
        tags: ['Abstract', 'Art', 'Flow'],
        year: '2023',
        client: 'Gallery Modern',
        role: 'Artist',
        services: ['Digital Art', 'Installation', 'Exhibition Design'],
        duration: '6 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-4.jpg',
        title: 'Natural Beauty',
        description: 'Beauty in natural settings. A series celebrating the raw, unfiltered aesthetics found in nature and the human connection to the organic world.',
        tags: ['Nature', 'Beauty', 'Photography'],
        year: '2023',
        client: 'Nature Weekly',
        role: 'Photographer',
        services: ['Photography', 'Styling', 'Location Scouting'],
        duration: '2 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-3.jpg',
        title: 'Motion Study',
        description: 'Capturing movement and energy through long exposure and creative techniques that freeze time while suggesting perpetual motion.',
        tags: ['Motion', 'Creative', 'Experimental'],
        year: '2022',
        client: 'Dance Theatre',
        role: 'Visual Artist',
        services: ['Motion Capture', 'Video Production', 'Art Direction'],
        duration: '5 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-pattern-3.jpg',
        title: 'Geometric Art',
        description: 'Geometric shapes and compositions that challenge perception and create visual harmony through mathematical precision and artistic intuition.',
        tags: ['Geometric', 'Art', 'Composition'],
        year: '2022',
        client: 'Tech Corp',
        role: 'Art Director',
        services: ['Visual Identity', 'Digital Design', 'Brand Strategy'],
        duration: '4 months'
    },
    {
        src: 'https://assets.codepen.io/16327/portrait-image-1.jpg',
        title: 'Light & Shadow',
        description: 'Playing with light and shadow. An exploration of contrast and the spaces between illumination and darkness that define our visual experience.',
        tags: ['Light', 'Shadow', 'Contrast'],
        year: '2022',
        client: 'Art Foundation',
        role: 'Photographer',
        services: ['Fine Art Photography', 'Gallery Curation', 'Print Production'],
        duration: '3 months'
    },
];

const NUM_POINTS = 10;
const NUM_PATHS = 2;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

const Projects = () => {
    const [selectedProject, setSelectedProject] = useState<number | null>(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const pointsDelayRef = useRef<number[]>([]);

    useEffect(() => {
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
        setIsAnimating(true);
        setSelectedProject(index);
        setShowOverlay(true);
        document.body.style.overflow = 'hidden';

        for (let i = 0; i < NUM_PATHS; i++) {
            for (let j = 0; j < NUM_POINTS; j++) {
                allPointsRef.current[i][j] = 100;
            }
        }

        for (let i = 0; i < NUM_POINTS; i++) {
            pointsDelayRef.current[i] = Math.random() * DELAY_POINTS_MAX;
        }

        setTimeout(() => {
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
        }, 50);
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
        <section className={styles.projectsSection}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <p className={styles.sectionHint}>Click any project to view details</p>

            <div className={styles.galleryBento}>
                {projectImages.map((project, index) => (
                    <div
                        key={index}
                        className={styles.galleryItem}
                        onClick={() => openProject(index)}
                    >
                        <img src={project.src} alt={project.title} draggable={false} />
                        <div className={styles.itemOverlay}>
                            <span className={styles.itemYear}>{project.year}</span>
                            <span className={styles.itemTitle}>{project.title}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showOverlay && (
                <div className={styles.transitionOverlay}>
                    <svg
                        className={styles.waveSvg}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="projectGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1a1a1a" />
                                <stop offset="100%" stopColor="#0e100f" />
                            </linearGradient>
                            <linearGradient id="projectGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="100%" stopColor="#e0e0e0" />
                            </linearGradient>
                        </defs>
                        <path
                            ref={(el) => { pathRefs.current[0] = el; }}
                            fill="url(#projectGradient2)"
                        />
                        <path
                            ref={(el) => { pathRefs.current[1] = el; }}
                            fill="url(#projectGradient1)"
                        />
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

                                    <div className={styles.servicesSection}>
                                        <span className={styles.detailLabel}>Services</span>
                                        <div className={styles.servicesList}>
                                            {currentProject.services.map((service, i) => (
                                                <span key={i} className={styles.serviceItem}>{service}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.tagsSection}>
                                        {currentProject.tags.map((tag, i) => (
                                            <span key={i} className={styles.tag}>{tag}</span>
                                        ))}
                                    </div>

                                    <div className={styles.projectActions}>
                                        <button className={styles.primaryBtn}>View Full Case Study</button>
                                        <button className={styles.secondaryBtn} onClick={closeProject}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Projects;
