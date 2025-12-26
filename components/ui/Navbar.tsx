'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import styles from './Navbar.module.css';

interface NavbarProps {
    onProjectsClick: () => void;
    onCuriousClick: () => void;
    onIdentityClick: () => void;
}

const Navbar = ({ onProjectsClick, onCuriousClick, onIdentityClick }: NavbarProps) => {
    const navRef = useRef<HTMLElement>(null);
    const projectsBtnRef = useRef<HTMLButtonElement>(null);
    const curiousBtnRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Animate navbar in on mount
        const ctx = gsap.context(() => {
            gsap.fromTo(
                navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
            );

            // Stagger animate nav items
            gsap.fromTo(
                `.${styles.navItem}`,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1, delay: 0.8 }
            );

            // LOGO ANIMATION (Continuous Draw/Undraw)
            const path = document.querySelector(`.${styles.logoPath}`) as SVGGraphicsElement;
            if (path) {
                // Text elements don't support getTotalLength, so we use a sufficient approximation
                const length = 300;
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

                const tl = gsap.timeline({ repeat: -1, repeatDelay: 1, yoyo: true });
                tl.to(path, {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: "power2.inOut"
                });
            }
        });

        return () => ctx.revert();
    }, []);

    // Reusable Magnetic Logic
    const handleMagnetMove = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(target, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const handleMagnetLeave = (e: React.MouseEvent<HTMLElement>) => {
        gsap.to(e.currentTarget, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)',
        });
    };

    const handleCuriousClick = (e: React.MouseEvent) => {
        gsap.to(curiousBtnRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: onCuriousClick // Call the prop
        });
    };

    const handleClick = () => {
        // Button press animation
        gsap.to(projectsBtnRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: onProjectsClick,
        });
    };

    return (
        <>
            <nav ref={navRef} className={styles.navbar}>
                <div className={styles.navContent}>
                    {/* Logo */}
                    <div className={`${styles.logo} ${styles.navItem}`}>
                        {/* Animated SVG Logo */}
                        <svg className={styles.logoSvg} width="160" height="40" viewBox="0 0 160 40">
                            <text
                                className={styles.logoPath}
                                x="0"
                                y="30"
                                fontFamily="sans-serif"
                                fontSize="28"
                                fontWeight="800"
                                fill="none"
                                stroke="#fffce1"
                                strokeWidth="1"
                                letterSpacing="0.1em"
                            >
                                VISHNU
                            </text>
                        </svg>
                    </div>

                    <div className={styles.navLinks}>
                        <button
                            className={`${styles.projectsBtn} ${styles.navItem} ${styles.curiousBtn}`}
                            onMouseMove={handleMagnetMove}
                            onMouseLeave={handleMagnetLeave}
                            onClick={onIdentityClick}
                        >
                            <span className={styles.btnText}>Identity</span>
                        </button>
                        <button
                            ref={curiousBtnRef}
                            className={`${styles.projectsBtn} ${styles.navItem} ${styles.curiousBtn}`}
                            onMouseMove={handleMagnetMove}
                            onMouseLeave={handleMagnetLeave}
                            onClick={handleCuriousClick}
                        >
                            <span className={styles.btnText}>Curious</span>
                        </button>
                        <button
                            ref={projectsBtnRef}
                            className={`${styles.projectsBtn} ${styles.navItem}`}
                            onMouseMove={handleMagnetMove}
                            onMouseLeave={handleMagnetLeave}
                            onClick={handleClick}
                        >
                            <span className={styles.btnText}>Projects</span>
                            <span className={styles.btnIcon}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Transition Overlay (Hidden by default) */}
            <div
                id="page-transition-overlay"
                className="fixed inset-0 bg-black z-[9999] hidden pointer-events-none"
                style={{ display: 'none' }}
            >
                {/* Optional: Add SVG wave shape here if needed, for now just black curtain */}
                <div className="absolute inset-0 bg-zinc-900" />
            </div>
        </>
    );
};

export default Navbar;
