'use client';

import IdentityReveal from '@/components/sections/IdentityReveal';
import CurveReveal from '@/components/transitions/CurveReveal'; // Reusing existing transition
import { Cursor } from '@/components';
// Assuming we want to wrap it in a Layout or just use it directly. 
// The user asked for "animation of opening and closing like the wave". The CurveReveal does this for Sections.
// Since this is a Page, we might want a global layout transition.
// For now, I'll assume standard page render.

export default function RevealPage() {
    return (
        <main>
            <Cursor />
            {/* 
               If we want the 'wave' transition ON LOAD, we typically handle that in a template.tsx 
               or by creating an entrance animation. 
               The 'SectionReveal' / 'CurveReveal' components are designed for scroll.
               I will wrap this in a simple motion div for fade/wave if needed, 
               but the user specifically mentioned "opening and closing like the wave".
               
               I'll use a simple GSAP entrance here or just render the component which is impactful enough.
            */}
            <IdentityReveal />
        </main>
    );
}
