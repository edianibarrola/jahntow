import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import PriceSparkline from "./priceSparkline";

const ItemsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, marketPrices, gameData, priceHistory } = store;
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
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
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
                // Items above the player's rank can't be *bought*, but they
                // can still be held (properties generate them) - so they
                // stay listed and sellable rather than becoming invisible
                // and unsellable stock.
                .filter(
                  (item) =>
                    rankByItem[item.item_name] <= player.level ||
                    (player.inventory[item.item_name]?.quantity || 0) > 0
                )
                .map((item) => {
                  const holding = player.inventory[item.item_name];
                  // Properties only deposit whole units now, but an
                  // inventory written before that could still hold a
                  // fraction. Floor it for every purpose, not just the
                  // label: valuing a 0.42 sliver showed a phantom
                  // "profit" on an item the player had fully sold out of.
                  const owned = Math.floor(holding?.quantity || 0);
                  const avgCost = holding?.avg_cost || 0;
                  const unrealizedPl =
                    owned > 0
                      ? Math.round(
                          (item.current_cost - avgCost) * owned * 100
                        ) / 100
                      : 0;
                  const quantity = getQuantity(item.item_name);
                  const locked = rankByItem[item.item_name] > player.level;
                  const eventMultiplier = item.event_multiplier || 1;
                  const hasEvent = Math.abs(eventMultiplier - 1) > 0.001;
                  return (
                    <li
                      key={item.item_name}
                      className="d-flex justify-content-between align-items-center flex-wrap"
                    >
                      <span>
                        {item.item_name}:{" "}
                        {/* Buy and sell differ by the market spread, so
                            showing only a single "current cost" left the
                            actual price of a purchase unknowable. The raw
                            base cost used to sit here; it said little on
                            its own, so it's now expressed as the distance
                            from base - which is the actual signal - and
                            the sparkline still draws base as a dashed
                            reference line. */}
                        Buy <span className="tx-price-up">{item.buy_price}</span> /
                        Sell <span className="tx-price-down">{item.sell_price}</span>
                        {item.pct_from_base != null && (
                          <span
                            className={
                              item.pct_from_base > 0 ? "tx-price-up" : "tx-price-down"
                            }
                            title={`Anchor price ${item.base_cost.toFixed(0)} — prices drift but are pulled back toward it`}
                          >
                            {" "}({item.pct_from_base > 0 ? "+" : ""}
                            {item.pct_from_base}% vs base)
                          </span>
                        )}
                        {item.volatility && (
                          <span className="tx-info"> · {item.volatility}</span>
                        )}
                        {hasEvent && (
                          <span className={eventMultiplier > 1 ? "tx-price-up" : "tx-price-down"}>
                            {" "}⚡{eventMultiplier > 1 ? "+" : ""}
                            {Math.round((eventMultiplier - 1) * 100)}%
                          </span>
                        )}
                        {locked && (
                          <span className="tx-info"> (rank {rankByItem[item.item_name]} — sell only)</span>
                        )}
                        {" "}
                        <PriceSparkline
                          series={priceHistory[item.item_name]}
                          baseCost={item.base_cost}
                        />
                        {owned > 0 && (
                          <>
                            {" "}
                            (Owned: {owned}/{player.maxInventoryCount},
                            Avg Cost: {avgCost.toFixed(2)},{" "}
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
                          disabled={
                            pendingItem !== null ||
                            locked ||
                            owned + quantity > player.maxInventoryCount
                          }
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
