import React from "react";

// Compact display above 1M ("9.99M") so the sticky HUD stays one row on a
// 390px phone - a late-game balance was pushing the credits chip off the
// right edge. The exact figure survives in the tooltip.
const fmtCredits = (credits) => {
  const c = Math.floor(credits);
  if (c >= 1000000) return `${(c / 1000000).toFixed(2)}M`;
  return c.toLocaleString();
};

const CreditsComponent = ({ credits }) => {
  return (
    <span
      className="stat-chip"
      title={`${Math.floor(credits).toLocaleString()} credits`}
    >
      🪙 {fmtCredits(credits)}
    </span>
  );
};

export default CreditsComponent;
