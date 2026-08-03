import React, { useContext } from "react";
import { Context } from "../store/appContext";

const NotificationsComponent = () => {
  const { store } = useContext(Context);
  const { notifications } = store;

  return (
    <div className="holo">
      <h2>Recent Price Changes:</h2>
      <ul className="activity-list">
        {notifications.length === 0 && (
          <li className="tx-info">No notable price moves yet.</li>
        )}
        {notifications.map((notification) => (
          <li key={notification.id} className={`tx-${notification.type || "info"}`}>
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
