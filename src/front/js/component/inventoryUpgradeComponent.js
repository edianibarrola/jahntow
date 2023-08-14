import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const InventoryUpgradeComponent = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  // Define the base cost and multiplier for exponential cost increase
  const BASE_COST = 100; // Example base cost
  const COST_MULTIPLIER = 1.5; // Example multiplier

  // INVENTORY STORAGE
  const calculateUpgradeCost = () => {
    return Math.floor(
      BASE_COST * Math.pow(COST_MULTIPLIER, player.maxInventoryCount / 10)
    );
  };

  const handleUpgradeClick = () => {
    const upgradeCost = calculateUpgradeCost();

    if (player.credits >= upgradeCost) {
      const updatedPlayer = {
        ...player,
        credits: player.credits - upgradeCost,
        maxInventoryCount: player.maxInventoryCount + 5, // Example increase value
      };
      actions.updatePlayer(updatedPlayer);

      alert(
        `Inventory upgraded! Your max inventory count is now ${updatedPlayer.maxInventoryCount}.`
      );
    } else {
      alert("You do not have enough credits for this upgrade.");
    }
  };

  // HEALTH
  const calculateHealthUpgradeCost = () => {
    return Math.floor(
      BASE_COST * Math.pow(COST_MULTIPLIER, player.maxHealth / 10)
    );
  };

  const handleHealthUpgradeClick = () => {
    const upgradeCost = calculateHealthUpgradeCost();

    if (player.credits >= upgradeCost) {
      const updatedPlayer = {
        ...player,
        credits: player.credits - upgradeCost,
        maxHealth: player.maxHealth + 5, // Example increase value
      };
      actions.updatePlayer(updatedPlayer);

      alert(
        `Health upgraded! Your max health is now ${updatedPlayer.maxHealth}.`
      );
    } else {
      alert("You do not have enough credits for this upgrade.");
    }
  };

  // ENERGY UPGRADE
  const calculateEnergyUpgradeCost = () => {
    return Math.floor(
      BASE_COST * Math.pow(COST_MULTIPLIER, player.maxEnergy / 10)
    );
  };
  const handleEnergyUpgradeClick = () => {
    const upgradeCost = calculateEnergyUpgradeCost();

    if (player.credits >= upgradeCost) {
      const updatedPlayer = {
        ...player,
        credits: player.credits - upgradeCost,
        maxEnergy: player.maxEnergy + 5, // Example increase value
      };
      actions.updatePlayer(updatedPlayer);

      alert(`Energy upgraded! Your max energy to ${updatedPlayer.maxEnergy}.`);
    } else {
      alert("You do not have enough credits for this upgrade.");
    }
  };

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-2 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12 text-center">
          <p>Recovery</p>
        </div>
      </div>
      <div className="row ">
        <div className="col-12 mb-5 holo">
          <p>
            You can currently store {player.maxInventoryCount} of each item.
          </p>
          <button onClick={handleUpgradeClick}>
            Upgrade Inventory for {calculateUpgradeCost()} credits
          </button>
        </div>

        <div className="col-12 mb-5 holo">
          <p>Your Max Health is {player.maxHealth}.</p>
          <button onClick={handleHealthUpgradeClick}>
            Upgrade Health for {calculateHealthUpgradeCost()} credits
          </button>
        </div>

        <div className="col-12 mb-5 holo">
          <p>Your Max Energy is {player.maxEnergy}.</p>
          <button onClick={handleEnergyUpgradeClick}>
            Upgrade Energy for {calculateEnergyUpgradeCost()} credits
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUpgradeComponent;
