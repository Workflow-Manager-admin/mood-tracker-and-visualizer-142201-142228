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
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "happy" } });
    fireEvent.change(screen.getByTestId("mood-note-input"), { target: { value: "hello" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    expect(screen.queryByText(/added/i)).toBeInTheDocument();
  });

  it("renders 'update mood' if mood exists for today", () => {
    setup();
    // Add mood for today first
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "sad" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // re-render for update
    render(
      <MoodProvider>
        <MoodInputForm />
      </MoodProvider>
    );
    expect(
      screen.getByTestId("submit-mood-btn")
    ).toBeInTheDocument();
    expect(screen.getByTestId("submit-mood-btn")).toHaveTextContent(/update mood/i);
  });

  it("does not submit if mood not selected", () => {
    setup();
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Feedback only shown on success, so not found
    expect(screen.queryByText(/added/i)).not.toBeInTheDocument();
  });
});
