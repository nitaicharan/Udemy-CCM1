import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Input from "@/components/Input";

describe("Input", () => {
  const defaultProps = {
    id: "email",
    name: "email",
    type: "email" as const,
    label: "Email",
    value: "",
    onChange: () => {},
  };

  it("renders with label", () => {
    render(<Input {...defaultProps} />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(<Input {...defaultProps} placeholder="Enter email" />);
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("accepts user input", () => {
    let value = "";
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      value = e.target.value;
    };
    render(<Input {...defaultProps} value={value} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    expect(value).toBe("test@example.com");
  });

  it("has required attribute when specified", () => {
    render(<Input {...defaultProps} required />);
    expect(screen.getByLabelText("Email")).toBeRequired();
  });

  it("has correct input type", () => {
    render(<Input {...defaultProps} type="email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
  });
});
