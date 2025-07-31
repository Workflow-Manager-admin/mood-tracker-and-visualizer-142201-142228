import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";

// Utilities for simulating localStorage state
function setupLocalStorageUser(user) {
  window.localStorage.setItem("moodtracker_user", JSON.stringify(user));
}
function clearLocalStorageUser() {
  window.localStorage.removeItem("moodtracker_user");
}

function renderWithRouter(ui, initialEntries = ["/"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
  );
}

describe("App integration & routing", () => {
  afterEach(() => {
    clearLocalStorageUser();
    window.localStorage.clear();
  });

  test("redirects to AuthPage if not logged in", () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/MoodTracker/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("routing - shows Dashboard after login", () => {
    renderWithRouter(<App />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "test123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Should render dashboard greeting
    expect(screen.getByText(/hi test/i)).toBeInTheDocument();
    expect(screen.getByText(/add mood/i)).toBeInTheDocument();
    expect(screen.getByText(/total mood entries/i)).toBeInTheDocument();
  });

  test("full navigation bar can route to all main pages after login", () => {
    setupLocalStorageUser({ email: "bob@email.com", name: "bob" });
    renderWithRouter(<App />);

    // navbar links using testid
    fireEvent.click(screen.getByTestId("nav-history"));
    expect(screen.getByText(/mood history/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nav-charts"));
    expect(screen.getByText(/visualizations/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nav-reminders"));
    expect(screen.getByText(/daily reminder/i)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("nav-profile"));
    // Use getByTestId to unambiguously locate username
    expect(screen.getByTestId("profile-username")).toHaveTextContent("bob");
    expect(screen.getByTestId("profile-logout")).toBeInTheDocument();
  });

  test("logout removes user state and shows login view", () => {
    setupLocalStorageUser({ email: "jane@email.com", name: "jane" });
    renderWithRouter(<App />);

    // open Profile using nav-profile, click logout by new testid
    fireEvent.click(screen.getByTestId("nav-profile"));
    fireEvent.click(screen.getByTestId("profile-logout"));

    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
