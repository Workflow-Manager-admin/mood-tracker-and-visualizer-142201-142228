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

  it("after adding mood for today, re-submitting triggers 'Mood updated!'", async () => {
    setup();
    // Submit today's mood (adds)
    fireEvent.change(screen.getByTestId("mood-select"), { target: { value: "sad" } });
    fireEvent.change(screen.getByTestId("mood-note-input"), { target: { value: "test" } });
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    // Wait for add confirmation
    const fbAdd = await screen.findByTestId("mood-feedback");
    expect(fbAdd.textContent).toBe("Mood added!");

    // Immediately submit again (should update and show updated message)
    fireEvent.click(screen.getByTestId("submit-mood-btn"));
    const fbUpdate = await screen.findByTestId("mood-feedback");
    expect(fbUpdate.textContent).toBe("Mood updated!");

    // Unmount previous render to avoid multiple forms in DOM
    // eslint-disable-next-line testing-library/no-unnecessary-act
    const { unmount, container } = render(
      <MoodProvider>
        <MoodInputForm />
      </MoodProvider>
    );
    // Now only one form (and one submit-mood-btn) present
    const btns = screen.getAllByTestId("submit-mood-btn");
    expect(btns.length).toBe(1);
    expect(btns[0]).toBeInTheDocument();
    expect(btns[0]).toHaveTextContent(/update mood/i);
    unmount();
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
