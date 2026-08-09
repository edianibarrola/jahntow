import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";

// Energy is the real constraint on how much you can play, so it shows with
// its maximum - the single most important number for deciding whether to
// run another mission. The countdown exists because a disabled button with
// no timer FEELS like downtime even when the wait is short - "full in
// 4:10" turns a wall into a plan. Chip-sized for the sticky HUD: icon
// label, compact hints, full wording in the tooltip.
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
  const rested = store.player.restedEnergy || 0;

  return (
    <div
      className="stat-chip"
      title={`Energy ${energy}${maxEnergy ? ` of ${maxEnergy}` : ""}. Regen +${perTick}/10s${
        missing > 0 ? ` — full in ${mm}:${ss}` : ""
      }${
        rested > 0
          ? `. +${rested} rested banked while the bar was full — it refills the bar as you spend.`
          : ""
      }`}
      style={isLow ? { color: "#ffb84d" } : undefined}
    >
      ⚡ {energy}
      {rested > 0 && <span className="regen-hint">+{rested}</span>}
      {maxEnergy && energy < maxEnergy ? (
        <span className="regen-hint">
          ⏳{mm}:{ss}
        </span>
      ) : null}
    </div>
  );
};

export default EnergyComponent;
