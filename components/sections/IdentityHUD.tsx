'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './IdentityHUD.module.css';

const IdentityHUD = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 1.0 });

            // Animate Container opacity
            tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1 });

            // Select all glass panels
            const panels = gsap.utils.toArray<HTMLElement>(`.${styles.glassPanel}`);

            // Ensure they are visible to start (in case CSS hid them), but alpha 0
            gsap.set(panels, { autoAlpha: 0, y: 30 });

            // 1. Entrance: Fly in
            tl.to(panels, {
                autoAlpha: 1, // Handles opacity + visibility
                y: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power2.out",
                onComplete: () => {
                    // 2. Perpetual Link: Start floating
                    panels.forEach((panel) => {
                        gsap.to(panel, {
                            y: "-=15",
                            duration: 2 + Math.random() * 2,
                            yoyo: true,
                            repeat: -1,
                            ease: "sine.inOut",
                            delay: Math.random() * 0.5
                        });
                    });
                }
            }, "-=0.5");

            // Skill Bars Animation
            const bars = document.querySelectorAll(`.${styles.skillBarFill}`);
            tl.fromTo(bars,
                { width: '0%' },
                { width: (i) => [95, 88, 92, 85, 90][i] + '%', duration: 1.5, stagger: 0.1, ease: "circ.out" },
                "-=0.5"
            );
        }, containerRef); // Scope to container

        return () => ctx.revert();
    }, []);

    const handleDeploy = () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className={styles.hudContainer}>

            {/* Top Area Cleared for Navbar */}

            {/* Bottom Left: Skills Stack */}
            <div className={`${styles.glassPanel} ${styles.panelBL}`}>
                <span className={styles.sectionHeader}>// MODULES</span>
                <div className={styles.skillList}>
                    <SkillItem name="AI_ENGINEER" />
                    <SkillItem name="FULLSTACK_DEV" />
                    <SkillItem name="PYTHON_DEV" />
                    <SkillItem name="FLUTTER_UI" />
                    <SkillItem name="GEN_AI" />
                    <SkillItem name="CSE_STUDENT" />
                </div>
            </div>

            {/* Bottom Right: Mission Stats */}
            <div className={`${styles.glassPanel} ${styles.panelBR}`}>
                <span className={styles.sectionHeader}>// PROFILE_DATA</span>
                <div className={styles.statRow}>
                    <span className={styles.label}>CLASS</span>
                    <span className={styles.value}>ASPIRING AI ENGINEER</span>
                </div>
                <div className={styles.statRow}>
                    <span className={styles.label}>EXP</span>
                    <span className={styles.value}>3RD YEAR CSE</span>
                </div>
                <div className={styles.statRow}>
                    <span className={styles.label}>MISSION</span>
                    <span className={styles.value} style={{ fontSize: '0.75rem', lineHeight: '1.4' }}>
                        "CODING THE FUTURE OF AI."
                    </span>
                </div>
            </div>

            {/* Bottom Center: CTA */}

        </div>
    );
};

const SkillItem = ({ name }: { name: string }) => (
    <div className={styles.skillRow}>
        <span>{name}</span>
        <div className={styles.skillBarBg}>
            <div className={styles.skillBarFill}></div>
        </div>
    </div>
);

export default IdentityHUD;
