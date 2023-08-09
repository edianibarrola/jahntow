import React from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import ResetPlayerStats from "../component/resetPlayerStats";

export function Dashboard() {
  const { store, actions } = React.useContext(Context);
  const navigate = useNavigate();
  const [newName, setNewName] = React.useState(""); // 1. Local state for the new name

  const goTo = (location) => {
    navigate(location);
  };

  const handleChangeName = () => {
    // 3. Handler for changing name
    const updatedPlayer = { ...store.player, name: newName };
    actions.updatePlayer(updatedPlayer);
    setNewName(""); // Reset the input field after update.
  };

  return (
    <div>
      <h3>Dashboard</h3>
      <h2>Hello {store.player.name}!</h2>
      <h4>It's great to see you.</h4>
      <input // 2. Input field for new name
        type="text"
        placeholder="Change player name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <button onClick={handleChangeName}>Change Name</button> // 2. Button to
      trigger name change
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
