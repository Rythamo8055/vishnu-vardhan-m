'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import CuriousContent from '@/components/sections/CuriousContent';
import styles from './Hero.module.css';

interface HeroProps {
    title?: string;
    hintText?: string;
    linkText?: string;
    linkHref?: string;
}

const Hero = ({
    title = 'Identity',
    hintText = 'Explore the Unseen',
    linkText = 'Return Home',
    linkHref = '/'
}: HeroProps) => {
    const windowRef = useRef<HTMLDivElement>(null);
    const sharpContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial Center
        // Ultra-wide window: 450x140, half = 225x70
        gsap.set(windowRef.current, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
        gsap.set(sharpContentRef.current, { x: -window.innerWidth / 2 + 225, y: -window.innerHeight / 2 + 70 });

        const moveWindow = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Move window
            gsap.to(windowRef.current, { x: clientX, y: clientY, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });

            // Counter-move content (450x140 window)
            gsap.to(sharpContentRef.current, { x: -clientX + 225, y: -clientY + 70, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        };

        window.addEventListener('mousemove', moveWindow);

        // Paper Plane Animation
        // Fly in a loop that 'points' to the button
        const plane = document.querySelector(`.${styles.paperPlane}`);
        if (plane) {
            gsap.to(plane, {
                y: 15,
                x: -10,
                rotation: -10,
                duration: 2,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
        }

        return () => window.removeEventListener('mousemove', moveWindow);
    }, []);

    return (
        <section className={styles.hero}>
            {/* Layer 1: Blurred Background */}
            <div className={styles.blurLayer}>
                <div className={styles.blurContent}>
                    <CuriousContent />
                </div>
                <div className={styles.fogOverlay} />
            </div>

            {/* Scanner Window */}
            <div ref={windowRef} className={styles.scannerWindow}>
                <div className={styles.scannerUI}>
                    <div className={`${styles.corner} ${styles.cornerTL}`} />
                    <div className={`${styles.corner} ${styles.cornerTR}`} />
                    <div className={`${styles.corner} ${styles.cornerBL}`} />
                    <div className={`${styles.corner} ${styles.cornerBR}`} />
                </div>

                <div ref={sharpContentRef} className={styles.sharpContent}>
                    <CuriousContent />
                </div>
            </div>

            {/* Hint Text */}
            <p className={styles.hintText}>{hintText}</p>

            <a href={linkHref} className={styles.revealLink}>
                {title}

                {/* Paper Plane - Flying in specific path */}
                <div className={styles.paperPlaneContainer}>
                    <svg className={styles.paperPlane} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 12l20-9-9 20-2-9-9-2z" />
                    </svg>
                </div>
            </a>
        </section>
    );
};

export default Hero;
