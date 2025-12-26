'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import WaveEntrance from '@/components/transitions/WaveEntrance';
import IdentityHUD from './IdentityHUD';
import styles from './IdentityReveal.module.css';

// Register GSAP Plugin
gsap.registerPlugin(TextPlugin);

// Config
const CONFIG = {
    BLOCK_SIZE: 24,
    SYMBOLS: ['0', '1', 'X', 'Y', 'Z', '#', '$', '%', '&', '<', '>'],
    HEAL_DELAY: 1500,
    SCRAMBLE_DURATION: 300,
    RADIUS: 80,
};

interface ActiveBlock {
    col: number;
    row: number;
    x: number;
    y: number;
    startTime: number;
    isScrambling: boolean;
}

const IdentityReveal = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const manRef = useRef<HTMLImageElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);

    const activeBlocksRef = useRef<Map<string, ActiveBlock>>(new Map());
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const maskImgRef = useRef<HTMLImageElement | null>(null);

    // Draw the full mask from maskImgRef
    const drawFullMask = useCallback((ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, width: number, height: number) => {
        if (!maskImgRef.current) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(maskImgRef.current, offsetX, offsetY, width, height);
    }, []);

    // Restore a block from the mask image
    const restoreBlock = useCallback((ctx: CanvasRenderingContext2D, block: ActiveBlock) => {
        if (!maskImgRef.current || !manRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const man = manRef.current;
        const cRect = container.getBoundingClientRect();
        const mRect = man.getBoundingClientRect();
        const offsetX = mRect.left - cRect.left;
        const offsetY = mRect.top - cRect.top;

        // Calculate source coordinates on the mask image
        const srcX = (block.x - offsetX) * (maskImgRef.current.width / mRect.width);
        const srcY = (block.y - offsetY) * (maskImgRef.current.height / mRect.height);
        const srcW = CONFIG.BLOCK_SIZE * (maskImgRef.current.width / mRect.width);
        const srcH = CONFIG.BLOCK_SIZE * (maskImgRef.current.height / mRect.height);

        ctx.drawImage(
            maskImgRef.current,
            srcX, srcY, srcW, srcH,
            block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE
        );
    }, []);

    // Draw initial state
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const container = containerRef.current;
        const man = manRef.current;

        if (!canvas || !ctx || !container || !man || !maskImgRef.current) return;

        // High-DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // CSS size
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const mRect = man.getBoundingClientRect();
        const offsetX = mRect.left - rect.left;
        const offsetY = mRect.top - rect.top;

        drawFullMask(ctx, offsetX, offsetY, mRect.width, mRect.height);
    }, [imagesLoaded, drawFullMask]);

    // Text Animation on Mount
    useEffect(() => {
        if (!nameRef.current) return;

        // Start with scrambled placeholder
        nameRef.current.innerHTML = '######<br>######';

        // Animate first line
        const tl = gsap.timeline({ delay: 0.8 });

        // Custom scramble effect for two lines
        const line1 = 'VISHNU';
        const line2 = 'VARDHAN';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%';

        let frame = 0;
        const maxFrames = 30;

        const scrambleLoop = () => {
            if (!nameRef.current) return;
            frame++;

            const progress = frame / maxFrames;
            const revealedLine1 = Math.floor(progress * line1.length);
            const revealedLine2 = Math.floor(progress * line2.length);

            let display1 = '';
            let display2 = '';

            for (let i = 0; i < line1.length; i++) {
                if (i < revealedLine1) {
                    display1 += line1[i];
                } else {
                    display1 += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            for (let i = 0; i < line2.length; i++) {
                if (i < revealedLine2) {
                    display2 += line2[i];
                } else {
                    display2 += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            nameRef.current.innerHTML = `${display1}<br>${display2}`;

            if (frame < maxFrames) {
                requestAnimationFrame(scrambleLoop);
            } else {
                nameRef.current.innerHTML = `${line1}<br>${line2}`;
            }
        };

        // Start animation
        tl.call(scrambleLoop, undefined, 0);
        tl.fromTo(nameRef.current,
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' },
            0
        );
    }, []);

    // Load images
    useEffect(() => {
        const man = new Image();
        const mask = new Image();

        // Bust cache to force new image load
        const t = Date.now();
        man.src = `/components/main-face.jpg?t=${t}`;
        mask.src = `/reveal/mask.png?t=${t}`;

        man.crossOrigin = "anonymous";
        mask.crossOrigin = "anonymous";

        let loadedCount = 0;
        const onLoad = () => {
            loadedCount++;
            if (loadedCount === 2) {
                maskImgRef.current = mask;
                // We don't necessarily need store man in a ref if it's in the DOM, 
                // but we wait for both to ensure layout is ready
                setImagesLoaded(true);
            }
        };

        man.onload = onLoad;
        mask.onload = onLoad;
    }, []);

    // Handle Resize & Init
    useEffect(() => {
        if (imagesLoaded) {
            draw();
            window.addEventListener('resize', draw);

            // Start Animation Loop
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
                animate(ctx);
            }
        }
        return () => window.removeEventListener('resize', draw);
    }, [imagesLoaded, draw]);

    const animate = (ctx: CanvasRenderingContext2D) => {
        const loop = () => {
            const now = Date.now();

            activeBlocksRef.current.forEach((block, key) => {
                const elapsed = now - block.startTime;

                if (elapsed < CONFIG.SCRAMBLE_DURATION) {
                    if (Math.random() > 0.5) {
                        ctx.clearRect(block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
                    } else {
                        ctx.fillStyle = '#ffffff';
                        ctx.font = `${CONFIG.BLOCK_SIZE}px monospace`;
                        ctx.textBaseline = 'top';
                        ctx.fillText(
                            CONFIG.SYMBOLS[Math.floor(Math.random() * CONFIG.SYMBOLS.length)],
                            block.x,
                            block.y
                        );
                    }
                } else if (elapsed < CONFIG.HEAL_DELAY) {
                    ctx.clearRect(block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
                } else {
                    restoreBlock(ctx, block);
                    activeBlocksRef.current.delete(key);
                }
            });

            requestAnimationFrame(loop);
        };
        loop();
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current) return;
            const rect = canvasRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const startCol = Math.floor((mouseX - CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const endCol = Math.ceil((mouseX + CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const startRow = Math.floor((mouseY - CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const endRow = Math.ceil((mouseY + CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);

            for (let c = startCol; c <= endCol; c++) {
                for (let r = startRow; r <= endRow; r++) {
                    const x = c * CONFIG.BLOCK_SIZE;
                    const y = r * CONFIG.BLOCK_SIZE;

                    const dx = x + CONFIG.BLOCK_SIZE / 2 - mouseX;
                    const dy = y + CONFIG.BLOCK_SIZE / 2 - mouseY;

                    if (dx * dx + dy * dy < CONFIG.RADIUS * CONFIG.RADIUS) {
                        const key = `${c},${r}`;
                        if (!activeBlocksRef.current.has(key)) {
                            activeBlocksRef.current.set(key, {
                                col: c,
                                row: r,
                                x,
                                y,
                                startTime: Date.now(),
                                isScrambling: true
                            });
                        } else {
                            const block = activeBlocksRef.current.get(key);
                            if (block && (Date.now() - block.startTime > CONFIG.SCRAMBLE_DURATION)) {
                                block.startTime = Date.now() - CONFIG.SCRAMBLE_DURATION;
                            }
                        }
                    }
                }
            }
        };

        const onTouchMove = (e: TouchEvent) => {
            if (!canvasRef.current) return;
            // Prevent scrolling while scanning if touching the canvas
            if (e.cancelable && e.target === canvasRef.current) {
                e.preventDefault();
            }

            const rect = canvasRef.current.getBoundingClientRect();
            const touch = e.touches[0];
            const mouseX = touch.clientX - rect.left;
            const mouseY = touch.clientY - rect.top;

            const startCol = Math.floor((mouseX - CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const endCol = Math.ceil((mouseX + CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const startRow = Math.floor((mouseY - CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);
            const endRow = Math.ceil((mouseY + CONFIG.RADIUS) / CONFIG.BLOCK_SIZE);

            for (let c = startCol; c <= endCol; c++) {
                for (let r = startRow; r <= endRow; r++) {
                    const x = c * CONFIG.BLOCK_SIZE;
                    const y = r * CONFIG.BLOCK_SIZE;

                    const dx = x + CONFIG.BLOCK_SIZE / 2 - mouseX;
                    const dy = y + CONFIG.BLOCK_SIZE / 2 - mouseY;

                    if (dx * dx + dy * dy < CONFIG.RADIUS * CONFIG.RADIUS) {
                        const key = `${c},${r}`;
                        if (!activeBlocksRef.current.has(key)) {
                            activeBlocksRef.current.set(key, {
                                col: c,
                                row: r,
                                x,
                                y,
                                startTime: Date.now(),
                                isScrambling: true
                            });
                        } else {
                            const block = activeBlocksRef.current.get(key);
                            if (block && (Date.now() - block.startTime > CONFIG.SCRAMBLE_DURATION)) {
                                block.startTime = Date.now() - CONFIG.SCRAMBLE_DURATION;
                            }
                        }
                    }
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove);
        // Use passive: false to allow preventDefault
        const canvasEl = canvasRef.current;
        if (canvasEl) {
            canvasEl.addEventListener('touchmove', onTouchMove, { passive: false });
        }

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (canvasEl) {
                canvasEl.removeEventListener('touchmove', onTouchMove);
            }
        };
    }, [imagesLoaded]);

    return (
        <div ref={containerRef} className={styles.container}>


            {/* Single Text Layer with Opacity Mask */}
            <div ref={nameRef} className={styles.nameText}>
                VISHNU<br />VARDHAN
            </div>

            <IdentityHUD />

            <WaveEntrance />

            <div className={styles.wrapper}>
                <img
                    ref={manRef}
                    src="/components/main-face.jpg"
                    alt="Identity"
                    className={styles.manImage}
                // onLoad handled in useEffect manually with cache busting
                />
                <canvas
                    ref={canvasRef}
                    className={styles.maskCanvas}
                />
            </div>
        </div>
    );
};

export default IdentityReveal;
