/**
 * PUBLIC_INTERFACE
 * Simple BarChart, PieChart, and LineChart display using mood data.
 */
import React from "react";
import { getMoodMeta } from "../utils/moodUtils";

// PUBLIC_INTERFACE
export function BarChart({ data }) {
  const max = Math.max(...Object.values(data), 1);
  const width = 320, height = 130, barWidth = 42;
  const entries = Object.entries(data);

  return (
    <svg width={width} height={height}>
      {entries.map(([mood, val], i) => {
        const meta = getMoodMeta(mood);
        return (
          <g key={mood}>
            <rect
              x={i * (barWidth + 20)}
              y={height - val / max * 100 - 20}
              width={barWidth}
              height={val / max * 100}
              fill={meta.color}
              rx={6}
            />
            <text
              x={i * (barWidth + 20) + barWidth / 2}
              y={height - 6}
              fontSize="14"
              textAnchor="middle"
              fill="#282c34"
              fontWeight={700}
            >
              {meta.label}
            </text>
            <text
              x={i * (barWidth + 20) + barWidth / 2}
              y={height - val / max * 100 - 28}
              fontSize="13"
              textAnchor="middle"
              fill={meta.color}
            >
              {val}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function PieChart({ data }) {
  // data = {mood: count,...}
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;
  let startAngle = 0;
  const cx = 90, cy = 90, r = 72;
  return (
    <svg width={180} height={180}>
      {Object.entries(data).map(([mood, val], i) => {
        const angle = (val / total) * 2 * Math.PI;
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(startAngle + angle);
        const y2 = cy + r * Math.sin(startAngle + angle);
        const largeArc = angle > Math.PI ? 1 : 0;
        const meta = getMoodMeta(mood);
        const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
        const labelAngle = startAngle + angle / 2;
        const labelX = cx + (r * 0.58) * Math.cos(labelAngle);
        const labelY = cy + (r * 0.58) * Math.sin(labelAngle);
        const pct = ((val / total) * 100).toFixed(1);
        const path = (
          <g key={mood}>
            <path d={d} fill={meta.color} />
            <text x={labelX} y={labelY} fontSize="13" textAnchor="middle" fill="#282c34">
              {meta.label} <tspan dx="4" fontWeight="700">{pct}%</tspan>
            </text>
          </g>
        );
        startAngle += angle;
        return path;
      })}
    </svg>
  );
}

// PUBLIC_INTERFACE
export function LineChart({ data }) {
  // data = [{date: "2024-06-01", mood: "happy"}, ...]
  // Plot moods on y, ordered date on x
  const moods = Array.from(new Set(data.map(m => m.mood)));
  const moodToY = mood =>
    20 + (moods.indexOf(mood) / Math.max(1, moods.length - 1)) * 100;
  const width = 370, height = 140;

  const points = data.map((m, i) => [
    35 + (i * (width - 70)) / Math.max(1, data.length - 1),
    moodToY(m.mood)
  ]);
  return (
    <svg width={width} height={height}>
      {/* lines */}
      <polyline
        points={points.map(pt => pt.join(",")).join(" ")}
        fill="none"
        stroke="#6C63FF"
        strokeWidth="3"
      />
      {/* dots */}
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={7}
          fill={getMoodMeta(data[i].mood).color}
        />
      ))}
      {/* labels on x axis */}
      {data.map((m, i) =>
        <text
          key={i}
          x={35 + (i * (width - 70)) / Math.max(1, data.length - 1)}
          y={height - 7}
          fontSize="13"
          textAnchor="middle"
          fill="#757575"
        >{m.date.slice(5)}</text>
      )}
      {/* y axis mood labels */}
      {moods.map((mood, idx) =>
        <text
          key={mood}
          x={2}
          y={moodToY(mood) + 4}
          fontSize="13"
          fill={getMoodMeta(mood).color}
        >{getMoodMeta(mood).label}</text>
      )}
    </svg>
  );
}
