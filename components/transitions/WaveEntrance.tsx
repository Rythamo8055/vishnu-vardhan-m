'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import styles from '../sections/CuriousOverlay.module.css'; // Reusing styles for now as they are identical for the wave part

const NUM_PATHS = 2;
const NUM_POINTS = 10;
const STABLE_DELAYS = [0.02, 0.05, 0.03, 0.06, 0.04, 0.07, 0.03, 0.05, 0.04, 0.02];
const DELAY_PER_PATH = 0.1;

const WaveEntrance = () => {
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    // Start with fully covered state (points at 100? No, standard overlay has waves at bottom (100) then rise to 0 (top) covers.
    // Reveal means we want to start COVERED (0) and go to UNCOVERED (100) or vice versa.

    // Mount state for hydration fix
    const [mounted, setMounted] = useState(false);

    // In CuriousOverlay: 
    // Open = Points move 100 -> 0 (Cover screen).
    // Close = Points move 0 -> 100 (Uncover screen).

    // We want "Entrance" -> Screen is effectively covered by "Previous Page", we want to "Open" the new page? 
    // Actually, usually a transition is: Old Page -> Wave Covers -> Wave Uncovers -> New Page.
    // Since we are just landing on New Page, we can simulate "Wave Uncovers".
    // So start at 0 (Screen Covered) and animate to 100 (Screen Uncovered).

    useEffect(() => {
        // Initialize points at 0 (Top/Covered)
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(0);
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
            // For "0" to be covered, we need the path to fill from 0 to bottom?
            // In CuriousOverlay: V 100 H 0. Logic: Path Top is the curve, it fills down to 100.
            // If points are 100, curve is at bottom -> screen empty.
            // If points are 0, curve is at top -> screen full.

            d += ` V 100 H 0`;
            path.setAttribute('d', d);
        }
    }, []);

    useEffect(() => {
        // Animate from 0 (Covered) to 100 (Uncovered)
        // Need to render initial state first
        renderWaves();

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            delay: 0.1 // Slight delay on mount
        });

        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * (NUM_PATHS - i - 1); // Reverse delay for uncover

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = STABLE_DELAYS[j];
                tl.to(points, {
                    [j]: 100, // Move to bottom (Uncover)
                    duration: 1.2,
                    ease: 'power3.inOut',
                }, delay + pathDelay);
            }
        }
    }, [renderWaves]);

    // Render Portal to ensure it is on top of everything
    if (!mounted) return null;

    return createPortal(
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
            <svg
                style={{ width: '100%', height: '100%', display: 'block' }}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <path ref={(el) => { pathRefs.current[0] = el; }} fill="#ffffff" />
                <path ref={(el) => { pathRefs.current[1] = el; }} fill="#0e100f" />
            </svg>
        </div>,
        document.body
    );
};

export default WaveEntrance;
