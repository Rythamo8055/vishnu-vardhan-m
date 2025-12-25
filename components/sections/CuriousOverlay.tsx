'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import CuriousContent from '@/components/sections/CuriousContent';
import styles from './CuriousOverlay.module.css';

const NUM_PATHS = 2;
const NUM_POINTS = 10;
const STABLE_DELAYS = [0.02, 0.05, 0.03, 0.06, 0.04, 0.07, 0.03, 0.05, 0.04, 0.02];
const DELAY_PER_PATH = 0.1;

interface CuriousOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const CuriousOverlay = ({ isOpen, onClose }: CuriousOverlayProps) => {
    const [showContent, setShowContent] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const windowRef = useRef<HTMLDivElement>(null);
    const sharpContentRef = useRef<HTMLDivElement>(null);

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

    // Open Animation
    useEffect(() => {
        if (!isOpen || !mounted) return;

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
        if (isAnimating) return;
        setIsAnimating(true);
        setShowContent(false);

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
    }, [isAnimating, renderWaves, onClose]);

    // Flashlight Interaction (No custom cursor)
    useEffect(() => {
        if (!showContent) return;

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
        return () => window.removeEventListener('mousemove', moveWindow);
    }, [showContent]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isAnimating && isOpen) handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isAnimating, handleClose]);

    if (!isOpen && !isAnimating) return null;
    if (!mounted) return null;

    return createPortal(
        <div className={styles.overlay}>
            {/* Wave SVG - z-index: 1 */}
            <svg className={styles.waveSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <path ref={(el) => { pathRefs.current[0] = el; }} fill="#ffffff" />
                <path ref={(el) => { pathRefs.current[1] = el; }} fill="#0e100f" />
            </svg>

            {/* Content - z-index: 2 (above waves) */}
            {showContent && (
                <div ref={contentRef} className={styles.content}>
                    {/* Blurred Background */}
                    <div className={styles.blurLayer}>
                        <div className={styles.blurContent}>
                            <CuriousContent />
                        </div>
                        <div className={styles.fogOverlay} />
                    </div>

                    {/* Close Button */}
                    <button onClick={handleClose} className={styles.closeBtn}>
                        ← Return
                    </button>

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

                    {/* Hint */}
                    <div className={styles.hintText}>Reveal the Truth</div>
                </div>
            )}
        </div>,
        document.body
    );
};

export default CuriousOverlay;
