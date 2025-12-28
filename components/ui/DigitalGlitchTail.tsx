'use client';

import { useEffect, useRef } from 'react';

interface DigitalGlitchTailProps {
    isActive?: boolean;
    zIndex?: number;
}

const CONFIG = {
    BLOCK_SIZE: 24,
    SYMBOLS: ['0', '1', 'X', 'Y', 'Z', '#', '$', '%', '&', '<', '>'],
    HEAL_DELAY: 1500,
    SCRAMBLE_DURATION: 300,
    RADIUS: 80,
};

const DigitalGlitchTail = ({ isActive = true, zIndex = 9999 }: DigitalGlitchTailProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const activeBlocksRef = useRef<Map<string, { col: number, row: number, x: number, y: number, startTime: number }>>(new Map());

    useEffect(() => {
        if (!isActive) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        const handleResize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            ctx.scale(dpr, dpr);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Animation Loop
        let animationFrameId: number;
        const renderLoop = () => {
            const now = Date.now();

            activeBlocksRef.current.forEach((block, key) => {
                const elapsed = now - block.startTime;

                if (elapsed < CONFIG.SCRAMBLE_DURATION) {
                    // CLEAR
                    ctx.clearRect(block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);

                    // FLICKER / DRAW
                    if (Math.random() > 0.5) {
                        ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Solid white for max visibility
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
                    ctx.clearRect(block.x, block.y, CONFIG.BLOCK_SIZE, CONFIG.BLOCK_SIZE);
                    activeBlocksRef.current.delete(key);
                }
            });

            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Mouse Tracker
        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
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
                            activeBlocksRef.current.set(key, { col: c, row: r, x, y, startTime: Date.now() });
                        } else {
                            const block = activeBlocksRef.current.get(key);
                            if (block && (Date.now() - block.startTime > CONFIG.SCRAMBLE_DURATION)) {
                                block.startTime = Date.now();
                            }
                        }
                    }
                }
            }
        };

        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive]);

    if (!isActive) return null;

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: zIndex,
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))'
            }}
        />
    );
};

export default DigitalGlitchTail;
