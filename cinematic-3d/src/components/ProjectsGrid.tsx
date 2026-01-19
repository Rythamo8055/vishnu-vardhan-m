'use client';

import Link from 'next/link';
import styles from './ProjectsGrid.module.css';

const PROJECTS = [
    {
        id: 1,
        title: 'AGENTIC UI',
        category: 'AI / MOBILE',
        description: 'AI-powered learning assistant with real-time voice and generative UI.',
        tags: ['Flutter', 'Firebase AI', 'GenUI'],
        link: 'https://github.com/Rythamo8055/agentic_ui'
    },
    {
        id: 2,
        title: 'RYTHAMO CHARITY',
        category: 'SOCIAL IMPACT',
        description: 'Connecting donors with orphanages via geolocation and real-time tracking.',
        tags: ['Flutter', 'Geolocation', 'Firestore'],
        link: 'https://github.com/Rythamo8055/rythamo_charity'
    },
    {
        id: 3,
        title: 'RYTHAMO DAY',
        category: 'WELLNESS',
        description: 'Personal wellness journal with mood tracking and AI insights.',
        tags: ['Flutter', 'SQLite', 'UX Design'],
        link: 'https://github.com/Rythamo8055/rythamo-day'
    },
    {
        id: 4,
        title: 'KAHOOT CLONE',
        category: 'EDTECH / GAMING',
        description: 'Real-time multiplayer quiz game platform.',
        tags: ['Next.js', 'TypeScript', 'Tailwind'],
        link: 'https://github.com/Rythamo8055/kahoot-clone'
    }
];

export default function ProjectsGrid() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.label}>// SELECTED WORKS</h2>
                    <h3 className={styles.heading}>Featured Projects</h3>
                </div>

                <div className={styles.grid}>
                    {PROJECTS.map((project) => (
                        <Link
                            key={project.id}
                            href={project.link}
                            target="_blank"
                            className={styles.card}
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.category}>{project.category}</span>
                                <span className={styles.arrow}>↗</span>
                            </div>
                            <h4 className={styles.title}>{project.title}</h4>
                            <p className={styles.description}>
                                {project.description}
                            </p>
                            <div className={styles.tags}>
                                {project.tags.map(tag => (
                                    <span key={tag} className={styles.tag}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
