import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/UI";
import MoodInputForm from "../components/MoodInputForm";
import MoodOverview from "../components/MoodOverview";

/**
 * PUBLIC_INTERFACE
 * Dashboard page: greeting, add mood, mood overview cards.
 */
export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <div style={{ fontSize: 23, fontWeight: 600, marginTop: 2, color: "#282c34" }}>
        Hi {user?.name || "there"}! 👋
      </div>
      <div style={{ color: "#616161", marginBottom: 12 }}>
        Welcome to your Mood Tracker dashboard.
      </div>
      <Card style={{ maxWidth: 400, marginBottom: 24, marginTop: 10 }}>
        <MoodInputForm />
      </Card>
      <MoodOverview />
    </>
  );
}
