import React, { useContext } from "react";
import { Context } from "../store/appContext";

const InventoryUpgradeComponent = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  // Define the base cost and multiplier for exponential cost increase
  const BASE_COST = 100; // Example base cost
  const COST_MULTIPLIER = 1.5; // Example multiplier

  // Calculate the cost based on the current maxInventoryCount
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

  return (
    <div className="row d-flex justify-content-center mt-5 mb-5">
      <h3 className="mb-5">Inventory Upgrade</h3>
      <div className="row w-50">
        <div className="col-12 mb-5 holo">
          <p>
            You can currently store {player.maxInventoryCount} of each item.
          </p>
          <button onClick={handleUpgradeClick}>
            Upgrade Inventory for {calculateUpgradeCost()} credits
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryUpgradeComponent;
