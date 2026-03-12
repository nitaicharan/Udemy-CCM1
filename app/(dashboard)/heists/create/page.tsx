"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import { type CreateHeistInput, heistConverter } from "@/types/firestore/heist";
import Input from "@/components/Input";
import Button from "@/components/Button";
import styles from "./page.module.css";

export default function CreateHeistPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedToCodename, setAssignedToCodename] = useState("");
  const [users, setUsers] = useState<Array<{ id: string; codename: string }>>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const usersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          codename: doc.data().codename as string,
        }));
        setUsers(usersList.filter((u) => u.id !== user?.uid));
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setUsersLoading(false);
      }
    }

    fetchUsers();
  }, [user?.uid]);

  function validateForm(): boolean {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!assignedTo) {
      setError("Please select a user to assign this heist to");
      return false;
    }
    return true;
  }

  function handleAssignedToChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedUserId = e.target.value;
    setAssignedTo(selectedUserId);
    const selectedUser = users.find((u) => u.id === selectedUserId);
    if (selectedUser) {
      setAssignedToCodename(selectedUser.codename);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!validateForm() || !user) return;

    setLoading(true);

    try {
      const deadline = new Date();
      deadline.setHours(deadline.getHours() + 48);

      const heistData: CreateHeistInput = {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdByCodename: user.displayName || "Unknown",
        assignedTo,
        assignedToCodename,
        createdAt: serverTimestamp(),
        deadline,
        finalStatus: null,
      };

      await addDoc(
        collection(db, "heists").withConverter(heistConverter),
        heistData,
      );

      router.push("/heists");
    } catch (err) {
      console.error("Failed to create heist:", err);
      setError("Failed to create heist. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Create a New Heist</h2>

        {usersLoading ? null : users.length === 0 ? (
          <div className={styles.emptyState}>
            No other operatives available to assign a heist to.
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {error && <div className={styles.error}>{error}</div>}

            <Input
              id="title"
              name="title"
              type="text"
              label="Title"
              required
              disabled={loading}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className={styles.textarea}
                disabled={loading}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="assignedTo">
                Assign To
              </label>
              <select
                id="assignedTo"
                name="assignedTo"
                className={styles.select}
                disabled={loading}
                value={assignedTo}
                onChange={handleAssignedToChange}
              >
                <option value="">Select an operative...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.codename}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Creating Heist..." : "Create Heist"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
