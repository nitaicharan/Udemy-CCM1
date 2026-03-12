import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const mockGetDocs = vi.fn();
const mockAddDoc = vi.fn();
const mockCollection = vi.fn();
const mockServerTimestamp = vi.fn(() => "SERVER_TIMESTAMP");

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  serverTimestamp: () => mockServerTimestamp(),
  getFirestore: vi.fn(),
}));

vi.mock("@/lib/firebase", () => ({
  db: {},
}));

const mockUseUser = vi.fn();

vi.mock("@/lib/auth", () => ({
  useUser: () => mockUseUser(),
}));

import CreateHeistPage from "@/app/(dashboard)/heists/create/page";

const currentUser = {
  uid: "user-1",
  email: "me@test.com",
  displayName: "SilentFox",
};

const otherUsers = [
  { id: "user-2", codename: "SwiftEagle" },
  { id: "user-3", codename: "DarkOwl" },
];

function makeSnapshot(users: Array<{ id: string; codename: string }>) {
  return {
    docs: users.map((u) => ({
      id: u.id,
      data: () => ({ codename: u.codename }),
    })),
  };
}

async function fillAndSubmit(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Title"), "Steal the stapler");
  await user.type(
    screen.getByLabelText("Description"),
    "A classic first mission.",
  );
  await user.selectOptions(screen.getByLabelText("Assign To"), "SwiftEagle");
  await user.click(screen.getByRole("button", { name: "Create Heist" }));
}

describe("CreateHeistPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: currentUser, loading: false });
    mockGetDocs.mockResolvedValue(makeSnapshot(otherUsers));
    mockCollection.mockReturnValue({
      withConverter: vi.fn().mockReturnValue("collection-ref-with-converter"),
    });
    mockAddDoc.mockResolvedValue({ id: "new-heist-id" });
  });

  it("renders all form fields after users load", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Assign To")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Heist" }),
    ).toBeInTheDocument();
  });

  it("populates dropdown with other users (current user filtered out)", async () => {
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(screen.getByText("SwiftEagle")).toBeInTheDocument();
    });
    expect(screen.getByText("DarkOwl")).toBeInTheDocument();
    expect(screen.queryByText("SilentFox")).not.toBeInTheDocument();
  });

  it("shows empty state when no other users available", async () => {
    mockGetDocs.mockResolvedValue(makeSnapshot([]));
    render(<CreateHeistPage />);

    await waitFor(() => {
      expect(
        screen.getByText(/no other operatives available/i),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: "Create Heist" }),
    ).not.toBeInTheDocument();
  });

  it("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByLabelText("Title"));
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    expect(screen.getByText("Title is required")).toBeInTheDocument();
  });

  it("shows validation error when assignedTo is not selected", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByLabelText("Title"));
    await user.type(screen.getByLabelText("Title"), "Steal the stapler");
    await user.type(screen.getByLabelText("Description"), "Covert op.");
    await user.click(screen.getByRole("button", { name: "Create Heist" }));

    expect(
      screen.getByText("Please select a user to assign this heist to"),
    ).toBeInTheDocument();
  });

  it("calls addDoc with correct data and redirects on success", async () => {
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByLabelText("Title"));
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
    });

    const heistData = mockAddDoc.mock.calls[0][1];
    expect(heistData.title).toBe("Steal the stapler");
    expect(heistData.description).toBe("A classic first mission.");
    expect(heistData.createdBy).toBe("user-1");
    expect(heistData.createdByCodename).toBe("SilentFox");
    expect(heistData.assignedTo).toBe("user-2");
    expect(heistData.assignedToCodename).toBe("SwiftEagle");
    expect(heistData.finalStatus).toBeNull();
    expect(heistData.deadline).toBeInstanceOf(Date);
    expect(mockPush).toHaveBeenCalledWith("/heists");
  });

  it("shows loading state during submission", async () => {
    mockAddDoc.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByLabelText("Title"));
    await fillAndSubmit(user);

    expect(
      screen.getByRole("button", { name: "Creating Heist..." }),
    ).toBeDisabled();
  });

  it("shows error message when Firestore write fails", async () => {
    mockAddDoc.mockRejectedValue(new Error("Firestore error"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<CreateHeistPage />);

    await waitFor(() => screen.getByLabelText("Title"));
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to create heist. Please try again."),
      ).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });
});
