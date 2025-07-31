import React from "react";
import { useMood } from "../contexts/MoodContext";
import { Card } from "../components/UI";
import { BarChart, PieChart, LineChart } from "../components/Charts";

/**
 * PUBLIC_INTERFACE
 * Visualizes mood history as charts: bar, pie, and line.
 */
export default function MoodChartsPage() {
  const { moods } = useMood();
  const freq = {};
  moods.forEach(m => { freq[m.mood] = (freq[m.mood] || 0) + 1; });

  return (
    <div>
      <div style={{ fontWeight: 600, fontSize: 21, marginBottom: 4, color: "#6C63FF" }}>
        Mood Visualizations
      </div>
      <div style={{ color: "#616161", marginBottom: 12 }}>
        Your moods over time, visualized.
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 22, marginBottom: 0 }}>
        <Card style={{ flex: 1, minWidth: 350, maxWidth: 400 }}><BarChart data={freq} /></Card>
        <Card style={{ flex: 1, minWidth: 240, maxWidth: 300 }}><PieChart data={freq} /></Card>
      </div>
      <Card style={{ marginTop: 18, minWidth: 370 }}>
        <LineChart data={moods.slice().sort((a, b) => a.date.localeCompare(b.date))} />
      </Card>
    </div>
  );
}
