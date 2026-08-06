import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import HealthComponent from "./healthComponent";
import EnergyComponent from "./energyComponent";
import CreditsComponent from "./creditsComponent";

// Mirrors the economy.WARBAND_* constants - display only, the server
// owns every transaction and gate.
const KIT_SIZE = 10;
const KIT_COST_MULT = 5;
const COST_GROWTH = 50;
const MAX_STRENGTH = 100;
const READINESS_FLOOR = 40;
const PROVISION_CAP_HOURS = 24;
const DRAIN_PER_HOUR = (strength) => (strength / KIT_SIZE) * 1.0;

const volunteerCost = (base, current) =>
  Math.max(1, Math.round(base * (1 + current / COST_GROWTH)));

const fundCost = (base, current, count) => {
  let total = 0;
  for (let i = 0; i < count; i++) total += volunteerCost(base, current + i);
  return total;
};

const readinessOf = (state, boon = 0) => {
  const strength = state.strength || 0;
  if (strength <= 0) return 0;
  if ((state.provisions || 0) <= 0)
    return Math.min(100, READINESS_FLOOR + boon);
  const kitsNeeded = Math.max(1, Math.ceil(strength / KIT_SIZE));
  const coverage = Math.min(1, (state.kits || 0) / kitsNeeded);
  return Math.min(
    100,
    Math.round(READINESS_FLOOR + (100 - READINESS_FLOOR) * coverage) + boon
  );
};

