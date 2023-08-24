import React, { useContext } from "react";
import { Context } from "../store/appContext";

const StoryMissionDetailsComponent = () => {
  const { store } = useContext(Context);
  const { player, storyMissionArc, charactersImages } = store;

  const availableMissions = Object.values(storyMissionArc).filter(
    (mission) => mission.requiredMissionWins === player.storyWins
  );

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
