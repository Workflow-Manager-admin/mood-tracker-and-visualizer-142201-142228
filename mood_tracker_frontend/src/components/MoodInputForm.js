import React, { useState } from "react";
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

  const prev = getMoodByDate(today);
  const [mood, setMood] = useState(prev ? prev.mood : "");
  const [note, setNote] = useState(prev ? prev.note : "");
  const [success, setSuccess] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (!mood) return;
    if (prev) {
      editMood(today, { mood, note });
    } else {
      addMood({ date: today, mood, note });
    }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 1800);
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
      />
      <Input
        type="text"
        placeholder="Add a note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
      />
      <Button type="submit" style={{ marginTop: 10, width: "100%" }}>
        {prev ? "Update Mood" : "Add Mood"}
      </Button>
      {success && (
        <div style={{ color: "#43E97B", fontSize: 13, marginTop: 5, textAlign: "center" }}>
          {prev ? "Mood updated!" : "Mood added!"}
        </div>
      )}
    </form>
  );
}
