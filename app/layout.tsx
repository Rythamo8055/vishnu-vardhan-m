import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vishnu Vardhan | AI Engineer",
  description: "Portfolio of Vishnu Vardhan, an Aspiring AI Engineer, Fullstack Developer, and Creative Technologist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* GSAP MorphSVG Plugin */}
        <Script
          src="https://unpkg.com/gsap@3/dist/MorphSVGPlugin.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
