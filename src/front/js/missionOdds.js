// Preview-only mirror of the success-chance formula the backend actually
// uses to resolve a mission attempt (src/api/economy.py
// mission_success_chance). This is purely for display, so players can see
// how their level/gear affects their odds before committing - the server
// recomputes and enforces the real chance at attempt time regardless of
// what this shows.
const BASE_SUCCESS_CHANCE = 0.44;
const SUCCESS_PER_LEVEL_ADVANTAGE = 0.035;
const SUCCESS_PER_EXTRA_EQUIPMENT = 0.02;
const MAX_EQUIPMENT_BONUS = 0.2;
const MAX_LEVEL_ADVANTAGE_BONUS = 0.18;
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

// Mirrors economy.WARBAND_* / ESCORT_*: warband escorts on regular ops.
const WARBAND_KIT_SIZE = 10;
// Round 6: dry = 0 readiness (no bonuses at all); fed-but-kitless runs
// at the base; full kits reach 100. Mirrors economy.warband_readiness.
const WARBAND_READINESS_BASE = 25;
const ESCORT_SUCCESS_MAX = 0.05;
const ESCORT_SOLO_RANK = 8;

const warbandReadiness = (state, boon = 0) => {
  const strength = state.strength || 0;
  if (strength <= 0) return 0;
  if ((state.provisions || 0) <= 0) return 0;
  const kitsNeeded = Math.max(1, Math.ceil(strength / WARBAND_KIT_SIZE));
  const coverage = Math.min(1, (state.kits || 0) / kitsNeeded);
  return Math.min(
    100,
    Math.round(
      WARBAND_READINESS_BASE + (100 - WARBAND_READINESS_BASE) * coverage
    ) + boon
  );
};

// Mirrors economy.warband_boon_points: +10 readiness if a recorded story
// choice granted this tribe its boon (boonCatalog = gameData.warbandBoons).
export const warbandBoonPoints = (player, boonCatalog, faction) => {
  if (!boonCatalog) return 0;
  const resolved = player.storyChoices || {};
  return Object.entries(resolved).some(([choiceId, optionId]) => {
    const boon = boonCatalog[`${choiceId}:${optionId}`];
    return boon && boon.faction === faction;
  })
    ? 10
    : 0;
};

// Mirrors economy.story_perks: permanent effects from recorded choices
// (perkCatalog = gameData.storyChoicePerks).
export const storyChoicePerks = (player, perkCatalog) => {
  const out = {
    successBonus: 0,
    rewardBonus: 0,
    failureHealthMult: 1,
    propertyBonus: 0,
    labels: [],
  };
  if (!perkCatalog) return out;
  Object.entries(player.storyChoices || {}).forEach(([choiceId, optionId]) => {
    const perk = perkCatalog[`${choiceId}:${optionId}`];
    if (!perk) return;
    out.successBonus += perk.success_bonus || 0;
    out.rewardBonus += perk.reward_bonus || 0;
    out.failureHealthMult *= perk.failure_health_mult ?? 1;
    out.propertyBonus += perk.property_bonus || 0;
    out.labels.push(perk.label);
  });
  return out;
};

// Mirrors economy.pick_escort/escort_bonus: which warband escorts this op,
// whether the strength gate is met, and the success bonus it contributes.
export const escortInfo = (player, mission, warbandCatalog, boonCatalog) => {
  if (!warbandCatalog || !mission.Region || mission.Guaranteed) return null;
  const need =
    mission.Rank <= ESCORT_SOLO_RANK
      ? 0
      : Math.min(60, Math.ceil((mission.Rank - ESCORT_SOLO_RANK) / 8) * 10);
  if (need === 0) return null;
  const unlocked = Object.entries(warbandCatalog).filter(
    ([, cfg]) => (player.storyWins || 0) >= cfg.unlock_wins
  );
  const strengthOf = (faction) => player.warbands?.[faction]?.strength || 0;
  // Home escorts when it can meet the gate; otherwise the strongest
  // unlocked warband marches (mirrors economy.pick_escort).
  const home =
    unlocked.find(([, cfg]) => cfg.region === mission.Region) || null;
  let pick = home && strengthOf(home[0]) >= need ? home : null;
  if (!pick) {
    unlocked.forEach((entry) => {
      if (!pick || strengthOf(entry[0]) > strengthOf(pick[0])) pick = entry;
    });
  }
  const state = pick
    ? { strength: 0, kits: 0, provisions: 0, ...(player.warbands?.[pick[0]] || {}) }
    : { strength: 0 };
  const readiness = pick
    ? warbandReadiness(
        state,
        warbandBoonPoints(player, boonCatalog, pick[0])
      )
    : 0;
  const isHome = !!pick && pick[1].region === mission.Region;
  return {
    need,
    name: pick ? pick[1].name : null,
    strength: state.strength,
    readiness,
    isHome,
    met: state.strength >= need,
    bonus:
      pick && readiness > 0
        ? ESCORT_SUCCESS_MAX * (readiness / 100) * (isHome ? 1 : 0.5)
        : 0,
  };
};

