'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Flair.module.css';

const Flair = () => {
    const flairRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !flairRef.current) return;

        gsap.set(flairRef.current, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(flairRef.current, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(flairRef.current, 'y', { duration: 0.6, ease: 'power3' });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mounted]);

    if (!mounted) return null;

    return <div ref={flairRef} className={styles.flair} />;
};

export default Flair;
