import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const missionsData = gameData.missions || {};
  const [selectedMission, setSelectedMission] = useState("");
  const [isMissionRunning, setMissionRunning] = useState(false);

  const startMission = () => {
    if (!selectedMission) {
      alert("Please select a mission!");
      return;
    }

    setMissionRunning(true);
    actions
      .startMission(selectedMission)
      .then((data) => {
        alert(data.message);
        if (data.died) {
          alert("Game Over - your progress has been reset.");
        }
      })
      .catch((error) => {
        alert(error.message || "Failed to start mission");
      })
      .finally(() => {
        setMissionRunning(false);
      });
  };

  return (
    <div className="row mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>

        <div className="col-12  text-center  ">
          <p>Missions:</p>
        </div>
        <div className="col-12  text-center">
          <select
            onChange={(e) => setSelectedMission(e.target.value)}
            value={selectedMission}
          >
            <option value="">Select a mission</option>
            {Object.keys(missionsData)
              .filter(
                (missionName) => missionsData[missionName].Rank <= player.level
              )
              .map((missionName) => (
                <option key={missionName} value={missionName}>
                  {missionName}
                </option>
              ))}
          </select>
          <button onClick={startMission} disabled={isMissionRunning}>
            {isMissionRunning ? "Mission in progress..." : "Start Mission"}
          </button>
        </div>
      </div>

      <div className="row  mb-5">
        <Accordion>
          {Object.entries(missionsData)
            .filter(([, missionData]) => missionData.Rank <= player.level)
            .map(([missionName, missionData], index) => (
              <Accordion.Item
                className="holo"
                eventKey={index.toString()}
                key={missionName}
              >
                <Accordion.Header>{missionName}</Accordion.Header>
                <Accordion.Body>
                  <div className="col-12 pl-5 pr-5 text-center">
                    <ul className="holo">
                      <li>Reward: {missionData.Reward}</li>
                      <li>
                        Required Credits: {missionData["Required Credits"]}
                      </li>
                      <li>Required Energy: {missionData["Required Energy"]}</li>
                      <li> Health Risk: -{missionData["Health Effect"]}</li>
                      <li>Required Equipment:</li>
                      <ul>
                        {Object.entries(missionData.requiredEquipment).map(
                          ([equipment, quantity]) => (
                            <li key={equipment}>
                              {equipment} x{quantity}
                            </li>
                          )
                        )}
                      </ul>
                    </ul>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </div>
    </div>
  );
};

export default MissionsComponent;
