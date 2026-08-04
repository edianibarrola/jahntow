import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import { successBreakdown } from "../missionOdds";
import { perkBonusPct } from "../equipmentPerks";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData, activeEvents } = store;
  const missionsData = gameData.missions || {};
  const [runningMission, setRunningMission] = useState(null);

  // Mirrors economy.WIN_STREAK_BONUS_PER_WIN / WIN_STREAK_CAP - the server
  // is what actually applies the bonus.
  const streakBonusPct = Math.min(player.winStreak || 0, 10) * 3;
  // Transports perk discounts the actual energy charged (server-side in
  // economy.mission_energy_cost) - show the effective cost so the listed
  // number matches what actually happens.
  const transportsPct = perkBonusPct(player, "Transports", gameData.equipment);
  const effectiveEnergy = (required) =>
    required > 0 && transportsPct > 0
      ? Math.max(1, Math.round(required * (1 - transportsPct / 100)))
      : required;

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
          <p>
            Missions:
            {streakBonusPct > 0 && (
              <span className="tx-streak">
                {" "}🎯 Win streak {player.winStreak} — +{streakBonusPct}% credits
                on your next win
              </span>
            )}
          </p>
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
              // Bailout missions are hidden above a credit ceiling - mirrors
              // the server's own check in player_meets_requirements.
              const bailoutLocked =
                missionData.AvailableBelowCredits != null &&
                player.credits >= missionData.AvailableBelowCredits;
              // An active bounty event targets one mission by name and
              // multiplies its credit reward server-side.
              const bounty = (activeEvents || []).find(
                (e) => e.kind === "bounty" && e.category === missionName
              );
              return (
                <Accordion.Item
                  className="holo"
                  eventKey={index.toString()}
                  key={missionName}
                >
                  <Accordion.Header>
                    {missionName}
                    {bounty && <span className="tx-bounty ms-2">⭐ Bounty!</span>}
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="col-12 pl-5 pr-5 text-center">
                      <ul className="holo">
                        {/* The mission's own rank, stated as the level it's
                            built for. Without it "below your level" looked
                            wrong on a mission the player had only just
                            unlocked, because nothing on the card said what
                            level it was meant for. */}
                        <li>
                          Suggested level: {missionData.Rank}{" "}
                          <span className="tx-info">(you: {player.level})</span>
                        </li>
                        {/* Mirrors economy.mission_reward_award, LEVEL_GRACE
                            included: credits fall off for over-levelled
                            content, so show the payout the player will
                            actually get - otherwise the reason to move up to
                            harder missions is invisible until after the run. */}
                        {(() => {
                          const over = Math.max(
                            0,
                            player.level - missionData.Rank - 2
                          );
                          const mult = missionData.Guaranteed
                            ? 1
                            : Math.max(0.25, 1 - 0.08 * over);
                          const effective = Math.max(
                            1,
                            Math.round(missionData.Reward * mult)
                          );
                          return (
                            <li>
                              Reward:{" "}
                              {mult < 1 ? (
                                <>
                                  <s className="tx-info">{missionData.Reward}</s>{" "}
                                  <span className="tx-error">{effective}</span>{" "}
                                  <span className="tx-info">
                                    (well below your level — {Math.round(mult * 100)}%
                                    payout)
                                  </span>
                                </>
                              ) : (
                                missionData.Reward
                              )}
                              {bounty && (
                                <span className="tx-bounty">
                                  {" "}⭐ Bounty active: {bounty.multiplier}x!
                                </span>
                              )}
                            </li>
                          );
                        })()}
                        <li>
                          Required Credits: {missionData["Required Credits"]}
                        </li>
                        <li>
                          Required Energy: {missionData["Required Energy"]}
                          {transportsPct > 0 && (
                            <span className="tx-info">
                              {" "}
                              → {effectiveEnergy(missionData["Required Energy"])}{" "}
                              with your Transports perk
                            </span>
                          )}
                        </li>
                        <li style={{ color: wouldSurvive ? undefined : "#ff8a8a" }}>
                          Health Risk: -{missionData["Health Effect"]}
                        </li>
                        {missionData.Guaranteed ? (
                          <li className={bailoutLocked ? "tx-info" : "tx-sell"}>
                            Always succeeds — a guaranteed fallback when you're
                            short on credits.
                            {bailoutLocked &&
                              ` Locked above ${missionData.AvailableBelowCredits} credits.`}
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
                        {/* One number, in the same units as the "Owned: N"
                            line below: the total holding that maxes the
                            bonus. Earlier versions quoted the spare count,
                            or the total plus a required/spare breakdown -
                            both left the player doing arithmetic to work
                            out when to stop buying. */}
                        {odds.gearCapped ? (
                          <li className="tx-info">
                            Gear bonus maxed at +{odds.gearMaxPct}% —{" "}
                            <strong>owning {odds.usefulTotal}</strong> is all
                            that counts, extras add nothing.
                          </li>
                        ) : (
                          odds.sparesToMax > 0 &&
                          Object.keys(missionData.requiredEquipment || {}).length >
                            0 && (
                            <li className="tx-info">
                              <strong>Own {odds.usefulTotal}</strong> to max the
                              gear bonus at +{odds.gearMaxPct}% —{" "}
                              {odds.sparesToMax} more to go.
                            </li>
                          )
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
                        {Object.keys(missionData.requiredSupplies || {}).length >
                          0 && (
                          <>
                            <li>
                              Supplies{" "}
                              <span className="tx-info">
                                (market items, consumed every attempt)
                              </span>
                              :
                            </li>
                            <ul>
                              {Object.entries(missionData.requiredSupplies).map(
                                ([item, quantity]) => {
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
                                }
                              )}
                            </ul>
                          </>
                        )}
                      </ul>
                      {wouldSurvive ? (
                        <button
                          onClick={() => runMission(missionName)}
                          disabled={runningMission !== null || bailoutLocked}
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
