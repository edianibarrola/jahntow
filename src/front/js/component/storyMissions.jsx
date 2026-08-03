import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import StoryMissionDetailsComponent from "./storyMissionDetailsComponent";

const StoryMissions = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const storyMissionsData = gameData.storyMissions || {};
  const [isStoryMissionRunning, setStoryMissionRunning] = useState(false);

  const availableMissionIndex = Math.floor(player.storyWins / 5);
  const availableMissionName =
    Object.keys(storyMissionsData)[availableMissionIndex];

  const runStoryMission = (missionName) => {
    setStoryMissionRunning(true);
    actions
      .startStoryMission(missionName)
      .then((data) => {
        if (data.died) {
          alert("Game Over - your progress has been reset.");
        }
      })
      .catch((error) => {
        alert(error.message || "Failed to start story mission");
      })
      .finally(() => {
        setStoryMissionRunning(false);
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
        <div className="col-12 text-center">
          <p>Story Missions:</p>
        </div>
      </div>
      <div className="row mb-5">
        <Accordion>
          {Object.entries(storyMissionsData).map(
            ([storyMissionName, storyMissionData], index) => {
              const startWin = index * 5; // Calculate the start win for the mission

              if (
                player.storyWins >= startWin &&
                player.storyWins < startWin + 5
              ) {
                const isRunnable = storyMissionName === availableMissionName;
                return (
                  <Accordion.Item
                    className="holo"
                    eventKey={storyMissionName} // Use storyMissionName as the eventKey
                    key={storyMissionName}
                  >
                    <Accordion.Header>{storyMissionName}</Accordion.Header>
                    <Accordion.Body>
                      <div className="col-12 pl-5 pr-5 text-center">
                        <ul className="holo">
                          <li>Reward: {storyMissionData.Reward}</li>
                          <li>
                            Required Credits:{" "}
                            {storyMissionData["Required Credits"]}
                          </li>
                          <li>
                            Required Energy:{" "}
                            {storyMissionData["Required Energy"]}
                          </li>
                          <li>
                            Health Risk: -{storyMissionData["Health Effect"]}
                          </li>
                          <li>Required Equipment:</li>
                          <ul>
                            {Object.entries(
                              storyMissionData.requiredEquipment
                            ).map(([equipment, quantity]) => (
                              <li key={equipment}>
                                {equipment} x{quantity}
                              </li>
                            ))}
                          </ul>
                        </ul>
                        {isRunnable ? (
                          <button
                            onClick={() => runStoryMission(storyMissionName)}
                            disabled={isStoryMissionRunning}
                          >
                            {isStoryMissionRunning
                              ? "Running..."
                              : "Run Mission"}
                          </button>
                        ) : (
                          <p className="text-muted">
                            Complete "{availableMissionName}" first to unlock
                            this one.
                          </p>
                        )}
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              } else {
                return null; // Don't render the mission if not available yet
              }
            }
          )}
        </Accordion>
      </div>
      <StoryMissionDetailsComponent />
    </div>
  );
};

export default StoryMissions;
