import React, { useContext } from "react";
import { Context } from "../store/appContext";

const LeaderboardComponent = () => {
  const { store } = useContext(Context);
  const { leaderboard } = store;

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="col-12 text-center">
          <p>Leaderboard:</p>
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
              >
                <span>
                  #{index + 1} {entry.name}
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
