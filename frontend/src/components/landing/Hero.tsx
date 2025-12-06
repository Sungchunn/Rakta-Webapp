import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            {/* Blood Carpet is now handled globally by the BloodCarpet component which sits in the background */}
            {/* Texture overlay for subtle grain if desired, but image is clean. Removing for now to be safe. */}

            <div className={styles.heroContent}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>
                        Save Life <br /> Donate <br /> Blood
                    </h1>
                    <p className={styles.description}>
                        Your contribution can save up to three lives. Join our community of heroes and make a difference today.
                    </p>
                    <div className={styles.buttonGroup}>
                        <Link href="/donate">
                            <button className={styles.ctaButton}>
                                Get Blood Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
