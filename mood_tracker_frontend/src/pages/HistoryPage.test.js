import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HistoryPage from "./HistoryPage";
import { MoodProvider } from "../contexts/MoodContext";

function setup() {
  window.localStorage.clear();
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
    // Provide demo data
    window.localStorage.setItem(
      "moodtracker_moods",
      JSON.stringify([{ date: "2024-05-01", mood: "happy", note: "abc" }])
    );
    setup();
    expect(await screen.findByText(/mood list/i)).toBeInTheDocument();

    // Click edit using testid, edit, save using testids
    fireEvent.click(screen.getByTestId("edit-btn-2024-05-01"));
    fireEvent.change(await screen.findByTestId("edit-mood-select"), { target: { value: "sad" } });
    fireEvent.change(screen.getByTestId("edit-note-input"), { target: { value: "newnote" } });
    fireEvent.click(screen.getByTestId("save-btn"));

    // Wait for saved feedback
    expect(await screen.findByText(/saved/i)).toBeInTheDocument();
  });

  it("cancel button exits edit form", async () => {
    window.localStorage.setItem(
      "moodtracker_moods",
      JSON.stringify([{ date: "2024-05-01", mood: "calm", note: "" }])
    );
    setup();
    fireEvent.click(screen.getByTestId("edit-btn-2024-05-01"));
    fireEvent.click(await screen.findByTestId("cancel-btn"));
    await waitFor(() => {
      expect(screen.queryByText(/edit mood for/i)).not.toBeInTheDocument();
    });
  });

  it("renders no moods gracefully", async () => {
    setup();
    expect(await screen.findByText(/mood history/i)).toBeInTheDocument();
  });
});
