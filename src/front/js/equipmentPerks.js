// Client-side mirror of economy.EQUIPMENT_PERKS - the server is what
// actually applies these bonuses; this exists only to render them.
// Percent units here (2 = 2%) for direct display.
export const EQUIPMENT_PERKS = {
  Research: { perUnit: 2, cap: 10, effect: "mission XP", sign: "+" },
  Transports: { perUnit: 2, cap: 10, effect: "mission energy cost", sign: "-" },
  Armor: { perUnit: 5, cap: 25, effect: "failure health loss", sign: "-" },
  Vehicles: { perUnit: 2, cap: 10, effect: "mission credit reward", sign: "+" },
};

// Current capped bonus (in %) the player gets from one perk category.
export const perkBonusPct = (player, category, equipmentCatalog) => {
  const cfg = EQUIPMENT_PERKS[category];
  if (!cfg) return 0;
  const items = Object.keys((equipmentCatalog || {})[category] || {});
  const units = items.reduce(
    (sum, name) => sum + ((player.equipment || {})[name]?.quantity || 0),
    0
  );
  return Math.min(cfg.cap, units * cfg.perUnit);
};

// Every perk category the player currently has a non-zero bonus in.
export const activePerks = (player, equipmentCatalog) =>
  Object.entries(EQUIPMENT_PERKS)
    .map(([category, cfg]) => ({
      category,
      ...cfg,
      pct: perkBonusPct(player, category, equipmentCatalog),
    }))
    .filter((perk) => perk.pct > 0);
