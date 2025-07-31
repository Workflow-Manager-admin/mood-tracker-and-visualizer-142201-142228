import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { MoodProvider } from "./contexts/MoodContext";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import HistoryPage from "./pages/HistoryPage";
import MoodChartsPage from "./pages/MoodChartsPage";
import RemindersPage from "./pages/RemindersPage";
import ProfilePage from "./pages/ProfilePage";
import { Navbar, PageWrapper } from "./components/Layout";

// PUBLIC_INTERFACE
function App() {
  // The Router is now expected to be provided at a higher level (index.js or test)
  // This avoids nested routers in integration tests and elsewhere.
  return (
    <AuthProvider>
      <MoodProvider>
        <AppRoutes />
      </MoodProvider>
    </AuthProvider>
  );
}

// Restrict main app routes to logged-in user
function AppRoutes() {
  const { user } = useAuth();
  if (!user)
    return (
      <Routes>
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  return (
    <>
      <Navbar />
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/charts" element={<MoodChartsPage />} />
          <Route path="/reminders" element={<RemindersPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </PageWrapper>
    </>
  );
}

export default App;
