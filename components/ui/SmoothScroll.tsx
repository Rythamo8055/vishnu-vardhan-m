'use client';

import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap-trial/ScrollSmoother';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

interface SmoothScrollProps {
    children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!wrapperRef.current || !contentRef.current) return;

        const smoother = ScrollSmoother.create({
            wrapper: wrapperRef.current,
            content: contentRef.current,
            smooth: 3,
            effects: true,
            smoothTouch: 0.1,
        });

        return () => {
            smoother.kill();
        };
    }, []);

    return (
        <div id="smooth-wrapper" ref={wrapperRef}>
            <div id="smooth-content" ref={contentRef}>
                {children}
            </div>
        </div>
    );
};

export default SmoothScroll;
