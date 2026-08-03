import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const InventoryUpgradeComponent = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  // Preview-only: mirrors the cost formula the backend actually charges
  // (src/api/game_routes.py UPGRADE_BASE_COST/UPGRADE_COST_MULTIPLIER), so
  // the button label matches what the server will charge. The server is
  // still the one that computes and applies the real cost.
  const BASE_COST = 100;
  const COST_MULTIPLIER = 1.5;

  const calculateUpgradeCost = (currentValue) => {
    return Math.floor(BASE_COST * Math.pow(COST_MULTIPLIER, currentValue / 10));
  };

  const handleUpgrade = (stat) => {
    actions.upgradeStat(stat).catch(() => {});
  };

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-2 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12 text-center">
          <p>Upgrades</p>
        </div>
      </div>
      <div className="row ">
        <div className="col-12 mb-5 holo">
          <p>
            You can currently store {player.maxInventoryCount} of each item.
          </p>
          <button onClick={() => handleUpgrade("inventory")}>
            Upgrade Inventory for {calculateUpgradeCost(player.maxInventoryCount)}{" "}
            credits
          </button>
        </div>

        <div className="col-12 mb-5 holo">
          <p>Your Max Health is {player.maxHealth}.</p>
          <button onClick={() => handleUpgrade("health")}>
            Upgrade Health for {calculateUpgradeCost(player.maxHealth)} credits
          </button>
        </div>

        <div className="col-12 mb-5 holo">
          <p>Your Max Energy is {player.maxEnergy}.</p>
          <button onClick={() => handleUpgrade("energy")}>
            Upgrade Energy for {calculateUpgradeCost(player.maxEnergy)} credits
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUpgradeComponent;
