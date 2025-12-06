import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
    return (
        <section className={styles.heroSection}>
            {/* Blood Carpet Shape */}
            <div className={styles.bloodCarpet}>
                <svg viewBox="0 0 800 1000" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                    <path
                        d="M0 0 H 600 Q 600 200 800 600 C 800 900 400 900 0 1000 V 0 Z"
                        fill="#8B0025"
                    />
                    {/* Refined curve to match the image which swoops right and then back leftish? 
                        Actually image shape:
                        Starts top left (full width?) -> NO, starts top left, goes to about 30% width?
                        Let's look at image 2:
                        It comes from top left corner, covers top left triangle basically.
                        It curves OUT to the right. 
                        Let's try a simpler curve.
                     */}
                    <path
                        d="M0 0 H 200 Q 500 400 800 800 V 1000 H 0 V 0"
                        fill="var(--blood-red)"
                        style={{ display: 'none' }} // hide for now, using the path below
                    />
                    {/* Better approximation of the "Blob" */}
                    <path
                        d="M0 0 L 400 0 C 600 300 800 600 600 1000 H 0 V 0 Z"
                        fill="var(--blood-red)"
                    />
                </svg>
            </div>
            {/* Texture overlay for subtle grain if desired, but image is clean. Removing for now to be safe. */}

            <div className={styles.heroContent}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>
                        Save Life <br /> Donate <br /> Blood
                    </h1>
                    <p className={styles.description}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
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
