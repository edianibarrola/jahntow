import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";
import StoryMissionDetailsComponent from "./storyMissionDetailsComponent";

const StoryMissions = () => {
  const { store, actions } = useContext(Context);
  const { player, storyMissionsData } = store;
  const [selectedStoryMission, setSelectedStoryMission] = useState("");
  const [isStoryMissionRunning, setStoryMissionRunning] = useState(false);

  const startStoryMission = () => {
    if (!selectedStoryMission) {
      alert("Please select a StoryMission!");
      return;
    }

    const storyMission = storyMissionsData[selectedStoryMission];
    if (storyMission) {
      // Check if the player meets the required credits and energy for the storyMission
      if (
        player.credits >= storyMission["Required Credits"] &&
        player.energy >= storyMission["Required Energy"]
      ) {
        // Check if the storyMission has required equipment
        const requiredEquipment = storyMission.requiredEquipment;
        const hasRequiredEquipment = Object.keys(requiredEquipment).every(
          (equipment) =>
            player.equipment[equipment]?.quantity >=
            requiredEquipment[equipment]
        );

        if (hasRequiredEquipment) {
          // Continue with the mission
          setStoryMissionRunning(true);

          const updatedPlayer = {
            ...player,
            credits: player.credits - storyMission["Required Credits"],
            energy: player.energy - storyMission["Required Energy"],
          };
          actions.updatePlayer(updatedPlayer);
          actions.updatePlayerLevel();

          alert(storyMission.startMessage); // Display the storyMission start message

          setTimeout(() => {
            const success = Math.random() > 0.5;

            if (success) {
              alert(storyMission.successMessage); // Display the storyMission success message
              const updatedPlayer = {
                ...player,
                credits: player.credits + storyMission["Required Credits"],
                experience: player.experience + storyMission["Experience"],
                health: player.health,
                storyWins: player.storyWins + 1,
                energy: Math.round(
                  player.energy -
                    storyMission["Required Energy"] +
                    storyMission["Required Energy"] / 2
                ), // Recover some energy
              };
              actions.updatePlayer(updatedPlayer);
              actions.updatePlayerLevel();
            } else {
              alert(storyMission.failureMessage); // Display the storyMission failure message

              // Calculate the updated equipment quantities after removing required items
              const updatedEquipment = { ...player.equipment };
              const requiredEquipment = storyMission.requiredEquipment;
              console.log("Required Equipment:", requiredEquipment); // Add this line
              Object.keys(requiredEquipment).forEach((equipment) => {
                const requiredQuantity = requiredEquipment[equipment];
                if (updatedEquipment[equipment]?.quantity >= requiredQuantity) {
                  updatedEquipment[equipment].quantity -= requiredQuantity;
                  console.log(
                    "Equipment Removed:",
                    equipment,
                    requiredQuantity
                  ); // Add this line
                }
              });

              const updatedPlayer = {
                ...player,
                credits: player.credits - storyMission["Required Credits"],
                health: player.health - storyMission["Health Effect"],
                energy: Math.round(
                  player.energy -
                    storyMission["Required Energy"] +
                    storyMission["Required Energy"] / 8
                ),

                equipment: updatedEquipment, // Update the equipment after removal
              };

              console.log("Updated Equipment:", updatedEquipment); // Add this line
              console.log("Updated Player:", updatedPlayer); // Add this line
              if (updatedPlayer.health <= 0) {
                alert("Game Over");
                actions.resetPlayer();
              } else {
                actions.updatePlayer(updatedPlayer);
                actions.updatePlayerLevel();
              }
            }

            setStoryMissionRunning(false);
          }, (10 + Math.random() * 20) * 100);
        } else {
          // The player doesn't have the required equipment for the mission
          alert("You don't have the required equipment for this storyMission.");
        }
      } else {
        alert(
          "You do not have enough credits or energy for this storyMission."
        );
      }
    } else {
      alert("Invalid storyMission selected!");
    }
  };

  const availableMissionIndex = Math.floor(player.storyWins / 5);
  const availableMissionName =
    Object.keys(storyMissionsData)[availableMissionIndex];

  return (
    <div className="row mb-3">
      <div className="row  sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} />
          <EnergyComponent energy={player.energy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <select
            onChange={(e) => setSelectedStoryMission(e.target.value)}
            value={selectedStoryMission}
            disabled={isStoryMissionRunning}
          >
            <option value="">Select a story mission</option>
            {availableMissionName && (
              <option key={availableMissionName} value={availableMissionName}>
                {availableMissionName}
              </option>
            )}
          </select>
          <button onClick={startStoryMission} disabled={isStoryMissionRunning}>
            {isStoryMissionRunning
              ? "Story Mission in progress..."
              : "Start Mission"}
          </button>
        </div>
      </div>
      <div className="row mb-5">
        <Accordion>
          {Object.entries(storyMissionsData).map(
            ([storyMissionName, storyMissionData], index) => {
              const startWin = index * 5; // Calculate the start win for the mission

              if (
                player.storyWins >= startWin &&
                player.storyWins < startWin + 5
              ) {
                return (
                  <Accordion.Item
                    className="holo"
                    eventKey={storyMissionName} // Use storyMissionName as the eventKey
                    key={storyMissionName}
                  >
                    <Accordion.Header>{storyMissionName}</Accordion.Header>
                    <Accordion.Body>
                      <div className="col-12 pl-5 pr-5 text-center">
                        <ul className="holo">
                          <li>Reward: {storyMissionData.Reward}</li>
                          <li>
                            Required Credits:{" "}
                            {storyMissionData["Required Credits"]}
                          </li>
                          <li>
                            Required Energy:{" "}
                            {storyMissionData["Required Energy"]}
                          </li>
                          <li>
                            Health Risk: -{storyMissionData["Health Effect"]}
                          </li>
                          <li>Required Equipment:</li>
                          <ul>
                            {Object.entries(
                              storyMissionData.requiredEquipment
                            ).map(([equipment, quantity]) => (
                              <li key={equipment}>
                                {equipment} x{quantity}
                              </li>
                            ))}
                          </ul>
                        </ul>
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              } else {
                return null; // Don't render the mission if not available yet
              }
            }
          )}
        </Accordion>
      </div>
      <StoryMissionDetailsComponent />
    </div>
  );
};

export default StoryMissions;
