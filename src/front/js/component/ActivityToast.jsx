import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Context } from "../store/appContext";

const VISIBLE_MS = 4500;

// Shows entries from store.transactions as brief toasts, regardless of
// which tab is active - so a mission/buy/sell/upgrade result is always
// noticed immediately, not just visible if you happen to be on the Market
// tab (where the full Recent Activity log lives). Each toast is stacked
// independently rather than overwriting whatever's already showing, so a
// burst of events (a mission chain, several quick trades, or two entries
// queued synchronously in the same action callback) can't hide an earlier
// one - e.g. a failure toast getting silently replaced by an unrelated
// success toast a moment later.
const ActivityToast = () => {
  const { store } = useContext(Context);
  const [toasts, setToasts] = useState([]);
  const seenIds = useRef(new Set());
  // Each toast's dismiss timer is independent of the others, so pending
  // timers are only ever torn down on unmount - not whenever another
  // transaction arrives, which would cancel earlier toasts' own removal.
  const timersRef = useRef(new Map());

  useEffect(() => {
    // Walk from the newest entry until hitting one already processed, so
    // every genuinely new entry gets its own toast - not just the single
    // latest one. This matters when two entries are appended synchronously
    // in the same callback (e.g. a login-streak toast and an
    // offline-credits toast queued back to back): React batches that into
    // one re-render, so reacting only to "the latest id changed" would
    // show just the second and silently drop the first.
    const fresh = [];
    for (const t of store.transactions) {
      if (seenIds.current.has(t.id)) break;
      seenIds.current.add(t.id);
      // "historical" entries came from fetchActivityLog() syncing in
      // history from another device/session (or this session's own
      // pre-existing history on load) - not something that just happened
      // in front of the player, so they populate the Recent Activity list
      // without ever toasting.
      if (!t.historical) fresh.push(t);
    }
    if (fresh.length === 0) return;

    fresh.reverse().forEach((t) => {
      const toast = { id: t.id, message: t.message, type: t.type || "info" };
      setToasts((prev) => [...prev, toast]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== toast.id));
        timersRef.current.delete(toast.id);
      }, VISIBLE_MS);
      timersRef.current.set(toast.id, timer);
    });
  }, [store.transactions]);

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
