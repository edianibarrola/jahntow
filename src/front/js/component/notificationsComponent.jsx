import React, { useContext } from "react";
import { Context } from "../store/appContext";

const NotificationsComponent = () => {
  const { store } = useContext(Context);
  const { notifications } = store;

  return (
    <div className="holo">
      <h2>Recent Price Changes:</h2>
      <ul>
        {notifications.map((notification, i) => (
          <li key={i}>{notification}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsComponent;
