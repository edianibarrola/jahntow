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
  const pct = Math.round(Math.abs(event.multiplier - 1) * 100);
  const isSpike = event.multiplier > 1;

  return (
    <div className={isSpike ? "tx-price-up" : "tx-price-down"}>
      ⚡ {KIND_LABEL[event.kind] || event.kind}: {event.category} {isSpike ? "+" : "-"}
      {pct}% for ~{minutesLeft} more minute{minutesLeft === 1 ? "" : "s"}
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
