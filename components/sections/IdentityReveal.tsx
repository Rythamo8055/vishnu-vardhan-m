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

        // Load Mask Image
        const img = new Image();
        img.src = '/reveal/mask.png';
        img.onload = () => {
            maskImgRef.current = img;
            checkLoad();
        };
    }, []);

    const checkLoad = () => {
        if (maskImgRef.current && manRef.current?.complete) {
            setImagesLoaded(true);
        }
    };

    // Canvas Setup
    const initCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d', { willReadFrequently: true });
        const container = containerRef.current;
        const man = manRef.current;

        if (!canvas || !ctx || !maskImgRef.current || !container || !man) return;

        const cRect = container.getBoundingClientRect();
        canvas.width = cRect.width;
        canvas.height = cRect.height;

        const mRect = man.getBoundingClientRect();
        const offsetX = mRect.left - cRect.left;
        const offsetY = mRect.top - cRect.top;

        drawFullMask(ctx, offsetX, offsetY, mRect.width, mRect.height);
    }, [imagesLoaded]);

    const drawFullMask = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
        if (!maskImgRef.current) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(maskImgRef.current, x, y, w, h);
    };

    const restoreBlock = (ctx: CanvasRenderingContext2D, block: ActiveBlock) => {
        if (!maskImgRef.current || !manRef.current || !containerRef.current) return;

        const cRect = containerRef.current.getBoundingClientRect();
        const mRect = manRef.current.getBoundingClientRect();
        const startX = mRect.left - cRect.left;
        const startY = mRect.top - cRect.top;

        const relX = block.x - startX;
        const relY = block.y - startY;

        const img = maskImgRef.current;
        const scaleX = img.width / mRect.width;
        const scaleY = img.height / mRect.height;

        const sx = relX * scaleX;
        const sy = relY * scaleY;
        const sSize = CONFIG.BLOCK_SIZE * scaleX;

        try {
            ctx.drawImage(img, sx, sy, sSize, sSize, block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
        } catch (e) { }
    };

    useEffect(() => {
        if (imagesLoaded) {
            initCanvas();
            window.addEventListener('resize', initCanvas);
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) animate(ctx);
        }
        return () => window.removeEventListener('resize', initCanvas);
    }, [imagesLoaded, initCanvas]);

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

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    return (
        <div ref={containerRef} className={styles.container}>
            <div className={styles.instruction}>Scan to Reveal</div>
            <a href="/" className={styles.returnLink}>Return to Start</a>

            {/* Single Text Layer with Opacity Mask */}
            <div ref={nameRef} className={styles.nameText}>
                VISHNU<br />VARDHAN
            </div>

            <IdentityHUD />

            <WaveEntrance />

            <div className={styles.wrapper}>
                <img
                    ref={manRef}
                    src="/reveal/man.png"
                    alt="Identity"
                    className={styles.manImage}
                    onLoad={checkLoad}
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
