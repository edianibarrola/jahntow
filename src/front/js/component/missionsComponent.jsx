import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { previewSuccessChance } from "../missionOdds";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const missionsData = gameData.missions || {};
  const [runningMission, setRunningMission] = useState(null);

  const runMission = (missionName) => {
    setRunningMission(missionName);
    actions
      .startMission(missionName)
      .then((data) => {
        if (data.died) {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert(error.message || "Failed to start mission");
      })
      .finally(() => {
        setRunningMission(null);
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
                      <li>
                        Est. Success Chance:{" "}
                        {previewSuccessChance(player, missionData)}%
                      </li>
                      <li>Required Equipment:</li>
                      <ul>
                        {Object.entries(missionData.requiredEquipment).map(
                          ([equipment, quantity]) => {
                            const owned =
                              player.equipment[equipment]?.quantity || 0;
                            const met = owned >= quantity;
                            return (
                              <li
                                key={equipment}
                                style={{ color: met ? "#8aff8a" : "#ff8a8a" }}
                              >
                                {equipment} x{quantity} (Owned: {owned})
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </ul>
                    <button
                      onClick={() => runMission(missionName)}
                      disabled={runningMission !== null}
                    >
                      {runningMission === missionName
                        ? "Running..."
                        : "Run Mission"}
                    </button>
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
