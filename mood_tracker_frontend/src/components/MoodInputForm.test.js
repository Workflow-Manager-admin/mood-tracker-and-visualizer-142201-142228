import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import MoodInputForm from "./MoodInputForm";
import { MoodProvider } from "../contexts/MoodContext";

// Utility to render with MoodProvider, returns {unmount, ...}
function customRender() {
  window.localStorage.clear();
  return render(
    <MoodProvider>
      <MoodInputForm />
    </MoodProvider>
  );
}

describe("MoodInputForm", () => {
  afterEach(() => {
    // Clean up DOM after each test to ensure isolation
    cleanup();
    window.localStorage.clear();
  });

  it("renders input and submits for add mood", async () => {
    const { unmount } = customRender();
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "happy" } });
    fireEvent.change(screen.getByTestId("mood-note-input"), { target: { value: "hello" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    const fb = await screen.findByTestId("mood-feedback");
    expect(fb).toBeInTheDocument();
    expect(fb.textContent).toBe("Mood added!");
    unmount();
  });

  it("after adding mood for today, re-submitting triggers 'Mood updated!'", async () => {
    // First render to add mood
    const { unmount: unmount1 } = customRender();
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "sad" } });
    fireEvent.change(screen.getByTestId("mood-note-input"), { target: { value: "test" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    const fbAdd = await screen.findByTestId("mood-feedback");
    expect(fbAdd.textContent).toBe("Mood added!");

    // Immediately submit again (should update and show updated message)
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    const fbUpdate = await screen.findByTestId("mood-feedback");
    expect(fbUpdate.textContent).toBe("Mood updated!");

    // Unmount before next render to guarantee 1 form in DOM
    unmount1();

    // Render a fresh form to verify only one exists, and context state is hydrated from localStorage
    const { unmount: unmount2 } = customRender();
    const btns = screen.getAllByTestId("submit-mood-btn");
    expect(btns.length).toBe(1);
    expect(btns[0]).toBeInTheDocument();
    // Confirm that after remount, if today's mood is stored, the form shows "Update Mood" (verifies rehydration)
    expect(btns[0]).toHaveTextContent(/update mood/i);
    unmount2();
  });

  it("does not submit if mood not selected", async () => {
    const { unmount } = customRender();
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    await waitFor(
      () => {
        expect(screen.queryByTestId("mood-feedback")).not.toBeInTheDocument();
      },
      { timeout: 800 }
    );
    unmount();
  });
});
