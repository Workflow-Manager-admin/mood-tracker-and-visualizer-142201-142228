import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { AuthContext } from "../contexts/AuthContext";

const user = { email: "abc@email.com", name: "abc" };

function customRender() {
  return render(
    <AuthContext.Provider value={{ user, logout: jest.fn() }}>
      <ProfilePage />
    </AuthContext.Provider>
  );
}

describe("ProfilePage", () => {
  it("renders user info and Avatar", () => {
    customRender();
    expect(screen.getByText("abc")).toBeInTheDocument();
    expect(screen.getByText("abc@email.com")).toBeInTheDocument();
    // Avatar character (from initials)
    expect(screen.getByTitle("abc@email.com")).toBeInTheDocument();
  });

  it("calls logout handler on click", () => {
    const logoutMock = jest.fn();
    render(
      <AuthContext.Provider value={{ user, logout: logoutMock }}>
        <ProfilePage />
      </AuthContext.Provider>
    );
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));
    expect(logoutMock).toHaveBeenCalled();
  });

  it("returns null if no user", () => {
    const { container } = render(
      <AuthContext.Provider value={{ user: null, logout: jest.fn() }}>
        <ProfilePage />
      </AuthContext.Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
