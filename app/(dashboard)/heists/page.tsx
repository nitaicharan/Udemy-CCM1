"use client";

import { useHeists } from "@/lib/hooks";
import HeistCard, { HeistCardSkeleton } from "@/components/HeistCard";
import type { Heist } from "@/types/firestore/heist";
import styles from "./page.module.css";

function HeistGrid({
  loading,
  error,
  heists,
  emptyMessage,
}: {
  loading: boolean;
  error: string | null;
  heists: Heist[];
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <div className={styles.grid}>
        <HeistCardSkeleton />
        <HeistCardSkeleton />
        <HeistCardSkeleton />
      </div>
    );
  }
  if (error) {
    return <p className={styles.errorMessage}>{error}</p>;
  }
  if (heists.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>;
  }
  return (
    <div className={styles.grid}>
      {heists.map((heist) => (
        <HeistCard key={heist.id} heist={heist} />
      ))}
    </div>
  );
}

export default function HeistsPage() {
  const {
    heists: activeHeists,
    loading: activeLoading,
    error: activeError,
  } = useHeists("active");
  const {
    heists: assignedHeists,
    loading: assignedLoading,
    error: assignedError,
  } = useHeists("assigned");
  const {
    heists: expiredHeists,
    loading: expiredLoading,
    error: expiredError,
  } = useHeists("expired");

  return (
    <div className="page-content">
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Active Heists</h2>
        <HeistGrid
          loading={activeLoading}
          error={activeError}
          heists={activeHeists}
          emptyMessage="No active heists assigned to you"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Heists You&apos;ve Assigned</h2>
        <HeistGrid
          loading={assignedLoading}
          error={assignedError}
          heists={assignedHeists}
          emptyMessage="No heists you've assigned"
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>All Expired Heists</h2>
        {expiredLoading && <p className={styles.emptyState}>Loading...</p>}
        {expiredError && <p className={styles.errorMessage}>{expiredError}</p>}
        {!expiredLoading && !expiredError && expiredHeists.length === 0 && (
          <p className={styles.emptyState}>No expired heists</p>
        )}
        {!expiredLoading &&
          !expiredError &&
          expiredHeists.map((heist) => <div key={heist.id}>{heist.title}</div>)}
      </section>
    </div>
  );
}
