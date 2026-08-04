import React from "react";

// Consecutive mission wins (server-tracked; resets on any failure).
// 🎯 rather than 🔥, which the daily login streak already uses.
const WinStreakComponent = ({ streak }) => {
  if (!streak) return null;
  return <span className="stat-chip" title="Mission win streak">🎯 {streak}</span>;
};

export default WinStreakComponent;
