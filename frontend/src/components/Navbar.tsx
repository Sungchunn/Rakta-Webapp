'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <nav className={styles.navbar}>
            <Link href="/" className={styles.logoContainer}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.5C16.1421 21.5 19.5 18.1421 19.5 14C19.5 10.5 12 2.5 12 2.5C12 2.5 4.5 10.5 4.5 14C4.5 18.1421 7.85786 21.5 12 21.5Z" fill="#8B0000" />
                </svg>
            </Link>

            <div className={styles.navLinks}>
                <Link href="/" className={styles.navLink}>Home</Link>
                <Link href="" className={styles.navLink}>About Us</Link>
                <Link href="/donate" className={styles.navLink}>Find Blood</Link>
                <div className={styles.navLink}>
                    Register Now ▾
                </div>
            </div>

            <Link href="/login">
                <button className={styles.loginBtn}>
                    Log In
                </button>
            </Link>
        </nav>
    );
}
