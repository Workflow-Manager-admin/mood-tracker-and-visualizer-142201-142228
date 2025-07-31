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
    // Wait for feedback to appear
    expect(await screen.findByText(/added/i)).toBeInTheDocument();
  });

  it("renders 'update mood' if mood exists for today", async () => {
    setup();
    // Add mood for today first
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "sad" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Wait for state/save to complete
    await waitFor(() => expect(screen.getByText(/updated/i)).toBeInTheDocument());

    // re-render for update
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
    // Feedback only shown on success, so should NOT find it
    await waitFor(
      () => {
        expect(screen.queryByText(/added/i)).not.toBeInTheDocument();
      },
      { timeout: 800 } // shorter than form's setTimeout(1800), quick failure expected
    );
  });
});
