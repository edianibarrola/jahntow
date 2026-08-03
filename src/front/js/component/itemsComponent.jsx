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
      .catch(() => {})
      .finally(() => setPendingItem(null));
  };

  const handleSell = (itemName) => {
    const quantity = getQuantity(itemName);
    setPendingItem(itemName);
    actions
      .sellItem(itemName, quantity)
      .catch(() => {})
      .finally(() => setPendingItem(null));
  };

  return (
    <div className="row  mb-3">
      <div className="row mb-2 holo sticky-top">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
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
                  const holding = player.inventory[item.item_name];
                  const owned = holding?.quantity || 0;
                  const avgCost = holding?.avg_cost || 0;
                  const unrealizedPl =
                    owned > 0
                      ? Math.round(
                          (item.current_cost - avgCost) * owned * 100
                        ) / 100
                      : 0;
                  const quantity = getQuantity(item.item_name);
                  return (
                    <li
                      key={item.item_name}
                      className="d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <span>
                        {item.item_name}: Base: {item.base_cost.toFixed(0)},
                        Current Cost: {item.current_cost.toFixed(1)}
                        {owned > 0 && (
                          <>
                            {" "}
                            {/* Property-produced items can accumulate at a
                                fractional rate (e.g. 0.05/tick for rare,
                                high-value items) - floor for display only,
                                the true fractional amount is still what's
                                compared against for selling. */}
                            (Owned: {Math.floor(owned)}, Avg Cost:{" "}
                            {avgCost.toFixed(2)},{" "}
                            <span
                              style={{
                                color:
                                  unrealizedPl > 0
                                    ? "#8aff8a"
                                    : unrealizedPl < 0
                                    ? "#ff8a8a"
                                    : undefined,
                              }}
                            >
                              {unrealizedPl >= 0 ? "+" : ""}
                              {unrealizedPl.toFixed(2)}
                            </span>
                            )
                          </>
                        )}
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
