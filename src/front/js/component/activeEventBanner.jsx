import React from "react";

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

  return (
    <div className={isSpike ? "tx-price-up" : "tx-price-down"}>
      ⚡ {KIND_LABEL[event.kind] || event.kind}: {event.category} {isSpike ? "+" : "-"}
      {pct}% for {minutesText}
    </div>
  );
};

// Renders every live event, not just the newest. Events are scoped one per
// category, so several can legitimately run at once.
const ActiveEventBanner = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="col-12 text-center">
      {events.map((event) => (
        <EventLine key={event.id} event={event} />
      ))}
    </div>
  );
};

export default ActiveEventBanner;
