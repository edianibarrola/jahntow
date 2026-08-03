import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

// Groups the granular per-transaction types into the handful of buckets a
// player would actually think to filter by, rather than one dropdown
// option per exact type.
const FILTERS = {
  all: { label: "All Activity", types: null },
  trading: { label: "Trading (Buy/Sell)", types: ["buy", "sell"] },
  missions: {
    label: "Missions",
    types: ["mission-success", "mission-fail"],
  },
  purchases: {
    label: "Purchases (Equipment/Property/Upgrades)",
    types: ["property", "upgrade", "recovery"],
  },
  errors: { label: "Errors", types: ["error"] },
  other: { label: "Other", types: ["info"] },
};

const TransactionsComponent = () => {
  const { store } = useContext(Context);
  const { transactions } = store;
  const [filter, setFilter] = useState("all");

  const allowedTypes = FILTERS[filter].types;
  const visibleTransactions = allowedTypes
    ? transactions.filter((transaction) =>
        allowedTypes.includes(transaction.type || "info")
      )
    : transactions;

  return (
    <div className="scrolldiv holo">
      <div>
        <h2>Recent Activity:</h2>
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="mb-2"
        >
          {Object.entries(FILTERS).map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <ul className="activity-list">
          {visibleTransactions.length === 0 && (
            <li className="tx-info">Nothing here yet.</li>
          )}
          {visibleTransactions.map((transaction) => (
            <li key={transaction.id} className={`tx-${transaction.type || "info"}`}>
              {transaction.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionsComponent;
