import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [visibleType, setVisibleType] = useState("info");
  const [extraCount, setExtraCount] = useState(0);
  // The activity log is now persisted across reloads, so on first mount
  // "latest" may already be yesterday's last transaction, not something
  // that just happened. Skip toasting it once so a fresh page load
  // doesn't pop a stale result; any genuinely new entry after that toasts
  // normally. Captured up front so the skip only ever applies to that one
  // pre-existing id - in a browser with no persisted history yet (nothing
  // to skip), the very first live transaction must still toast.
  const isFirstRun = useRef(true);
  const initialLatestId = useRef(latest?.id);
  // True while a toast is on screen (timer hasn't fired yet). Read at the
  // start of the next effect run to tell "a new event arrived while the
  // last toast was still showing" apart from "the last toast had already
  // faded" - the former bumps the +N counter instead of resetting it.
  const isActiveRef = useRef(false);

  useEffect(() => {
    if (!latest) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (latest.id === initialLatestId.current) return;
    }
    setExtraCount((prev) => (isActiveRef.current ? prev + 1 : 0));
    setVisibleMessage(latest.message);
    setVisibleType(latest.type || "info");
    isActiveRef.current = true;
    const timer = setTimeout(() => {
      setVisibleMessage(null);
      isActiveRef.current = false;
    }, VISIBLE_MS);
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
    <div
      className={`activity-toast holo tx-${visibleType}`}
      role="status"
    >
      {visibleMessage}
      {extraCount > 0 && (
        <span className="activity-toast-count">+{extraCount} more</span>
      )}
    </div>,
    document.body
  );
};

export default ActivityToast;
