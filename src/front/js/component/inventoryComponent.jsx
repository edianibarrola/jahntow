import React, { useContext } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { activePerks } from "../equipmentPerks";

// There was previously no way to see what you actually own. Holdings were
// only visible item-by-item inside the Market list, and that list filtered
// to items at or below your rank - so anything a property generated above
// your rank was invisible *and* unsellable.
const InventoryComponent = () => {
  const { store } = useContext(Context);
  const { player, marketPrices, gameData } = store;

  const priceByItem = {};
  (marketPrices || []).forEach((p) => {
    priceByItem[p.item_name] = p.current_cost;
  });

  const rankByItem = {};
  Object.values(gameData.items || {}).forEach((items) => {
    Object.entries(items).forEach(([itemName, data]) => {
      rankByItem[itemName] = data.Rank;
    });
  });

  // Whole units only - a sub-unit remainder is carried server-side (see
  // Player.production_remainders) and isn't ownable stock yet.
  const held = Object.entries(player.inventory || {}).filter(
    ([, entry]) => Math.floor(entry.quantity || 0) > 0
  );

  const equipmentHeld = Object.entries(player.equipment || {}).filter(
    ([, entry]) => (entry.quantity || 0) > 0
  );
  const equipmentTotal = equipmentHeld.reduce(
    (sum, [, entry]) => sum + (entry.quantity || 0),
    0
  );

  const totalValue = held.reduce(
    (sum, [name, entry]) =>
      sum + (priceByItem[name] || 0) * Math.floor(entry.quantity),
    0
  );

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p>Inventory — market value {totalValue.toFixed(0)} credits</p>
        </div>
      </div>

      <div className="col-12 holo mb-3">
        <h4 className="text-center">Goods</h4>
        {held.length === 0 ? (
          <p className="text-center tx-info">
            Nothing held. Buy on the Market tab, or buy a Property to generate
            goods passively.
          </p>
        ) : (
          <ul className="activity-list">
            {held.map(([name, entry]) => {
              const price = priceByItem[name] || 0;
              const quantity = Math.floor(entry.quantity);
              const value = price * quantity;
              const pl = (price - (entry.avg_cost || 0)) * quantity;
              return (
                <li
                  key={name}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {name}{" "}
                    <span className="tx-info">(rank {rankByItem[name] ?? "?"})</span>
                  </span>
                  <span>
                    {quantity} × {price.toFixed(0)} = {value.toFixed(0)}{" "}
                    <span className={pl >= 0 ? "tx-sell" : "tx-error"}>
                      ({pl >= 0 ? "+" : ""}
                      {pl.toFixed(0)})
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="col-12 holo">
        <h4 className="text-center">
          Equipment ({equipmentTotal}/{player.maxEquipmentCount})
        </h4>
        {activePerks(player, gameData.equipment).length > 0 && (
          <p className="text-center tx-info">
            Active perks:{" "}
            {activePerks(player, gameData.equipment)
              .map((p) => `${p.sign}${p.pct}% ${p.effect}`)
              .join(" · ")}
          </p>
        )}
        {equipmentHeld.length === 0 ? (
          <p className="text-center tx-info">No equipment owned.</p>
        ) : (
          <ul className="activity-list">
            {equipmentHeld.map(([name, entry]) => (
              <li
                key={name}
                className="d-flex justify-content-between align-items-center flex-wrap"
              >
                <span>{name}</span>
                <span>{entry.quantity}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InventoryComponent;
