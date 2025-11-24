import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Be the <span className={styles.highlight}>Hero</span> in Someone's Story
        </h1>
        <p className={styles.subtitle}>
          Join the community of proud blood donors. Track your impact, stay healthy, and save lives.
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
    </div>
  );
}
