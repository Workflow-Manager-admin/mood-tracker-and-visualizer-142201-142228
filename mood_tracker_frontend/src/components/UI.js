/**
 * PUBLIC_INTERFACE
 * Reusable modern UI building blocks (Button, Input, Select, Card, Avatar).
 */
import React from "react";
import { COLORS } from "../constants/theme";

export function Button({ children, onClick, type = "button", style = {}, ...props }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        background: COLORS.primary,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "10px 20px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        margin: "6px 0",
        transition: "background 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick, style = {}, ...props }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "#fff",
        color: COLORS.primary,
        border: `2px solid ${COLORS.primary}`,
        borderRadius: 8,
        padding: "10px 20px",
        fontWeight: 600,
        fontSize: 15,
        cursor: "pointer",
        margin: "6px 0",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function Input({ type = "text", value, onChange, placeholder = "", style = {}, ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: "10px",
        outline: "none",
        fontSize: "15px",
        background: "#fff",
        margin: "5px 0",
        width: "100%",
        ...style,
      }}
      {...props}
    />
  );
}

export function Select({ options = [], value, onChange, style = {}, ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: 6,
        padding: "10px",
        fontSize: "15px",
        background: "#fff",
        margin: "5px 0",
        width: "100%",
        ...style,
      }}
      {...props}
    >
      <option value="">Select mood</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export function Card({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 4px 18px rgba(140,140,140,0.06)",
        padding: "20px 24px",
        margin: "16px 0",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Avatar({ email, size = 42 }) {
  const getInitials = (name = "?") => {
    if (!name) return "?";
    const [first] = name.split("@");
    return first[0]?.toUpperCase() || "?";
  };
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.accent,
        color: COLORS.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: size * 0.48,
        border: `2px solid ${COLORS.primary}`
      }}
      title={email}
    >
      {getInitials(email)}
    </div>
  );
}
