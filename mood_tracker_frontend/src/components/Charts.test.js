import React from "react";
import { render, screen } from "@testing-library/react";
import { BarChart, PieChart, LineChart } from "./Charts";

describe("Charts", () => {
  it("renders BarChart correctly for data", () => {
    const freq = { happy: 4, sad: 2, calm: 1 };
    render(<BarChart data={freq} />);
    expect(screen.getByText("Happy")).toBeInTheDocument();
    expect(screen.getByText("Sad")).toBeInTheDocument();
    expect(screen.getByText("Calm")).toBeInTheDocument();
    // Has numbers
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders PieChart and shows labels/percentages", () => {
    const freq = { happy: 2, sad: 2 };
    render(<PieChart data={freq} />);
    expect(screen.getAllByText(/Happy/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Sad/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/%/)[0]).toBeInTheDocument();
  });

  it("renders LineChart with correct x/y axis labels and dots", () => {
    const data = [
      { date: "2024-06-01", mood: "happy" },
      { date: "2024-06-02", mood: "sad" },
      { date: "2024-06-03", mood: "calm" }
    ];
    render(<LineChart data={data} />);
    // X axis ticks (should match MM-DD)
    expect(screen.getByText("06-01")).toBeInTheDocument();
    expect(screen.getByText("06-02")).toBeInTheDocument();
    expect(screen.getByText("06-03")).toBeInTheDocument();
    // Y axis mood labels
    expect(screen.getByText("Happy")).toBeInTheDocument();
    expect(screen.getByText("Sad")).toBeInTheDocument();
    expect(screen.getByText("Calm")).toBeInTheDocument();
  });
});
