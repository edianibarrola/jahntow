import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Context } from "../store/appContext";

const VISIBLE_MS = 4500;

// Shows entries from store.transactions as brief toasts, regardless of
// which tab is active - so a mission/buy/sell/upgrade result is always
// noticed immediately, not just visible if you happen to be on the Market
// tab (where the full Recent Activity log lives). Each toast is stacked
// independently rather than overwriting whatever's already showing, so a
// burst of events (a mission chain, several quick trades) can't hide an
// earlier one - e.g. a failure toast getting silently replaced by an
// unrelated success toast a moment later.
const ActivityToast = () => {
  const { store } = useContext(Context);
  const latest = store.transactions[0];
  const [toasts, setToasts] = useState([]);
  // The activity log is now persisted across reloads, so on first mount
  // "latest" may already be yesterday's last transaction, not something
  // that just happened. Skip toasting it once so a fresh page load
  // doesn't pop a stale result; any genuinely new entry after that toasts
  // normally. Captured up front so the skip only ever applies to that one
  // pre-existing id - in a browser with no persisted history yet (nothing
  // to skip), the very first live transaction must still toast.
  const isFirstRun = useRef(true);
  const initialLatestId = useRef(latest?.id);
  // Each toast's dismiss timer is independent of the others, so pending
  // timers are only ever torn down on unmount - not whenever a new
  // transaction arrives, which would cancel earlier toasts' own removal.
  const timersRef = useRef(new Map());

  useEffect(() => {
    if (!latest) return;
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (latest.id === initialLatestId.current) return;
    }
    const toast = { id: latest.id, message: latest.message, type: latest.type || "info" };
    setToasts((prev) => [...prev, toast]);
    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      timersRef.current.delete(toast.id);
    }, VISIBLE_MS);
    timersRef.current.set(toast.id, timer);
    // Keyed on the transaction's id, not its text: two consecutive events
    // with identical wording (e.g. failing the same mission twice) still
    // need their own toast and timer each time.
  }, [latest?.id]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  if (toasts.length === 0) return null;

  // Rendered via a portal straight onto <body>, bypassing the component
  // tree entirely. Several ancestors (e.g. .holobg's backdrop-filter) use
  // CSS properties that create a new "containing block" for descendant
  // position:fixed elements in modern browsers - so a fixed toast nested
  // inside one of them ends up anchored to that scrolling container
  // instead of the actual viewport, and disappears above the fold as soon
  // as the page is scrolled. A portal sidesteps that entirely.
  return createPortal(
    <div className="activity-toast-stack">
      {toasts.map((t) => (
        <div key={t.id} className={`activity-toast holo tx-${t.type}`} role="status">
          {t.message}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ActivityToast;
