import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import PrestigeButton from "./prestigeButton";
import ResetPlayerStats from "./resetPlayerStats";

// The command deck: everything about YOUR ship in one place.
//
//   Status   what the ship is doing for you right now
//   Modules  buy RATES     - fixed levels, big escalating costs
//   Systems  buy CAPACITY  - unlimited step purchases, cheap first step
//   Command  rebirth, registry, and the dangerous switches
//
// Modules/Systems used to be two tabs (two answers to "how do I carry
// more?" at wildly different prices), and Command lived on a separate
// near-empty Dashboard page behind a button under the fold.

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

  const [newName, setNewName] = useState("");
  const handleRename = () => {
    if (!newName.trim()) return;
    actions.updatePlayerName(newName.trim());
    setNewName("");
  };

  const gearHeld = Object.values(player.equipment || {}).reduce(
    (sum, e) => sum + (e.quantity || 0), 0
  );
  const banked = Object.values(player.pendingProduction || {}).reduce(
    (sum, qty) => sum + Math.floor(qty), 0
  );
  const reactorLvl = ship.reactor || 0;
  const medbayLvl = ship.medbay || 0;

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
      <div className="col-12 col-md-6 mb-4">
        <div className="holo h-100 p-2 text-start">
          <strong>Ship Status</strong>
          <ul className="small mb-0 mt-1 ps-3">
            <li>
              Energy: +{1 + reactorLvl}/10s ({(1 + reactorLvl) * 360}/hour)
              {(player.restedEnergy || 0) > 0 &&
                ` · ${player.restedEnergy} rested in reserve`}
            </li>
            <li>Health: +{1 + medbayLvl}/45s ({(1 + medbayLvl) * 80}/hour)</li>
            <li>
              Armory: {gearHeld}/{player.maxEquipmentCount} equipment slots used
            </li>
            <li>Cargo Bay: up to {player.maxInventoryCount} of each good</li>
            <li>
              {banked > 0
                ? `${banked} goods banked at your properties - collect them.`
                : "No goods waiting at your properties."}
            </li>
            {(player.prestigeLevel || 0) > 0 && (
              <li className="tx-prestige">
                Prestige {player.prestigeLevel}: +
                {Math.min(60, player.prestigeLevel * 12)}% mission credits & XP
              </li>
            )}
          </ul>
        </div>
      </div>

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

      <div className="col-12 text-center mt-2 mb-2">
        <p className="mb-0">Command</p>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <div className="holo h-100 p-2">
            <strong>Rebirth</strong>
            <p className="small mb-2">
              Strip the ship's registry and start over, stronger: stat floors
              rise, missions pay more forever, and your ship and story
              survive the reset.
            </p>
            <PrestigeButton />
          </div>
        </div>
        <div className="col-12 col-md-6 mb-4">
          <div className="holo h-100 p-2">
            <strong>Registry</strong>
            <p className="small mb-2">Registered captain: {player.name}</p>
            <input
              type="text"
              className="qty-input me-2"
              style={{ width: "10em" }}
              placeholder={player.name}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button onClick={handleRename} disabled={!newName.trim()}>
              Rename
            </button>
            <div className="mt-3">
              <ResetPlayerStats />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipComponent;
