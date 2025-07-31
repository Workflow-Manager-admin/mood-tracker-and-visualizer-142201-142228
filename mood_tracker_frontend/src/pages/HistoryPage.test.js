import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryPage from "./HistoryPage";
import { MoodProvider } from "../contexts/MoodContext";

/**
 * Helper to init localStorage with a given moods array.
 * Also clears any pre-existing state before running each test.
 */
function renderWithInitialMoods(moodsArr) {
  window.localStorage.clear();
  if (moodsArr) {
    window.localStorage.setItem(
      "moodtracker_moods",
      JSON.stringify(moodsArr)
    );
  }
  return render(
    <MoodProvider>
      <HistoryPage />
    </MoodProvider>
  );
}

describe("HistoryPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders mood list and allows edit/save flow", async () => {
    // Fixture mood
    const moods = [{ date: "2024-05-10", mood: "happy", note: "abc" }];
    renderWithInitialMoods(moods);

    expect(await screen.findByText(/mood list/i)).toBeInTheDocument();

    // Click edit on the fixture entry
    fireEvent.click(screen.getByTestId("edit-btn-2024-05-10"));
    // Change mood
    fireEvent.change(await screen.findByTestId("edit-mood-select"), { target: { value: "sad" } });
    // Change note
    fireEvent.change(screen.getByTestId("edit-note-input"), { target: { value: "newnote" } });
    // Save
    fireEvent.click(screen.getByTestId("save-btn"));

    // Confirm save feedback
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();

    // Confirm localStorage updated correctly (optional: check mood value)
    const moodsAfter = JSON.parse(window.localStorage.getItem("moodtracker_moods"));
    expect(moodsAfter.find(m => m.date === "2024-05-10").mood).toBe("sad");
    expect(moodsAfter.find(m => m.date === "2024-05-10").note).toBe("newnote");
  });

  it("cancel button exits edit form", async () => {
    const moods = [{ date: "2024-05-10", mood: "calm", note: "x" }];
    renderWithInitialMoods(moods);

    fireEvent.click(screen.getByTestId("edit-btn-2024-05-10"));
    fireEvent.click(await screen.findByTestId("cancel-btn"));
    await waitFor(() => {
      expect(screen.queryByText(/edit mood for/i)).not.toBeInTheDocument();
    });
    // Also confirm edit select is gone
    expect(screen.queryByTestId("edit-mood-select")).not.toBeInTheDocument();
  });

  it("renders no moods gracefully", async () => {
    renderWithInitialMoods([]);
    expect(await screen.findByText(/mood history/i)).toBeInTheDocument();
    // Should not error and mood list should not crash
    expect(screen.getByText(/mood list/i)).toBeInTheDocument();
  });

  it("renders correct mood values for multiple fixtures and edits correct one", async () => {
    // Add two moods (confirm edit works for correct entry)
    const moods = [
      { date: "2024-05-20", mood: "anxious", note: "" },
      { date: "2024-05-21", mood: "happy", note: "test" }
    ];
    renderWithInitialMoods(moods);

    // Edit the second entry (2024-05-21)
    fireEvent.click(screen.getByTestId("edit-btn-2024-05-21"));
    fireEvent.change(await screen.findByTestId("edit-mood-select"), { target: { value: "energized" } });
    fireEvent.change(screen.getByTestId("edit-note-input"), { target: { value: "wow" } });
    fireEvent.click(screen.getByTestId("save-btn"));
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();

    // Confirm only the intended mood changed
    const moodsAfter = JSON.parse(window.localStorage.getItem("moodtracker_moods"));
    expect(moodsAfter.find(m => m.date === "2024-05-20").mood).toBe("anxious");
    expect(moodsAfter.find(m => m.date === "2024-05-21").mood).toBe("energized");
    expect(moodsAfter.find(m => m.date === "2024-05-21").note).toBe("wow");
  });
});
