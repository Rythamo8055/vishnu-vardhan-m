'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

// Hero is now just the content overlay, as the background is handled globally
// Hero is now just the content overlay, as the background is handled globally
export default function Hero() {
    const skillsContainerRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        if (!skillsContainerRef.current || skillsRef.current.length === 0) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 }); // Loop the skills
            const items = skillsRef.current;
            const container = skillsContainerRef.current;
            const totalItems = items.length;

            // Initial State: All small and dim except the first one (optional, or start all hidden)
            // But for this "Won J You" effect, we effectively want to cycle them.
            // Let's implement a clean "Scroll & Scale" loop.

            // Initial setup
            gsap.set(items, { opacity: 0.3, scale: 0.8, transformOrigin: "left center" });
            gsap.set(items[0], { opacity: 1, scale: 1 });

            items.forEach((item, index) => {
                const nextIndex = (index + 1) % totalItems;
                const nextItem = items[nextIndex];

                // The logic: 
                // 1. Current item scales down and dims
                // 2. Container moves up to center the next item
                // 3. Next item scales up and brightens

                tl.to(item, {
                    opacity: 0.3,
                    scale: 0.8,
                    duration: 0.5,
                    ease: "power2.inOut"
                }, `step${index}`)
                    .to(container, {
                        y: `-${(index + 1) * 25}%`, // Assuming 4 items, moving 25% each time. Adjust if heights differ.
                        // Better approach: Calculate height. But simple % works if items are uniform.
                        // Actually, let's just animate the "y" percent relative to item height.
                        // For robustness, let's just cycle opacity/scale without moving container if layout is tricky,
                        // BUT the user specifically asked for the "container move" effect. 
                        // Let's rely on the layout structure. 
                        // Since specific pixel heights might vary, let's try just swapping active state visually first 
                        // If we want the "Won J You" exact effect, the list moves.
                        // Let's try a simpler robust version first: Highlight loop.
                        // User asked for "Scale & Scale into position".
                    }, `step${index}`)
                    .to(nextItem, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    }, `step${index}-=0.1`); // Overlap slightly

                // Pause for reading
                tl.to({}, { duration: 2 });
            });

            // Reset container for loop (illusion of infinite scroll would need cloned items, 
            // but for a simple list, we might just cycle highlight. 
            // The user's video had a "loop" building a timeline.
            // Let's try the simple "Cycle Highlight" first as it's safer for layout stability.
            // If they want actual physical scrolling of the list, we need `overflow: hidden` and precise heights.

        }, skillsContainerRef);

        return () => ctx.revert();
    }, []);

    const addToRefs = (el: HTMLDivElement | null) => {
        if (el && !skillsRef.current.includes(el)) {
            skillsRef.current.push(el);
        }
    };

    return (
        <div className={styles.heroContainer}>
            <div className={styles.overlay}>

                {/* Top Row */}
                <div className={styles.topRow}>
                    {/* Left: Identity */}
                    <div className={styles.identityBlock}>
                        <div className={styles.introLine}>HELLO, I AM</div>
                        <h1 className={styles.heroTitle}>
                            VISHNU<br />VARDHAN
                        </h1>

                        {/* Skills - Now Animated with Mask */}
                        <div className={styles.skillsMask}>
                            <div className={styles.skillsGrid} ref={skillsContainerRef}>
                                <div className={styles.skillItem} ref={addToRefs}>
                                    <span className={styles.skillIndex}>#01</span> GENERATIVE UI
                                </div>
                                <div className={styles.skillItem} ref={addToRefs}>
                                    <span className={styles.skillIndex}>#02</span> LLM AGENTS
                                </div>
                                <div className={styles.skillItem} ref={addToRefs}>
                                    <span className={styles.skillIndex}>#03</span> FLUTTER TECH
                                </div>
                                <div className={styles.skillItem} ref={addToRefs}>
                                    <span className={styles.skillIndex}>#04</span> PYTHON LOGIC
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Value Prop + Social Icons */}
                    <div className={styles.valueProp}>
                        <h2 className={styles.valuePropTitle}>Architecting Intelligent Systems.</h2>
                        <p className={styles.valuePropText}>
                            Bridging the gap between human intent and machine execution. Expert in Generative UI, intelligent agents, and fullstack engineering.
                        </p>

                        {/* Social Icons moved here (Right side) */}
                        <div className={styles.socialRow}>
                            <Link href="https://linkedin.com/in/vishnu-vardhan8055" className={styles.socialLink} aria-label="LinkedIn">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </Link>
                            <Link href="https://github.com/Rythamo8055" className={styles.socialLink} aria-label="GitHub">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </Link>
                            <Link href="mailto:vishnuvardhanthe8055@gmail.com" className={styles.socialLink} aria-label="Email">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 right-8 text-white animate-bounce pointer-events-none opacity-50 text-sm tracking-widest">
                    SCROLL TO EXPLORE ↓
                </div>
            </div>
        </div>
    );
}
