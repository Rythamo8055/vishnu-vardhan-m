'use client';

import { useEffect, useRef, ReactNode, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register plugins client-side only
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollProps {
    children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !wrapperRef.current || !contentRef.current) return;

        let smoother: ScrollSmoother | null = null;

        try {
            smoother = ScrollSmoother.create({
                wrapper: wrapperRef.current,
                content: contentRef.current,
                smooth: 2,
                effects: true,
                smoothTouch: 0.1,
            });
        } catch (e) {
            console.error('ScrollSmoother failed to initialize:', e);
        }

        return () => {
            smoother?.kill();
        };
    }, [mounted]);

    return (
        <div id="smooth-wrapper" ref={wrapperRef}>
            <div id="smooth-content" ref={contentRef}>
                {children}
            </div>
        </div>
    );
};

export default SmoothScroll;
