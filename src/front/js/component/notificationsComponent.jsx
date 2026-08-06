import React, { useContext, useMemo, useState } from "react";
import { Context } from "../store/appContext";

const FILTERS = {
  all: { label: "All Price Changes", types: null },
  up: { label: "Price Increases", types: ["price-up"] },
  down: { label: "Price Decreases", types: ["price-down"] },
};

const NotificationsComponent = () => {
  const { store } = useContext(Context);
  const { notifications, player, gameData } = store;
  const [filter, setFilter] = useState("all");

  // The feed is global (one shared market), but a line about an item the
  // player hasn't unlocked yet is pure noise - and a mild spoiler. Match
  // each line to the item it's about (longest name wins, so "Advanced
  // Medicines" never gets claimed by "Medicines") and hide it unless the
  // item is tradeable at this level or already held (properties generate
  // above-level goods, and those stay sellable).
  const itemIndex = useMemo(() => {
    const rankByItem = {};
    Object.values(gameData.items || {}).forEach((items) =>
      Object.entries(items).forEach(([name, data]) => {
        rankByItem[name] = data.Rank;
      })
    );
    const names = Object.keys(rankByItem).sort((a, b) => b.length - a.length);
    return { rankByItem, names };
  }, [gameData.items]);

  const concernsLockedItem = (message) => {
    const name = itemIndex.names.find((n) => message.includes(n));
    if (!name) return false;
    const held = (player.inventory?.[name]?.quantity || 0) > 0;
    return itemIndex.rankByItem[name] > player.level && !held;
  };

  const allowedTypes = FILTERS[filter].types;
  const visibleNotifications = notifications.filter(
    (notification) =>
      (!allowedTypes || allowedTypes.includes(notification.type || "info")) &&
      !concernsLockedItem(notification.message)
  );

  return (
    <div className="holo">
      <h2>Recent Price Changes:</h2>
      <select
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        className="mb-2"
      >
        {Object.entries(FILTERS).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      <ul className="activity-list">
        {visibleNotifications.length === 0 && (
          <li className="tx-info">No notable price moves yet.</li>
        )}
        {visibleNotifications.map((notification) => (
          <li key={notification.id} className={`tx-${notification.type || "info"}`}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
