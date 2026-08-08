import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import StoryMissionDetailsComponent from "./storyMissionDetailsComponent";
import MissionTheater from "./missionTheater";
import { successBreakdown } from "../missionOdds";

// Mirrors STORY_WINS_PER_UNLOCK in src/api/game_routes.py, which is what
// actually enforces which story mission may be run.
const STORY_WINS_PER_UNLOCK = 5;

// Mirrors economy.CHRONICLE_GATE_ESCALATION / WARBAND_MAX_STRENGTH -
// display only, the server enforces the escalated gates.
const CHRONICLE_GATE_ESCALATION = 0.5;
const WARBAND_MAX_STRENGTH = 200;
// Mirrors economy.REMNANT_REWARD_BONUS.
const REMNANT_REWARD_BONUS = 0.5;

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
  const { player, gameData, marketPrices } = store;
  const storyMissionsData = gameData.storyMissions || {};
  const [isStoryMissionRunning, setStoryMissionRunning] = useState(false);
  const [isChoosing, setChoosing] = useState(false);
  const [theater, setTheater] = useState(null);

  // One-click outfitting for the chapter's gear - estimate only; the
  // server reprices with merchant/ally discounts applied.
  const equipCostByName = {};
  Object.values(gameData.equipment || {}).forEach((items) =>
    Object.entries(items).forEach(([name, data]) => {
      equipCostByName[name] = data["Base Cost"];
    })
  );
  const buyPriceByName = {};
  (marketPrices || []).forEach((row) => {
    buyPriceByName[row.item_name] = row.buy_price;
  });
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
    // Story campaigns eat materiel too now (round 6): the outfit
    // endpoint buys missing supplies at the live market price alongside
    // the gear, so count them in the estimate.
    Object.entries(missionData.requiredSupplies || {}).forEach(([name, qty]) => {
      const short =
        qty - Math.floor(player.inventory?.[name]?.quantity || 0);
      if (short > 0) {
        count += short;
        cost += short * (buyPriceByName[name] || 0);
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

  // The Long Peace: past the final beat only the warband-gated battles
  // stay open, as repeatable Remnant Hunts.
  const totalWins =
    Object.keys(storyMissionsData).length * STORY_WINS_PER_UNLOCK;
  const storyComplete = player.storyWins >= totalWins;
  // Chronicle cycles escalate every warband story gate; mirror of
  // economy.story_gate_requirement.
  const chronicleCycles = player.stats?.chronicle_cycles || 0;
  const gateNeed = (base) =>
    Math.min(
      WARBAND_MAX_STRENGTH,
      Math.ceil(base * (1 + CHRONICLE_GATE_ESCALATION * chronicleCycles))
    );

  const runStoryMission = (missionName) => {
    setStoryMissionRunning(true);
    // Staged reveal, same as regular missions: the theater plays the
    // chapter's authored start message while flux holds the outcome.
    setTheater({
      name: missionName,
      startMessage: (storyMissionsData[missionName] || {}).startMessage,
      startedAt: Date.now(),
    });
    actions
      .startStoryMission(missionName)
      .then((data) => {
        if (data && data.message != null) {
          setTheater((t) => (t ? { ...t, outcome: data } : t));
        } else {
          setTheater(null);
        }
      })
      .catch(() => setTheater(null))
      .finally(() => {
        setStoryMissionRunning(false);
      });
  };

  return (
    <div className="row mb-3">
      <MissionTheater run={theater} onClose={() => setTheater(null)} />
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p>Story Missions:</p>
        </div>
        {chronicleCycles > 0 && (
          <div className="col-12 text-center pb-1">
            <p className="tx-choice m-0 small">
              📜 Chronicle {chronicleCycles + 1} — the war retold; warband
              battle gates +
              {Math.round(chronicleCycles * CHRONICLE_GATE_ESCALATION * 100)}
              %.
            </p>
          </div>
        )}
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
      {storyComplete && (
        <div className="col-12 holo p-3 mb-3 text-center">
          <p className="m-0">
            🕊️ <strong>The Long Peace.</strong> The war is won — the great
            warband battles below stay open as repeatable Remnant Hunts (+
            {Math.round(REMNANT_REWARD_BONUS * 100)}% bonus credits). When
            you want to hear the whole story again, prestige at max level:
            E.C.H.O. opens a new chronicle and the war retells itself with
            harder warband gates.
          </p>
        </div>
      )}
      <div className="row mb-5">
        <Accordion defaultActiveKey={availableMissionName}>
          {Object.entries(storyMissionsData).map(
            ([storyMissionName, storyMissionData], index) => {
              const startWin = index * STORY_WINS_PER_UNLOCK;
              // Past the final beat, the warband-gated battles reopen as
              // repeatable Remnant Hunts (mirrors the server's remnant
              // branch in _resolve_mission_request).
              const isRemnant =
                storyComplete &&
                !!(gameData.storyWarbandGates || {})[storyMissionName];
              const inWindow =
                player.storyWins >= startWin &&
                player.storyWins < startWin + STORY_WINS_PER_UNLOCK;

              if (inWindow || isRemnant) {
                const isUnlocked =
                  isRemnant || storyMissionName === availableMissionName;
                // Mirrors the backend's own gate in player_meets_requirements:
                // a failed attempt costs "Health Effect" health, so refuse to
                // even offer a mission that could drop the player to 0.
                const wouldSurvive =
                  player.health - storyMissionData["Health Effect"] > 0;
                const gate =
                  (gameData.storyWarbandGates || {})[storyMissionName] || null;
                const odds = successBreakdown(
                  player,
                  storyMissionData,
                  gameData.warbands,
                  gate,
                  {
                    boonCatalog: gameData.warbandBoons,
                    perkCatalog: gameData.storyChoicePerks,
                  }
                );
                // gateBonusPct is the 0-5% readiness-scaled war-host bonus,
                // so the readiness it reflects is bonus/max.
                const gateReadiness = gate
                  ? Math.round((odds.gateBonusPct / 5) * 100)
                  : 0;
                const gateMissingPct =
                  Math.round((5 - odds.gateBonusPct) * 10) / 10;
                return (
                  <Accordion.Item
                    className="holo"
                    eventKey={storyMissionName} // Use storyMissionName as the eventKey
                    key={storyMissionName}
                  >
                    {/* Playtest: with only the chapter name in the title,
                        five identical "Run Mission" clicks looked like
                        nothing was advancing. Show which part of the
                        chapter the next win lands. */}
                    <Accordion.Header>
                      {storyMissionName}
                      {isRemnant ? (
                        <span className="tx-choice ms-2">— remnant hunt</span>
                      ) : (
                        isUnlocked && (
                          <span className="tx-info ms-2">
                            — part {(player.storyWins % STORY_WINS_PER_UNLOCK) + 1}{" "}
                            of {STORY_WINS_PER_UNLOCK}
                          </span>
                        )
                      )}
                    </Accordion.Header>
                    <Accordion.Body>
                      <div className="col-12 pl-5 pr-5 text-center">
                        <ul className="holo">
                          {isRemnant && (
                            <li className="tx-choice">
                              🏴 Remnant hunt — repeatable. The war is won,
                              but holdout cells still haunt this
                              battlefield: pays the story reward +
                              {Math.round(REMNANT_REWARD_BONUS * 100)}%
                              bonus credits, and your story progress stays
                              complete.
                            </li>
                          )}
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
                          {/* Same at-a-glance rule as regular missions:
                              green when you meet it, red when you don't. */}
                          <li
                            style={{
                              color:
                                player.credits >=
                                storyMissionData["Required Credits"]
                                  ? "#8aff8a"
                                  : "#ff8a8a",
                            }}
                          >
                            Required Credits:{" "}
                            {storyMissionData["Required Credits"]}{" "}
                            <span className="tx-info">
                              (you: {Math.floor(player.credits).toLocaleString()})
                            </span>
                          </li>
                          <li
                            style={{
                              color:
                                player.energy >=
                                storyMissionData["Required Energy"]
                                  ? "#8aff8a"
                                  : "#ff8a8a",
                            }}
                          >
                            Required Energy:{" "}
                            {storyMissionData["Required Energy"]}{" "}
                            <span className="tx-info">
                              (you: {Math.floor(player.energy)})
                            </span>
                          </li>
                          <li style={{ color: wouldSurvive ? undefined : "#ff8a8a" }}>
                            Health Risk: -{storyMissionData["Health Effect"]}{" "}
                            <span className="tx-info">
                              (you: {Math.floor(player.health)})
                            </span>
                          </li>
                          {(() => {
                            if (!gate) return null;
                            const bands = gameData.warbands || {};
                            // Gates only count bodies (permanent strength);
                            // readiness never blocks - so when the gate is
                            // met but the band is ragged, say what that
                            // leniency is costing in odds.
                            const raggedNote =
                              gateReadiness < 100
                                ? ` They'll fight at ${gateReadiness}% readiness — full kits & provisions would add +${gateMissingPct}% success.`
                                : "";
                            if (gate.faction) {
                              const need = gateNeed(gate.strength);
                              const band = bands[gate.faction] || {};
                              const strength =
                                player.warbands?.[gate.faction]?.strength || 0;
                              const met = strength >= need;
                              // Gates count TOTAL strength by design - and
                              // since round 6 the horn is literal: running
                              // the battle recalls this band's detachments.
                              const bandRaw =
                                player.warbands?.[gate.faction] || {};
                              const inField =
                                (bandRaw.orders || []).some(
                                  (o) => o && (o.deployed || 0) > 0
                                ) || !!bandRaw.assignment;
                              const fieldNote = inField
                                ? " They're in the field — the war horn will recall their detachments when you strike."
                                : "";
                              return (
                                <li className={met ? "tx-rep" : "tx-error"}>
                                  ⚔️ War host: the {band.name || gate.faction}{" "}
                                  must number {need} —{" "}
                                  {met
                                    ? `ready (${strength} strong).${fieldNote}${raggedNote}`
                                    : `now ${strength}. Recruit on the Warbands tab.`}
                                </li>
                              );
                            }
                            const need = gateNeed(gate.host);
                            const factions = Object.keys(bands);
                            const average = factions.length
                              ? factions.reduce(
                                  (sum, f) =>
                                    sum +
                                    (player.warbands?.[f]?.strength || 0),
                                  0
                                ) / factions.length
                              : 0;
                            const met = average >= need;
                            return (
                              <li className={met ? "tx-rep" : "tx-error"}>
                                ⚔️ United front: the host must average{" "}
                                {need} strength —{" "}
                                {met
                                  ? `ready (avg ${Math.floor(average)}).${raggedNote}`
                                  : `now ${Math.floor(average)}. Every warband counts.`}
                              </li>
                            );
                          })()}
                          {/* Same plain-language breakdown as regular
                              missions - the spare-gear bonus in particular
                              was invisible here. */}
                          <li>
                            Est. Success Chance: {odds.chance}%{" "}
                            <span className="tx-info">
                              (base {odds.basePct}%
                              {odds.levelPct !== 0 &&
                                ` · your level ${odds.levelPct > 0 ? "+" : ""}${odds.levelPct}%`}
                              {` · spare equipment +${odds.gearPct}% (max ${odds.gearMaxPct}%)`}
                              {gate &&
                                ` · war host +${odds.gateBonusPct}%`}
                              )
                            </span>
                          </li>
                          {odds.gearCapped ? (
                            <li className="tx-info">
                              Spare-equipment bonus maxed at +
                              {odds.gearMaxPct}% —{" "}
                              <strong>owning {odds.usefulTotal}</strong> is
                              all that counts, extras add nothing.
                            </li>
                          ) : (
                            odds.sparesToMax > 0 &&
                            Object.keys(
                              storyMissionData.requiredEquipment || {}
                            ).length > 0 && (
                              <li className="tx-info">
                                <strong>Own {odds.usefulTotal}</strong> to max
                                the spare-equipment bonus at +
                                {odds.gearMaxPct}% — {odds.sparesToMax} more
                                to go.
                              </li>
                            )
                          )}
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
                          {Object.keys(storyMissionData.requiredSupplies || {})
                            .length > 0 && (
                            <>
                              <li>
                                Supplies{" "}
                                <span className="tx-info">
                                  (market items, consumed every attempt —
                                  campaigns eat materiel)
                                </span>
                                :
                              </li>
                              <ul>
                                {Object.entries(
                                  storyMissionData.requiredSupplies || {}
                                ).map(([item, quantity]) => {
                                  const owned = Math.floor(
                                    player.inventory?.[item]?.quantity || 0
                                  );
                                  const met = owned >= quantity;
                                  return (
                                    <li
                                      key={item}
                                      style={{
                                        color: met ? "#8aff8a" : "#ff8a8a",
                                      }}
                                    >
                                      {item} x{quantity} (Owned: {owned})
                                    </li>
                                  );
                                })}
                              </ul>
                            </>
                          )}
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
