import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { successBreakdown } from "../missionOdds";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const missionsData = gameData.missions || {};
  const [runningMission, setRunningMission] = useState(null);

  const runMission = (missionName) => {
    setRunningMission(missionName);
    actions
      .startMission(missionName)
      // flux.js already surfaces both the result and any failure via the
      // activity toast/log - nothing left to do here on rejection besides
      // making sure it doesn't become an unhandled promise rejection.
      .catch(() => {})
      .finally(() => {
        setRunningMission(null);
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

        <div className="col-12  text-center  ">
          <p>Missions:</p>
        </div>
      </div>

      <div className="row  mb-5">
        <Accordion>
          {Object.entries(missionsData)
            .filter(([, missionData]) => missionData.Rank <= player.level)
            .map(([missionName, missionData], index) => {
              // Mirrors the backend's own gate in player_meets_requirements:
              // a failed attempt costs "Health Effect" health, so refuse to
              // even offer a mission that could drop the player to 0.
              const wouldSurvive =
                player.health - missionData["Health Effect"] > 0;
              const odds = successBreakdown(player, missionData);
              return (
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
                        <li>
                          Required Energy: {missionData["Required Energy"]}
                        </li>
                        <li style={{ color: wouldSurvive ? undefined : "#ff8a8a" }}>
                          Health Risk: -{missionData["Health Effect"]}
                        </li>
                        {missionData.Guaranteed ? (
                          <li className="tx-sell">
                            Always succeeds — a guaranteed fallback when you're
                            short on credits.
                          </li>
                        ) : (
                          <li>
                            Est. Success Chance: {odds.chance}%{" "}
                            <span className="tx-info">
                              (base {odds.basePct}%
                              {odds.levelPct !== 0 &&
                                `, level ${odds.levelPct > 0 ? "+" : ""}${odds.levelPct}%`}
                              , gear +{odds.gearPct}% of {odds.gearMaxPct}% max)
                            </span>
                          </li>
                        )}
                        {odds.gearCapped && (
                          <li className="tx-info">
                            Gear bonus is maxed — spares beyond{" "}
                            {odds.usefulSpares} add nothing.
                          </li>
                        )}
                        <li>Required Equipment:</li>
                        <ul>
                          {Object.entries(missionData.requiredEquipment || {}).map(
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
                      {wouldSurvive ? (
                        <button
                          onClick={() => runMission(missionName)}
                          disabled={runningMission !== null}
                        >
                          {runningMission === missionName
                            ? "Running..."
                            : "Run Mission"}
                        </button>
                      ) : (
                        <p className="tx-error">
                          Your health is too low to survive a failed attempt.
                          Recover first.
                        </p>
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
        </Accordion>
      </div>
    </div>
  );
};

export default MissionsComponent;
