import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

  it("renders mood list and allows edit/save flow", () => {
    // Provide demo data
    window.localStorage.setItem(
      "moodtracker_moods",
      JSON.stringify([{ date: "2024-05-01", mood: "happy", note: "abc" }])
    );
    setup();
    expect(screen.getByText(/mood list/i)).toBeInTheDocument();

    // Click edit
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "sad" } });
    fireEvent.change(screen.getByPlaceholderText(/note/i), { target: { value: "newnote" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    expect(screen.getByText(/saved/i)).toBeInTheDocument();
  });

  it("cancel button exits edit form", () => {
    window.localStorage.setItem(
      "moodtracker_moods",
      JSON.stringify([{ date: "2024-05-01", mood: "calm", note: "" }])
    );
    setup();
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByText(/edit mood for/i)).not.toBeInTheDocument();
  });

  it("renders no moods gracefully", () => {
    setup();
    expect(screen.getByText(/mood history/i)).toBeInTheDocument();
  });
});
