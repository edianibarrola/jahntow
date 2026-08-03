import React from "react";

const LoginStreakComponent = ({ streak }) => {
  if (!streak) return null;
  return <div className="col-4">🔥 Streak: {streak}</div>;
};

export default LoginStreakComponent;
