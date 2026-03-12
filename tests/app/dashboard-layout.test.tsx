import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

const mockRedirect = vi.fn();

vi.mock("next/navigation", () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

const mockSignOut = vi.fn();

vi.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

import { beforeEach } from "vitest";
import DashboardLayout from "@/app/(dashboard)/layout";
import { AuthContext } from "@/lib/auth/AuthContext";
import type { AuthContextValue } from "@/lib/auth/types";

function renderWithAuth(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <DashboardLayout>
        <div>dashboard content</div>
      </DashboardLayout>
    </AuthContext.Provider>,
  );
}

const authenticatedUser = {
  uid: "abc123",
  email: "user@test.com",
  displayName: "SwiftCrimsonFalcon",
};

describe("Dashboard layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows spinner while loading", () => {
    renderWithAuth({ user: null, loading: true });
    expect(document.querySelector("svg")).toBeInTheDocument();
    expect(screen.queryByText("dashboard content")).not.toBeInTheDocument();
  });

  it("renders Navbar and children when authenticated", () => {
    renderWithAuth({ user: authenticatedUser, loading: false });
    expect(screen.getByText("dashboard content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /login", async () => {
    renderWithAuth({ user: null, loading: false });
    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith("/login");
    });
  });

  it("does not redirect while loading", () => {
    renderWithAuth({ user: null, loading: true });
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
