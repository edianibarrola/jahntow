import React, { useContext } from "react";
import { Context } from "../store/appContext";

const CATEGORIES = {
  score: { label: "Renown (overall)", blurb:
    "prestige, level, story, achievements, reputation and streaks, plus credits on a log scale" },
  credits: { label: "Credits", blurb: "current bank balance" },
  level: { label: "Level", blurb: "level, ties broken by experience" },
  story: { label: "Story progress", blurb: "story mission wins" },
  prestige: { label: "Prestige", blurb: "rebirths, ties broken by level" },
  trading: { label: "Trading P/L", blurb:
    "lifetime net market profit - losses count" },
};

const categoryValue = (entry, sort) =>
  ({
    score: `${entry.score?.toLocaleString()} renown`,
    credits: `${entry.credits?.toLocaleString()} credits`,
    level: `Lvl ${entry.level}`,
    story: `${entry.storyWins} story wins`,
    prestige: `Prestige ${entry.prestigeLevel || 0}`,
    trading: `${(entry.tradingProfit || 0) >= 0 ? "+" : ""}${(
      entry.tradingProfit || 0
    ).toLocaleString()} P/L`,
  }[sort]);

const LeaderboardComponent = () => {
  const { store, actions } = useContext(Context);
  const { leaderboard, player } = store;
  const sort = store.leaderboardSort || "score";

  // Matching on name is imperfect (names aren't unique) but the leaderboard
  // is deliberately anonymous otherwise - it never sends player ids. Good
  // enough to answer "where am I?", which it previously couldn't at all.
  const isMe = (entry) =>
    entry.name === player.name &&
    entry.level === player.level &&
    entry.prestigeLevel === (player.prestigeLevel || 0);
  const myRank = leaderboard.findIndex(isMe);

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="col-12 text-center">
          <p className="m-0">
            Leaderboard{" "}
            <select
              className="market-sort"
              value={sort}
              onChange={(e) => actions.fetchLeaderboard(e.target.value)}
              title="Rank players by a different measure"
            >
              {Object.entries(CATEGORIES).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.label}
                </option>
              ))}
            </select>
          </p>
          <p className="tx-info m-0 small">
            Ranked by {CATEGORIES[sort].blurb}.
          </p>
          <p>
            {myRank >= 0 ? (
              <span className="tx-sell">you are #{myRank + 1}</span>
            ) : (
              <span className="tx-info">you're not in the top {leaderboard.length || 20} yet</span>
            )}
          </p>
        </div>
      </div>

      <div className="row mb-5">
        {leaderboard.length === 0 ? (
          <p>No players yet.</p>
        ) : (
          <ul className="holo">
            {leaderboard.map((entry, index) => (
              <li
                key={entry.name + index}
                className="d-flex justify-content-between align-items-center flex-wrap"
                style={isMe(entry) ? { fontWeight: "bold" } : undefined}
              >
                <span>
                  #{index + 1} {entry.name}
                  {entry.title && (
                    <span className="tx-achievement"> "{entry.title}"</span>
                  )}
                  {isMe(entry) && <span className="tx-sell"> (you)</span>}
                  {entry.prestigeLevel > 0 && (
                    <span className="tx-prestige"> (Prestige {entry.prestigeLevel})</span>
                  )}
                </span>
                <span>
                  <span className="tx-achievement">
                    {categoryValue(entry, sort)}
                  </span>{" "}
                  · Lvl {entry.level} · {entry.storyWins} story wins ·{" "}
                  {entry.achievements ?? 0} 🏆
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeaderboardComponent;
