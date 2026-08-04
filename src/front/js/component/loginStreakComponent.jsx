import React from "react";

const LoginStreakComponent = ({ streak }) => {
  if (!streak) return null;
  return <span className="stat-chip">🔥 {streak}</span>;
};

export default LoginStreakComponent;
