import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    Rakta
                </Link>
                <div className={styles.links}>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/donate">Donate</Link>
                    <Link href="/locations">Locations</Link>
                    <Link href="/auth/login" className="btn btn-primary">Login</Link>
                </div>
            </div>
        </nav>
    );
}
