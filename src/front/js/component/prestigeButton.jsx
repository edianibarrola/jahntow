import React, { useContext } from "react";
import { Context } from "../store/appContext";

// Mirrors economy.MAX_LEVEL / PRESTIGE_REWARD_BONUS_* on the backend.
const MAX_LEVEL = 50;
const BONUS_PER_LEVEL = 12; // percent
const BONUS_CAP = 60;

const bonusAt = (prestigeLevel) =>
  Math.min(BONUS_CAP, prestigeLevel * BONUS_PER_LEVEL);

const PrestigeButton = () => {
  const { store, actions } = useContext(Context);
  const { player } = store;

  const handlePrestige = () => {
    if (
      window.confirm(
        `Prestige now? Level, credits, equipment, inventory, and properties reset - ` +
          `but you keep your ship and story progress, your stat floors rise permanently, ` +
          `and every mission pays +${bonusAt(player.prestigeLevel + 1)}% credits and XP ` +
          `forever (this will be Prestige ${player.prestigeLevel + 1}).`
      )
    ) {
      actions.prestige();
    }
  };

  const currentBonus = bonusAt(player.prestigeLevel);

  if (player.level < MAX_LEVEL) {
    return (
      <p>
        Reach level {MAX_LEVEL} to prestige (currently level {player.level}
        {player.prestigeLevel > 0
          ? `, Prestige ${player.prestigeLevel} — +${currentBonus}% mission credits & XP`
          : ""}
        ).
      </p>
    );
  }

  return (
    <div>
      <button onClick={handlePrestige}>
        Prestige — next: +{bonusAt(player.prestigeLevel + 1)}% mission credits & XP
        {player.prestigeLevel > 0 ? ` (currently +${currentBonus}%)` : ""}
      </button>
    </div>
  );
};

export default PrestigeButton;
