import React, { useContext } from "react";
import { Context } from "../store/appContext";

const StoryMissionDetailsComponent = () => {
  const { store } = useContext(Context);
  const { player, storyMissionArc, charactersImages } = store;

  // One beat per win, in order: winning the current story mission reveals
  // the next part of its story. That correspondence is the whole point of
  // the arc, so the beats advance with storyWins rather than being dumped
  // out a chapter at a time. This only stays aligned because
  // STORY_WINS_PER_UNLOCK matches the beats authored per chapter - see the
  // note on that constant in src/api/game_routes.py.
  const arc = Object.values(storyMissionArc);
  const beatIndex = Math.min(player.storyWins, arc.length - 1);
  const availableMissions = arc.length ? [arc[beatIndex]] : [];

  return (
    <div className="col-12">
      {availableMissions.map((mission, index) => (
        <div className="holo mb-4 p-3 border rounded" key={index}>
          <h3 className="mb-3">{mission.Title}</h3>

          <div className="flex-row-custom m-0">
            {mission.Characters.map((character) => (
              <div className="m-0 p-0" key={character}>
                <img
                  key={character}
                  src={charactersImages[character]}
                  alt={character}
                  className="img-contain"
                  style={{ maxWidth: "20vw" }}
                />
              </div>
            ))}
          </div>

          <p className="mt-3">{mission.Message}</p>
        </div>
      ))}
    </div>
  );
};

export default StoryMissionDetailsComponent;
