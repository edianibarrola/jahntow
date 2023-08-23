import React, { useContext } from "react";
import { Context } from "../store/appContext";

const StoryMissionDetailsComponent = () => {
  const { store } = useContext(Context);
  const { player, storyMissionArc } = store;

  // Filter the missions
  const availableMissions = Object.values(storyMissionArc).filter(
    (mission) => mission.requiredMissionWins === player.storyWins
  );

  return (
    <div className="col-4">
      {availableMissions.map((mission, index) => (
        <div key={index}>
          {mission.Title}

          {mission.Message}
        </div>
      ))}
    </div>
  );
};

export default StoryMissionDetailsComponent;
