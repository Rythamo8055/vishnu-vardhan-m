'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CinematicBackground.module.css';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 104; // 105 frames (0-104)

export default function CinematicBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Load images
    useEffect(() => {
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const paddedIndex = String(i).padStart(4, '0');
            img.src = `/images/sequence/frame_${paddedIndex}.png`;

            img.onload = () => {
                loadedCount++;
                setLoadingProgress(Math.round((loadedCount / (TOTAL_FRAMES + 1)) * 100));

                // If the first frame loads, confirm it can be drawn
                if (i === 0) {
                    render(0);
                }

                if (loadedCount >= TOTAL_FRAMES) {
                    setImagesLoaded(true);
                    render(0);
                    ScrollTrigger.refresh();
                }
            };

            // Check if already cached
            if (img.complete) {
                img.onload(new Event('load'));
            }

            img.onerror = () => {
                console.error(`Failed to load frame ${i}`);
                loadedCount++; // Count as loaded to prevent stuck loading screen
                if (loadedCount >= TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };

            images.push(img);
        }

        // Render function with HiDPI support
        const render = (index: number) => {
            if (!canvasRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            if (!ctx) return;

            const img = images[index];
            if (img) {
                const canvas = canvasRef.current;
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);

                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;

                ctx.drawImage(img,
                    0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
                );
            }
        };

        const handleResize = () => {
            if (canvasRef.current) {
                const dpr = window.devicePixelRatio || 1;
                canvasRef.current.width = window.innerWidth * dpr;
                canvasRef.current.height = window.innerHeight * dpr;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const frameObj = { frame: 0 };

        // GSAP ScrollTrigger
        // We want the sequence to play from top of page to bottom of page.
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: "body", // Track the entire body scroll
                start: "top top",
                end: "bottom bottom",
                scrub: 0,
                onUpdate: (self) => {
                    const frameIndex = Math.round(self.progress * TOTAL_FRAMES);
                    render(Math.min(frameIndex, TOTAL_FRAMES));
                }
            });

            render(0);
        }, containerRef);

        return () => {
            window.removeEventListener('resize', handleResize);
            ctx.revert();
        };
    }, []);

    return (
        <>
            {/* Loading Overlay */}
            {!imagesLoaded && (
                <div className={styles.loadingOverlay}>
                    <div className="text-center">
                        <div className={styles.loadingText}>LOADING SYSTEM</div>
                        <div className={styles.loadingBar}>
                            <div
                                className={styles.loadingProgress}
                                style={{ width: `${loadingProgress}%` }}
                            />
                        </div>
                        <div className={styles.loadingPercent}>{loadingProgress}%</div>
                    </div>
                </div>
            )}

            {/* Fixed Canvas Background */}
            <canvas ref={canvasRef} className={styles.canvas} />

            {/* Gradient Overlay for better text readability globally */}
            <div className={styles.gradientOverlay}></div>
        </>
    );
}
