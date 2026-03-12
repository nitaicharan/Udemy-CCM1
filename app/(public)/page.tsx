import Link from "next/link";
import { Clock8 } from "lucide-react";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div
          className={styles.corner + " " + styles.cornerTL}
          aria-hidden="true"
        />
        <div
          className={styles.corner + " " + styles.cornerBR}
          aria-hidden="true"
        />

        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          Operatives Wanted
        </div>

        <h1 className={styles.title}>
          P<Clock8 className="logo" strokeWidth={2.75} />
          cket Heist
        </h1>

        <p className={styles.tagline}>Perfectly petty.</p>

        <p className={styles.description}>
          The game where stealth meets spreadsheets. Complete covert
          micro-missions, outsmart your colleagues, and rise through the ranks
          of the most daring office operatives in the building. No experience
          required. Plausible deniability recommended.
        </p>

        <div className={styles.actions}>
          <Link href="/signup" className={styles.registerBtn}>
            Become an Operative
          </Link>
          <Link href="/login" className={styles.loginLink}>
            Already enlisted? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
