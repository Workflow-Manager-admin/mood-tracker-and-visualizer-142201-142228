export const MOOD_TYPES = [
  { value: "happy", label: "Happy", color: "#FFD600" },       // Accent
  { value: "sad", label: "Sad", color: "#6C63FF" },          // Primary
  { value: "energized", label: "Energized", color: "#43E97B" },// Secondary
  { value: "anxious", label: "Anxious", color: "#FF908D" },
  { value: "calm", label: "Calm", color: "#87CEEB" },
  { value: "angry", label: "Angry", color: "#FF6B6B" }
];

/**
 * Get label and color for a mood value
 */
export function getMoodMeta(moodValue) {
  return MOOD_TYPES.find((m) => m.value === moodValue) || { label: "Unknown", color: "#cccccc" };
}

// Demo data: generate sample mood entries
export function getDemoMoods() {
  const sample = [
    { date: "2024-06-01", mood: "happy", note: "Great day!" },
    { date: "2024-06-02", mood: "sad", note: "Feeling down." },
    { date: "2024-06-03", mood: "energized", note: "" },
    { date: "2024-06-04", mood: "anxious", note: "" },
    { date: "2024-06-05", mood: "happy", note: "Got a promotion!" },
    { date: "2024-06-06", mood: "calm", note: "" },
    { date: "2024-06-07", mood: "angry", note: "Traffic jam." },
  ];
  return sample;
}
