import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AuthContext } from "@/lib/auth/AuthContext";
import { useUser } from "@/lib/auth/useUser";
import type { AuthContextValue } from "@/lib/auth/types";

function TestConsumer() {
  const { user, loading } = useUser();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : "null"}</span>
    </div>
  );
}

function renderWithAuth(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <TestConsumer />
    </AuthContext.Provider>,
  );
}

describe("useUser", () => {
  it("returns null when user is not authenticated", () => {
    renderWithAuth({ user: null, loading: false });

    expect(screen.getByTestId("user")).toHaveTextContent("null");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("returns user object when user is authenticated", () => {
    renderWithAuth({
      user: { uid: "123", email: "test@example.com", displayName: "Test" },
      loading: false,
    });

    expect(screen.getByTestId("user")).toHaveTextContent("test@example.com");
  });

  it("returns loading state during initialization", () => {
    renderWithAuth({ user: null, loading: true });

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("throws error when used outside AuthProvider", () => {
    expect(() => render(<TestConsumer />)).toThrow(
      "useUser must be used within AuthProvider",
    );
  });
});
