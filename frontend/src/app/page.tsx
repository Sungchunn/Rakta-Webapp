import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Rakta</h1>
        <p className={styles.subtitle}>
          Join the movement. Save lives. Feel proud.
        </p>
        <div className={styles.ctaGroup}>
          <Link href="/auth/register" className="btn btn-primary">
            Start Your Journey
          </Link>
          <Link href="/locations" className="btn btn-secondary">
            Find a Center
          </Link>
        </div>
      </div>
    </section>
  );
}
