import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

// Everything you own that isn't cargo, gear or property lives here, split
// by what it actually buys:
//
//   Modules  buy RATES     - fixed levels, big escalating costs
//   Systems  buy CAPACITY  - unlimited step purchases, cheap first step
//
// They used to be two tabs, which put two answers to "how do I carry more?"
// in front of the player at wildly different prices. One tab, one answer.

// What one level of each module changes, phrased in the units the player
// actually feels. The catalog's own `effect` string is the short form; this
// spells out the resulting total so the player can see the module working
// rather than having to trust a "+1".
const CURRENT_EFFECT = {
  reactor: (p, lvl) =>
    `Energy regenerates ${1 + lvl} per tick (${(1 + lvl) * 360}/hour).`,
  medbay: (p, lvl) => `Health regenerates ${1 + lvl} per tick.`,
  cargo_drones: (p, lvl) =>
    `Each property banks up to ${(p.maxInventoryCount || 0) * (2 + lvl)} units before it pauses.`,
};

// Preview-only: mirrors the cost formula the backend actually charges
// (src/api/game_routes.py UPGRADE_BASE_COST/UPGRADE_COST_MULTIPLIER). The
// server is still the one that computes and applies the real cost.
const UPGRADE_BASE_COST = 250;
const UPGRADE_COST_MULTIPLIER = 1.35;

const SYSTEMS = [
  {
    stat: "inventory",
    label: "Cargo Bay",
    describe: (p) => `Holds ${p.maxInventoryCount} of each market good.`,
    why: "Bigger runs mean bigger swings - this is what makes trading scale.",
  },
  {
    stat: "equipment",
    label: "Armory",
    describe: (p) => `Holds ${p.maxEquipmentCount} equipment units in total.`,
    why: "Room for spares, which raise your odds on every mission.",
  },
  {
    stat: "energy",
    label: "Capacitor",
    describe: (p) => `Stores ${p.maxEnergy} energy.`,
    why: "A deeper buffer, so you can burn a backlog in one sitting.",
  },
  {
    stat: "health",
    label: "Life Support",
    describe: (p) => `Sustains ${p.maxHealth} health.`,
    why: "More room to absorb a bad run before you have to stop.",
  },
];

const ShipComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const modules = gameData.shipModules || {};
  const maxLevel = gameData.shipModuleMaxLevel || 5;
  const ship = player.ship || {};

  // Mirrors economy.ship_module_cost.
  const nextCost = (id, module) => {
    const level = ship[id] || 0;
    if (level >= maxLevel) return null;
    return Math.floor(module.base_cost * Math.pow(module.cost_multiplier, level));
  };

  const systemCost = (stat) => {
    const purchased = (player.upgradeSteps || {})[stat] || 0;
    return Math.floor(
      UPGRADE_BASE_COST * Math.pow(UPGRADE_COST_MULTIPLIER, purchased)
    );
  };

  const handleInstall = (id) => {
    actions.upgradeShipModule(id).catch(() => {});
  };

  const handleExpand = (stat) => {
    actions.upgradeStat(stat).catch(() => {});
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
        </div>
      </div>

      <div className="col-12 text-center mt-2 mb-2">
        <p className="mb-0">Modules</p>
        <p className="small">
          These raise a <em>rate</em>. Everything else in the game raises a
          limit &mdash; modules are how credits turn into playing faster.
        </p>
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

      <div className="col-12 text-center mt-2 mb-2">
        <p className="mb-0">Systems</p>
        <p className="small">
          These raise a <em>limit</em>. No ceiling &mdash; each expansion just
          costs more than the last.
        </p>
      </div>

      <div className="row">
        {SYSTEMS.map(({ stat, label, describe, why }) => {
          const cost = systemCost(stat);
          return (
            <div className="col-12 col-md-6 mb-4" key={stat}>
              <div className="holo h-100 p-2">
                <strong>{label}</strong>
                <p className="small mb-1">{describe(player)}</p>
                <p className="small mb-2">{why}</p>
                <button
                  onClick={() => handleExpand(stat)}
                  disabled={player.credits < cost}
                >
                  Expand (+5) for {cost.toLocaleString()} credits
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShipComponent;
