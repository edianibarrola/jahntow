import React, { useContext } from "react";
import { Context } from "../store/appContext";

const LeaderboardComponent = () => {
  const { store } = useContext(Context);
  const { leaderboard, player } = store;

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
          <p>
            Leaderboard:{" "}
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
                  {isMe(entry) && <span className="tx-sell"> (you)</span>}
                  {entry.prestigeLevel > 0 && (
                    <span className="tx-prestige"> (Prestige {entry.prestigeLevel})</span>
                  )}
                </span>
                <span>
                  Lvl {entry.level} · {entry.credits.toFixed(0)} credits · {entry.storyWins}{" "}
                  story wins
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
