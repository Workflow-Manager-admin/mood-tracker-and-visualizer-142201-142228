import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RemindersPage from "./RemindersPage";

describe("RemindersPage", () => {
  beforeEach(() => window.localStorage.clear());

  it("renders and toggles reminder", () => {
    render(<RemindersPage />);
    expect(screen.getByText(/daily reminder/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByText(/enable reminder/i).style.color).toMatch(/6C63FF|#6C63FF/i);
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
