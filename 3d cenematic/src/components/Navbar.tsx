'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logo}>
                Vishnu
            </Link>

            <div className={styles.links}>
                <Link href="#" className={styles.link}>About</Link>
                <Link href="#" className={styles.link}>Work</Link>
            </div>

            <Link href="mailto:vishnuvardhanthe8055@gmail.com" className={styles.cta}>
                LET'S TALK
            </Link>
        </nav>
    );
}
