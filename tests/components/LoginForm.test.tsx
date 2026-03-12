import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";

const mockSignIn = vi.fn();

vi.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: (...args: unknown[]) => mockSignIn(...args),
  getAuth: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), "test@example.com");
  await user.type(screen.getByLabelText("Password"), "secret123");
  await user.click(screen.getByRole("button", { name: "Log In" }));
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignIn.mockResolvedValue({ user: { uid: "abc123" } });
  });

  it("renders all form fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  it("renders heading with correct text", () => {
    render(<LoginForm />);
    expect(
      screen.getByRole("heading", { name: /log in to your account/i }),
    ).toBeInTheDocument();
  });

  it("has link to signup page", () => {
    render(<LoginForm />);
    const link = screen.getByRole("link", { name: /sign up/i });
    expect(link).toHaveAttribute("href", "/signup");
  });

  it("calls signInWithEmailAndPassword and shows success message", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "secret123",
      );
    });
    expect(screen.getByText("Login successful")).toBeInTheDocument();
  });

  it("shows error message for invalid credentials", async () => {
    mockSignIn.mockRejectedValue({ code: "auth/invalid-credential" });
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText("Invalid email or password. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during login", async () => {
    mockSignIn.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<LoginForm />);

    await fillAndSubmit(user);

    expect(
      screen.getByRole("button", { name: "Logging In..." }),
    ).toBeDisabled();
  });
});
