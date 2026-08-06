import React, { useContext } from "react";
import { Context } from "../store/appContext";

const KIND_LABEL = {
  price_spike: "Price Spike",
  price_crash: "Price Crash",
};

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
      <div className="tx-bounty">
        ⭐ Bounty: {event.multiplier}x reward on {event.category} for {minutesText}
      </div>
    );
  }
  if (event.kind === "merchant") {
    const off = Math.round((1 - event.multiplier) * 100);
    return (
      <div className="tx-merchant">
        🛒 Merchant: {event.category} gear {off}% off for {minutesText}
      </div>
    );
  }

  const pct = Math.round(Math.abs(event.multiplier - 1) * 100);
  const isSpike = event.multiplier > 1;

  // "settles back after": the countdown is a real trading window - the
  // multiplier stops applying at zero - and playtesting showed that
  // without saying so it read as decorative.
  return (
    <div className={isSpike ? "tx-price-up" : "tx-price-down"}>
      ⚡ {KIND_LABEL[event.kind] || event.kind}: {event.category} {isSpike ? "+" : "-"}
      {pct}% for {minutesText} — settles back after
    </div>
  );
};

// Renders every live event, not just the newest. Events are scoped one per
// category, so several can legitimately run at once.
const ActiveEventBanner = ({ events }) => {
  const { store } = useContext(Context);
  const { player, gameData } = store;

  // Price events target one item; hide them for items the player hasn't
  // unlocked and doesn't hold (same rule as the price feed). Bounties stay
  // visible even above level - aspirational by design - and merchant gear
  // sales aren't level-locked at all.
  const rankOf = (itemName) => {
    for (const items of Object.values(gameData.items || {})) {
      if (items[itemName]) return items[itemName].Rank;
    }
    return null;
  };
  const visible = (events || []).filter((event) => {
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
