import React from "react";

const LOW_HEALTH_RATIO = 0.25;

// A toast fades after a few seconds and is easy to miss if you're not
// looking at the screen at that instant. This readout is on the sticky
// header of every tab, so a player who's low on health sees it no matter
// what they're doing - not just in the instant right after the hit.
const HealthComponent = ({ health, maxHealth }) => {
  const isLow = maxHealth ? health / maxHealth <= LOW_HEALTH_RATIO : false;

  return (
    <div
      className="col-4"
      style={isLow ? { color: "#ff4d4d", fontWeight: "bold" } : undefined}
    >
      Health: {health}
      {isLow && " ⚠"}
    </div>
  );
};

export default HealthComponent;
