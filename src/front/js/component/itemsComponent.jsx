import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const ItemsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, marketPrices, gameData } = store;
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);

  const rankByItem = {};
  Object.values(gameData.items || {}).forEach((items) => {
    Object.entries(items).forEach(([itemName, data]) => {
      rankByItem[itemName] = data.Rank;
    });
  });

  const pricesByCategory = {};
  (marketPrices || []).forEach((price) => {
    if (!pricesByCategory[price.category]) {
      pricesByCategory[price.category] = [];
    }
    pricesByCategory[price.category].push(price);
  });

  const handleBuy = () => {
    if (!selectedItem) {
      alert("Please select an item!");
      return;
    }
    actions.buyItem(selectedItem, quantity).catch((error) => {
      alert(error.message || "Failed to buy item");
    });
  };

  const handleSell = () => {
    if (!selectedItem) {
      alert("Please select an item!");
      return;
    }
    actions.sellItem(selectedItem, quantity).catch((error) => {
      alert(error.message || "Failed to sell item");
    });
  };

  const handleSelectChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  return (
    <div className="row  mb-3">
      <div className="row mb-2 holo sticky-top">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12  text-center  ">
          <p>Buy/Sell an item:</p>
        </div>
        <div className="col-12  text-center ">
          <select onChange={handleSelectChange} value={selectedItem}>
            <option value="">Select an item</option>
            {Object.entries(pricesByCategory).map(([category, items]) =>
              items
                .filter((item) => rankByItem[item.item_name] <= player.level)
                .map((item) => (
                  <option key={item.item_name} value={item.item_name}>
                    {item.item_name}
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
      </div>

      <div className="row">
        {Object.entries(pricesByCategory).map(([category, items]) => (
          <div className="col-12  text-center holo" key={category}>
            <h4 className="text-center">{category}</h4>
            <ul>
              {items
                .filter((item) => rankByItem[item.item_name] <= player.level)
                .map((item) => (
                  <li
                    key={item.item_name}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.item_name}: Base: {item.base_cost.toFixed(0)},
                      Current Cost: {item.current_cost.toFixed(1)}
                    </span>
                    {player.inventory[item.item_name] && (
                      <span className="ml-auto">
                        Qty: {player.inventory[item.item_name].quantity}
                      </span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsComponent;
