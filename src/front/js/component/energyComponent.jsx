import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

// Energy is the real constraint on how much you can play, so showing it
// without its maximum (as this did) hid the single most important number
// for deciding whether to run another mission. The countdown exists
// because a disabled button with no timer FEELS like downtime even when
// the wait is short - "full in 4:10" turns a wall into a plan.
const EnergyComponent = ({ energy, maxEnergy }) => {
  const { store } = useContext(Context);
  const isLow = maxEnergy ? energy / maxEnergy <= 0.15 : false;
  // Local 1s tick so the countdown moves between the 20s server polls.
  const [, setBeat] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setBeat((b) => b + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Mirrors economy.energy_regen_amount: 1 per 10s tick, +1 per reactor
  // level. The server stays authoritative; this only labels the wait.
  const perTick = 1 + ((store.player.ship || {}).reactor || 0);
  const missing = maxEnergy ? maxEnergy - energy : 0;
  const seconds = missing > 0 ? Math.ceil(missing / perTick) * 10 : 0;
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      className="stat-chip stat-chip-wrap"
      style={isLow ? { color: "#ffb84d" } : undefined}
    >
      <span className="stat-bit">
        Energy: {energy}
        {maxEnergy ? ` / ${maxEnergy}` : ""}
      </span>
      {(store.player.restedEnergy || 0) > 0 && (
        <div
          className="regen-hint"
          title="Regen banked while your bar was full - it refills the bar as you spend."
        >
          +{store.player.restedEnergy} rested in reserve
        </div>
      )}
      {maxEnergy && energy < maxEnergy ? (
        <div className="regen-hint">
          +{perTick}/10s · full in {mm}:{ss}
        </div>
      ) : null}
    </div>
  );
};

export default EnergyComponent;
