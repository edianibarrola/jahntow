import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const ItemsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, marketPrices, gameData } = store;
  const [quantities, setQuantities] = useState({});
  const [pendingItem, setPendingItem] = useState(null);

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

  const getQuantity = (itemName) => quantities[itemName] || 1;

  const adjustQuantity = (itemName, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + delta),
    }));
  };

  const handleBuy = (itemName) => {
    const quantity = getQuantity(itemName);
    setPendingItem(itemName);
    actions
      .buyItem(itemName, quantity)
      .catch((error) => {
        alert(error.message || "Failed to buy item");
      })
      .finally(() => setPendingItem(null));
  };

  const handleSell = (itemName) => {
    const quantity = getQuantity(itemName);
    setPendingItem(itemName);
    actions
      .sellItem(itemName, quantity)
      .catch((error) => {
        alert(error.message || "Failed to sell item");
      })
      .finally(() => setPendingItem(null));
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
          <p>Market:</p>
        </div>
      </div>

      <div className="row">
        {Object.entries(pricesByCategory).map(([category, items]) => (
          <div className="col-12  text-center holo" key={category}>
            <h4 className="text-center">{category}</h4>
            <ul>
              {items
                .filter((item) => rankByItem[item.item_name] <= player.level)
                .map((item) => {
                  const owned =
                    player.inventory[item.item_name]?.quantity || 0;
                  const quantity = getQuantity(item.item_name);
                  return (
                    <li
                      key={item.item_name}
                      className="d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <span>
                        {item.item_name}: Base: {item.base_cost.toFixed(0)},
                        Current Cost: {item.current_cost.toFixed(1)}
                        {owned > 0 && <> (Owned: {owned})</>}
                      </span>
                      <span className="d-flex align-items-center">
                        <button
                          onClick={() => adjustQuantity(item.item_name, -1)}
                          disabled={pendingItem === item.item_name}
                        >
                          -
                        </button>
                        <span className="mx-2">{quantity}</span>
                        <button
                          onClick={() => adjustQuantity(item.item_name, 1)}
                          disabled={pendingItem === item.item_name}
                        >
                          +
                        </button>
                        <button
                          className="ms-2"
                          onClick={() => handleBuy(item.item_name)}
                          disabled={pendingItem !== null}
                        >
                          {pendingItem === item.item_name ? "..." : "Buy"}
                        </button>
                        <button
                          className="ms-1"
                          onClick={() => handleSell(item.item_name)}
                          disabled={pendingItem !== null || owned < quantity}
                        >
                          Sell
                        </button>
                      </span>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsComponent;
