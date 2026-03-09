import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PasswordInput from "@/components/PasswordInput";

describe("PasswordInput", () => {
  const defaultProps = {
    id: "password",
    name: "password",
    label: "Password",
    value: "",
    onChange: () => {},
  };

  it("renders password field masked by default", () => {
    render(<PasswordInput {...defaultProps} />);
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("toggles to visible when show button is clicked", () => {
    render(<PasswordInput {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /show password/i }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
  });

  it("toggles back to hidden when hide button is clicked", () => {
    render(<PasswordInput {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /show password/i }));
    fireEvent.click(screen.getByRole("button", { name: /hide password/i }));
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
