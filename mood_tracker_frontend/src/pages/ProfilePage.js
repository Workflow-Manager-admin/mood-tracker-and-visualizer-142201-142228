import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, Button, Avatar } from "../components/UI";

/**
 * PUBLIC_INTERFACE
 * Simple profile/settings page.
 */
export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div style={{ maxWidth: 380 }}>
      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <Avatar email={user.email} size={54} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 19, color: "#6C63FF" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 14, color: "#616161" }}>{user.email}</div>
          </div>
        </div>
        <div style={{ marginTop: 28 }}>
          <Button
            style={{ background: "#FFD600", color: "#282c34" }}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
}
