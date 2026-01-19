'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './About.module.css';

export default function About() {
    const containerRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<HTMLDivElement[]>([]);

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !linesRef.current.includes(el)) {
            linesRef.current.push(el);
        }
    };

    useEffect(() => {
        if (!containerRef.current || linesRef.current.length === 0) return;

        const ctx = gsap.context(() => {
            linesRef.current.forEach((line) => {
                gsap.to(line, {
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 85%',
                        end: 'top 50%',
                        scrub: 1,
                    },
                    color: '#ffffff', // Keep solid white
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className={styles.section} ref={containerRef}>
            <div className={styles.container}>
                {/* Left Column: Keywords */}
                <div className={styles.keywordsColumn}>
                    <div className={styles.cinematicLine} ref={addToRefs}>
                        FIRST
                    </div>
                    <div className={styles.cinematicLine} ref={addToRefs}>
                        PRINCIPLES
                    </div>
                    <div className={styles.cinematicLine} ref={addToRefs}>
                        ARCHITECT
                    </div>
                    <div className={styles.cinematicLine} ref={addToRefs}>
                        INTELLIGENT
                    </div>
                    <div className={styles.cinematicLine} ref={addToRefs}>
                        SYSTEMS
                    </div>
                </div>

                {/* Right Column: Taglines */}
                <div className={styles.taglinesColumn}>
                    <p className={styles.tagline}>
                        <span className={styles.taglineHighlight}>Bridging the gap</span> between human intent and machine execution.
                    </p>
                    <p className={styles.tagline}>
                        I design and build <span className={styles.taglineHighlight}>AI-powered systems</span> that solve real problems.
                    </p>
                    <p className={styles.tagline}>
                        From concept to code, <span className={styles.taglineHighlight}>first principles thinking</span> guides every decision.
                    </p>
                </div>
            </div>
        </section>
    );
}
