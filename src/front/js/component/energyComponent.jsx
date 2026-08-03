import React from "react";

// Energy is the real constraint on how much you can play, so showing it
// without its maximum (as this did) hid the single most important number
// for deciding whether to run another mission.
const EnergyComponent = ({ energy, maxEnergy }) => {
  const isLow = maxEnergy ? energy / maxEnergy <= 0.15 : false;

  return (
    <div className="col-4" style={isLow ? { color: "#ffb84d" } : undefined}>
      Energy: {energy}
      {maxEnergy ? ` / ${maxEnergy}` : ""}
      {maxEnergy && energy < maxEnergy ? (
        <div className="regen-hint">+1 every 10s</div>
      ) : null}
    </div>
  );
};

export default EnergyComponent;
