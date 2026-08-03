import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const FILTERS = {
  all: { label: "All Price Changes", types: null },
  up: { label: "Price Increases", types: ["price-up"] },
  down: { label: "Price Decreases", types: ["price-down"] },
};

const NotificationsComponent = () => {
  const { store } = useContext(Context);
  const { notifications } = store;
  const [filter, setFilter] = useState("all");

  const allowedTypes = FILTERS[filter].types;
  const visibleNotifications = allowedTypes
    ? notifications.filter((notification) =>
        allowedTypes.includes(notification.type || "info")
      )
    : notifications;

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
