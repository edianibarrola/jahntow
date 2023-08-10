import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { Accordion } from "react-bootstrap";

const MissionsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, missionsData } = store;
  const [selectedMission, setSelectedMission] = useState("");
  const [isMissionRunning, setMissionRunning] = useState(false);

  useEffect(() => {
    const energyRegenInterval = actions.startEnergyRegen();

    // Return a cleanup function that runs when the component is unmounted
    return () => {
      clearInterval(energyRegenInterval);
    };
  }, []); // Empty dependency array means this effect will only run once, when the component mounts

  const missionsPerSet = 4;
  const maxRank = Math.min(Math.ceil(player.level / missionsPerSet), 25);

  const startMission = () => {
    if (!selectedMission) {
      alert("Please select a mission!");
      return;
    }

    const mission = missionsData[selectedMission];
    if (mission) {
      // Check if the player meets the required credits and energy for the mission
      if (
        player.credits >= mission["Required Credits"] &&
        player.energy >= mission["Required Energy"]
      ) {
        // Check if the mission has required equipment
        const requiredEquipment = mission.requiredEquipment;
        const hasRequiredEquipment = Object.keys(requiredEquipment).every(
          (equipment) =>
            player.equipment[equipment]?.quantity >=
            requiredEquipment[equipment]
        );

        if (hasRequiredEquipment) {
          // Continue with the mission
          setMissionRunning(true);

          const updatedPlayer = {
            ...player,
            credits: player.credits - mission["Required Credits"],
            energy: player.energy - mission["Required Energy"],
          };
          actions.updatePlayer(updatedPlayer);
          actions.updatePlayerLevel();

          alert(mission.startMessage); // Display the mission start message

          setTimeout(() => {
            const success = Math.random() > 0.5;

            if (success) {
              alert(mission.successMessage); // Display the mission success message
              const updatedPlayer = {
                ...player,
                credits: player.credits + mission["Required Credits"],
                experience: player.experience + mission["Experience"],
                health: player.health,
                energy:
                  player.energy -
                  mission["Required Energy"] +
                  mission["Required Energy"] / 2, // Recover some energy
              };
              actions.updatePlayer(updatedPlayer);
              actions.updatePlayerLevel();
            } else {
              alert(mission.failureMessage); // Display the mission failure message

              // Calculate the updated equipment quantities after removing required items
              const updatedEquipment = { ...player.equipment };
              const requiredEquipment = mission.requiredEquipment;
              Object.keys(requiredEquipment).forEach((equipment) => {
                const requiredQuantity = requiredEquipment[equipment];
                if (updatedEquipment[equipment]?.quantity >= requiredQuantity) {
                  updatedEquipment[equipment].quantity -= requiredQuantity;
                }
              });

              const updatedPlayer = {
                ...player,
                credits: player.credits - mission["Required Credits"],
                health: player.health - mission["Health Effect"],
                energy:
                  player.energy -
                  mission["Required Energy"] +
                  mission["Required Energy"] / 8,
                equipment: updatedEquipment, // Update the equipment after removal
              };
              if (updatedPlayer.health <= 0) {
                alert("Game Over");
                actions.resetPlayer();
              } else {
                actions.updatePlayer(updatedPlayer);
                actions.updatePlayerLevel();
              }
            }

            setMissionRunning(false);
          }, (10 + Math.random() * 20) * 100);
        } else {
          // The player doesn't have the required equipment for the mission
          alert("You don't have the required equipment for this mission.");
        }
      } else {
        alert("You do not have enough credits or energy for this mission.");
      }
    } else {
      alert("Invalid mission selected!");
    }
  };

  return (
    <div className="row mb-3">
      <div className="col-12 text-center">
        <h1>Missions</h1>
      </div>

      <div className="col-12">
        <Accordion defaultActiveKey="0">
          {Object.entries(missionsData)
            .filter(([, missionData]) => missionData.Rank <= player.level)
            .map(([missionName, missionData], index) => (
              <Accordion.Item
                className="holo"
                eventKey={index.toString()}
                key={missionName}
              >
                <Accordion.Header className="holo">
                  {missionName}
                </Accordion.Header>
                <Accordion.Body>
                  <div className="col-12 pl-5 pr-5 text-center">
                    <ul className="holo">
                      <li>Reward: {missionData.Reward}</li>
                      <li>
                        Required Credits: {missionData["Required Credits"]}
                      </li>
                      <li>Required Energy: {missionData["Required Energy"]}</li>
                      <li> Health Risk: -{missionData["Health Effect"]}</li>
                      <li>Required Equipment:</li>
                      <ul>
                        {Object.entries(missionData.requiredEquipment).map(
                          ([equipment, quantity]) => (
                            <li key={equipment}>
                              {equipment} x{quantity}
                            </li>
                          )
                        )}
                      </ul>
                    </ul>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
        </Accordion>
      </div>

      <div className="col-12 mt-5 mb-5 text-center">
        <select
          onChange={(e) => setSelectedMission(e.target.value)}
          value={selectedMission}
        >
          <option value="">Select a mission</option>
          {Object.keys(missionsData)
            .filter(
              (missionName) => missionsData[missionName].Rank <= player.level
            )
            .map((missionName) => (
              <option key={missionName} value={missionName}>
                {missionName}
              </option>
            ))}
        </select>
        <button onClick={startMission} disabled={isMissionRunning}>
          {isMissionRunning ? "Mission in progress..." : "Start Mission"}
        </button>
      </div>
    </div>
  );
};

export default MissionsComponent;
