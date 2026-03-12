"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@/lib/auth/useUser";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading && user) {
      redirect("/heists");
    }
  }, [user, loading]);

  if (loading) return <LoadingSpinner />;
  if (user) return null;

  return <main className="public">{children}</main>;
}
