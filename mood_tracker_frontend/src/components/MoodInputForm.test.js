import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("renders input and submits for add mood", async () => {
    setup();
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "happy" } });
    fireEvent.change(screen.getByTestId("mood-note-input"), { target: { value: "hello" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Wait for feedback with testid (reliably visible for at least 2.5s)
    const fb = await screen.findByTestId("mood-feedback");
    expect(fb).toBeInTheDocument();
    expect(fb.textContent).toBe("Mood added!");
  });

  it("renders 'update mood' if mood exists for today", async () => {
    setup();
    // Add mood for today first
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "sad" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Wait for state/save to complete and see update message
    const updateMsg = await screen.findByTestId("mood-feedback");
    expect(updateMsg.textContent).toBe("Mood updated!");

    // re-render for update scenario (button label should reflect state)
    render(
      <MoodProvider>
        <MoodInputForm />
      </MoodProvider>
    );
    // Button should show "Update Mood"
    const btn = await screen.findByTestId("submit-mood-btn");
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent(/update mood/i);
  });

  it("does not submit if mood not selected", async () => {
    setup();
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Feedback only shown on success, so should NOT find feedback
    await waitFor(
      () => {
        expect(screen.queryByTestId("mood-feedback")).not.toBeInTheDocument();
      },
      { timeout: 800 }
    );
  });
});
