# Prompt: Design a Cinematic Portfolio for Vishnu Vardhan

Design a premium, single-page parallax website for **Vishnu Vardhan** — a 3rd Year CS Student & Fullstack Engineer offering specialized expertise in Generative UI and LLM Agents.
Users must be able to change:
- **Entity name:** Vishnu Vardhan
- **Tagline / slogan**
- **Short introduction description** (1–3 lines)
- **Theme accent color:** Orange (#F59E0B)
- **Dark Mode**
- **Multiple WebP background parallax image sequences**
- **Text and content for each expertise area**

## HERO SECTION — EXACT TEXT LAYOUT FROM THE REFERENCE
The hero must follow the same structure and visual composition as the reference design:
- **Hero Background:** Full-screen WebP parallax sequence (Rounded Border Bottom)
  - Scroll down → frames advance
  - Scroll up → frames reverse
  - Animation must feel smooth and cinematic (First Load All Image and Use Opacity 100 and 0 to switch the image)
  - **IMPORTANT:** Images are located in `public/images/sequence/`. Ensure the code loads them from this local path.
- **Left Side Text Block (Identity Block):**
  - Left-aligned, overlaying the left side of the hero:
  - **Small Intro Line:** "Hello, I am" (Small text, accent color, position upper-left)
  - **Huge Two-Line Title:**
    - VISHNU
    - VARDHAN
    - (Must allow users to edit this title)
  - **Skill / Focus Highlights (Horizontal Mini-Sections):**
    - A row of four small skill indicators, each with index + label:
    - #01 Generative UI
    - #02 LLM Agents
    - #03 Flutter Tech
    - #04 Python Logic
    - (Appear below main title)
- **Right Side Text Block (Value Proposition Block):**
  - Right-aligned, overlaying the middle-right of the hero:
  - **Subheadline:** "Architecting Intelligent Systems."
  - **Supporting Paragraph:** "Bridging the gap between human intent and machine execution. Expert in Generative UI, intelligent agents, and fullstack engineering."
- **Bottom Social Icons:**
  - Centered at the bottom, minimal and monochrome:
  - LinkedIn
  - GitHub
  - Email

## Switching Themes Updates:
- Hero title / subtitle
- Accent color (Update buttons, highlight lines, active indicators)
- WebP background
- Large index number
- Text fades out/in smoothly

## Theme & Mode Support
- **Default:** Dark cinematic aesthetic
- **Dark mode only** — black/charcoal with neon accent
- **Accent Color:** Orange (#F59E0B) - Affects button backgrounds, highlight lines, section markers.

## Parallax Scroll Behavior
- Scroll position maps directly to WebP frame index.
- No autoplay. Smooth and responsive.

## Loading Experience
- Full-screen loading overlay
- Logo or Icon
- Horizontal loading bar + percentage
- Only reveal hero after frames are fully loaded

## SECTIONS BELOW HERO (Following Reference Style)
Use the same bold, modern style seen in the attached reference:

1. **About Vishnu**
   - **Title:** "Driven by First Principles"
   - **Visual:** Abstract AI-generated visual or Portrait
   - **Content:** "I don't just write code; I architect intelligent systems."
   - **Bullet points:**
     - 3rd Year Computer Science Student
     - Fullstack Engineer
     - Creative Technologist

2. **Featured Projects (Learning Paths Style)**
   - Grid layout of 4–6 boxes representing key projects:
   - **Agentic UI**: AI-powered learning assistant with voice capabilities.
   - **Rythamo Charity**: Connecting donors with orphanages via geolocation.
   - **Rythamo Day**: Personal wellness journal with mood tracking.
   - **Kahoot Clone**: Real-time multiplayer quiz platform.
   - **Vibecoding**: Experimental interactive UI components.
   - Each item includes a thumbnail + 1–2 line description.

3. **Tech Stack & Tools (Projects/Examples Style)**
   - Display cinematic thumbnails/logos of tools used:
   - Flutter & Dart
   - Next.js & TypeScript
   - Firebase AI & GenUI
   - Python & Gemini Models

4. **Testimonials / Proof (Placeholder)**
   - *Since specific testimonials are missing, use placeholders:*
   - **Note on Testimonials:** These are quotes from past clients, professors, or hackathon teammates vouching for your work (e.g., "Vishnu's AI agent architecture saved us weeks of dev time").
   - **Strategy:** Use generic placeholders for now (e.g., "Creative Director", "Lead Developer") that can be replaced later.
   - Cards with: Portrait photo, Client/Collaborator quote, Category tag.

5. **FAQ Section (Accordion)**
   - "Do you work with startups?"
   - "What is Generative UI?"
   - "Can you build full-stack AI apps?"
   - "Are you available for freelance?"

6. **Final CTA Section**
   - **Title:** "Ready to Build the Future?"
   - **Buttons:**
     - "Contact Me"
     - "View GitHub"

## Footer
- Dark footer with:
- Logo / Name (Vishnu Vardhan)
- Links (About, Projects, Contact, Resume)
- Social Icons (LinkedIn, GitHub, Email)
- Copyright

⭐ **IN SUMMARY**
This prompt produces a cinematic, scroll-controlled hero with the exact text layout from your reference image, fully adapted into a high-end portfolio website for Vishnu Vardhan—complete with parallax backgrounds, theme switches, project navigation, and premium modern sections.

**Mode:** Dark Mode Only
**Theme Color:** Black and Orange (#F59E0B)
**Webp Link:** `/images/sequence/frame_[0001-0240].webp` (Local Assets)
**Total Frame:** 240

---

# Missing Information
All critical information is now available.

**Action Required:**
1.  **Unzip Images:** Extract the zip file containing your WebP sequence into `public/images/sequence/`.
2.  **Rename Files:** Ensure files are named `frame_0001.webp` to `frame_0240.webp`.
