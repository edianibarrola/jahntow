import React from "react";

// The level-up threshold is computed server-side (level * XP_PER_LEVEL) and
// is now sent as xpForNextLevel - without it the player had no way to know
// how close they were to levelling.
const ExperienceComponent = ({ experience, xpForNextLevel }) => {
  const needed = xpForNextLevel || 0;
  const pct = needed > 0 ? Math.min(100, (experience / needed) * 100) : 0;

  return (
    <span className="stat-chip">
      Exp: {experience}
      {needed > 0 && <> / {needed}</>}
      {needed > 0 && (
        <span
          className="xp-bar"
          aria-label={`${Math.round(pct)}% to next level`}
        >
          <span className="xp-bar-fill" style={{ width: `${pct}%` }} />
        </span>
      )}
    </span>
  );
};

export default ExperienceComponent;
