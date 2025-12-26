'use client';

import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero, Cursor, SmoothScroll, Navbar, ProjectsOverlay, CuriousOverlay } from '@/components';
import IdentityReveal from '@/components/sections/IdentityReveal';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [showProjects, setShowProjects] = useState(false);
  const [showCurious, setShowCurious] = useState(false);

  useEffect(() => {
    // Fix mobile browser address bar scroll jitters
    ScrollTrigger.normalizeScroll(true);
  }, []);

  // Scroll to Identity (Top)
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Cursor />
      <Navbar
        onProjectsClick={() => setShowProjects(true)}
        onCuriousClick={() => setShowCurious(true)}
        onIdentityClick={scrollToTop}
      />
      <ProjectsOverlay isOpen={showProjects} onClose={() => setShowProjects(false)} />
      <CuriousOverlay isOpen={showCurious} onClose={() => setShowCurious(false)} />

      <SmoothScroll>
        <main className={styles.main}>
          {/* Hero Section - Identity Reveal */}
          <IdentityReveal />

          {/* About Section */}
          <section id="about" className={styles.sectionDark}>
            <div className={styles.contentWrapper}>
              <h2>About</h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className={styles.sectionLight}>
            <div className={styles.contentWrapper}>
              <h2>Contact</h2>
              <p>
                Get in touch for collaborations and opportunities.
              </p>
            </div>
          </section>
        </main>
      </SmoothScroll>
    </>
  );
}

