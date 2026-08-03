import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const EquipmentShopComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const equipmentItems = gameData.equipment || {};
  const [quantities, setQuantities] = useState({});
  const [buyingItem, setBuyingItem] = useState(null);

  const getQuantity = (itemName) => quantities[itemName] || 1;

  const adjustQuantity = (itemName, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + delta),
    }));
  };

  const handleBuyEquipment = (itemName) => {
    const quantity = getQuantity(itemName);
    setBuyingItem(itemName);
    actions
      .buyEquipment(itemName, quantity)
      .catch(() => {})
      .finally(() => setBuyingItem(null));
  };

  // Filter the equipment items based on the player's level
  const unlockedEquipmentItems = Object.entries(equipmentItems).reduce(
    (result, [category, items]) => {
      const unlockedItems = Object.entries(items).filter(
        ([itemName, data]) => player.level >= data["Required Level"]
      );
      if (unlockedItems.length > 0) {
        result[category] = Object.fromEntries(unlockedItems);
      }
      return result;
    },
    {}
  );

  return (
    <div className="row  mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p>Equipment:</p>
        </div>
      </div>

      <div className="row">
        {Object.entries(unlockedEquipmentItems).map(([category, items]) => (
          <div
            className="col-12 col-md-6 pl-5 pr-5 text-center holo"
            key={category}
          >
            <h4 className="text-center">{category}</h4>
            <ul>
              {Object.entries(items).map(([itemName, data]) => (
                <li
                  key={itemName}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {itemName}: Cost:{" "}
                    {parseFloat(data["Base Cost"]).toFixed(2)}
                    {player.equipment[itemName] && (
                      <> (Owned: {player.equipment[itemName].quantity})</>
                    )}
                  </span>
                  <span className="d-flex align-items-center">
                    <button
                      onClick={() => adjustQuantity(itemName, -1)}
                      disabled={buyingItem === itemName}
                    >
                      -
                    </button>
                    <span className="mx-2">{getQuantity(itemName)}</span>
                    <button
                      onClick={() => adjustQuantity(itemName, 1)}
                      disabled={buyingItem === itemName}
                    >
                      +
                    </button>
                    <button
                      className="ms-2"
                      onClick={() => handleBuyEquipment(itemName)}
                      disabled={buyingItem !== null}
                    >
                      {buyingItem === itemName ? "Buying..." : "Buy"}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentShopComponent;
