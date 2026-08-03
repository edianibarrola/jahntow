import React from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import ResetPlayerStats from "../component/resetPlayerStats";
import PrestigeButton from "../component/prestigeButton";

export function Dashboard() {
  const { store, actions } = React.useContext(Context);
  const navigate = useNavigate();
  const [newName, setNewName] = React.useState("");

  const goTo = (location) => {
    navigate(location);
  };

  const handleChangeName = () => {
    if (!newName.trim()) {
      return;
    }
    actions.updatePlayerName(newName.trim());
    setNewName("");
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
          <input
            type="text"
            placeholder={store.player.name}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button onClick={handleChangeName}>Change Name</button>
        </div>
        <div className="col-12 mb-5">
          <PrestigeButton />
        </div>
        <div className="col-12 mb-5">
          <ResetPlayerStats />
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
