import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const HealthRecoveryComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, healthRecoveryItems } = store;

  const [cooldowns, setCooldowns] = useState({});

  const handleButtonClick = (category, item) => {
    const currentTime = Date.now();
  
    // Cooldown Check
    if (
      cooldowns[item] &&
      currentTime - cooldowns[item] <
        healthRecoveryItems[category][item].Cooldown * 1000
    ) {
      alert(`This item is on cooldown!`);
      return;
    }
  
    // Check for maxHealth if item category is Health or Combo
    if (
      (category === 'Health' || category === 'Combo') &&
      player.health >= player.maxHealth
    ) {
      alert("Your health is already at its maximum. You can't use this item.");
      return;
    }
  
    // Check for maxEnergy if item category is Energy or Combo
    if (
      (category === 'Energy' || category === 'Combo') &&
      player.energy >= player.maxEnergy
    ) {
      alert("Your energy is already at its maximum. You can't use this item.");
      return;
    }
  
    // Credit Check
    if (player.credits >= healthRecoveryItems[category][item].Cost) {
      // Calculate actual health and energy gains
      const potentialNewHealth =
        player.health + healthRecoveryItems[category][item]["Health Gain"];
      const potentialNewEnergy =
        player.energy + healthRecoveryItems[category][item]["Energy Gain"];
  
      const actualHealthGain =
        potentialNewHealth > player.maxHealth
          ? player.maxHealth - player.health
          : healthRecoveryItems[category][item]["Health Gain"];
  
      const actualEnergyGain =
        potentialNewEnergy > player.maxEnergy
          ? player.maxEnergy - player.energy
          : healthRecoveryItems[category][item]["Energy Gain"];
  
      // Update player's health and energy
      const updatedPlayer = {
        ...player,
        credits: player.credits - healthRecoveryItems[category][item].Cost,
        health: player.health + actualHealthGain,
        energy: player.energy + actualEnergyGain,
      };
  
      actions.updatePlayer(updatedPlayer);
  
      // Set a cooldown for this item
      setCooldowns({
        ...cooldowns,
        [item]: currentTime,
      });
  
      // Alert about actual health and/or energy gain
      alert(
        `You used ${item}! Your health increased by ${actualHealthGain} and you gained ${actualEnergyGain} energy.`
      );
  
    } else {
      alert("You do not have enough credits for this item.");
    }
  };
  
  
  

  const generateButtonLabel = (item, category) => {
    let label = `${item} | Cost: ${healthRecoveryItems[category][item].Cost}`;

    if (healthRecoveryItems[category][item]["Health Gain"] > 0) {
      label += ` | Health Gain: ${healthRecoveryItems[category][item]["Health Gain"]}`;
    }

    if (healthRecoveryItems[category][item]["Energy Gain"] > 0) {
      label += ` | Energy Gain: ${healthRecoveryItems[category][item]["Energy Gain"]}`;
    }

    return label;
  };

  const filteredItems = {};

  // Filter health recovery items based on rank and player level
  for (const category in healthRecoveryItems) {
    filteredItems[category] = {};
    for (const item in healthRecoveryItems[category]) {
      if (healthRecoveryItems[category][item].Rank <= player.level) {
        filteredItems[category][item] = healthRecoveryItems[category][item];
      }
    }
  }

  return (
    <div className="row mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-2 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12 text-center">
          <p>Recovery</p>
        </div>
      </div>
      <div className="row">
        {Object.keys(filteredItems).map((category) => (
          <div key={category} className="col-12 holo text-center">
            <h4>{category}</h4>
            {Object.keys(filteredItems[category]).map((item) => (
              <div key={item} className="col-12">
                <button
                  className="healthbutton"
                  onClick={() => handleButtonClick(category, item)}
                >
                  {generateButtonLabel(item, category)}
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecoveryComponent;
