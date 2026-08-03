import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { EQUIPMENT_PERKS, perkBonusPct } from "../equipmentPerks";

const EquipmentShopComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData, activeEvents } = store;
  const equipmentItems = gameData.equipment || {};

  // A traveling-merchant event discounts one category's Base Cost; the
  // multiplier is the fraction actually charged (mirrors the server's
  // pricing in the equipment-buy endpoint).
  const merchantFor = (category) =>
    (activeEvents || []).find(
      (e) => e.kind === "merchant" && e.category === category
    );
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

  const handleSellEquipment = (itemName) => {
    const quantity = getQuantity(itemName);
    setBuyingItem(itemName);
    actions
      .sellEquipment(itemName, quantity)
      .catch(() => {})
      .finally(() => setBuyingItem(null));
  };

  // Storage is a shared locker across all equipment types, so the player
  // needs to see the total, not just per-item counts.
  const heldTotal = Object.values(player.equipment || {}).reduce(
    (sum, entry) => sum + (entry.quantity || 0),
    0
  );
  const capacity = player.maxEquipmentCount || 0;
  const spaceLeft = capacity - heldTotal;

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
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p>
            Equipment — Storage:{" "}
            <span className={spaceLeft <= 0 ? "tx-error" : undefined}>
              {heldTotal}/{capacity}
            </span>{" "}
            <span className="tx-info">(upgrade capacity on the Upgrades tab)</span>
          </p>
        </div>
      </div>

      <div className="row">
        {Object.entries(unlockedEquipmentItems).map(([category, items]) => {
          const merchant = merchantFor(category);
          const offPct = merchant
            ? Math.round((1 - merchant.multiplier) * 100)
            : 0;
          return (
          <div
            className="col-12 col-md-6 pl-5 pr-5 text-center holo"
            key={category}
          >
            <h4 className="text-center">
              {category}
              {merchant && (
                <span className="tx-merchant ms-2">🛒 {offPct}% off!</span>
              )}
            </h4>
            {EQUIPMENT_PERKS[category] && (
              <p className="tx-info">
                Perk: {EQUIPMENT_PERKS[category].sign}
                {EQUIPMENT_PERKS[category].perUnit}%{" "}
                {EQUIPMENT_PERKS[category].effect} per unit held (now{" "}
                {EQUIPMENT_PERKS[category].sign}
                {perkBonusPct(player, category, equipmentItems)}%, max{" "}
                {EQUIPMENT_PERKS[category].sign}
                {EQUIPMENT_PERKS[category].cap}%)
              </p>
            )}
            <ul>
              {Object.entries(items).map(([itemName, data]) => {
                const owned = player.equipment[itemName]?.quantity || 0;
                const qty = getQuantity(itemName);
                const cost = merchant
                  ? Math.max(1, Math.round(data["Base Cost"] * merchant.multiplier))
                  : data["Base Cost"];
                return (
                <li
                  key={itemName}
                  className="d-flex justify-content-between align-items-center flex-wrap"
                >
                  <span>
                    {itemName}: Cost:{" "}
                    {merchant ? (
                      <>
                        <s className="tx-info">
                          {parseFloat(data["Base Cost"]).toFixed(2)}
                        </s>{" "}
                        <span className="tx-merchant">
                          {parseFloat(cost).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      parseFloat(cost).toFixed(2)
                    )}
                    {owned > 0 && <> (Owned: {owned})</>}
                  </span>
                  <span className="d-flex align-items-center">
                    <button
                      onClick={() => adjustQuantity(itemName, -1)}
                      disabled={buyingItem === itemName}
                    >
                      -
                    </button>
                    <span className="mx-2">{qty}</span>
                    <button
                      onClick={() => adjustQuantity(itemName, 1)}
                      disabled={buyingItem === itemName}
                    >
                      +
                    </button>
                    <button
                      className="ms-2"
                      onClick={() => handleBuyEquipment(itemName)}
                      disabled={buyingItem !== null || qty > spaceLeft}
                      title={qty > spaceLeft ? "Not enough equipment storage" : undefined}
                    >
                      {buyingItem === itemName ? "Buying..." : "Buy"}
                    </button>
                    <button
                      className="ms-1"
                      onClick={() => handleSellEquipment(itemName)}
                      disabled={buyingItem !== null || owned < qty}
                    >
                      Sell
                    </button>
                  </span>
                </li>
                );
              })}
            </ul>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default EquipmentShopComponent;
