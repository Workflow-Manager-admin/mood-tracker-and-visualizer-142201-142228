import React, { createContext, useContext, useState, useEffect } from "react";
import { getDemoMoods } from "../utils/moodUtils";

// PUBLIC_INTERFACE
export const MoodContext = createContext();

/**
 * Provides mood entries (add/edit), synchronized with localStorage.
 */
/**
 * PUBLIC_INTERFACE
 * MoodProvider keeps mood state synchronized with localStorage. On every mount,
 * rehydrates state from localStorage (if present), even after unmount/remount.
 */
export function MoodProvider({ children }) {
  const [moods, setMoods] = useState(() => {
    // On initial mount, try to load from localStorage, else demo moods
    const moodsJson = localStorage.getItem("moodtracker_moods");
    if (moodsJson) return JSON.parse(moodsJson);
    const demo = getDemoMoods();
    localStorage.setItem("moodtracker_moods", JSON.stringify(demo));
    return demo;
  });

  // On every mount (or remount), always rehydrate from localStorage
  useEffect(() => {
    const moodsJson = localStorage.getItem("moodtracker_moods");
    if (moodsJson) {
      setMoods(JSON.parse(moodsJson));
    }
    // Do not auto-fill demo on *re*-mount: only hydrate from localStorage for user data
    // This acts as a safeguard if localStorage is cleared between mounts
    // eslint-disable-next-line
  }, []);

  // PUBLIC_INTERFACE
  function addMood(entry) {
    const updated = [...moods, entry];
    setMoods(updated);
    localStorage.setItem("moodtracker_moods", JSON.stringify(updated));
  }

  // PUBLIC_INTERFACE
  function editMood(date, updatedMood) {
    const updated = moods.map((m) => (m.date === date ? { ...m, ...updatedMood } : m));
    setMoods(updated);
    localStorage.setItem("moodtracker_moods", JSON.stringify(updated));
  }

  // PUBLIC_INTERFACE
  function getMoodByDate(date) {
    return moods.find((m) => m.date === date) || null;
  }

  return (
    <MoodContext.Provider value={{ moods, addMood, getMoodByDate, editMood }}>
      {children}
    </MoodContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useMood() {
  return useContext(MoodContext);
}
