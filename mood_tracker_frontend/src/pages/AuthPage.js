import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button, Input, Card } from "../components/UI";

/**
 * PUBLIC_INTERFACE
 * Sign-In Page (local auth for now).
 */
export default function AuthPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!login({ email, password: pw })) {
      setError("Please enter a valid email.");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#f8f9fa 60%,#FFD600 140%)"
    }}>
      <Card style={{ maxWidth: 340, width: "100%", padding: "2.2rem 1.4rem" }}>
        <div style={{ fontWeight: 700, fontSize: 28, color: "#6C63FF", marginBottom: 18 }}>
          MoodTracker
        </div>
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            value={pw}
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            required
          />
          {error && <div style={{ color: "crimson", fontSize: 13, marginTop: 6 }}>{error}</div>}
          <Button type="submit" style={{ width: "100%", marginTop: 12 }}>Sign In</Button>
        </form>
      </Card>
    </div>
  );
}
