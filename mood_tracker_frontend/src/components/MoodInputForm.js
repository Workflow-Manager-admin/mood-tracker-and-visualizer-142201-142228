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

  // Always derive current today's mood directly from context
  const todayEntry = getMoodByDate(today);

  // Form state: mood/note, initialized from today's mood if present, but always update on entry presence change
  const [mood, setMood] = useState(todayEntry ? todayEntry.mood : "");
  const [note, setNote] = useState(todayEntry ? todayEntry.note : "");
  const [successMsg, setSuccessMsg] = useState("");

  // Rehydrate form state if todayEntry changes (so after context/localStorage hydration or remounts)
  useEffect(() => {
    if (todayEntry) {
      setMood(todayEntry.mood);
      setNote(todayEntry.note);
    } else {
      setMood("");
      setNote("");
    }
    // eslint-disable-next-line
  }, [todayEntry && todayEntry.mood, todayEntry && todayEntry.note, today]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!mood) return;
    const latest = getMoodByDate(today);
    if (latest) {
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
