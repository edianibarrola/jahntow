import React, { useContext } from "react";
import { Context } from "../store/appContext";

// The narrative arc is authored as five beats per story chapter
// ("Disable Spy Drones 1".."Disable Spy Drones 5"), so chapter N occupies
// arc entries N*5 .. N*5+4.
const ARC_BEATS_PER_CHAPTER = 5;
// Mirrors STORY_WINS_PER_UNLOCK in src/api/game_routes.py.
const STORY_WINS_PER_UNLOCK = 2;

const StoryMissionDetailsComponent = () => {
  const { store } = useContext(Context);
  const { player, storyMissionArc, charactersImages } = store;

  // Select by *chapter*, not by raw win count. Keying off storyWins
  // directly assumed one arc beat per win, which only held while the
  // unlock gate was also 5 - once the gate changed, the story text drifted
  // out of step with the mission actually being shown (e.g. standing on
  // "Free Oases" while the panel still narrated "Disable Spy Drones 5").
  const arc = Object.values(storyMissionArc);
  const chapterIndex = Math.floor(player.storyWins / STORY_WINS_PER_UNLOCK);
  // Clamp so a player past the final chapter keeps seeing the closing
  // beats rather than an empty panel.
  const start = Math.min(
    chapterIndex * ARC_BEATS_PER_CHAPTER,
    Math.max(0, arc.length - ARC_BEATS_PER_CHAPTER)
  );
  const availableMissions = arc.slice(start, start + ARC_BEATS_PER_CHAPTER);

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
