import React, { useContext } from "react";
import { Context } from "../store/appContext";

const KIND_LABEL = {
  price_spike: "Price Spike",
  price_crash: "Price Crash",
};

// One compact chip per event - the strip is a single scrollable line of
// sticky chrome now, so the full sentence ("settles back after", etc.)
// moved into each chip's tooltip. The notifications feed still carries
// the verbose announcement.
const EventLine = ({ event }) => {
  const minutesLeft = Math.max(
    1,
    Math.round((new Date(event.ends_at).getTime() - Date.now()) / 60000)
  );
  const minutesText = `~${minutesLeft} more minute${minutesLeft === 1 ? "" : "s"}`;

  // Bounties boost one regular mission's credit reward; merchants discount
  // one equipment category. Both ride the same GameEvent rows as price
  // events, so they arrive through the same feed with their own kind.
  if (event.kind === "bounty") {
    return (
      <div
        className="tx-bounty"
        title={`Bounty: ${event.multiplier}x credit reward on ${event.category} for ${minutesText}`}
      >
        ⭐ {event.category} ×{event.multiplier} · {minutesLeft}m
      </div>
    );
  }
  if (event.kind === "merchant") {
    const off = Math.round((1 - event.multiplier) * 100);
    return (
      <div
        className="tx-merchant"
        title={`Merchant: ${event.category} gear ${off}% off for ${minutesText}`}
      >
        🛒 {event.category} −{off}% · {minutesLeft}m
      </div>
    );
  }

  const pct = Math.round(Math.abs(event.multiplier - 1) * 100);
  const isSpike = event.multiplier > 1;

  // The countdown is a real trading window - the multiplier stops
  // applying at zero, and the price settles back after.
  return (
    <div
      className={isSpike ? "tx-price-up" : "tx-price-down"}
      title={`${KIND_LABEL[event.kind] || event.kind}: ${event.category} ${
        isSpike ? "+" : "-"
      }${pct}% for ${minutesText} — settles back after`}
    >
      ⚡ {event.category} {isSpike ? "+" : "−"}
      {pct}% · {minutesLeft}m
    </div>
  );
};

// Renders every live event, not just the newest. Events are scoped one per
// category, so several can legitimately run at once.
const ActiveEventBanner = ({ events }) => {
  const { store } = useContext(Context);
  const { player, gameData } = store;

  // Price events target one item; hide them for items the player hasn't
  // unlocked and doesn't hold (same rule as the price feed). Bounties on
  // missions above the player's level are hidden too - "aspirational" was
  // the design intent, playtesting called it noise. Merchant gear sales
  // aren't level-locked at all.
  const rankOf = (itemName) => {
    for (const items of Object.values(gameData.items || {})) {
      if (items[itemName]) return items[itemName].Rank;
    }
    return null;
  };
  const visible = (events || []).filter((event) => {
    if (event.kind === "bounty") {
      const mission = (gameData.missions || {})[event.category];
      return !mission || mission.Rank <= player.level;
    }
    if (event.kind !== "price_spike" && event.kind !== "price_crash")
      return true;
    const rank = rankOf(event.category);
    if (rank == null) return true;
    const held = (player.inventory?.[event.category]?.quantity || 0) > 0;
    return rank <= player.level || held;
  });

  if (visible.length === 0) return null;

  return (
    <div className="col-12 text-center">
      {visible.map((event) => (
        <EventLine key={event.id} event={event} />
      ))}
    </div>
  );
};

export default ActiveEventBanner;
