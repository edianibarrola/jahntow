import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const EquipmentShopComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, equipmentItems } = store;
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleBuyEquipment = () => {
    if (!selectedItem) {
      alert("Please select an equipment!");
      return;
    }

    const category = Object.keys(equipmentItems).find(
      (key) => equipmentItems[key][selectedItem]
    );
    if (category) {
      const data = equipmentItems[category][selectedItem];
      if (data) {
        // Check if the player's level is greater than or equal to the required level for the equipment
        if (player.level >= data["Required Level"]) {
          const equipmentCost = data["Current Cost"];
          const currentCredits = player.credits;
          const totalCost = equipmentCost * quantity;

          if (currentCredits >= totalCost) {
            const itemQuantity = player.equipment[selectedItem]?.quantity || 0;
            const newTransaction = `You bought ${quantity} ${selectedItem} at ${data[
              "Current Cost"
            ].toFixed(2)}`;

            const updatedPlayer = {
              ...player,
              credits: currentCredits - totalCost,
              equipment: {
                ...player.equipment,
                [selectedItem]: {
                  ...data,
                  quantity: itemQuantity + quantity,
                },
              },
            };
            actions.updatePlayer(updatedPlayer);
            actions.updateTransactions(newTransaction);
          } else {
            alert("Insufficient credits to buy this equipment!");
          }
        } else {
          alert("You need a higher level to purchase this equipment!");
        }
      } else {
        alert("Invalid equipment selected!");
      }
    } else {
      alert("Invalid equipment selected!");
    }
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

  const handleSelectChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  return (
    <div className="row  mb-3">
      <div className="col-12 text-center">
        <h1>Equipment Shop</h1>
      </div>

      {/* Display unlocked equipment items */}
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
                className="d-flex justify-content-between align-items-center"
              >
                <span>
                  {itemName}: Cost: {parseFloat(data["Base Cost"]).toFixed(2)}
                </span>
                {player.equipment[itemName] && (
                  <span className="ml-auto">
                    Qty: {player.equipment[itemName].quantity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="col-12 text-center">
        {/* Display buy menu */}
        <p>Buy equipment:</p>
        <select onChange={handleSelectChange} value={selectedItem}>
          <option value="">Select an equipment</option>
          {Object.entries(unlockedEquipmentItems).map(([category, items]) =>
            Object.entries(items).map(([itemName]) => (
              <option key={itemName} value={itemName}>
                {itemName}
              </option>
            ))
          )}
        </select>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
        <button onClick={handleBuyEquipment}>Buy</button>
      </div>
    </div>
  );
};

export default EquipmentShopComponent;
