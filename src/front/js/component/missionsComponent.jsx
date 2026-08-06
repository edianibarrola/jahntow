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
  const { player, gameData, activeEvents, marketPrices } = store;
  const missionsData = gameData.missions || {};
  const [runningMission, setRunningMission] = useState(null);

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
    actions
      .startMission(missionName, repeat)
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
                        {/* Green when you can afford it, red when you
                            can't - same at-a-glance rule as the item
                            requirement lists below. */}
                        <li
                          style={{
                            color:
                              player.credits >= missionData["Required Credits"]
                                ? "#8aff8a"
                                : "#ff8a8a",
                          }}
                        >
                          Required Credits: {missionData["Required Credits"]}{" "}
                          <span className="tx-info">
                            (you: {Math.floor(player.credits).toLocaleString()})
                          </span>
                        </li>
                        <li
                          style={{
                            color:
                              player.energy >=
                              effectiveEnergy(missionData["Required Energy"])
                                ? "#8aff8a"
                                : "#ff8a8a",
                          }}
                        >
                          Required Energy: {missionData["Required Energy"]}
                          {transportsPct > 0 && (
                            <span className="tx-info">
                              {" "}
                              → {effectiveEnergy(missionData["Required Energy"])}{" "}
                              with your Transports perk
                            </span>
                          )}{" "}
                          <span className="tx-info">(you: {player.energy})</span>
                        </li>
                        <li style={{ color: wouldSurvive ? "#8aff8a" : "#ff8a8a" }}>
                          Health Risk: -{missionData["Health Effect"]}{" "}
                          <span className="tx-info">(you: {player.health})</span>
                        </li>
                        {odds.escort &&
                          (odds.escort.met ? (
                            <li className="tx-rep">
                              Escort: {odds.escort.name} —{" "}
                              {odds.escort.strength} strong, readiness{" "}
                              {odds.escort.readiness}% (+
                              {(odds.escort.bonus * 100).toFixed(1)}% success
                              {odds.escort.isHome ? "" : ", out of region"})
                            </li>
                          ) : (
                            <li className="tx-error">
                              Needs a warband escort of {odds.escort.need}{" "}
                              (your best: {odds.escort.strength}) — fund your
                              allies on the Warbands tab.
                            </li>
                          ))}
                        {missionData.Guaranteed ? (
                          <li className={bailoutLocked ? "tx-info" : "tx-sell"}>
                            Always succeeds — a guaranteed fallback when you're
                            short on credits.
                            {bailoutLocked &&
                              ` Locked above ${missionData.AvailableBelowCredits} credits.`}
                          </li>
                        ) : (
                          <>
                            <li>
                              Est. Success Chance: {odds.chance}%{" "}
                              <span className="tx-info">
                                (base {odds.basePct}%
                                {odds.levelPct !== 0 &&
                                  ` · your level ${odds.levelPct > 0 ? "+" : ""}${odds.levelPct}%`}
                                {` · spare equipment +${odds.gearPct}% (max ${odds.gearMaxPct}%)`}
                                {odds.escort && odds.escort.bonus > 0 &&
                                  ` · warband escort +${(odds.escort.bonus * 100).toFixed(1)}%`}
                                )
                              </span>
                            </li>
                            {Object.keys(missionData.requiredSupplies || {})
                              .length > 0 && (
                              <li className="tx-info">
                                Supplies are fuel — they're consumed every
                                attempt but never change the odds.
                              </li>
                            )}
                          </>
                        )}
                        {/* One number, in the same units as the "Owned: N"
                            line below: the total holding that maxes the
                            bonus. Earlier versions quoted the spare count,
                            or the total plus a required/spare breakdown -
                            both left the player doing arithmetic to work
                            out when to stop buying. */}
                        {odds.gearCapped ? (
                          <li className="tx-info">
                            Spare-equipment bonus maxed at +{odds.gearMaxPct}% —{" "}
                            <strong>owning {odds.usefulTotal}</strong> is all
                            that counts, extras add nothing.
                          </li>
                        ) : (
                          odds.sparesToMax > 0 &&
                          Object.keys(missionData.requiredEquipment || {}).length >
                            0 && (
                            <li className="tx-info">
                              <strong>Own {odds.usefulTotal}</strong> to max the
                              spare-equipment bonus at +{odds.gearMaxPct}% —{" "}
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
                        <>
                          {(() => {
                            const missing = missingFor(missionData);
                            return (
                              missing.count > 0 && (
                                <button
                                  className="btn-buy mb-2"
                                  onClick={() => outfitMission(missionName)}
                                  disabled={runningMission !== null}
                                  title="Buy every missing requirement in one transaction (merchant and ally discounts apply)"
                                >
                                  🧰 Buy missing (≈
                                  {missing.cost.toLocaleString()} cr)
                                </button>
                              )
                            );
                          })()}
                          <button
                            onClick={() => runMission(missionName)}
                            disabled={runningMission !== null || bailoutLocked}
                          >
                            {runningMission === missionName
                              ? "Running..."
                              : "Run Mission"}
                          </button>
                          {!missionData.Guaranteed && (
                            <button
                              className="ms-2"
                              onClick={() => runMission(missionName, 5)}
                              disabled={runningMission !== null || bailoutLocked}
                              title="Runs up to 5 attempts back-to-back, stopping if energy, credits, health or supplies run short."
                            >
                              Run up to ×5
                            </button>
                          )}
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
