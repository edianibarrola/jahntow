import React, { useContext } from "react";
import { Context } from "../store/appContext";

// Mirrors economy.MAX_LEVEL on the backend - the level at which a player
// has reached the top of everything the mission/item catalog offers.
const MAX_LEVEL = 50;

const PrestigeButton = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  const handlePrestige = () => {
    if (
      window.confirm(
        `Prestige now? Level, credits, equipment, inventory, and properties reset - but your maxHealth/maxEnergy/maxInventory floor rises permanently (this will be Prestige ${player.prestigeLevel + 1}), and your story progress is kept.`
      )
    ) {
      actions.prestige();
    }
  };

  if (player.level < MAX_LEVEL) {
    return (
      <p>
        Reach level {MAX_LEVEL} to prestige (currently level {player.level}
        {player.prestigeLevel > 0 ? `, Prestige ${player.prestigeLevel}` : ""}
        ).
      </p>
    );
  }

  return (
    <div>
      <button onClick={handlePrestige}>
        Prestige
        {player.prestigeLevel > 0 ? ` (currently Prestige ${player.prestigeLevel})` : ""}
      </button>
    </div>
  );
};

export default PrestigeButton;
