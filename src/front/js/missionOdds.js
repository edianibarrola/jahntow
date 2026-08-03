// Preview-only mirror of the success-chance formula the backend actually
// uses to resolve a mission attempt (src/api/economy.py
// mission_success_chance). This is purely for display, so players can see
// how their level/gear affects their odds before committing - the server
// recomputes and enforces the real chance at attempt time regardless of
// what this shows.
const BASE_SUCCESS_CHANCE = 0.5;
const SUCCESS_PER_LEVEL_ADVANTAGE = 0.03;
const SUCCESS_PER_EXTRA_EQUIPMENT = 0.02;
const MAX_EQUIPMENT_BONUS = 0.1;
const MIN_SUCCESS_CHANCE = 0.15;
const MAX_SUCCESS_CHANCE = 0.92;

export const previewSuccessChance = (player, mission) => {
  const levelAdvantage = player.level - mission.Rank;
  let chance = BASE_SUCCESS_CHANCE + levelAdvantage * SUCCESS_PER_LEVEL_ADVANTAGE;

  const equipment = player.equipment || {};
  let equipmentBonus = 0;
  Object.entries(mission.requiredEquipment || {}).forEach(
    ([itemName, requiredQty]) => {
      const ownedQty = equipment[itemName]?.quantity || 0;
      const extra = Math.max(0, ownedQty - requiredQty);
      equipmentBonus += extra * SUCCESS_PER_EXTRA_EQUIPMENT;
    }
  );
  chance += Math.min(equipmentBonus, MAX_EQUIPMENT_BONUS);

  chance = Math.max(MIN_SUCCESS_CHANCE, Math.min(MAX_SUCCESS_CHANCE, chance));
  return Math.round(chance * 100);
};
