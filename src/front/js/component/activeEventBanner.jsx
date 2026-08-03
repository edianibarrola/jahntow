import React from "react";

const KIND_LABEL = {
  price_spike: "Price Spike",
  price_crash: "Price Crash",
};

const ActiveEventBanner = ({ event }) => {
  if (!event) return null;

  const minutesLeft = Math.max(
    1,
    Math.round((new Date(event.ends_at).getTime() - Date.now()) / 60000)
  );
  const pct = Math.round(Math.abs(event.multiplier - 1) * 100);
  const isSpike = event.multiplier > 1;
  const direction = isSpike ? "+" : "-";

  return (
    <div className={`col-12 text-center ${isSpike ? "tx-price-up" : "tx-price-down"}`}>
      ⚡ {KIND_LABEL[event.kind] || event.kind}: {event.category} {direction}
      {pct}% for ~{minutesLeft} more minute{minutesLeft === 1 ? "" : "s"}
    </div>
  );
};

export default ActiveEventBanner;
