import React, { useState, useEffect } from "react";
import { useMood } from "../contexts/MoodContext";
import { Button, Select, Input } from "./UI";
import { MOOD_TYPES } from "../utils/moodUtils";

/**
 * PUBLIC_INTERFACE
 * Mood input form (add or edit today's mood).
 */
export default function MoodInputForm() {
  const today = new Date().toISOString().slice(0, 10);
  const { addMood, getMoodByDate, editMood } = useMood();

  // Use prevEntry to track if mood exists for today (controls button label)
  const [prevEntry, setPrevEntry] = useState(() => getMoodByDate(today));
  const [mood, setMood] = useState(prevEntry ? prevEntry.mood : "");
  const [note, setNote] = useState(prevEntry ? prevEntry.note : "");
  const [successMsg, setSuccessMsg] = useState("");

  // Synchronize form state and prevEntry as mood data changes
  useEffect(() => {
    const todayMood = getMoodByDate(today);
    setPrevEntry(todayMood);
    if (todayMood) {
      setMood(todayMood.mood);
      setNote(todayMood.note);
    }
  // Only update if mood or date changes, ignore unnecessary deps
    // eslint-disable-next-line
  }, [getMoodByDate, today]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!mood) return;
    const latest = getMoodByDate(today);
    if (latest) {
      // If mood or note differs, update;
      // Always allow update to trigger for test/UX even if they're same
      editMood(today, { mood, note });
      setSuccessMsg("Mood updated!");
    } else {
      addMood({ date: today, mood, note });
      setSuccessMsg("Mood added!");
    }
    setTimeout(() => setSuccessMsg(""), 2500);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 10, color: "#6C63FF" }}>
        How do you feel today?
      </div>
      <Select
        options={MOOD_TYPES}
        value={mood}
        onChange={e => setMood(e.target.value)}
        required
        data-testid="mood-select"
      />
      <Input
        type="text"
        placeholder="Add a note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        data-testid="mood-note-input"
      />
      <Button
        type="submit"
        style={{ marginTop: 10, width: "100%" }}
        data-testid="submit-mood-btn"
      >
        {getMoodByDate(today) ? "Update Mood" : "Add Mood"}
      </Button>
      {successMsg && (
        <div
          data-testid="mood-feedback"
          style={{ color: "#43E97B", fontSize: 13, marginTop: 5, textAlign: "center" }}
        >
          {successMsg}
        </div>
      )}
    </form>
  );
}
