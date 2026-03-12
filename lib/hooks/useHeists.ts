"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/auth";
import { heistConverter, type Heist } from "@/types/firestore/heist";
import { COLLECTIONS } from "@/types/firestore";
import { HeistFilter, UseHeistsReturn } from "./types";

function buildQuery(filter: HeistFilter, userId: string) {
  const baseCollection = collection(db, COLLECTIONS.HEISTS);

  switch (filter) {
    case "active":
      return query(
        baseCollection,
        where("assignedTo", "==", userId),
        where("deadline", ">", new Date()),
      ).withConverter(heistConverter);

    case "assigned":
      return query(
        baseCollection,
        where("createdBy", "==", userId),
        where("deadline", ">", new Date()),
      ).withConverter(heistConverter);

    case "expired":
      return query(
        baseCollection,
        where("deadline", "<", new Date()),
        where("finalStatus", "!=", null),
        orderBy("finalStatus"),
        orderBy("deadline", "desc"),
      ).withConverter(heistConverter);

    default:
      throw new Error(`Invalid filter: ${filter}`);
  }
}

export function useHeists(filter: HeistFilter): UseHeistsReturn {
  const { user } = useUser();
  const [heists, setHeists] = useState<Heist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setHeists([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = buildQuery(filter, user.uid);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setHeists(snapshot.docs.map((doc) => doc.data()));
        setLoading(false);
      },
      (err) => {
        console.error("Heists listener error:", err);
        setError("Failed to load heists");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [filter, user?.uid]);

  return { heists, loading, error };
}
