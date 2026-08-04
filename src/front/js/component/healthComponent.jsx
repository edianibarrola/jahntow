import React, { useContext } from "react";
import { Context } from "../store/appContext";

const LOW_HEALTH_RATIO = 0.25;

// A toast fades after a few seconds and is easy to miss if you're not
// looking at the screen at that instant. This readout is on the sticky
// header of every tab, so a player who's low on health sees it no matter
// what they're doing - not just in the instant right after the hit.
const HealthComponent = ({ health, maxHealth }) => {
  const { store } = useContext(Context);
  const isLow = maxHealth ? health / maxHealth <= LOW_HEALTH_RATIO : false;
  // Mirrors economy.health_regen_amount: 1 per 45s tick, +1 per medbay
  // level - the label of a wait, never its source of truth.
  const perTick = 1 + ((store.player.ship || {}).medbay || 0);
  const missing = maxHealth ? maxHealth - health : 0;
  const seconds = missing > 0 ? Math.ceil(missing / perTick) * 45 : 0;
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      className="col-4"
      style={isLow ? { color: "#ff4d4d", fontWeight: "bold" } : undefined}
    >
      Health: {health}
      {maxHealth ? ` / ${maxHealth}` : ""}
      {isLow && " ⚠"}
      {maxHealth && health < maxHealth ? (
        <div className="regen-hint">
          +{perTick}/45s · full in {mm}:{ss}
        </div>
      ) : null}
    </div>
  );
};

export default HealthComponent;
