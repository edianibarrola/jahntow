import React, { useContext } from "react";
import { Context } from "../store/appContext";

// Client-side mirror of economy._achievement_metric_value, used only to
// show progress on locked achievements - earning is server-side.
const metricValue = (player, metric) => {
  if (metric.startsWith("stat:")) {
    return (player.stats || {})[metric.slice(5)] || 0;
  }
  switch (metric) {
    case "level":
      return player.level || 0;
    case "prestige":
      return player.prestigeLevel || 0;
    case "storyWins":
      return player.storyWins || 0;
    case "credits":
      return player.credits || 0;
    case "properties_owned":
      return Object.keys(player.properties || {}).length;
    default:
      return 0;
  }
};

const ProgressBar = ({ value, goal }) => {
  const pct = Math.min(100, Math.round((value / goal) * 100));
  return (
    <div className="goal-progress">
      <div className="goal-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};

const GoalsComponent = () => {
  const { store } = useContext(Context);
  const { player, gameData } = store;
  const contracts = (player.dailyContracts || {}).contracts || [];
  const achievements = gameData.achievements || [];
  const earned = new Set(player.achievements || []);

  // Group the flat catalog into its progression tracks, tiers in order.
  // Achievements are still earned individually server-side; this is purely
  // how they're presented - one advancing goal per track instead of a wall
  // of cards, most of them unreachable.
  const chainLabels = gameData.achievementChains || {};
  const chains = Object.keys(chainLabels).map((key) => ({
    key,
    label: chainLabels[key],
    tiers: achievements
      .filter((a) => a.chain === key)
      .sort((a, b) => a.tier - b.tier),
  }));

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="col-12 text-center">
          <p>
            Goals
            {player.title && (
              <span className="tx-achievement"> — Title: {player.title}</span>
            )}
          </p>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12 holo p-3">
          <h4 className="text-center">📋 Daily Contracts</h4>
          <p className="text-center tx-info">
            Three new contracts every day (UTC). Rewards pay out the moment a
            contract completes.
          </p>
          {contracts.length === 0 ? (
            <p className="text-center">No contracts yet - they arrive on your next check-in.</p>
          ) : (
            <ul className="activity-list">
              {contracts.map((c) => (
                <li key={c.id}>
                  <div className="d-flex justify-content-between flex-wrap">
                    <span className={c.done ? "tx-contract" : undefined}>
                      {c.done ? "✓ " : ""}
                      {c.desc}
                    </span>
                    <span className="tx-info">
                      {Math.min(c.progress, c.goal)}/{c.goal} · +{c.reward} credits
                    </span>
                  </div>
                  {!c.done && <ProgressBar value={c.progress} goal={c.goal} />}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {Object.keys(player.reputation || {}).length > 0 && (
        <div className="row mb-3">
          <div className="col-12 holo p-3">
            <h4 className="text-center">🤝 Faction Reputation</h4>
            <ul className="activity-list">
              {Object.entries(player.reputation)
                .filter(([, points]) => points > 0)
                .map(([faction, points]) => (
                  <li
                    key={faction}
                    className="d-flex justify-content-between flex-wrap"
                  >
                    <span className="tx-rep">{faction}</span>
                    <span className="tx-info">
                      {points} —{" "}
                      {points >= 25
                        ? "Trusted Ally (10% discounts, +5% story odds)"
                        : points >= 10
                        ? "Friend (5% discounts, +3% story odds)"
                        : `${10 - points} more to Friend`}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-12 holo p-3">
          <h4 className="text-center">
            🏆 Achievements ({earned.size}/{achievements.length})
          </h4>
          <p className="text-center tx-info">
            Each track advances a tier at a time — clear one and the next
            goal takes its place.
          </p>
          <div className="row">
            {chains.map((chain) => {
              // The current phase of this track: the lowest tier not yet
              // earned. Once every tier is done the track is complete.
              const next = chain.tiers.find((t) => !earned.has(t.id));
              const done = chain.tiers.filter((t) => earned.has(t.id)).length;
              const latest = chain.tiers[done - 1];
              const value = metricValue(player, chain.tiers[0].metric);
              const complete = !next;
              return (
                <div className="col-12 col-md-6 p-2" key={chain.key}>
                  <div
                    className={`p-2 border rounded h-100 ${
                      complete
                        ? "achievement-earned"
                        : done > 0
                        ? "achievement-progressing"
                        : "achievement-locked"
                    }`}
                  >
                    <div className="d-flex justify-content-between flex-wrap">
                      <span className={complete ? "tx-achievement" : undefined}>
                        {complete ? "🏆" : "🎖"} {chain.label}
                      </span>
                      <span className="tx-info">
                        {/* Filled pips for cleared tiers - the "phase"
                            readout the flat card list couldn't give. */}
                        {"★".repeat(done)}
                        {"☆".repeat(chain.tiers.length - done)} {done}/
                        {chain.tiers.length}
                      </span>
                    </div>

                    {latest && (
                      <div className="tx-achievement">Earned: {latest.name}</div>
                    )}

                    {next ? (
                      <>
                        <div>
                          Next: {next.name}
                          {next.title && (
                            <span className="tx-prestige">
                              {" "}
                              · Title: {next.title}
                            </span>
                          )}
                        </div>
                        <div className="tx-info">{next.desc}</div>
                        <ProgressBar value={value} goal={next.threshold} />
                        <div className="tx-info">
                          {Math.min(value, next.threshold).toLocaleString()}/
                          {next.threshold.toLocaleString()}
                        </div>
                      </>
                    ) : (
                      <div className="tx-info">Track complete.</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsComponent;
