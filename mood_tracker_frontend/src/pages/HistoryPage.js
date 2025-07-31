import React, { useState } from "react";
import { useMood } from "../contexts/MoodContext";
import { Card, Button, Select, Input } from "../components/UI";
import { getMoodMeta, MOOD_TYPES } from "../utils/moodUtils";

/**
 * PUBLIC_INTERFACE
 * History page: calendar of moods, mood list with edit-by-date.
 */
export default function HistoryPage() {
  const { moods, editMood, getMoodByDate } = useMood();
  const sortedMoods = Array.isArray(moods) ? [...moods].sort((a, b) => b.date.localeCompare(a.date)) : [];
  const [selected, setSelected] = useState(null);
  const selectedMood = selected ? getMoodByDate(selected) : null;

  // Edit mood handler
  const [editValue, setEditValue] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  function handleEdit(date) {
    if (!editValue) return;
    editMood(date, { mood: editValue, note: editNote });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 1200);
  }

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 21, marginBottom: 4, color: "#6C63FF" }}>
        Mood History
      </div>
      <div style={{ color: "#616161", marginBottom: 15 }}>Review and edit your mood records.</div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 22,
      }}>
        <Card style={{ flex: 1, minWidth: 310, maxWidth: 420 }}>
          <div style={{ fontWeight: 600, marginBottom: 10, color: "#282c34" }}>Mood List</div>
          <div>
            {sortedMoods.map((m) => {
              const meta = getMoodMeta(m.mood);
              return (
                <div key={m.date} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                  background: selected === m.date ? "#FFF7D6" : "#f8f9fa",
                  borderRadius: 7,
                  padding: "9px 11px",
                  borderLeft: `5px solid ${meta.color}`
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: meta.color }}>{meta.label}</div>
                    <div style={{ fontSize: 13, color: "#757575" }}>{m.date}</div>
                    {m.note && <div style={{ fontSize: 13, marginTop: 2, color: "#616161" }}>Note: {m.note}</div>}
                  </div>
                  <Button
                    data-testid={`edit-btn-${m.date}`}
                    onClick={() => {
                      setSelected(m.date);
                      setEditValue(m.mood);
                      setEditNote(m.note);
                    }}
                    style={{ background: "#FFD600", color: "#282c34", minWidth: 56 }}>
                    Edit
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>
        {selected && (
          <Card style={{ flex: 1, minWidth: 220, maxWidth: 310 }}>
            <div style={{ fontWeight: 500, color: "#282c34", marginBottom: 7 }}>
              Edit mood for <span style={{ color: "#6C63FF" }}>{selected}</span>
            </div>
            <Select
              data-testid="edit-mood-select"
              options={MOOD_TYPES}
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
            />
            <Input
              data-testid="edit-note-input"
              type="text"
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              placeholder="Note"
            />
            <Button
              data-testid="save-btn"
              onClick={() => handleEdit(selected)} style={{ marginTop: 8 }}>
              Save
            </Button>
            {editSuccess && <div style={{ color: "#43E97B", fontSize: 13, marginTop: 5 }}>Saved!</div>}
            <Button
              data-testid="cancel-btn"
              style={{ marginTop: 8, background: "#f4f4f4", color: "#757575" }}
              onClick={() => {
                setSelected(null);
                setEditValue("");
              }}
            >Cancel</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
