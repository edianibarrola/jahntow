import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

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

    if (player.credits >= healthRecoveryItems[category][item].Cost) {
      // Deduct cost from player's credits
      const updatedPlayer = {
        ...player,
        credits: player.credits - healthRecoveryItems[category][item].Cost,
        health:
          player.health + healthRecoveryItems[category][item]["Health Gain"],
        energy:
          player.energy + healthRecoveryItems[category][item]["Energy Gain"],
      };
      actions.updatePlayer(updatedPlayer);

      // Set a cooldown for this item
      setCooldowns({
        ...cooldowns,
        [item]: currentTime,
      });

      alert(
        `You used ${item}! Your health increased by ${healthRecoveryItems[category][item]["Health Gain"]} and gained: ${healthRecoveryItems[category][item]["Energy Gain"]} energy`
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
    <div className="row m-0">
      <div className="col-12 text-center">
        <h1>Recovery</h1>
      </div>
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
  );
};

export default HealthRecoveryComponent;
