"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { generateCodename } from "@/lib/utils/codename";
import Input from "@/components/Input";
import PasswordInput from "@/components/PasswordInput";
import Button from "@/components/Button";
import styles from "./SignupForm.module.css";

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please log in instead.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    default:
      return "An error occurred during signup. Please try again.";
  }
}

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const codename = generateCodename();

      await updateProfile(user, { displayName: codename });

      try {
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          codename: codename,
        });
      } catch (firestoreError) {
        console.error("Failed to create user document:", firestoreError);
      }

      router.push("/heists");
    } catch (err: any) {
      setError(getErrorMessage(err.code));
      setLoading(false);
    }
  }

  return (
    <div className={styles.form}>
      <h2 className="form-title">Sign Up for an Account</h2>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          required
          disabled={loading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          disabled={loading}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
      <p className={styles.switchText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.switchLink}>
          Log in
        </Link>
      </p>
    </div>
  );
}
