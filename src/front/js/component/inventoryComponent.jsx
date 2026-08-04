import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { activePerks } from "../equipmentPerks";

// The one place that answers "what do I actually have?". Holdings used to
// be scattered: goods and equipment were listed here but could only be
// sold from their own tabs, and properties - often the largest thing a
// player owns - appeared nowhere but the Properties tab. Everything owned
// is now here, valued, and sellable in place.
const InventoryComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, marketPrices, gameData, activeEvents } = store;
  const [quantities, setQuantities] = useState({});
  const [pending, setPending] = useState(null);

  const getQty = (name) => quantities[name] || 1;
  const adjustQty = (name, delta, max) =>
    setQuantities((prev) => ({
      ...prev,
      [name]: Math.max(1, Math.min(max, (prev[name] || 1) + delta)),
    }));

  const priceByItem = {};
  (marketPrices || []).forEach((p) => {
    priceByItem[p.item_name] = p;
  });

  const rankByItem = {};
  Object.values(gameData.items || {}).forEach((items) => {
    Object.entries(items).forEach(([itemName, data]) => {
      rankByItem[itemName] = data.Rank;
    });
  });

  // Whole units only - a sub-unit remainder is carried server-side (see
  // Player.production_remainders) and isn't ownable stock yet.
  const held = Object.entries(player.inventory || {})
    .map(([name, entry]) => [name, Math.floor(entry.quantity || 0), entry])
    .filter(([, quantity]) => quantity > 0);

  const equipmentHeld = Object.entries(player.equipment || {}).filter(
    ([, entry]) => (entry.quantity || 0) > 0
  );
  const equipmentTotal = equipmentHeld.reduce(
    (sum, [, entry]) => sum + (entry.quantity || 0),
    0
  );

  // Equipment resale mirrors the sell endpoint: half of the CURRENT value,
  // which a traveling merchant discounts.
  const equipmentCatalog = {};
  Object.entries(gameData.equipment || {}).forEach(([category, entries]) => {
    Object.entries(entries).forEach(([name, data]) => {
      equipmentCatalog[name] = { ...data, category };
    });
  });
  const merchantFactor = (category) => {
    const event = (activeEvents || []).find(
      (e) => e.kind === "merchant" && e.category === category
    );
    return event ? event.multiplier : 1;
  };
  const equipmentResale = (name) => {
    const data = equipmentCatalog[name];
    if (!data) return 0;
    return Math.floor(data["Base Cost"] * merchantFactor(data.category) * 0.5);
  };

  const propertyCatalog = {};
  Object.values(gameData.properties || {}).forEach((entries) => {
    Object.entries(entries).forEach(([name, data]) => {
      propertyCatalog[name] = data;
    });
  });
  const ownedProperties = Object.entries(player.properties || {}).filter(
    ([, level]) => level > 0
  );

  // Property output waits in an uncollected pool and stops accruing once
  // the pool fills, so surfacing "ready to collect" (and whether anything
  // has stalled) is what tells the player to come back.
  const [collecting, setCollecting] = useState(null);
  const pendingEntries = Object.entries(player.pendingProduction || {}).filter(
    ([, qty]) => Math.floor(qty) > 0
  );
  const poolCap = (player.maxInventoryCount || 0) * 2;
  const collect = (propertyName) => {
    setCollecting(propertyName || "__all__");
    actions
      .collectProduction(propertyName)
      .catch(() => {})
      .finally(() => setCollecting(null));
  };

  const goodsValue = held.reduce(
    (sum, [name, quantity]) => sum + (priceByItem[name]?.sell_price || 0) * quantity,
    0
  );
  const equipmentValue = equipmentHeld.reduce(
    (sum, [name, entry]) => sum + equipmentResale(name) * (entry.quantity || 0),
    0
  );
  const netWorth = (player.credits || 0) + goodsValue + equipmentValue;

  const sellGoods = (name, quantity) => {
    setPending(name);
    actions
      .sellItem(name, quantity)
      .catch(() => {})
      .finally(() => setPending(null));
  };

  const sellGear = (name, quantity) => {
    setPending(name);
    actions
      .sellEquipment(name, quantity)
      .catch(() => {})
      .finally(() => setPending(null));
  };

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p className="m-0">
            Net worth {netWorth.toFixed(0)} credits{" "}
            <span className="tx-info">
              (goods {goodsValue.toFixed(0)} · gear {equipmentValue.toFixed(0)} at
              resale)
            </span>
          </p>
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
            {held.map(([name, quantity, entry]) => {
              const row = priceByItem[name];
              const sellPrice = row?.sell_price || 0;
              const value = sellPrice * quantity;
              const pl = (sellPrice - (entry.avg_cost || 0)) * quantity;
              const qty = Math.min(getQty(name), quantity);
              return (
                <li
                  key={name}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {name}{" "}
                    <span className="tx-info">(rank {rankByItem[name] ?? "?"})</span>
                    {row?.volatility && (
                      <span className="tx-info"> · {row.volatility}</span>
                    )}
                  </span>
                  <span className="d-flex align-items-center flex-wrap">
                    <span className="me-2">
                      {quantity} × {sellPrice.toFixed(0)} = {value.toFixed(0)}{" "}
                      <span className={pl >= 0 ? "tx-sell" : "tx-error"}>
                        ({pl >= 0 ? "+" : ""}
                        {pl.toFixed(0)})
                      </span>
                    </span>
                    <button
                      onClick={() => adjustQty(name, -1, quantity)}
                      disabled={pending === name}
                    >
                      -
                    </button>
                    <span className="mx-2">{qty}</span>
                    <button
                      onClick={() => adjustQty(name, 1, quantity)}
                      disabled={pending === name}
                    >
                      +
                    </button>
                    <button
                      className="ms-2"
                      onClick={() => sellGoods(name, qty)}
                      disabled={pending !== null}
                    >
                      Sell
                    </button>
                    <button
                      className="ms-1"
                      onClick={() => sellGoods(name, quantity)}
                      disabled={pending !== null}
                      title="Sell the whole holding"
                    >
                      All
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="col-12 holo mb-3">
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
            {equipmentHeld.map(([name, entry]) => {
              const quantity = entry.quantity || 0;
              const qty = Math.min(getQty(name), quantity);
              return (
                <li
                  key={name}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {name}{" "}
                    <span className="tx-info">
                      ({equipmentCatalog[name]?.category})
                    </span>
                  </span>
                  <span className="d-flex align-items-center flex-wrap">
                    <span className="me-2">
                      {quantity} ·{" "}
                      <span className="tx-info">
                        {equipmentResale(name)} each resale
                      </span>
                    </span>
                    <button
                      onClick={() => adjustQty(name, -1, quantity)}
                      disabled={pending === name}
                    >
                      -
                    </button>
                    <span className="mx-2">{qty}</span>
                    <button
                      onClick={() => adjustQty(name, 1, quantity)}
                      disabled={pending === name}
                    >
                      +
                    </button>
                    <button
                      className="ms-2"
                      onClick={() => sellGear(name, qty)}
                      disabled={pending !== null}
                    >
                      Sell
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="col-12 holo mb-5">
        <h4 className="text-center">Properties</h4>
        {ownedProperties.length === 0 ? (
          <p className="text-center tx-info">
            None owned. Properties generate goods passively on the Properties
            tab.
          </p>
        ) : (
          <ul className="activity-list">
            {ownedProperties.map(([name, level]) => {
              const data = propertyCatalog[name];
              if (!data) return null;
              // Status and action per property: which one has filled up,
              // and claim just that one.
              const waiting = Math.floor(
                (player.pendingProduction || {})[name] || 0
              );
              const full = waiting >= poolCap;
              return (
                <li
                  key={name}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {name} <span className="tx-property">(level {level})</span>{" "}
                    <span className="tx-info">
                      · {(data["Generation Rate"] * level).toFixed(2)}{" "}
                      {data["Item Generated"]} / 30s
                    </span>
                  </span>
                  <span className="d-flex align-items-center flex-wrap">
                    <span className={full ? "tx-error me-2" : "tx-info me-2"}>
                      {waiting}/{poolCap}
                      {full && " FULL"}
                    </span>
                    {waiting > 0 && (
                      <button
                        onClick={() => collect(name)}
                        disabled={collecting !== null}
                      >
                        {collecting === name ? "Claiming..." : "Claim"}
                      </button>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InventoryComponent;
