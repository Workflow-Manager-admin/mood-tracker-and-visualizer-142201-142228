import React from "react";
import { render, screen } from "@testing-library/react";
import MoodOverview from "./MoodOverview";
import { MoodContext } from "../contexts/MoodContext";

function customRender(moods) {
  return render(
    <MoodContext.Provider
      value={{ moods: moods || [{ date: "2024-06-01", mood: "happy", note: "" }], addMood: jest.fn(), editMood: jest.fn(), getMoodByDate: () => null }}
    >
      <MoodOverview />
    </MoodContext.Provider>
  );
}

describe("MoodOverview", () => {
  it("renders total entries, streak, and most frequent mood", () => {
    const moods = [
      { date: "2024-06-01", mood: "happy", note: "" },
      { date: "2024-06-02", mood: "happy", note: "" },
      { date: "2024-06-03", mood: "sad", note: "" },
    ];
    customRender(moods);
    expect(screen.getByText(/total mood entries/i)).toBeInTheDocument();
    expect(screen.getByText("Happy")).toBeInTheDocument(); // freq
    expect(screen.getByText(/Current Streak/i)).toBeInTheDocument();
  });

  it("displays correct streak for consecutive days", () => {
    // Today + yesterday
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayStr = today.toISOString().slice(0, 10);
    const yestStr = yesterday.toISOString().slice(0, 10);

    const moods = [
      { date: yestStr, mood: "happy" },
      { date: todayStr, mood: "sad" },
    ];
    customRender(moods);
    expect(screen.getByText(/2 days/i)).toBeInTheDocument();
  });

  it("handles no moods (edge case)", () => {
    customRender([]);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
