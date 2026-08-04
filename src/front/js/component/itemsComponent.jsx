import React, { useContext, useMemo, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import PriceSparkline from "./priceSparkline";

// The market is a trading screen, not a catalog. The old layout was six
// stacked category panels rendering every item identically, so finding
// the actual play - what's cheap against its anchor, what's spiking,
// which position is in profit - meant reading twelve prose rows. This is
// a flat table with aligned columns, sortable by the signals a trader
// sorts by, with the player's own positions pulled out on top.

const SORTS = {
  category: { label: "By category", fn: (a, b) => a.category.localeCompare(b.category) || a.rank - b.rank },
  discount: { label: "Cheapest vs base", fn: (a, b) => (a.pct ?? 0) - (b.pct ?? 0) },
  premium: { label: "Priciest vs base", fn: (a, b) => (b.pct ?? 0) - (a.pct ?? 0) },
  volatility: {
    label: "Most volatile",
    fn: (a, b) =>
      ({ volatile: 0, active: 1, steady: 2 }[a.volatility] ?? 3) -
        ({ volatile: 0, active: 1, steady: 2 }[b.volatility] ?? 3) ||
      Math.abs(b.pct ?? 0) - Math.abs(a.pct ?? 0),
  },
  pl: { label: "Your P/L", fn: (a, b) => b.unrealized - a.unrealized },
};

const ItemsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, marketPrices, gameData, priceHistory } = store;
  const [quantities, setQuantities] = useState({});
  const [pendingItem, setPendingItem] = useState(null);
  const [sortKey, setSortKey] = useState("category");

  const rankByItem = {};
  Object.values(gameData.items || {}).forEach((items) => {
    Object.entries(items).forEach(([itemName, data]) => {
      rankByItem[itemName] = data.Rank;
    });
  });

  const rows = useMemo(() => {
    return (marketPrices || [])
      .map((item) => {
        const holding = player.inventory[item.item_name];
        // Floor pre-whole-unit legacy slivers for every purpose - valuing
        // a 0.42 fraction once showed phantom profit on a sold-out item.
        const owned = Math.floor(holding?.quantity || 0);
        const avgCost = holding?.avg_cost || 0;
        // Unrealized P/L at the SELL price - what liquidating now would
        // actually realize, not the mid-price neither side trades at.
        const unrealized =
          owned > 0
            ? Math.round((item.sell_price - avgCost) * owned * 100) / 100
            : 0;
        return {
          ...item,
          rank: rankByItem[item.item_name] ?? 99,
          owned,
          avgCost,
          unrealized,
          pct: item.pct_from_base,
          locked: (rankByItem[item.item_name] ?? 99) > player.level,
          eventMult: item.event_multiplier || 1,
        };
      })
      // Locked items stay listed while held (properties generate them) -
      // sellable, never invisible stock. Locked and unheld is just noise.
      .filter((r) => !r.locked || r.owned > 0)
      .sort(SORTS[sortKey].fn);
  }, [marketPrices, player.inventory, player.level, sortKey]);

  const positions = rows.filter((r) => r.owned > 0);
  const positionValue = positions.reduce(
    (sum, r) => sum + r.owned * r.sell_price, 0
  );
  const positionPl = positions.reduce((sum, r) => sum + r.unrealized, 0);

  const getQuantity = (itemName) => quantities[itemName] || 1;

  const adjustQuantity = (itemName, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Math.max(1, (prev[itemName] || 1) + delta),
    }));
  };

  const setQuantity = (itemName, value) => {
    const parsed = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [itemName]: Number.isNaN(parsed) ? 1 : Math.max(1, parsed),
    }));
  };

  // Max = as many as fit in the hold AND the wallet.
  const setMaxBuy = (row) => {
    const space = (player.maxInventoryCount || 0) - row.owned;
    const affordable =
      row.buy_price > 0 ? Math.floor(player.credits / row.buy_price) : 0;
    setQuantities((prev) => ({
      ...prev,
      [row.item_name]: Math.max(1, Math.min(space, affordable)),
    }));
  };

  const handleBuy = (itemName) => {
    setPendingItem(itemName);
    actions
      .buyItem(itemName, getQuantity(itemName))
      .catch(() => {})
      .finally(() => setPendingItem(null));
  };

  const handleSell = (itemName, qty) => {
    setPendingItem(itemName);
    actions
      .sellItem(itemName, qty)
      .catch(() => {})
      .finally(() => setPendingItem(null));
  };

  const pctColor = (pct) =>
    pct > 0 ? "tx-price-up" : pct < 0 ? "tx-price-down" : "tx-info";

  const renderRow = (row) => {
    const quantity = getQuantity(row.item_name);
    const pending = pendingItem === row.item_name;
    const hasEvent = Math.abs(row.eventMult - 1) > 0.001;
    return (
      <div className="market-item" key={row.item_name}>
        <div className="market-line">
          <span>
            <strong>{row.item_name}</strong>
            <span className="market-tag">{row.category}</span>
            {row.locked && (
              <span className="tx-info market-tag">
                rank {row.rank} — sell only
              </span>
            )}
          </span>
          <span>
            <span className="tx-price-up">{row.buy_price}</span>
            {" / "}
            <span className="tx-price-down">{row.sell_price}</span>
            {hasEvent && (
              <span className={row.eventMult > 1 ? "tx-price-up" : "tx-price-down"}>
                {" "}⚡{row.eventMult > 1 ? "+" : ""}
                {Math.round((row.eventMult - 1) * 100)}%
              </span>
            )}
          </span>
          <span
            className={pctColor(row.pct)}
            title={`Anchor price ${row.base_cost.toFixed(0)} — prices drift but are pulled back toward it`}
          >
            {row.pct != null ? `${row.pct > 0 ? "+" : ""}${row.pct}%` : "—"}
          </span>
          <span>
            <PriceSparkline
              series={priceHistory[row.item_name]}
              baseCost={row.base_cost}
            />
            {row.volatility && (
              <span className="tx-info market-tag">{row.volatility}</span>
            )}
          </span>
          <span>
            {row.owned > 0 ? (
              <>
                Owned: {row.owned}/{player.maxInventoryCount} @{" "}
                {row.avgCost.toFixed(2)}{" "}
                <span
                  className={row.unrealized >= 0 ? "tx-sell" : "tx-error"}
                >
                  {row.unrealized >= 0 ? "+" : ""}
                  {row.unrealized.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="tx-info">—</span>
            )}
          </span>
        </div>
        <div className="market-controls">
          {quantity > 1 && (
            <span className="tx-info small me-2">
              cost {(row.buy_price * quantity).toLocaleString()} · sell{" "}
              {(row.sell_price * quantity).toLocaleString()}
            </span>
          )}
          <button onClick={() => adjustQuantity(row.item_name, -1)} disabled={pending}>
            -
          </button>
          <input
            type="number"
            min="1"
            className="mx-1 qty-input"
            value={quantity}
            onChange={(e) => setQuantity(row.item_name, e.target.value)}
            disabled={pending}
          />
          <button onClick={() => adjustQuantity(row.item_name, 1)} disabled={pending}>
            +
          </button>
          <button
            className="ms-1"
            onClick={() => setMaxBuy(row)}
            disabled={pending || row.locked}
            title="Set quantity to as many as fit in your hold and wallet"
          >
            Max
          </button>
          <button
            className="ms-2"
            onClick={() => handleBuy(row.item_name)}
            disabled={
              pendingItem !== null ||
              row.locked ||
              row.owned + quantity > player.maxInventoryCount
            }
          >
            {pending ? "..." : "Buy"}
          </button>
          <button
            className="ms-1"
            onClick={() => handleSell(row.item_name, quantity)}
            disabled={pendingItem !== null || row.owned < quantity}
          >
            Sell
          </button>
          {row.owned > 0 && (
            <button
              className="ms-1"
              onClick={() => handleSell(row.item_name, row.owned)}
              disabled={pendingItem !== null}
            >
              All
            </button>
          )}
        </div>
      </div>
    );
  };

  const header = (
    <div className="market-line market-head">
      <span>Item</span>
      <span>Buy / Sell</span>
      <span title="Distance from the anchor price the market pulls back toward">
        vs base
      </span>
      <span>Trend</span>
      <span>Position</span>
    </div>
  );

  return (
    <div className="row  mb-3">
      <div className="row mb-2 holo sticky-top">
        <div className="row pt-2 pb-1 m-0 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12 text-center d-flex justify-content-center align-items-center flex-wrap gap-2 pb-1">
          <span>Market</span>
          <select
            className="market-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            title="Sort the board"
          >
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {positions.length > 0 && (
        <div className="col-12 holo mb-2">
          <h5 className="text-center mb-1">
            Your positions ({positions.length}) · value{" "}
            {Math.round(positionValue).toLocaleString()} ·{" "}
            <span className={positionPl >= 0 ? "tx-sell" : "tx-error"}>
              {positionPl >= 0 ? "+" : ""}
              {positionPl.toFixed(2)}
            </span>
          </h5>
          {header}
          {positions.map(renderRow)}
        </div>
      )}

      <div className="col-12 holo">
        <h5 className="text-center mb-1">All goods</h5>
        {header}
        {rows.map(renderRow)}
      </div>
    </div>
  );
};

export default ItemsComponent;
