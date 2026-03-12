"use client";

import { useHeists } from "@/lib/hooks";

function HeistSection({
  title,
  loading,
  error,
  heists,
  emptyMessage,
}: {
  title: string;
  loading: boolean;
  error: string | null;
  heists: Array<{ id: string; title: string }>;
  emptyMessage: string;
}) {
  return (
    <div>
      <h2>{title}</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && heists.length === 0 && <p>{emptyMessage}</p>}
      {!loading &&
        !error &&
        heists.map((heist) => <div key={heist.id}>{heist.title}</div>)}
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
      <div className="active-heists">
        <HeistSection
          title="Your Active Heists"
          loading={activeLoading}
          error={activeError}
          heists={activeHeists}
          emptyMessage="No active heists assigned to you"
        />
      </div>
      <div className="assigned-heists">
        <HeistSection
          title="Heists You've Assigned"
          loading={assignedLoading}
          error={assignedError}
          heists={assignedHeists}
          emptyMessage="You haven't assigned any heists yet"
        />
      </div>
      <div className="expired-heists">
        <HeistSection
          title="All Expired Heists"
          loading={expiredLoading}
          error={expiredError}
          heists={expiredHeists}
          emptyMessage="No expired heists"
        />
      </div>
    </div>
  );
}
