import styles from "./HeistCard.module.css";

export default function HeistCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonLine} style={{ width: "75%" }} />
      <div className={styles.skeletonLine} style={{ width: "60%" }} />
      <div className={styles.skeletonLine} style={{ width: "55%" }} />
      <div className={styles.skeletonLine} style={{ width: "40%" }} />
      <div
        className={styles.skeletonLine}
        style={{ width: "50%", marginTop: "auto" }}
      />
    </div>
  );
}
