import React from "react";
import { COLORS } from "../constants/theme";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { OutlineButton, Avatar } from "./UI";

/**
 * PUBLIC_INTERFACE
 * Navbar: main navigation header with mood app links.
 */
export function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div
      data-testid="navbar"
      style={{
        width: "100%",
        background: COLORS.primary,
        color: "#fff",
        padding: "0.5rem 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 6px rgba(60,64,71,0.05)",
        zIndex: 21,
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 22 }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          MoodTracker
        </Link>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: "22px" }}
        data-testid="navbar-link-group"
      >
        <Link data-testid="nav-dashboard" to="/" style={navLinkStyle}>
          Dashboard
        </Link>
        <Link data-testid="nav-history" to="/history" style={navLinkStyle}>
          History
        </Link>
        <Link data-testid="nav-charts" to="/charts" style={navLinkStyle}>
          Charts
        </Link>
        <Link data-testid="nav-reminders" to="/reminders" style={navLinkStyle}>
          Reminders
        </Link>
        <Link data-testid="nav-profile" to="/profile" style={navLinkStyle}>
          Profile
        </Link>
        {user && (
          <>
            <Avatar email={user.email} size={36} data-testid="navbar-avatar" />
            <OutlineButton data-testid="navbar-logout" onClick={logout}>
              Logout
            </OutlineButton>
          </>
        )}
      </div>
    </div>
  );
}

const navLinkStyle = {
  color: "#fff",
  fontWeight: 500,
  fontSize: 16,
  marginRight: 6,
  textDecoration: "none"
};

// PUBLIC_INTERFACE
export function Sidebar() {
  const location = useLocation();
  return (
    <div style={{
      width: "210px",
      minWidth: "170px",
      background: COLORS.sidebar,
      height: "calc(100vh - 64px)",
      borderRight: `1.5px solid ${COLORS.border}`,
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      padding: "1.3rem 10px",
      position: "fixed",
      top: "64px",
      left: 0,
    }}>
      <QuickActionItem to="/" label="Today" icon="📝" active={location.pathname === "/"} />
      <QuickActionItem to="/charts" label="Visualize" icon="📊" active={location.pathname === "/charts"} />
      <QuickActionItem to="/history" label="History" icon="📅" active={location.pathname === "/history"} />
      <QuickActionItem to="/reminders" label="Reminders" icon="🔔" active={location.pathname === "/reminders"} />
    </div>
  );
}

function QuickActionItem({ to, label, icon, active }) {
  // Map label (lowercase) to testid for deterministic testing
  const validKeys = {
    "Today": "sidebar-today",
    "Visualize": "sidebar-visualize",
    "History": "sidebar-history",
    "Reminders": "sidebar-reminders",
  };
  const testId = validKeys[label] || undefined;
  return (
    <Link
      to={to}
      data-testid={testId}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px 14px",
        borderRadius: 8,
        background: active ? COLORS.accent : "transparent",
        color: COLORS.text,
        fontWeight: 600,
        textDecoration: "none",
        fontSize: 17,
        gap: "15px",
      }}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

// PUBLIC_INTERFACE
export function PageWrapper({ children }) {
  // Provides sidebar and main content area
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 210, background: COLORS.background, padding: "1.9rem 2.2rem", minHeight: "100vh", transition: "background 0.3s" }}>
        {children}
      </div>
    </div>
  );
}
