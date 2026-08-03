import React from "react";

// Consecutive mission wins (server-tracked; resets on any failure).
// 🎯 rather than 🔥, which the daily login streak already uses.
const WinStreakComponent = ({ streak }) => {
  if (!streak) return null;
  return <div className="col-4">🎯 Streak: {streak}</div>;
};

export default WinStreakComponent;
