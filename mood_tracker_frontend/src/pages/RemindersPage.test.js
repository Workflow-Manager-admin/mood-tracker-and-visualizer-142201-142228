import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RemindersPage from "./RemindersPage";

// Utility: normalize a color string to hex (for style attribute assertions)
function normalizeColor(colorString) {
  // Accept hex with/without hash or rgb/rgba
  if (!colorString) return "";
  if (colorString.startsWith("#")) {
    return colorString.toUpperCase();
  } else if (colorString.startsWith("rgb")) {
    // convert rgb(x, y, z) to hex
    const rgb = colorString
      .replace(/[^\d,]/g, "")
      .split(",")
      .map(Number);
    if (rgb.length >= 3) {
      return (
        "#" +
        rgb
          .slice(0, 3)
          .map((v) => v.toString(16).padStart(2, "0"))
          .join("")
          .toUpperCase()
      );
    }
  }
  return colorString;
}

describe("RemindersPage", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders and toggles reminder", () => {
    render(<RemindersPage />);
    expect(screen.getByText(/daily reminder/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    // Check that the color style of Enable Reminder is updated to primary
    const enableLabel = screen.getByText(/enable reminder/i);
    const color = enableLabel.style.color || window.getComputedStyle(enableLabel).color;
    const norm = normalizeColor(color);
    expect(norm === "#6C63FF" || color.includes("108") || /6C63FF/i.test(color)).toBe(true);
    // Save state
    expect(JSON.parse(window.localStorage.getItem("moodtracker_reminder"))).toBeTruthy();
  });

  it("sets and updates reminder time", () => {
    render(<RemindersPage />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByLabelText(/reminder time/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/reminder time/i), { target: { value: "15:40" } });
    const rem = JSON.parse(window.localStorage.getItem("moodtracker_reminder"));
    expect(rem.time).toBe("15:40");
    expect(rem.enabled).toBe(true);
  });

  it("shows Reminders off if not enabled", () => {
    render(<RemindersPage />);
    expect(screen.getByRole("button", { name: /reminders off/i })).toBeInTheDocument();
  });
});
