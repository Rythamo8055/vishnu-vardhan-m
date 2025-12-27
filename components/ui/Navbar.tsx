'use client';

import { useRef, useEffect, useState } from 'react';
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
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

    // Mobile Menu Animation
    useEffect(() => {
        if (!mobileMenuRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            if (isMobileMenuOpen) {
                // OPEN
                tl.to(mobileMenuRef.current, {
                    autoAlpha: 1, // Visibility + Opacity
                    duration: 0.4,
                    ease: 'power3.out'
                })
                    .fromTo(`.${styles.mobileLink}`,
                        { y: 50, opacity: 0 },
                        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: 'back.out(1.2)' },
                        "-=0.2"
                    );

                // Animate Hamburger to X
                // (Optional: Simple rotation or SVG morph if explicit paths were separate)
                gsap.to(hamburgerRef.current, { rotation: 90, duration: 0.3 });

            } else {
                // CLOSE
                tl.to(mobileMenuRef.current, {
                    autoAlpha: 0,
                    duration: 0.3,
                    ease: 'power3.in'
                });

                gsap.to(hamburgerRef.current, { rotation: 0, duration: 0.3 });
            }
        });

        return () => ctx.revert();
    }, [isMobileMenuOpen]);

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
            onComplete: () => {
                setIsMobileMenuOpen(false);
                onCuriousClick();
            }
        });
    };

    const handleIdentityClick = () => {
        setIsMobileMenuOpen(false);
        onIdentityClick();
    };

    const handleProjectsClick = () => {
        // Button press animation
        gsap.to(projectsBtnRef.current, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                setIsMobileMenuOpen(false);
                onProjectsClick();
            },
        });
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            <nav ref={navRef} className={styles.navbar}>
                <div className={styles.navContent}>
                    {/* Logo */}
                    <div className={`${styles.logo} ${styles.navItem}`}>
                        {/* Animated SVG Logo - Adjusted Y to 32 for lower position */}
                        <svg className={styles.logoSvg} width="160" height="45" viewBox="0 0 160 45">
                            <text
                                className={styles.logoPath}
                                x="0"
                                y="35"
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

                    {/* Desktop Utility Links */}
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
                            onClick={handleProjectsClick}
                        >
                            <span className={styles.btnText}>Projects</span>
                            <span className={styles.btnIcon}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                                </svg>
                            </span>
                        </button>
                    </div>

                    {/* Mobile Hamburger - Only show when menu is closed */}
                    {!isMobileMenuOpen && (
                        <button
                            ref={hamburgerRef}
                            className={`${styles.hamburgerBtn} ${styles.navItem}`}
                            onClick={toggleMenu}
                            aria-label="Open Menu"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div ref={mobileMenuRef} className={styles.mobileMenu}>
                {/* Close Button */}
                <button
                    className={styles.closeMenuBtn}
                    onClick={toggleMenu}
                    aria-label="Close Menu"
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <button className={styles.mobileLink} onClick={handleIdentityClick}>Identity</button>
                <button className={styles.mobileLink} onClick={handleProjectsClick}>Projects</button>
                <button className={styles.mobileLink} onClick={handleCuriousClick}>Curious</button>
            </div>

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
