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

      <div className="row mb-5">
        <div className="col-12 holo p-3">
          <h4 className="text-center">
            🏆 Achievements ({earned.size}/{achievements.length})
          </h4>
          <div className="row">
            {achievements.map((ach) => {
              const isEarned = earned.has(ach.id);
              const value = metricValue(player, ach.metric);
              return (
                <div className="col-12 col-md-6 col-lg-4 p-2" key={ach.id}>
                  <div
                    className={`p-2 border rounded h-100 ${
                      isEarned ? "achievement-earned" : "achievement-locked"
                    }`}
                  >
                    <div className={isEarned ? "tx-achievement" : undefined}>
                      {isEarned ? "🏆" : "🔒"} {ach.name}
                      {ach.title && (
                        <span className="tx-prestige"> · Title: {ach.title}</span>
                      )}
                    </div>
                    <div className="tx-info">{ach.desc}</div>
                    {!isEarned && (
                      <div className="tx-info">
                        {Math.min(value, ach.threshold).toLocaleString()}/
                        {ach.threshold.toLocaleString()}
                      </div>
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
