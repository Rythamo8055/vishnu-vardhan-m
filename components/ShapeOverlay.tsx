'use client';

import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './ShapeOverlay.module.css';

const NUM_POINTS = 10;
const NUM_PATHS = 2;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

export interface ShapeOverlayHandle {
    playTransition: () => Promise<void>;
}

const ShapeOverlay = forwardRef<ShapeOverlayHandle>((_, ref) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const pointsDelayRef = useRef<number[]>([]);

    useEffect(() => {
        // Initialize points arrays
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(100); // Start hidden at bottom
            }
            allPointsRef.current.push(points);
        }

        // Generate random delays
        pointsDelayRef.current = [];
        for (let i = 0; i < NUM_POINTS; i++) {
            pointsDelayRef.current[i] = Math.random() * DELAY_POINTS_MAX;
        }

        // Initial render
        render();
    }, []);

    const render = () => {
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
    };

    const playTransition = (): Promise<void> => {
        return new Promise((resolve) => {
            const tl = gsap.timeline({
                onUpdate: render,
                onComplete: resolve,
            });

            // Phase 1: Waves come up (cover screen) - points go from 100 to 0
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

            // Phase 2: Waves go back down (reveal) - points go from 0 to 100
            for (let i = 0; i < NUM_PATHS; i++) {
                const points = allPointsRef.current[i];
                const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1);

                for (let j = 0; j < NUM_POINTS; j++) {
                    const delay = pointsDelayRef.current[j];
                    tl.to(points, {
                        [j]: 100,
                        duration: 0.5,
                        ease: 'power2.inOut',
                    }, 0.9 + delay + pathDelay);
                }
            }
        });
    };

    useImperativeHandle(ref, () => ({
        playTransition,
    }));

    return (
        <svg
            ref={svgRef}
            className={styles.shapeOverlays}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff8709" />
                    <stop offset="100%" stopColor="#f7bdf8" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffd9b0" />
                    <stop offset="100%" stopColor="#ff8709" />
                </linearGradient>
            </defs>
            <path
                ref={(el) => { pathRefs.current[0] = el; }}
                className={styles.path}
                fill="url(#gradient2)"
            />
            <path
                ref={(el) => { pathRefs.current[1] = el; }}
                className={styles.path}
                fill="url(#gradient1)"
            />
        </svg>
    );
});

ShapeOverlay.displayName = 'ShapeOverlay';

export default ShapeOverlay;
