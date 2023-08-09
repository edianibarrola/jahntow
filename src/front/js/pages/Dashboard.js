import React from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import ResetPlayerStats from "../component/resetPlayerStats";

export function Dashboard() {
  const { store, actions } = React.useContext(Context);
  const navigate = useNavigate();
  const goTo = (location) => {
    // 2. Create an event handler function
    navigate(location); // 3. Inside this function, call the navigate function
  };
  return (
    <div>
      <h3>Dashboard</h3>
      <button
        className="btn btn-outline-primary"
        onClick={() => actions.logout()}
      >
        logout
      </button>
      <ResetPlayerStats />

      <button onClick={() => goTo("/")}>Back to Game</button>
    </div>
  );
}
