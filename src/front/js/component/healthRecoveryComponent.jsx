import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const HealthRecoveryComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const healthRecoveryItems = gameData.healthRecoveryItems || {};

  // Cooldowns are enforced server-side and are now serialized to the client,
  // so the remaining time can be shown up front instead of the player only
  // discovering it from a 429 error toast after clicking.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const cooldownRemaining = (item, data) => {
    const lastUsedIso = (player.itemCooldowns || {})[item];
    if (!lastUsedIso) return 0;
    // Backend stores naive UTC ISO strings; append Z so the browser doesn't
    // read them as local time.
    const iso = lastUsedIso.endsWith("Z") ? lastUsedIso : `${lastUsedIso}Z`;
    const elapsed = (now - new Date(iso).getTime()) / 1000;
    return Math.max(0, Math.ceil((data.Cooldown || 0) - elapsed));
  };

  const handleButtonClick = (item) => {
    // flux.js's useRecoveryItem already turns cooldown (429) and other
    // failures into a toast/activity-log entry.
    actions.useRecoveryItem(item).catch(() => {});
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
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
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
            {Object.keys(filteredItems[category]).map((item) => {
              const data = filteredItems[category][item];
              const remaining = cooldownRemaining(item, data);
              return (
                <div key={item} className="col-12">
                  <button
                    className="healthbutton"
                    onClick={() => handleButtonClick(item)}
                    disabled={remaining > 0 || player.credits < data.Cost}
                  >
                    {generateButtonLabel(item, category)}
                    {remaining > 0 && ` | ready in ${remaining}s`}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthRecoveryComponent;