// Broken out so the UI can explain *why* the odds are what they are - and
// in particular show that the gear bonus is capped, which was previously
// invisible: stockpiling spares past the cap changed nothing on screen and
// nothing told you why.
export const successBreakdown = (
  player,
  mission,
  warbandCatalog = null,
  storyGate = null,
  extras = {}
) => {
  const { boonCatalog = null, perkCatalog = null } = extras;
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
  let requiredUnits = 0;
  Object.entries(mission.requiredEquipment || {}).forEach(
    ([itemName, requiredQty]) => {
      const ownedQty = equipment[itemName]?.quantity || 0;
      const extra = Math.max(0, ownedQty - requiredQty);
      extraUnits += extra;
      requiredUnits += requiredQty;
      rawEquipmentBonus += extra * SUCCESS_PER_EXTRA_EQUIPMENT;
    }
  );
  const equipmentBonus = Math.min(rawEquipmentBonus, MAX_EQUIPMENT_BONUS);

  const repBonus = factionBonus(player, mission);
  const escort = escortInfo(player, mission, warbandCatalog, boonCatalog);
  const escortBonus = escort ? escort.bonus : 0;
  const perks = storyChoicePerks(player, perkCatalog);
  // Mirrors economy.story_warband_bonus: warband-gated story battles
  // collect a readiness-scaled bonus (faction gate -> that warband;
  // host gate -> the six-warband average).
  const readinessFor = (faction) =>
    warbandReadiness(
      {
        strength: 0,
        kits: 0,
        provisions: 0,
        ...(player.warbands?.[faction] || {}),
      },
      warbandBoonPoints(player, boonCatalog, faction)
    );
  let gateBonus = 0;
  if (storyGate) {
    const readiness = storyGate.faction
      ? readinessFor(storyGate.faction)
      : (() => {
          const factions = Object.keys(warbandCatalog || {});
          return factions.length
            ? factions.reduce((sum, f) => sum + readinessFor(f), 0) /
                factions.length
            : 0;
        })();
    gateBonus = ESCORT_SUCCESS_MAX * (readiness / 100);
  }
  // The boss fight's odds are hard-capped server-side; mirror it so the
  // preview never overstates.
  const ceiling = mission.Boss
    ? Math.min(MAX_SUCCESS_CHANCE, BOSS_MAX_SUCCESS_CHANCE)
    : MAX_SUCCESS_CHANCE;
  const chance = Math.max(
    MIN_SUCCESS_CHANCE,
    Math.min(
      ceiling,
      BASE_SUCCESS_CHANCE + advantageBonus + equipmentBonus + repBonus +
        escortBonus + gateBonus + perks.successBonus
    )
  );

  return {
    escort,
    gateBonusPct: Math.round(gateBonus * 1000) / 10,
    chance: Math.round(chance * 100),
    basePct: Math.round(BASE_SUCCESS_CHANCE * 100),
    levelPct: Math.round(advantageBonus * 100),
    gearPct: Math.round(equipmentBonus * 100),
    gearMaxPct: Math.round(MAX_EQUIPMENT_BONUS * 100),
    // >= not >: the spare that lands you exactly on the cap is the last
    // one that does anything, so that's the moment to say "stop buying".
    // With > , holding exactly the cap (11 owned against a x1 requirement)
    // showed the same 68% as holding 14 but said nothing about being
    // maxed, which read as an off-by-one.
    gearCapped: rawEquipmentBonus >= MAX_EQUIPMENT_BONUS,
    // Spares beyond this add nothing - surfacing it stops players buying
    // gear that can't help them.
    usefulSpares: Math.round(MAX_EQUIPMENT_BONUS / SUCCESS_PER_EXTRA_EQUIPMENT),
    // The same ceiling expressed as a total holding, because that's the
    // number the card actually shows ("Owned: N"). Quoting only the spare
    // count made players stop one unit short of the cap.
    usefulTotal:
      requiredUnits +
      Math.round(MAX_EQUIPMENT_BONUS / SUCCESS_PER_EXTRA_EQUIPMENT),
    // How many more units would still earn something (0 once capped).
    sparesToMax: Math.max(
      0,
      Math.round(
        (MAX_EQUIPMENT_BONUS - rawEquipmentBonus) / SUCCESS_PER_EXTRA_EQUIPMENT
      )
    ),
    extraUnits,
  };
};

export const previewSuccessChance = (
  player,
  mission,
  warbandCatalog = null,
  storyGate = null,
  extras = {}
) =>
  successBreakdown(player, mission, warbandCatalog, storyGate, extras).chance;
