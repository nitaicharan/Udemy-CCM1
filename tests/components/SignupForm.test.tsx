import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import SignupForm from "@/components/SignupForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockCreateUser = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUser(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
  getAuth: vi.fn(),
}));

const mockSetDoc = vi.fn();

vi.mock("firebase/firestore", () => ({
  doc: vi.fn(() => "mock-doc-ref"),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  auth: {},
  db: {},
}));

vi.mock("@/lib/utils/codename", () => ({
  generateCodename: () => "SwiftCrimsonFalcon",
}));

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Email"), "new@example.com");
  await user.type(screen.getByLabelText("Password"), "mypassword");
  await user.click(screen.getByRole("button", { name: "Sign Up" }));
}

describe("SignupForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateUser.mockResolvedValue({
      user: { uid: "abc123", email: "new@example.com", displayName: null },
    });
    mockUpdateProfile.mockResolvedValue(undefined);
    mockSetDoc.mockResolvedValue(undefined);
  });

  it("renders all form fields", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign Up" })).toBeInTheDocument();
  });

  it("renders heading with correct text", () => {
    render(<SignupForm />);
    expect(
      screen.getByRole("heading", { name: /sign up for an account/i }),
    ).toBeInTheDocument();
  });

  it("has link to login page", () => {
    render(<SignupForm />);
    const link = screen.getByRole("link", { name: /log in/i });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("calls Firebase and navigates on successful signup", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith(
        {},
        "new@example.com",
        "mypassword",
      );
    });
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      { uid: "abc123", email: "new@example.com", displayName: null },
      { displayName: "SwiftCrimsonFalcon" },
    );
    expect(mockSetDoc).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/heists");
  });

  it("displays error for email-already-in-use", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/email-already-in-use" });
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText(
          "This email is already registered. Please log in instead.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("displays error for weak-password", async () => {
    mockCreateUser.mockRejectedValue({ code: "auth/weak-password" });
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText("Password should be at least 6 characters long."),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during signup", async () => {
    mockCreateUser.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    expect(
      screen.getByRole("button", { name: "Creating Account..." }),
    ).toBeDisabled();
  });

  it("continues to navigation even if Firestore write fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSetDoc.mockRejectedValue(new Error("Firestore error"));
    const user = userEvent.setup();
    render(<SignupForm />);

    await fillAndSubmit(user);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/heists");
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to create user document:",
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });
});
