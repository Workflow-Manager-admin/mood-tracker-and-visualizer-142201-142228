import React, { createContext, useContext, useState, useEffect } from "react";
import { getDemoMoods } from "../utils/moodUtils";

// PUBLIC_INTERFACE
export const MoodContext = createContext();

/**
 * Provides mood entries (add/edit), synchronized with localStorage.
 */
// PUBLIC_INTERFACE
export function MoodProvider({ children }) {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const moodsJson = localStorage.getItem("moodtracker_moods");
    if (moodsJson) {
      setMoods(JSON.parse(moodsJson));
    } else {
      // Load demo data for initial state
      const demo = getDemoMoods();
      setMoods(demo);
      localStorage.setItem("moodtracker_moods", JSON.stringify(demo));
    }
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
