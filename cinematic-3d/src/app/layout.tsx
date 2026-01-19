import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import './globals.css';
import { Oswald, Montserrat } from 'next/font/google';

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Vishnu Vardhan - Cinematic Portfolio',
  description: 'Architecting Intelligent Systems. Expert in Generative UI and LLM Agents.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${montserrat.variable} antialiased bg-black text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
