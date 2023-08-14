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

    if (
      cooldowns[item] &&
      currentTime - cooldowns[item] <
        healthRecoveryItems[category][item].Cooldown * 1000
    ) {
      alert(`This item is on cooldown!`);
      return;
    }

    // Check if player's health is already at or above maxHealth
    if (player.health >= player.maxHealth) {
      alert("Your health is already at its maximum. You can't use this item.");
      return;
    }

    if (player.credits >= healthRecoveryItems[category][item].Cost) {
      // Calculate the potential new health after using the item
      const potentialNewHealth =
        player.health + healthRecoveryItems[category][item]["Health Gain"];

      // Adjust the actual health gain to not exceed maxHealth
      const actualHealthGain =
        potentialNewHealth > player.maxHealth
          ? player.maxHealth - player.health
          : healthRecoveryItems[category][item]["Health Gain"];

      // Update player's health and energy
      const updatedPlayer = {
        ...player,
        credits: player.credits - healthRecoveryItems[category][item].Cost,
        health: player.health + actualHealthGain,
        energy:
          player.energy + healthRecoveryItems[category][item]["Energy Gain"],
      };
      actions.updatePlayer(updatedPlayer);

      // Set a cooldown for this item
      setCooldowns({
        ...cooldowns,
        [item]: currentTime,
      });

      if (
        actualHealthGain < healthRecoveryItems[category][item]["Health Gain"]
      ) {
        alert(
          `You used ${item}! Your health increased by ${actualHealthGain}, reaching your maximum health. You also gained ${healthRecoveryItems[category][item]["Energy Gain"]} energy.`
        );
      } else {
        alert(
          `You used ${item}! Your health increased by ${actualHealthGain} and you gained ${healthRecoveryItems[category][item]["Energy Gain"]} energy.`
        );
      }
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
