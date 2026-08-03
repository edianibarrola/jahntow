import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const HealthRecoveryComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const healthRecoveryItems = gameData.healthRecoveryItems || {};

  const handleButtonClick = (item) => {
    actions.useRecoveryItem(item).catch((error) => {
      if (error.status === 429) {
        alert(
          `This item is on cooldown. Try again in ${Math.ceil(
            error.data.retry_after_seconds
          )}s.`
        );
      } else {
        alert(error.message || "Failed to use item");
      }
    });
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
                  onClick={() => handleButtonClick(item)}
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
