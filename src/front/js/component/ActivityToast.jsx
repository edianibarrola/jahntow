import React, { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Context } from "../store/appContext";

const VISIBLE_MS = 4500;

// Shows the most recent entry from store.transactions as a brief toast,
// regardless of which tab is active - so a mission/buy/sell/upgrade result
// is always noticed immediately, not just visible if you happen to be on
// the Market tab (where the full Recent Activity log lives).
const ActivityToast = () => {
  const { store } = useContext(Context);
  const latest = store.transactions[0];
  const [visibleMessage, setVisibleMessage] = useState(null);

  useEffect(() => {
    if (!latest) return;
    setVisibleMessage(latest.message);
    const timer = setTimeout(() => setVisibleMessage(null), VISIBLE_MS);
    return () => clearTimeout(timer);
    // Keyed on the transaction's id, not its text: two consecutive events
    // with identical wording (e.g. failing the same mission twice) still
    // need to reset the timer and re-show the toast each time.
  }, [latest?.id]);

  if (!visibleMessage) return null;

  // Rendered via a portal straight onto <body>, bypassing the component
  // tree entirely. Several ancestors (e.g. .holobg's backdrop-filter) use
  // CSS properties that create a new "containing block" for descendant
  // position:fixed elements in modern browsers - so a fixed toast nested
  // inside one of them ends up anchored to that scrolling container
  // instead of the actual viewport, and disappears above the fold as soon
  // as the page is scrolled. A portal sidesteps that entirely.
  return createPortal(
    <div className="activity-toast holo" role="status">
      {visibleMessage}
    </div>,
    document.body
  );
};

export default ActivityToast;
