import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import StoryMissionDetailsComponent from "./storyMissionDetailsComponent";
import { previewSuccessChance } from "../missionOdds";

const STORY_WINS_PER_UNLOCK = 2;

const StoryMissions = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const storyMissionsData = gameData.storyMissions || {};
  const [isStoryMissionRunning, setStoryMissionRunning] = useState(false);

  // Mirrors STORY_WINS_PER_UNLOCK in src/api/game_routes.py - the server
  // is what actually enforces which story mission may be run.
  const availableMissionIndex = Math.floor(player.storyWins / STORY_WINS_PER_UNLOCK);
  const availableMissionName =
    Object.keys(storyMissionsData)[availableMissionIndex];

  const runStoryMission = (missionName) => {
    setStoryMissionRunning(true);
    actions
      .startStoryMission(missionName)
      // flux.js already surfaces both the result and any failure via the
      // activity toast/log - nothing left to do here on rejection besides
      // making sure it doesn't become an unhandled promise rejection.
      .catch(() => {})
      .finally(() => {
        setStoryMissionRunning(false);
      });
  };

  return (
    <div className="row mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
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
              const startWin = index * STORY_WINS_PER_UNLOCK;

              if (
                player.storyWins >= startWin &&
                player.storyWins < startWin + STORY_WINS_PER_UNLOCK
              ) {
                const isUnlocked = storyMissionName === availableMissionName;
                // Mirrors the backend's own gate in player_meets_requirements:
                // a failed attempt costs "Health Effect" health, so refuse to
                // even offer a mission that could drop the player to 0.
                const wouldSurvive =
                  player.health - storyMissionData["Health Effect"] > 0;
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
                          <li style={{ color: wouldSurvive ? undefined : "#ff8a8a" }}>
                            Health Risk: -{storyMissionData["Health Effect"]}
                          </li>
                          <li>
                            Est. Success Chance:{" "}
                            {previewSuccessChance(player, storyMissionData)}%
                          </li>
                          <li>Required Equipment:</li>
                          <ul>
                            {Object.entries(
                              storyMissionData.requiredEquipment || {}
                            ).map(([equipment, quantity]) => {
                              const owned =
                                player.equipment[equipment]?.quantity || 0;
                              const met = owned >= quantity;
                              return (
                                <li
                                  key={equipment}
                                  style={{
                                    color: met ? "#8aff8a" : "#ff8a8a",
                                  }}
                                >
                                  {equipment} x{quantity} (Owned: {owned})
                                </li>
                              );
                            })}
                          </ul>
                        </ul>
                        {!isUnlocked ? (
                          <p className="text-muted">
                            Complete "{availableMissionName}" first to unlock
                            this one.
                          </p>
                        ) : !wouldSurvive ? (
                          <p className="tx-error">
                            Your health is too low to survive a failed
                            attempt. Recover first.
                          </p>
                        ) : (
                          <button
                            onClick={() => runStoryMission(storyMissionName)}
                            disabled={isStoryMissionRunning}
                          >
                            {isStoryMissionRunning
                              ? "Running..."
                              : "Run Mission"}
                          </button>
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