const WarbandsComponent = () => {
  const { store, actions } = useContext(Context);
  const { player, gameData, charactersImages, characterLore, marketPrices } =
    store;
  const catalog = gameData.warbands || {};
  const [busy, setBusy] = useState(null);

  const priceOf = (itemName) =>
    (marketPrices || []).find((r) => r.item_name === itemName)?.buy_price || 0;

  const act = (kind, faction, amount) => {
    setBusy(faction);
    const call =
      kind === "fund"
        ? actions.fundWarband(faction, amount)
        : kind === "kit"
        ? actions.kitWarband(faction, amount)
        : kind === "assign"
        ? actions.assignWarband(faction, amount)
        : kind === "collect"
        ? actions.collectWarband(faction)
        : actions.provisionWarband(faction, amount);
    call.catch(() => {}).finally(() => setBusy(null));
  };

  const OP_LABELS = {
    patrol: "Patrol — earn credits",
    salvage: "Salvage sweep — bank goods",
    banners: "Show the banners — build reputation",
  };

  const unlocked = Object.entries(catalog).filter(
    ([, cfg]) => (player.storyWins || 0) >= cfg.unlock_wins
  );
  const nextLocked = Object.entries(catalog).find(
    ([, cfg]) => (player.storyWins || 0) < cfg.unlock_wins
  );

  return (
    <div className="row mb-3">
      <div className="row sticky-top holo text-center">
        <div className="row pt-2 pb-1 m-0 mb-1 justify-content-around text-center">
          <HealthComponent health={player.health} maxHealth={player.maxHealth} />
          <EnergyComponent energy={player.energy} maxEnergy={player.maxEnergy} />
          <CreditsComponent credits={player.credits} />
        </div>
        <div className="col-12 text-center">
          <p>
            Allied Warbands{" "}
            <span className="tx-info">
              — the tribes fight their own war; you keep them fed, armed and
              funded
            </span>
          </p>
        </div>
      </div>

      {unlocked.length === 0 && (
        <div className="col-12 holo p-3 text-center">
          <p className="m-0">
            No tribe has offered its warband yet — win their trust in the
            story missions first.
          </p>
        </div>
      )}

      {unlocked.map(([faction, cfg]) => {
        const state = {
          strength: 0,
          kits: 0,
          provisions: 0,
          ...(player.warbands?.[faction] || {}),
        };
        // A story-earned boon permanently raises this band's readiness.
        const boonEntry = Object.entries(player.storyChoices || {})
          .map(([choiceId, optionId]) =>
            (gameData.warbandBoons || {})[`${choiceId}:${optionId}`]
          )
          .find((boon) => boon && boon.faction === faction);
        const boonPoints = boonEntry
          ? gameData.warbandBoonReadiness || 10
          : 0;
        const readiness = readinessOf(state, boonPoints);
        const kitsNeeded = Math.max(
          1,
          Math.ceil(Math.max(1, state.strength) / KIT_SIZE)
        );
        const drain = DRAIN_PER_HOUR(state.strength);
        const hoursLeft = drain > 0 ? state.provisions / drain : 0;
        const provisionCap = Math.floor(drain * PROVISION_CAP_HOURS);
        const restock = Math.max(
          0,
          Math.min(provisionCap - Math.ceil(state.provisions),
                   Math.ceil(drain * 24))
        );
        const nextFive = fundCost(cfg.volunteer_cost, state.strength, 5);
        const kitCost = cfg.volunteer_cost * KIT_COST_MULT;
        const provisionPrice = priceOf(cfg.provision_item);
        const isBusy = busy !== null;
        const captain = characterLore?.[cfg.captain];
        return (
          <div className="col-12 col-md-6 p-2" key={faction}>
            <div className="holo p-3 h-100 warband-card">
              <div className="d-flex align-items-center gap-2">
                {charactersImages?.[cfg.captain] && (
                  <img
                    src={charactersImages[cfg.captain]}
                    alt={captain?.name || cfg.captain}
                    className="warband-captain"
                  />
                )}
                <div>
                  <strong>{cfg.name}</strong>
                  <div className="tx-info small">
                    {captain ? `Led by ${captain.name}` : ""} · {cfg.region}
                  </div>
                  <div className="tx-info small">{cfg.doctrine}</div>
                </div>
              </div>

              <div className="warband-readiness mt-2" title="Readiness: 40% floor when provisions run dry, up to 100% with full gear kits. It modulates escort effects - it never locks anything.">
                <div
                  className="warband-readiness-fill"
                  style={{ width: `${readiness}%` }}
                />
                <span className="warband-readiness-label">
                  Readiness {readiness}%
                </span>
              </div>

              {boonEntry && (
                <div className="tx-choice small mt-1">
                  ✦ Boon: {boonEntry.label} — +{boonPoints} readiness,
                  permanent
                </div>
              )}
              <ul className="warband-stats mt-2">
                <li>
                  Strength: <strong>{state.strength}</strong>/{MAX_STRENGTH}{" "}
                  <span className="tx-info">(permanent — never decays)</span>
                </li>
                <li>
                  Gear kits: {state.kits}/{kitsNeeded}{" "}
                  <span className="tx-info">(1 kit outfits {KIT_SIZE})</span>
                </li>
                <li>
                  Provisions: {Math.floor(state.provisions)} ·{" "}
                  {state.strength > 0 ? (
                    hoursLeft > 0 ? (
                      <span className={hoursLeft < 12 ? "tx-error" : "tx-sell"}>
                        ~{Math.floor(hoursLeft)}h of supply
                      </span>
                    ) : (
                      <span className="tx-error">
                        dry — readiness at floor
                      </span>
                    )
                  ) : (
                    <span className="tx-info">—</span>
                  )}
                </li>
              </ul>

              <div className="warband-actions">
                <div className="warband-action-row">
                  <button
                    className="btn-buy"
                    disabled={isBusy || state.strength + 5 > MAX_STRENGTH}
                    onClick={() => act("fund", faction, 5)}
                  >
                    ⚔️ Recruit +5 ({nextFive.toLocaleString()} cr)
                  </button>
                  <span className="warband-caption">
                    Permanent muscle — gates and escorts count bodies. Cost
                    rises as the company grows.
                  </span>
                </div>
                <div className="warband-action-row">
                  <button
                    className="btn-buy"
                    disabled={isBusy || state.kits >= kitsNeeded}
                    onClick={() => act("kit", faction, 1)}
                  >
                    🛡 Gear kit ({kitCost.toLocaleString()} cr)
                  </button>
                  <span className="warband-caption">
                    Arms 10 warriors — fills the readiness bar, which boosts
                    escorted ops and the big story battles.
                  </span>
                </div>
                <div className="warband-action-row">
                  <button
                    className="btn-buy"
                    disabled={isBusy || state.strength === 0 || restock === 0}
                    onClick={() => act("provision", faction, restock)}
                  >
                    🍞 Provision ({restock}x{" "}
                    <span className="tx-item">{cfg.provision_item}</span> ≈
                    {Math.round(restock * provisionPrice).toLocaleString()} cr)
                  </button>
                  <span className="warband-caption">
                    Food for ~{PROVISION_CAP_HOURS}h, bought at the live
                    market price. Drains hourly — twice as fast while
                    deployed. Dry means readiness floor and stalled
                    operations, never losses.
                  </span>
                </div>
              </div>

              <div className="warband-orders mt-2">
                <label className="tx-info small me-2">🎯 Orders:</label>
                <select
                  value={state.assignment || ""}
                  disabled={isBusy || state.strength === 0}
                  onChange={(e) =>
                    act("assign", faction, e.target.value || null)
                  }
                >
                  <option value="">Standing by</option>
                  {Object.entries(OP_LABELS).map(([kind, label]) => (
                    <option key={kind} value={kind}>
                      {label}
                    </option>
                  ))}
                </select>
                {(() => {
                  const stash = state.stash || {};
                  const credits = Math.floor(stash.credits || 0);
                  const items = Math.floor(stash.items || 0);
                  const rep = Math.floor(stash.rep || 0);
                  const anything = credits > 0 || items > 0 || rep > 0;
                  return (
                    <div className="mt-1">
                      <span className="tx-info small">
                        Stash:{" "}
                        {anything ? (
                          <>
                            {credits > 0 && `${credits.toLocaleString()} cr `}
                            {items > 0 && (
                              <>
                                {items}x{" "}
                                <span className="tx-item">
                                  {cfg.salvage_item}
                                </span>{" "}
                              </>
                            )}
                            {rep > 0 && `+${rep} rep `}
                          </>
                        ) : state.assignment ? (
                          "accruing…"
                        ) : (
                          "— assign an operation"
                        )}
                      </span>
                      {anything && (
                        <button
                          className="btn-buy ms-2"
                          disabled={isBusy}
                          onClick={() => act("collect", faction)}
                        >
                          📦 Collect report
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );
      })}

      {nextLocked && (
        <p className="tx-info text-center region-locked mt-2 mb-5">
          🔒 The {nextLocked[1].name} join the war at{" "}
          {nextLocked[1].unlock_wins} story wins (you:{" "}
          {player.storyWins || 0}).
        </p>
      )}
    </div>
  );
};

export default WarbandsComponent;
