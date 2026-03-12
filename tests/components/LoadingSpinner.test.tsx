import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import LoadingSpinner from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders without errors", () => {
    render(<LoadingSpinner />);
  });

  it("displays an SVG icon", () => {
    render(<LoadingSpinner />);
    expect(document.querySelector("svg")).toBeInTheDocument();
  });

  it("renders icon with correct size", () => {
    render(<LoadingSpinner />);
    const svg = document.querySelector("svg");
    expect(svg).toHaveAttribute("width", "48");
    expect(svg).toHaveAttribute("height", "48");
  });
});
