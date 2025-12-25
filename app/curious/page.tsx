'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import CuriousContent from '@/components/sections/CuriousContent';

export default function CuriousPage() {
    const windowRef = useRef<HTMLDivElement>(null);
    const sharpContentRef = useRef<HTMLDivElement>(null);
    const scannerLineRef = useRef<HTMLDivElement>(null);

    // Wave Animation Refs
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const allPointsRef = useRef<number[][]>([]);
    const NUM_PATHS = 2;
    const NUM_POINTS = 10;
    const STABLE_DELAYS = [0.02, 0.05, 0.03, 0.06, 0.04, 0.07, 0.03, 0.05, 0.04, 0.02];
    const DELAY_PER_PATH = 0.1;

    // Mouse Interaction
    useEffect(() => {
        // ... (Keep existing mouse move logic for window/content) ...
        const xSet = gsap.quickSetter(windowRef.current, "x", "px");
        const ySet = gsap.quickSetter(windowRef.current, "y", "px");

        // Center positions
        gsap.set(windowRef.current, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
        gsap.set(sharpContentRef.current, { x: -window.innerWidth / 2 + 175, y: -window.innerHeight / 2 + 250 });

        const moveWindow = (e: MouseEvent) => {
            const { clientX, clientY } = e;

            // Window movement
            gsap.to(windowRef.current, {
                x: clientX,
                y: clientY,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: 'auto'
            });

            // Counter-movement
            gsap.to(sharpContentRef.current, {
                x: -clientX + 175,
                y: -clientY + 250,
                duration: 0.15,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        };

        window.addEventListener('mousemove', moveWindow);
        return () => window.removeEventListener('mousemove', moveWindow);
    }, []);

    // Entrance Animation (Waves)
    useEffect(() => {
        // Initialize Points
        allPointsRef.current = [];
        for (let i = 0; i < NUM_PATHS; i++) {
            const points: number[] = [];
            for (let j = 0; j < NUM_POINTS; j++) {
                points.push(0); // Start at 0 (covering screen) -> animate to 0 is wrong. Wait.
                // Cover to Reveal:
                // Start: Curve covers screen (100% height or 0% depending on direction).
                // ProjectsOverlay goes 100 -> 0 to Open? No, it goes 0 -> 100 or something.
                // ProjectsOverlay: Puts points at 100 initially? No. 
                // Let's assume we want to "Reveal" the page. 
                // The overlay should start FULL (covering) and animate AWAY.
                // Curve logic: M 0 [y] ... V 100 H 0.
                // If y=0, path is at top. If y=100, path is at bottom.
                // To COVER: y should be 100? No, V 100 fills the bottom.
                // Let's try starting at 0 (Top) and animating to 100? Or starting at 100 and animating to 0?
                // ProjectsOverlay `handleClose`: [j]: 100. So 100 is "Closed/Hidden" (or rather "Off screen"? No "Close" means hide the overlay).
                // Wait. We want to simulate the "Projects Click" which OPENS the overlay.
                // ProjectsOverlay `useEffect` (Open): points start at 100? No `points[j] = 100`. And animates to `0`.
                // So 100 = Bottom/Gone? 0 = Top/Full?
                // Actually `V 100 H 0`. The path fills from Y to 100.
                // If Y = 100, Path is empty height.
                // If Y = 0, Path is full height.
                // So Open starts at 100 (Empty) -> 0 (Full).
                // WE want "Unveil". So Start at 0 (Full) -> 100 (Empty).

                points.push(0);
            }
            allPointsRef.current.push(points);
        }

        // Render Loop
        const renderWaves = () => {
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
                d += ` V 100 H 0`; // Fills BOTTOM
                // We want to fill TOP to obscure?
                // If we want to reveal from bottom to top?
                // Let's stick to the ProjectOverlay geometry: V 100 H 0.
                // Means it fills from CurveY down to 100.
                // So if Y=0, it fills 0->100 (Full screen).
                // If Y=100, it fills 100->100 (Empty).

                path.setAttribute('d', d);
            }
        };

        const tl = gsap.timeline({
            onUpdate: renderWaves,
            delay: 0.2
        });

        // We want to visually "Lift" the curtain.
        // So animate 0 -> 100.
        // Order: White (Top layer?) then Black (Bottom layer?).
        // ProjectsOverlay: White Path, Black Path.
        // We want to reveal the underlying page (Zinc).
        // So we need Black covering White covering Zinc.
        // Top layer (last in DOM) is visible.
        // So Black needs to animate away first, then White?
        // Or White then Black?
        // Let's try animating BOTH 0 -> 100.

        for (let i = 0; i < NUM_PATHS; i++) {
            const points = allPointsRef.current[i];
            const pathDelay = DELAY_PER_PATH * i; // Stagger paths

            for (let j = 0; j < NUM_POINTS; j++) {
                const delay = STABLE_DELAYS[j];
                tl.to(points, {
                    [j]: 100, // Go to bottom
                    duration: 1.0, // Slow & smooth
                    ease: 'power3.inOut',
                }, delay + pathDelay);
            }
        }
    }, []);

    return (
        <div className="relative w-full h-screen bg-zinc-200 overflow-hidden cursor-none font-sans">

            {/* ENTRANCE TRANSITION WAVES */}
            <svg className="absolute inset-0 w-full h-full z-[100] pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Order matters. Logic: V 100 H 0 fills 'below' the curve. */}
                {/* If we want to see them on top, they must be z-100. */}
                {/* Color: Black and White to match. */}
                {/* Path 0 (Bottom/Behind), Path 1 (Top/Front) */}
                <path ref={(el) => { pathRefs.current[0] = el; }} fill="#ffffff" />
                <path ref={(el) => { pathRefs.current[1] = el; }} fill="#000000" />
            </svg>

            {/* LAYER 1: Blurred Background (The "White Frost" State) */}
            <div className="absolute inset-0 z-0">
                <div className="w-full h-full filter blur-[30px] brightness-125 saturate-50 scale-105 opacity-80">
                    <CuriousContent />
                </div>
                {/* White Fog Tint */}
                <div className="absolute inset-0 bg-white/40 mix-blend-hard-light" />
            </div>

            {/* Heavy Frost Noise Overlay */}
            <div
                className="absolute inset-0 pointer-events-none z-50 opacity-60 mix-blend-soft-light"
                style={{
                    filter: 'contrast(150%) brightness(100%)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Hint Text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 text-zinc-900/50 pointer-events-none text-xl font-light tracking-[0.2em] uppercase mix-blend-multiply">
                Reveal the Truth
            </div>

            {/* LAYER 2: The Flashlight Window (Sharp Content) */}
            <div
                ref={windowRef}
                className="absolute top-0 left-0 w-[400px] h-[300px] sm:w-[350px] sm:h-[500px] rounded-[30px] overflow-hidden z-30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50"
            >
                {/* Scanner Bracket UI (Reference Detail) */}
                <div className="absolute inset-0 z-50 pointer-events-none border-[1px] border-white/20 rounded-[30px] m-1">
                    {/* Corners */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/80" />
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/80" />
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/80" />
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/80" />

                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400/50 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-scan" style={{
                        animation: 'scan 3s ease-in-out infinite'
                    }} />
                </div>

                <div
                    ref={sharpContentRef}
                    className="absolute top-0 left-0 w-screen h-screen origin-top-left will-change-transform"
                >
                    <CuriousContent />
                </div>
            </div>

            {/* Back Button */}
            <Link href="/" className="absolute top-8 left-8 z-[60] text-zinc-500 hover:text-zinc-900 transition-colors text-sm uppercase tracking-widest pointer-events-auto font-medium">
                ← Return
            </Link>
        </div>
    );
}
