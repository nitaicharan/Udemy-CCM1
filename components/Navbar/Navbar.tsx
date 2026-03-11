"use client";

import { Clock8, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUser } from "@/lib/auth/useUser";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { user } = useUser();

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          {user && (
            <li>
              <button onClick={handleLogout} className="btn">
                <LogOut size={18} strokeWidth={2.5} />
                Logout
              </button>
            </li>
          )}
          <li>
            <Link href="/heists/create" className="btn">
              Create Heist
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
