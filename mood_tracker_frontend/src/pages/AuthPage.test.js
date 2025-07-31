import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthPage from "./AuthPage";
import { AuthProvider } from "../contexts/AuthContext";

// Helper: render with real AuthProvider for localstorage logic
function setup() {
  window.localStorage.clear();
  return render(
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  );
}

describe("AuthPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows error for empty email", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "abc" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
  });

  it("logs in with valid email and saves user to localStorage", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: "user@x.com" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    const user = JSON.parse(window.localStorage.getItem("moodtracker_user"));
    expect(user.email).toBe("user@x.com");
  });

  it("renders correctly", () => {
    setup();
    expect(screen.getByText(/MoodTracker/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
