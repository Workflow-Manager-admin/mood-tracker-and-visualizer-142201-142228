import React from "react";
import { useMood } from "../contexts/MoodContext";
import { Card } from "./UI";
import { getMoodMeta } from "../utils/moodUtils";

/**
 * PUBLIC_INTERFACE
 * Displays stats: total moods, streak, most common mood.
 */
export default function MoodOverview() {
  const { moods } = useMood();

  // Streak logic
  // See how many consecutive days (up to today) a mood entry was recorded
  const streak = (() => {
    let streakCount = 0;
    const moodDates = new Set(moods.map(m => m.date));
    let date = new Date();
    while (moodDates.has(date.toISOString().slice(0, 10))) {
      streakCount++;
      date.setDate(date.getDate() - 1);
    }
    return streakCount;
  })();

  const moodFreq = {};
  moods.forEach(m => {
    moodFreq[m.mood] = (moodFreq[m.mood] || 0) + 1;
  });
  const freqMood = Object.keys(moodFreq).sort((a, b) => moodFreq[b] - moodFreq[a])[0];
  const { label: freqLabel, color: freqColor } = getMoodMeta(freqMood);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Card style={{ minWidth: 180, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 19, color: "#6C63FF" }}>
          {moods.length}
        </div>
        <div style={{ color: "#757575", fontWeight: 500 }}>
          Total Mood Entries
        </div>
      </Card>
      <Card style={{ minWidth: 180, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 19, color: "#43E97B" }}>
          {streak} {streak === 1 ? "day" : "days"}
        </div>
        <div style={{ color: "#757575", fontWeight: 500 }}>
          Current Streak
        </div>
      </Card>
      <Card style={{ minWidth: 180, textAlign: "center" }}>
        <div style={{ fontWeight: 700, fontSize: 19, color: freqColor }}>
          {freqLabel}
        </div>
        <div style={{ color: "#757575", fontWeight: 500 }}>
          Most Frequent
        </div>
      </Card>
    </div>
  );
}
