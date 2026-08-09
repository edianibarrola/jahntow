import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import { successBreakdown } from "../missionOdds";
import { perkBonusPct } from "../equipmentPerks";
import MissionTheater from "./missionTheater";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData, activeEvents, marketPrices } = store;
  const missionsData = gameData.missions || {};
  const [runningMission, setRunningMission] = useState(null);
  const [theater, setTheater] = useState(null);

  // Client-side estimate for the one-click outfit button - the server
  // reprices authoritatively (with merchant/ally discounts), this only
  // sizes the label so the player knows roughly what they're agreeing to.
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
    Object.entries(missionData.requiredSupplies || {}).forEach(([name, qty]) => {
      const short = qty - Math.floor(player.inventory?.[name]?.quantity || 0);
      if (short > 0) {
        count += short;
        cost += short * (buyPriceByName[name] || 0);
      }
    });
    return { count, cost: Math.round(cost) };
  };

  const outfitMission = (missionName) => {
    setRunningMission(missionName);
    actions
      .outfitMission(missionName)
      .catch(() => {})
      .finally(() => setRunningMission(null));
  };

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

  // How long until the player can afford this mission's energy cost -
  // mirrors economy.energy_regen_amount (1 per 10s tick + reactor).
  const energyShortSeconds = (missionData) => {
    const need = effectiveEnergy(missionData["Required Energy"]) - player.energy;
    if (need <= 0) return 0;
    const perTick = 1 + ((player.ship || {}).reactor || 0);
    return Math.ceil(need / perTick) * 10;
  };
  const fmtWait = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const runMission = (missionName, repeat = 1) => {
    setRunningMission(missionName);
    // The theater plays the authored start message at the player's own
    // pace: flux holds the outcome (and the stat/toast updates) until
    // the start step's Continue resolves this hold. Refusals reject
    // before the hold and close the theater immediately as before.
    let release;
    const hold = new Promise((resolve) => {
      release = resolve;
    });
    setTheater({
      name: missionName,
      startMessage: (missionsData[missionName] || {}).startMessage,
      repeat,
      startedAt: Date.now(),
      release,
    });
    actions
      .startMission(missionName, repeat, hold)
      .then((data) => {
        if (data && data.message != null) {
          setTheater((t) => (t ? { ...t, outcome: data } : t));
        } else {
          setTheater(null);
        }
      })
      .catch(() => setTheater(null))
      .finally(() => {
        setRunningMission(null);
      });
  };

  const advanceTheater = () => {
    setTheater((t) => {
      if (!t) return t;
      t.release?.();
      return { ...t, advanced: true };
    });
  };

  return (
    <div className="row mb-3">
      <MissionTheater
        run={theater}
        onAdvance={advanceTheater}
        onClose={() => setTheater(null)}
      />
      <div className="row  sticky-top holo text-center">

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
        {/* Ops are grouped by the land they happen in, and a land only
            appears once the story has reached it (the server enforces
            the same gate). Newest region first, newest unlock first
            within it - the content worth running is always on top. */}
        {Object.keys(gameData.regions || {})
          .filter(
            (region) =>
              (gameData.regions[region] ?? 0) <= (player.storyWins || 0)
          )
          .reverse()
          .map((region) => {
            const regionAll = Object.entries(missionsData).filter(
              ([, m]) => m.Region === region
            );
            const regionMissions = regionAll
              .filter(([, m]) => m.Rank <= player.level)
              .reverse();
            if (regionMissions.length === 0) {
              // Story has opened the region but its ops out-rank the
              // player - say so instead of silently hiding the land.
              const lowestRank = Math.min(
                ...regionAll.map(([, m]) => m.Rank)
              );
              return (
                <div className="col-12" key={region}>
                  <h5 className="region-header">{region}</h5>
                  <p className="tx-info text-center">
                    The war has reached {region}, but its operations start
                    at level {lowestRank} (you: {player.level}).
                  </p>
                </div>
              );
            }
            return (
              <div className="col-12" key={region}>
                <h5 className="region-header">{region}</h5>
                <Accordion defaultActiveKey="0">
                  {regionMissions.map(([missionName, missionData], index) => {
              // Mirrors the backend's own gate in player_meets_requirements:
              // a failed attempt costs "Health Effect" health, so refuse to
              // even offer a mission that could drop the player to 0.
              const wouldSurvive =
                player.health - missionData["Health Effect"] > 0;
              const odds = successBreakdown(
                player,
                missionData,
                gameData.warbands,
                null,
                {
                  boonCatalog: gameData.warbandBoons,
                  perkCatalog: gameData.storyChoicePerks,
                }
              );
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
                    <span className="lvl-chip">LV {missionData.Rank}</span>
                    <span className="hdr-pct">
                      {missionData.Guaranteed ? "100%" : `${odds.chance}%`}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {(() => {
                      // Mirrors economy.mission_reward_award, LEVEL_GRACE
                      // included: credits fall off for over-levelled content,
                      // so the payout shown is what the player actually gets.
                      const over = Math.max(0, player.level - missionData.Rank - 2);
                      const mult = missionData.Guaranteed
                        ? 1
                        : Math.max(0.25, 1 - 0.08 * over);
                      const effective = Math.max(
                        1,
                        Math.round(missionData.Reward * mult)
                      );
                      const energyNeed = effectiveEnergy(
                        missionData["Required Energy"]
                      );
                      const creditsOk =
                        player.credits >= missionData["Required Credits"];
                      const energyOk = player.energy >= energyNeed;
                      const missing = missingFor(missionData);
                      return (
                        <div className="col-12">
                          <div className="stat-well">
                            <div className="stat-grid">
                              <div>
                                <div className="lab2">Entry</div>
                                <div className={`v ${creditsOk ? "ok" : "no"}`}>
                                  {missionData["Required Credits"].toLocaleString()}{" "}
                                  <span className="you">
                                    {creditsOk
                                      ? "✓"
                                      : `you: ${Math.floor(player.credits).toLocaleString()}`}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="lab2">Energy</div>
                                <div className={`v ${energyOk ? "ok" : "no"}`}>
                                  {energyNeed}{" "}
                                  <span className="you">
                                    {energyOk ? "✓" : `you: ${player.energy}`}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="lab2">Health risk</div>
                                <div className={`v ${wouldSurvive ? "" : "no"}`}>
                                  −{missionData["Health Effect"]}{" "}
                                  <span className="you">of {player.health}</span>
                                </div>
                              </div>
                              <div>
                                <div className="lab2">Payout</div>
                                <div className={`v ${mult < 1 ? "warm" : ""}`}>
                                  {mult < 1 && (
                                    <s className="you">
                                      {missionData.Reward.toLocaleString()}
                                    </s>
                                  )}{" "}
                                  {effective.toLocaleString()}
                                  {bounty && (
                                    <span className="tx-bounty">
                                      {" "}⭐×{bounty.multiplier}
                                    </span>
                                  )}{" "}
                                  {mult < 1 && (
                                    <span className="you">
                                      {Math.round(mult * 100)}% — over-leveled
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="oddsrow">
                              <span className="lab2">Odds</span>
                              <div className="oddsbar">
                                <i
                                  style={{
                                    width: `${
                                      missionData.Guaranteed ? 100 : odds.chance
                                    }%`,
                                  }}
                                />
                              </div>
                              <span className="oddspct">
                                {missionData.Guaranteed ? "100%" : `${odds.chance}%`}
                              </span>
                            </div>
                          </div>

                          {/* Guidance prose folds behind the ⓘ - the card
                              face stays scannable, the reasoning stays one
                              tap away. */}
                          {missionData.Guaranteed ? (
                            <details className="info-disclosure">
                              <summary>always succeeds</summary>
                              <p>
                                A guaranteed fallback when you're short on
                                credits.
                                {bailoutLocked &&
                                  ` Locked above ${missionData.AvailableBelowCredits} credits.`}
                              </p>
                            </details>
                          ) : (
                            <details className="info-disclosure">
                              <summary>
                                base {odds.basePct}
                                {odds.levelPct !== 0 &&
                                  ` · level ${odds.levelPct > 0 ? "+" : ""}${odds.levelPct}`}
                                {` · gear +${odds.gearPct} (max ${odds.gearMaxPct})`}
                                {odds.escort && odds.escort.bonus > 0 &&
                                  ` · escort +${(odds.escort.bonus * 100).toFixed(1)}`}
                              </summary>
                              <p>
                                Built for level {missionData.Rank} (you:{" "}
                                {player.level}).
                              </p>
                              {odds.gearCapped ? (
                                <p>
                                  Spare-equipment bonus maxed at +{odds.gearMaxPct}%
                                  — owning {odds.usefulTotal} is all that counts,
                                  extras add nothing.
                                </p>
                              ) : (
                                odds.sparesToMax > 0 &&
                                Object.keys(missionData.requiredEquipment || {})
                                  .length > 0 && (
                                  <p>
                                    Own {odds.usefulTotal} to max the
                                    spare-equipment bonus at +{odds.gearMaxPct}% —{" "}
                                    {odds.sparesToMax} more to go.
                                  </p>
                                )
                              )}
                              {transportsPct > 0 && (
                                <p>
                                  Energy shown includes your −{transportsPct}%
                                  Transports perk (listed cost{" "}
                                  {missionData["Required Energy"]}).
                                </p>
                              )}
                              {Object.keys(missionData.requiredSupplies || {})
                                .length > 0 && (
                                <p>
                                  Supplies are fuel — consumed every attempt,
                                  never change the odds.
                                </p>
                              )}
                              {odds.escort && odds.escort.met && (
                                <p>
                                  Escort: {odds.escort.name} —{" "}
                                  {odds.escort.strength} strong, readiness{" "}
                                  {odds.escort.readiness}%
                                  {odds.escort.isHome ? "" : ", out of region"}.
                                </p>
                              )}
                            </details>
                          )}

                          {odds.escort && !odds.escort.met && (
                            <p className="tx-error">
                              Needs a warband escort of {odds.escort.need} (your
                              best: {odds.escort.strength}) — fund your allies on
                              the Warbands tab.
                            </p>
                          )}

                          {/* Requirements as met/miss chips - the old nested
                              bullet lists spent a line per item. */}
                          {(Object.keys(missionData.requiredEquipment || {})
                            .length > 0 ||
                            Object.keys(missionData.requiredSupplies || {})
                              .length > 0) && (
                            <div className="req-chips">
                              {Object.entries(
                                missionData.requiredEquipment || {}
                              ).map(([equipment, quantity]) => {
                                const owned =
                                  player.equipment[equipment]?.quantity || 0;
                                const met = owned >= quantity;
                                return (
                                  <span
                                    key={equipment}
                                    className={`req-chip ${met ? "met" : "miss"}`}
                                    title={`${equipment}: need ${quantity}, own ${owned}`}
                                  >
                                    {equipment} ×{quantity}{" "}
                                    {met ? "✓" : <small>· own {owned}</small>}
                                  </span>
                                );
                              })}
                              {Object.entries(
                                missionData.requiredSupplies || {}
                              ).map(([item, quantity]) => {
                                const owned = Math.floor(
                                  player.inventory?.[item]?.quantity || 0
                                );
                                const met = owned >= quantity;
                                return (
                                  <span
                                    key={item}
                                    className={`req-chip ${met ? "met" : "miss"}`}
                                    title={`${item} (supply, consumed every attempt): need ${quantity}, own ${owned}`}
                                  >
                                    {item} ×{quantity}{" "}
                                    {met ? <small>· fuel</small> : (
                                      <small>· own {owned}</small>
                                    )}
                                  </span>
                                );
                              })}
                            </div>
                          )}

                          {wouldSurvive ? (
                            <>
                              {missing.count > 0 && (
                                <button
                                  className="btn-buy mb-2"
                                  onClick={() => outfitMission(missionName)}
                                  disabled={runningMission !== null}
                                  title="Buy every missing requirement in one transaction (merchant and ally discounts apply)"
                                >
                                  🧰 Buy missing (≈{missing.cost.toLocaleString()}{" "}
                                  cr)
                                </button>
                              )}
                              <div className="actions-row">
                                <button
                                  className="btn-run"
                                  onClick={() => runMission(missionName)}
                                  disabled={
                                    runningMission !== null || bailoutLocked
                                  }
                                >
                                  {runningMission === missionName
                                    ? "Running..."
                                    : "▶ Run Mission"}
                                </button>
                                {!missionData.Guaranteed && (
                                  <button
                                    className="btn-run5"
                                    onClick={() => runMission(missionName, 5)}
                                    disabled={
                                      runningMission !== null || bailoutLocked
                                    }
                                    title="Runs up to 5 attempts back-to-back, stopping if energy, credits, health or supplies run short."
                                  >
                                    ×5
                                  </button>
                                )}
                              </div>
                              {energyShortSeconds(missionData) > 0 && (
                                <p className="tx-info regen-hint mb-0 mt-1">
                                  Not enough energy — ready in{" "}
                                  {fmtWait(energyShortSeconds(missionData))}
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="tx-error">
                              Your health is too low to survive a failed attempt.
                              Recover first — or grab a Medlab item.
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </Accordion.Body>
                </Accordion.Item>
              );
                  })}
                </Accordion>
              </div>
            );
          })}
        {(() => {
          const nextLocked = Object.keys(gameData.regions || {}).find(
            (region) =>
              (gameData.regions[region] ?? 0) > (player.storyWins || 0)
          );
          if (!nextLocked) return null;
          const winsAway =
            gameData.regions[nextLocked] - (player.storyWins || 0);
          return (
            <p className="tx-info text-center region-locked mt-2">
              🔒 {nextLocked} is still behind Vortex lines — {winsAway} story{" "}
              {winsAway === 1 ? "win" : "wins"} until the war reaches it.
            </p>
          );
        })()}
      </div>
    </div>
  );
};

export default MissionsComponent;
