import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import StoryMissionDetailsComponent from "./storyMissionDetailsComponent";
import { previewSuccessChance } from "../missionOdds";

// Mirrors STORY_WINS_PER_UNLOCK in src/api/game_routes.py, which is what
// actually enforces which story mission may be run.
const STORY_WINS_PER_UNLOCK = 5;

// Mirrors economy.REP_TIER_1/2 - display only, the server applies the perks.
const REP_TIERS = [10, 25];
const repTierLabel = (points) =>
  points >= 25 ? "Trusted Ally" : points >= 10 ? "Friend" : "Known";

// A pending chapter-end choice, presented as the chapter's epilogue. The
// catalog and validation are server-side; this renders player.pendingChoice
// with an honest effect hint per option (choices have permanent
// consequences now - the player deserves to know their shape, not their
// story outcome) and posts the picked option id.
const effectHint = (choice, option, gameData) => {
  const reward = option.reward || {};
  if (reward.credits_ref)
    return "pays credits, scaled to your level";
  if (reward.credits) return `+${reward.credits.toLocaleString()} credits`;
  if (reward.perk) {
    const perk = (gameData.storyChoicePerks || {})[reward.perk];
    return perk ? `permanent: ${perk.label}` : "a permanent perk";
  }
  if (reward.boon) {
    const band = (gameData.warbands || {})[reward.boon];
    return `permanent: +${gameData.warbandBoonReadiness || 10} readiness for the ${
      band?.name || reward.boon
    }`;
  }
  if (reward.rep) {
    const [faction, points] = Object.entries(reward.rep)[0];
    return `+${points} ${faction} reputation`;
  }
  if (reward.rep_all) return `+${reward.rep_all} reputation with all tribes`;
  if (reward.equipment) {
    const [name, qty] = Object.entries(reward.equipment)[0];
    return `+${qty}x ${name}`;
  }
  return null;
};

const StoryChoiceCard = ({ choice, onChoose, busy, gameData }) => (
  <div className="holo p-3 mb-3 choice-card">
    <h4 className="text-center">📖 A Decision Awaits</h4>
    <p>{choice.prompt}</p>
    <div className="d-flex flex-column gap-2">
      {choice.options.map((option) => {
        const hint = effectHint(choice, option, gameData);
        return (
          <button
            key={option.id}
            disabled={busy}
            onClick={() => onChoose(choice.id, option.id)}
          >
            {option.label}
            {hint && <span className="choice-hint">{hint}</span>}
          </button>
        );
      })}
    </div>
    <p className="tx-info text-center small mb-0 mt-2">
      The story will remember this — some choices echo chapters later.
    </p>
  </div>
);

