import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            <div className={styles.redCurveBackground}></div>

            <div className={styles.heroContent}>
                {/* Right side content as per design */}
                <div className={styles.textContent}>
                    <h1 className={styles.title}>
                        Save Life Donate <br /> Blood
                    </h1>
                    <p className={styles.description}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                    </p>
                    <Link href="/donate">
                        <button className={styles.ctaButton}>
                            Get Blood Now
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
