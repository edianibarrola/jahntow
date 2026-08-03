// Preview-only mirror of the success-chance formula the backend actually
// uses to resolve a mission attempt (src/api/economy.py
// mission_success_chance). This is purely for display, so players can see
// how their level/gear affects their odds before committing - the server
// recomputes and enforces the real chance at attempt time regardless of
// what this shows.
const BASE_SUCCESS_CHANCE = 0.48;
const SUCCESS_PER_LEVEL_ADVANTAGE = 0.035;
const SUCCESS_PER_EXTRA_EQUIPMENT = 0.02;
const MAX_EQUIPMENT_BONUS = 0.2;
const MAX_LEVEL_ADVANTAGE_BONUS = 0.22;
const MIN_SUCCESS_CHANCE = 0.1;
const MAX_SUCCESS_CHANCE = 0.92;
// Mirrors economy.REP_* / BOSS_MAX_SUCCESS_CHANCE.
const REP_TIER_1 = 10;
const REP_TIER_2 = 25;
const REP_STORY_BONUS_T1 = 0.03;
const REP_STORY_BONUS_T2 = 0.05;
const BOSS_MAX_SUCCESS_CHANCE = 0.75;
const FACTIONS = [
  "Xictlians",
  "Luxorians",
  "Xiaojians",
  "Titans",
  "Tuathans",
  "Namarupians",
];

// Mirrors economy.story_faction_bonus: faction standing helps on that
// faction's own story missions; United Front missions use the weakest of
// the six bonds.
const factionBonus = (player, mission) => {
  const faction = mission.Faction;
  if (!faction) return 0;
  const rep = player.reputation || {};
  const points =
    faction === "United Front"
      ? Math.min(...FACTIONS.map((f) => rep[f] || 0))
      : rep[faction] || 0;
  if (points >= REP_TIER_2) return REP_STORY_BONUS_T2;
  if (points >= REP_TIER_1) return REP_STORY_BONUS_T1;
  return 0;
};

// Broken out so the UI can explain *why* the odds are what they are - and
// in particular show that the gear bonus is capped, which was previously
// invisible: stockpiling spares past the cap changed nothing on screen and
// nothing told you why.
export const successBreakdown = (player, mission) => {
  const levelAdvantage = player.level - mission.Rank;
  // Only the upside is capped, matching the server: being under-levelled
  // still hurts without limit.
  const advantageBonus = Math.min(
    levelAdvantage * SUCCESS_PER_LEVEL_ADVANTAGE,
    MAX_LEVEL_ADVANTAGE_BONUS
  );

  const equipment = player.equipment || {};
  let rawEquipmentBonus = 0;
  let extraUnits = 0;
  Object.entries(mission.requiredEquipment || {}).forEach(
    ([itemName, requiredQty]) => {
      const ownedQty = equipment[itemName]?.quantity || 0;
      const extra = Math.max(0, ownedQty - requiredQty);
      extraUnits += extra;
      rawEquipmentBonus += extra * SUCCESS_PER_EXTRA_EQUIPMENT;
    }
  );
  const equipmentBonus = Math.min(rawEquipmentBonus, MAX_EQUIPMENT_BONUS);

  const repBonus = factionBonus(player, mission);
  // The boss fight's odds are hard-capped server-side; mirror it so the
  // preview never overstates.
  const ceiling = mission.Boss
    ? Math.min(MAX_SUCCESS_CHANCE, BOSS_MAX_SUCCESS_CHANCE)
    : MAX_SUCCESS_CHANCE;
  const chance = Math.max(
    MIN_SUCCESS_CHANCE,
    Math.min(
      ceiling,
      BASE_SUCCESS_CHANCE + advantageBonus + equipmentBonus + repBonus
    )
  );

  return {
    chance: Math.round(chance * 100),
    basePct: Math.round(BASE_SUCCESS_CHANCE * 100),
    levelPct: Math.round(advantageBonus * 100),
    gearPct: Math.round(equipmentBonus * 100),
    gearMaxPct: Math.round(MAX_EQUIPMENT_BONUS * 100),
    gearCapped: rawEquipmentBonus > MAX_EQUIPMENT_BONUS,
    // Spares beyond this add nothing - surfacing it stops players buying
    // gear that can't help them.
    usefulSpares: Math.round(MAX_EQUIPMENT_BONUS / SUCCESS_PER_EXTRA_EQUIPMENT),
    extraUnits,
  };
};

export const previewSuccessChance = (player, mission) =>
  successBreakdown(player, mission).chance;
