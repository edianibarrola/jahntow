import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

// Preview-only: mirrors the cost formula the backend actually charges
// (src/api/game_routes.py UPGRADE_BASE_COST/UPGRADE_COST_MULTIPLIER), so the
// button label matches what the server will charge. The server is still the
// one that computes and applies the real cost.
const BASE_COST = 250;
const COST_MULTIPLIER = 1.35;

const UPGRADES = [
  {
    stat: "inventory",
    label: "Inventory",
    describe: (p) => `You can store ${p.maxInventoryCount} of each market item.`,
  },
  {
    stat: "equipment",
    label: "Equipment Storage",
    describe: (p) => `You can store ${p.maxEquipmentCount} equipment units in total.`,
  },
  {
    stat: "health",
    label: "Max Health",
    describe: (p) => `Your Max Health is ${p.maxHealth}.`,
  },
  {
    stat: "energy",
    label: "Max Energy",
    describe: (p) => `Your Max Energy is ${p.maxEnergy}.`,
  },
];

const InventoryUpgradeComponent = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  // Cost now scales with how many upgrades of that stat you've *bought*,
  // not the stat's raw value - stats start at very different bases (10 vs
  // 100), and levelling/prestige raise those bases, which used to make
  // upgrades retroactively more expensive.
  const upgradeCost = (stat) => {
    const purchased = (player.upgradeSteps || {})[stat] || 0;
    return Math.floor(BASE_COST * Math.pow(COST_MULTIPLIER, purchased));
  };

  const handleUpgrade = (stat) => {
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
          <p>Upgrades</p>
        </div>
      </div>
      <div className="row ">
        {UPGRADES.map(({ stat, label, describe }) => {
          const cost = upgradeCost(stat);
          return (
            <div className="col-12 mb-4 holo" key={stat}>
              <p>{describe(player)}</p>
              <button
                onClick={() => handleUpgrade(stat)}
                disabled={player.credits < cost}
              >
                Upgrade {label} (+5) for {cost.toLocaleString()} credits
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryUpgradeComponent;
