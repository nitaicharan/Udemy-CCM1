import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { User as FirebaseUser } from "firebase/auth";

let authCallback: (user: FirebaseUser | null) => void;
const unsubscribeMock = vi.fn();

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    authCallback = callback;
    return unsubscribeMock;
  }),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

import { AuthProvider } from "@/lib/auth/AuthContext";
import { useUser } from "@/lib/auth/useUser";

function TestConsumer() {
  const { user, loading } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children successfully", () => {
    render(
      <AuthProvider>
        <span>child content</span>
      </AuthProvider>,
    );

    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("has initial loading state of true", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("sets loading to false after Firebase initializes", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    act(() => {
      authCallback(null);
    });

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("updates user state when Firebase auth state changes", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    act(() => {
      authCallback({
        uid: "abc",
        email: "user@test.com",
        displayName: "User",
      } as FirebaseUser);
    });

    expect(screen.getByTestId("user")).toHaveTextContent("user@test.com");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });
});
