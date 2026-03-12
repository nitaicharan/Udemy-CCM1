"use client";

import { Clock8 } from "lucide-react";
import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={styles.overlay}>
      <Clock8 size={48} className={styles.icon} />
    </div>
  );
}
