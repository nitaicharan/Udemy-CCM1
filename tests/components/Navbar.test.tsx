import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

const mockSignOut = vi.fn();

vi.mock("firebase/auth", () => ({
  signOut: (...args: unknown[]) => mockSignOut(...args),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

import Navbar from "@/components/Navbar";
import { AuthContext } from "@/lib/auth/AuthContext";
import type { AuthContextValue } from "@/lib/auth/types";

function renderWithAuth(value: AuthContextValue) {
  return render(
    <AuthContext.Provider value={value}>
      <Navbar />
    </AuthContext.Provider>,
  );
}

const authenticatedUser = {
  uid: "abc123",
  email: "user@test.com",
  displayName: "SwiftCrimsonFalcon",
};

describe("Navbar", () => {
  it("renders the main heading", () => {
    renderWithAuth({ user: null, loading: false });
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the Create Heist link", () => {
    renderWithAuth({ user: null, loading: false });
    const createLink = screen.getByRole("link", { name: /create heist/i });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/heists/create");
  });

  it("does not show logout button when user is not authenticated", () => {
    renderWithAuth({ user: null, loading: false });
    expect(
      screen.queryByRole("button", { name: /logout/i }),
    ).not.toBeInTheDocument();
  });

  it("shows logout button when user is authenticated", () => {
    renderWithAuth({ user: authenticatedUser, loading: false });
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("calls signOut when logout button is clicked", async () => {
    mockSignOut.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithAuth({ user: authenticatedUser, loading: false });

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(mockSignOut).toHaveBeenCalledWith({});
  });

  it("logs error to console if signOut fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSignOut.mockRejectedValue(new Error("Network error"));
    const user = userEvent.setup();
    renderWithAuth({ user: authenticatedUser, loading: false });

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(consoleSpy).toHaveBeenCalledWith(
      "Logout failed:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
