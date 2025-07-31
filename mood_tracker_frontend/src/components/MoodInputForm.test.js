import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MoodInputForm from "./MoodInputForm";
import { MoodProvider } from "../contexts/MoodContext";

// Render with real MoodProvider (localStorage-based demo data logic)
function setup() {
  window.localStorage.clear();
  return render(
    <MoodProvider>
      <MoodInputForm />
    </MoodProvider>
  );
}

describe("MoodInputForm", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders input and submits for add mood", () => {
    setup();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "happy" } });
    fireEvent.change(screen.getByPlaceholderText(/note/i), { target: { value: "hello" } });
    fireEvent.click(screen.getByRole("button", { name: /add mood/i }));
    expect(screen.queryByText(/added/i)).toBeInTheDocument();
  });

  it("renders 'update mood' if mood exists for today", () => {
    setup();
    // Add mood for today first
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "sad" } });
    fireEvent.click(screen.getByRole("button", { name: /add mood/i }));
    // re-render for update
    render(
      <MoodProvider>
        <MoodInputForm />
      </MoodProvider>
    );
    expect(
      screen.getByRole("button", { name: /update mood/i })
    ).toBeInTheDocument();
  });

  it("does not submit if mood not selected", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: /add mood/i }));
    // Feedback only shown on success, so not found
    expect(screen.queryByText(/added/i)).not.toBeInTheDocument();
  });
});
