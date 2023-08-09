import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const ItemsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, itemsData, transactions } = store;
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleBuy = () => {
    if (!selectedItem) {
      alert("Please select an item!");
      return;
    }

    const category = Object.keys(itemsData).find(
      (key) => itemsData[key][selectedItem]
    );
    if (category) {
      const data = itemsData[category][selectedItem];
      if (data) {
        const itemCost = data["Current Cost"];
        const currentCredits = player.credits;
        const totalCost = itemCost * quantity;
        const itemQuantity = player.inventory[selectedItem]?.quantity || 0;
        const newTotalQuantity = itemQuantity + quantity;

        // Check for maxInventoryCount
        if (newTotalQuantity > player.maxInventoryCount) {
          alert(
            `You cannot have more than ${player.maxInventoryCount} of this item.`
          );
          return;
        }

        if (currentCredits >= totalCost) {
          const newTransaction = `You bought ${quantity} ${selectedItem} at ${data[
            "Current Cost"
          ].toFixed(2)}`;

          const updatedPlayer = {
            ...player,
            credits: currentCredits - totalCost,
            inventory: {
              ...player.inventory,
              [selectedItem]: {
                ...data,
                quantity: newTotalQuantity,
              },
            },
          };
          actions.updatePlayer(updatedPlayer);
          actions.updateTransactions(newTransaction);
        } else {
          alert("Insufficient credits to buy this item!");
        }
      } else {
        alert("Invalid item selected!");
      }
    } else {
      alert("Invalid item selected!");
    }
  };

  const handleSell = () => {
    if (!selectedItem) {
      alert("Please select an item!");
      return;
    }

    const category = Object.keys(itemsData).find(
      (key) => itemsData[key][selectedItem]
    );
    if (category) {
      const data = itemsData[category][selectedItem];
      if (data) {
        const itemCost = data["Current Cost"];
        const currentCredits = player.credits;
        const itemQuantity = player.inventory[selectedItem]?.quantity || 0;
        const totalCost = itemCost * quantity;

        const newTransaction = `You sold ${quantity} ${selectedItem} at ${data[
          "Current Cost"
        ].toFixed(2)} each`;

        if (itemQuantity >= quantity) {
          const updatedPlayer = {
            ...player,
            // transactions: [...player.transactions, newTransaction],
            credits: currentCredits + totalCost,
            inventory: {
              ...player.inventory,
              [selectedItem]: {
                ...data,
                quantity: itemQuantity - quantity,
              },
            },
          };
          actions.updatePlayer(updatedPlayer);
          actions.updateTransactions(newTransaction);
        } else {
          alert("Insufficient quantity to sell!");
        }
      } else {
        alert("Invalid item selected!");
      }
    } else {
      alert("Invalid item selected!");
    }
  };

  const handleSelectChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  const maxRank = player.level < 10 ? 1 : player.level < 20 ? 2 : 3;

  return (
    <div className="row mb-3">
      <div className="col-12 text-center ">
        <h1>Market</h1>
      </div>

      {Object.entries(itemsData).map(([category, items]) => (
        <div
          className="col-12 col-md-6 pl-5 pr-5 text-center holo"
          key={category}
        >
          <h4 className="text-center">{category}</h4>
          <ul>
            {Object.entries(items)
              .filter(([, data]) => data.Rank <= maxRank)
              .map(([itemName, data]) => (
                <li
                  key={itemName}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    {itemName}: Base Cost: {data["Base Cost"].toFixed(1)},
                    Current Cost: {data["Current Cost"].toFixed(1)}
                  </span>
                  {player.inventory[itemName] && (
                    <span className="ml-auto">
                      Qty: {player.inventory[itemName].quantity.toFixed(2)}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="col-12 text-center">
        <p>Buy/Sell an item:</p>
        <select onChange={handleSelectChange} value={selectedItem}>
          <option value="">Select an item</option>
          {Object.entries(itemsData).map(([category, items]) =>
            Object.entries(items)
              .filter(([, data]) => data.Rank <= maxRank)
              .map(([itemName]) => (
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
        <button onClick={handleBuy}>Buy</button>
        <button onClick={handleSell}>Sell</button>
      </div>

      {/* ... remaining code ... */}
    </div>
  );
};

export default ItemsComponent;
