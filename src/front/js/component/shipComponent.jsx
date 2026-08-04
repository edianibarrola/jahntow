import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

// What one level of each module changes, phrased in the units the player
// actually feels. The catalog's own `effect` string is the short form; this
// spells out the resulting total so the player can see the module working
// rather than having to trust a "+1".
const CURRENT_EFFECT = {
  reactor: (p, lvl) =>
    `Energy regenerates ${1 + lvl} per tick (${(1 + lvl) * 360}/hour).`,
  medbay: (p, lvl) => `Health regenerates ${1 + lvl} per tick.`,
  cargo_drones: (p, lvl) =>
    `Each property banks up to ${(p.cargoCapacity || 0) * (2 + lvl)} units before it pauses.`,
  cargo_hold: (p) => `You can carry ${p.cargoCapacity || 0} of each good.`,
};

const ShipComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const modules = gameData.shipModules || {};
  const maxLevel = gameData.shipModuleMaxLevel || 5;
  const ship = player.ship || {};

  // Mirrors economy.ship_module_cost. The server still charges the real
  // price; this only labels the button.
  const nextCost = (id, module) => {
    const level = ship[id] || 0;
    if (level >= maxLevel) return null;
    return Math.floor(module.base_cost * Math.pow(module.cost_multiplier, level));
  };

  const handleInstall = (id) => {
    actions.upgradeShipModule(id).catch(() => {});
  };

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-2 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12 text-center">
          <p>Your Ship</p>
          <p className="small">
            Everything else you buy raises a limit. Modules raise a{" "}
            <em>rate</em> &mdash; they are how credits turn into playing faster.
          </p>
        </div>
      </div>

      <div className="row">
        {Object.entries(modules).map(([id, module]) => {
          const level = ship[id] || 0;
          const cost = nextCost(id, module);
          const maxed = cost === null;
          const describe = CURRENT_EFFECT[id];
          return (
            <div className="col-12 col-md-6 mb-4" key={id}>
              <div className="holo h-100 p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <strong>{module.name}</strong>
                  <span className="ship-pips">
                    {Array.from({ length: maxLevel }, (_, i) => (
                      <span
                        key={i}
                        className={i < level ? "" : "ship-pip-empty"}
                      >
                        &#9679;
                      </span>
                    ))}
                  </span>
                </div>
                <p className="small mb-1">{module.desc}</p>
                <p className="small mb-1">
                  Level {level} of {maxLevel}
                  {level > 0 && describe ? ` — ${describe(player, level)}` : ""}
                </p>
                <p className="small mb-2">
                  Each level: <span className="tx-ship">{module.effect}</span>
                </p>
                {maxed ? (
                  <button disabled>Fully installed</button>
                ) : (
                  <button
                    onClick={() => handleInstall(id)}
                    disabled={player.credits < cost}
                  >
                    {level === 0 ? "Install" : `Upgrade to level ${level + 1}`} for{" "}
                    {cost.toLocaleString()} credits
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipComponent;