const StoryMissions = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData } = store;
  const storyMissionsData = gameData.storyMissions || {};
  const [isStoryMissionRunning, setStoryMissionRunning] = useState(false);
  const [isChoosing, setChoosing] = useState(false);

  // One-click outfitting for the chapter's gear - estimate only; the
  // server reprices with merchant/ally discounts applied.
  const equipCostByName = {};
  Object.values(gameData.equipment || {}).forEach((items) =>
    Object.entries(items).forEach(([name, data]) => {
      equipCostByName[name] = data["Base Cost"];
    })
  );
  const missingFor = (missionData) => {
    let cost = 0;
    let count = 0;
    Object.entries(missionData.requiredEquipment || {}).forEach(([name, qty]) => {
      const short = qty - (player.equipment[name]?.quantity || 0);
      if (short > 0) {
        count += short;
        cost += short * (equipCostByName[name] || 0);
      }
    });
    return { count, cost: Math.round(cost) };
  };

  const outfitMission = (missionName) => {
    setStoryMissionRunning(true);
    actions
      .outfitMission(missionName)
      .catch(() => {})
      .finally(() => setStoryMissionRunning(false));
  };

  const reputation = player.reputation || {};
  const repEntries = Object.entries(reputation).filter(([, v]) => v > 0);

  const handleChoice = (choiceId, optionId) => {
    setChoosing(true);
    actions
      .resolveStoryChoice(choiceId, optionId)
      .catch(() => {})
      .finally(() => setChoosing(false));
  };

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
        {repEntries.length > 0 && (
          <div className="col-12 text-center pb-1">
            <p className="tx-rep m-0">
              🤝{" "}
              {repEntries
                .map(([faction, points]) => `${faction} ${points} (${repTierLabel(points)})`)
                .join(" · ")}
            </p>
          </div>
        )}
        {(() => {
          // War legacy: the permanent marks your choices left - perk
          // labels plus warband boons, derived from storyChoices.
          const perkLabels = Object.entries(player.storyChoices || {})
            .map(([choiceId, optionId]) =>
              (gameData.storyChoicePerks || {})[`${choiceId}:${optionId}`]
            )
            .filter(Boolean)
            .map((perk) => perk.label);
          const boonLabels = Object.entries(player.storyChoices || {})
            .map(([choiceId, optionId]) =>
              (gameData.warbandBoons || {})[`${choiceId}:${optionId}`]
            )
            .filter(Boolean)
            .map(
              (boon) =>
                `${boon.label} (+${gameData.warbandBoonReadiness || 10} ${
                  (gameData.warbands || {})[boon.faction]?.name || boon.faction
                } readiness)`
            );
          const legacy = [...perkLabels, ...boonLabels];
          if (legacy.length === 0) return null;
          return (
            <div className="col-12 text-center pb-1">
              <p className="tx-choice m-0 small">
                ✦ War legacy: {legacy.join(" · ")}
              </p>
            </div>
          );
        })()}
      </div>
      {player.pendingChoice && (
        <StoryChoiceCard
          choice={player.pendingChoice}
          onChoose={handleChoice}
          busy={isChoosing}
          gameData={gameData}
        />
      )}
      <div className="row mb-5">
        <Accordion defaultActiveKey={availableMissionName}>
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
                          {storyMissionData.Boss && (
                            <li className="tx-error">
                              ⚔️ BOSS FIGHT — success is capped at 75% no
                              matter how prepared you are, and the health
                              stakes are doubled.
                            </li>
                          )}
                          {storyMissionData.Faction && (
                            <li className="tx-rep">
                              Faction: {storyMissionData.Faction}
                              {storyMissionData.Faction !== "United Front" &&
                                ` (+1 rep per win — allies get discounts and better odds)`}
                            </li>
                          )}
                          {/* Story missions aren't level-gated, so knowing
                              what level a chapter is built for is the only
                              warning that you're attempting it early. Their
                              reward never falls off for out-levelling. */}
                          <li
                            style={{
                              color:
                                player.level < storyMissionData.Rank
                                  ? "#ff8a8a"
                                  : undefined,
                            }}
                          >
                            Suggested level: {storyMissionData.Rank}{" "}
                            <span className="tx-info">(you: {player.level})</span>
                          </li>
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
                          {(() => {
                            const gate = (gameData.storyWarbandGates || {})[
                              storyMissionName
                            ];
                            if (!gate) return null;
                            const bands = gameData.warbands || {};
                            if (gate.faction) {
                              const band = bands[gate.faction] || {};
                              const strength =
                                player.warbands?.[gate.faction]?.strength || 0;
                              const met = strength >= gate.strength;
                              return (
                                <li className={met ? "tx-rep" : "tx-error"}>
                                  ⚔️ War host: the {band.name || gate.faction}{" "}
                                  must number {gate.strength} —{" "}
                                  {met
                                    ? `ready (${strength} strong; their readiness boosts your odds below)`
                                    : `now ${strength}. Recruit on the Warbands tab.`}
                                </li>
                              );
                            }
                            const factions = Object.keys(bands);
                            const average = factions.length
                              ? factions.reduce(
                                  (sum, f) =>
                                    sum +
                                    (player.warbands?.[f]?.strength || 0),
                                  0
                                ) / factions.length
                              : 0;
                            const met = average >= gate.host;
                            return (
                              <li className={met ? "tx-rep" : "tx-error"}>
                                ⚔️ United front: the host must average{" "}
                                {gate.host} strength —{" "}
                                {met
                                  ? `ready (avg ${Math.floor(average)})`
                                  : `now ${Math.floor(average)}. Every warband counts.`}
                              </li>
                            );
                          })()}
                          <li>
                            Est. Success Chance:{" "}
                            {previewSuccessChance(
                              player,
                              storyMissionData,
                              gameData.warbands,
                              (gameData.storyWarbandGates || {})[
                                storyMissionName
                              ] || null,
                              {
                                boonCatalog: gameData.warbandBoons,
                                perkCatalog: gameData.storyChoicePerks,
                              }
                            )}
                            %
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
                          <>
                            {(() => {
                              const missing = missingFor(storyMissionData);
                              return (
                                missing.count > 0 && (
                                  <button
                                    className="btn-buy mb-2 me-2"
                                    onClick={() =>
                                      outfitMission(storyMissionName)
                                    }
                                    disabled={isStoryMissionRunning}
                                    title="Buy every missing requirement in one transaction"
                                  >
                                    🧰 Buy missing (≈
                                    {missing.cost.toLocaleString()} cr)
                                  </button>
                                )
                              );
                            })()}
                            <button
                              onClick={() => runStoryMission(storyMissionName)}
                              disabled={isStoryMissionRunning}
                            >
                              {isStoryMissionRunning
                                ? "Running..."
                                : "Run Mission"}
                            </button>
                          </>
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
