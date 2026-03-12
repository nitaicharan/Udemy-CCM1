import Link from "next/link";
import { Clock, User, Users, Calendar } from "lucide-react";
import type { Heist } from "@/types/firestore/heist";
import styles from "./HeistCard.module.css";

function formatDeadline(deadline: Date): { text: string; isOverdue: boolean } {
  const now = new Date();
  if (now > deadline) {
    return { text: "Overdue", isOverdue: true };
  }
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 24) {
    return {
      text: `${diffHours} hour${diffHours !== 1 ? "s" : ""} left`,
      isOverdue: false,
    };
  }
  const diffDays = Math.floor(diffHours / 24);
  return {
    text: `${diffDays} day${diffDays !== 1 ? "s" : ""} left`,
    isOverdue: false,
  };
}

function formatTimestamp(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HeistCard({ heist }: { heist: Heist }) {
  const deadline = formatDeadline(heist.deadline);

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <Clock size={20} className={styles.clockIcon} />
      </div>

      <div className={styles.meta}>
        <div className={styles.assigneeRow}>
          <User size={16} />
          <span>To:</span>
          <span className={styles.usernamePrimary}>
            {heist.assignedToCodename}
          </span>
        </div>
        <div className={styles.assigneeRow}>
          <Users size={16} />
          <span>By:</span>
          <span className={styles.usernameSecondary}>
            {heist.createdByCodename}
          </span>
        </div>
      </div>

      <div
        className={
          deadline.isOverdue ? styles.deadlineOverdue : styles.deadlineNormal
        }
      >
        <Calendar size={16} />
        <span>{deadline.text}</span>
      </div>

      <div className={styles.timestamp}>
        <Calendar size={16} />
        <span>{formatTimestamp(heist.createdAt)}</span>
      </div>
    </div>
  );
}
