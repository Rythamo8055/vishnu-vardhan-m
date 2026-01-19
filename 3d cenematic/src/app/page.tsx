import Hero from '@/components/Hero';
import About from '@/components/About';
import ProjectsGrid from '@/components/ProjectsGrid';
import Footer from '@/components/Footer';
import CinematicBackground from '@/components/CinematicBackground';

export default function Home() {
  const ctaStyle = {
    backgroundColor: 'transparent',
    textAlign: 'right' as const, /* Aligned right */
    position: 'relative' as const,
    zIndex: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    padding: '5rem 2rem'
  };

  const ctaTitle = {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '1.5rem'
  };

  const buttonStyle = {
    display: 'inline-block',
    backgroundColor: 'var(--accent-orange)',
    color: '#000',
    fontWeight: 700,
    padding: '1rem 2rem',
    borderRadius: '9999px',
    transition: 'background-color 0.15s'
  };

  return (
    <main className="min-h-screen">
      <CinematicBackground />
      <Hero />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Cinematic Spacer 1 */}
        <div className="h-[50vh] w-full" aria-hidden="true" />

        <About />

        {/* Cinematic Spacer 2 */}
        <div className="h-[50vh] w-full" aria-hidden="true" />

        <ProjectsGrid />

        {/* Cinematic Spacer 3 (Before CTA/Footer) */}
        <div className="h-[50vh] w-full" aria-hidden="true" />

        {/* Right Aligned CTA per user request */}
        <div className="w-full flex justify-end px-8 md:px-24">
          <div style={ctaStyle}>
            <h2 style={ctaTitle}>Ready to Build the Future?</h2>
            <a
              href="mailto:vishnuvardhanthe8055@gmail.com"
              style={buttonStyle}
            >
              CONTACT ME
            </a>
          </div>
        </div>
      </div>

      {/* Final Spacer before footer for "Hero-like" reveal - made smaller as CTA takes space */}
      <div className="relative z-10 h-[10vh] w-full" aria-hidden="true" />

      <Footer />
    </main>
  );
}
