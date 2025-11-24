import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    🩸 Rakta Blood
                </Link>
                <div className={styles.navLinks}>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/donate">Donate</Link>
                    <Link href="/locations">Locations</Link>
                    <Link href="/auth/login" className="btn btn-primary">Login</Link>
                </div>
            </div>
        </nav>
    );
}
