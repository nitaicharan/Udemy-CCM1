import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

import { beforeEach } from "vitest";
import PublicLayout from "@/app/(public)/layout";
import { AuthContext } from "@/lib/auth/AuthContext";
import type { AuthContextValue } from "@/lib/auth/types";

function renderWithAuth(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <PublicLayout>
        <div>public content</div>
      </PublicLayout>
    </AuthContext.Provider>,
  );
}

const authenticatedUser = {
  uid: "abc123",
  email: "user@test.com",
  displayName: "SwiftCrimsonFalcon",
};

describe("Public layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows spinner while loading", () => {
    renderWithAuth({ user: null, loading: true });
    expect(document.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("public content")).not.toBeInTheDocument();
  });

  it("renders children when unauthenticated", () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByText("public content")).toBeInTheDocument();
  });

  it("redirects authenticated users to /heists", async () => {
    renderWithAuth({ user: authenticatedUser, loading: false });
    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith("/heists");
    });
  });

  it("does not redirect while loading", () => {
    renderWithAuth({ user: authenticatedUser, loading: true });
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
