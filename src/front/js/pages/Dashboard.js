import React from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import ResetPlayerStats from "../component/resetPlayerStats";

export function Dashboard() {
  const { store, actions } = React.useContext(Context);
  const navigate = useNavigate();
  const [newName, setNewName] = React.useState(""); // 1. Local state for the new name
  const { player } = store;

  const goTo = (location) => {
    navigate(location);
  };

  const handleLevelUp = () => {
    const updatedPlayer = {
      ...player,
      level: player.level + 1,
      credits: player.credits + 1000,
      energy: player.energy + 100,
      health: player.health + 100,
    };
    actions.updatePlayer(updatedPlayer);
  };

  const handleChangeName = () => {
    // 3. Handler for changing name
    const updatedPlayer = { ...store.player, name: newName };
    actions.updatePlayer(updatedPlayer);
    setNewName(""); // Reset the input field after update.
  };

  return (
    <div className="row  d-flex justify-content-center text-center ">
      <div className="col-12  mb-5">
        <h1>Dashboard</h1>
      </div>

      <div className="row  shipinside holo m-0   ">
        <div className="col-12 mb-5">
          <h2 className="mb-5">Hello {store.player.name}!</h2>
          <h3>It's great to see you.</h3>
        </div>
        <div className="col-12 mb-5">
          <input // 2. Input field for new name
            type="text"
            placeholder={store.player.name}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleChangeName}>Change Name</button>
        </div>
        <div className="col-12 mb-5">
          <ResetPlayerStats />
        </div>
        <div className="col-12 mb-5">
          <button onClick={handleLevelUp}>
            Gain a Level, 1000 Credits and 100 Health/Energy.
          </button>
        </div>
        <div className="col-12 mb-5">
          <button onClick={() => goTo("/")}>Back to Game</button>
          <div className="col-12 mb-5"></div>
          <button
            className="btn btn-outline-primary"
            onClick={() => actions.logout()}
          >
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
