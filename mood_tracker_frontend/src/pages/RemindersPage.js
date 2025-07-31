import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Input } from "../components/UI";
import { COLORS } from "../constants/theme";

/**
 * PUBLIC_INTERFACE
 * Reminders page — Daily record reminder toggling (local).
 */
export default function RemindersPage() {
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState("09:00");

  // Load from localStorage once at mount
  useEffect(() => {
    const rjson = localStorage.getItem("moodtracker_reminder");
    if (rjson) {
      try {
        const { enabled: e, time: t } = JSON.parse(rjson);
        setEnabled(Boolean(e));
        setTime(typeof t === "string" ? t : "09:00");
      } catch { /* ignore malformed json */ }
    }
  }, []);

  // Persist changes to localStorage whenever enabled or time changes
  useEffect(() => {
    localStorage.setItem("moodtracker_reminder", JSON.stringify({ enabled, time }));
  }, [enabled, time]);

  // Handlers
  const handleEnableChange = useCallback((e) => {
    setEnabled(e.target.checked);
  }, []);

  const handleTimeChange = useCallback((e) => {
    setTime(e.target.value);
  }, []);

  return (
    <Card style={{ maxWidth: 360, margin: "0 auto" }}>
      <div style={{ fontWeight: 600, fontSize: 18, color: "#6C63FF", marginBottom: 10 }}>
        Daily Reminder
      </div>
      <div style={{ color: "#616161", marginBottom: 14 }}>
        Get notified to record your mood every day.
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 6 }}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={handleEnableChange}
          style={{ accentColor: COLORS.primary, width: 19, height: 19 }}
        />
        <span style={{ fontWeight: 500, color: enabled ? COLORS.primary : "#757575" }}>Enable Reminder</span>
      </div>
      {enabled && (
        <div style={{ marginTop: 6, marginBottom: 14 }}>
          <label htmlFor="reminder-time" style={{ color: "#757575" }}>Reminder time:</label>
          <Input
            id="reminder-time"
            type="time"
            value={time}
            onChange={handleTimeChange}
            style={{ width: 130, display: "inline-block", marginLeft: 12 }}
            min="00:00"
            max="23:59"
          />
        </div>
      )}
      <Button style={{ marginTop: 10 }}>{enabled ? "Reminder set" : "Reminders off"}</Button>
      {/* In real integration, this would use push notification API / service worker */}
    </Card>
  );
}
