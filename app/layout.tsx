import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rythamo — Vishnu Vardhan | AI Engineer & Fullstack Developer",
  description: "Rythamo (Vishnu Vardhan) — AI Engineer, Fullstack Developer, and Creative Technologist. Building intelligent systems with Flutter, Next.js, Python, and Generative AI. Research-first, code-second.",
  keywords: ["Rythamo", "Vishnu Vardhan", "AI Engineer", "Fullstack Developer", "Flutter", "Next.js", "Python", "Generative AI", "portfolio"],
  authors: [{ name: "Vishnu Vardhan", url: "https://vishnuvardhanm.vercel.app" }],
  creator: "Rythamo",
  metadataBase: new URL("https://vishnuvardhanm.vercel.app"),
  other: {
    "google-site-verification": "zOOj--hb4C2SawK-7BPeqrCavYMLjEHaIXc7wpvULZ8",
  },
  openGraph: {
    title: "Rythamo — Vishnu Vardhan | AI Engineer & Fullstack Developer",
    description: "AI Engineer, Fullstack Developer, and Creative Technologist. Building intelligent systems with Flutter, Next.js, Python, and Generative AI.",
    url: "https://vishnuvardhanm.vercel.app",
    siteName: "Rythamo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rythamo — Vishnu Vardhan | AI Engineer & Fullstack Developer",
    description: "AI Engineer, Fullstack Developer, and Creative Technologist. Building intelligent systems with Flutter, Next.js, Python, and Generative AI.",
    creator: "@Rythamo8055",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vishnu Vardhan",
    "alternateName": "Rythamo",
    "url": "https://vishnuvardhanm.vercel.app",
    "sameAs": [
      "https://github.com/Rythamo8055",
      "https://linkedin.com/in/vishnu-vardhan8055"
    ],
    "jobTitle": "AI Engineer & Fullstack Developer",
    "knowsAbout": ["Flutter", "Python", "AI/ML", "Next.js", "Tauri", "Rust"]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Script
          src="https://unpkg.com/gsap@3/dist/MorphSVGPlugin.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
