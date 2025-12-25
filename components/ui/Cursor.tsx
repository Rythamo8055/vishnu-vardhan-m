'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import styles from './Cursor.module.css';

const Cursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !cursorRef.current) return;

        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

        const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.6, ease: 'power3' });
        const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.6, ease: 'power3' });

        const handleMouseMove = (e: MouseEvent) => {
            xTo(e.clientX);
            yTo(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mounted]);

    if (!mounted) return null;

    // Use portal to render cursor at document body level
    return createPortal(
        <div ref={cursorRef} className={styles.cursor} />,
        document.body
    );
};

export default Cursor;
