import React, { useContext, useEffect, useState } from "react";
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
    setVisibleMessage(latest);
    const timer = setTimeout(() => setVisibleMessage(null), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [latest]);

  if (!visibleMessage) return null;

  return (
    <div className="activity-toast holo" role="status">
      {visibleMessage}
    </div>
  );
};

export default ActivityToast;
